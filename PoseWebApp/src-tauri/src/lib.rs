use std::collections::HashMap;
use std::fs;
use std::sync::{Arc, Mutex};
use tauri::{Emitter, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};
use serde::{Deserialize, Serialize};

// ─── BLE imports ─────────────────────────────────────────────────────────────
use btleplug::api::{Central, Manager as BtManager, Peripheral as BtPeripheral, ScanFilter, WriteType};
use btleplug::platform::{Adapter, Manager as BleManager, Peripheral};
use futures::stream::StreamExt;
use uuid::Uuid;

// ─── Pose server process state ───────────────────────────────────────────────

struct PoseServerState {
    process: Arc<Mutex<Option<std::process::Child>>>,
}

#[tauri::command]
async fn launch_pose_server(
    app: tauri::AppHandle,
    state: tauri::State<'_, PoseServerState>,
) -> Result<(), String> {
    // If a process exists, check whether it is still running.
    {
        let mut guard = state.process.lock().map_err(|e| e.to_string())?;
        if let Some(ref mut child) = *guard {
            match child.try_wait() {
                Ok(None) => return Ok(()), // still alive
                _ => {}                   // exited or error — fall through to restart
            }
        }
        *guard = None;
    }

    // ── Locate pose_server.py ────────────────────────────────────────────────
    // Try 1: bundled resource directory (production / tauri build)
    // Try 2: compile-time workspace path (tauri dev)
    let resource_script = app
        .path()
        .resource_dir()
        .map(|d| d.join("pose_server.py"))
        .unwrap_or_default();

    let dev_script = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../pose-server/pose_server.py");

    let script = if resource_script.exists() {
        resource_script
    } else if dev_script.exists() {
        dev_script
    } else {
        return Err(format!(
            "pose_server.py not found (tried {:?} and {:?}). \
             Check that pose-server/pose_server.py exists in the project.",
            resource_script, dev_script
        ));
    };

    let script = script
        .canonicalize()
        .unwrap_or_else(|_| script.clone());

    if !script.exists() {
        return Err(format!(
            "pose_server.py not found at {:?}. Run `pip install ultralytics websockets opencv-python` in the correct Python env.",
            script
        ));
    }

    // ── Find the right Python executable ────────────────────────────────────
    // Priority:
    //   1. pose-server/venv — computed from the COMPILE-TIME manifest path so
    //      it always points to the source tree, not the runtime resource dir
    //      (which is a Tauri staging temp in dev mode and lacks the venv).
    //   2. Homebrew Python (Apple Silicon / Intel)
    //   3. MacPorts / system Python (fallback)
    // GUI apps on macOS only get /usr/bin:/bin in PATH, so we must probe
    // absolute paths for anything installed via Homebrew / venv.
    let venv_python = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../pose-server/venv/bin/python3");

    // Build the candidate list, checking absolute paths for existence
    let python: String = {
        if venv_python.exists() {
            venv_python.to_string_lossy().to_string()
        } else {
            let system_candidates = [
                "/opt/homebrew/bin/python3",  // macOS Homebrew (Apple Silicon)
                "/usr/local/bin/python3",     // macOS Homebrew (Intel)
                "/opt/local/bin/python3",     // MacPorts
                "/usr/bin/python3",           // system Python
            ];
            system_candidates
                .iter()
                .find(|&&p| std::path::Path::new(p).exists())
                .map(|&p| p.to_string())
                .unwrap_or_else(|| "python3".to_string())
        }
    };

    // Augment PATH so Python subprocesses (e.g. YOLO) can find system libs
    let path_env = std::env::var("PATH").unwrap_or_default();
    let augmented_path = format!(
        "/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:{}",
        path_env
    );

    // ── Spawn ────────────────────────────────────────────────────────────────
    let mut child = std::process::Command::new(&python)
        .arg(&script)
        .env("PATH", &augmented_path)
        .env("POSE_WS_HOST", "localhost")
        .env("POSE_WS_PORT", "8765")
        // Redirect stdout/stderr to the terminal so errors are visible in dev
        .stdout(std::process::Stdio::inherit())
        .stderr(std::process::Stdio::inherit())
        .spawn()
        .map_err(|e| format!(
            "Failed to spawn '{}': {}. Is Python 3 installed?", python, e
        ))?;

    // ── Quick-exit check (crashes on import / missing deps show up here) ─────
    // Give Python ~1 s to load imports; if it dies before that the deps are missing.
    std::thread::sleep(std::time::Duration::from_millis(1000));
    match child.try_wait() {
        Ok(Some(status)) => {
            return Err(format!(
                "Pose server exited immediately ({}). \
                 Make sure ultralytics, websockets, and opencv-python are installed \
                 for Python at '{}'.",
                status, python
            ));
        }
        Ok(None) => {} // still running — good
        Err(e) => return Err(format!("Failed to poll pose server process: {e}")),
    }

    let mut guard = state.process.lock().map_err(|e| e.to_string())?;
    *guard = Some(child);
    Ok(())
}

#[tauri::command]
fn stop_pose_server(state: tauri::State<'_, PoseServerState>) -> Result<(), String> {
    let mut guard = state.process.lock().map_err(|e| e.to_string())?;
    if let Some(mut child) = guard.take() {
        // Ignore kill errors — process may have already exited
        let _ = child.kill();
        let _ = child.wait();
    }
    Ok(())
}

// ─── Posture analysis types ──────────────────────────────────────────────────

#[derive(Deserialize)]
struct Landmark {
    x: f64,
    y: f64,
    #[allow(dead_code)]
    z: f64,
    visibility: Option<f64>,
}

#[derive(Serialize, Clone)]
struct MetricResult {
    id: String,
    name: String,
    value: f64,
    level: String,   // "optimal" | "warning" | "critical"
    status_code: u8, // 0 | 1 | 2
}

#[derive(Serialize, Clone)]
struct PostureAnalysis {
    posture_score: u8,
    metrics: Vec<MetricResult>,
    warnings: Vec<String>,
}

// ─── Per-camera EMA state ────────────────────────────────────────────────────
// Alpha 0.25: each new frame contributes 25%, history 75% → smooths over ~4-5 frames
const EMA_ALPHA: f64 = 0.25;

