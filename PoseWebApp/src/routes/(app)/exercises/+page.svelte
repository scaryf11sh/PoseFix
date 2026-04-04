<script lang="ts">
    import ExerciseCard from "$lib/components/ui/Cards/ExerciseCard.svelte";

    type Exercise = {
        id: number;
        title: string;
        duration: string;
        tags: string[];
        image: string;
        area: string[];
        durationVal: number;
        recommended?: boolean;
        recommendedLabel?: string;
    };

    const exercises: Exercise[] = [
        {
            id: 1,
            title: "Neck Tilt",
            duration: "1 min",
            durationVal: 1,
            tags: ["Neck", "Desk-Friendly"],
            area: ["Neck"],
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
        },
        {
            id: 2,
            title: "Shoulder Roll",
            duration: "1 min",
            durationVal: 1,
            tags: ["Shoulders", "Relief"],
            area: ["Shoulders"],
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
        },
        {
            id: 3,
            title: "Cat-Cow Flow",
            duration: "3 min",
            durationVal: 3,
            tags: ["Back", "Mobility"],
            area: ["Back"],
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
        },
        {
            id: 4,
            title: "Doorway Opener",
            duration: "3 min",
            durationVal: 3,
            tags: ["Chest", "Posture Fix"],
            area: ["Full Body"],
            image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&h=300&fit=crop",
        },
        {
            id: 5,
            title: "Thoracic Bridge",
            duration: "5 min",
            durationVal: 5,
            tags: ["Full Body", "Advanced"],
            area: ["Full Body", "Back"],
            image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
        },
        {
            id: 6,
            title: "Child's Pose",
            duration: "2 min",
            durationVal: 2,
            tags: ["Back", "Relief"],
            area: ["Back", "Full Body"],
            image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop",
            recommended: true,
            recommendedLabel: "Spine Realignment (3m)",
        },
    ];

    const areas = ["All", "Neck", "Back", "Shoulders", "Full Body"];
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
                Exercise Library
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Quick routines to improve your posture
            </p>
        </div>

        <!-- Search -->
        <div class="flex items-center gap-2">
            <div class="relative">
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
                    placeholder="Search exercises..."
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
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
        <span
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1"
            >Target Area</span
        >
        {#each areas as area}
            <button
                onclick={() => (selectedArea = area)}
                class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    {selectedArea === area
                    ? 'bg-sky-400 text-white shadow-lg shadow-sky-400/30'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-300'}"
            >
                {area}
            </button>
        {/each}

        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <span
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1"
            >Duration</span
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {#each visible as exercise (exercise.id)}
            <ExerciseCard
                title={exercise.title}
                duration={exercise.duration}
                tags={exercise.tags}
                image={exercise.image}
                recommended={exercise.recommended}
                recommendedLabel={exercise.recommendedLabel}
                onStart={() => alert(`Starting: ${exercise.title}`)}
            />
        {/each}
    </div>

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
                Load more exercises
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
        </div>
    {/if}
</div>
