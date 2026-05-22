<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";
    import { invoke } from "@tauri-apps/api/core";
    import { emit } from "@tauri-apps/api/event";
    import { _ , locale } from "svelte-i18n";
    import { Activity, Square, Play, ExternalLink, Timer, Coffee } from "@lucide/svelte";
    import { PUBLIC_POSE_WS_HOST, PUBLIC_POSE_WS_PORT } from "$env/static/public";
    import { getFirstUser, getActiveSession, startSession, endSession } from "$lib/db";
    import { settingsStore } from "$lib/stores/settings";

    // ─── Session state ────────────────────────────────────────────────────────
    let sessionStartTs = $state<number | null>(null);
    let sessionId      = $state<number | null>(null);
    let elapsed        = $state(0);
    let liveScore      = $state<number | null>(null);
    let loading        = $state(true);
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    // Validate session against DB — source of truth
    async function refreshSession() {
        try {
            const user = await getFirstUser();
            if (!user) {
                clearSession();
                return;
            }
            const active = await getActiveSession(user.id);
            if (active) {
                sessionId = active.id;
                // Prefer localStorage timestamp (accurate to ms),
                // fall back to DB string (less precise but always correct)
                const stored = localStorage.getItem("posefix_session_start_ts");
                const storedId = localStorage.getItem("posefix_active_session_id");
                if (stored && storedId && parseInt(storedId, 10) === active.id) {
                    sessionStartTs = parseInt(stored, 10);
                } else {
                    // Derive from DB session_start string
                    // session_start is localtime without tz — replace space with T to parse as local
                    sessionStartTs = new Date(active.session_start.replace(" ", "T")).getTime();
                    localStorage.setItem("posefix_session_start_ts", String(sessionStartTs));
                    localStorage.setItem("posefix_active_session_id", String(active.id));
                }
            } else {
                clearSession();
            }
        } catch {
            clearSession();
        } finally {
            loading = false;
        }
        elapsed = sessionStartTs ? Math.floor((Date.now() - sessionStartTs) / 1000) : 0;
    }

    function clearSession() {
        sessionStartTs = null;
        sessionId      = null;
        elapsed        = 0;
        localStorage.removeItem("posefix_session_start_ts");
        localStorage.removeItem("posefix_active_session_id");
    }

    function startTick() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (sessionStartTs) {
                elapsed = Math.floor((Date.now() - sessionStartTs) / 1000);
            }
        }, 1000);
    }

    function onStorage(e: StorageEvent) {
        if (e.key === "posefix_session_start_ts" || e.key === "posefix_active_session_id") {
            refreshSession();
        }
        if (e.key === "appSettings") {
            settingsStore.reload();
        }
        if (e.key === "locale" && e.newValue) {
            locale.set(e.newValue);
        }
        if (e.key === "posefix_live_score") {
            liveScore = e.newValue ? parseInt(e.newValue) : null;
        }
    }

    onMount(async () => {
        await refreshSession();
        const storedScore = localStorage.getItem("posefix_live_score");
        if (storedScore) liveScore = parseInt(storedScore);
        startTick();
        window.addEventListener("focus", refreshSession);
        window.addEventListener("storage", onStorage);
    });

    onDestroy(() => {
        if (timerInterval) clearInterval(timerInterval);
        window.removeEventListener("focus", refreshSession);
        window.removeEventListener("storage", onStorage);
    });

    // ─── Derived display values ───────────────────────────────────────────────
    let sessionTimeStr = $derived(() => {
        const h = Math.floor(elapsed / 3600).toString().padStart(2, "0");
        const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, "0");
        const s = (elapsed % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    });

    let nextBreakStr = $derived(() => {
        if (!sessionStartTs) return "--:--";
        const cycle     = $settingsStore.health.breakInterval * 60;
        const remaining = cycle - (elapsed % cycle);
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });

    // ─── Actions ──────────────────────────────────────────────────────────────
    let stopping  = $state(false);
    let starting  = $state(false);

    async function probeWs(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const probe = new WebSocket(`ws://${PUBLIC_POSE_WS_HOST}:${PUBLIC_POSE_WS_PORT}`);
                const t = setTimeout(() => { probe.close(); resolve(false); }, 2500);
                probe.onopen  = () => { clearTimeout(t); probe.close(); resolve(true); };
                probe.onerror = () => { clearTimeout(t); resolve(false); };
            } catch { resolve(false); }
        });
    }

    async function waitForWs(maxMs = 20000): Promise<boolean> {
        const deadline = Date.now() + maxMs;
        while (Date.now() < deadline) {
            if (await probeWs()) return true;
            await new Promise((r) => setTimeout(r, 500));
        }
        return false;
    }

    async function handleStartSession() {
        if (starting) return;
        starting = true;
        try {
            const user = await getFirstUser();
            if (!user) return;
            await invoke("launch_pose_server");
            const ok = await waitForWs();
            if (!ok) return;
            const id = await startSession(user.id);
            localStorage.setItem("posefix_active_session_id", String(id));
            localStorage.setItem("posefix_session_start_ts", String(Date.now()));

            const s = get(settingsStore);
            try {
                await invoke("update_health_settings", {
                    interval: s.health.breakInterval,
                    duration: s.health.breakDuration,
                    mute: s.appBehavior?.muteNotifications ?? false,
                    alertType: s.health.breakAlertType ?? "both",
                });
            } catch {}

            await invoke("set_session_active", { active: true });
            await emit("posefix:session-started", {});
            await invoke("show_main_window");
            await refreshSession();
        } catch {} finally {
            starting = false;
        }
    }

    async function handleStopSession() {
        if (!sessionId || stopping) return;
        stopping = true;
        try {
            await endSession(sessionId, {
                posture_score: 0,
                fatigue_score: 0,
                eye_distance:  0,
                blink_rate:    0,
            });
        } catch {}
        try { await invoke("stop_pose_server"); } catch {}
        try { await invoke("set_session_active", { active: false }); } catch {}
        clearSession();
        await emit("posefix:session-stopped", {});
        stopping = false;
    }

    async function openMainApp() {
        await invoke("show_main_window");
    }

    async function quitApp() {
        await invoke("quit_app");
    }
