<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { LineChart } from "layerchart";
    import { _ } from "svelte-i18n";
    import {
        VideoOff,
        Video,
        ChevronLeft,
        ChevronRight,
        PlusCircle,
        Circle,
        RefreshCw,
        Wifi,
        WifiOff,
        Power,
    } from "@lucide/svelte";
    import { invoke } from "@tauri-apps/api/core";
    import { PUBLIC_POSE_WS_HOST, PUBLIC_POSE_WS_PORT } from "$env/static/public";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { sessionStore } from "$lib/stores/session";
    import {
        getActiveSession,
        addWarning,
        getSessionStats,
        getSessions,
        getWeeklyStats,
    } from "$lib/db";

    // ─── Rust analysis types ────────────────────────────────────────────────
    type MetricResult = {
        id: string;
        name: string;
        value: number;
        level: "optimal" | "warning" | "critical";
        status_code: 0 | 1 | 2;
    };
    type PostureAnalysis = {
        posture_score: number;
        metrics: MetricResult[];
        warnings: string[];
    };

    // ─── YOLO COCO 17-keypoint skeleton connections ──────────────────────────
    // Indices: 0=nose 1=left_eye 2=right_eye 3=left_ear 4=right_ear
    //          5=left_shoulder 6=right_shoulder 7=left_elbow 8=right_elbow
    //          9=left_wrist 10=right_wrist 11=left_hip 12=right_hip
    //          13=left_knee 14=right_knee 15=left_ankle 16=right_ankle
    const POSE_CONNECTIONS: [number, number][] = [
        // Face
        [0, 1], [0, 2], [1, 3], [2, 4],
        // Torso
        [5, 6], [5, 11], [6, 12], [11, 12],
        // Left arm
        [5, 7], [7, 9],
        // Right arm
        [6, 8], [8, 10],
        // Left leg
        [11, 13], [13, 15],
        // Right leg
        [12, 14], [14, 16],
    ];

    // ─── Types ──────────────────────────────────────────────────────────────
    type LandmarkPoint = { x: number; y: number; z: number; visibility?: number };
    type PosePayload = { camera_index: number; landmarks: LandmarkPoint[] };

    // ─── Metrics state ──────────────────────────────────────────────────────
    let latency = $state(0.04);
    let postureScore = $state<number | null>(null);
    let blinks = $state<number | null>(null);
    let fatigueScore = $state<number | null>(null);
    let irritationLevel = $state<"LOW" | "MEDIUM" | "HIGH" | null>(null);
    let activeSessionId = $state<number | null>(null);
    let hasLiveData = $state(false);
    let wsStatus = $state<"connecting" | "connected" | "disconnected">("connecting");

    // ─── Per-camera Rust analysis results ───────────────────────────────────
    // Map: camera_index → latest PostureAnalysis from Rust (per-camera badge in grid)
    let cameraAnalysis = $state<Map<number, PostureAnalysis>>(new Map());
    // Map: camera_index → loading state ("loading" | "started" | "stopped")
    let cameraLoadingStates = $state<Map<number, string>>(new Map());
    // Fused multi-camera result — shown in sidebar and single-view overlay
    let fusedAnalysis = $state<PostureAnalysis | null>(null);
    // For single-view overlay: use fused result if available, fall back to any camera result
    let currentAnalysis = $derived(
        fusedAnalysis ?? (cameraAnalysis.size > 0 ? cameraAnalysis.values().next().value : null)
    );

    let postureStatus = $derived(
        postureScore == null ? null
        : postureScore >= 80 ? "Optimal"
        : postureScore >= 60 ? "Fair"
        : "Poor",
    );

    type DataPoint = { x: number; value: number };
    let fatigueHistory = $state<DataPoint[]>([]);

    // ─── Camera state ───────────────────────────────────────────────────────
    let realCameras = $state<MediaDeviceInfo[]>([]);
    let disabledCameraIds = $state<Set<string>>(new Set());
    let enabledCameras = $derived(realCameras.filter((c) => !disabledCameraIds.has(c.deviceId)));
    let cameraPermission = $state<"idle" | "requesting" | "granted" | "denied">("idle");
    let viewMode = $state<"single" | "2x2" | "3x3">("single");
    let currentCamIndex = $state(0);
    let currentCam = $derived(enabledCameras[currentCamIndex] ?? null);
    let activeCams = $derived(enabledCameras.length);

    // Imperative maps — not reactive, used by actions and draw loop
    const streams = new Map<string, MediaStream>();
    const videoElements = new Map<string, HTMLVideoElement>();
    const canvasElements = new Map<string, HTMLCanvasElement>();
    const latestPayloads = new Map<number, PosePayload>();
    // Latest landmarks per camera index — used for multi-camera fusion
    const latestLandmarksByCamera = new Map<number, LandmarkPoint[]>();
    // Prevent concurrent analyze_multi_camera calls
    let analysisPending = false;

    // ─── View guards ────────────────────────────────────────────────────────
    $effect(() => {
        if (activeCams > 0 && currentCamIndex >= activeCams)
            currentCamIndex = activeCams - 1;
    });
    $effect(() => {
        if (activeCams <= 1 && viewMode !== "single") viewMode = "single";
        if (activeCams <= 4 && viewMode === "3x3") viewMode = "2x2";
    });

    function nextCam() {
        if (activeCams > 0) currentCamIndex = (currentCamIndex + 1) % activeCams;
    }
    function prevCam() {
        if (activeCams > 0)
            currentCamIndex = (currentCamIndex - 1 + activeCams) % activeCams;
    }

    async function toggleCamera(deviceId: string) {
        const camIdx = realCameras.findIndex((c) => c.deviceId === deviceId);
        const next = new Set(disabledCameraIds);
        if (next.has(deviceId)) {
            // Re-enabling
            const wasAllDisabled = next.size >= realCameras.length;
            next.delete(deviceId);
            disabledCameraIds = next;

            // If server was stopped (all cams were off), restart it before resuming
            if (wasAllDisabled) {
                try { await invoke("launch_pose_server"); } catch {}
                connectWs();
            } else {
                if (camIdx >= 0) wsSend({ cmd: "resume_camera", camera_index: camIdx });
            }

            // Re-open stream
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: deviceId },
                        width: { ideal: 1920, min: 640 },
                        height: { ideal: 1080, min: 480 },
                    },
                });
                try {
                    const track = stream.getVideoTracks()[0];
                    const caps = track.getCapabilities() as MediaTrackCapabilities & {
                        zoom?: { min: number; max: number; step: number };
                    };
                    if (caps.zoom) {
                        await track.applyConstraints({
                            advanced: [{ zoom: caps.zoom.min } as MediaTrackConstraintSet],
                        });
                    }
                } catch {}
                streams.set(deviceId, stream);
                // videoAction may not have fired yet if Svelte is still updating the DOM;
                // try immediately and also after a tick
                const el = videoElements.get(deviceId);
                if (el) { el.srcObject = stream; el.play().catch(() => {}); }
                setTimeout(() => {
                    const el2 = videoElements.get(deviceId);
                    if (el2 && !el2.srcObject) { el2.srcObject = stream; el2.play().catch(() => {}); }
                }, 100);
            } catch {}
        } else {
            // Disabling → pause model
            next.add(deviceId);
            disabledCameraIds = next;
            if (camIdx >= 0) wsSend({ cmd: "pause_camera", camera_index: camIdx });
            // Stop browser stream and clear the video element
            const stream = streams.get(deviceId);
            if (stream) { stream.getTracks().forEach((t) => t.stop()); streams.delete(deviceId); }
            const videoEl = videoElements.get(deviceId);
            if (videoEl) { videoEl.srcObject = null; }
            // Clear stale landmarks from this camera's canvas
            const canvasEl = canvasElements.get(deviceId);
            if (canvasEl) {
                const ctx = canvasEl.getContext("2d");
                ctx?.clearRect(0, 0, canvasEl.width, canvasEl.height);
            }
            latestPayloads.delete(camIdx);
            latestLandmarksByCamera.delete(camIdx);

            // If ALL cameras now disabled → stop YOLO server entirely
            if (next.size >= realCameras.length) {
                wsSend({ cmd: "stop_all" });
                ws?.close();
                ws = null;
                if (wsReconnectTimer) { clearTimeout(wsReconnectTimer); wsReconnectTimer = null; }
                try { await invoke("stop_pose_server"); } catch {}
            }
        }
    }

    // ─── Svelte actions for DOM binding ─────────────────────────────────────
    function videoAction(el: HTMLVideoElement, deviceId: string) {
        videoElements.set(deviceId, el);
        const stream = streams.get(deviceId);
        if (stream) {
            el.srcObject = stream;
            el.play().catch(() => {});
        }
        return {
            update(newDeviceId: string) {
                videoElements.delete(deviceId);
                deviceId = newDeviceId;
                videoElements.set(newDeviceId, el);
                const newStream = streams.get(newDeviceId);
                el.srcObject = newStream ?? null;
                if (newStream) el.play().catch(() => {});
            },
            destroy() {
                videoElements.delete(deviceId);
            },
        };
    }

    function canvasAction(el: HTMLCanvasElement, deviceId: string) {
        canvasElements.set(deviceId, el);
        return {
            update(newDeviceId: string) {
                canvasElements.delete(deviceId);
                deviceId = newDeviceId;
                canvasElements.set(newDeviceId, el);
            },
            destroy() {
                canvasElements.delete(deviceId);
            },
        };
    }

    /** Stop and release all active browser camera streams. */
    function stopAllStreams() {
        // Null srcObject first so video elements show blank, not a frozen last frame
        for (const [deviceId] of streams) {
            const el = videoElements.get(deviceId);
            if (el) { el.srcObject = null; }
        }
        for (const stream of streams.values()) {
            stream.getTracks().forEach((t) => t.stop());
        }
        streams.clear();
        // Clear stale canvas data
        for (const canvas of canvasElements.values()) {
            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        latestPayloads.clear();
        latestLandmarksByCamera.clear();
        fusedAnalysis = null;
        cameraLoadingStates = new Map();
    }

    // ─── Camera detection ────────────────────────────────────────────────────
    async function detectCameras() {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        // Stop any existing streams so the device is freed before re-requesting
        stopAllStreams();
        // Tell the Python server to stop all cameras; they'll be restarted after detection
        wsSend({ cmd: "stop_all" });
        cameraPermission = "requesting";
        try {
            // Trigger permission prompt so device labels become available
            const tmp = await navigator.mediaDevices.getUserMedia({ video: true });
            tmp.getTracks().forEach((t) => t.stop());
            cameraPermission = "granted";
        } catch {
            cameraPermission = "denied";
            return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
            (d) => d.kind === "videoinput" && !/desk\s*view/i.test(d.label),
        );
        // Filter by cameras enabled in settings (localStorage posefix_enabled_cameras).
        // Distinction: key absent = not configured yet (show all);
        //              key present with empty array = user disabled all (show none).
        try {
            const raw = localStorage.getItem("posefix_enabled_cameras");
            if (raw !== null) {
                const ids: string[] = JSON.parse(raw);
                realCameras = videoDevices.filter((d) => ids.includes(d.deviceId));
            } else {
                realCameras = videoDevices;
            }
        } catch {
            realCameras = videoDevices;
        }

        // If no cameras available after settings filter → stop server and bail
        if (realCameras.length === 0) {
            try { await invoke("stop_pose_server"); } catch {}
            return;
        }

        // Notify Python server to start YOLO for each camera
        // (si WS ya está conectado; si no, onopen lo hará)
        wsStartActiveCameras();

        for (const cam of realCameras) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    // Specify resolution so the browser maintains quality even when
                    // the camera is shared with another app.
                    video: {
                        deviceId: { exact: cam.deviceId },
                        width: { ideal: 1920, min: 640 },
                        height: { ideal: 1080, min: 480 },
                    },
                });
                // Disable camera face-tracking zoom: force zoom to minimum so the
                // full body stays in frame instead of cropping to the face.
                try {
                    const track = stream.getVideoTracks()[0];
                    const caps = track.getCapabilities() as MediaTrackCapabilities & {
                        zoom?: { min: number; max: number; step: number };
                    };
                    if (caps.zoom) {
                        await track.applyConstraints({
                            advanced: [{ zoom: caps.zoom.min } as MediaTrackConstraintSet],
                        });
                    }
                } catch {
                    // camera doesn't support zoom control via browser API — ignore
                }
                streams.set(cam.deviceId, stream);
                const el = videoElements.get(cam.deviceId);
                if (el) {
                    el.srcObject = stream;
                    el.play().catch(() => {});
                }
            } catch (e) {
                console.warn("Could not open stream for", cam.label, e);
            }
        }
    }

    // ─── WebSocket client ────────────────────────────────────────────────────
    let ws: WebSocket | null = null;
    let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let wsDisconnectDebounce: ReturnType<typeof setTimeout> | null = null;

    /** Envía un mensaje JSON al servidor Python si la conexión está abierta. */
    function wsSend(data: object) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    /** Inicia todas las cámaras actualmente habilitadas en el servidor Python. */
    function wsStartActiveCameras() {
        realCameras.forEach((cam, idx) => {
            if (!disabledCameraIds.has(cam.deviceId)) {
                wsSend({ cmd: "start_camera", camera_index: idx });
            }
        });
    }

    function connectWs() {
        if (ws) return;
        // Clear any pending disconnect display so we don't flash "disconnected"
        if (wsDisconnectDebounce) { clearTimeout(wsDisconnectDebounce); wsDisconnectDebounce = null; }
        wsStatus = "connecting";
        try {
            ws = new WebSocket(`ws://${PUBLIC_POSE_WS_HOST}:${PUBLIC_POSE_WS_PORT}`);
            ws.onopen = () => {
                wsStatus = "connected";
                hasLiveData = true;
                // Send saved precision setting to Python server
                const precision = localStorage.getItem("posefix_ai_precision") ?? "Balanced";
                wsSend({ cmd: "set_precision", level: precision });
                // Iniciar cámaras habilitadas en el servidor Python
                wsStartActiveCameras();
            };
            ws.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data);

                    // Mensajes de estado/error del servidor Python
                    if (msg.type === "status" || msg.type === "error" || msg.type === "loading") {
                        if (msg.type === "error") {
                            console.warn("[PoseServer]", msg.message);
                        }
                        if (msg.type === "loading" || msg.type === "status") {
                            const idx = msg.camera_index as number;
                            const updated = new Map(cameraLoadingStates);
                            updated.set(idx, msg.type === "loading" ? "loading" : (msg.status ?? msg.type));
                            cameraLoadingStates = updated;
                        }
                        return;
                    }

                    const payload: PosePayload = msg;
                    latestPayloads.set(payload.camera_index, payload);
                    // Mark as started once real landmark data arrives
                    if (!cameraLoadingStates.get(payload.camera_index)?.includes("started")) {
                        const updated = new Map(cameraLoadingStates);
                        updated.set(payload.camera_index, "started");
                        cameraLoadingStates = updated;
                    }
                    if (payload.landmarks?.length > 0) {
                        latestLandmarksByCamera.set(payload.camera_index, payload.landmarks);

                        // ── Fuse all cameras and send to Rust ──────────────
                        if (!analysisPending) {
                            analysisPending = true;
                            const cameras = Array.from(latestLandmarksByCamera.entries()).map(
                                ([camera_index, landmarks]) => ({ camera_index, landmarks })
                            );
                            invoke<PostureAnalysis>("analyze_multi_camera", { cameras })
                                .then((analysis) => {
                                    postureScore = analysis.posture_score;
                                    fusedAnalysis = analysis;
                                    // Store per-camera badge scores (all show fused result)
                                    const updated = new Map(cameraAnalysis);
                                    for (const [idx] of latestLandmarksByCamera) {
                                        updated.set(idx, analysis);
                                    }
                                    cameraAnalysis = updated;
                                })
                                .catch(() => {
                                    const visible = payload.landmarks.filter(
                                        (l) => (l.visibility ?? 1) > 0.5,
                                    ).length;
                                    postureScore = Math.round((visible / 17) * 100);
                                })
                                .finally(() => { analysisPending = false; });
                        }
                    }
                } catch {
                    // malformed message — ignore
                }
            };
            ws.onerror = () => {};
            ws.onclose = () => {
                ws = null;
                hasLiveData = false;
                // Debounce: don't flash "Using historical data" during brief reconnects
                wsDisconnectDebounce = setTimeout(() => {
                    wsStatus = "disconnected";
                    wsDisconnectDebounce = null;
                }, 2500);
                wsReconnectTimer = setTimeout(connectWs, 5000);
            };
        } catch {
            wsStatus = "disconnected";
        }
    }

    // ─── Canvas draw loop ────────────────────────────────────────────────────
    let rafId: number;

    function drawPose(canvas: HTMLCanvasElement, payload: PosePayload | undefined, videoEl?: HTMLVideoElement) {
        // Sync canvas pixel buffer to actual CSS layout size
        const rect = canvas.getBoundingClientRect();
        const W = Math.round(rect.width);
        const H = Math.round(rect.height);
        if (W > 0 && H > 0 && (canvas.width !== W || canvas.height !== H)) {
            canvas.width = W;
            canvas.height = H;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video frame directly on canvas — avoids WebKit compositor z-ordering battle
        // where hardware-accelerated <video> renders above CSS-positioned elements.
        if (videoEl && videoEl.readyState >= 2 && canvas.width > 0 && canvas.height > 0) {
            const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
            if (vw > 0 && vh > 0) {
                const cw = canvas.width, ch = canvas.height;
                // object-cover math: scale to fill, crop center
                const scale = Math.max(cw / vw, ch / vh);
                const sw = cw / scale, sh = ch / scale;
                const sx = (vw - sw) / 2, sy = (vh - sh) / 2;
                ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, cw, ch);
            }
        }

        if (!payload?.landmarks?.length || canvas.width === 0 || canvas.height === 0) return;

        const { landmarks } = payload;
        const CW = canvas.width;
        const CH = canvas.height;
        // Use lower visibility threshold — YOLO keypoint confidence can be < 0.3 for
        // partially visible joints. 0.1 keeps occluded keypoints visible on screen.
        const VIS = 0.1;

        // Draw skeleton connections
        ctx.strokeStyle = "rgba(56,189,248,0.9)";
        ctx.lineWidth = 2.5;
        for (const [a, b] of POSE_CONNECTIONS) {
            const la = landmarks[a];
            const lb = landmarks[b];
            if (!la || !lb) continue;
            if ((la.visibility ?? 1) < VIS || (lb.visibility ?? 1) < VIS) continue;
            ctx.beginPath();
            ctx.moveTo(la.x * CW, la.y * CH);
            ctx.lineTo(lb.x * CW, lb.y * CH);
            ctx.stroke();
        }

        // Draw landmark joints
        for (const lm of landmarks) {
            if ((lm.visibility ?? 1) < VIS) continue;
            ctx.beginPath();
            ctx.arc(lm.x * CW, lm.y * CH, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#f472b6";
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.7)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    function startRaf() {
        function loop() {
            for (const [deviceId, canvas] of canvasElements) {
                const idx = realCameras.findIndex((c) => c.deviceId === deviceId);
                const videoEl = videoElements.get(deviceId);
                drawPose(canvas, latestPayloads.get(idx), videoEl);
            }
            rafId = requestAnimationFrame(loop);
        }
        rafId = requestAnimationFrame(loop);
    }

    // ─── Sensors (from settings localStorage) ───────────────────────────────
    type Esp32Status = "disconnected" | "connecting" | "handshake" | "paired" | "streaming" | "failed";
    type Sensor = {
        id: string;
        ip: string;
        port: number;
        label: string;
        firmware: string;
        deviceId: string;
        status: Esp32Status;
        signal: number;
        enabled: boolean;
    };

    function loadSensorsFromStorage(): Sensor[] {
        try {
            const raw = localStorage.getItem("posefix_sensors");
            if (!raw) return [];
            const parsed: Omit<Sensor, "enabled">[] = JSON.parse(raw);
            return parsed.map((s) => ({ ...s, enabled: true }));
        } catch {
            return [];
        }
    }

    let sensors = $state<Sensor[]>([]);

    function toggleSensor(id: string) {
        sensors = sensors.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    }

    function sensorStatusLabel(s: Esp32Status): string {
        if (s === "streaming") return "STREAMING";
        if (s === "paired") return "PAIRED";
        if (s === "handshake") return "HANDSHAKE";
        if (s === "connecting") return "CONNECTING";
        if (s === "failed") return "FAILED";
        return "DISCONNECTED";
    }
    function statusStyle(s: Esp32Status) {
        if (s === "streaming") return "text-green-400 border-green-400/30 bg-green-400/10";
        if (s === "paired") return "text-sky-400 border-sky-400/30 bg-sky-400/10";
        if (s === "handshake" || s === "connecting") return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
        if (s === "failed") return "text-red-400 border-red-400/30 bg-red-400/10";
        return "text-slate-400 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700";
    }
    function irritationStyle(l: "LOW" | "MEDIUM" | "HIGH") {
        if (l === "LOW") return "text-green-400";
        if (l === "MEDIUM") return "text-yellow-400";
        return "text-red-400";
    }

    // ─── Warning cooldown ────────────────────────────────────────────────────
    let lastWarningTime = 0;

    // ─── Lifecycle ───────────────────────────────────────────────────────────
    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(user);

        // Camera page only joins an existing session — it never creates one.
        // Sessions are created/ended exclusively from the Dashboard.
        try {
            const active = await getActiveSession(user.id);
            if (active) {
                activeSessionId = active.id;
                sessionStore.set(active.id);
            }
        } catch (e) {
            console.error("Failed to read session:", e);
        }

        // Seed metrics from DB: use avg posture + last completed session values
        try {
            const stats = await getSessionStats(user.id);
            if (stats.avg_score) postureScore = Math.round(stats.avg_score);
        } catch {}

        try {
            const sessions = await getSessions(user.id, 5);
            const lastCompleted = sessions.find((s) => s.session_end != null);
            if (lastCompleted) {
                if (lastCompleted.blink_rate != null)
                    blinks = Math.round(lastCompleted.blink_rate);
                if (lastCompleted.fatigue_score != null) {
                    fatigueScore = Math.round(lastCompleted.fatigue_score);
                    irritationLevel =
                        fatigueScore > 20 ? "HIGH" : fatigueScore > 15 ? "MEDIUM" : "LOW";
                }
            }
        } catch {}

        try {
            const weekly = await getWeeklyStats(user.id);
            if (weekly.length > 0) {
                fatigueHistory = weekly.map((w, i) => ({
                    x: i,
                    // proxy: lower posture score → higher fatigue
                    value: Math.max(0, Math.round(100 - (w.avg_score ?? 100))),
                }));
            }
        } catch {}

        // Only auto-request if already granted (avoids silent failure before user gesture)
        if (navigator.permissions) {
            try {
                const perm = await navigator.permissions.query({ name: "camera" as PermissionName });
                if (perm.state === "granted") {
                    await detectCameras();
                } else {
                    cameraPermission = perm.state === "denied" ? "denied" : "idle";
                }
            } catch {
                // permissions API not available — try anyway
                await detectCameras();
            }
        } else {
            await detectCameras();
        }
        sensors = loadSensorsFromStorage();
        connectWs();
        startRaf();

        const interval = setInterval(() => {
            // Latency indicator — cosmetic only
            latency = parseFloat(
                (hasLiveData
                    ? 0.01 + Math.random() * 0.02
                    : 0.02 + Math.random() * 0.05
                ).toFixed(2),
            );

            // Posture warning — max one every 30s
            if (
                postureScore != null &&
                postureScore < 60 &&
                activeSessionId &&
                Date.now() - lastWarningTime > 30_000
            ) {
                lastWarningTime = Date.now();
                addWarning({
                    session_id: activeSessionId,
                    warning_type: "posture",
                    label: "Poor posture detected",
                    severity: postureScore < 40 ? 3 : 2,
                }).catch(() => {});
            }
        }, 1500);

        return () => {
            clearInterval(interval);
            cancelAnimationFrame(rafId);
            if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
            if (wsDisconnectDebounce) clearTimeout(wsDisconnectDebounce);
            ws?.close();
            ws = null;
            for (const stream of streams.values()) {
                stream.getTracks().forEach((t) => t.stop());
            }
            // Do NOT end the session here — the Dashboard owns session lifecycle.
            // Cleaning up streams/WS is enough.
        };
    });
