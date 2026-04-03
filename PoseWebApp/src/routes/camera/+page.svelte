<script lang="ts">
    import { onMount } from "svelte";
    import { LineChart, defaultChartPadding } from "layerchart";

    // --- Latency / status ---
    let latency = $state(0.04);
    let postureStatus = $state<"Optimal" | "Fair" | "Poor">("Optimal");
    let blinks = $state(14);
    let gazeStatus = $state("Focused");
    let fatigueScore = $state(12);
    let irritationLevel = $state<"LOW" | "MEDIUM" | "HIGH">("LOW");

    // --- Fatigue sparkline ---
    type DataPoint = { x: number; value: number };
    let fatigueHistory = $state<DataPoint[]>(
        Array.from({ length: 20 }, (_, i) => ({
            x: i,
            value: Math.round(8 + Math.random() * 10),
        })),
    );

    // --- Cameras ---
    let cameras = $state([
        {
            id: "CAM-001",
            label: "Primary Desk Cam",
            sub: "4K HDR",
            connected: true,
            enabled: true,
        },
        {
            id: "CAM-002",
            label: "Side Profile Cam",
            sub: "1080P",
            connected: true,
            enabled: true,
        },
        {
            id: "CAM-003",
            label: "External Wide",
            sub: "Disconnected",
            connected: false,
            enabled: false,
        },
    ]);

    let activeCams = $derived(
        cameras.filter((c) => c.connected && c.enabled).length,
    );

    let viewMode = $state<"single" | "2x2" | "3x3">("single");
    let currentCamIndex = $state(0);
    let currentCam = $derived(cameras[currentCamIndex] || null);

    $effect(() => {
        if (activeCams > 0 && currentCamIndex >= activeCams) {
            currentCamIndex = activeCams - 1;
        }
    });

    // 5. Funciones de navegación (Carrusel infinito)
    function nextCam() {
        if (activeCams > 0) {
            currentCamIndex = (currentCamIndex + 1) % activeCams;
        }
    }

    function prevCam() {
        if (activeCams > 0) {
            currentCamIndex = (currentCamIndex - 1 + activeCams) % activeCams;
        }
    }

    // Auto-reset view if cameras change
    $effect(() => {
        if (activeCams <= 1 && viewMode !== "single") viewMode = "single";
    });

    // --- Sensors ---
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

    function statusStyle(s: SensorStatus) {
        if (s === "STABLE")
            return "text-sky-400 border-sky-400/30 bg-sky-400/10";
        if (s === "NOMINAL")
            return "text-purple-400 border-purple-400/30 bg-purple-400/10";
        return "text-red-400 border-red-400/30 bg-red-400/10";
    }

    function irritationStyle(l: "LOW" | "MEDIUM" | "HIGH") {
        if (l === "LOW") return "text-green-400";
        if (l === "MEDIUM") return "text-yellow-400";
        return "text-red-400";
    }

    // --- Live simulation ---
    onMount(() => {
        const interval = setInterval(() => {
            latency = parseFloat((0.02 + Math.random() * 0.05).toFixed(2));
            blinks = Math.round(12 + Math.random() * 5);
            fatigueScore = Math.round(8 + Math.random() * 15);

            // update sparkline
            fatigueHistory = [
                ...fatigueHistory.slice(1),
                { x: fatigueHistory.length, value: fatigueScore },
            ];

            // nudge sensor values
            sensors = sensors.map((s) => {
                if (s.id === "01" || s.id === "02") {
                    const nudge = () =>
                        (
                            parseFloat(s.col1) +
                            (Math.random() - 0.5) * 0.2
                        ).toFixed(2);
                    return { ...s, col1: nudge() };
                }
                return s;
            });
        }, 1500);
        return () => clearInterval(interval);
    });
</script>