struct PostureState {
    // camera_index → running EMA score (f64 for precision)
    ema_scores: Mutex<HashMap<u32, f64>>,
}

impl PostureState {
    fn new() -> Self {
        PostureState { ema_scores: Mutex::new(HashMap::new()) }
    }
}

// ─── WebSocket bridge state (background score feed for menubar) ──────────────

struct WsBridgeState {
    task: Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl WsBridgeState {
    fn new() -> Self {
        WsBridgeState { task: Mutex::new(None) }
    }
}

// ─── Helper: minimum visibility threshold ───────────────────────────────────
const VIS_MIN: f64 = 0.3;

fn visible(lm: &Landmark) -> bool {
    lm.visibility.unwrap_or(1.0) >= VIS_MIN
}

// ─── Continuous zone classifier ──────────────────────────────────────────────
// Returns (level_str, status_code, continuous_score).
// Score interpolates within each zone to avoid abrupt jumps at zone boundaries:
//   optimal  zone → 100 down to 83
//   warning  zone → 80 down to 42
//   critical zone → 38 down to 8
fn classify(value: f64, zones: &[(f64, f64)]) -> (&'static str, u8, f64) {
    if zones.len() < 3 {
        return ("optimal", 0, 100.0);
    }
    let (_, opt_hi)   = zones[0];
    let (warn_lo, warn_hi) = zones[1];
    let (crit_lo, _)  = zones[2];

    if value <= opt_hi {
        let t = (value / (opt_hi + 1e-9)).clamp(0.0, 1.0);
        ("optimal", 0, 100.0 - t * 17.0)
    } else if value <= warn_hi {
        let t = ((value - warn_lo) / (warn_hi - warn_lo + 1e-9)).clamp(0.0, 1.0);
        ("warning", 1, 80.0 - t * 38.0)
    } else {
        let t = ((value - crit_lo) / (crit_lo + 1e-9)).clamp(0.0, 1.0);
        ("critical", 2, (38.0 - t * 30.0).max(8.0))
    }
}

// ─── Internal posture computation (no EMA, no state) ────────────────────────
/// Keypoint indices (COCO 17-point):
///   0 nose  1 left_eye  2 right_eye  3 left_ear  4 right_ear
///   5 left_shoulder  6 right_shoulder  11 left_hip  12 right_hip
fn compute_posture(landmarks: &[Landmark]) -> PostureAnalysis {
    let mut metrics: Vec<MetricResult> = Vec::new();
    let mut warnings: Vec<String> = Vec::new();
    let mut metric_scores: Vec<f64> = Vec::new();

    // ── 1. Head Tilt Roll ────────────────────────────────────────────────────
    if landmarks.len() > 2 {
        let le = &landmarks[1];
        let re = &landmarks[2];
        if visible(le) && visible(re) {
            let dx = (re.x - le.x).abs();
            let dy = (re.y - le.y).abs();
            let angle_deg = dy.atan2(dx).to_degrees();
            let (level, code, score) = classify(angle_deg, &[(0.0, 5.0), (6.0, 12.0), (13.0, 90.0)]);
            if code > 0 {
                warnings.push(format!("Head tilt detected: {:.1}°", angle_deg));
            }
            metric_scores.push(score);
            metrics.push(MetricResult {
                id:          "head_tilt_roll".into(),
                name:        "Head Tilt (Roll)".into(),
                value:       (angle_deg * 100.0).round() / 100.0,
                level:       level.into(),
                status_code: code,
            });
        }
    }

    // ── 2. Forward Head Posture ──────────────────────────────────────────────
    if landmarks.len() > 5 {
        let ear = &landmarks[3];
        let sho = &landmarks[5];
        if visible(ear) && visible(sho) {
            let dx = (ear.x - sho.x).abs();
            let dy = (ear.y - sho.y).abs();
            let ratio = if dy > 1e-4 { dx / dy } else { 0.0 };
            let (level, code, score) = classify(ratio, &[(0.0, 0.25), (0.26, 0.45), (0.46, 2.0)]);
            if code > 0 {
                warnings.push(format!("Forward head posture: ratio {:.2}", ratio));
            }
            metric_scores.push(score);
            metrics.push(MetricResult {
                id:          "forward_head_posture".into(),
                name:        "Forward Head Posture".into(),
                value:       (ratio * 1000.0).round() / 1000.0,
                level:       level.into(),
                status_code: code,
            });
        }
    }

    // ── 3. Shoulder Asymmetry ────────────────────────────────────────────────
    if landmarks.len() > 6 {
        let ls = &landmarks[5];
        let rs = &landmarks[6];
        if visible(ls) && visible(rs) {
            let dx = rs.x - ls.x;
            let dy = (rs.y - ls.y).abs();
            let dist = (dx * dx + dy * dy).sqrt();
            let ratio = if dist > 1e-4 { dy / dist } else { 0.0 };
            let (level, code, score) = classify(ratio, &[(0.0, 0.05), (0.06, 0.15), (0.16, 1.0)]);
            if code > 0 {
                warnings.push(format!("Shoulder asymmetry: ratio {:.2}", ratio));
            }
            metric_scores.push(score);
            metrics.push(MetricResult {
                id:          "shoulder_asymmetry".into(),
                name:        "Shoulder Asymmetry".into(),
                value:       (ratio * 1000.0).round() / 1000.0,
                level:       level.into(),
                status_code: code,
            });
        }
    }

    let posture_score = if metric_scores.is_empty() {
        0u8
    } else {
        let avg = metric_scores.iter().sum::<f64>() / metric_scores.len() as f64;
        avg.round().clamp(0.0, 100.0) as u8
    };

    PostureAnalysis { posture_score, metrics, warnings }
}

// ─── analyze_posture Tauri command (single camera) ───────────────────────────
#[tauri::command]
fn analyze_posture(landmarks: Vec<Landmark>) -> PostureAnalysis {
    compute_posture(&landmarks)
}

// ─── Multi-camera fusion with per-camera EMA ─────────────────────────────────

#[derive(Deserialize)]
struct CameraData {
    camera_index: u32,
    landmarks: Vec<Landmark>,
}

/// For each camera: compute raw posture score → apply per-camera EMA.
/// Final score = visibility-weighted average of smoothed per-camera scores.
/// Metrics come from fused landmark analysis so they reflect the combined view.
#[tauri::command]
fn analyze_multi_camera(
    cameras: Vec<CameraData>,
    state: tauri::State<'_, PostureState>,
) -> PostureAnalysis {
    if cameras.is_empty() {
        return PostureAnalysis { posture_score: 0, metrics: vec![], warnings: vec![] };
    }

    // Step 1: per-camera raw score → EMA → collect (smoothed_score, visible_kpts)
    let mut cam_smoothed: Vec<(f64, usize)> = Vec::with_capacity(cameras.len());
    {
        let mut emas = state.ema_scores.lock().unwrap_or_else(|p| p.into_inner());
        for cam in &cameras {
            let raw = compute_posture(&cam.landmarks).posture_score as f64;
            let visible_kpts = cam.landmarks.iter()
                .filter(|lm| lm.visibility.unwrap_or(1.0) >= VIS_MIN)
                .count();

            let ema = emas.entry(cam.camera_index)
                .and_modify(|prev| *prev = EMA_ALPHA * raw + (1.0 - EMA_ALPHA) * *prev)
                .or_insert(raw);

            cam_smoothed.push((*ema, visible_kpts));
        }
    }

    // Step 2: visibility-weighted average of smoothed scores
    let total_vis: usize = cam_smoothed.iter().map(|(_, v)| *v).sum();
    let fused_score = if total_vis == 0 {
        cam_smoothed.iter().map(|(s, _)| s).sum::<f64>() / cam_smoothed.len() as f64
    } else {
        cam_smoothed.iter().map(|(s, v)| s * *v as f64).sum::<f64>() / total_vis as f64
    };

    // Step 3: metrics from fused landmark analysis
    let metrics_source = if cameras.len() == 1 {
        compute_posture(&cameras[0].landmarks)
    } else {
        let max_kpts = cameras.iter().map(|c| c.landmarks.len()).max().unwrap_or(0);
        let mut fused: Vec<Landmark> = Vec::with_capacity(max_kpts);
        for i in 0..max_kpts {
            let mut sum_x = 0.0_f64;
            let mut sum_y = 0.0_f64;
            let mut sum_z = 0.0_f64;
            let mut sum_w = 0.0_f64;
            for cam in &cameras {
                if i < cam.landmarks.len() {
                    let lm = &cam.landmarks[i];
                    let w = lm.visibility.unwrap_or(1.0).max(0.0);
                    sum_x += lm.x * w;
                    sum_y += lm.y * w;
                    sum_z += lm.z * w;
                    sum_w += w;
                }
            }
            let (x, y, z, v) = if sum_w > 1e-9 {
                (sum_x / sum_w, sum_y / sum_w, sum_z / sum_w, sum_w / cameras.len() as f64)
            } else {
                (0.0, 0.0, 0.0, 0.0)
            };
            fused.push(Landmark { x, y, z, visibility: Some(v) });
        }
        compute_posture(&fused)
    };

    PostureAnalysis {
        posture_score: fused_score.round().clamp(0.0, 100.0) as u8,
        metrics: metrics_source.metrics,
        warnings: metrics_source.warnings,
    }
}

// ─── WebSocket bridge commands ────────────────────────────────────────────────

#[tauri::command]
async fn start_ws_bridge(
    app: tauri::AppHandle,
    ws_bridge: tauri::State<'_, WsBridgeState>,
) -> Result<(), String> {
    if let Ok(mut t) = ws_bridge.task.lock() {
        if let Some(old) = t.take() {
            old.abort();
        }
    }

    let app_task = app.clone();
    let handle = tokio::spawn(async move {
        let Ok((mut ws, _)) = tokio_tungstenite::connect_async("ws://127.0.0.1:8765").await
        else {
            return;
        };
        while let Some(Ok(msg)) = ws.next().await {
            if let tokio_tungstenite::tungstenite::Message::Text(text) = msg {
                if let Ok(cam) = serde_json::from_str::<CameraData>(&text) {
                    if !cam.landmarks.is_empty() {
                        let analysis = compute_posture(&cam.landmarks);
                        app_task.emit("posefix:score-update", analysis).ok();
                    }
                }
            }
        }
    });

    if let Ok(mut t) = ws_bridge.task.lock() {
        *t = Some(handle);
    }
    Ok(())
}

#[tauri::command]
fn stop_ws_bridge(ws_bridge: tauri::State<'_, WsBridgeState>) {
    if let Ok(mut t) = ws_bridge.task.lock() {
        if let Some(handle) = t.take() {
            handle.abort();
        }
    }
}

#[tauri::command]
fn save_avatar(path: String, data: Vec<u8>) -> Result<(), String> {
    if let Some(parent) = std::path::Path::new(&path).parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, &data).map_err(|e| e.to_string())
}