</script>

<div class="flex-1 p-6 overflow-y-hidden bg-bright-snow-50 dark:bg-prussian-blue-900">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_("monitor.title")} <span class="text-sky-400">v2.4</span>
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {$_("monitor.subtitle")}
            </p>
        </div>
        <div class="hidden md:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                {$_("monitor.latency", { values: { ms: latency } })}
            </span>
            <span class="text-slate-600 dark:text-slate-600">•</span>
            <!-- WS status -->
            {#if wsStatus === "connected"}
                <span class="flex items-center gap-1.5 text-green-400">
                    <Wifi class="w-3 h-3" />
                    {$_("monitor.liveData")}
                </span>
            {:else if wsStatus === "connecting"}
                <span class="flex items-center gap-1.5 text-yellow-400">
                    <Wifi class="w-3 h-3 animate-pulse" />
                    {$_("monitor.wsConnecting")}
                </span>
            {:else}
                <span class="flex items-center gap-1.5 text-slate-500">
                    <WifiOff class="w-3 h-3" />
                    {$_("monitor.dbFallback")}
                </span>
            {/if}
            <span class="text-slate-600 dark:text-slate-600">•</span>
            <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                {$_("monitor.neuralActive")}
            </span>
        </div>
    </div>

    <!-- Top row: Camera Monitor | Camera Signals + AI Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <!-- Camera Monitor -->
        <div
            class="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col"
        >
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">
                        {$_("monitor.cameraMonitor")}
                    </h2>
                    <!-- Pose tracking indicator -->
                    {#if hasLiveData}
                        <span
                            class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                        >
                            {$_("monitor.landmarksActive")}
                        </span>
                    {:else}
                        <span
                            class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                        >
                            {$_("monitor.landmarksOffline")}
                        </span>
                    {/if}
                </div>
                <!-- View mode buttons -->
                <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    {#each [["single", $_("monitor.singleView")], ["2x2", "2×2"], ["3x3", "3×3"]] as [mode, label]}
                        {@const disabled =
                            (activeCams <= 1 && mode !== "single") ||
                            (activeCams <= 4 && mode === "3x3") ||
                            (activeCams <= 2 && mode === "2x2")}
                        <button
                            onclick={() => !disabled && (viewMode = mode as typeof viewMode)}
                            {disabled}
                            class="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all
                                {viewMode === mode
                                ? 'bg-sky-400 text-white shadow'
                                : disabled
                                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
                        >
                            {label}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Feed area -->
            <div
                class="rounded-xl overflow-hidden bg-slate-900 dark:bg-slate-950 relative flex-1 min-h-[200px] transition-all duration-300"
            >
                {#if cameraPermission === "denied"}
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500"
                    >
                        <VideoOff class="w-8 h-8" />
                        <p class="text-xs text-center px-6">{$_("monitor.noPermission")}</p>
                        <button
                            onclick={detectCameras}
                            class="mt-2 flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
                        >
                            <RefreshCw class="w-3.5 h-3.5" />
                            {$_("monitor.refreshCameras")}
                        </button>
                    </div>
                {:else if cameraPermission === "requesting"}
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500"
                    >
                        <RefreshCw class="w-6 h-6 animate-spin text-sky-400" />
                        <p class="text-xs">{$_("monitor.requestingAccess")}</p>
                    </div>
                {:else if activeCams === 0}
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500"
                    >
                        <VideoOff class="w-8 h-8" />
                        <p class="text-xs">{$_("monitor.noCamerasFound")}</p>
                        <button
                            onclick={detectCameras}
                            class="mt-2 flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
                        >
                            <RefreshCw class="w-3.5 h-3.5" />
                            {$_("monitor.refreshCameras")}
                        </button>
                    </div>
                {:else if viewMode === "single"}
                    <!-- Single camera view -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        {#if currentCam}
                            <!-- Video + canvas overlay container.
                                 isolation:isolate creates a stacking context so the canvas
                                 z-index is respected above WebKit's composited video layer. -->
                            {@const camIdx = realCameras.findIndex(c => c.deviceId === currentCam.deviceId)}
                            {@const camState = cameraLoadingStates.get(camIdx)}
                            <div class="relative w-full h-full">
                                <!-- svelte-ignore a11y-media-has-caption -->
                                <!-- Video is invisible — canvas draws frames via ctx.drawImage() -->
                                <video
                                    use:videoAction={currentCam.deviceId}
                                    autoplay
                                    playsinline
                                    muted
                                    class="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                                ></video>
                                <canvas
                                    use:canvasAction={currentCam.deviceId}
                                    class="absolute inset-0 w-full h-full pointer-events-none"
                                ></canvas>
                                <!-- YOLO loading overlay -->
                                {#if camState === "loading"}
                                    <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-sm pointer-events-none" style="z-index: 2;">
                                        <RefreshCw class="w-6 h-6 text-sky-400 animate-spin" />
                                        <p class="text-xs font-bold text-white">Loading YOLO model…</p>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Live badge -->
                    <div
                        class="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full z-10"
                    >
                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span class="text-[9px] text-white font-bold uppercase tracking-wider">
                            {$_("monitor.live")} • {currentCam?.label || currentCam?.deviceId.slice(0, 8) || "—"}
                        </span>
                    </div>

                    <!-- Posture score overlay (single view) -->
                    {#if currentAnalysis}
                        <div class="absolute top-2 right-2 z-10 flex flex-col gap-1">
                            <div class="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5">
                                <p class="text-[8px] text-white/60 uppercase tracking-wider mb-0.5">Posture</p>
                                <p class="text-lg font-bold tabular-nums
                                    {currentAnalysis.posture_score >= 80 ? 'text-sky-400' : currentAnalysis.posture_score >= 60 ? 'text-yellow-400' : 'text-red-400'}">
                                    {currentAnalysis.posture_score}
                                </p>
                            </div>
                            {#each currentAnalysis.metrics.filter(m => m.status_code > 0) as warn}
                                <div class="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full {warn.status_code === 1 ? 'bg-yellow-400' : 'bg-red-400'}"></span>
                                    <span class="text-[8px] font-bold {warn.status_code === 1 ? 'text-yellow-300' : 'text-red-300'}">
                                        {warn.id === 'head_tilt_roll' ? 'HEAD TILT'
                                         : warn.id === 'forward_head_posture' ? 'FWD HEAD'
                                         : 'SHOULDERS'}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <!-- Navigation arrows -->
                    {#if activeCams > 1}
                        <button
                            onclick={prevCam}
                            class="absolute top-1/2 left-2 -translate-y-1/2 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full cursor-pointer z-10"
                        >
                            <ChevronLeft class="w-6 h-6 text-white" />
                        </button>
                        <button
                            onclick={nextCam}
                            class="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full cursor-pointer z-10"
                        >
                            <ChevronRight class="w-6 h-6 text-white" />
                        </button>
                    {/if}
                {:else}
                    <!-- Grid view (2x2 or 3x3) -->
                    {@const cols = viewMode === "2x2" ? 2 : 3}
                    {@const slots = cols * cols}
                    <div
                        class="grid h-full gap-0.5"
                        style="grid-template-columns: repeat({cols}, 1fr)"
                    >
                        {#each Array.from({ length: slots }) as _, idx}
                            {@const cam = enabledCameras[idx]}
                            {@const gridCamIdx = realCameras.findIndex(c => c.deviceId === cam?.deviceId)}
                            {@const gridCamState = cameraLoadingStates.get(gridCamIdx)}
                            <div class="relative bg-slate-800 overflow-hidden">
                                {#if cam}
                                    <div class="relative w-full h-full">
                                        <!-- svelte-ignore a11y-media-has-caption -->
                                        <video
                                            use:videoAction={cam.deviceId}
                                            autoplay
                                            playsinline
                                            muted
                                            class="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                                        ></video>
                                        <canvas
                                            use:canvasAction={cam.deviceId}
                                            class="absolute inset-0 w-full h-full pointer-events-none"
                                        ></canvas>
                                        {#if gridCamState === "loading"}
                                            <div class="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none" style="z-index: 2;">
                                                <RefreshCw class="w-4 h-4 text-sky-400 animate-spin" />
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="absolute bottom-1 left-1 flex items-center gap-1">
                                        <span class="text-[8px] text-white/60 font-mono bg-black/40 px-1 rounded">
                                            CAM-{String(idx + 1).padStart(2, "0")}
                                        </span>
                                        {#if cameraAnalysis.get(gridCamIdx)}
                                            {@const score = cameraAnalysis.get(gridCamIdx)!.posture_score}
                                            <span class="text-[8px] font-bold px-1 rounded
                                                {score >= 80 ? 'bg-sky-500/80 text-white' : score >= 60 ? 'bg-yellow-500/80 text-white' : 'bg-red-500/80 text-white'}">
                                                {score}
                                            </span>
                                        {/if}
                                    </div>
                                {:else}
                                    <div class="flex items-center justify-center h-full">
                                        <VideoOff class="w-4 h-4 text-slate-600" />
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Right column: Camera Signals + Real-Time AI Metrics -->
        <div class="lg:col-span-2 flex flex-col gap-4">
            <!-- Camera Signals -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-4">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">
                        {$_("monitor.cameraSignals")}
                    </h2>
                </div>

                <div class="space-y-2 mb-4">
                    {#if realCameras.length === 0}
                        <p class="text-xs text-slate-400 text-center py-3">
                            {cameraPermission === "denied"
                                ? $_("monitor.noPermission")
                                : $_("monitor.noCamerasFound")}
                        </p>
                    {:else}
                        {#each realCameras as cam, idx}
                            {@const isEnabled = !disabledCameraIds.has(cam.deviceId)}
                            <div
                                class="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors
                                {isEnabled
                                    ? 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                                    : 'bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 opacity-60'}"
                            >
                                <div class="flex items-center gap-2.5">
                                    <span class="w-2 h-2 rounded-full {isEnabled ? 'bg-sky-400' : 'bg-slate-400'}"></span>
                                    <div>
                                        <p class="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">
                                            {cam.label || `Camera ${idx + 1}`}
                                        </p>
                                        <p class="text-[10px] text-slate-400 font-mono">
                                            CAM-{String(idx + 1).padStart(3, "0")}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onclick={() => toggleCamera(cam.deviceId)}
                                    title={isEnabled ? "Deshabilitar cámara" : "Habilitar cámara"}
                                    class="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer
                                    {isEnabled
                                        ? 'bg-sky-400/10 text-sky-400 border-sky-400/20 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/20'}"
                                >
                                    <Power class="w-2.5 h-2.5" />
                                    {isEnabled ? $_("monitor.live") : "OFF"}
                                </button>
                            </div>
                        {/each}
                    {/if}
                </div>

                <button
                    onclick={detectCameras}
                    class="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                    bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    text-xs font-medium text-slate-600 dark:text-slate-300
                    hover:border-sky-400 hover:text-sky-400 transition-all"
                >
                    <RefreshCw class="w-3.5 h-3.5" />
                    {$_("monitor.refreshCameras")}
                </button>
            </div>

            <!-- Real-Time AI Metrics -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex-1"
            >
                <div class="flex items-center gap-2 mb-5">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">
                        {$_("monitor.aiMetrics")}
                    </h2>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <!-- Posture Analysis (Rust engine) -->
                    <div
                        class="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <div class="flex items-center justify-between mb-1">
                            <p class="text-xs text-slate-400 uppercase tracking-wider">
                                {$_("monitor.postureDetection")}
                            </p>
                            {#if postureScore != null}
                                <span
                                    class="text-xs font-bold tabular-nums
                                    {postureScore >= 80
                                        ? 'text-sky-400'
                                        : postureScore >= 60
                                          ? 'text-yellow-400'
                                          : 'text-red-400'}"
                                >{postureScore}<span class="text-slate-400 font-normal">/100</span></span>
                            {/if}
                        </div>

                        {#if !currentAnalysis}
                            <p class="text-xs text-slate-400 italic text-center py-3">{$_("monitor.noData")}</p>
                        {:else}
                            <!-- Score bar -->
                            <div class="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-1">
                                <div
                                    class="h-full rounded-full transition-all duration-500"
                                    style="width: {currentAnalysis.posture_score}%;
                                           background: {currentAnalysis.posture_score >= 80 ? '#38bdf8' : currentAnalysis.posture_score >= 60 ? '#eab308' : '#ef4444'}"
                                ></div>
                            </div>

                            <!-- 3 metrics: show name, numeric value, and level -->
                            <div class="space-y-2 mt-1">
                                {#each currentAnalysis.metrics as m}
                                    {@const dot = m.status_code === 0 ? 'bg-green-400' : m.status_code === 1 ? 'bg-yellow-400' : 'bg-red-400'}
                                    {@const col = m.status_code === 0 ? 'text-green-400' : m.status_code === 1 ? 'text-yellow-400' : 'text-red-400'}
                                    {@const label = m.id === 'head_tilt_roll' ? 'Head Tilt'
                                                  : m.id === 'forward_head_posture' ? 'Fwd Head'
                                                  : 'Shoulders'}
                                    {@const unit = m.id === 'head_tilt_roll' ? '°' : ''}
                                    <div class="flex flex-col gap-0.5">
                                        <div class="flex items-center justify-between gap-1">
                                            <div class="flex items-center gap-1.5 min-w-0">
                                                <span class="w-1.5 h-1.5 rounded-full shrink-0 {dot}"></span>
                                                <span class="text-[9px] text-slate-500 dark:text-slate-400 truncate">{label}</span>
                                            </div>
                                            <span class="text-[9px] font-bold tabular-nums {col} shrink-0">
                                                {m.value.toFixed(m.id === 'head_tilt_roll' ? 1 : 2)}{unit}
                                            </span>
                                        </div>
                                        <!-- mini progress bar -->
                                        <div class="h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <div class="h-full rounded-full transition-all duration-300"
                                                 style="width: {m.status_code === 0 ? 33 : m.status_code === 1 ? 66 : 100}%;
                                                        background: {m.status_code === 0 ? '#4ade80' : m.status_code === 1 ? '#facc15' : '#f87171'}">
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>

                    <!-- Eye Health Metrics -->
                    <div
                        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                            {$_("monitor.eyeHealth")}
                        </p>
                        {#if blinks == null && irritationLevel == null}
                            <p class="text-xs text-slate-400 italic text-center py-3">
                                {$_("monitor.noData")}
                            </p>
                        {:else}
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-slate-500 dark:text-slate-400">
                                        {$_("monitor.irritation")}
                                    </span>
                                    {#if irritationLevel != null}
                                        <span class="text-xs font-bold {irritationStyle(irritationLevel)}">
                                            {irritationLevel}
                                        </span>
                                    {:else}
                                        <span class="text-xs text-slate-400">—</span>
                                    {/if}
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-slate-500 dark:text-slate-400">
                                        {$_("monitor.blinks")}
                                    </span>
                                    {#if blinks != null}
                                        <span class="text-xs font-bold text-slate-700 dark:text-white tabular-nums">
                                            {blinks}
                                            <span class="text-slate-400 font-normal">BPM</span>
                                        </span>
                                    {:else}
                                        <span class="text-xs text-slate-400">—</span>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Fatigue Score + Sparkline -->
                    <div
                        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between"
                    >
                        <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            {$_("monitor.fatigue")}
                        </p>
                        {#if fatigueScore == null}
                            <p class="text-xs text-slate-400 italic text-center py-3">
                                {$_("monitor.noData")}
                            </p>
                        {:else}
                            <div>
                                <p class="text-4xl font-bold text-slate-800 dark:text-white tabular-nums">
                                    {fatigueScore}<span class="text-base text-slate-400 font-normal">/100</span>
                                </p>
                            </div>
                            {#if fatigueHistory.length > 1}
                                <div class="h-12 text-sky-400 mt-2">
                                    <LineChart
                                        data={fatigueHistory}
                                        x="x"
                                        y="value"
                                        padding={{ top: 4, bottom: 4, left: 0, right: 0 }}
                                        lineProps={{ class: "stroke-sky-400 stroke-2" }}
                                    />
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Sensor Telemetry -->
    <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
    >
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">
                    {$_("monitor.telemetry")}
                </h2>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-400">
                <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-red-400"></span>
                    {$_("monitor.environmental")}
                </span>
                <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                    {$_("monitor.kinetic")}
                </span>
            </div>
        </div>

        {#if sensors.length === 0}
            <p class="text-xs text-slate-400 text-center py-6">
                {$_("monitor.noSensors")}
            </p>
        {:else}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800">
                        {#each [
                            $_("monitor.sensorNode"),
                            $_("monitor.status"),
                            "IP / PORT",
                            "FIRMWARE",
                            "SIGNAL",
                            $_("monitor.dataStream"),
                            "",
                        ] as col}
                            <th
                                class="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4 first:pr-8"
                            >
                                {col}
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each sensors as s}
                        <tr
                            class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors {s.enabled ? '' : 'opacity-40'}"
                        >
                            <td class="py-3.5 pr-8">
                                <div class="flex items-center gap-2.5">
                                    <div
                                        class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sky-400"
                                    >
                                        <Circle class="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-slate-800 dark:text-white">
                                            {s.label}
                                        </p>
                                        <p class="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">
                                            {s.deviceId !== "—" ? s.deviceId : s.id}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3.5 pr-4">
                                <span
                                    class="text-xs font-bold px-2.5 py-1 rounded-md border {statusStyle(s.status)}"
                                >
                                    {sensorStatusLabel(s.status)}
                                </span>
                            </td>
                            <td class="py-3.5 pr-4">
                                <p class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">HOST</p>
                                <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                    {s.ip}:{s.port}
                                </p>
                            </td>
                            <td class="py-3.5 pr-4">
                                <p class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">FW</p>
                                <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                    {s.firmware}
                                </p>
                            </td>
                            <td class="py-3.5 pr-4">
                                <p class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">RSSI</p>
                                <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                    {s.signal > 0 ? `${s.signal}%` : "—"}
                                </p>
                            </td>
                            <td class="py-3.5">
                                <div
                                    class="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
                                >
                                    {#if s.enabled && s.status === "streaming"}
                                        <div
                                            class="h-full rounded-full bg-sky-400 animate-pulse"
                                            style="width: 65%"
                                        ></div>
                                    {/if}
                                </div>
                            </td>
                            <td class="py-3.5 pl-2">
                                <button
                                    onclick={() => toggleSensor(s.id)}
                                    title={s.enabled ? "Deshabilitar sensor" : "Habilitar sensor"}
                                    class="p-1.5 rounded-lg border transition-colors cursor-pointer
                                    {s.enabled
                                        ? 'text-sky-400 border-sky-400/20 bg-sky-400/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20'
                                        : 'text-slate-400 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/20'}"
                                >
                                    <Power class="w-3 h-3" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        {/if}
    </div>
</div>
