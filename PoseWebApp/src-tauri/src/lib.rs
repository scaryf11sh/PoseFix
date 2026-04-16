use std::fs;
use std::sync::{Arc, Mutex};
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};
use serde::{Deserialize, Serialize};

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

#[derive(Serialize)]
struct MetricResult {
    id: String,
    name: String,
    value: f64,
    level: String,   // "optimal" | "warning" | "critical"
    status_code: u8, // 0 | 1 | 2
}

#[derive(Serialize)]
struct PostureAnalysis {
    posture_score: u8,
    metrics: Vec<MetricResult>,
    warnings: Vec<String>,
}

// ─── Helper: minimum visibility threshold ───────────────────────────────────
const VIS_MIN: f64 = 0.3;

fn visible(lm: &Landmark) -> bool {
    lm.visibility.unwrap_or(1.0) >= VIS_MIN
}

// ─── analyze_posture Tauri command ───────────────────────────────────────────
/// Recibe landmarks normalizados [0,1] de YOLO (17 keypoints COCO) y aplica
/// las reglas de yolo_vision_rules.json para calcular métricas posturales.
///
/// Keypoint indices (COCO):
///   0 nose  1 left_eye  2 right_eye  3 left_ear  4 right_ear
///   5 left_shoulder  6 right_shoulder
#[tauri::command]
fn analyze_posture(landmarks: Vec<Landmark>) -> PostureAnalysis {
    let mut metrics: Vec<MetricResult> = Vec::new();
    let mut warnings: Vec<String> = Vec::new();
    let mut metric_scores: Vec<u8> = Vec::new();

    // ── 1. Head Tilt Roll ────────────────────────────────────────────────────
    // formula: atan2(|right_eye_y - left_eye_y|, |right_eye_x - left_eye_x|) × (180/π)
    // keypoints: left_eye[1], right_eye[2]
    if landmarks.len() > 2 {
        let le = &landmarks[1];
        let re = &landmarks[2];
        if visible(le) && visible(re) {
            let dx = (re.x - le.x).abs();
            let dy = (re.y - le.y).abs();
            let angle_deg = dy.atan2(dx).to_degrees();

            let (level, code, pts) = classify(angle_deg, &[(0.0, 5.0), (6.0, 12.0), (13.0, 90.0)]);
            if code > 0 {
                warnings.push(format!("Head tilt detected: {:.1}°", angle_deg));
            }
            metric_scores.push(pts);
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
    // formula: |left_ear_x - left_shoulder_x| / |left_ear_y - left_shoulder_y|
    // keypoints: left_ear[3], left_shoulder[5]
    if landmarks.len() > 5 {
        let ear = &landmarks[3];
        let sho = &landmarks[5];
        if visible(ear) && visible(sho) {
            let dx = (ear.x - sho.x).abs();
            let dy = (ear.y - sho.y).abs();
            let ratio = if dy > 1e-4 { dx / dy } else { 0.0 };

            let (level, code, pts) = classify(ratio, &[(0.0, 0.25), (0.26, 0.45), (0.46, 2.0)]);
            if code > 0 {
                warnings.push(format!("Forward head posture: ratio {:.2}", ratio));
            }
            metric_scores.push(pts);
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
    // formula: |right_shoulder_y - left_shoulder_y|
    //          / sqrt(Δx² + Δy²)
    // keypoints: left_shoulder[5], right_shoulder[6]
    if landmarks.len() > 6 {
        let ls = &landmarks[5];
        let rs = &landmarks[6];
        if visible(ls) && visible(rs) {
            let dx = rs.x - ls.x;
            let dy = (rs.y - ls.y).abs();
            let dist = (dx * dx + dy * dy).sqrt();
            let ratio = if dist > 1e-4 { dy / dist } else { 0.0 };

            let (level, code, pts) = classify(ratio, &[(0.0, 0.05), (0.06, 0.15), (0.16, 1.0)]);
            if code > 0 {
                warnings.push(format!("Shoulder asymmetry: ratio {:.2}", ratio));
            }
            metric_scores.push(pts);
            metrics.push(MetricResult {
                id:          "shoulder_asymmetry".into(),
                name:        "Shoulder Asymmetry".into(),
                value:       (ratio * 1000.0).round() / 1000.0,
                level:       level.into(),
                status_code: code,
            });
        }
    }

    // ── Overall posture score ────────────────────────────────────────────────
    // optimal = 100 pts, warning = 60 pts, critical = 20 pts
    // score = average of visible metric points
    let posture_score = if metric_scores.is_empty() {
        0u8
    } else {
        let sum: u32 = metric_scores.iter().map(|&p| p as u32).sum();
        (sum / metric_scores.len() as u32).min(100) as u8
    };

    PostureAnalysis { posture_score, metrics, warnings }
}

// ─── Multi-camera fusion ─────────────────────────────────────────────────────

#[derive(Deserialize)]
struct CameraData {
    #[allow(dead_code)]
    camera_index: u32,
    landmarks: Vec<Landmark>,
}

/// Fuses landmarks from multiple cameras using visibility-weighted average,
/// then runs the same postural analysis as analyze_posture.
#[tauri::command]
fn analyze_multi_camera(cameras: Vec<CameraData>) -> PostureAnalysis {
    if cameras.is_empty() {
        return PostureAnalysis { posture_score: 0, metrics: vec![], warnings: vec![] };
    }
    if cameras.len() == 1 {
        return analyze_posture(cameras.into_iter().next().unwrap().landmarks);
    }

    // Find max landmark count across cameras
    let max_kpts = cameras.iter().map(|c| c.landmarks.len()).max().unwrap_or(0);
    if max_kpts == 0 {
        return PostureAnalysis { posture_score: 0, metrics: vec![], warnings: vec![] };
    }

    // Build fused landmarks via visibility-weighted average per keypoint
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

    analyze_posture(fused)
}

/// Maps a value to (level_str, status_code, score_points) using ordered zones.
/// zones: [(min, max), ...] for codes 0, 1, 2
fn classify(value: f64, zones: &[(f64, f64)]) -> (&'static str, u8, u8) {
    for (code, &(lo, hi)) in zones.iter().enumerate() {
        if value >= lo && value <= hi {
            return match code {
                0 => ("optimal",  0, 100),
                1 => ("warning",  1,  60),
                _ => ("critical", 2,  20),
            };
        }
    }
    // Beyond all zones → critical
    ("critical", 2, 20)
}

#[tauri::command]
fn save_avatar(path: String, data: Vec<u8>) -> Result<(), String> {
    if let Some(parent) = std::path::Path::new(&path).parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, &data).map_err(|e| e.to_string())
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
        .manage(PoseServerState { process: server_process })
        .plugin(tauri_plugin_fs::init())
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
            launch_pose_server,
            stop_pose_server,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(move |_app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                if let Ok(mut guard) = server_process_exit.lock() {
                    if let Some(ref mut child) = *guard {
                        let _ = child.kill();
                        let _ = child.wait();
                    }
                    *guard = None;
                }
            }
        });
}