// ─── BLE constants ───────────────────────────────────────────────────────────

const POSEFIX_SERVICE_UUID: &str = "15464a70-4048-45e7-9069-b9d37aaea15e";
const POSEFIX_TX_UUID: &str      = "1fdfc708-b552-4d80-bd1c-761f14d009fe";
const POSEFIX_RX_UUID: &str      = "2b3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f";
const CMD_START: u8 = 0x01;
const CMD_STOP:  u8 = 0x02;

use tauri::tray::{TrayIconBuilder, TrayIconEvent, MouseButtonState};
use tauri::menu::{Menu, MenuItem};
use tauri_plugin_notification::NotificationExt;

// ─── BLE managed state ───────────────────────────────────────────────────────

struct BleState {
    manager:     Mutex<Option<BleManager>>,
    adapter:     Mutex<Option<Adapter>>,
    peripheral:  Mutex<Option<Peripheral>>,
    task_handle: Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl BleState {
    fn new() -> Self {
        BleState {
            manager:     Mutex::new(None),
            adapter:     Mutex::new(None),
            peripheral:  Mutex::new(None),
            task_handle: Mutex::new(None),
        }
    }
}

// ─── Health & Breaks state ───────────────────────────────────────────────────

struct AppHealthState {
    session_start:   Mutex<std::time::Instant>,
    session_active:  Mutex<bool>,
    break_interval:  Mutex<u64>, // minutes
    break_duration:  Mutex<u64>, // minutes
    last_break:      Mutex<std::time::Instant>,
    mute:            Mutex<bool>,
    alert_type:       Mutex<String>,
}

impl AppHealthState {
    fn new() -> Self {
        AppHealthState {
            session_start:   Mutex::new(std::time::Instant::now()),
            session_active:  Mutex::new(false),
            break_interval:  Mutex::new(60),
            break_duration:  Mutex::new(5),
            last_break:      Mutex::new(std::time::Instant::now()),
            mute:            Mutex::new(false),
            alert_type:       Mutex::new("both".to_string()),
        }
    }
}

// ─── BLE serializable types ──────────────────────────────────────────────────

#[derive(Serialize, Clone)]
struct BleScanResult {
    address: String,
    name:    String,
    rssi:    Option<i16>,
}

#[derive(Serialize, Clone)]
struct SensorAngle {
    pitch: f32,
    roll:  f32,
    yaw:   f32,
}

#[derive(Serialize, Clone)]
struct BleSensorEvent {
    nonce: u32,
    head:  Option<SensorAngle>,
    back:  Option<SensorAngle>,
}

// ─── Payload parser (matches #pragma pack(1) C struct) ───────────────────────
// Payload layout:
//   [0..3]  nonce        u32 LE
//   [4]     head.id      u8   (0 = head present, 0xFF = absent)
//   [5..6]  head.pitch   u16 LE  (angle * 100)
//   [7..8]  head.roll    u16 LE
//   [9..10] head.yaw     u16 LE
//   [11]    back.id      u8   (1 = back present, 0xFF = absent)
//   [12..13] back.pitch  u16 LE
//   [14..15] back.roll   u16 LE
//   [16..17] back.yaw    u16 LE
//   [18]    status       u8
//   [19..26] tag         [u8; 8]
fn parse_payload(data: &[u8]) -> Option<BleSensorEvent> {
    if data.len() < 18 { return None; }

    let nonce = u32::from_le_bytes([data[0], data[1], data[2], data[3]]);

    let head = if data[4] == 0 {
        Some(SensorAngle {
            pitch: u16::from_le_bytes([data[5],  data[6]])  as f32 / 100.0,
            roll:  u16::from_le_bytes([data[7],  data[8]])  as f32 / 100.0,
            yaw:   u16::from_le_bytes([data[9],  data[10]]) as f32 / 100.0,
        })
    } else {
        None
    };

    let back = if data[11] == 1 {
        Some(SensorAngle {
            pitch: u16::from_le_bytes([data[12], data[13]]) as f32 / 100.0,
            roll:  u16::from_le_bytes([data[14], data[15]]) as f32 / 100.0,
            yaw:   u16::from_le_bytes([data[16], data[17]]) as f32 / 100.0,
        })
    } else {
        None
    };

    Some(BleSensorEvent { nonce, head, back })
}

// ─── BLE commands ─────────────────────────────────────────────────────────────

/// Scan for PoseFix BLE peripherals for 4 seconds.
/// Returns [{address, name, rssi}] for each found device.
#[tauri::command]
async fn ble_scan(state: tauri::State<'_, BleState>) -> Result<Vec<BleScanResult>, String> {
    // Run on a dedicated OS thread via spawn_blocking so that:
    //   1. CoreBluetooth (CBCentralManager) gets a proper run-loop context on macOS.
    //   2. ObjC exceptions / Rust panics that btleplug raises on unauthorised / BT-off
    //      are caught by catch_unwind instead of SIGABRTing the whole process.
    let handle = tokio::runtime::Handle::current();
    let task = tokio::task::spawn_blocking(move || {
        std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            handle.block_on(async {
                let manager = BleManager::new().await.map_err(|e| e.to_string())?;
                let adapters = manager.adapters().await.map_err(|e| e.to_string())?;
                let adapter = adapters.into_iter().next()
                    .ok_or_else(|| "No BLE adapter found".to_string())?;

                let svc_uuid = Uuid::try_parse(POSEFIX_SERVICE_UUID).unwrap();
                adapter
                    .start_scan(ScanFilter { services: vec![svc_uuid] })
                    .await
                    .map_err(|e| e.to_string())?;

                tokio::time::sleep(tokio::time::Duration::from_secs(4)).await;
                adapter.stop_scan().await.ok();

                let peripherals = adapter.peripherals().await.map_err(|e| e.to_string())?;
                let mut results = Vec::new();
                for p in &peripherals {
                    if let Ok(Some(props)) = p.properties().await {
                        results.push(BleScanResult {
                            address: p.id().to_string(),
                            name: props.local_name.unwrap_or_else(|| "PoseFix".to_string()),
                            rssi: props.rssi,
                        });
                    }
                }
                Ok::<(BleManager, Adapter, Vec<BleScanResult>), String>((manager, adapter, results))
            })
        }))
        .unwrap_or_else(|_| Err("BLE scan panicked (Bluetooth may be off or unauthorized)".to_string()))
    });

    let (manager, adapter, results) = task
        .await
        .map_err(|e| format!("BLE task join error: {e}"))??;

    *state.manager.lock().map_err(|e| e.to_string())? = Some(manager);
    *state.adapter.lock().map_err(|e| e.to_string())? = Some(adapter);
    Ok(results)
}

