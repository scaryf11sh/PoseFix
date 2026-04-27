<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { cubicOut } from "svelte/easing";
    import { PieChart, LineChart, Text } from "layerchart";
    import { _ } from "svelte-i18n";
    import {
        Eye,
        Clock,
        Lightbulb,
        Activity,
        Trophy,
        Play,
        Square,
        AlertTriangle,
        Wifi,
        WifiOff,
        BarChart2,
    } from "@lucide/svelte";
    import { invoke } from "@tauri-apps/api/core";
    import { PUBLIC_POSE_WS_HOST, PUBLIC_POSE_WS_PORT } from "$env/static/public";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { sessionStore, livePostureScore } from "$lib/stores/session";
    import {
        getWeeklyStats,
        getSessionStats,
        getActiveSession,
        startSession,
        endSession,
        getSessions,
    } from "$lib/db";

    // ─── User / session ──────────────────────────────────────────────────────
    let userId = $state(0);
    let activeSessionId = $state<number | null>(null);

    // ─── Score gauge ─────────────────────────────────────────────────────────
    let score = $state(0);
    let animated = $state(0);
    let dailyGoalPct = $state(0);
    let totalSessions = $state(0);
    let postureGoal = $state(80);

    let label = $derived(
        animated >= 95
            ? $_("dashboard.posture.excellent")
            : animated >= 80
              ? $_("dashboard.posture.good")
              : animated >= 60
                ? $_("dashboard.posture.fair")
                : $_("dashboard.posture.poor"),
    );

    const COUNT = 100;
    let pieData = $derived(
        Array.from({ length: COUNT }, (_, i) => ({
            key: i + 1,
            value: 1,
            color:
                score === 0
                    ? "#e2e8f0"
                    : (i / COUNT) * 100 < animated
                      ? "#38bdf8"
                      : "#bfdbfe",
        })),
    );

    // ─── Line chart ──────────────────────────────────────────────────────────
    type DataPoint = { date: Date; value: number | null };
    const today = new Date();

    let weekData = $state<DataPoint[]>([]);
    let view = $state<"Week">("Week"); // Day view removed — no intraday data in DB
    let chartData = $derived(weekData);
    let hasChartData = $derived(weekData.some((p) => p.value != null && p.value > 0));

    // ─── Timer ───────────────────────────────────────────────────────────────
    let seconds = $state(0);
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    let timerStr = $derived(() => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h} : ${m} : ${s}`;
    });

    // Next break: every 25 min (Pomodoro-style)
    let nextBreakMin = $derived(() => {
        if (!activeSessionId) return null;
        const elapsed = seconds;
        const cycle = 25 * 60;
        const remaining = cycle - (elapsed % cycle);
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });

    function startTimer(fromSeconds = 0) {
        if (timerInterval) clearInterval(timerInterval);
        seconds = fromSeconds;
        timerInterval = setInterval(() => seconds++, 1000);
    }

    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        seconds = 0;
    }

    // ─── Eye distance (static until live data arrives via WS) ───────────────
    let eyeDist = $state<number | null>(null);
    let distPct = $derived(
        eyeDist != null
            ? Math.min(Math.max((eyeDist - 30) / (100 - 30), 0), 1) * 100
            : 50,
    );
    let distColor = $derived(
        eyeDist == null
            ? "#94a3b8"
            : eyeDist >= 50 && eyeDist <= 70
              ? "#a855f7"
              : eyeDist < 50
                ? "#ef4444"
                : "#f59e0b",
    );

    // ─── WS probe ────────────────────────────────────────────────────────────
    let wsAvailable = $state<boolean | null>(null); // null = unknown

    async function probeWs(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const probe = new WebSocket(`ws://${PUBLIC_POSE_WS_HOST}:${PUBLIC_POSE_WS_PORT}`);
                const timer = setTimeout(() => {
                    probe.close();
                    resolve(false);
                }, 2500);
                probe.onopen = () => {
                    clearTimeout(timer);
                    probe.close();
                    resolve(true);
                };
                probe.onerror = () => {
                    clearTimeout(timer);
                    resolve(false);
                };
            } catch {
                resolve(false);
            }
        });
    }

    // ─── Session start / stop ────────────────────────────────────────────────
    let sessionBusy = $state(false);
    let startPhase = $state<"launching" | "waiting" | "stopping" | null>(null);
    let toastMsg = $state<string | null>(null);
    let toastTimer: ReturnType<typeof setTimeout>;

    function showToast(msg: string) {
        clearTimeout(toastTimer);
        toastMsg = msg;
        toastTimer = setTimeout(() => (toastMsg = null), 4000);
    }

    /** Poll WS server until it opens, up to maxMs ms */
    async function waitForWs(maxMs = 15000, intervalMs = 500): Promise<boolean> {
        const deadline = Date.now() + maxMs;
        while (Date.now() < deadline) {
            const ok = await probeWs();
            if (ok) return true;
            await new Promise((r) => setTimeout(r, intervalMs));
        }
        return false;
    }

    async function handleStartSession() {
        // Block if all cameras disabled in settings
        try {
            const rawCams = localStorage.getItem("posefix_enabled_cameras");
            if (rawCams !== null) {
                const ids: string[] = JSON.parse(rawCams);
                if (ids.length === 0) {
                    showToast($_("dashboard.noCamerasEnabled"));
                    return;
                }
            }
        } catch {}

        sessionBusy = true;
        try {
            // 1. Launch the Python server via Tauri
            startPhase = "launching";
            try {
                await invoke("launch_pose_server");
            } catch (e) {
                showToast(String(e));
                return;
            }

            // 2. Wait until WS port is accepting connections (YOLO model loaded)
            startPhase = "waiting";
            const ok = await waitForWs(20000);
            wsAvailable = ok;
            if (!ok) {
                showToast($_("dashboard.modelNotRunning"));
                return;
            }

            // 3. Create DB session and navigate to camera
            const id = await startSession(userId);
            activeSessionId = id;
            sessionStore.set(id);
            startTimer(0);
            goto("/camera");
        } catch (e) {
            console.error(e);
        } finally {
            sessionBusy = false;
            startPhase = null;
        }
    }

    async function handleStopSession() {
        if (!activeSessionId) return;
        sessionBusy = true;
        startPhase = "stopping";
        try {
            // Use the live posture score from the camera page if available,
            // fall back to historical avg. Never save 0 — use null-coalescing.
            let finalScore = 0;
            livePostureScore.subscribe((v) => { finalScore = v ?? score; })();
            await endSession(activeSessionId, {
                posture_score: finalScore,
                fatigue_score: 0,
                eye_distance: eyeDist ?? 0,
                blink_rate: 0,
            });
            activeSessionId = null;
            sessionStore.set(null);
            livePostureScore.set(null);
            stopTimer();

            // Stop the Python server
            try { await invoke("stop_pose_server"); } catch {}
            wsAvailable = false;

            // Refresh stats after stopping
            await loadStats();
        } catch (e) {
            console.error(e);
        } finally {
            sessionBusy = false;
            startPhase = null;
        }
    }

    // ─── Data loading ─────────────────────────────────────────────────────────
    async function loadStats() {
        if (!userId) return;
        try {
            const stats = await getSessionStats(userId);
            totalSessions = stats.total_sessions;
            if (stats.total_sessions > 0 && stats.avg_score != null) {
                score = Math.round(stats.avg_score);
                dailyGoalPct = Math.min(
                    100,
                    Math.round((stats.avg_score / postureGoal) * 100),
                );
            }
        } catch {}

        try {
            const weekly = await getWeeklyStats(userId);
            const last7: DataPoint[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const p = (n: number) => String(n).padStart(2, "0");
                const dayStr = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
                const found = weekly.find((w) => w.day === dayStr);
                last7.push({
                    date: d,
                    value: found ? Math.round(found.avg_score) : null,
                });
            }
            weekData = last7;
        } catch {}

        // Get last session eye distance
        try {
            const sessions = await getSessions(userId, 3);
            const last = sessions.find((s) => s.eye_distance != null);
            if (last?.eye_distance) eyeDist = Math.round(last.eye_distance);
        } catch {}
    }

    // ─── Score animation ─────────────────────────────────────────────────────
    function animateScore(target: number) {
        animated = 0;
        let start: number;
        function frame(ts: number) {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 900, 1);
            animated = target * cubicOut(p);
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // ─── Mount ───────────────────────────────────────────────────────────────
    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(user);
        userId = user.id;
        postureGoal = user.posture_goal ?? 80;

        await loadStats();
        animateScore(score);

        // Check for existing active session.
        // A session is only valid if the AI model (WS) is also running.
        // If the model is down, the session is stale (app crashed / server died) — close it.
        try {
            const active = await getActiveSession(user.id);
            if (active) {
                const modelUp = await probeWs();
                wsAvailable = modelUp;
                if (modelUp) {
                    activeSessionId = active.id;
                    sessionStore.set(active.id);
                    // session_start stored as localtime (datetime('now','localtime')).
                    // Replace space with 'T' for unambiguous ISO parsing across engines.
                    const elapsed = Math.floor(
                        (Date.now() - new Date(active.session_start.replace(" ", "T")).getTime()) / 1000,
                    );
                    startTimer(elapsed);
                } else {
                    // Close stale session silently
                    await endSession(active.id, {
                        posture_score: score,
                        fatigue_score: 0,
                        eye_distance: 0,
                        blink_rate: 0,
                    }).catch(() => {});
                }
            } else {
                probeWs().then((ok) => (wsAvailable = ok));
            }
        } catch {
            probeWs().then((ok) => (wsAvailable = ok));
        }

        return () => stopTimer();
    });

    // ─── ⌘↩ Start / Stop session shortcut ───────────────────────────────────
    $effect(() => {
        function onkey(e: KeyboardEvent) {
            if (!(e.key === "Enter" && (e.ctrlKey || e.metaKey))) return;
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return;
            e.preventDefault();
            if (activeSessionId) {
                handleStopSession();
            } else if (!sessionBusy) {
                handleStartSession();
            }
        }
        window.addEventListener("keydown", onkey);
        return () => window.removeEventListener("keydown", onkey);
    });
