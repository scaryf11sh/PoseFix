<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { _ } from 'svelte-i18n';
    import {
        ArrowLeft,
        Clock,
        Tag,
        CheckCircle,
        Play,
        Pause,
        RotateCcw,
        Dumbbell,
        Video,
        AlertTriangle,
        Sparkles,
        Globe,
        Trophy,
    } from '@lucide/svelte';
    import { locale } from 'svelte-i18n';
    import { getCurrentUser } from '$lib/auth';
    import { logExerciseWithScore } from '$lib/db';
    import { calculateExercisePoints } from '$lib/utils/scoring';
    import {
        allExercises,
        exercisesLoaded,
        ensureExercisesLoaded,
        getExerciseByIdFromStore,
    } from '$lib/stores/exercises';
    import type { User } from '$lib/db';
    import type { Exercise } from '$lib/exercises';

    const exerciseId = $page.params.id;

    let user     = $state<User | null>(null);
    let exercise = $state<Exercise | undefined>(undefined);

    // Reactive lookup once exercises are in the store
    $effect(() => {
        if ($exercisesLoaded || $allExercises.length > 0) {
            exercise = getExerciseByIdFromStore($allExercises, exerciseId);
        }
    });

    let totalSeconds  = $derived(exercise ? exercise.durationVal * 60 : 0);
    let timerSeconds  = $state(0);
    let running       = $state(false);
    let completed     = $state(false);
    let logged        = $state(false);
    let earnedPoints  = $state(0);
    let interval: ReturnType<typeof setInterval> | null = null;

    let progress = $derived(
        totalSeconds > 0
            ? ((totalSeconds - timerSeconds) / totalSeconds) * 100
            : 0,
    );

    let timerDisplay = $derived(() => {
        const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const s = (timerSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    });

    // Sync timer when exercise loads
    $effect(() => {
        if (exercise && timerSeconds === 0 && !running) {
            timerSeconds = exercise.durationVal * 60;
        }
    });

    function startTimer() {
        if (interval || completed) return;
        interval = setInterval(() => {
            timerSeconds--;
            if (timerSeconds <= 0) {
                timerSeconds = 0;
                stopTimer();
                completed = true;
                doLogExercise();
            }
        }, 1000);
        running = true;
    }

    function stopTimer() {
        if (interval) { clearInterval(interval); interval = null; }
        running = false;
    }

    function toggleTimer() {
        if (running) stopTimer(); else startTimer();
    }

    function resetTimer() {
        stopTimer();
        timerSeconds = exercise ? exercise.durationVal * 60 : 0;
        completed = false;
    }

    async function doLogExercise() {
        if (!user || logged || !exercise) return;
        try {
            const points = calculateExercisePoints(exercise);
            await logExerciseWithScore(user.id, {
                title: exercise.title,
                exercise_id: exercise.id,
                category: exercise.category,
                difficulty: exercise.difficulty,
                durationVal: exercise.durationVal,
                points,
                source: exercise.source,
            });
            earnedPoints = points;
            logged = true;
        } catch (e) {
            console.error('Failed to log exercise:', e);
        }
    }

    async function markComplete() {
        stopTimer();
        timerSeconds = 0;
        completed = true;
        await doLogExercise();
    }

    // Locale-aware display values
    const isEs = $derived($locale?.startsWith('es') ?? false);
    const displayTitle       = $derived(exercise ? (isEs && exercise.titleEs       ? exercise.titleEs       : exercise.title)       : '');
    const displayDescription = $derived(exercise ? (isEs && exercise.descriptionEs ? exercise.descriptionEs : exercise.description) : '');
    const displaySteps       = $derived(exercise ? (isEs && exercise.stepsEs       ? exercise.stepsEs       : exercise.steps)       : []);
    const displayMuscles     = $derived(exercise ? (isEs && exercise.musclesEs     ? exercise.musclesEs     : exercise.muscles)     : '');
    const displayTags        = $derived(exercise ? (isEs && exercise.tagsEs        ? exercise.tagsEs        : exercise.tags)        : []);
    const displayRiskZone    = $derived(exercise ? (isEs && exercise.riskZoneEs    ? exercise.riskZoneEs    : exercise.riskZone)    : undefined);
    const displayBenefits    = $derived(exercise ? (isEs && exercise.benefitsEs    ? exercise.benefitsEs    : exercise.benefits)    : undefined);

    // Difficulty badge colours
    const DIFF_CLASS: Record<string, string> = {
        beginner:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        advanced:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    // Source badge labels
    const SOURCE_LABEL: Record<string, string> = {
        local:       'PoseFix',
        lunatic:     'Yoga Database',
        'yoga-nzy4': 'Yoga API',
    };

    onMount(async () => {
        await ensureExercisesLoaded();
        // After load, try to find the exercise
        exercise = getExerciseByIdFromStore($allExercises, exerciseId);
        if (!exercise) {
            goto('/exercises');
            return;
        }
        timerSeconds = exercise.durationVal * 60;
        user = await getCurrentUser();
        if (!user) goto('/auth');
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900">
    {#if !exercise}
        <div class="flex items-center justify-center h-full text-slate-400">
            <p>{$_('common.loading')}</p>
        </div>
    {:else}
        <!-- Back -->
        <div class="flex items-center gap-4 mb-6">
            <button
                onclick={() => goto('/exercises')}
                class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 transition-colors"
            >
                <ArrowLeft class="w-4 h-4" />
                {$_('exercises.backToList')}
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <!-- Left: image + timer -->
            <div class="lg:col-span-2 flex flex-col gap-4">

                <!-- Image -->
                <div class="rounded-2xl overflow-hidden h-56 relative">
                    {#if exercise.image}
                        <img
                            src={exercise.image}
                            alt={displayTitle}
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <div class="w-full h-full bg-gradient-to-br from-sky-400/20 to-violet-400/20 flex items-center justify-center">
                            <Dumbbell class="w-16 h-16 text-slate-300 dark:text-slate-600" />
                        </div>
                    {/if}

                    <!-- Tags overlay -->
                    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {#each displayTags.slice(0, 3) as tag}
                            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10">
                                {tag}
                            </span>
                        {/each}
                    </div>

                    <!-- Video badge -->
                    {#if exercise.hasVideo}
                        <div class="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400 text-black text-[10px] font-bold">
                            <Video class="w-3 h-3" />
                            VIDEO
                        </div>
                    {/if}
                </div>

                <!-- Meta badges -->
                <div class="flex flex-wrap gap-2">
                    {#if exercise.difficulty}
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold {DIFF_CLASS[exercise.difficulty] ?? ''}">
                            {$_(`exercises.difficulty.${exercise.difficulty}`)}
                        </span>
                    {/if}
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Globe class="w-3 h-3" />
                        {SOURCE_LABEL[exercise.source] ?? exercise.source}
                    </span>
                    {#if exercise.source !== 'local'}
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400">
                            {$_('exercises.contentInEnglish')}
                        </span>
                    {/if}
                </div>

                <!-- Timer card -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center gap-4">
                    {#if completed}
                        <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
                            <CheckCircle class="w-8 h-8" />
                        </div>
                        <div class="text-center">
                            <p class="text-lg font-bold text-slate-800 dark:text-white">
                                {$_('exercises.exerciseLogged')}
                            </p>
                            <p class="text-sm text-slate-400 mt-1">
                                {exercise.duration} · {exercise.title}
                            </p>
                            {#if earnedPoints > 0}
                                <div class="flex items-center justify-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                    <Trophy class="w-4 h-4" />
                                    <span class="text-sm font-bold">
                                        {$_('exercises.pointsEarned', { values: { points: earnedPoints } })}
                                    </span>
                                </div>
                            {/if}
                        </div>
                        <button
                            onclick={resetTimer}
                            class="flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <RotateCcw class="w-4 h-4" />
                            {$_('exercises.restart')}
                        </button>
                    {:else}
                        <!-- Timer circle -->
                        <div class="relative w-32 h-32">
                            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="44" fill="none" stroke-width="8"
                                    class="stroke-slate-100 dark:stroke-slate-800" />
                                <circle cx="50" cy="50" r="44" fill="none" stroke-width="8"
                                    stroke-dasharray={2 * Math.PI * 44}
                                    stroke-dashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
                                    class="stroke-sky-400 transition-all duration-1000"
                                    stroke-linecap="round" />
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-2xl font-bold tabular-nums text-slate-800 dark:text-white">
                                    {timerDisplay()}
                                </span>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="flex items-center gap-3">
                            <button
                                onclick={toggleTimer}
                                class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-400/30 transition-all active:scale-95"
                            >
                                {#if running}
                                    <Pause class="w-4 h-4" />
                                    {$_('exercises.pause')}
                                {:else}
                                    <Play class="w-4 h-4" />
                                    {running === false && progress === 0
                                        ? $_('exercises.start')
                                        : $_('exercises.resume')}
                                {/if}
                            </button>
                            <button
                                onclick={resetTimer}
                                class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-sky-400 hover:border-sky-400 transition-colors"
                            >
                                <RotateCcw class="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onclick={markComplete}
                            class="w-full py-2.5 rounded-xl border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                            {$_('exercises.completeExercise')}
                        </button>
                    {/if}
                </div>

                <!-- Video link -->
                {#if exercise.hasVideo && exercise.videoUrl}
                    <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                            bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm
                            shadow-lg shadow-amber-400/30 transition-all active:scale-95"
                    >
                        <Video class="w-4 h-4" />
                        {$_('exercises.watchVideo')}
                    </a>
                {/if}
            </div>

            <!-- Right: details -->
            <div class="lg:col-span-3 flex flex-col gap-4">

                <!-- Title + meta -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div class="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                                {displayTitle}
                            </h1>
                            {#if exercise.titleSanskrit}
                                <p class="text-sm text-slate-400 mt-0.5 italic">
                                    {exercise.titleSanskrit}
                                </p>
                            {/if}
                        </div>
                        <span class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            <Clock class="w-4 h-4 text-sky-400" />
                            {exercise.duration}
                        </span>
                    </div>

                    <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 mt-3">
                        {displayDescription}
                    </p>

                    <div class="flex items-center gap-2">
                        <Tag class="w-4 h-4 text-slate-400" />
                        <span class="text-xs text-slate-400">{$_('exercises.muscles')}:</span>
                        <span class="text-xs text-slate-600 dark:text-slate-300">{displayMuscles}</span>
                    </div>
                </div>

                <!-- Steps -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Dumbbell class="w-4 h-4 text-sky-400" />
                        <h2 class="font-semibold text-slate-800 dark:text-white">
                            {$_('exercises.steps')}
                        </h2>
                    </div>
                    <ol class="space-y-3">
                        {#each displaySteps as step, i}
                            <li class="flex items-start gap-3">
                                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-500 text-xs font-bold flex items-center justify-center mt-0.5">
                                    {i + 1}
                                </span>
                                <p class="text-sm text-slate-600 dark:text-slate-300">{step}</p>
                            </li>
                        {/each}
                    </ol>
                </div>

                <!-- Benefits -->
                {#if displayBenefits && displayBenefits.length > 0}
                    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <Sparkles class="w-4 h-4 text-emerald-400" />
                            <h2 class="font-semibold text-slate-800 dark:text-white">
                                {$_('exercises.benefits')}
                            </h2>
                        </div>
                        <ul class="space-y-2">
                            {#each displayBenefits as benefit}
                                <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                    {benefit}
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                <!-- Risk zones / contraindications -->
                {#if displayRiskZone && displayRiskZone.length > 0}
                    <div class="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 shadow-sm p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <AlertTriangle class="w-4 h-4 text-amber-500" />
                            <h2 class="font-semibold text-slate-800 dark:text-white">
                                {$_('exercises.riskZone')}
                            </h2>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            {#each displayRiskZone as risk}
                                <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                                    {risk}
                                </span>
                            {/each}
                        </div>
                        <p class="text-xs text-amber-600 dark:text-amber-500 mt-3">
                            {$_('exercises.riskZoneNote')}
                        </p>
                    </div>
                {/if}

            </div>
        </div>
    {/if}
</div>
