<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { cubicOut } from "svelte/easing";
    import { PieChart, LineChart, Text, defaultChartPadding } from "layerchart";
    import { _ } from "svelte-i18n";
    import { Eye, Clock, Lightbulb, Calendar, Activity, Trophy } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import {
        getWeeklyStats,
        getSessionStats,
        getActiveSession,
    } from "$lib/db";

    // --- Score gauge ---
    let count = $state(100);
    let score = $state(85);
    let animated = $state(0);
    let dailyGoalPct = $state(85);

    let label = $derived(
        animated >= 95
            ? $_("dashboard.posture.excellent")
            : animated >= 80
              ? $_("dashboard.posture.good")
              : animated >= 60
                ? $_("dashboard.posture.fair")
                : $_("dashboard.posture.poor"),
    );

    let pieData = $derived(
        Array.from({ length: count }, (_, i) => ({
            key: i + 1,
            value: 1,
            color: (i / count) * 100 < animated ? "#38bdf8" : "#bfdbfe",
        })),
    );

    // --- Line chart ---
    type DataPoint = { date: Date; value: number };
    const today = new Date();

    const defaultWeekValues = [72, 68, 80, 75, 85, 90, 85];
    let weekData = $state<DataPoint[]>(
        defaultWeekValues.map((value, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            return { date: d, value };
        }),
    );

    const dayValues = [60, 70, 78, 82, 85, 83, 85];
    const dayData: DataPoint[] = dayValues.map((value, i) => {
        const d = new Date(today);
        d.setHours(9 + i);
        return { date: d, value };
    });

    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    let view = $state<"Day" | "Week">("Week");
    let chartData = $derived(view === "Week" ? weekData : dayData);

    // --- Timer ---
    let seconds = $state(0);
    let timerStr = $derived(() => {
        const h = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h} : ${m} : ${s}`;
    });

    // --- Eye distance ---
    let eyeDist = $state(62);
    let distPct = $derived(
        Math.min(Math.max((eyeDist - 30) / (100 - 30), 0), 1) * 100,
    );
    let distColor = $derived(
        eyeDist >= 50 && eyeDist <= 70
            ? "#a855f7"
            : eyeDist < 50
              ? "#ef4444"
              : "#f59e0b",
    );

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(user);

        // Load session stats for posture score gauge
        try {
            const stats = await getSessionStats(user.id);
            if (stats.total_sessions > 0 && stats.avg_score) {
                score = Math.round(stats.avg_score);
                dailyGoalPct = Math.min(
                    100,
                    Math.round((stats.avg_score / user.posture_goal) * 100),
                );
            }
        } catch (e) {
            console.error("Failed to load session stats:", e);
        }

        // Load weekly stats for chart
        try {
            const weekly = await getWeeklyStats(user.id);
            if (weekly.length > 0) {
                const last7: DataPoint[] = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dayStr = d.toISOString().split("T")[0];
                    const found = weekly.find((w) => w.day === dayStr);
                    last7.push({
                        date: d,
                        value: found ? Math.round(found.avg_score) : 0,
                    });
                }
                weekData = last7;
            }
        } catch (e) {
            console.error("Failed to load weekly stats:", e);
        }

        // Load active session for timer
        try {
            const activeSession = await getActiveSession(user.id);
            if (activeSession) {
                const start = new Date(activeSession.session_start);
                seconds = Math.floor(
                    (Date.now() - start.getTime()) / 1000,
                );
            }
        } catch (e) {
            console.error("Failed to load active session:", e);
        }

        // Animate score gauge
        animated = 0;
        let start: number;
        function animate(ts: number) {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 900, 1);
            animated = score * cubicOut(p);
            if (p < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        // Timer
        const interval = setInterval(() => seconds++, 1000);
        return () => clearInterval(interval);
    });
</script>

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
                {$_("dashboard.subtitle", { values: { pct: 12 } })}
            </p>
        </div>
        <div class="flex gap-3 *:cursor-pointer">
            <button
                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                {$_("common.export")}
            </button>
            <button
                onclick={() => goto("/camera")}
                class="px-4 py-2 rounded-xl bg-sky-400 text-white text-sm font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-400/30"
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
                    {/snippet}
                </PieChart>
            </div>
            <span
                class="px-4 py-1 rounded-full border border-sky-300 text-sky-500 text-xs font-bold tracking-widest"
            >
                {label}
            </span>
            <p class="text-center text-sm text-slate-400">
                {$_("dashboard.currentScore")}
            </p>
        </div>

        <!-- Daily Progress card -->
        <div
            class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col"
        >
            <div class="flex items-start justify-between mb-1">
                <div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        {$_("dashboard.dailyProgress")}
                    </h2>
                    <p class="text-xs text-slate-400">
                        {$_("dashboard.posturalAlignment")}
                    </p>
                </div>
                <div
                    class="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1"
                >
                    {#each (["Day", "Week"] as Array<"Day" | "Week">) as v}
                        <button
                            onclick={() => (view = v)}
                            class="px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer {view ===
                            v
                                ? 'bg-sky-400 text-white shadow'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
                        >
                            {v === "Day"
                                ? $_("dashboard.day")
                                : $_("dashboard.week")}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="flex-1 min-h-[200px] text-sky-400">
                <LineChart
                    data={chartData}
                    x="date"
                    y="value"
                    padding={defaultChartPadding({ right: 10, bottom: 30 })}
                    lineProps={{ class: "stroke-sky-400 stroke-2" }}
                />
            </div>

            <!-- Day labels -->
            <div class="flex justify-between px-2 mt-1">
                {#each days as d}
                    <span class="text-xs text-slate-400">{d}</span>
                {/each}
            </div>
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
                    <p
                        class="font-semibold text-slate-800 dark:text-white text-sm"
                    >
                        {$_("dashboard.eyeToScreen")}
                    </p>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">
                        {$_("dashboard.realtimeDepth")}
                    </p>
                </div>
            </div>
            <p class="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {eyeDist}
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
                <span>{$_("dashboard.tooClose")}</span><span
                    >{$_("dashboard.optimal")}</span
                ><span>{$_("dashboard.tooFar")}</span>
            </div>
            <div
                class="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2"
            >
                <div
                    class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
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
                <span class="text-sm text-green-600 dark:text-green-400"
                    >{$_("dashboard.safeDistance")}</span
                >
            </div>
        </div>

        <!-- Active Session -->
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
                    class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
                >
                    <Clock class="w-4 h-4" />
                </div>
            </div>
            <div class="flex-1 flex items-center justify-center">
                <p
                    class="text-4xl font-bold text-sky-400 tabular-nums tracking-widest"
                >
                    {timerStr()}
                </p>
            </div>
            <button
                onclick={() => (seconds = 0)}
                class="mt-4 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                {$_("dashboard.resetSession")}
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
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"
        >
            <div
                class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500"
            >
                <Calendar class="w-6 h-6" />
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("dashboard.nextBreak")}
                </p>
                <p class="text-xl font-bold text-slate-800 dark:text-white">
                    14 Minutes
                </p>
            </div>
        </div>

        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"
        >
            <div
                class="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500"
            >
                <Activity class="w-6 h-6" />
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("dashboard.aiStatus")}
                </p>
                <p class="text-xl font-bold text-slate-800 dark:text-white">
                    {$_("dashboard.highPrecision")}
                </p>
            </div>
        </div>

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
                    {$_("dashboard.complete", { values: { pct: dailyGoalPct } })}
                </p>
            </div>
        </div>
    </div>
</div>
