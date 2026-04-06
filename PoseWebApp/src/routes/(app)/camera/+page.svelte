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
    } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import {
        getActiveSession,
        startSession,
        endSession,
        addWarning,
        getSessionStats,
    } from "$lib/db";

    // ─── MediaPipe skeleton connections (33 landmarks) ──────────────────────
    const POSE_CONNECTIONS: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
        [9, 10],
        [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
        [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
        [11, 23], [12, 24], [23, 24],
        [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
        [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
    ];

    // ─── Types ──────────────────────────────────────────────────────────────
    type LandmarkPoint = { x: number; y: number; z: number; visibility?: number };
    type PosePayload = { camera_index: number; landmarks: LandmarkPoint[] };

    // ─── Metrics state ──────────────────────────────────────────────────────
    let latency = $state(0.04);
    let postureScore = $state(85);
    let blinks = $state(14);
    let fatigueScore = $state(12);
    let irritationLevel = $state<"LOW" | "MEDIUM" | "HIGH">("LOW");
    let activeSessionId = $state<number | null>(null);
    let hasLiveData = $state(false);
    let wsStatus = $state<"connecting" | "connected" | "disconnected">("disconnected");

    let postureStatus = $derived(
        postureScore >= 80 ? "Optimal" : postureScore >= 60 ? "Fair" : "Poor",
    );

    type DataPoint = { x: number; value: number };
    let fatigueHistory = $state<DataPoint[]>(
        Array.from({ length: 20 }, (_, i) => ({
            x: i,
            value: Math.round(8 + Math.random() * 10),
        })),
    );

    // ─── Camera state ───────────────────────────────────────────────────────
    let realCameras = $state<MediaDeviceInfo[]>([]);
    let cameraPermission = $state<"idle" | "requesting" | "granted" | "denied">("idle");
    let viewMode = $state<"single" | "2x2" | "3x3">("single");
    let currentCamIndex = $state(0);
    let currentCam = $derived(realCameras[currentCamIndex] ?? null);
    let activeCams = $derived(realCameras.length);

    // Imperative maps — not reactive, used by actions and draw loop
    const streams = new Map<string, MediaStream>();
    const videoElements = new Map<string, HTMLVideoElement>();
    const canvasElements = new Map<string, HTMLCanvasElement>();
    const latestPayloads = new Map<number, PosePayload>();

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

    // ─── Svelte actions for DOM binding ─────────────────────────────────────
    function videoAction(el: HTMLVideoElement, deviceId: string) {
        videoElements.set(deviceId, el);
        const stream = streams.get(deviceId);
        if (stream) {
            el.srcObject = stream;
            el.play().catch(() => {});
        }
        return {
            destroy() {
                videoElements.delete(deviceId);
            },
        };
    }

    function canvasAction(el: HTMLCanvasElement, deviceId: string) {
        canvasElements.set(deviceId, el);
        return {
            destroy() {
                canvasElements.delete(deviceId);
            },
        };
    }

    // ─── Camera detection ────────────────────────────────────────────────────
    async function detectCameras() {
        if (!navigator.mediaDevices?.enumerateDevices) return;
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
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        realCameras = videoDevices;

        for (const cam of videoDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: cam.deviceId } },
                });
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

    function connectWs() {
        if (ws) return;
        wsStatus = "connecting";
        try {
            ws = new WebSocket("ws://localhost:8765");
            ws.onopen = () => {
                wsStatus = "connected";
                hasLiveData = true;
            };
            ws.onmessage = (e) => {
                try {
                    const payload: PosePayload = JSON.parse(e.data);
                    latestPayloads.set(payload.camera_index, payload);
                    if (payload.landmarks?.length > 0) {
                        const visible = payload.landmarks.filter(
                            (l) => (l.visibility ?? 1) > 0.5,
                        ).length;
                        postureScore = Math.round((visible / 33) * 100);
                    }
                } catch {
                    // malformed message — ignore
                }
            };
            ws.onerror = () => {};
            ws.onclose = () => {
                ws = null;
                wsStatus = "disconnected";
                hasLiveData = false;
                wsReconnectTimer = setTimeout(connectWs, 5000);
            };
        } catch {
            wsStatus = "disconnected";
        }
    }

    // ─── Canvas draw loop ────────────────────────────────────────────────────
    let rafId: number;

    function drawPose(canvas: HTMLCanvasElement, payload: PosePayload | undefined) {
        // Sync canvas pixel size to rendered CSS size
        if (canvas.clientWidth > 0 && canvas.width !== canvas.clientWidth) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!payload?.landmarks?.length) return;

        const { landmarks } = payload;
        const W = canvas.width;
        const H = canvas.height;

        // Draw skeleton connections
        ctx.strokeStyle = "rgba(56,189,248,0.85)";
        ctx.lineWidth = 2;
        for (const [a, b] of POSE_CONNECTIONS) {
            const la = landmarks[a];
            const lb = landmarks[b];
            if (!la || !lb) continue;
            if ((la.visibility ?? 1) < 0.3 || (lb.visibility ?? 1) < 0.3) continue;
            ctx.beginPath();
            ctx.moveTo(la.x * W, la.y * H);
            ctx.lineTo(lb.x * W, lb.y * H);
            ctx.stroke();
        }

        // Draw landmark joints
        for (const lm of landmarks) {
            if ((lm.visibility ?? 1) < 0.3) continue;
            ctx.beginPath();
            ctx.arc(lm.x * W, lm.y * H, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#f472b6";
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function startRaf() {
        function loop() {
            for (const [deviceId, canvas] of canvasElements) {
                const idx = realCameras.findIndex((c) => c.deviceId === deviceId);
                drawPose(canvas, latestPayloads.get(idx));
            }
            rafId = requestAnimationFrame(loop);
        }
        rafId = requestAnimationFrame(loop);
    }

    // ─── Sensors (mock) ──────────────────────────────────────────────────────
    type SensorStatus = "STABLE" | "NOMINAL" | "WARNING";
    type Sensor = {
        id: string;
        label: string;
        tag: string;
        status: SensorStatus;
        col1: string;
        col1Label: string;
        col2: string;
        col2Label: string;
        col3: string;
        col3Label: string;
        streamColor: string;
    };

    let sensors = $state<Sensor[]>([
        {
            id: "01",
            label: "Sensor ID 01",
            tag: "Lumbar Core",
            status: "STABLE",
            col1: "12.42",
            col1Label: "PITCH (°)",
            col2: "-1.05",
            col2Label: "YAW (°)",
            col3: "3.21",
            col3Label: "ROLL (°)",
            streamColor: "#38bdf8",
        },
        {
            id: "02",
            label: "Sensor ID 02",
            tag: "Cervical Spine",
            status: "STABLE",
            col1: "5.18",
            col1Label: "PITCH (°)",
            col2: "2.11",
            col2Label: "YAW (°)",
            col3: "-0.84",
            col3Label: "ROLL (°)",
            streamColor: "#38bdf8",
        },
        {
            id: "03",
            label: "Sensor ID 03",
            tag: "Ambient Enviro",
            status: "NOMINAL",
            col1: "22.1°C",
            col1Label: "TEMP",
            col2: "45% RH",
            col2Label: "HUM",
            col3: "0.05 CO2",
            col3Label: "AIR",
            streamColor: "#a855f7",
        },
    ]);

    function sensorStatusLabel(s: SensorStatus): string {
        if (s === "STABLE") return $_("monitor.stable");
        if (s === "NOMINAL") return $_("monitor.nominal");
        return $_("monitor.warning");
    }
    function statusStyle(s: SensorStatus) {
        if (s === "STABLE") return "text-sky-400 border-sky-400/30 bg-sky-400/10";
        if (s === "NOMINAL") return "text-purple-400 border-purple-400/30 bg-purple-400/10";
        return "text-red-400 border-red-400/30 bg-red-400/10";
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

        try {
            const active = await getActiveSession(user.id);
            activeSessionId = active ? active.id : await startSession(user.id);
        } catch (e) {
            console.error("Failed to init session:", e);
        }

        // Seed postureScore from DB average when no live data yet
        try {
            const stats = await getSessionStats(user.id);
            if (stats.avg_score) postureScore = Math.round(stats.avg_score);
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
        connectWs();
        startRaf();

        const interval = setInterval(() => {
            if (!hasLiveData) {
                latency = parseFloat((0.02 + Math.random() * 0.05).toFixed(2));
                blinks = Math.round(12 + Math.random() * 5);
                fatigueScore = Math.round(8 + Math.random() * 15);
                postureScore = Math.min(
                    100,
                    Math.max(40, postureScore + Math.round((Math.random() - 0.4) * 5)),
                );
            } else {
                latency = parseFloat((0.01 + Math.random() * 0.02).toFixed(2));
                blinks = Math.round(12 + Math.random() * 5);
                fatigueScore = Math.round((100 - postureScore) * 0.3 + Math.random() * 5);
            }

            irritationLevel =
                fatigueScore > 20 ? "HIGH" : fatigueScore > 15 ? "MEDIUM" : "LOW";

            fatigueHistory = [
                ...fatigueHistory.slice(1),
                { x: fatigueHistory.length, value: fatigueScore },
            ];

            sensors = sensors.map((s) => {
                if (s.id === "01" || s.id === "02") {
                    return {
                        ...s,
                        col1: (parseFloat(s.col1) + (Math.random() - 0.5) * 0.2).toFixed(2),
                    };
                }
                return s;
            });

            // Posture warning — max one every 30s
            if (
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
            ws?.close();
            ws = null;
            for (const stream of streams.values()) {
                stream.getTracks().forEach((t) => t.stop());
            }
            if (activeSessionId) {
                endSession(activeSessionId, {
                    posture_score: postureScore,
                    fatigue_score: fatigueScore,
                    eye_distance: 60,
                    blink_rate: blinks,
                }).catch(() => {});
            }
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
                            <!-- Video + canvas overlay container -->
                            <div class="relative w-full h-full">
                                <!-- svelte-ignore a11y-media-has-caption -->
                                <video
                                    use:videoAction={currentCam.deviceId}
                                    autoplay
                                    playsinline
                                    muted
                                    class="w-full h-full object-cover"
                                ></video>
                                <canvas
                                    use:canvasAction={currentCam.deviceId}
                                    class="absolute inset-0 w-full h-full pointer-events-none"
                                ></canvas>
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
                            {@const cam = realCameras[idx]}
                            <div class="relative bg-slate-800 overflow-hidden">
                                {#if cam}
                                    <div class="relative w-full h-full">
                                        <!-- svelte-ignore a11y-media-has-caption -->
                                        <video
                                            use:videoAction={cam.deviceId}
                                            autoplay
                                            playsinline
                                            muted
                                            class="w-full h-full object-cover"
                                        ></video>
                                        <canvas
                                            use:canvasAction={cam.deviceId}
                                            class="absolute inset-0 w-full h-full pointer-events-none"
                                        ></canvas>
                                    </div>
                                    <div
                                        class="absolute bottom-1 left-1 text-[8px] text-white/60 font-mono bg-black/40 px-1 rounded"
                                    >
                                        CAM-{String(idx + 1).padStart(2, "0")}
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
                            <div
                                class="flex items-center justify-between px-3 py-2.5 rounded-xl
                                bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                            >
                                <div class="flex items-center gap-2.5">
                                    <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                                    <div>
                                        <p class="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">
                                            {cam.label || `Camera ${idx + 1}`}
                                        </p>
                                        <p class="text-[10px] text-slate-400 font-mono">
                                            CAM-{String(idx + 1).padStart(3, "0")}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/20"
                                >
                                    {$_("monitor.live")}
                                </span>
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
                    <!-- Posture Detection -->
                    <div
                        class="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <div
                            class="w-16 h-16 rounded-full border-2 border-sky-400/30 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 text-sky-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <circle cx="12" cy="4" r="2" /><path
                                    d="M12 7v6l-3 4m3-4 3 4"
                                /><path d="M9 11H7m10 0h-2" />
                            </svg>
                        </div>
                        <div class="text-center">
                            <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">
                                {$_("monitor.postureDetection")}
                            </p>
                            <p
                                class="text-lg font-bold
                                {postureStatus === 'Optimal'
                                    ? 'text-sky-400'
                                    : postureStatus === 'Fair'
                                      ? 'text-yellow-400'
                                      : 'text-red-400'}"
                            >
                                {postureStatus}
                            </p>
                            <div
                                class="mt-2 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
                            >
                                <div
                                    class="h-full rounded-full transition-all duration-700"
                                    style="width: {postureScore}%; background: {postureScore >= 80
                                        ? '#38bdf8'
                                        : postureScore >= 60
                                          ? '#eab308'
                                          : '#ef4444'}"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <!-- Eye Health Metrics -->
                    <div
                        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                            {$_("monitor.eyeHealth")}
                        </p>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 dark:text-slate-400">
                                    {$_("monitor.irritation")}
                                </span>
                                <span
                                    class="text-xs font-bold {irritationStyle(irritationLevel)}"
                                >
                                    {irritationLevel}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 dark:text-slate-400">
                                    {$_("monitor.blinks")}
                                </span>
                                <span
                                    class="text-xs font-bold text-slate-700 dark:text-white tabular-nums"
                                >
                                    {blinks}
                                    <span class="text-slate-400 font-normal">BPM</span>
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 dark:text-slate-400">
                                    {$_("monitor.gaze")}
                                </span>
                                <span class="text-xs font-bold text-green-400">
                                    {$_("monitor.focused")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Fatigue Score + Sparkline -->
                    <div
                        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between"
                    >
                        <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            {$_("monitor.fatigue")}
                        </p>
                        <div>
                            <p class="text-4xl font-bold text-slate-800 dark:text-white tabular-nums">
                                {fatigueScore}<span class="text-base text-slate-400 font-normal"
                                    >/100</span
                                >
                            </p>
                        </div>
                        <div class="h-12 text-sky-400 mt-2">
                            <LineChart
                                data={fatigueHistory}
                                x="x"
                                y="value"
                                padding={{ top: 4, bottom: 4, left: 0, right: 0 }}
                                lineProps={{ class: "stroke-sky-400 stroke-2" }}
                            />
                        </div>
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

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800">
                        {#each [
                            $_("monitor.sensorNode"),
                            $_("monitor.status"),
                            "",
                            "",
                            "",
                            $_("monitor.dataStream"),
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
                            class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                            <td class="py-3.5 pr-8">
                                <div class="flex items-center gap-2.5">
                                    <div
                                        class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sky-400"
                                    >
                                        <Circle class="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <span
                                            class="text-sm font-semibold text-slate-800 dark:text-white"
                                        >
                                            {s.label}
                                        </span>
                                        <span class="ml-2 text-xs text-slate-400">
                                            ({s.tag})
                                        </span>
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
                                <p
                                    class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5"
                                >
                                    {s.col1Label}
                                </p>
                                <p
                                    class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums"
                                >
                                    {s.col1}
                                </p>
                            </td>
                            <td class="py-3.5 pr-4">
                                <p
                                    class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5"
                                >
                                    {s.col2Label}
                                </p>
                                <p
                                    class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums"
                                >
                                    {s.col2}
                                </p>
                            </td>
                            <td class="py-3.5 pr-4">
                                <p
                                    class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5"
                                >
                                    {s.col3Label}
                                </p>
                                <p
                                    class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums"
                                >
                                    {s.col3}
                                </p>
                            </td>
                            <td class="py-3.5">
                                <div
                                    class="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
                                >
                                    <div
                                        class="h-full rounded-full animate-pulse"
                                        style="width: 65%; background: {s.streamColor}"
                                    ></div>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
