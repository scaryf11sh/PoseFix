<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { _, locale } from 'svelte-i18n';
    import { Search, ChevronDown, Video, X, Loader2 } from '@lucide/svelte';
    import ExerciseCard from '$lib/components/ui/Cards/ExerciseCard.svelte';
    import { TAG_TO_FILTER_AREA } from '$lib/i18n/yoga-es';
    import {
        allExercises,
        exercisesLoading,
        exercisesLoaded,
        ensureExercisesLoaded,
    } from '$lib/stores/exercises';

    // ── Filter areas ────────────────────────────────────────────────────────────
    const AREAS = [
        { key: 'All',       labelKey: 'exercises.areas.all' },
        { key: 'Neck',      labelKey: 'exercises.areas.neck' },
        { key: 'Back',      labelKey: 'exercises.areas.back' },
        { key: 'Shoulders', labelKey: 'exercises.areas.shoulders' },
        { key: 'Core',      labelKey: 'exercises.areas.core' },
        { key: 'Hips',      labelKey: 'exercises.areas.hips' },
        { key: 'Legs',      labelKey: 'exercises.areas.legs' },
        { key: 'Chest',     labelKey: 'exercises.areas.chest' },
        { key: 'Full Body', labelKey: 'exercises.areas.fullBody' },
    ];

    const DIFFICULTIES = [
        { key: 'All',          labelKey: 'exercises.difficulty.all' },
        { key: 'beginner',     labelKey: 'exercises.difficulty.beginner' },
        { key: 'intermediate', labelKey: 'exercises.difficulty.intermediate' },
        { key: 'advanced',     labelKey: 'exercises.difficulty.advanced' },
    ];

    // ── State ───────────────────────────────────────────────────────────────────
    let searchQuery  = $state('');
    let selectedArea = $state('All');
    let selectedDiff = $state('All');
    let selectedCat  = $state('All');
    let onlyVideo    = $state(false);
    let visibleCount = $state(9);

    const CAT_LABEL_KEY: Record<string, string> = {
        posture:         'exercises.categories.posture',
        yoga:            'exercises.categories.yoga',
        'Core Strength': 'exercises.categories.corestrength',
        'Hip-Opening':   'exercises.categories.hipopening',
        Backbend:        'exercises.categories.backbend',
        'Forward Bend':  'exercises.categories.forwardbend',
        Inversions:      'exercises.categories.inversions',
        Seated:          'exercises.categories.seated',
        Restorative:     'exercises.categories.restorative',
        Standing:        'exercises.categories.standing',
        Balancing:       'exercises.categories.balancing',
        Twists:          'exercises.categories.twists',
        // ExerciseDB categories
        strength:        'exercises.categories.strength',
        cardio:          'exercises.categories.cardio',
        stretching:      'exercises.categories.stretching',
        plyometrics:     'exercises.categories.plyometrics',
        powerlifting:    'exercises.categories.powerlifting',
        olympic:         'exercises.categories.olympic',
    };

    // Sorted unique category keys — reactive to exercise list
    let categoryKeys = $derived(
        $allExercises.length > 0
            ? Array.from(new Set($allExercises.map((e) => e.category))).sort()
            : [],
    );

    // ── Filter logic ────────────────────────────────────────────────────────────
    let filtered = $derived(
        $allExercises.filter((e) => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                e.title.toLowerCase().includes(q) ||
                (e.titleEs ?? '').toLowerCase().includes(q) ||
                e.tags.some((t) => t.toLowerCase().includes(q)) ||
                (e.tagsEs ?? []).some((t) => t.toLowerCase().includes(q));
            const matchArea  = selectedArea === 'All' || e.area.includes(selectedArea);
            const matchDiff  = selectedDiff === 'All' || e.difficulty === selectedDiff;
            const matchCat   = selectedCat  === 'All' || e.category  === selectedCat;
            const matchVideo = !onlyVideo || e.hasVideo;
            return matchSearch && matchArea && matchDiff && matchCat && matchVideo;
        }),
    );

    let visible = $derived(filtered.slice(0, visibleCount));
    let hasMore = $derived(filtered.length > visibleCount);

    let activeFilterCount = $derived(
        (selectedArea !== 'All' ? 1 : 0) +
        (selectedDiff !== 'All' ? 1 : 0) +
        (selectedCat  !== 'All' ? 1 : 0) +
        (onlyVideo ? 1 : 0),
    );

    function clearFilters() {
        selectedArea = 'All';
        selectedDiff = 'All';
        selectedCat  = 'All';
        onlyVideo    = false;
        visibleCount = 9;
    }

    // Dropdown open state
    let catOpen  = $state(false);
    let diffOpen = $state(false);

    function handleTagClick(tag: string) {
        const area = TAG_TO_FILTER_AREA[tag];
        if (area) {
            selectedArea = area;
            visibleCount = 9;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (categoryKeys.includes(tag)) {
            selectedCat = tag;
            visibleCount = 9;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        searchQuery  = tag;
        visibleCount = 9;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onMount(() => ensureExercisesLoaded());
</script>

<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900">

    <!-- Header -->
    <div class="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_('exercises.title')}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {$_('exercises.subtitle')}
                {#if $exercisesLoaded}
                    <span class="ml-1 text-sky-400">· {$allExercises.length} {$_('exercises.total')}</span>
                {/if}
            </p>
        </div>

        <!-- Search -->
        <div class="flex items-center gap-2">
            <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder={$_('exercises.search')}
                    bind:value={searchQuery}
                    oninput={() => (visibleCount = 9)}
                    class="pl-9 pr-4 py-2 rounded-xl text-sm w-56
                        bg-white dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        text-slate-800 dark:text-white
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
                        transition-all"
                />
            </div>
        </div>
    </div>

    <!-- ── Filter bar ─────────────────────────────────────────────────────────── -->
    <div class="space-y-2 mb-6">

        <!-- Row 1: Area chips — horizontally scrollable -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {#each AREAS as a}
                <button
                    onclick={() => { selectedArea = a.key; visibleCount = 9; }}
                    class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                        {selectedArea === a.key
                            ? 'bg-sky-400 text-white shadow-md shadow-sky-400/30'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-500'}"
                >
                    {$_(a.labelKey)}
                </button>
            {/each}
        </div>

        <!-- Row 2: Category dropdown + Difficulty dropdown + Video toggle + Clear -->
        <div class="flex items-center gap-2 flex-wrap">

            <!-- Category dropdown -->
            {#if categoryKeys.length > 0}
                <div class="relative">
                    <button
                        onclick={() => { catOpen = !catOpen; diffOpen = false; }}
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                            {selectedCat !== 'All'
                                ? 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/25'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-500'}"
                    >
                        {selectedCat === 'All'
                            ? $_('exercises.filterCategory')
                            : (CAT_LABEL_KEY[selectedCat] ? $_(CAT_LABEL_KEY[selectedCat]) : selectedCat)}
                        <ChevronDown class="w-3 h-3 {catOpen ? 'rotate-180' : ''} transition-transform" />
                    </button>
                    {#if catOpen}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="absolute left-0 top-full mt-1 z-20 min-w-[160px]
                                bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                rounded-xl shadow-xl py-1 overflow-hidden"
                            onmouseleave={() => (catOpen = false)}
                        >
                            <button
                                onclick={() => { selectedCat = 'All'; catOpen = false; visibleCount = 9; }}
                                class="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700
                                    {selectedCat === 'All' ? 'text-violet-500 font-semibold' : 'text-slate-600 dark:text-slate-300'}"
                            >
                                {$_('exercises.categories.all')}
                            </button>
                            {#each categoryKeys as catKey}
                                <button
                                    onclick={() => { selectedCat = catKey; catOpen = false; visibleCount = 9; }}
                                    class="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700
                                        {selectedCat === catKey ? 'text-violet-500 font-semibold' : 'text-slate-600 dark:text-slate-300'}"
                                >
                                    {CAT_LABEL_KEY[catKey] ? $_(CAT_LABEL_KEY[catKey]) : catKey}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}

            <!-- Difficulty dropdown -->
            <div class="relative">
                <button
                    onclick={() => { diffOpen = !diffOpen; catOpen = false; }}
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                        {selectedDiff !== 'All'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-500'}"
                >
                    {selectedDiff === 'All'
                        ? $_('exercises.filterDifficulty')
                        : $_(`exercises.difficulty.${selectedDiff}`)}
                    <ChevronDown class="w-3 h-3 {diffOpen ? 'rotate-180' : ''} transition-transform" />
                </button>
                {#if diffOpen}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="absolute left-0 top-full mt-1 z-20 min-w-[140px]
                            bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                            rounded-xl shadow-xl py-1 overflow-hidden"
                        onmouseleave={() => (diffOpen = false)}
                    >
                        {#each DIFFICULTIES as d}
                            <button
                                onclick={() => { selectedDiff = d.key; diffOpen = false; visibleCount = 9; }}
                                class="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700
                                    {selectedDiff === d.key ? 'text-emerald-500 font-semibold' : 'text-slate-600 dark:text-slate-300'}"
                            >
                                {$_(d.labelKey)}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Video toggle -->
            <button
                onclick={() => { onlyVideo = !onlyVideo; visibleCount = 9; }}
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                    {onlyVideo
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/25'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 hover:text-amber-600'}"
            >
                <Video class="w-3 h-3" />
                {$_('exercises.videoOnly')}
            </button>

            <!-- Clear filters badge -->
            {#if activeFilterCount > 0}
                <button
                    onclick={clearFilters}
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium
                        bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                        text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <X class="w-3 h-3" />
                    {$_('exercises.clearFilters')}
                    <span class="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                </button>
            {/if}
        </div>
    </div>

    <!-- ── Results count ──────────────────────────────────────────────────────── -->
    {#if $exercisesLoaded && !$exercisesLoading}
        <p class="text-xs text-slate-400 mb-4">
            {filtered.length} {$_('exercises.total')}
            {#if activeFilterCount > 0 || searchQuery}
                <span class="text-slate-300 dark:text-slate-600"> · {$allExercises.length} {$_('exercises.total')} total</span>
            {/if}
        </p>
    {/if}

    <!-- ── Loading skeleton ───────────────────────────────────────────────────── -->
    {#if $exercisesLoading}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {#each Array(6) as _}
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden animate-pulse">
                    <div class="h-44 bg-slate-200 dark:bg-slate-700"></div>
                    <div class="p-3 space-y-2">
                        <div class="flex gap-1.5">
                            <div class="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div class="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        </div>
                        <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mt-1"></div>
                    </div>
                </div>
            {/each}
        </div>
        <div class="flex items-center justify-center gap-2 text-slate-400 text-sm py-4">
            <Loader2 class="w-4 h-4 animate-spin" />
            {$_('exercises.loading')}
        </div>

    <!-- ── No results ─────────────────────────────────────────────────────────── -->
    {:else if visible.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-slate-400">
            <Search class="w-10 h-10 mb-3 opacity-40" />
            <p class="text-sm">{$_('exercises.noResults')}</p>
            {#if activeFilterCount > 0}
                <button
                    onclick={clearFilters}
                    class="mt-3 text-xs text-sky-400 hover:text-sky-500 transition-colors"
                >
                    {$_('exercises.clearFilters')}
                </button>
            {/if}
        </div>

    <!-- ── Grid ───────────────────────────────────────────────────────────────── -->
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {#each visible as exercise (exercise.id)}
                <ExerciseCard
                    title={exercise.title}
                    titleEs={exercise.titleEs}
                    duration={exercise.duration}
                    tags={exercise.tags}
                    tagsEs={exercise.tagsEs}
                    image={exercise.image}
                    recommended={exercise.recommended}
                    recommendedLabel={exercise.recommendedLabel}
                    hasVideo={exercise.hasVideo}
                    difficulty={exercise.difficulty}
                    source={exercise.source}
                    onStart={() => goto(`/exercises/${exercise.id}`)}
                    onTagClick={handleTagClick}
                />
            {/each}
        </div>
    {/if}

    <!-- Load more -->
    {#if hasMore && !$exercisesLoading}
        <div class="flex justify-center pb-4">
            <button
                onclick={() => (visibleCount += 9)}
                class="flex items-center gap-2 px-6 py-3 rounded-2xl
                    bg-white dark:bg-slate-800
                    border border-slate-200 dark:border-slate-700
                    text-slate-700 dark:text-slate-200 text-sm font-medium
                    hover:border-sky-300 hover:text-sky-500
                    transition-all duration-200 shadow-sm"
            >
                {$_('exercises.loadMore')}
                <ChevronDown class="w-4 h-4" />
            </button>
        </div>
    {/if}
</div>
