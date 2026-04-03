<script lang="ts">
    import { onMount } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { PieChart, LineChart, Text, defaultChartPadding } from "layerchart";

    // --- Score gauge ---
    let count = $state(100);
    let score = 85;
    let animated = $state(score);

    let label = $derived(
        animated >= 95
            ? "EXCELLENT POSTURE"
            : animated >= 80
              ? "GOOD POSTURE"
              : animated >= 60
                ? "FAIR POSTURE"
                : "POOR POSTURE",
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
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const weekValues = [72, 68, 80, 75, 85, 90, 85];
    const today = new Date();
    const weekData: DataPoint[] = weekValues.map((value, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return { date: d, value };
    });

    const dayValues = [60, 70, 78, 82, 85, 83, 85];
    const dayData: DataPoint[] = dayValues.map((value, i) => {
        const d = new Date(today);
        d.setHours(9 + i);
        return { date: d, value };
    });

    let view = $state<"Day" | "Week">("Week");
    let chartData = $derived(view === "Week" ? weekData : dayData);

    // --- Timer ---
    let seconds = $state(2 * 3600 + 45 * 60 + 12);
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

    onMount(() => {
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
                Daily Overview
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your posture has improved by 12% since last week.
            </p>
        </div>
        <div class="flex gap-3 *:cursor-pointer">
            <button
                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                Export Report
            </button>
            <button
                class="px-4 py-2 rounded-xl bg-sky-400 text-white text-sm font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-400/30"
            >
                Live Monitor
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
                    Posture Score
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
                Current score based on real-time analysis
            </p>
        </div>

        <!-- Daily Progress card -->
        <div
            class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col"
        >
            <div class="flex items-start justify-between mb-1">
                <div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        Progress
                    </h2>
                    <p class="text-xs text-slate-400">
                        Postural alignment over time
                    </p>
                </div>
                <div
                    class="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1"
                >
                    {#each ["Day", "Week"] as v}
                        <button
                            onclick={() => (view = v as "Day" | "Week")}
                            class="px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer {view ===
                            v
                                ? 'bg-sky-400 text-white shadow'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
                        >
                            {v}
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <div>
                    <p
                        class="font-semibold text-slate-800 dark:text-white text-sm"
                    >
                        Eye-to-Screen
                    </p>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">
                        Real-time depth
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
                <span>Too Close</span><span>Optimal</span><span>Too Far</span>
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
                    >Maintaining safe distance</span
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
                        Active Session
                    </p>
                    <p class="text-xs text-slate-400">Time spent at desk</p>
                </div>
                <div
                    class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
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
                Reset Session
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 2a7 7 0 0 1 5 11.9V17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3.1A7 7 0 0 1 12 2zm2 17v1a2 2 0 1 1-4 0v-1h4z"
                        />
                    </svg>
                </div>
                <p class="font-semibold text-slate-800 dark:text-white">
                    Quick Tip
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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line
                        x1="8"
                        y1="2"
                        x2="8"
                        y2="6"
                    />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <polyline points="9 16 11 18 15 14" />
                </svg>
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">Next stretch break in</p>
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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">AI Detection Status</p>
                <p class="text-xl font-bold text-slate-800 dark:text-white">
                    High Precision
                </p>
            </div>
        </div>

        <div
            class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"
        >
            <div
                class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" /><path
                        d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
                    />
                    <path
                        d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
                    />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
            </div>
            <div>
                <p class="text-xs text-slate-400 mb-1">Daily Goal</p>
                <p class="text-xl font-bold text-slate-800 dark:text-white">
                    85% Complete
                </p>
            </div>
        </div>
    </div>
</div>
