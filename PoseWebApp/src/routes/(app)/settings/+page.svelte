<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _, locale } from "svelte-i18n";
    import { theme, type ThemeMode } from "$lib/stores/theme";
    import { getUser, updateUser, type User } from "$lib/db";
    import { getCurrentUser } from "$lib/auth";

    // --- State ---
    let user = $state<User | null>(null);
    let loading = $state(true);
    let saving = $state(false);
    let saved = $state(false);
    let checking = $state(false);

    onMount(async () => {
        // --- Session guard ---
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }
        user = current;
        loading = false;
    });

    // --- Language switcher ---
    const languages = [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
    ];

    function setLocale(code: string) {
        locale.set(code);
        localStorage.setItem("locale", code);
    }

    // --- Cameras ---
    type CameraStatus = "ACTIVE DEVICE" | "STANDBY" | "DISCONNECTED";
    let cameras = $state([
        {
            id: "cam-1",
            label: "FaceTime HD Camera",
            sub: "Built-in • 1080p",
            active: true,
            status: "ACTIVE DEVICE" as CameraStatus,
        },
        {
            id: "cam-2",
            label: "External USB WebCam",
            sub: "Logitech C920 • 4K",
            active: false,
            status: "STANDBY" as CameraStatus,
        },
    ]);

    function selectCamera(id: string) {
        cameras = cameras.map((c) => ({
            ...c,
            active: c.id === id,
            status: (c.id === id ? "ACTIVE DEVICE" : "STANDBY") as CameraStatus,
        }));
    }

    // --- Sensors ---
    type SensorStatus = "ONLINE" | "OFFLINE";
    let sensors = $state([
        {
            id: "GL-9281",
            label: "Spinal Alignment Sensor",
            signal: "98%",
            status: "ONLINE" as SensorStatus,
        },
        {
            id: "GL-0432",
            label: "Lower Back Lumbar Pod",
            signal: "82%",
            status: "ONLINE" as SensorStatus,
        },
        {
            id: "GL-1100",
            label: "Neck Strain Monitor",
            signal: "--",
            status: "OFFLINE" as SensorStatus,
        },
    ]);

    // --- Notifications ---
    let notifications = $state([
        { id: "posture", enabled: true },
        { id: "weekly", enabled: true },
        { id: "stretch", enabled: true },
        { id: "drift", enabled: false },
    ]);

    // --- Preferences ---
    let units = $state<"metric" | "imperial">("metric");
    let postureGoal = $state(80);

    $effect(() => {
        if (user) postureGoal = user.posture_goal;
    });

    // --- AI ---
    let precision = $state<"High" | "Balanced" | "Low">("High");

    // --- Save ---
    async function saveChanges() {
        if (!user) return;
        saving = true;
        try {
            await updateUser(user.id, { posture_goal: postureGoal });
            saved = true;
            setTimeout(() => (saved = false), 2500);
        } finally {
            saving = false;
        }
    }

    function checkUpdates() {
        checking = true;
        setTimeout(() => (checking = false), 2000);
    }

    const firmware = "v4.82.0-stable";
    const lastBackup = "2 minutes ago";
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_("settings.title")}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {$_("settings.subtitle")}
            </p>
        </div>
        <div class="flex gap-2 items-center">
            {#if saved}
                <span
                    class="flex items-center gap-1.5 text-sm text-green-500 font-medium"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {$_("common.saved")}
                </span>
            {/if}
            <button
                onclick={() => {}}
                class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                {$_("settings.restore")}
            </button>
            <button
                onclick={saveChanges}
                disabled={saving || loading}
                class="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold transition-all shadow-lg shadow-sky-400/20 active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
                {#if saving}
                    <svg
                        class="w-4 h-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                {/if}
                {$_("common.save")}
            </button>
        </div>
    </div>

    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div
                class="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
            ></div>
        </div>
    {:else}
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
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("settings.camera")}
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
                                flex items-center justify-center shrink-0 transition-colors"
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
                                                class="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center shrink-0"
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
                                    <p class="text-xs text-slate-400">
                                        {cam.sub}
                                    </p>
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
                                        >
                                            {cam.active
                                                ? $_("settings.status.active")
                                                : $_("settings.status.standby")}
                                        </span>
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
                                {$_("settings.sensors")}
                            </h2>
                        </div>
                        <span class="text-xs text-slate-400">
                            {$_("settings.connected", {
                                values: {
                                    n: sensors.filter(
                                        (s) => s.status === "ONLINE",
                                    ).length,
                                },
                            })}
                        </span>
                    </div>
                    <div class="space-y-2">
                        {#each sensors as s}
                            <div
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl
                            bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700
                            {s.status === 'OFFLINE' ? 'opacity-60' : ''}"
                            >
                                <span
                                    class="text-xs font-mono text-slate-400 w-20 shrink-0"
                                    >ID: {s.id}</span
                                >
                                <span
                                    class="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1"
                                    >{s.label}</span
                                >
                                <span class="text-xs text-slate-400 mr-2">
                                    {$_("settings.signal", {
                                        values: { val: s.signal },
                                    })}
                                </span>
                                <span
                                    class="text-[10px] font-bold px-2 py-0.5 rounded-md
                                {s.status === 'ONLINE'
                                        ? 'text-green-500 bg-green-500/10 border border-green-500/20'
                                        : 'text-slate-400 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600'}"
                                >
                                    {s.status === "ONLINE"
                                        ? $_("settings.status.online")
                                        : $_("settings.status.offline")}
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
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("settings.notifications")}
                        </h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {#each notifications as n}
                            <div
                                class="flex items-center justify-between px-3 py-2.5 rounded-xl
                            bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                            >
                                <div class="mr-3">
                                    <p
                                        class="text-sm font-medium text-slate-700 dark:text-slate-200"
                                    >
                                        {$_(`settings.notifs.${n.id}`)}
                                    </p>
                                    <p class="text-xs text-slate-400">
                                        {$_(`settings.notifs.${n.id}_sub`)}
                                    </p>
                                </div>
                                <button
                                    onclick={() => (n.enabled = !n.enabled)}
                                    class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
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
                                {$_("settings.cloud")}
                            </p>
                            <p class="text-xs text-slate-400">
                                {$_("settings.last_backup", {
                                    values: { time: lastBackup },
                                })}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div>
                            <p
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                            >
                                {$_("settings.firmware")}
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
                            {checking
                                ? $_("settings.checking")
                                : $_("settings.check_updates")}
                        </button>
                    </div>
                </div>

                <!-- Reset Setup -->
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm px-5 py-4 flex items-center justify-between gap-4"
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
                                <path
                                    d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                                />
                                <path d="M3 3v5h5" />
                            </svg>
                        </div>
                        <div>
                            <p
                                class="text-sm font-semibold text-slate-800 dark:text-white"
                            >
                                {$_("settings.setup")}
                            </p>
                            <p class="text-xs text-slate-400">
                                {$_("settings.setup_sub")}
                            </p>
                        </div>
                    </div>
                    <button
                        onclick={() => goto("/onboarding")}
                        class="px-4 py-2 rounded-xl text-sm font-medium
                        bg-slate-100 dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        text-slate-700 dark:text-slate-200
                        hover:border-sky-400 hover:text-sky-400
                        transition-all active:scale-95"
                    >
                        {$_("settings.launch_setup")}
                    </button>
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
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("settings.preferences")}
                        </h2>
                    </div>

                    <!-- Theme -->
                    <div class="mb-5">
                        <p
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            {$_("settings.theme")}
                        </p>
                        <div class="flex gap-2">
                            {#each [["light", "☀️", $_("settings.light")], ["dark", "🌙", $_("settings.dark")], ["system", "💻", $_("settings.system")]] as [val, emoji, label]}
                                <button
                                    onclick={() => theme.set(val as ThemeMode)}
                                    class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all
                                    {$theme === val
                                        ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'}"
                                >
                                    <span class="text-base">{emoji}</span>
                                    {label}
                                </button>
                            {/each}
                        </div>
                        {#if $theme === "system"}
                            <p
                                class="text-[10px] text-slate-400 mt-2 text-center"
                            >
                                {$_("settings.system_theme")}
                            </p>
                        {/if}
                    </div>

                    <!-- Language -->
                    <div class="mb-5">
                        <p
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            {$_("settings.language")}
                        </p>
                        <div class="flex gap-2">
                            {#each languages as lang}
                                <button
                                    onclick={() => setLocale(lang.code)}
                                    class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                                    {$locale === lang.code
                                        ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'}"
                                >
                                    {lang.label}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Display Units -->
                    <div class="mb-5">
                        <p
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            {$_("settings.units")}
                        </p>
                        <div class="flex gap-2">
                            {#each [["metric", $_("settings.metric")], ["imperial", $_("settings.imperial")]] as [val, label]}
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

                    <!-- Posture Goal -->
                    {#if user}
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <p
                                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                >
                                    {$_("settings.posture_goal")}
                                </p>
                                <span class="text-xs font-bold text-sky-400"
                                    >{postureGoal}/100</span
                                >
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                step="5"
                                bind:value={postureGoal}
                                class="w-full accent-sky-400"
                            />
                        </div>
                    {/if}
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
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("settings.ai")}
                        </h2>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">
                        {$_("settings.ai_desc")}
                    </p>
                    <div
                        class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 mb-4"
                    >
                        <div class="flex items-center gap-2 mb-3">
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded-full bg-sky-400/10"
                                >{$_("settings.dynamic")}</span
                            >
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-full bg-purple-400/10"
                                >{$_("settings.beta")}</span
                            >
                        </div>
                        <div class="flex items-center justify-between">
                            <span
                                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                                >{$_("settings.precision")}</span
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
                        {$_("settings.configure_ai")}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
