<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { formatDistanceToNow, format } from "date-fns";
    import { es, enUS } from "date-fns/locale";
    import {
        ArrowLeft,
        Clock,
        AlertTriangle,
        Eye,
        Activity,
        CheckCircle,
        XCircle,
    } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import { getSessionById, getSessionWarnings } from "$lib/db";
    import type { UserSession, Warning } from "$lib/db";

    const sessionId = parseInt($page.params.id);

    let session = $state<UserSession | null>(null);
    let warnings = $state<Warning[]>([]);
    let loading = $state(true);

    function dfnsLocale() { return $locale?.startsWith('es') ? es : enUS; }

    function formatDate(dateStr: string): string {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        const diffDays = (Date.now() - d.getTime()) / 86_400_000;
        if (diffDays < 7) return formatDistanceToNow(d, { addSuffix: true, locale: dfnsLocale() });
        return format(d, dfnsLocale() === es ? "EEEE, d 'de' MMMM yyyy" : 'EEEE, MMMM d, yyyy', { locale: dfnsLocale() });
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

    function formatDuration(seconds?: number): string {
        if (!seconds) return "—";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    }

    function postureLabel(score?: number): string {
        if (!score) return "—";
        if (score >= 95) return $_("dashboard.posture.excellent");
        if (score >= 80) return $_("dashboard.posture.good");
        if (score >= 60) return $_("dashboard.posture.fair");
        return $_("dashboard.posture.poor");
    }

    function scoreColor(s?: number): string {
        if (!s) return "#94a3b8";
        if (s >= 80) return "#22c55e";
        if (s >= 60) return "#eab308";
        return "#ef4444";
    }

    function severityLabel(s?: number): string {
        if (!s) return "—";
        if (s >= 3) return "HIGH";
        if (s >= 2) return "MEDIUM";
        return "LOW";
    }

    function severityStyle(s?: number): string {
        if (!s || s < 2) return "text-green-500 bg-green-500/10 border-green-500/20";
        if (s < 3) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-500 bg-red-500/10 border-red-500/20";
    }

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }

        try {
            const s = await getSessionById(sessionId);
            if (!s || s.user_id !== user.id) {
                goto("/progress");
                return;
            }
            session = s;
            warnings = await getSessionWarnings(sessionId);
        } catch (e) {
            console.error("Failed to load session:", e);
            goto("/progress");
        } finally {
            loading = false;
        }
    });
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    {#if loading}
        <div class="flex items-center justify-center h-32 text-slate-400">
            <p class="text-sm">{$_("common.loading")}</p>
        </div>
    {:else if !session}
        <div class="flex items-center justify-center h-32 text-slate-400">
            <p class="text-sm">Session not found.</p>
        </div>
    {:else}
        <!-- Back + header -->
        <div class="flex items-center gap-4 mb-6">
            <button
                onclick={() => goto("/progress")}
                class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 transition-colors"
            >
                <ArrowLeft class="w-4 h-4" />
                {$_("reports.backToProgress")}
            </button>
        </div>

        <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_("reports.sessionDetail")}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {formatDate(session.session_start)}
            </p>
        </div>

        <!-- Overview cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- Duration -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"
            >
                <div
                    class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 mb-3"
                >
                    <Clock class="w-5 h-5" />
                </div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("reports.duration")}
                </p>
                <p
                    class="text-2xl font-bold text-slate-800 dark:text-white"
                >
                    {formatDuration(session.duration)}
                </p>
                <p class="text-xs text-slate-400 mt-1">
                    {formatTime(session.session_start, session.session_end)}
                </p>
            </div>

            <!-- Posture Score -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"
            >
                <div
                    class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mb-3"
                >
                    <Activity class="w-5 h-5" />
                </div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("reports.postureScore")}
                </p>
                <p
                    class="text-2xl font-bold"
                    style="color: {scoreColor(session.posture_score)}"
                >
                    {session.posture_score ?? "—"}
                    {#if session.posture_score}
                        <span class="text-base font-normal text-slate-400"
                            >/100</span
                        >
                    {/if}
                </p>
                <p class="text-xs text-slate-400 mt-1">
                    {postureLabel(session.posture_score)}
                </p>
            </div>

            <!-- Alerts -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"
            >
                <div
                    class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mb-3"
                >
                    <AlertTriangle class="w-5 h-5" />
                </div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("reports.alerts")}
                </p>
                <p
                    class="text-2xl font-bold text-slate-800 dark:text-white"
                >
                    {session.warnings}
                </p>
                <p class="text-xs text-slate-400 mt-1">
                    {warnings.filter((w) => w.resolved).length} resolved
                </p>
            </div>

            <!-- Eye Distance -->
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"
            >
                <div
                    class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mb-3"
                >
                    <Eye class="w-5 h-5" />
                </div>
                <p class="text-xs text-slate-400 mb-1">
                    {$_("reports.eye_distance")}
                </p>
                <p
                    class="text-2xl font-bold text-slate-800 dark:text-white"
                >
                    {session.eye_distance
                        ? `${Math.round(session.eye_distance)}cm`
                        : "—"}
                </p>
                {#if session.blink_rate}
                    <p class="text-xs text-slate-400 mt-1">
                        {$_("reports.blink_rate")}: {Math.round(
                            session.blink_rate,
                        )} BPM
                    </p>
                {/if}
            </div>
        </div>

        <!-- Score bar -->
        {#if session.posture_score}
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-4"
            >
                <h2 class="font-semibold text-slate-800 dark:text-white mb-3">
                    {$_("reports.postureScore")}
                </h2>
                <div
                    class="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
                >
                    <div
                        class="h-full rounded-full transition-all duration-700"
                        style="width: {session.posture_score}%; background: {scoreColor(
                            session.posture_score,
                        )}"
                    ></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-slate-400">
                    <span>0</span>
                    <span class="font-bold" style="color: {scoreColor(session.posture_score)}"
                        >{session.posture_score}/100 — {postureLabel(
                            session.posture_score,
                        )}</span
                    >
                    <span>100</span>
                </div>
            </div>
        {/if}

        <!-- Warnings table -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <AlertTriangle class="w-4 h-4 text-orange-400" />
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("reports.posture_warnings")}
                </h2>
                <span
                    class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                >
                    {warnings.length}
                </span>
            </div>

            {#if warnings.length === 0}
                <div
                    class="flex flex-col items-center justify-center py-10 text-slate-400"
                >
                    <CheckCircle class="w-8 h-8 mb-2 text-green-400" />
                    <p class="text-sm">{$_("reports.no_warnings")}</p>
                </div>
            {:else}
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr
                                class="border-b border-slate-100 dark:border-slate-800"
                            >
                                {#each ["Type", "Label", $_("reports.severity"), "Duration", $_("reports.resolved")] as col}
                                    <th
                                        class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4"
                                        >{col}</th
                                    >
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each warnings as w}
                                <tr
                                    class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td
                                        class="py-3 pr-4 text-sm text-slate-700 dark:text-slate-300 font-mono"
                                    >
                                        {w.warning_type ?? "—"}
                                    </td>
                                    <td
                                        class="py-3 pr-4 text-sm text-slate-600 dark:text-slate-300"
                                    >
                                        {w.label ?? "—"}
                                    </td>
                                    <td class="py-3 pr-4">
                                        <span
                                            class="text-xs font-bold px-2 py-0.5 rounded-md border {severityStyle(
                                                w.severity,
                                            )}"
                                        >
                                            {severityLabel(w.severity)}
                                        </span>
                                    </td>
                                    <td
                                        class="py-3 pr-4 text-sm text-slate-500 dark:text-slate-400"
                                    >
                                        {w.duration ? `${w.duration}s` : "—"}
                                    </td>
                                    <td class="py-3">
                                        {#if w.resolved}
                                            <CheckCircle
                                                class="w-4 h-4 text-green-500"
                                            />
                                        {:else}
                                            <XCircle
                                                class="w-4 h-4 text-slate-300"
                                            />
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    {/if}
</div>
