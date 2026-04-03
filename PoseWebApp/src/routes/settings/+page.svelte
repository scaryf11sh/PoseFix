<script lang="ts">
    import { theme, type ThemeMode } from "$lib/stores/theme";
    // --- Cameras ---
    type Camera = {
        id: string;
        label: string;
        sub: string;
        active: boolean;
        status: "ACTIVE DEVICE" | "STANDBY" | "DISCONNECTED";
    };
    let cameras = $state<Camera[]>([
        {
            id: "cam-1",
            label: "FaceTime HD Camera",
            sub: "Built-in • 1080p",
            active: true,
            status: "ACTIVE DEVICE",
        },
        {
            id: "cam-2",
            label: "External USB WebCam",
            sub: "Logitech C920 • 4K",
            active: false,
            status: "STANDBY",
        },
    ]);

    function selectCamera(id: string) {
        cameras = cameras.map((c) => ({
            ...c,
            active: c.id === id,
            status: c.id === id ? "ACTIVE DEVICE" : "STANDBY",
        }));
    }

    // --- Sensors ---
    type SensorStatus = "ONLINE" | "OFFLINE";
    type Sensor = {
        id: string;
        label: string;
        signal: string;
        status: SensorStatus;
    };
    let sensors = $state<Sensor[]>([
        {
            id: "GL-9281",
            label: "Spinal Alignment Sensor",
            signal: "98%",
            status: "ONLINE",
        },
        {
            id: "GL-0432",
            label: "Lower Back Lumbar Pod",
            signal: "82%",
            status: "ONLINE",
        },
        {
            id: "GL-1100",
            label: "Neck Strain Monitor",
            signal: "--",
            status: "OFFLINE",
        },
    ]);

    // --- Notifications ---
    let notifications = $state([
        {
            id: "posture",
            label: "Posture Alerts",
            sub: "Real-time haptic feedback",
            enabled: true,
        },
        {
            id: "weekly",
            label: "Weekly AI Analysis",
            sub: "Email & push summaries",
            enabled: true,
        },
        {
            id: "stretch",
            label: "Stretch Reminders",
            sub: "Every 45 minutes of activity",
            enabled: true,
        },
        {
            id: "drift",
            label: "Critical Drift Alerts",
            sub: "Warning when spinal load is too high",
            enabled: false,
        },
    ]);

    // --- Preferences ---
    let language = $state("English (United States)");
    let units = $state<"metric" | "imperial">("metric");

    // --- AI Mode ---
    let aiEnabled = $state(true);
    let precision = $state<"High" | "Balanced" | "Low">("High");

    // --- Cloud / Firmware ---
    let lastBackup = "2 minutes ago";
    let firmware = "v4.82.0-stable";
    let checking = $state(false);

    function checkUpdates() {
        checking = true;
        setTimeout(() => (checking = false), 2000);
    }

    let saved = $state(false);
    function saveChanges() {
        saved = true;
        setTimeout(() => (saved = false), 2500);
    }
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                System Configuration
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage hardware sensors and application preferences.
            </p>
        </div>
        <div class="flex gap-2">
            <button
                class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                Restore Defaults
            </button>
            <button
                onclick={saveChanges}
                class="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold transition-all shadow-lg shadow-sky-400/20 active:scale-95"
            >
                {#if saved}✓ Saved{:else}Save Changes{/if}
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <!-- Left column -->
        <div class="lg:col-span-3 flex flex-col gap-4">
            <!-- Camera Selection -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-4">
                    <div
                        class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
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
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        Camera Selection
                    </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {#each cameras as cam}
                        <button
                            onclick={() => selectCamera(cam.id)}
                            class="flex items-center gap-3 p-3 rounded-xl text-left transition-all
                                {cam.active
                                ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-700'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}
                                border"
                        >
                            <div
                                class="w-10 h-10 rounded-xl
                                {cam.active
                                    ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-400'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                                flex items-center justify-center flex-shrink-0 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
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
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <p
                                        class="text-sm font-semibold text-slate-800 dark:text-white truncate"
                                    >
                                        {cam.label}
                                    </p>
                                    {#if cam.active}
                                        <div
                                            class="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center flex-shrink-0"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-3 h-3 text-white"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="3"
                                            >
                                                <polyline
                                                    points="20 6 9 17 4 12"
                                                />
                                            </svg>
                                        </div>
                                    {/if}
                                </div>
                                <p class="text-xs text-slate-400">{cam.sub}</p>
                                <div class="flex items-center gap-1.5 mt-1">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full {cam.active
                                            ? 'bg-sky-400'
                                            : 'bg-slate-400'}"
                                    ></span>
                                    <span
                                        class="text-[10px] font-bold uppercase tracking-wider {cam.active
                                            ? 'text-sky-400'
                                            : 'text-slate-400'}"
                                        >{cam.status}</span
                                    >
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Active Sensors -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <div
                            class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            Active Sensors
                        </h2>
                    </div>
                    <span class="text-xs text-slate-400">
                        {sensors.filter((s) => s.status === "ONLINE").length} Devices
                        Connected
                    </span>
                </div>

                <div class="space-y-2">
                    {#each sensors as s}
                        <div
                            class="flex items-center gap-3 px-3 py-2.5 rounded-xl
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-100 dark:border-slate-700
                            {s.status === 'OFFLINE' ? 'opacity-60' : ''}"
                        >
                            <span
                                class="text-xs font-mono text-slate-400 w-20 flex-shrink-0"
                                >ID: {s.id}</span
                            >
                            <span
                                class="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1"
                                >{s.label}</span
                            >
                            <span class="text-xs text-slate-400 mr-2"
                                >Signal: {s.signal}</span
                            >
                            <span
                                class="text-[10px] font-bold px-2 py-0.5 rounded-md
                                {s.status === 'ONLINE'
                                    ? 'text-green-500 bg-green-500/10 border border-green-500/20'
                                    : 'text-slate-400 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600'}"
                            >
                                {s.status}
                            </span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Notification Rules -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-4">
                    <div
                        class="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                            />
                        </svg>
                    </div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        Notification Rules
                    </h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {#each notifications as n}
                        <div
                            class="flex items-center justify-between px-3 py-2.5 rounded-xl
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-100 dark:border-slate-700"
                        >
                            <div class="mr-3">
                                <p
                                    class="text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    {n.label}
                                </p>
                                <p class="text-xs text-slate-400">{n.sub}</p>
                            </div>
                            <button
                                onclick={() => (n.enabled = !n.enabled)}
                                class="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0
                                    {n.enabled
                                    ? 'bg-sky-400'
                                    : 'bg-slate-200 dark:bg-slate-600'}"
                            >
                                <span
                                    class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                    {n.enabled
                                        ? 'translate-x-5'
                                        : 'translate-x-0'}"
                                >
                                </span>
                            </button>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Cloud Sync & Firmware -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="16 17 21 12 16 7" /><path
                                d="M21 12H9"
                            /><path
                                d="M9 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"
                            />
                        </svg>
                    </div>
                    <div>
                        <p
                            class="text-sm font-semibold text-slate-800 dark:text-white"
                        >
                            Cloud Sync Enabled
                        </p>
                        <p class="text-xs text-slate-400">
                            Last backup: {lastBackup}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div>
                        <p
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                        >
                            Firmware Version
                        </p>
                        <p
                            class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200"
                        >
                            {firmware}
                        </p>
                    </div>
                    <button
                        onclick={checkUpdates}
                        disabled={checking}
                        class="px-4 py-2 rounded-xl text-sm font-medium
                            bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                            border border-slate-200 dark:border-slate-700
                            text-slate-700 dark:text-slate-200
                            disabled:opacity-60 transition-all active:scale-95"
                    >
                        {checking ? "Checking..." : "Check for Updates"}
                    </button>
                </div>
            </div>
        </div>

        <!-- Right column -->
        <div class="lg:col-span-2 flex flex-col gap-4">
            <!-- Preferences -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-5">
                    <div
                        class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="3" /><path
                                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                            />
                        </svg>
                    </div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        Preferences
                    </h2>
                </div>

                <!-- Theme -->
                <div class="mb-5">
                    <p
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
                    >
                        Interface Theme
                    </p>
                    <div class="flex gap-2">
                        {#each [{ val: "light", emoji: "☀️", label: "Light" }, { val: "dark", emoji: "🌙", label: "Dark" }, { val: "system", emoji: "💻", label: "System" }] as opt}
                            <button
                                onclick={() => theme.set(opt.val as ThemeMode)}
                                class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all
                    {$theme === opt.val
                                    ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'}"
                            >
                                <span class="text-base">{opt.emoji}</span>
                                {opt.label}
                            </button>
                        {/each}
                    </div>
                    {#if $theme === "system"}
                        <p class="text-[10px] text-slate-400 mt-2 text-center">
                            Siguiendo la preferencia del sistema operativo
                        </p>
                    {/if}
                </div>

                <!-- Language -->
                <div class="mb-5">
                    <p
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
                    >
                        System Language
                    </p>
                    <div class="relative">
                        <select
                            bind:value={language}
                            class="w-full appearance-none px-3 py-2.5 rounded-xl text-sm
                                bg-slate-50 dark:bg-slate-800
                                border border-slate-200 dark:border-slate-700
                                text-slate-800 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        >
                            <option>English (United States)</option>
                            <option>Español (México)</option>
                            <option>Français</option>
                            <option>Deutsch</option>
                        </select>
                        <svg
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>

                <!-- Display Units -->
                <div>
                    <p
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
                    >
                        Display Units
                    </p>
                    <div class="flex gap-2">
                        {#each [["metric", "Metric (cm, kg)"], ["imperial", "Imperial (in, lb)"]] as [val, label]}
                            <button
                                onclick={() =>
                                    (units = val as "metric" | "imperial")}
                                class="flex-1 py-2 rounded-xl text-xs font-medium transition-all
                                    {units === val
                                    ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'}"
                            >
                                {label}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- AI Prediction Mode -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-2">
                    <div
                        class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                            />
                        </svg>
                    </div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        AI Prediction Mode
                    </h2>
                </div>

                <p class="text-xs text-slate-400 mb-4">
                    Enable predictive adjustment to anticipate posture fatigue
                    based on your daily schedule.
                </p>

                <div
                    class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 mb-4"
                >
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded-full bg-sky-400/10"
                                >Dynamic Adjust</span
                            >
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-full bg-purple-400/10"
                                >Beta</span
                            >
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span
                            class="text-sm font-medium text-slate-700 dark:text-slate-200"
                            >Adaptive Precision</span
                        >
                        <div class="flex gap-1">
                            {#each ["Low", "Balanced", "High"] as p}
                                <button
                                    onclick={() =>
                                        (precision = p as typeof precision)}
                                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all
                                        {precision === p
                                        ? 'bg-sky-400 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}"
                                >
                                    {p}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>

                <button
                    class="w-full py-2.5 rounded-xl text-sm font-bold
                    bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                    border border-slate-200 dark:border-slate-700
                    text-slate-700 dark:text-slate-200
                    transition-all active:scale-95"
                >
                    Configure AI Neural Link
                </button>
            </div>
        </div>
    </div>
</div>
