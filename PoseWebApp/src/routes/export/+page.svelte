<script lang="ts">
    // --- Date Range ---
    let startDate = $state("2023-10-12");
    let endDate = $state("2023-10-26");

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

    // --- Categories ---
    let categories = $state([
        { id: "posture", label: "Posture Scores", enabled: true },
        { id: "eye", label: "Eye Health Metrics", enabled: true },
        { id: "sensor", label: "Sensor Telemetry", enabled: false },
        { id: "exercise", label: "Exercise History", enabled: true },
    ]);

    let activeCount = $derived(categories.filter((c) => c.enabled).length);

    // --- Format ---
    let selectedFormat = $state<"pdf" | "csv" | "json">("pdf");

    const formats = [
        {
            id: "pdf",
            label: "PDF Document",
            sub: "Visual Report Style",
            icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
        },
        {
            id: "csv",
            label: "CSV Dataset",
            sub: "Spreadsheet Compatible",
            icon: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
        },
        {
            id: "json",
            label: "JSON API Feed",
            sub: "Developer Format",
            icon: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
        },
    ] as const;

    // --- Recent exports ---
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
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            Export Data
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Configure your data parameters to generate a detailed analytics
            report. Choose your time range, specific metrics, and preferred file
            format.
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line
                            x1="16"
                            y1="2"
                            x2="16"
                            y2="6"
                        /><line x1="8" y1="2" x2="8" y2="6" /><line
                            x1="3"
                            y1="10"
                            x2="21"
                            y2="10"
                        />
                    </svg>
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    Date Range Selection
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label
                        class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >Start Date</label
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
                        >End Date</label
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

            <div class="flex gap-2">
                {#each [["Last 7 Days", 7], ["Last 30 Days", 30], ["Year to Date", "ytd"]] as [label, val]}
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
        </div>

        <!-- Data Categories -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
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
                        <line x1="8" y1="6" x2="21" y2="6" /><line
                            x1="8"
                            y1="12"
                            x2="21"
                            y2="12"
                        /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line
                            x1="3"
                            y1="12"
                            x2="3.01"
                            y2="12"
                        /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    Data Category Selection
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-3">
                {#each categories as cat}
                    <div
                        class="flex items-center justify-between px-3 py-2.5 rounded-xl
                        bg-slate-50 dark:bg-slate-800
                        border border-slate-100 dark:border-slate-700"
                    >
                        <span class="text-sm text-slate-700 dark:text-slate-200"
                            >{cat.label}</span
                        >
                        <!-- Toggle -->
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        /><polyline points="14 2 14 8 20 8" />
                    </svg>
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    Export Format
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d={fmt.icon} />
                            </svg>
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-3.5 h-3.5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="3"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
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
            <!-- Glow orb -->
            <div
                class="relative w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center
                shadow-[0_0_40px_rgba(56,189,248,0.15)]"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-9 h-9 text-sky-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                    />
                </svg>
                <div
                    class="absolute inset-0 rounded-full bg-sky-400/10 animate-pulse"
                ></div>
            </div>

            <div>
                <h2 class="text-xl font-bold text-white mb-2">
                    Ready to compile?
                </h2>
                <p class="text-sm text-slate-400 max-w-xs">
                    Your selected parameters include <span
                        class="text-white font-medium">{daysDiff()} days</span
                    >
                    of data with
                    <span class="text-white font-medium"
                        >{activeCount} active categories</span
                    >
                    in
                    <span class="text-white font-medium"
                        >{selectedFormat.toUpperCase()}</span
                    > format.
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
                    Generating...
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                        /><polyline points="7 10 12 15 17 10" /><line
                            x1="12"
                            y1="15"
                            x2="12"
                            y2="3"
                        />
                    </svg>
                    Generate Export
                {/if}
            </button>

            <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    System Ready
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                    128-bit Encryption
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    Recent Exports List
                </h2>
            </div>
            <button
                class="text-xs font-bold uppercase tracking-widest text-sky-400 hover:text-sky-500 transition-colors"
            >
                View All History →
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
                                    >
                                    </span>
                                    {row.status}
                                </span>
                            </td>
                            <td class="py-3">
                                <button
                                    class="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-500 font-medium transition-colors"
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
                                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                        /><polyline
                                            points="7 10 12 15 17 10"
                                        /><line
                                            x1="12"
                                            y1="15"
                                            x2="12"
                                            y2="3"
                                        />
                                    </svg>
                                    Download
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