/// Connect to a PoseFix peripheral by address (UUID string on macOS).
/// Subscribes to the TX characteristic and spawns a background task that
/// emits `ble://sensor-data` events to the frontend.
#[tauri::command]
async fn ble_connect(
    address: String,
    app: tauri::AppHandle,
    state: tauri::State<'_, BleState>,
) -> Result<(), String> {
    // Tear down any existing connection
    {
        let mut h = state.task_handle.lock().map_err(|e| e.to_string())?;
        if let Some(h) = h.take() { h.abort(); }
    }
    {
        let prev = state.peripheral.lock().map_err(|e| e.to_string())?.take();
        if let Some(p) = prev { let _ = p.disconnect().await; }
    }

    let adapter = {
        let guard = state.adapter.lock().map_err(|e| e.to_string())?;
        guard.as_ref().ok_or("Run ble_scan first to get an adapter")?.clone()
    };

    let peripherals = adapter.peripherals().await.map_err(|e| e.to_string())?;
    let peripheral = peripherals
        .into_iter()
        .find(|p| p.id().to_string() == address)
        .ok_or("Peripheral not found — run ble_scan first")?;

    peripheral.connect().await.map_err(|e| format!("connect: {e}"))?;
    peripheral.discover_services().await.map_err(|e| format!("discover: {e}"))?;

    let tx_uuid = Uuid::try_parse(POSEFIX_TX_UUID).unwrap();
    let tx_char = peripheral
        .services()
        .into_iter()
        .flat_map(|s| s.characteristics.into_iter())
        .find(|c| c.uuid == tx_uuid)
        .ok_or("TX characteristic not found — check sensor firmware")?;

    peripheral.subscribe(&tx_char).await.map_err(|e| format!("subscribe: {e}"))?;

    // Clone peripheral for the notification task; store original
    let p_task = peripheral.clone();
    let app_task = app.clone();

    let handle = tokio::spawn(async move {
        if let Ok(mut stream) = p_task.notifications().await {
            while let Some(notif) = stream.next().await {
                if notif.uuid == tx_uuid {
                    if let Some(event) = parse_payload(&notif.value) {
                        let _ = app_task.emit("ble://sensor-data", event);
                    }
                }
            }
        }
        // Stream ended = disconnected
        let _ = app_task.emit("ble://status", serde_json::json!({ "connected": false, "address": "" }));
    });

    *state.peripheral.lock().map_err(|e| e.to_string())? = Some(peripheral);
    *state.task_handle.lock().map_err(|e| e.to_string())? = Some(handle);

    app.emit("ble://status", serde_json::json!({ "connected": true, "address": address })).ok();
    Ok(())
}

