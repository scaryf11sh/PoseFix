<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _, locale } from "svelte-i18n";
    import { formatDistanceToNow, format, isThisYear } from "date-fns";
    import { es, enUS } from "date-fns/locale";
    import {
        Search,
        Calendar,
        SlidersHorizontal,
        Download,
        ChevronLeft,
        ChevronRight,
        Clock,
        User,
        AlertTriangle,
        BarChart2,
        Dumbbell,
        Star,
        Trophy,
    } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import {
        getSessionStats,
        getSessionSummaries,
        getSessionCount,
        getExerciseTotals,
        getExerciseDailyStats,
        getRecentExerciseLogs,
    } from "$lib/db";
    import type { SessionSummary, ExerciseTotals, ExerciseDailyStat, ExerciseLogExtended } from "$lib/db";
    import ExerciseChart from "$lib/components/ui/Charts/ExerciseChart.svelte";

    type FatigueLevel = "LOW" | "MEDIUM" | "HIGH";

    // --- Exercise Stats ---
    let exerciseTotals = $state<ExerciseTotals>({ total_exercises: 0, total_points: 0, best_day_points: 0 });
    let exerciseDailyStats = $state<ExerciseDailyStat[]>([]);
    let recentExerciseLogs = $state<ExerciseLogExtended[]>([]);
    let exerciseChartDays = $state(7);
    let exerciseChartMode = $state<'count' | 'points'>('count');

    // --- Stats ---
    let totalSessionsCount = $state(0);
    let avgScore = $state(0);
    let totalDuration = $state(0); // seconds
    let totalWarningsCount = $state(0);

    // --- Sessions ---
    let sessions = $state<SessionSummary[]>([]);
    let loading = $state(true);
    let userId = $state(0);

    // --- Filters ---
    let search = $state("");
    let dateRange = $state("Last 30 Days");
    let page = $state(1);
    const perPage = 5;
    let totalCount = $state(0);
    let totalPages = $derived(Math.max(1, Math.ceil(totalCount / perPage)));
    let showDateMenu = $state(false);

    const dateRanges = [
        "Last 7 Days",
        "Last 30 Days",
        "Last 90 Days",
        "Year to Date",
    ];

    // Client-side search filter
    let filtered = $derived(
        sessions.filter(
            (s) =>
                !search ||
                formatDate(s.session_start)
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                formatDuration(s.duration ?? 0)
                    .toLowerCase()
                    .includes(search.toLowerCase()),
        ),
    );

    function dfnsLocale() {
        return $locale?.startsWith('es') ? es : enUS;
    }

    function timeAgo(dateStr: string): string {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        const diffMs = Date.now() - d.getTime();
        const diffDays = diffMs / 86_400_000;
        if (diffDays < 7) {
            return formatDistanceToNow(d, { addSuffix: true, locale: dfnsLocale() });
        }
        const fmt = isThisYear(d)
            ? (dfnsLocale() === es ? 'd MMM' : 'MMM d')
            : (dfnsLocale() === es ? 'd MMM yyyy' : 'MMM d, yyyy');
        return format(d, fmt, { locale: dfnsLocale() });
    }

    function formatDate(dateStr: string): string {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        const fmt = isThisYear(d)
            ? (dfnsLocale() === es ? 'd MMM' : 'MMM d')
            : (dfnsLocale() === es ? 'd MMM yyyy' : 'MMM d, yyyy');
        return format(d, fmt, { locale: dfnsLocale() });
    }

    function formatTime(start: string, end?: string): string {
        if (!start) return "—";
        const s = new Date(start).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
        if (!end) return `${s} — ${$_("reports.ongoing")}`;
        const e = new Date(end).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${s} – ${e}`;
    }

    function formatDuration(seconds: number): string {
        if (!seconds) return "—";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    }

    function formatTotalTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        return `${h}h`;
    }

    function fatigueFromScore(score?: number): FatigueLevel {
        if (!score || score < 33) return "LOW";
        if (score < 66) return "MEDIUM";
        return "HIGH";
    }

    function fatigueLabel(f: FatigueLevel): string {
        if (f === "LOW") return $_("reports.fatigue.low");
        if (f === "MEDIUM") return $_("reports.fatigue.medium");
        return $_("reports.fatigue.high");
    }

    function fatigueStyle(f: FatigueLevel) {
        if (f === "LOW")
            return "text-green-500 bg-green-500/10 border-green-500/20";
        if (f === "MEDIUM")
            return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-500 bg-red-500/10 border-red-500/20";
    }

    function scoreColor(s: number) {
        if (s >= 85) return "#22c55e";
        if (s >= 70) return "#eab308";
        return "#ef4444";
    }

    function visiblePages() {
        const pages: (number | "...")[] = [];
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        pages.push(1, 2, 3);
        if (page > 4) pages.push("...");
        if (page > 3 && page < totalPages - 1) pages.push(page);
        pages.push("...", totalPages);
        return pages;
    }

    async function loadSessions() {
        if (!userId) return;
        const offset = (page - 1) * perPage;
        sessions = await getSessionSummaries(userId, perPage, offset);
    }

    $effect(() => {
        if (userId && page) {
            loadSessions();
        }
    });

    $effect(() => {
        if (userId && exerciseChartDays) {
            getExerciseDailyStats(userId, exerciseChartDays).then(stats => {
                exerciseDailyStats = stats;
            }).catch(e => console.error("Failed to reload exercise daily stats:", e));
        }
    });

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }
        userId = user.id;

        try {
            const [stats, count] = await Promise.all([
                getSessionStats(user.id),
                getSessionCount(user.id),
            ]);
            totalSessionsCount = stats.total_sessions;
            avgScore = Math.round(stats.avg_score ?? 0);
            totalDuration = stats.total_duration;
            totalWarningsCount = stats.total_warnings;
            totalCount = count;
        } catch (e) {
            console.error("Failed to load session stats:", e);
        }

        try {
            sessions = await getSessionSummaries(user.id, perPage, 0);
        } catch (e) {
            console.error("Failed to load sessions:", e);
        }

        try {
            const [totals, dailyStats, recentLogs] = await Promise.all([
                getExerciseTotals(user.id),
                getExerciseDailyStats(user.id, 30),
                getRecentExerciseLogs(user.id, 8),
            ]);
            exerciseTotals = totals;
            exerciseDailyStats = dailyStats;
            recentExerciseLogs = recentLogs;
        } catch (e) {
            console.error("Failed to load exercise stats:", e);
        }

        loading = false;
    });

    const statCards = $derived([
        {
            label: $_("reports.stats.totalSessions"),
            value: String(totalSessionsCount),
            unit: "",
            badge: totalSessionsCount > 0
                ? $_("reports.stats.thisWeek", { values: { n: 4 } })
                : "",
            badgeColor: "text-sky-400 bg-sky-400/10",
            icon: Clock,
            iconColor: "text-sky-400 bg-sky-400/10",
        },
        {
            label: $_("reports.stats.avgScore"),
            value: avgScore > 0 ? String(avgScore) : "—",
            unit: avgScore > 0 ? "/100" : "",
            badge: "",
            badgeColor: "",
            icon: User,
            iconColor: "text-purple-400 bg-purple-400/10",
        },
        {
            label: $_("reports.stats.totalTime"),
            value: formatTotalTime(totalDuration),
            unit: "",
            badge: "",
            badgeColor: "",
            icon: BarChart2,
            iconColor: "text-sky-400 bg-sky-400/10",
        },
        {
            label: $_("reports.stats.totalAlerts"),
            value: String(totalWarningsCount),
            unit: "",
            badge: totalWarningsCount > 0
                ? $_("reports.stats.improvement", { values: { pct: 15 } })
                : "",
            badgeColor: "text-red-400 bg-red-400/10",
            icon: AlertTriangle,
            iconColor: "text-orange-400 bg-orange-400/10",
        },
    ]);
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {$_("reports.title")}
    </h1>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {#each statCards as stat}
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"
            >
                <div class="flex items-start justify-between mb-4">
                    <div
                        class="w-10 h-10 rounded-xl {stat.iconColor} flex items-center justify-center"
                    >
                        <stat.icon class="w-5 h-5" />
                    </div>
                    {#if stat.badge}
                        <span
                            class="text-xs font-semibold px-2 py-0.5 rounded-full {stat.badgeColor}"
                        >
                            {stat.badge}
                        </span>
                    {/if}
                </div>
                <p class="text-xs text-slate-400 mb-1">{stat.label}</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">
                    {stat.value}<span class="text-lg font-normal text-slate-400"
                        >{stat.unit}</span
                    >
                </p>
            </div>
        {/each}
    </div>

    <!-- Table card -->
    <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
        <!-- Table toolbar -->
        <div
            class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800"
        >
            <!-- Search -->
            <div class="relative flex-1 min-w-[180px]">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <input
                    type="text"
                    placeholder={$_("reports.search")}
                    bind:value={search}
                    class="pl-9 pr-4 py-2 w-full rounded-xl text-sm
                        bg-slate-50 dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        text-slate-800 dark:text-white placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                />
            </div>

            <!-- Date range -->
            <div class="relative">
                <button
                    onclick={() => (showDateMenu = !showDateMenu)}
                    class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                        bg-slate-50 dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        text-slate-700 dark:text-slate-200
                        hover:border-sky-400 transition-all"
                >
                    <Calendar class="w-4 h-4 text-sky-400" />
                    {dateRange}
                    <ChevronRight
                        class="w-3.5 h-3.5 text-slate-400 rotate-90"
                    />
                </button>
                {#if showDateMenu}
                    <div
                        class="absolute top-full mt-1 left-0 z-10 w-44 rounded-xl shadow-lg
                        bg-white dark:bg-slate-800
                        border border-slate-100 dark:border-slate-700 overflow-hidden"
                    >
                        {#each dateRanges as dr}
                            <button
                                onclick={() => {
                                    dateRange = dr;
                                    showDateMenu = false;
                                }}
                                class="w-full text-left px-4 py-2 text-sm
                                    {dateRange === dr
                                    ? 'text-sky-400 font-semibold bg-sky-50 dark:bg-sky-900/20'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}
                                    transition-colors"
                            >
                                {dr}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Filters -->
            <button
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                bg-slate-50 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-700 dark:text-slate-200
                hover:border-sky-400 transition-all"
            >
                <SlidersHorizontal class="w-4 h-4" />
                {$_("common.filter")}
            </button>

            <div class="ml-auto">
                <button
                    onclick={() => goto("/export")}
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                    bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600
                    text-white transition-all shadow-sm active:scale-95"
                >
                    <Download class="w-4 h-4" />
                    {$_("common.export")}
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            {#if loading}
                <div class="flex items-center justify-center py-12 text-slate-400">
                    <p class="text-sm">{$_("common.loading")}</p>
                </div>
            {:else if filtered.length === 0}
                <div class="flex flex-col items-center justify-center py-12 text-slate-400">
                    <BarChart2 class="w-10 h-10 mb-3 opacity-40" />
                    <p class="text-sm">{$_("reports.noSessions")}</p>
                </div>
            {:else}
                <table class="w-full">
                    <thead>
                        <tr
                            class="border-b border-slate-100 dark:border-slate-800"
                        >
                            {#each [$_("reports.dateTime"), $_("reports.duration"), $_("reports.postureScore"), $_("reports.alerts"), $_("reports.eyeFatigue"), $_("reports.actions")] as col}
                                <th
                                    class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-5 py-3"
                                    >{col}</th
                                >
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each filtered as s}
                            {@const fatigue = fatigueFromScore(
                                s.fatigue_score,
                            )}
                            <tr
                                class="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                <!-- Date -->
                                <td class="px-5 py-4">
                                    <p
                                        class="font-semibold text-slate-800 dark:text-white text-sm"
                                    >
                                        {formatDate(s.session_start)}
                                    </p>
                                    <p class="text-xs text-slate-400 mt-0.5">
                                        {formatTime(
                                            s.session_start,
                                            s.session_end,
                                        )}
                                    </p>
                                </td>
                                <!-- Duration -->
                                <td
                                    class="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium"
                                    >{formatDuration(s.duration ?? 0)}</td
                                >
                                <!-- Score -->
                                <td class="px-5 py-4">
                                    {#if s.posture_score}
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
                                            >
                                                <div
                                                    class="h-full rounded-full transition-all duration-500"
                                                    style="width: {s.posture_score}%; background: {scoreColor(
                                                        s.posture_score,
                                                    )}"
                                                ></div>
                                            </div>
                                            <span
                                                class="text-sm font-bold"
                                                style="color: {scoreColor(
                                                    s.posture_score,
                                                )}"
                                                >{s.posture_score}</span
                                            >
                                        </div>
                                    {:else}
                                        <span class="text-sm text-slate-400"
                                            >—</span
                                        >
                                    {/if}
                                </td>
                                <!-- Alerts -->
                                <td
                                    class="px-5 py-4 text-sm text-slate-600 dark:text-slate-300"
                                    >{s.warnings} {$_("reports.alerts").toLowerCase()}</td
                                >
                                <!-- Eye fatigue -->
                                <td class="px-5 py-4">
                                    <span
                                        class="text-xs font-bold px-2.5 py-1 rounded-md border {fatigueStyle(
                                            fatigue,
                                        )}"
                                    >
                                        {fatigueLabel(fatigue)}
                                    </span>
                                </td>
                                <!-- Actions -->
                                <td class="px-5 py-4">
                                    <button
                                        onclick={() =>
                                            goto(`/progress/${s.id}`)}
                                        class="text-sm font-bold text-sky-400 hover:text-sky-500 transition-colors"
                                    >
                                        {$_("reports.report")}
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>

        <!-- Pagination -->
        <div
            class="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800"
        >
            <p class="text-sm text-slate-400">
                {$_("reports.showing", {
                    values: {
                        from: Math.min(
                            (page - 1) * perPage + 1,
                            totalCount,
                        ),
                        to: Math.min(page * perPage, totalCount),
                        total: totalCount,
                    },
                })}
            </p>

            <div class="flex items-center gap-1">
                <button
                    onclick={() => page > 1 && page--}
                    disabled={page === 1}
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    <ChevronLeft class="w-4 h-4" />
                </button>

                {#each visiblePages() as p}
                    {#if p === "..."}
                        <span
                            class="w-8 h-8 flex items-center justify-center text-slate-400 text-sm"
                            >...</span
                        >
                    {:else}
                        <button
                            onclick={() => (page = p as number)}
                            class="w-8 h-8 rounded-lg text-sm font-medium transition-all
                                {page === p
                                ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/30'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
                        >
                            {p}
                        </button>
                    {/if}
                {/each}

                <button
                    onclick={() => page < totalPages && page++}
                    disabled={page === totalPages}
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>

    <!-- ─── Exercise Activity Section ─── -->
    <div class="mt-8">
        <div class="flex items-center gap-2 mb-4">
            <Dumbbell class="w-5 h-5 text-sky-400" />
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                {$_("exercises.chart.title")}
            </h2>
        </div>

        <!-- Mini stat cards -->
        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center">
                        <Dumbbell class="w-4 h-4 text-sky-400" />
                    </div>
                </div>
                <p class="text-xs text-slate-400 mb-1">{$_("exercises.stats.totalExercises")}</p>
                <p class="text-2xl font-bold text-slate-800 dark:text-white">{exerciseTotals.total_exercises}</p>
            </div>
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">
                        <Star class="w-4 h-4 text-amber-400" />
                    </div>
                </div>
                <p class="text-xs text-slate-400 mb-1">{$_("exercises.stats.totalPoints")}</p>
                <p class="text-2xl font-bold text-slate-800 dark:text-white">{exerciseTotals.total_points}</p>
            </div>
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                        <Trophy class="w-4 h-4 text-emerald-400" />
                    </div>
                </div>
                <p class="text-xs text-slate-400 mb-1">{$_("exercises.stats.bestDay")}</p>
                <p class="text-2xl font-bold text-slate-800 dark:text-white">{exerciseTotals.best_day_points}</p>
            </div>
        </div>

        <!-- Chart card -->
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-6">
            <!-- Toggles -->
            <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
                <!-- Days toggle -->
                <div class="flex items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                    {#each [7, 14, 30] as d}
                        <button
                            onclick={() => (exerciseChartDays = d)}
                            class="px-3 py-1 rounded-lg text-xs font-semibold transition-all
                                {exerciseChartDays === d
                                ? 'bg-sky-400 text-white shadow-sm shadow-sky-400/30'
                                : 'text-slate-500 dark:text-slate-400 hover:text-sky-400'}"
                        >
                            {d === 7 ? $_("exercises.chart.days7") : d === 14 ? $_("exercises.chart.days14") : $_("exercises.chart.days30")}
                        </button>
                    {/each}
                </div>
                <!-- Mode toggle -->
                <div class="flex items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                    <button
                        onclick={() => (exerciseChartMode = 'count')}
                        class="px-3 py-1 rounded-lg text-xs font-semibold transition-all
                            {exerciseChartMode === 'count'
                            ? 'bg-sky-400 text-white shadow-sm shadow-sky-400/30'
                            : 'text-slate-500 dark:text-slate-400 hover:text-sky-400'}"
                    >
                        {$_("exercises.chart.toggleCount")}
                    </button>
                    <button
                        onclick={() => (exerciseChartMode = 'points')}
                        class="px-3 py-1 rounded-lg text-xs font-semibold transition-all
                            {exerciseChartMode === 'points'
                            ? 'bg-sky-400 text-white shadow-sm shadow-sky-400/30'
                            : 'text-slate-500 dark:text-slate-400 hover:text-sky-400'}"
                    >
                        {$_("exercises.chart.togglePoints")}
                    </button>
                </div>
            </div>

            <ExerciseChart dailyStats={exerciseDailyStats} mode={exerciseChartMode} days={exerciseChartDays} />
        </div>

        <!-- Recent exercise log -->
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 class="font-semibold text-slate-800 dark:text-white text-sm">
                    {$_("exercises.stats.recentActivity")}
                </h3>
            </div>

            {#if recentExerciseLogs.length === 0}
                <div class="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Dumbbell class="w-8 h-8 mb-2 opacity-40" />
                    <p class="text-sm">{$_("exercises.stats.noActivity")}</p>
                </div>
            {:else}
                <ul class="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {#each recentExerciseLogs as log}
                        <li class="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                                    <Dumbbell class="w-4 h-4 text-sky-400" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-slate-800 dark:text-white">{log.exercise}</p>
                                    <p class="text-xs text-slate-400 mt-0.5">
                                        {timeAgo(log.completed_at)}
                                        {#if log.category}
                                            · {log.category}
                                        {/if}
                                    </p>
                                </div>
                            </div>
                            <span class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                                <Trophy class="w-3 h-3" />
                                {log.points} {$_("exercises.stats.pointsEarned")}
                            </span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
</div>
