<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import {
        Calendar,
        List,
        FileText,
        Download,
        Lock,
        Activity,
        CheckCircle,
        Loader,
    } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import { getSessionCountInRange } from "$lib/db";

    let userId = $state(0);

    // --- Date Range ---
    let startDate = $state(
        new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split("T")[0],
    );
    let endDate = $state(new Date().toISOString().split("T")[0]);
    let sessionCountInRange = $state(0);

    function setRange(days: number | "ytd") {
        const end = new Date();
        endDate = end.toISOString().split("T")[0];
        if (days === "ytd") {
            startDate = new Date(end.getFullYear(), 0, 1)
                .toISOString()
                .split("T")[0];
        } else {
            const start = new Date();
            start.setDate(end.getDate() - days);
            startDate = start.toISOString().split("T")[0];
        }
    }

    function daysDiff() {
        const a = new Date(startDate);
        const b = new Date(endDate);
        return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
    }

    // Update session count when dates change
    $effect(() => {
        if (userId && startDate && endDate) {
            getSessionCountInRange(userId, startDate, endDate)
                .then((c) => (sessionCountInRange = c))
                .catch(() => {});
        }
    });

    // --- Categories ---
    let categories = $state([
        {
            id: "posture",
            label: () => $_("export.categories_list.posture"),
            enabled: true,
        },
        {
            id: "eye",
            label: () => $_("export.categories_list.eye"),
            enabled: true,
        },
        {
            id: "sensor",
            label: () => $_("export.categories_list.sensor"),
            enabled: false,
        },
        {
            id: "exercise",
            label: () => $_("export.categories_list.exercise"),
            enabled: true,
        },
    ]);

    let activeCount = $derived(categories.filter((c) => c.enabled).length);

    // --- Format ---
    let selectedFormat = $state<"pdf" | "csv" | "json">("pdf");

    const formats = $derived([
        {
            id: "pdf" as const,
            label: $_("export.pdf"),
            sub: $_("export.pdfSub"),
        },
        {
            id: "csv" as const,
            label: $_("export.csv"),
            sub: $_("export.csvSub"),
        },
        {
            id: "json" as const,
            label: $_("export.json"),
            sub: $_("export.jsonSub"),
        },
    ]);

    // --- Recent exports (static — no DB table yet) ---
    const recentExports = [
        {
            name: "Posture Analysis Report",
            id: "RPT-0041",
            date: "Oct 26, 2023",
            format: "PDF",
            status: "Completed",
        },
        {
            name: "Weekly Sensor Data",
            id: "RPT-0040",
            date: "Oct 19, 2023",
            format: "CSV",
            status: "Completed",
        },
        {
            name: "Exercise Log Export",
            id: "RPT-0039",
            date: "Oct 12, 2023",
            format: "JSON",
            status: "Completed",
        },
        {
            name: "Monthly Overview",
            id: "RPT-0038",
            date: "Sep 30, 2023",
            format: "PDF",
            status: "Archived",
        },
    ];

    // --- Generate ---
    let generating = $state(false);
    function generate() {
        generating = true;
        setTimeout(() => (generating = false), 2000);
    }

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }
        userId = user.id;
    });
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            {$_("export.title")}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {$_("export.subtitle")}
        </p>
    </div>

    <!-- Top row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Date Range -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <div
                    class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500"
                >
                    <Calendar class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.dateRange")}
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label
                        class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >{$_("export.startDate")}</label
                    >
                    <input
                        type="date"
                        bind:value={startDate}
                        class="w-full px-3 py-2 rounded-xl text-sm
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-200 dark:border-slate-700
                            text-slate-800 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
                            transition-all"
                    />
                </div>
                <div>
                    <label
                        class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >{$_("export.endDate")}</label
                    >
                    <input
                        type="date"
                        bind:value={endDate}
                        class="w-full px-3 py-2 rounded-xl text-sm
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-200 dark:border-slate-700
                            text-slate-800 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
                            transition-all"
                    />
                </div>
            </div>

            <div class="flex gap-2 mb-3">
                {#each [[$_("export.last7"), 7], [$_("export.last30"), 30], [$_("export.yearToDate"), "ytd"]] as [label, val]}
                    <button
                        onclick={() => setRange(val as number | "ytd")}
                        class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
                            bg-slate-100 dark:bg-slate-800
                            text-slate-600 dark:text-slate-300
                            border border-slate-200 dark:border-slate-700
                            hover:border-sky-400 hover:text-sky-500
                            active:scale-95"
                    >
                        {label}
                    </button>
                {/each}
            </div>

            {#if sessionCountInRange > 0}
                <p class="text-xs text-slate-400">
                    <span class="text-sky-400 font-semibold"
                        >{sessionCountInRange}</span
                    > sessions in selected range
                </p>
            {:else if userId > 0}
                <p class="text-xs text-slate-400">No sessions in range</p>
            {/if}
        </div>

        <!-- Data Categories -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <div
                    class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500"
                >
                    <List class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.categories")}
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-3">
                {#each categories as cat}
                    <div
                        class="flex items-center justify-between px-3 py-2.5 rounded-xl
                        bg-slate-50 dark:bg-slate-800
                        border border-slate-100 dark:border-slate-700"
                    >
                        <span
                            class="text-sm text-slate-700 dark:text-slate-200"
                            >{cat.label()}</span
                        >
                        <button
                            onclick={() => (cat.enabled = !cat.enabled)}
                            class="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0
                                {cat.enabled
                                ? 'bg-sky-400'
                                : 'bg-slate-200 dark:bg-slate-600'}"
                        >
                            <span
                                class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                {cat.enabled
                                    ? 'translate-x-5'
                                    : 'translate-x-0'}"
                            >
                            </span>
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Middle row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Export Format -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <div
                    class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500"
                >
                    <FileText class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.format")}
                </h2>
            </div>

            <div class="flex flex-col gap-2">
                {#each formats as fmt}
                    <button
                        onclick={() => (selectedFormat = fmt.id)}
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                            {selectedFormat === fmt.id
                            ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-700'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                            border"
                    >
                        <div
                            class="w-9 h-9 rounded-lg
                            {selectedFormat === fmt.id
                                ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-500'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                            flex items-center justify-center flex-shrink-0 transition-colors"
                        >
                            <FileText class="w-4 h-4" />
                        </div>
                        <div class="flex-1">
                            <p
                                class="text-sm font-semibold text-slate-800 dark:text-white"
                            >
                                {fmt.label}
                            </p>
                            <p class="text-xs text-slate-400">{fmt.sub}</p>
                        </div>
                        {#if selectedFormat === fmt.id}
                            <div
                                class="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center flex-shrink-0"
                            >
                                <CheckCircle class="w-3.5 h-3.5 text-white" />
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Ready to compile -->
        <div
            class="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center text-center gap-4"
        >
            <div
                class="relative w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center
                shadow-[0_0_40px_rgba(56,189,248,0.15)]"
            >
                <Activity class="w-9 h-9 text-sky-400" />
                <div
                    class="absolute inset-0 rounded-full bg-sky-400/10 animate-pulse"
                ></div>
            </div>

            <div>
                <h2 class="text-xl font-bold text-white mb-2">
                    {$_("export.ready")}
                </h2>
                <p class="text-sm text-slate-400 max-w-xs">
                    {$_("export.readyDesc", {
                        values: {
                            days: daysDiff(),
                            cats: activeCount,
                            fmt: selectedFormat.toUpperCase(),
                        },
                    })}
                </p>
            </div>

            <button
                onclick={generate}
                disabled={generating}
                class="flex items-center gap-2 px-8 py-3 rounded-2xl
                    bg-sky-400 hover:bg-sky-500 disabled:opacity-70
                    text-white font-bold text-sm
                    shadow-lg shadow-sky-400/30
                    transition-all duration-200 active:scale-95"
            >
                {#if generating}
                    <Loader class="w-4 h-4 animate-spin" />
                    {$_("export.generating")}
                {:else}
                    <Download class="w-4 h-4" />
                    {$_("export.generate")}
                {/if}
            </button>

            <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    {$_("export.systemReady")}
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                    <Lock class="w-3 h-3" />
                    {$_("export.encryption")}
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Exports -->
    <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
    >
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <div
                    class="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-500"
                >
                    <Activity class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.recent")}
                </h2>
            </div>
            <button
                class="text-xs font-bold uppercase tracking-widest text-sky-400 hover:text-sky-500 transition-colors"
            >
                {$_("export.viewAll")}
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800">
                        {#each ["Report Name & ID", "Date Generated", "Format", "Status", "Action"] as col}
                            <th
                                class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4"
                                >{col}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each recentExports as row}
                        <tr
                            class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <td class="py-3 pr-4">
                                <p
                                    class="font-medium text-slate-800 dark:text-white"
                                >
                                    {row.name}
                                </p>
                                <p class="text-xs text-slate-400">{row.id}</p>
                            </td>
                            <td
                                class="py-3 pr-4 text-slate-500 dark:text-slate-400"
                                >{row.date}</td
                            >
                            <td class="py-3 pr-4">
                                <span
                                    class="px-2 py-0.5 rounded-md text-xs font-bold
                                    {row.format === 'PDF'
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                                        : row.format === 'CSV'
                                          ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                                          : 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'}"
                                >
                                    {row.format}
                                </span>
                            </td>
                            <td class="py-3 pr-4">
                                <span
                                    class="flex items-center gap-1.5 text-xs font-medium
                                    {row.status === 'Completed'
                                        ? 'text-green-500'
                                        : 'text-slate-400'}"
                                >
                                    <span
                                        class="w-1.5 h-1.5 rounded-full
                                        {row.status === 'Completed'
                                            ? 'bg-green-400'
                                            : 'bg-slate-300'}"
                                    ></span>
                                    {row.status === "Completed"
                                        ? $_("export.status.completed")
                                        : $_("export.status.archived")}
                                </span>
                            </td>
                            <td class="py-3">
                                <button
                                    class="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-500 font-medium transition-colors"
                                >
                                    <Download class="w-3.5 h-3.5" />
                                    {$_("export.download")}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