/// Send CMD_START (0x01) to the sensor — begins streaming Payload notifications.
#[tauri::command]
async fn ble_start(state: tauri::State<'_, BleState>) -> Result<(), String> {
    let peripheral = {
        let guard = state.peripheral.lock().map_err(|e| e.to_string())?;
        guard.as_ref().ok_or("Not connected")?.clone()
    };

    let rx_uuid = Uuid::try_parse(POSEFIX_RX_UUID).unwrap();
    let rx_char = peripheral
        .services()
        .into_iter()
        .flat_map(|s| s.characteristics.into_iter())
        .find(|c| c.uuid == rx_uuid)
        .ok_or("RX characteristic not found")?;

    peripheral
        .write(&rx_char, &[CMD_START], WriteType::WithoutResponse)
        .await
        .map_err(|e| e.to_string())
}

/// Send CMD_STOP (0x02) to the sensor — freezes streaming.
#[tauri::command]
async fn ble_stop(state: tauri::State<'_, BleState>) -> Result<(), String> {
    let peripheral = {
        let guard = state.peripheral.lock().map_err(|e| e.to_string())?;
        guard.as_ref().ok_or("Not connected")?.clone()
    };

    let rx_uuid = Uuid::try_parse(POSEFIX_RX_UUID).unwrap();
    let rx_char = peripheral
        .services()
        .into_iter()
        .flat_map(|s| s.characteristics.into_iter())
        .find(|c| c.uuid == rx_uuid)
        .ok_or("RX characteristic not found")?;

    peripheral
        .write(&rx_char, &[CMD_STOP], WriteType::WithoutResponse)
        .await
        .map_err(|e| e.to_string())
}

/// Disconnect from the current peripheral and stop the notification task.
#[tauri::command]
async fn ble_disconnect(
    app: tauri::AppHandle,
    state: tauri::State<'_, BleState>,
) -> Result<(), String> {
    {
        let mut h = state.task_handle.lock().map_err(|e| e.to_string())?;
        if let Some(h) = h.take() { h.abort(); }
    }
    let prev = state.peripheral.lock().map_err(|e| e.to_string())?.take();
    if let Some(p) = prev { let _ = p.disconnect().await; }

    app.emit("ble://status", serde_json::json!({ "connected": false, "address": "" })).ok();
    Ok(())
}

#[tauri::command]
fn set_session_active(
    active: bool,
    state: tauri::State<'_, AppHealthState>,
) {
    if let Ok(mut a) = state.session_active.lock() {
        *a = active;
    }
    if active {
        if let Ok(mut s) = state.session_start.lock() {
            *s = std::time::Instant::now();
        }
        if let Ok(mut lb) = state.last_break.lock() {
            *lb = std::time::Instant::now();
        }
    }
}

#[tauri::command]
fn update_health_settings(
    interval: u64,
    duration: u64,
    mute: bool,
    alert_type: String,
    state: tauri::State<'_, AppHealthState>,
) -> Result<(), String> {
    if let Ok(mut i) = state.break_interval.lock() {
        *i = interval;
    }
    if let Ok(mut d) = state.break_duration.lock() {
        *d = duration;
    }
    if let Ok(mut m) = state.mute.lock() {
        *m = mute;
    }
    if let Ok(mut at) = state.alert_type.lock() {
        *at = alert_type;
    }
    // Reset last break when settings change to avoid immediate trigger if interval was shortened
    if let Ok(mut lb) = state.last_break.lock() {
        *lb = std::time::Instant::now();
    }
    Ok(())
}

#[derive(Deserialize)]
struct AiRequest {
    provider: String,
    api_key: String,
    model: String,
    prompt: String,
    base_url: Option<String>, // for ollama custom host
}

