<script lang="ts">
    // --- Stats ---
    const stats = [
        {
            label: "Total Sessions",
            value: "142",
            unit: "",
            badge: "+4 this week",
            badgeColor: "text-sky-400 bg-sky-400/10",
            icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
            iconColor: "text-sky-400 bg-sky-400/10",
        },
        {
            label: "Avg. Posture Score",
            value: "84",
            unit: "/100",
            badge: "Optimal",
            badgeColor: "text-purple-400 bg-purple-400/10",
            icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z",
            iconColor: "text-purple-400 bg-purple-400/10",
        },
        {
            label: "Total Active Time",
            value: "312",
            unit: "h",
            badge: "",
            badgeColor: "",
            icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
            iconColor: "text-sky-400 bg-sky-400/10",
        },
        {
            label: "Total Alerts",
            value: "892",
            unit: "",
            badge: "-15% improvement",
            badgeColor: "text-red-400 bg-red-400/10",
            icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
            iconColor: "text-orange-400 bg-orange-400/10",
        },
    ];

    // --- Sessions data ---
    type Fatigue = "LOW" | "MEDIUM" | "HIGH";
    type Session = {
        id: number;
        date: string;
        time: string;
        duration: string;
        score: number;
        alerts: number;
        fatigue: Fatigue;
    };

    const allSessions: Session[] = [
        {
            id: 1,
            date: "Oct 24, 2023",
            time: "09:15 AM - 12:00 PM",
            duration: "2h 45m",
            score: 92,
            alerts: 3,
            fatigue: "LOW",
        },
        {
            id: 2,
            date: "Oct 23, 2023",
            time: "01:30 PM - 05:45 PM",
            duration: "4h 15m",
            score: 74,
            alerts: 14,
            fatigue: "MEDIUM",
        },
        {
            id: 3,
            date: "Oct 22, 2023",
            time: "08:00 AM - 10:30 AM",
            duration: "2h 30m",
            score: 88,
            alerts: 5,
            fatigue: "LOW",
        },
        {
            id: 4,
            date: "Oct 21, 2023",
            time: "02:00 PM - 07:00 PM",
            duration: "5h 00m",
            score: 58,
            alerts: 28,
            fatigue: "HIGH",
        },
        {
            id: 5,
            date: "Oct 20, 2023",
            time: "09:00 AM - 01:00 PM",
            duration: "4h 00m",
            score: 85,
            alerts: 7,
            fatigue: "LOW",
        },
        {
            id: 6,
            date: "Oct 19, 2023",
            time: "10:00 AM - 01:30 PM",
            duration: "3h 30m",
            score: 79,
            alerts: 11,
            fatigue: "MEDIUM",
        },
        {
            id: 7,
            date: "Oct 18, 2023",
            time: "08:30 AM - 11:00 AM",
            duration: "2h 30m",
            score: 91,
            alerts: 2,
            fatigue: "LOW",
        },
        {
            id: 8,
            date: "Oct 17, 2023",
            time: "01:00 PM - 06:00 PM",
            duration: "5h 00m",
            score: 63,
            alerts: 22,
            fatigue: "HIGH",
        },
        {
            id: 9,
            date: "Oct 16, 2023",
            time: "09:00 AM - 12:00 PM",
            duration: "3h 00m",
            score: 82,
            alerts: 8,
            fatigue: "LOW",
        },
        {
            id: 10,
            date: "Oct 15, 2023",
            time: "02:00 PM - 04:30 PM",
            duration: "2h 30m",
            score: 77,
            alerts: 13,
            fatigue: "MEDIUM",
        },
    ];

    // --- Filters ---
    let search = $state("");
    let dateRange = $state("Last 30 Days");
    let page = $state(1);
    const perPage = 5;
    const totalSessions = 142;
    const totalPages = Math.ceil(totalSessions / perPage);

    let filtered = $derived(
        allSessions.filter(
            (s) =>
                s.date.toLowerCase().includes(search.toLowerCase()) ||
                s.duration.toLowerCase().includes(search.toLowerCase()),
        ),
    );

    let paged = $derived(filtered.slice((page - 1) * perPage, page * perPage));

    function scoreColor(s: number) {
        if (s >= 85) return "#22c55e";
        if (s >= 70) return "#eab308";
        return "#ef4444";
    }

    function fatigueStyle(f: Fatigue) {
        if (f === "LOW")
            return "text-green-500 bg-green-500/10 border-green-500/20";
        if (f === "MEDIUM")
            return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-500 bg-red-500/10 border-red-500/20";
    }

    const dateRanges = [
        "Last 7 Days",
        "Last 30 Days",
        "Last 90 Days",
        "Year to Date",
    ];
    let showDateMenu = $state(false);

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
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Session History
    </h1>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {#each stats as stat}
            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"
            >
                <div class="flex items-start justify-between mb-4">
                    <div
                        class="w-10 h-10 rounded-xl {stat.iconColor} flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d={stat.icon} />
                        </svg>
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
                <svg
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <circle cx="11" cy="11" r="8" /><line
                        x1="21"
                        y1="21"
                        x2="16.65"
                        y2="16.65"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search sessions..."
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 text-sky-400"
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
                    {dateRange}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="4" y1="6" x2="20" y2="6" /><line
                        x1="8"
                        y1="12"
                        x2="16"
                        y2="12"
                    /><line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filters
            </button>

            <div class="ml-auto">
                <button
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                    bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600
                    text-white transition-all shadow-sm active:scale-95"
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
                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                        /><polyline points="7 10 12 15 17 10" /><line
                            x1="12"
                            y1="15"
                            x2="12"
                            y2="3"
                        />
                    </svg>
                    Export Report
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800">
                        {#each ["Date & Time", "Duration", "Posture Score", "Alerts", "Eye Fatigue", "Actions"] as col}
                            <th
                                class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-5 py-3"
                                >{col}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each paged as s}
                        <tr
                            class="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <!-- Date -->
                            <td class="px-5 py-4">
                                <p
                                    class="font-semibold text-slate-800 dark:text-white text-sm"
                                >
                                    {s.date}
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">
                                    {s.time}
                                </p>
                            </td>
                            <!-- Duration -->
                            <td
                                class="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium"
                                >{s.duration}</td
                            >
                            <!-- Score -->
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
                                    >
                                        <div
                                            class="h-full rounded-full transition-all duration-500"
                                            style="width: {s.score}%; background: {scoreColor(
                                                s.score,
                                            )}"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-sm font-bold"
                                        style="color: {scoreColor(s.score)}"
                                        >{s.score}</span
                                    >
                                </div>
                            </td>
                            <!-- Alerts -->
                            <td
                                class="px-5 py-4 text-sm text-slate-600 dark:text-slate-300"
                                >{s.alerts} alerts</td
                            >
                            <!-- Eye fatigue -->
                            <td class="px-5 py-4">
                                <span
                                    class="text-xs font-bold px-2.5 py-1 rounded-md border {fatigueStyle(
                                        s.fatigue,
                                    )}"
                                >
                                    {s.fatigue}
                                </span>
                            </td>
                            <!-- Actions -->
                            <td class="px-5 py-4">
                                <button
                                    class="text-sm font-bold text-sky-400 hover:text-sky-500 transition-colors"
                                >
                                    Report
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div
            class="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800"
        >
            <p class="text-sm text-slate-400">
                Showing <span
                    class="text-slate-700 dark:text-slate-200 font-medium"
                    >{(page - 1) * perPage + 1} - {Math.min(
                        page * perPage,
                        totalSessions,
                    )}</span
                >
                of
                <span class="text-slate-700 dark:text-slate-200 font-medium"
                    >{totalSessions}</span
                > sessions
            </p>

            <div class="flex items-center gap-1">
                <!-- Prev -->
                <button
                    onclick={() => page > 1 && page--}
                    disabled={page === 1}
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
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

                <!-- Next -->
                <button
                    onclick={() => page < totalPages && page++}
                    disabled={page === totalPages}
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