<div
    class="flex-1 p-6 overflow-y-hidden bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                Ergonomic Engine <span class="text-sky-400">v2.4</span>
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time posture monitoring and environmental telemetry.
            </p>
        </div>
        <div
            class="hidden md:flex items-center gap-3 text-xs font-mono text-slate-400"
        >
            <span class="flex items-center gap-1.5">
                <span
                    class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                ></span>
                {latency}MS LATENCY
            </span>
            <span class="text-slate-600 dark:text-slate-600">•</span>
            <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"
                ></span>
                NEURAL CORE ACTIVE
            </span>
        </div>
    </div>

    <!-- Top row: AI Metrics | Camera Signals | Camera Monitor -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <!-- Camera Monitor -->
        <div
            class="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col"
        >
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"
                    ></span>
                    <h2
                        class="text-xs font-bold uppercase tracking-widest text-sky-400"
                    >
                        Camera Monitor
                    </h2>
                </div>
                <!-- View mode buttons -->
                <div
                    class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5"
                >
                    {#each [["single", "Single"], ["2x2", "2×2"], ["3x3", "3×3"]] as [mode, label]}
                        {@const disabled =
                            (activeCams <= 1 && mode !== "single") ||
                            (activeCams <= 4 && mode === "3x3") ||
                            (activeCams <= 2 && mode === "2x2")}
                        <button
                            onclick={() =>
                                !disabled &&
                                (viewMode = mode as typeof viewMode)}
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

            <!-- Feed -->
            <div
                class="rounded-xl overflow-hidden bg-slate-900 dark:bg-slate-950 relative
                    {viewMode === 'single'
                    ? 'h-full'
                    : viewMode === '2x2'
                      ? 'h-full'
                      : 'h-full'}
                    transition-all duration-300"
            >
                {#if activeCams === 0}
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-8 h-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <line x1="1" y1="1" x2="23" y2="23" />
                            <path
                                d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"
                            />
                        </svg>
                        <p class="text-xs">No cameras connected</p>
                    </div>
                {:else if viewMode === "single"}
                    <div
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <div
                            class="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-1 relative"
                        >
                            <div class="text-center z-10">
                                <div
                                    class="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-8 h-8 text-sky-400/50"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    >
                                        <path d="M23 7l-7 5 7 5V7z" /><rect
                                            x="1"
                                            y="5"
                                            width="15"
                                            height="14"
                                            rx="2"
                                        />
                                    </svg>
                                </div>
                                <p class="text-[10px] text-slate-500 font-mono">
                                    LIVE FEED ACTIVE: {currentCam?.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full"
                    >
                        <span
                            class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                        ></span>
                        <span
                            class="text-[9px] text-white font-bold uppercase tracking-wider"
                        >
                            Live • {currentCam?.label ?? "—"}
                        </span>
                    </div>

                    <button
                        onclick={prevCam}
                        class="absolute top-1/2 left-5 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full cursor-pointer z-20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <button
                        onclick={nextCam}
                        class="absolute top-1/2 right-5 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full cursor-pointer z-20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                {:else}
                    <!-- Grid feed -->
                    {@const activeCams = cameras.filter(
                        (c) => c.connected && c.enabled,
                    )}
                    {@const cols = viewMode === "2x2" ? 2 : 3}
                    <div
                        class="grid h-full gap-0.5"
                        style="grid-template-columns: repeat({cols}, 1fr)"
                    >
                        {#each Array.from({ length: cols * cols }) as _, idx}
                            {@const cam = activeCams[idx]}
                            <div
                                class="relative bg-slate-800 flex items-center justify-center"
                            >
                                {#if cam}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-5 h-5 text-sky-400/30"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    >
                                        <path d="M23 7l-7 5 7 5V7z" /><rect
                                            x="1"
                                            y="5"
                                            width="15"
                                            height="14"
                                            rx="2"
                                        />
                                    </svg>
                                    <div
                                        class="absolute bottom-1 left-1 text-[8px] text-white/50 font-mono"
                                    >
                                        {cam.id}
                                    </div>
                                {:else}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-4 h-4 text-slate-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    >
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                        <path
                                            d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Right column: Camera Signals + Camera Monitor -->
        <div class="lg:col-span-2 flex flex-col gap-4">
            <!-- Camera Signals -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-4">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"
                    ></span>
                    <h2
                        class="text-xs font-bold uppercase tracking-widest text-sky-400"
                    >
                        Camera Signals
                    </h2>
                </div>

                <div class="space-y-2 mb-4">
                    {#each cameras as cam}
                        <div
                            class="flex items-center justify-between px-3 py-2.5 rounded-xl
                            {cam.connected
                                ? 'bg-slate-50 dark:bg-slate-800'
                                : 'bg-slate-50/50 dark:bg-slate-800/50 opacity-50'}
                            border border-slate-100 dark:border-slate-700"
                        >
                            <div class="flex items-center gap-2.5">
                                <span
                                    class="w-2 h-2 rounded-full {cam.connected
                                        ? 'bg-sky-400'
                                        : 'bg-slate-400'}"
                                ></span>
                                <div>
                                    <p
                                        class="text-xs font-semibold text-slate-800 dark:text-white"
                                    >
                                        {cam.label}
                                    </p>
                                    <p
                                        class="text-[10px] text-slate-400 font-mono"
                                    >
                                        ID: {cam.id} • {cam.sub}
                                    </p>
                                </div>
                            </div>
                            {#if cam.connected}
                                <button
                                    onclick={() => (cam.enabled = !cam.enabled)}
                                    class="relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0
                                        {cam.enabled
                                        ? 'bg-sky-400'
                                        : 'bg-slate-200 dark:bg-slate-600'}"
                                >
                                    <span
                                        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                        {cam.enabled
                                            ? 'translate-x-4'
                                            : 'translate-x-0'}"
                                    >
                                    </span>
                                </button>
                            {/if}
                        </div>
                    {/each}
                </div>

                <button
                    class="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                    bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    text-xs font-medium text-slate-600 dark:text-slate-300
                    hover:border-sky-400 hover:text-sky-400 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10" /><line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="16"
                        /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Register New Node
                </button>
            </div>

            <!-- Real-Time AI Metrics -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex-1"
            >
                <div class="flex items-center gap-2 mb-5">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"
                    ></span>
                    <h2
                        class="text-xs font-bold uppercase tracking-widest text-sky-400"
                    >
                        Real-Time AI Metrics
                    </h2>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <!-- Posture detection -->
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
                            <p
                                class="text-xs text-slate-400 uppercase tracking-wider mb-1"
                            >
                                Posture Detection
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
                                    class="h-full rounded-full bg-sky-400 transition-all duration-700"
                                    style="width: {postureStatus === 'Optimal'
                                        ? 92
                                        : postureStatus === 'Fair'
                                          ? 60
                                          : 30}%"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <!-- Eye Health Metrics -->
                    <div
                        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <p
                            class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4"
                        >
                            Eye Health Metrics
                        </p>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-xs text-slate-500 dark:text-slate-400"
                                    >Irritation Level</span
                                >
                                <span
                                    class="text-xs font-bold {irritationStyle(
                                        irritationLevel,
                                    )}">{irritationLevel}</span
                                >
                            </div>
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-xs text-slate-500 dark:text-slate-400"
                                    >Blinks Per Minute</span
                                >
                                <span
                                    class="text-xs font-bold text-slate-700 dark:text-white tabular-nums"
                                >
                                    {blinks}
                                    <span class="text-slate-400 font-normal"
                                        >BPM</span
                                    >
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-xs text-slate-500 dark:text-slate-400"
                                    >Gaze Status</span
                                >
                                <span class="text-xs font-bold text-green-400"
                                    >{gazeStatus}</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Fatigue Score -->
                    <div
                        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between"
                    >
                        <p
                            class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            Fatigue Score
                        </p>
                        <div>
                            <p
                                class="text-4xl font-bold text-slate-800 dark:text-white tabular-nums"
                            >
                                {fatigueScore}<span
                                    class="text-base text-slate-400 font-normal"
                                    >/100</span
                                >
                            </p>
                        </div>
                        <!-- Sparkline -->
                        <div class="h-12 text-sky-400 mt-2">
                            <LineChart
                                data={fatigueHistory}
                                x="x"
                                y="value"
                                padding={{
                                    top: 4,
                                    bottom: 4,
                                    left: 0,
                                    right: 0,
                                }}
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
                <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"
                ></span>
                <h2
                    class="text-xs font-bold uppercase tracking-widest text-sky-400"
                >
                    Sensor Telemetry Cluster
                </h2>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-400">
                <span class="flex items-center gap-1.5"
                    ><span class="w-2 h-2 rounded-full bg-red-400"
                    ></span>Environmental</span
                >
                <span class="flex items-center gap-1.5"
                    ><span class="w-2 h-2 rounded-full bg-sky-400"
                    ></span>Kinetic</span
                >
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800">
                        {#each ["Sensor Node", "Status", "", "", "", "Data Stream"] as col}
                            <th
                                class="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4 first:pr-8"
                                >{col}</th
                            >
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-3.5 h-3.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
                                            /><path d="M12 8v4l3 3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span
                                            class="text-sm font-semibold text-slate-800 dark:text-white"
                                            >{s.label}</span
                                        >
                                        <span
                                            class="ml-2 text-xs text-slate-400"
                                            >({s.tag})</span
                                        >
                                    </div>
                                </div>
                            </td>
                            <td class="py-3.5 pr-4">
                                <span
                                    class="text-xs font-bold px-2.5 py-1 rounded-md border {statusStyle(
                                        s.status,
                                    )}">{s.status}</span
                                >
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
                                <!-- Animated data stream bar -->
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