#[tauri::command]
async fn call_ai(req: AiRequest) -> Result<String, String> {
    let client = reqwest::Client::new();

    match req.provider.as_str() {
        "openai" => {
            let res = client
                .post("https://api.openai.com/v1/chat/completions")
                .bearer_auth(&req.api_key)
                .json(&serde_json::json!({
                    "model": req.model,
                    "messages": [{"role": "user", "content": req.prompt}],
                    "max_tokens": 300
                }))
                .send().await.map_err(|e| e.to_string())?;
            let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
            Ok(body["choices"][0]["message"]["content"].as_str().unwrap_or("").to_string())
        }
        "anthropic" => {
            let res = client
                .post("https://api.anthropic.com/v1/messages")
                .header("x-api-key", &req.api_key)
                .header("anthropic-version", "2023-06-01")
                .json(&serde_json::json!({
                    "model": req.model,
                    "max_tokens": 300,
                    "messages": [{"role": "user", "content": req.prompt}]
                }))
                .send().await.map_err(|e| e.to_string())?;
            let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
            Ok(body["content"][0]["text"].as_str().unwrap_or("").to_string())
        }
        "gemini" => {
            let model = &req.model;
            let url = format!(
                "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={}",
                req.api_key
            );
            let res = client
                .post(&url)
                .json(&serde_json::json!({
                    "contents": [{"parts": [{"text": req.prompt}]}]
                }))
                .send().await.map_err(|e| e.to_string())?;
            let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
            Ok(body["candidates"][0]["content"]["parts"][0]["text"].as_str().unwrap_or("").to_string())
        }
        "ollama" => {
            let base = req.base_url.as_deref().unwrap_or("http://localhost:11434");
            if !base.starts_with("http://localhost") && !base.starts_with("http://127.0.0.1") {
                return Err("Ollama base URL must be a local address (localhost or 127.0.0.1)".to_string());
            }
            let res = client
                .post(format!("{base}/api/generate"))
                .json(&serde_json::json!({
                    "model": req.model,
                    "prompt": req.prompt,
                    "stream": false
                }))
                .send().await.map_err(|e| e.to_string())?;
            let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
            Ok(body["response"].as_str().unwrap_or("").to_string())
        }
        other => Err(format!("Unknown provider: {other}"))
    }
}

// ─── Simple utility commands ─────────────────────────────────────────────────