</script>

<div class="fixed inset-0 p-[1px]" data-tauri-drag-region>
    <div class="h-full flex flex-col rounded-xl overflow-hidden bg-[#252525] border border-[#3d3d3d] text-white shadow-2xl">

        <!-- Header -->
        <div class="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-[#383838]">
            <div class="flex items-center gap-2">
                <Activity class="h-4 w-4 text-sky-400" />
                <span class="font-semibold text-[14px] tracking-tight">{$_("menubar.title")}</span>
            </div>
            <button
                onclick={openMainApp}
                class="p-1.5 rounded-md text-[#7a7a7a] hover:text-white hover:bg-[#333] transition-colors"
                title={$_("menubar.open_app")}
            >
                <ExternalLink class="h-3.5 w-3.5" />
            </button>
        </div>

        <!-- Body -->
        <div class="flex-1 px-4 py-4">
            {#if loading}
                <div class="flex items-center justify-center h-full">
                    <div class="w-5 h-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></div>
                </div>
            {:else if sessionStartTs}
                <!-- Active session -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5 text-[#9a9a9a]">
                            <Timer class="h-3.5 w-3.5" />
                            <span class="text-[12px]">{$_("menubar.current_session")}</span>
                        </div>
                        <span class="font-mono font-bold text-[22px] text-sky-400 tabular-nums leading-none">
                            {sessionTimeStr()}
                        </span>
                    </div>
 
                     <div class="flex items-center justify-between">
                         <div class="flex items-center gap-1.5 text-[#9a9a9a]">
                             <Coffee class="h-3.5 w-3.5" />
                             <span class="text-[12px]">{$_("menubar.next_break")}</span>
                         </div>
                         <span class="font-mono font-bold text-[22px] text-amber-400 tabular-nums leading-none">
                             {nextBreakStr()}
                         </span>
                     </div>

                     {#if liveScore != null}
                         <div class="flex items-center justify-between">
                             <div class="flex items-center gap-1.5 text-[#9a9a9a]">
                                 <Activity class="h-3.5 w-3.5" />
                                 <span class="text-[12px]">{($_)("menubar.posture_score")}</span>
                             </div>
                             <span class="font-mono font-bold text-[22px] tabular-nums leading-none
                                 {liveScore >= 80 ? 'text-sky-400' : liveScore >= 60 ? 'text-yellow-400' : 'text-red-400'}">
                                 {liveScore}
                             </span>
                         </div>
                     {/if}
 
                     <div class="h-px bg-[#333]" />

                    <div class="flex items-center justify-between text-[11px] text-[#555]">
                        <span>{$_("menubar.every")} {$settingsStore.health.breakInterval} min</span>
                        <span>{$settingsStore.health.breakDuration} {$_("menubar.min_break")}</span>
                    </div>
                </div>
            {:else}
                <!-- No active session -->
                <div class="flex flex-col items-center justify-center h-full gap-3 pb-2">
                    <div class="w-10 h-10 rounded-full bg-[#2e2e2e] flex items-center justify-center">
                        <Activity class="h-5 w-5 text-[#444]" />
                    </div>
                    <div class="text-center">
                        <p class="text-[13px] text-[#7a7a7a]">{$_("menubar.no_session")}</p>
                        <p class="text-[11px] text-[#505050] mt-0.5">{$_("menubar.no_session_sub")}</p>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Action buttons -->
        <div class="px-4 pb-3 space-y-2">
            {#if !loading && sessionStartTs}
                <button
                    onclick={handleStopSession}
                    disabled={stopping}
                    class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                           bg-[#2e2e2e] hover:bg-[#3a2222] border border-[#444] hover:border-red-900
                           text-red-400 hover:text-red-300 transition-colors text-[13px] font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Square class="h-3.5 w-3.5" />
                    {stopping ? $_("menubar.stopping") : $_("menubar.stop_session")}
                </button>
            {:else if !loading}
                <button
                    onclick={handleStartSession}
                    disabled={starting}
                    class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                           bg-sky-500 hover:bg-sky-400 border border-sky-600
                           text-white transition-colors text-[13px] font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if starting}
                        <div class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    {:else}
                        <Play class="h-3.5 w-3.5" />
                    {/if}
                    {starting ? $_("menubar.starting") : $_("menubar.start_session")}
                </button>
            {/if}
            <button
                onclick={openMainApp}
                class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                       bg-[#2e2e2e] hover:bg-[#363636] border border-[#444]
                       text-[#ccc] hover:text-white transition-colors text-[13px] font-medium"
            >
                <ExternalLink class="h-3.5 w-3.5" />
                {$_("menubar.open_app")}
            </button>
        </div>

        <!-- Footer: Quit -->
        <button
            onclick={quitApp}
            class="flex items-center justify-between px-4 py-2.5
                   border-t border-[#383838] hover:bg-[#2e2e2e]
                   transition-colors w-full text-left"
        >
            <span class="text-[13px] text-white">{$_("menubar.quit")}</span>
            <span class="text-[11px] text-[#555]">⌘Q</span>
        </button>

    </div>
</div>
