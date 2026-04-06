<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import { _ } from "svelte-i18n";
    import {
        ArrowLeft,
        Clock,
        Tag,
        CheckCircle,
        Play,
        Pause,
        RotateCcw,
        Dumbbell,
    } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import { logExercise } from "$lib/db";
    import { getExerciseById } from "$lib/exercises";
    import type { User } from "$lib/db";

    const exerciseId = parseInt($page.params.id);
    const exercise = getExerciseById(exerciseId);

    let user = $state<User | null>(null);
    let timerSeconds = $state(exercise ? exercise.durationVal * 60 : 0);
    const totalSeconds = exercise ? exercise.durationVal * 60 : 0;
    let running = $state(false);
    let completed = $state(false);
    let logged = $state(false);
    let interval: ReturnType<typeof setInterval> | null = null;

    let progress = $derived(
        totalSeconds > 0
            ? ((totalSeconds - timerSeconds) / totalSeconds) * 100
            : 0,
    );

    let timerDisplay = $derived(() => {
        const m = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
        const s = (timerSeconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
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
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        running = false;
    }

    function toggleTimer() {
        if (running) stopTimer();
        else startTimer();
    }

    function resetTimer() {
        stopTimer();
        timerSeconds = totalSeconds;
        completed = false;
    }

    async function doLogExercise() {
        if (!user || logged || !exercise) return;
        try {
            await logExercise(user.id, exercise.title, exercise.durationVal);
            logged = true;
        } catch (e) {
            console.error("Failed to log exercise:", e);
        }
    }

    async function markComplete() {
        stopTimer();
        timerSeconds = 0;
        completed = true;
        await doLogExercise();
    }

    onMount(async () => {
        if (!exercise) {
            goto("/exercises");
            return;
        }
        user = await getCurrentUser();
        if (!user) goto("/auth");
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    {#if !exercise}
        <div class="flex items-center justify-center h-full text-slate-400">
            <p>{$_("common.loading")}</p>
        </div>
    {:else}
        <!-- Back button + header -->
        <div class="flex items-center gap-4 mb-6">
            <button
                onclick={() => goto("/exercises")}
                class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 transition-colors"
            >
                <ArrowLeft class="w-4 h-4" />
                {$_("exercises.backToList")}
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <!-- Left: image + timer -->
            <div class="lg:col-span-2 flex flex-col gap-4">
                <!-- Image -->
                <div class="rounded-2xl overflow-hidden h-56 relative">
                    <img
                        src={exercise.image}
                        alt={exercise.title}
                        class="w-full h-full object-cover"
                    />
                    <!-- Tags overlay -->
                    <div
                        class="absolute top-3 left-3 flex flex-wrap gap-1.5"
                    >
                        {#each exercise.tags as tag}
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10"
                            >
                                {tag}
                            </span>
                        {/each}
                    </div>
                </div>

                <!-- Timer card -->
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center gap-4"
                >
                    {#if completed}
                        <!-- Completed state -->
                        <div
                            class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500"
                        >
                            <CheckCircle class="w-8 h-8" />
                        </div>
                        <div class="text-center">
                            <p
                                class="text-lg font-bold text-slate-800 dark:text-white"
                            >
                                {$_("exercises.exerciseLogged")}
                            </p>
                            <p class="text-sm text-slate-400 mt-1">
                                {exercise.duration} · {exercise.title}
                            </p>
                        </div>
                        <button
                            onclick={resetTimer}
                            class="flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <RotateCcw class="w-4 h-4" />
                            {$_("exercises.restart")}
                        </button>
                    {:else}
                        <!-- Timer circle -->
                        <div class="relative w-32 h-32">
                            <svg
                                class="w-full h-full -rotate-90"
                                viewBox="0 0 100 100"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke-width="8"
                                    class="stroke-slate-100 dark:stroke-slate-800"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke-width="8"
                                    stroke-dasharray={2 * Math.PI * 44}
                                    stroke-dashoffset={2 *
                                        Math.PI *
                                        44 *
                                        (1 - progress / 100)}
                                    class="stroke-sky-400 transition-all duration-1000"
                                    stroke-linecap="round"
                                />
                            </svg>
                            <div
                                class="absolute inset-0 flex items-center justify-center"
                            >
                                <span
                                    class="text-2xl font-bold tabular-nums text-slate-800 dark:text-white"
                                >
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
                                    {$_("exercises.pause")}
                                {:else}
                                    <Play class="w-4 h-4" />
                                    {running === false && progress === 0
                                        ? $_("exercises.start")
                                        : $_("exercises.resume")}
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
                            {$_("exercises.completeExercise")}
                        </button>
                    {/if}
                </div>
            </div>

            <!-- Right: details -->
            <div class="lg:col-span-3 flex flex-col gap-4">
                <!-- Title + meta -->
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6"
                >
                    <div class="flex items-start justify-between gap-4 mb-4">
                        <h1
                            class="text-2xl font-bold text-slate-900 dark:text-white"
                        >
                            {exercise.title}
                        </h1>
                        <span
                            class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        >
                            <Clock class="w-4 h-4 text-sky-400" />
                            {exercise.duration}
                        </span>
                    </div>

                    <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {exercise.description}
                    </p>

                    <div class="flex items-center gap-2">
                        <Tag class="w-4 h-4 text-slate-400" />
                        <span class="text-xs text-slate-400"
                            >{$_("exercises.muscles")}:</span
                        >
                        <span
                            class="text-xs text-slate-600 dark:text-slate-300"
                            >{exercise.muscles}</span
                        >
                    </div>
                </div>

                <!-- Steps -->
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6"
                >
                    <div class="flex items-center gap-2 mb-4">
                        <Dumbbell class="w-4 h-4 text-sky-400" />
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("exercises.steps")}
                        </h2>
                    </div>

                    <ol class="space-y-3">
                        {#each exercise.steps as step, i}
                            <li class="flex items-start gap-3">
                                <span
                                    class="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-500 text-xs font-bold flex items-center justify-center mt-0.5"
                                >
                                    {i + 1}
                                </span>
                                <p
                                    class="text-sm text-slate-600 dark:text-slate-300"
                                >
                                    {step}
                                </p>
                            </li>
                        {/each}
                    </ol>
                </div>
            </div>
        </div>
    {/if}
</div>
