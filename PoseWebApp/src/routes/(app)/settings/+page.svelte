<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _, locale } from "svelte-i18n";
    import { theme, type ThemeMode } from "$lib/stores/theme";
    import { settingsStore } from "$lib/stores/settings";
    import { aiStore, type AiProvider, DEFAULT_MODELS } from '$lib/stores/ai';
    import { updateUser } from "$lib/db";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { bleStore } from "$lib/stores/ble";
    import { invoke } from "@tauri-apps/api/core";
    import {
        Activity,
        Bell,
        Cloud,
        RotateCcw,
        Settings2,
        Star,
        CheckCircle,
        Wifi,
        WifiOff,
        Save,
        Plus,
        Trash2,
        Play,
        Square,
        Loader,
        Link,
        Unlink,
        Camera,
        VideoOff,
        RefreshCw,
        Bluetooth,
        BluetoothOff,
        Radio,
        Signal,
    } from "@lucide/svelte";

    let loading = $state(true);
    let saving = $state(false);
    let saved = $state(false);
    let restored = $state(false);
    let checking = $state(false);
    let aiSettings = $state({ ...$aiStore });

    // ─── Language ────────────────────────────────────────────────────────────
    const languages = [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
    ];
    function setLocale(code: string) {
        locale.set(code);
        localStorage.setItem("locale", code);
    }

    // ─── BLE Sensor management ───────────────────────────────────────────────
    let bleError = $state<string | null>(null);

    async function bleScan() {
        bleError = null;
        bleStore.setScanning();
        try {
            const results = await invoke<{ address: string; name: string; rssi?: number }[]>("ble_scan");
            bleStore.setScanResults(results);
        } catch (e) {
            bleError = String(e);
            bleStore.setError(String(e));
        }
    }

    async function bleConnect(address: string) {
        bleError = null;
        bleStore.setConnecting(address);
        try {
            await invoke("ble_connect", { address });
        } catch (e) {
            bleError = String(e);
            bleStore.setError(String(e));
        }
    }

    async function bleStart() {
        try { await invoke("ble_start"); } catch (e) { bleError = String(e); }
    }

    async function bleStop() {
        try { await invoke("ble_stop"); } catch (e) { bleError = String(e); }
    }

    async function bleDisconnect() {
        try { await invoke("ble_disconnect"); } catch (e) { bleError = String(e); }
    }

    function bleStatusColor(status: string) {
        if (status === "streaming")   return "text-green-500 bg-green-500/10 border-green-500/20";
        if (status === "connected")   return "text-sky-400 bg-sky-400/10 border-sky-400/20";
        if (status === "connecting")  return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        if (status === "scanning")    return "text-purple-400 bg-purple-400/10 border-purple-400/20";
        return "text-slate-400 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600";
    }

    function rssiBar(rssi?: number) {
        if (!rssi) return 0;
        // rssi typically -100 (weak) to -40 (strong)
        return Math.max(0, Math.min(100, (rssi + 100) * (100 / 60)));
    }

    // ─── Camera management ───────────────────────────────────────────────────
    let cameraPermission = $state<"idle" | "requesting" | "granted" | "denied">("idle");
    let detectedCameras = $state<MediaDeviceInfo[]>([]);
    let enabledCameraIds = $state<Set<string>>(new Set());

    function loadCameraSettings() {
        try {
            const raw = localStorage.getItem("posefix_enabled_cameras");
            if (raw !== null) {
                // Key exists: use saved state (empty array = user disabled all)
                const ids: string[] = JSON.parse(raw);
                enabledCameraIds = new Set(ids);
            }
            // Key absent = not configured yet; enabledCameraIds stays empty
            // until detectSettingsCameras() fills it and auto-enables all
        } catch {}
    }

    function saveCameraSettings() {
        localStorage.setItem("posefix_enabled_cameras", JSON.stringify([...enabledCameraIds]));
    }

    function toggleCameraEnabled(deviceId: string) {
        const next = new Set(enabledCameraIds);
        if (next.has(deviceId)) {
            next.delete(deviceId);
        } else {
            next.add(deviceId);
        }
        enabledCameraIds = next;
        saveCameraSettings();
    }

    async function detectSettingsCameras() {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        cameraPermission = "requesting";
        try {
            const tmp = await navigator.mediaDevices.getUserMedia({ video: true });
            tmp.getTracks().forEach((t) => t.stop());
            cameraPermission = "granted";
        } catch {
            cameraPermission = "denied";
            return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        detectedCameras = devices.filter(
            (d) => d.kind === "videoinput" && !/desk\s*view/i.test(d.label),
        );
        // If settings not yet configured, enable all detected cameras by default
        if (!localStorage.getItem("posefix_enabled_cameras") && detectedCameras.length > 0) {
            enabledCameraIds = new Set(detectedCameras.map((c) => c.deviceId));
            saveCameraSettings();
        }
    }

    // ─── Notifications ───────────────────────────────────────────────────────
    let notifState = $state({ ...$settingsStore.notifications });
    const notifItems = [
        { id: "posture", key: "posture" as keyof typeof notifState },
        { id: "weekly", key: "weekly" as keyof typeof notifState },
        { id: "stretch", key: "stretch" as keyof typeof notifState },
        { id: "drift", key: "drift" as keyof typeof notifState },
    ];

    // ─── Health & Breaks ─────────────────────────────────────────────────────
    let healthState = $state({ ...$settingsStore.health });

    async function updateRustHealth() {
        try {
            await invoke("update_health_settings", {
                interval: BigInt(healthState.breakInterval),
                duration: BigInt(healthState.breakDuration),
            });
        } catch (e) {
            console.error("Failed to update Rust health settings:", e);
        }
    }

    // ─── Preferences ─────────────────────────────────────────────────────────
    let units = $state($settingsStore.units);
    let postureGoal = $state(80);
    let precision = $state<"High" | "Balanced" | "Low">("Balanced");

    function setPrecision(p: "High" | "Balanced" | "Low") {
        precision = p;
        localStorage.setItem("posefix_ai_precision", p);
    }

    // ─── Save ────────────────────────────────────────────────────────────────
    async function saveChanges() {
        const user = $userStore.user;
        if (!user) return;
        saving = true;
        try {
            await updateUser(user.id, { posture_goal: postureGoal });
            settingsStore.save({
                notifications: { ...notifState },
                health: { ...healthState },
                units,
                language: $locale ?? "en",
            });
            await updateRustHealth();
            saved = true;
            setTimeout(() => (saved = false), 2500);
        } finally {
            saving = false;
        }
    }

    function restoreDefaults() {
        settingsStore.restore();
        notifState = { posture: true, weekly: true, stretch: true, drift: false };
        healthState = { breakInterval: 60, breakDuration: 5 };
        units = "metric";
        postureGoal = 80;
        precision = "High";
        updateRustHealth();
        restored = true;
        setTimeout(() => (restored = false), 2500);
    }

    function checkUpdates() {
        checking = true;
        setTimeout(() => (checking = false), 2000);
    }

    const firmware = "v4.82.0-stable";
    const lastBackup = "2 minutes ago";

    // ─── Lifecycle ───────────────────────────────────────────────────────────
    $effect(() => { aiStore.save(aiSettings); });

    onMount(async () => {
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(current);
        postureGoal = current.posture_goal;

        loadCameraSettings();
        detectSettingsCameras();

        const savedPrecision = localStorage.getItem("posefix_ai_precision");
        if (savedPrecision === "High" || savedPrecision === "Balanced" || savedPrecision === "Low") {
            precision = savedPrecision;
        }

        loading = false;
    });
</script>

<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900">
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
                <span class="flex items-center gap-1.5 text-sm text-green-500 font-medium">
                    <CheckCircle class="w-4 h-4" />{$_("common.saved")}
                </span>
            {/if}
            {#if restored}
                <span class="flex items-center gap-1.5 text-sm text-sky-400 font-medium">
                    <RotateCcw class="w-4 h-4" />Restored
                </span>
            {/if}
            <button
                onclick={restoreDefaults}
                class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium
                    text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                    transition-colors cursor-pointer flex items-center gap-2"
            >
                <RotateCcw class="w-4 h-4" />{$_("settings.restore")}
            </button>
            <button
                onclick={saveChanges}
                disabled={saving || loading}
                class="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold
                    transition-all shadow-lg shadow-sky-400/20 active:scale-95 disabled:opacity-60
                    flex items-center gap-2 cursor-pointer"
            >
                {#if saving}
                    <Loader class="w-4 h-4 animate-spin" />
                {:else}
                    <Save class="w-4 h-4" />
                {/if}
                {$_("common.save")}
            </button>
        </div>
    </div>

    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div class="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></div>
        </div>
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <div class="lg:col-span-3 flex flex-col gap-4">

                <!-- ── Cameras section ────────────────────────────────────────── -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500">
                                <Camera class="w-4 h-4" />
                            </div>
                            <h2 class="font-semibold text-slate-800 dark:text-white">
                                {$_("settings.cameras")}
                            </h2>
                        </div>
                        <button
                            onclick={detectSettingsCameras}
                            class="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                            bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400
                            border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-400 transition-all cursor-pointer"
                        >
                            <RefreshCw class="w-3.5 h-3.5" />
                            {$_("settings.refresh_cameras")}
                        </button>
                    </div>

                    {#if cameraPermission === "denied"}
                        <div class="flex flex-col items-center gap-2 py-4 text-slate-400">
                            <VideoOff class="w-6 h-6" />
                            <p class="text-xs text-center">{$_("monitor.noPermission")}</p>
                            <button
                                onclick={detectSettingsCameras}
                                class="mt-1 text-xs font-medium px-3 py-1.5 rounded-lg
                                bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 cursor-pointer transition-all"
                            >
                                {$_("settings.grant_access")}
                            </button>
                        </div>
                    {:else if cameraPermission === "requesting"}
                        <div class="flex items-center justify-center gap-2 py-4 text-slate-400">
                            <RefreshCw class="w-4 h-4 animate-spin text-sky-400" />
                            <p class="text-xs">{$_("monitor.requestingAccess")}</p>
                        </div>
                    {:else if detectedCameras.length === 0 && cameraPermission !== "idle"}
                        <div class="flex flex-col items-center gap-2 py-4 text-slate-400">
                            <VideoOff class="w-6 h-6" />
                            <p class="text-xs">{$_("monitor.noCamerasFound")}</p>
                        </div>
                    {:else if detectedCameras.length === 0}
                        <div class="flex flex-col items-center gap-2 py-4 text-slate-400">
                            <Camera class="w-6 h-6" />
                            <p class="text-xs text-center">{$_("settings.cameras_hint")}</p>
                            <button
                                onclick={detectSettingsCameras}
                                class="mt-1 text-xs font-medium px-3 py-1.5 rounded-lg
                                bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 cursor-pointer transition-all"
                            >
                                {$_("settings.grant_access")}
                            </button>
                        </div>
                    {:else}
                        <div class="space-y-2">
                            {#each detectedCameras as cam, idx}
                                {@const isEnabled = enabledCameraIds.has(cam.deviceId)}
                                <div class="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors
                                    {isEnabled
                                        ? 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                                        : 'bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 opacity-60'}">
                                    <div class="flex items-center gap-2.5">
                                        <span class="w-2 h-2 rounded-full {isEnabled ? 'bg-sky-400' : 'bg-slate-400'}"></span>
                                        <div>
                                            <p class="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[180px]">
                                                {cam.label || `Camera ${idx + 1}`}
                                            </p>
                                            <p class="text-[10px] text-slate-400 font-mono">
                                                CAM-{String(idx + 1).padStart(3, "0")}
                                            </p>
                                        </div>
                                    </div>
                                    <!-- Toggle switch -->
                                    <button
                                        onclick={() => toggleCameraEnabled(cam.deviceId)}
                                        class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 cursor-pointer
                                        {isEnabled ? 'bg-sky-400' : 'bg-slate-200 dark:bg-slate-600'}"
                                        title={isEnabled ? "Deshabilitar cámara" : "Habilitar cámara"}
                                    >
                                        <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                            {isEnabled ? 'translate-x-5' : 'translate-x-0'}"></span>
                                    </button>
                                </div>
                            {/each}
                        </div>
                        <p class="text-[10px] text-slate-400 mt-3">
                            {$_("settings.cameras_sub")}
                        </p>
                    {/if}
                </div>

                <!-- ── BLE Sensors section ────────────────────────────────── -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500">
                                <Bluetooth class="w-4 h-4" />
                            </div>
                            <h2 class="font-semibold text-slate-800 dark:text-white">
                                {$_("settings.sensors")}
                            </h2>
                            {#if $bleStore.status !== "disconnected"}
                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md border {bleStatusColor($bleStore.status)}">
                                    {#if $bleStore.status === "scanning" || $bleStore.status === "connecting"}
                                        <span class="inline-flex items-center gap-1">
                                            <Loader class="w-2.5 h-2.5 animate-spin" />
                                            {$bleStore.status}
                                        </span>
                                    {:else if $bleStore.status === "streaming"}
                                        <span class="inline-flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            streaming
                                        </span>
                                    {:else}
                                        {$bleStore.status}
                                    {/if}
                                </span>
                            {/if}
                        </div>
                        <button
                            onclick={bleScan}
                            disabled={$bleStore.status === "scanning" || $bleStore.status === "connecting"}
                            class="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
                            bg-purple-400/10 text-purple-500 border border-purple-400/20 hover:bg-purple-400/20
                            disabled:opacity-50 transition-all cursor-pointer"
                        >
                            {#if $bleStore.status === "scanning"}
                                <Loader class="w-3.5 h-3.5 animate-spin" />
                                Scanning…
                            {:else}
                                <Radio class="w-3.5 h-3.5" />
                                Scan BLE
                            {/if}
                        </button>
                    </div>

                    <!-- Error -->
                    {#if bleError}
                        <div class="mb-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
                            {bleError}
                        </div>
                    {/if}

                    <!-- Connected device -->
                    {#if $bleStore.status === "connected" || $bleStore.status === "streaming"}
                        <div class="mb-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0">
                                    <Bluetooth class="w-4 h-4" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-slate-800 dark:text-white">PoseFix Sensor</p>
                                    <p class="text-[10px] text-slate-400 font-mono truncate">{$bleStore.address}</p>
                                    {#if $bleStore.sensorData}
                                        {@const d = $bleStore.sensorData}
                                        <div class="flex gap-3 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                                            {#if d.head}
                                                <span>Head — P:{d.head.pitch.toFixed(1)}° R:{d.head.roll.toFixed(1)}° Y:{d.head.yaw.toFixed(1)}°</span>
                                            {/if}
                                            {#if d.back}
                                                <span>Back — P:{d.back.pitch.toFixed(1)}° R:{d.back.roll.toFixed(1)}° Y:{d.back.yaw.toFixed(1)}°</span>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                                <div class="flex items-center gap-1.5 shrink-0">
                                    {#if $bleStore.status === "connected"}
                                        <button
                                            onclick={bleStart}
                                            class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                            bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 cursor-pointer transition-all"
                                        >
                                            <Play class="w-3 h-3" />
                                            Start
                                        </button>
                                    {:else}
                                        <button
                                            onclick={bleStop}
                                            class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                            bg-amber-500/10 text-amber-500 border border-amber-400/20 hover:bg-amber-500/20 cursor-pointer transition-all"
                                        >
                                            <Square class="w-3 h-3" />
                                            Stop
                                        </button>
                                    {/if}
                                    <button
                                        onclick={bleDisconnect}
                                        class="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all"
                                        title="Disconnect"
                                    >
                                        <Unlink class="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Scan results -->
                    {#if $bleStore.scanResults.length > 0 && $bleStore.status !== "connected" && $bleStore.status !== "streaming"}
                        <div class="space-y-1.5">
                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Found {$bleStore.scanResults.length} device{$bleStore.scanResults.length !== 1 ? "s" : ""}
                            </p>
                            {#each $bleStore.scanResults as r}
                                <div class="flex items-center justify-between px-3 py-2 rounded-xl
                                    bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-2.5">
                                        <Bluetooth class="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                        <div>
                                            <p class="text-xs font-semibold text-slate-800 dark:text-white">{r.name}</p>
                                            <p class="text-[10px] text-slate-400 font-mono">{r.address.slice(0, 18)}…</p>
                                        </div>
                                        {#if r.rssi}
                                            <div class="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Signal class="w-3 h-3" />
                                                {r.rssi} dBm
                                            </div>
                                        {/if}
                                    </div>
                                    <button
                                        onclick={() => bleConnect(r.address)}
                                        disabled={$bleStore.status === "connecting"}
                                        class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                        bg-purple-400/10 text-purple-500 border border-purple-400/20
                                        hover:bg-purple-400/20 disabled:opacity-50 cursor-pointer transition-all"
                                    >
                                        <Link class="w-3 h-3" />
                                        Connect
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {:else if $bleStore.status === "disconnected" && $bleStore.scanResults.length === 0}
                        <div class="flex flex-col items-center justify-center gap-2 py-6 text-slate-400">
                            <BluetoothOff class="w-6 h-6" />
                            <p class="text-xs text-center">
                                No sensors found.<br />
                                Power on your XIAO ESP32-S3 and press <strong>Scan BLE</strong>.
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Notifications -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500">
                                <Bell class="w-4 h-4" />
                            </div>
                            <h2 class="font-semibold text-slate-800 dark:text-white">
                                {$_("settings.notifications")}
                            </h2>
                        </div>
                        <a
                            href="/account/notifications"
                            class="text-xs text-sky-400 hover:text-sky-500 font-medium cursor-pointer"
                        >
                            {$_("common.edit")} →
                        </a>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {#each notifItems as n}
                            <div class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div class="mr-3">
                                    <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {$_(`settings.notifs.${n.id}`)}
                                    </p>
                                    <p class="text-xs text-slate-400">
                                        {$_(`settings.notif_sub_${n.id}`)}
                                    </p>
                                </div>
                                <button
                                    onclick={() => (notifState[n.key] = !notifState[n.key])}
                                    class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 cursor-pointer
                                    {notifState[n.key] ? 'bg-sky-400' : 'bg-slate-200 dark:bg-slate-600'}"
                                >
                                    <span
                                        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                        {notifState[n.key] ? 'translate-x-5' : 'translate-x-0'}"
                                    ></span>
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Health & Breaks -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500">
                                <Activity class="w-4 h-4" />
                            </div>
                            <h2 class="font-semibold text-slate-800 dark:text-white">
                                Salud y Descansos
                            </h2>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <!-- Break Interval -->
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="text-xs font-medium text-slate-700 dark:text-slate-200" for="break-interval">
                                    Frecuencia de descanso
                                </label>
                                <span class="text-xs font-bold text-sky-400">{healthState.breakInterval} min</span>
                            </div>
                            <input
                                id="break-interval"
                                type="range"
                                min="15"
                                max="120"
                                step="5"
                                bind:value={healthState.breakInterval}
                                class="w-full accent-sky-400 cursor-pointer"
                            />
                            <p class="text-[10px] text-slate-400 mt-1">Cada cuánto tiempo recibirás un recordatorio para descansar.</p>
                        </div>

                        <!-- Break Duration -->
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="text-xs font-medium text-slate-700 dark:text-slate-200" for="break-duration">
                                    Duración del descanso
                                </label>
                                <span class="text-xs font-bold text-sky-400">{healthState.breakDuration} min</span>
                            </div>
                            <input
                                id="break-duration"
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                bind:value={healthState.breakDuration}
                                class="w-full accent-sky-400 cursor-pointer"
                            />
                            <p class="text-[10px] text-slate-400 mt-1">Tiempo sugerido para realizar ejercicios o estiramientos.</p>
                        </div>
                    </div>
                </div>

                <!-- Cloud & Firmware -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
                            <Cloud class="w-5 h-5" />
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-white">
                                {$_("settings.cloud")}
                            </p>
                            <p class="text-xs text-slate-400">
                                {$_("settings.last_backup", { values: { time: lastBackup } })}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {$_("settings.firmware")}
                            </p>
                            <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">
                                {firmware}
                            </p>
                        </div>
                        <button
                            onclick={checkUpdates}
                            disabled={checking}
                            class="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer
                            bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                            border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200
                            disabled:opacity-60 transition-all active:scale-95"
                        >
                            {checking ? $_("settings.checking") : $_("settings.check_updates")}
                        </button>
                    </div>
                </div>

                <!-- Reset Setup -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
                            <RotateCcw class="w-5 h-5" />
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-slate-800 dark:text-white">
                                {$_("settings.setup")}
                            </p>
                            <p class="text-xs text-slate-400">{$_("settings.setup_sub")}</p>
                        </div>
                    </div>
                    <button
                        onclick={() => goto("/onboarding")}
                        class="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer
                        bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                        text-slate-700 dark:text-slate-200 hover:border-sky-400 hover:text-sky-400 transition-all active:scale-95"
                    >
                        {$_("settings.launch_setup")}
                    </button>
                </div>

                <!-- AI Features -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-4">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-sm font-bold text-slate-800 dark:text-white">AI Features</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Connect an AI provider to enhance posture analysis, tips, and exercises</p>
                        </div>
                        <button
                            onclick={() => { aiSettings = { ...aiSettings, enabled: !aiSettings.enabled }; }}
                            class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                                {aiSettings.enabled ? 'bg-sky-400' : 'bg-slate-200 dark:bg-slate-600'}"
                        >
                            <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                                {aiSettings.enabled ? 'translate-x-5' : 'translate-x-0'}"></span>
                        </button>
                    </div>

                    {#if aiSettings.enabled}
                        <div class="space-y-4">
                            <!-- Provider -->
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Provider</label>
                                <div class="grid grid-cols-4 gap-2">
                                    {#each (['openai', 'anthropic', 'gemini', 'ollama'] as AiProvider[]) as p}
                                        <button
                                            onclick={() => { aiSettings = { ...aiSettings, provider: p, model: DEFAULT_MODELS[p] }; }}
                                            class="py-2 rounded-xl text-xs font-semibold border transition-all
                                                {aiSettings.provider === p
                                                    ? 'bg-sky-400/10 border-sky-400 text-sky-400'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-400/50'}"
                                        >
                                            {p === 'openai' ? 'OpenAI' : p === 'anthropic' ? 'Anthropic' : p === 'gemini' ? 'Gemini' : 'Ollama'}
                                        </button>
                                    {/each}
                                </div>
                            </div>

                            <!-- API Key (hidden for ollama) -->
                            {#if aiSettings.provider !== 'ollama'}
                                <div>
                                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">API Key</label>
                                    <input
                                        type="password"
                                        bind:value={aiSettings.apiKey}
                                        placeholder="sk-... / key-... / AIza..."
                                        class="w-full px-3 py-2.5 rounded-xl text-sm
                                            bg-slate-50 dark:bg-slate-800
                                            border border-slate-200 dark:border-slate-700
                                            text-slate-800 dark:text-white placeholder:text-slate-400
                                            focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                                    />
                                </div>
                            {:else}
                                <div>
                                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Ollama Host</label>
                                    <input
                                        type="text"
                                        bind:value={aiSettings.baseUrl}
                                        placeholder="http://localhost:11434"
                                        class="w-full px-3 py-2.5 rounded-xl text-sm
                                            bg-slate-50 dark:bg-slate-800
                                            border border-slate-200 dark:border-slate-700
                                            text-slate-800 dark:text-white placeholder:text-slate-400
                                            focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                                    />
                                </div>
                            {/if}

                            <!-- Model -->
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Model</label>
                                <input
                                    type="text"
                                    bind:value={aiSettings.model}
                                    class="w-full px-3 py-2.5 rounded-xl text-sm
                                        bg-slate-50 dark:bg-slate-800
                                        border border-slate-200 dark:border-slate-700
                                        text-slate-800 dark:text-white
                                        focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                                />
                            </div>

                            <!-- Feature toggles -->
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Features</label>
                                <div class="space-y-2">
                                    {#each [
                                        { key: 'smartTips', label: 'Smart Tips', sub: 'Context-aware tips generated by AI' },
                                        { key: 'postureAnalysis', label: 'Posture Analysis', sub: 'Detailed AI narrative of your posture' },
                                        { key: 'exerciseRecommendations', label: 'Exercise Recommendations', sub: 'Personalized exercise plan based on your history' },
                                    ] as f}
                                        <div class="flex items-center justify-between px-3 py-2.5 rounded-xl
                                            bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                            <div>
                                                <p class="text-sm font-medium text-slate-700 dark:text-slate-200">{f.label}</p>
                                                <p class="text-xs text-slate-400">{f.sub}</p>
                                            </div>
                                            <button
                                                onclick={() => {
                                                    aiSettings = {
                                                        ...aiSettings,
                                                        features: { ...aiSettings.features, [f.key]: !aiSettings.features[f.key as keyof typeof aiSettings.features] }
                                                    };
                                                }}
                                                class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
                                                    {aiSettings.features[f.key as keyof typeof aiSettings.features] ? 'bg-sky-400' : 'bg-slate-200 dark:bg-slate-600'}"
                                            >
                                                <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                                    {aiSettings.features[f.key as keyof typeof aiSettings.features] ? 'translate-x-5' : 'translate-x-0'}"></span>
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Right column -->
            <div class="lg:col-span-2 flex flex-col gap-4">
                <!-- Preferences -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <div class="flex items-center gap-2 mb-5">
                        <div class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500">
                            <Settings2 class="w-4 h-4" />
                        </div>
                        <h2 class="font-semibold text-slate-800 dark:text-white">
                            {$_("settings.preferences")}
                        </h2>
                    </div>

                    <!-- Theme -->
                    <div class="mb-5">
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            {$_("settings.theme")}
                        </p>
                        <div class="flex gap-2">
                            {#each [["light", "☀️", $_("settings.light")], ["dark", "🌙", $_("settings.dark")], ["system", "💻", $_("settings.system")]] as [val, emoji, label]}
                                <button
                                    onclick={() => theme.set(val as ThemeMode)}
                                    class="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all
                                    {$theme === val
                                        ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'}"
                                >
                                    <span class="text-base">{emoji}</span>{label}
                                </button>
                            {/each}
                        </div>
                        {#if $theme === "system"}
                            <p class="text-[10px] text-slate-400 mt-2 text-center">
                                {$_("settings.system_theme")}
                            </p>
                        {/if}
                    </div>

                    <!-- Language -->
                    <div class="mb-5">
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            {$_("settings.language")}
                        </p>
                        <div class="flex gap-2">
                            {#each languages as lang}
                                <button
                                    onclick={() => setLocale(lang.code)}
                                    class="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all
                                    {$locale === lang.code
                                        ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'}"
                                >
                                    {lang.label}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Units -->
                    <div class="mb-5">
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            {$_("settings.units")}
                        </p>
                        <div class="flex gap-2">
                            {#each [["metric", $_("settings.metric")], ["imperial", $_("settings.imperial")]] as [val, label]}
                                <button
                                    onclick={() => (units = val as "metric" | "imperial")}
                                    class="flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all
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
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {$_("settings.posture_goal")}
                            </p>
                            <span class="text-xs font-bold text-sky-400">{postureGoal}/100</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="100"
                            step="5"
                            bind:value={postureGoal}
                            class="w-full accent-sky-400 cursor-pointer"
                        />
                    </div>
                </div>

                <!-- AI -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500">
                            <Star class="w-4 h-4" />
                        </div>
                        <h2 class="font-semibold text-slate-800 dark:text-white">
                            {$_("settings.ai")}
                        </h2>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">{$_("settings.ai_desc")}</p>
                    <div class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {$_("settings.precision")}
                            </span>
                            <div class="flex gap-1">
                                {#each [["Low", "Faster, less detail"], ["Balanced", "Recommended"], ["High", "More detail, slower"]] as [p, hint]}
                                    <button
                                        onclick={() => setPrecision(p as "Low" | "Balanced" | "High")}
                                        title={hint}
                                        class="px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all
                                        {precision === p
                                            ? 'bg-sky-400 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}"
                                    >
                                        {p}
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400">
                            {precision === "High"
                                ? "YOLO conf=0.25 — captures more joints, higher CPU use."
                                : precision === "Low"
                                  ? "YOLO conf=0.50, frame skip — faster, fewer false positives."
                                  : "YOLO conf=0.35 — balanced speed and accuracy."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
