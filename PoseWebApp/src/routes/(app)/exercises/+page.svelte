<script lang="ts">
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { Search, SlidersHorizontal, ChevronDown } from "@lucide/svelte";
    import ExerciseCard from "$lib/components/ui/Cards/ExerciseCard.svelte";
    import { exercises } from "$lib/exercises";

    const areas = [
        { key: "All", label: () => $_("exercises.all") },
        { key: "Neck", label: () => $_("exercises.areas.neck") },
        { key: "Back", label: () => $_("exercises.areas.back") },
        { key: "Shoulders", label: () => $_("exercises.areas.shoulders") },
        { key: "Full Body", label: () => $_("exercises.areas.fullBody") },
    ];
    const durations = ["1m", "3m", "5m+"];

    let searchQuery = $state("");
    let selectedArea = $state("All");
    let selectedDuration = $state<string | null>(null);
    let visibleCount = $state(6);

    let filtered = $derived(
        exercises.filter((e) => {
            const matchSearch = e.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchArea =
                selectedArea === "All" || e.area.includes(selectedArea);
            const matchDuration =
                !selectedDuration ||
                (selectedDuration === "1m" && e.durationVal <= 1) ||
                (selectedDuration === "3m" &&
                    e.durationVal <= 3 &&
                    e.durationVal > 1) ||
                (selectedDuration === "5m+" && e.durationVal >= 5);
            return matchSearch && matchArea && matchDuration;
        }),
    );

    let visible = $derived(filtered.slice(0, visibleCount));
    let hasMore = $derived(filtered.length > visibleCount);
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_("exercises.title")}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {$_("exercises.subtitle")}
            </p>
        </div>

        <!-- Search -->
        <div class="flex items-center gap-2">
            <div class="relative">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <input
                    type="text"
                    placeholder={$_("exercises.search")}
                    bind:value={searchQuery}
                    class="pl-9 pr-4 py-2 rounded-xl text-sm w-56
                        bg-white dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        text-slate-800 dark:text-white
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
                        transition-all"
                />
            </div>
            <button
                class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-sky-400 transition-colors"
            >
                <SlidersHorizontal class="w-4 h-4" />
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
        <span
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1"
            >{$_("exercises.targetArea")}</span
        >
        {#each areas as area}
            <button
                onclick={() => (selectedArea = area.key)}
                class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    {selectedArea === area.key
                    ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/30'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-300'}"
            >
                {area.label()}
            </button>
        {/each}

        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <span
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1"
            >{$_("exercises.duration")}</span
        >
        {#each durations as d}
            <button
                onclick={() =>
                    (selectedDuration = selectedDuration === d ? null : d)}
                class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    {selectedDuration === d
                    ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/30'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-300'}"
            >
                {d}
            </button>
        {/each}
    </div>

    <!-- Grid -->
    {#if visible.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-slate-400">
            <Search class="w-10 h-10 mb-3 opacity-40" />
            <p class="text-sm">{$_("exercises.noResults")}</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {#each visible as exercise (exercise.id)}
                <ExerciseCard
                    title={exercise.title}
                    duration={exercise.duration}
                    tags={exercise.tags}
                    image={exercise.image}
                    recommended={exercise.recommended}
                    recommendedLabel={exercise.recommendedLabel}
                    onStart={() => goto(`/exercises/${exercise.id}`)}
                />
            {/each}
        </div>
    {/if}

    <!-- Load more -->
    {#if hasMore}
        <div class="flex justify-center pb-4">
            <button
                onclick={() => (visibleCount += 6)}
                class="flex items-center gap-2 px-6 py-3 rounded-2xl
                    bg-white dark:bg-slate-800
                    border border-slate-200 dark:border-slate-700
                    text-slate-700 dark:text-slate-200 text-sm font-medium
                    hover:border-sky-300 hover:text-sky-500
                    transition-all duration-200 shadow-sm"
            >
                {$_("exercises.loadMore")}
                <ChevronDown class="w-4 h-4" />
            </button>
        </div>
    {/if}
</div>