#[tauri::command]
fn quit_app(app: tauri::AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn hide_break_alert(app: tauri::AppHandle) {
    if let Some(win) = app.get_webview_window("break_alert") {
        let _ = win.hide();
    }
    for i in 0..8 {
        if let Some(win) = app.get_webview_window(&format!("break_overlay_{}", i)) {
            let _ = win.hide();
        }
    }
    app.emit("posefix:break-overlay-hide", ()).ok();
}

#[tauri::command]
fn show_main_window(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[tauri::command]
fn set_dock_icon_visible(visible: bool, app: tauri::AppHandle) {
    #[cfg(target_os = "macos")]
    {
        let policy = if visible {
            tauri::ActivationPolicy::Regular
        } else {
            tauri::ActivationPolicy::Accessory
        };
        let _ = app.set_activation_policy(policy);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // ─── v1: tablas base ───────────────────────────────────────────────
        Migration {
            version: 1,
            description: "create_users_table",
            sql: "
                CREATE TABLE IF NOT EXISTS users (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    username     TEXT    NOT NULL UNIQUE,
                    email        TEXT    NOT NULL UNIQUE,
                    profession   TEXT,
                    age          INTEGER,
                    avatar_path  TEXT,
                    posture_goal INTEGER NOT NULL DEFAULT 80,
                    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_user_sessions_table",
            sql: "
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    session_start TEXT    NOT NULL,
                    session_end   TEXT,
                    duration      INTEGER,
                    posture_score INTEGER,
                    warnings      INTEGER NOT NULL DEFAULT 0,
                    fatigue_score INTEGER,
                    eye_distance  REAL,
                    blink_rate    INTEGER,
                    sensor_data   TEXT
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_warnings_table",
            sql: "
                CREATE TABLE IF NOT EXISTS warnings (
                    id             INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id     INTEGER NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
                    warning_type   TEXT,
                    label          TEXT,
                    start          TEXT,
                    duration       INTEGER,
                    severity       INTEGER,
                    resolved       INTEGER NOT NULL DEFAULT 0,
                    resolved_after INTEGER
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_exercises_log_table",
            sql: "
                CREATE TABLE IF NOT EXISTS exercises_log (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    exercise     TEXT    NOT NULL,
                    duration     INTEGER,
                    completed_at TEXT    NOT NULL DEFAULT (datetime('now'))
                );
            ",
            kind: MigrationKind::Up,
        },
        // ─── v5: índices para queries frecuentes ───────────────────────────
        Migration {
            version: 5,
            description: "create_indexes",
            sql: "
                CREATE INDEX IF NOT EXISTS idx_sessions_user_id
                    ON user_sessions(user_id);
                CREATE INDEX IF NOT EXISTS idx_sessions_start
                    ON user_sessions(session_start);
                CREATE INDEX IF NOT EXISTS idx_warnings_session_id
                    ON warnings(session_id);
                CREATE INDEX IF NOT EXISTS idx_exercises_user_id
                    ON exercises_log(user_id);
            ",
            kind: MigrationKind::Up,
        },
        // ─── v6: views ─────────────────────────────────────────────────────
        Migration {
            version: 6,
            description: "create_session_summary_view",
            sql: "
                CREATE VIEW IF NOT EXISTS session_summary AS
                SELECT
                    s.id,
                    s.user_id,
                    s.session_start,
                    s.session_end,
                    s.duration,
                    s.posture_score,
                    s.warnings,
                    s.fatigue_score,
                    s.eye_distance,
                    CASE
                        WHEN s.posture_score >= 95 THEN 'EXCELLENT'
                        WHEN s.posture_score >= 80 THEN 'GOOD'
                        WHEN s.posture_score >= 60 THEN 'FAIR'
                        ELSE 'POOR'
                    END AS posture_label,
                    COUNT(w.id) AS total_warnings,
                    SUM(CASE WHEN w.resolved = 1 THEN 1 ELSE 0 END) AS resolved_warnings
                FROM user_sessions s
                LEFT JOIN warnings w ON w.session_id = s.id
                GROUP BY s.id;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "create_weekly_stats_view",
            sql: "
                CREATE VIEW IF NOT EXISTS weekly_stats AS
                SELECT
                    user_id,
                    DATE(session_start)       AS day,
                    ROUND(AVG(posture_score)) AS avg_score,
                    SUM(duration)             AS total_duration,
                    COUNT(*)                  AS session_count,
                    SUM(warnings)             AS total_warnings
                FROM user_sessions
                WHERE session_start >= DATE('now', '-7 days')
                GROUP BY user_id, DATE(session_start);
            ",
            kind: MigrationKind::Up,
        },
        // ─── v8: triggers ──────────────────────────────────────────────────
        Migration {
            version: 8,
            description: "create_close_open_sessions_trigger",
            sql: "
                CREATE TRIGGER IF NOT EXISTS close_open_sessions
                AFTER INSERT ON user_sessions
                BEGIN
                    UPDATE user_sessions
                    SET
                        session_end = datetime('now'),
                        duration    = 0
                    WHERE user_id    = NEW.user_id
                      AND session_end IS NULL
                      AND id         != NEW.id;
                END;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "create_warning_count_triggers",
            sql: "
                CREATE TRIGGER IF NOT EXISTS increment_warning_count
                AFTER INSERT ON warnings
                BEGIN
                    UPDATE user_sessions
                    SET warnings = warnings + 1
                    WHERE id = NEW.session_id;
                END;

                CREATE TRIGGER IF NOT EXISTS decrement_warning_count
                AFTER DELETE ON warnings
                BEGIN
                    UPDATE user_sessions
                    SET warnings = MAX(0, warnings - 1)
                    WHERE id = OLD.session_id;
                END;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "add_password_hash_to_users",
            sql: "ALTER TABLE users ADD COLUMN password_hash TEXT;",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 11,
            description: "add_full_name_to_users_and_copy_from_username",
            sql: "ALTER TABLE users ADD COLUMN full_name TEXT; UPDATE users SET full_name = username;",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 12,
            description: "expand_exercises_log_and_add_stats_view",
            sql: "
                ALTER TABLE exercises_log ADD COLUMN exercise_id TEXT;
                ALTER TABLE exercises_log ADD COLUMN category    TEXT;
                ALTER TABLE exercises_log ADD COLUMN difficulty  TEXT;
                ALTER TABLE exercises_log ADD COLUMN points      INTEGER NOT NULL DEFAULT 0;
                ALTER TABLE exercises_log ADD COLUMN source      TEXT;

                CREATE VIEW IF NOT EXISTS exercise_daily_stats AS
                SELECT
                    user_id,
                    DATE(completed_at)           AS day,
                    COUNT(*)                     AS exercise_count,
                    COALESCE(SUM(points), 0)     AS total_points,
                    COALESCE(SUM(duration), 0)   AS total_duration_min
                FROM exercises_log
                GROUP BY user_id, DATE(completed_at);
            ",
            kind: MigrationKind::Up,
        },
        // ─── v13: fix timezone — recreate view using localtime ─────────────
        Migration {
            version: 13,
            description: "fix_exercise_daily_stats_view_localtime",
            sql: "
                DROP VIEW IF EXISTS exercise_daily_stats;
                CREATE VIEW exercise_daily_stats AS
                SELECT
                    user_id,
                    DATE(completed_at, 'localtime')         AS day,
                    COUNT(*)                                AS exercise_count,
                    COALESCE(SUM(points), 0)                AS total_points,
                    COALESCE(SUM(duration), 0)              AS total_duration_min
                FROM exercises_log
                GROUP BY user_id, DATE(completed_at, 'localtime');
            ",
            kind: MigrationKind::Up,
        },
        // ─── v14: export history ───────────────────────────────────────────
        Migration {
            version: 14,
            description: "create_export_history_table",
            sql: "
                CREATE TABLE IF NOT EXISTS export_history (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    name       TEXT    NOT NULL,
                    format     TEXT    NOT NULL,
                    categories TEXT    NOT NULL,
                    start_date TEXT    NOT NULL,
                    end_date   TEXT    NOT NULL,
                    file_path  TEXT,
                    created_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
                );
                CREATE INDEX IF NOT EXISTS idx_export_history_user_id
                    ON export_history(user_id);
            ",
            kind: MigrationKind::Up,
        },
        // ─── v15: fix weekly_stats view — use localtime for day grouping ───
        // Previous version used DATE(session_start) without 'localtime', causing
        // sessions to be bucketed into the wrong day for UTC-offset users.
        // Also use localtime for the 7-day window filter.
        Migration {
            version: 15,
            description: "fix_weekly_stats_view_localtime",
            sql: "
                DROP VIEW IF EXISTS weekly_stats;
                CREATE VIEW weekly_stats AS
                SELECT
                    user_id,
                    DATE(session_start)       AS day,
                    ROUND(AVG(posture_score)) AS avg_score,
                    COALESCE(SUM(duration), 0) AS total_duration,
                    COUNT(*)                  AS session_count,
                    COALESCE(SUM(warnings), 0) AS total_warnings
                FROM user_sessions
                WHERE session_end IS NOT NULL
                  AND session_start >= DATE('now', '-7 days')
                GROUP BY user_id, DATE(session_start);
            ",
            kind: MigrationKind::Up,
        }
    ];

    let server_process: Arc<Mutex<Option<std::process::Child>>> = Arc::new(Mutex::new(None));
    let server_process_exit = Arc::clone(&server_process);

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .manage(PoseServerState { process: server_process })
        .manage(BleState::new())
        .manage(PostureState::new())
        .manage(AppHealthState::new())
        .manage(WsBridgeState::new())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:posefix.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            save_avatar,
            analyze_posture,
            analyze_multi_camera,
            call_ai,
            launch_pose_server,
            stop_pose_server,
            ble_scan,
            ble_connect,
            ble_start,
            ble_stop,
            ble_disconnect,
             update_health_settings,
             set_session_active,
             hide_break_alert,
             quit_app,
             show_main_window,
            set_dock_icon_visible,
            start_ws_bridge,
            stop_ws_bridge,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // ─── Tray Icon Setup ─────────────────────────────────────────────
            let tray_menu = Menu::with_items(
                app,
                &[
                    &MenuItem::with_id(app, "quit", "Quit PoseFix", true, None::<&str>)?,
                ],
            )?;

            let tray_icon = app.default_window_icon().cloned()
                .unwrap_or_else(|| tauri::image::Image::new_owned(
                    vec![100u8; 32 * 32 * 4], // gray RGBA fallback
                    32, 32,
                ));

            let tray = TrayIconBuilder::with_id("main")
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .icon(tray_icon)
                .on_menu_event(|app, event| {
                    if event.id.as_ref() == "quit" {
                        app.exit(0);
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { rect, button_state: MouseButtonState::Up, .. } = event {
                        let app = tray.app_handle();
                        if let Some(popup) = app.get_webview_window("menubar") {
                            if popup.is_visible().unwrap_or(false) {
                                let _ = popup.hide();
                            } else {
                                let scale = popup.scale_factor().unwrap_or(1.0);
                                let popup_w_phys = 320.0 * scale;

                                // rect fields are tauri::Position / tauri::Size enums
                                let (rx, ry) = match &rect.position {
                                    tauri::Position::Physical(p) => (p.x as f64, p.y as f64),
                                    tauri::Position::Logical(p) => (p.x * scale, p.y * scale),
                                };
                                let (rw, rh) = match &rect.size {
                                    tauri::Size::Physical(s) => (s.width as f64, s.height as f64),
                                    tauri::Size::Logical(s) => (s.width * scale, s.height * scale),
                                };

                                let x = ((rx + rw / 2.0 - popup_w_phys / 2.0) as i32).max(0);
                                let y = (ry + rh) as i32;

                                let _ = popup.set_position(tauri::Position::Physical(
                                    tauri::PhysicalPosition { x, y },
                                ));
                                let _ = popup.show();
                                let _ = popup.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;
            app.manage(tray);

            // Request notification permission so break alerts work on macOS
            {
                let app_handle_notif = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    let _ = app_handle_notif.notification().request_permission();
                });
            }

            // ─── Menubar popup: hide on blur ──────────────────────────────────
            if let Some(menubar_win) = app.get_webview_window("menubar") {
                let mb = menubar_win.clone();
                menubar_win.on_window_event(move |event| {
                    if let tauri::WindowEvent::Focused(false) = event {
                        let _ = mb.hide();
                    }
                });
            }

            // ─── Background Health Task ──────────────────────────────────────
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                loop {
                    tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                    let state = app_handle.state::<AppHealthState>();

                    let active = *state.session_active.lock().unwrap_or_else(|p| p.into_inner());
                    if !active {
                        continue;
                    }

                    let interval = *state.break_interval.lock().unwrap();
                    let time_since_break = {
                        let last = state.last_break.lock().unwrap();
                        last.elapsed().as_secs() / 60
                    };

                    // Check for break trigger
                    let muted = *state.mute.lock().unwrap_or_else(|p| p.into_inner());
                    if time_since_break >= interval {
                        let alert_type = state.alert_type.lock().unwrap_or_else(|p| p.into_inner()).clone();

                        // Non-intrusive: system notification
                        if (alert_type == "notification" || alert_type == "both") && !muted {
                            let _ = app_handle.notification()
                                .builder()
                                .title("Time for a break!")
                                .body(format!("You've been working for {} minutes. Take a {} minute break.", interval, *state.break_duration.lock().unwrap()))
                                .show();
                        }

                        // Intrusive: popup window with countdown + per-monitor dark overlays
                        if alert_type == "window" || alert_type == "both" {
                            let duration = *state.break_duration.lock().unwrap();

                            // Show break_alert FIRST so overlays don't bury it
                            if let Some(win) = app_handle.get_webview_window("break_alert") {
                                let _ = win.set_always_on_top(true);
                                let _ = win.center();
                                let _ = win.show();
                                let _ = win.set_focus();

                                // Now show fullscreen overlays on every monitor behind it
                                if let Ok(monitors) = app_handle.available_monitors() {
                                    for (i, monitor) in monitors.iter().enumerate() {
                                        let pos  = monitor.position();
                                        let size = monitor.size();
                                        let label = format!("break_overlay_{}", i);
                                        if let Some(existing) = app_handle.get_webview_window(&label) {
                                            let _ = existing.set_always_on_top(true);
                                            let _ = existing.show();
                                        } else {
                                            let _ = tauri::WebviewWindowBuilder::new(
                                                &app_handle,
                                                &label,
                                                tauri::WebviewUrl::App("overlay".into()),
                                            )
                                            .position(pos.x as f64, pos.y as f64)
                                            .inner_size(size.width as f64, size.height as f64)
                                            .decorations(false)
                                            .always_on_top(true)
                                            .skip_taskbar(true)
                                            .resizable(false)
                                            .build();
                                        }
                                    }
                                }

                                // Re-focus break_alert above the overlays, then emit
                                let _ = win.set_focus();
                                tokio::time::sleep(tokio::time::Duration::from_millis(400)).await;
                                let _ = win.set_focus();
                                let _ = win.emit("posefix:break-start", serde_json::json!({ "duration": duration }));
                            }
                        }

                        // Reset timer regardless of alert type
                        if let Ok(mut lb) = state.last_break.lock() {
                            *lb = std::time::Instant::now();
                        }
                    }
                }
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "menubar" { return; }
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
                let _ = window.app_handle().notification()
                    .builder()
                    .title("PoseFix sigue activo")
                    .body("La aplicación se ha minimizado a la bandeja del sistema.")
                    .show();
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
         .run(move |_app_handle, event| {
             match event {
                 tauri::RunEvent::Reopen { has_visible_windows, .. } => {
                     if !has_visible_windows {
                         if let Some(window) = _app_handle.get_webview_window("main") {
                             let _ = window.show();
                             let _ = window.set_focus();
                         }
                     }
                 }
                  tauri::RunEvent::ExitRequested { api, .. } => {
                      let state = _app_handle.state::<AppHealthState>();
                      let active = state.session_active.lock().map(|g| *g).unwrap_or(false);
                      if active {
                          api.prevent_exit();
                          _app_handle.emit("posefix:quit-requested", ()).ok();
                      }
                  }
                  tauri::RunEvent::Exit => {

                if let Ok(mut guard) = server_process_exit.lock() {
                    if let Some(ref mut child) = *guard {
                        let _ = child.kill();
                        let _ = child.wait();
                    }
                    *guard = None;
                }
            }
            _ => {}
        }
    });
}