</script>

<!-- Toast -->
{#if toastMsg}
    <div
        class="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-red-500 text-white"
    >
        <AlertTriangle class="w-4 h-4 shrink-0" />
        {toastMsg}
    </div>
{/if}

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_("dashboard.title")}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {totalSessions > 0
                    ? $_("dashboard.totalSessions") + ": " + totalSessions
                    : $_("dashboard.noDataYet")}
            </p>
        </div>
        <div class="flex gap-3">
            <!-- Start / Stop Session button -->
            {#if activeSessionId}
                <button
                    onclick={handleStopSession}
                    disabled={sessionBusy}
                    class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-lg shadow-red-400/30"
                >
                    {#if sessionBusy}
                        <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        {$_("dashboard.stoppingSession")}
                    {:else}
                        <Square class="w-4 h-4 fill-white" />
                        {$_("dashboard.stopSession")}
                    {/if}
                </button>
            {:else}
                <button
                    onclick={handleStartSession}
                    disabled={sessionBusy}
                    class="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-lg shadow-sky-400/30"
                >
                    {#if startPhase === "launching"}
                        <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        {$_("dashboard.launchingServer")}
                    {:else if startPhase === "waiting"}
                        <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        {$_("dashboard.loadingModel")}
                    {:else}
                        <Play class="w-4 h-4 fill-white" />
                        {$_("dashboard.startSession")}
                    {/if}
                </button>
            {/if}

            <button
                onclick={() => goto("/camera")}
                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                {$_("dashboard.liveMonitor")}
            </button>
        </div>
    </div>

    <!-- Top row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <!-- Score card -->
        <div
            class="lg:col-span-1 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center justify-center gap-5"
        >
            <div class="flex flex-col w-full items-start gap-2">
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("dashboard.postureScore")}
                </h2>
            </div>
            <div class="w-52 h-52 my-6">
                <PieChart
                    data={pieData}
                    key="key"
                    value="value"
                    c="color"
                    innerRadius={-14}
                    cornerRadius={5}
                    padAngle={0.02}
                >
                    {#snippet aboveMarks()}
                        {#if score === 0}
                            <Text
                                value="—"
                                textAnchor="middle"
                                verticalAnchor="middle"
                                dy={-10}
                                class="text-5xl font-bold fill-slate-300 dark:fill-slate-600"
                            />
                        {:else}
                            <Text
                                value={String(Math.round(animated))}
                                textAnchor="middle"
                                verticalAnchor="middle"
                                dy={-10}
                                class="text-5xl font-bold fill-slate-800 dark:fill-white"
                            />
                            <Text
                                value="/ 100"
                                textAnchor="middle"
                                verticalAnchor="middle"
                                dy={18}
                                class="text-sm fill-slate-400"
                            />
                        {/if}
                    {/snippet}
                </PieChart>
            </div>
            <span
                class="px-4 py-1 rounded-full border border-sky-300 text-sky-500 text-xs font-bold tracking-widest"
            >
                {score === 0 ? $_("dashboard.noDataYet") : label}
            </span>
            <p class="text-center text-sm text-slate-400">
                {$_("dashboard.currentScore")}
            </p>
        </div>

        <!-- Daily Progress chart -->
        <div
            class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col"
        >
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        {$_("dashboard.dailyProgress")}
                    </h2>
                    <p class="text-xs text-slate-400">
                        {$_("dashboard.posturalAlignment")}
                    </p>
                </div>
                <!-- Week badge — single view -->
                <span
                    class="px-3 py-1 rounded-md text-xs font-medium bg-sky-400 text-white shadow"
                >
                    {$_("dashboard.week")}
                </span>
            </div>

            {#if hasChartData}
                <div class="flex-1 min-h-[200px] text-sky-400">
                    <LineChart
                        data={chartData.filter((d) => d.value != null)}
                        x="date"
                        y="value"
                        padding={{ top: 8, right: 16, bottom: 40, left: 40 }}
                        lineProps={{ class: "stroke-sky-400 stroke-2" }}
                        points={{ class: "fill-sky-400", r: 4 }}
                        grid={true}
                        axis={true}
                    />
                </div>
            {:else}
                <div
                    class="flex-1 min-h-[200px] flex flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-600"
                >
                    <BarChart2 class="w-12 h-12" />
                    <p class="text-sm">{$_("dashboard.noDataYet")}</p>
                </div>
            {/if}
        </div>
    </div>

    <!-- Middle row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Eye to Screen -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5"
        >
            <div class="flex items-center gap-3 mb-4">
                <div
                    class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500"
                >
                    <Eye class="w-5 h-5" />
                </div>
                <div>
                    <p class="font-semibold text-slate-800 dark:text-white text-sm">
                        {$_("dashboard.eyeToScreen")}
                    </p>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">
                        {$_("dashboard.realtimeDepth")}
                    </p>
                </div>
            </div>
            <p class="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {eyeDist != null ? eyeDist : "—"}
                <span class="text-base font-normal text-slate-400">cm</span>
            </p>
            <div
                class="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-2"
            >
                <div
                    class="absolute left-0 top-0 h-2 rounded-full transition-all duration-500"
                    style="width: {distPct}%; background: {distColor}"
                ></div>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mb-4">
                <span>{$_("dashboard.tooClose")}</span>
                <span>{$_("dashboard.optimal")}</span>
                <span>{$_("dashboard.tooFar")}</span>
            </div>
            {#if eyeDist != null}
                <div
                    class="flex items-center gap-2 rounded-xl px-3 py-2
                    {eyeDist >= 50 && eyeDist <= 70
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-amber-50 dark:bg-amber-900/20'}"
                >
                    <div
                        class="w-5 h-5 rounded-full flex items-center justify-center
                        {eyeDist >= 50 && eyeDist <= 70 ? 'bg-green-500' : 'bg-amber-500'}"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3 h-3 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <span
                        class="text-sm
                        {eyeDist >= 50 && eyeDist <= 70
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'}"
                    >
                        {$_("dashboard.safeDistance")}
                    </span>
                </div>
            {:else}
                <p class="text-xs text-slate-400 text-center">
                    {$_("dashboard.noDataYet")}
                </p>
            {/if}
        </div>

        <!-- Active Session timer -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col"
        >
            <div class="flex items-start justify-between mb-2">
                <div>
                    <p class="font-semibold text-slate-800 dark:text-white">
                        {$_("dashboard.activeSession")}
                    </p>
                    <p class="text-xs text-slate-400">
                        {$_("dashboard.timeAtDesk")}
                    </p>
                </div>
                <div
                    class="w-8 h-8 rounded-full flex items-center justify-center
                    {activeSessionId
                        ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}"
                >
                    <Clock class="w-4 h-4" />
                </div>
            </div>
            <div class="flex-1 flex items-center justify-center">
                {#if activeSessionId}
                    <p
                        class="text-4xl font-bold text-sky-400 tabular-nums tracking-widest"
                    >
                        {timerStr()}
                    </p>
                {:else}
                    <p class="text-sm text-slate-400">
                        {$_("dashboard.noActiveSession")}
                    </p>
                {/if}
            </div>
            <!-- View Warnings button (only when session is active) -->
            <button
                onclick={() =>
                    activeSessionId
                        ? goto(`/progress/${activeSessionId}`)
                        : goto("/progress")}
                class="mt-4 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
                <AlertTriangle class="w-3.5 h-3.5" />
                {$_("dashboard.viewWarnings")}
            </button>
        </div>

        <!-- Quick Tip -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between"
        >
            <div class="flex items-center gap-2 mb-3">
                <div
                    class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500"
                >
                    <Lightbulb class="w-4 h-4" />
                </div>
                <p class="font-semibold text-slate-800 dark:text-white">
                    {$_("dashboard.quickTip")}
                </p>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 flex-1">
                "Roll your shoulders back and down every 20 minutes to relieve
                tension in your upper trapezius muscles."
            </p>
        </div>
    </div>

    <!-- Bottom stats row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Next break -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"
        >
            <div
                class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500"
            >
                <Clock class="w-6 h-6" />
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("dashboard.nextBreak")}
                </p>
                <p class="text-xl font-bold text-slate-800 dark:text-white">
                    {activeSessionId && nextBreakMin()
                        ? nextBreakMin()
                        : "—"}
                </p>
            </div>
        </div>

        <!-- AI status -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"
        >
            <div
                class="w-12 h-12 rounded-xl flex items-center justify-center
                {wsAvailable === true
                    ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-500'
                    : wsAvailable === false
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}"
            >
                {#if wsAvailable === true}
                    <Wifi class="w-6 h-6" />
                {:else}
                    <WifiOff class="w-6 h-6" />
                {/if}
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("dashboard.aiStatus")}
                </p>
                <p
                    class="text-xl font-bold
                    {wsAvailable === true
                        ? 'text-sky-500'
                        : 'text-slate-800 dark:text-white'}"
                >
                    {wsAvailable === true
                        ? $_("dashboard.aiConnected")
                        : wsAvailable === false
                          ? $_("dashboard.aiDisconnected")
                          : "..."}
                </p>
            </div>
        </div>

        <!-- Daily goal -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"
        >
            <div
                class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500"
            >
                <Trophy class="w-6 h-6" />
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("dashboard.dailyGoal")}
                </p>
                <p class="text-xl font-bold text-slate-800 dark:text-white">
                    {totalSessions > 0
                        ? $_("dashboard.complete", { values: { pct: dailyGoalPct } })
                        : "—"}
                </p>
            </div>
        </div>
    </div>
</div>
