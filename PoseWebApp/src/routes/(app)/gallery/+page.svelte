<script lang="ts">
    import { Dumbbell, ChevronRight, Clock, Activity } from '@lucide/svelte';

    type Exercise = {
        id: number;
        title: string;
        titleEn: string;
        description: string;
        descriptionEn: string;
        duration: string;
        difficulty: 'easy' | 'medium' | 'hard';
        category: 'neck' | 'shoulders' | 'back' | 'eyes' | 'full_body';
        steps: string[];
        stepsEn: string[];
        image?: string;
        benefits: string[];
        benefitsEn: string[];
    };

    const exercises: Exercise[] = [
        {
            id: 1,
            title: "Rotación de cuello",
            titleEn: "Neck Rotation",
            description: "Moviliza suavemente las cervicales",
            descriptionEn: "Gently mobilize the cervical spine",
            duration: "2 min",
            difficulty: "easy",
            category: "neck",
            steps: [
                "Inclina la cabeza hacia adelante",
                "Rota lentamente hacia la derecha",
                "Vuelve al centro y repite hacia la izquierda",
                "Haz 5 repeticiones por lado"
            ],
            stepsEn: [
                "Tilt your head forward",
                "Slowly rotate to the right",
                "Return to center and repeat to the left",
                "Do 5 repetitions on each side"
            ],
            benefits: ["Reduce rigidez cervical", "Mejora movilidad"],
            benefitsEn: ["Reduces neck stiffness", "Improves mobility"]
        },
        {
            id: 2,
            title: "Elevación de hombros",
            titleEn: "Shoulder Shrugs",
            description: "Libera tensión en trapecios",
            descriptionEn: "Release tension in trapezius muscles",
            duration: "3 min",
            difficulty: "easy",
            category: "shoulders",
            steps: [
                "Levanta los hombros hacia las orejas",
                "Mantén 3 segundos",
                "Baja lentamente",
                "Repite 10 veces"
            ],
            stepsEn: [
                "Lift shoulders toward ears",
                "Hold for 3 seconds",
                "Lower slowly",
                "Repeat 10 times"
            ],
            benefits: ["Libera tensión", "Previene contracturas"],
            benefitsEn: ["Releases tension", "Prevents muscle knots"]
        },
        {
            id: 3,
            title: "Estiramiento de espalda",
            titleEn: "Back Stretch",
            description: "Estira la columna torácica",
            descriptionEn: "Stretch the thoracic spine",
            duration: "5 min",
            difficulty: "medium",
            category: "back",
            steps: [
                "Siéntate con la espalda recta",
                "Entrelaza las manos detrás de la cabeza",
                "Arquea suavemente hacia atrás",
                "Mantén 10 segundos y repite"
            ],
            stepsEn: [
                "Sit with straight back",
                "Interlace hands behind head",
                "Gently arch backward",
                "Hold 10 seconds and repeat"
            ],
            benefits: ["Mejora postura", "Reduce dolor lumbar"],
            benefitsEn: ["Improves posture", "Reduces lower back pain"]
        },
        {
            id: 4,
            title: "Descanso visual 20-20-20",
            titleEn: "20-20-20 Eye Rest",
            description: "Reduce fatiga visual",
            descriptionEn: "Reduce eye strain",
            duration: "1 min",
            difficulty: "easy",
            category: "eyes",
            steps: [
                "Cada 20 minutos de trabajo",
                "Mira un objeto a 20 pies (6 metros)",
                "Mantén la vista 20 segundos",
                "Parpadea varias veces"
            ],
            stepsEn: [
                "Every 20 minutes of work",
                "Look at an object 20 feet away",
                "Focus for 20 seconds",
                "Blink several times"
            ],
            benefits: ["Previene fatiga visual", "Reduce sequedad ocular"],
            benefitsEn: ["Prevents eye strain", "Reduces dry eyes"]
        },
        {
            id: 5,
            title: "Rotación de torso",
            titleEn: "Torso Twist",
            description: "Moviliza la columna completa",
            descriptionEn: "Mobilize the entire spine",
            duration: "4 min",
            difficulty: "medium",
            category: "full_body",
            steps: [
                "Siéntate con pies planos en el suelo",
                "Rota el torso hacia la derecha",
                "Mantén 5 segundos",
                "Repite hacia el lado izquierdo"
            ],
            stepsEn: [
                "Sit with feet flat on floor",
                "Rotate torso to the right",
                "Hold for 5 seconds",
                "Repeat to the left side"
            ],
            benefits: ["Mejora rotación espinal", "Libera tensión lumbar"],
            benefitsEn: ["Improves spinal rotation", "Releases lower back tension"]
        },
        {
            id: 6,
            title: "Estiramiento de pecho",
            titleEn: "Chest Stretch",
            description: "Abre el pecho y mejora la respiración",
            descriptionEn: "Open the chest and improve breathing",
            duration: "3 min",
            difficulty: "easy",
            category: "back",
            steps: [
                "Coloca las manos detrás de la cabeza",
                "Abre los codos hacia los lados",
                "Arquea ligeramente la espalda",
                "Respira profundamente 5 veces"
            ],
            stepsEn: [
                "Place hands behind head",
                "Open elbows to the sides",
                "Slightly arch your back",
                "Breathe deeply 5 times"
            ],
            benefits: ["Mejora respiración", "Corrige postura encorvada"],
            benefitsEn: ["Improves breathing", "Corrects hunched posture"]
        }
    ];

    let selectedExercise: Exercise | null = null;
    let currentLang = $state<'es' | 'en'>('es');
    let isDoingExercise = $state(false);
    let exerciseProgress = $state(0);
    let completedExercises = $state<number[]>([]);

    function selectExercise(exercise: Exercise) {
        selectedExercise = exercise;
    }

    function startExercise(exercise: Exercise) {
        selectedExercise = exercise;
        isDoingExercise = true;
        exerciseProgress = 0;
    }

    function completeExercise() {
        if (selectedExercise && !completedExercises.includes(selectedExercise.id)) {
            completedExercises = [...completedExercises, selectedExercise.id];
        }
        isDoingExercise = false;
        selectedExercise = null;
        exerciseProgress = 100;
    }

    function getDifficultyColor(difficulty: string) {
        switch (difficulty) {
            case 'easy': return 'bg-electric-green-200 dark:bg-electric-green-900 text-electric-green-800 dark:text-electric-green-300';
            case 'medium': return 'bg-Tuscan-200 dark:bg-Tuscan-900 text-Tuscan-800 dark:text-Tuscan-300';
            case 'hard': return 'bg-red-ribbon-200 dark:bg-red-ribbon-900 text-red-ribbon-800 dark:text-red-ribbon-300';
            default: return 'bg-carbon-200';
        }
    }

    function getCategoryIcon(category: string) {
        switch (category) {
            case 'neck': return '🦒';
            case 'shoulders': return '💪';
            case 'back': return '🧘';
            case 'eyes': return '👁️';
            case 'full_body': return '🏃';
            default: return '⭐';
        }
    }

    function getCategoryLabel(category: string, lang: 'es' | 'en') {
        const labels: Record<string, { es: string; en: string }> = {
            neck: { es: 'Cuello', en: 'Neck' },
            shoulders: { es: 'Hombros', en: 'Shoulders' },
            back: { es: 'Espalda', en: 'Back' },
            eyes: { es: 'Ojos', en: 'Eyes' },
            full_body: { es: 'Cuerpo completo', en: 'Full body' }
        };
        return labels[category]?.[lang] || category;
    }

    function getDifficultyLabel(difficulty: string, lang: 'es' | 'en') {
        const labels: Record<string, { es: string; en: string }> = {
            easy: { es: 'Fácil', en: 'Easy' },
            medium: { es: 'Medio', en: 'Medium' },
            hard: { es: 'Difícil', en: 'Hard' }
        };
        return labels[difficulty]?.[lang] || difficulty;
    }
</script>

<div class="h-full w-full p-8 overflow-auto">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">
                    {currentLang === 'es' ? 'Galería de Ejercicios' : 'Exercise Gallery'}
                </h1>
                <p class="text-electric-green-600 dark:text-frozen-water-400">
                    {currentLang === 'es'
                        ? 'Rutinas para mejorar tu postura y reducir fatiga'
                        : 'Routines to improve posture and reduce fatigue'}
                </p>
            </div>

            <!-- Language Toggle -->
            <div class="flex gap-2">
                <button
                    onclick={() => currentLang = 'es'}
                    class={cn(
                        'px-4 py-2 rounded-lg font-medium transition',
                        currentLang === 'es'
                            ? 'bg-electric-green-600 text-twilight-indigo-50'
                            : 'bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400'
                    )}
                >
                    ES
                </button>
                <button
                    onclick={() => currentLang = 'en'}
                    class={cn(
                        'px-4 py-2 rounded-lg font-medium transition',
                        currentLang === 'en'
                            ? 'bg-electric-green-600 text-twilight-indigo-50'
                            : 'bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400'
                    )}
                >
                    EN
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900 p-4">
                <div class="flex items-center gap-3">
                    <Dumbbell class="w-6 h-6 text-electric-green-600" />
                    <div>
                        <p class="text-xs text-carbon-600 dark:text-powder-blue-400">
                            {currentLang === 'es' ? 'Total ejercicios' : 'Total exercises'}
                        </p>
                        <p class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">
                            {exercises.length}
                        </p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900 p-4">
                <div class="flex items-center gap-3">
                    <Clock class="w-6 h-6 text-Tuscan-400" />
                    <div>
                        <p class="text-xs text-carbon-600 dark:text-pictures-blue-400">
                            {currentLang === 'es' ? 'Tiempo total' : 'Total time'}
                        </p>
                        <p class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">
                            18 min
                        </p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900 p-4">
                <div class="flex items-center gap-3">
                    <Activity class="w-6 h-6 text-frozen-water-400" />
                    <div>
                        <p class="text-xs text-carbon-600 dark:text-powder-blue-400">
                            {currentLang === 'es' ? 'Completados' : 'Completed'}
                        </p>
                        <p class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">
                            {completedExercises.length}/{exercises.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {#if selectedExercise && !isDoingExercise}
            <!-- Detalle del ejercicio -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-medium text-graphite-900 dark:text-powder-blue-100">
                            {currentLang === 'es' ? selectedExercise.title : selectedExercise.titleEn}
                        </h2>
                        <p class="text-carbon-600 dark:text-powder-blue-400 mt-1">
                            {currentLang === 'es' ? selectedExercise.description : selectedExercise.descriptionEn}
                        </p>
                    </div>
                    <button
                        onclick={() => selectedExercise = null}
                        class="p-2 rounded-lg hover:bg-carbon-200 dark:hover:bg-twilight-indigo-800 transition"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="flex gap-2 mb-6">
                    <span class="px-3 py-1 rounded-full text-sm bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400">
                        {selectedExercise.duration}
                    </span>
                    <span class="px-3 py-1 rounded-full text-sm {getDifficultyColor(selectedExercise.difficulty)}">
                        {getDifficultyLabel(selectedExercise.difficulty, currentLang)}
                    </span>
                    <span class="px-3 py-1 rounded-full text-sm bg-frozen-water-200 dark:bg-frozen-water-900 text-frozen-water-800 dark:text-frozen-water-300">
                        {getCategoryLabel(selectedExercise.category, currentLang)}
                    </span>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-medium text-carbon-700 dark:text-powder-blue-300 mb-3">
                            {currentLang === 'es' ? 'Pasos' : 'Steps'}
                        </h3>
                        <div class="space-y-3">
                            {#each (currentLang === 'es' ? selectedExercise.steps : selectedExercise.stepsEn) as step, i}
                                <div class="flex gap-3">
                                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-electric-green-200 dark:bg-electric-green-900 text-electric-green-800 dark:text-electric-green-300 flex items-center justify-center text-sm font-medium">
                                        {i + 1}
                                    </span>
                                    <p class="text-carbon-700 dark:text-powder-blue-300">{step}</p>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div>
                        <h3 class="font-medium text-carbon-700 dark:text-powder-blue-300 mb-3">
                            {currentLang === 'es' ? 'Beneficios' : 'Benefits'}
                        </h3>
                        <div class="space-y-2">
                            {#each (currentLang === 'es' ? selectedExercise.benefits : selectedExercise.benefitsEn) as benefit}
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-electric-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 8 0 000 8zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="text-carbon-700 dark:text-powder-blue-300">{benefit}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mt-6">
                    <button
                        onclick={() => startExercise(selectedExercise)}
                        class="flex-1 py-3 rounded-xl bg-electric-green-600 text-twilight-indigo-50 font-medium hover:bg-electric-green-500 transition"
                    >
                        {currentLang === 'es' ? 'Comenzar ejercicio' : 'Start exercise'}
                    </button>
                    <button
                        onclick={() => selectedExercise = null}
                        class="px-6 py-3 rounded-xl bg-carbon-400 text-powder-blue-100 font-medium hover:bg-carbon-500 transition"
                    >
                        {currentLang === 'es' ? 'Volver' : 'Back'}
                    </button>
                </div>
            </div>
        {:else if isDoingExercise && selectedExercise}
            <!-- Ejercicio en progreso -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-8 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-medium text-graphite-900 dark:text-powder-blue-100">
                        {currentLang === 'es' ? selectedExercise.title : selectedExercise.titleEn}
                    </h2>
                    <span class="px-3 py-1 rounded-full text-sm {getDifficultyColor(selectedExercise.difficulty)}">
                        {getDifficultyLabel(selectedExercise.difficulty, currentLang)}
                    </span>
                </div>

                <div class="mb-6">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-carbon-600 dark:text-powder-blue-400">
                            {currentLang === 'es' ? 'Progreso' : 'Progress'}
                        </span>
                        <span class="text-graphite-900 dark:text-powder-blue-100">{exerciseProgress}%</span>
                    </div>
                    <div class="w-full bg-carbon-300 dark:bg-twilight-indigo-700 rounded-full h-3">
                        <div class="bg-electric-green-600 h-3 rounded-full transition-all duration-300" style="width: {exerciseProgress}%"></div>
                    </div>
                </div>

                <div class="space-y-4 mb-6">
                    <h3 class="font-medium text-carbon-700 dark:text-powder-blue-300">
                        {currentLang === 'es' ? 'Pasos:' : 'Steps:'}
                    </h3>
                    {#each (currentLang === 'es' ? selectedExercise.steps : selectedExercise.stepsEn) as step, i}
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-electric-green-200 dark:bg-electric-green-900 text-electric-green-800 dark:text-electric-green-300 flex items-center justify-center text-sm font-medium">
                                {i + 1}
                            </span>
                            <p class="text-carbon-700 dark:text-powder-blue-300">{step}</p>
                        </div>
                    {/each}
                </div>

                <div class="flex gap-3">
                    <button
                        onclick={() => exerciseProgress = Math.min(100, exerciseProgress + 25)}
                        class="flex-1 py-3 rounded-xl bg-electric-green-600 text-twilight-indigo-50 font-medium hover:bg-electric-green-500 transition"
                    >
                        {currentLang === 'es' ? 'Marcar paso completado' : 'Mark step completed'}
                    </button>
                    <button
                        onclick={completeExercise}
                        class="px-6 py-3 rounded-xl bg-carbon-400 text-powder-blue-100 font-medium hover:bg-carbon-500 transition"
                    >
                        {currentLang === 'es' ? 'Finalizar' : 'Complete'}
                    </button>
                </div>
            </div>
        {:else}
            <!-- Grid de ejercicios -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {#each exercises as exercise}
                    <div
                        onclick={() => selectExercise(exercise)}
                        class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950 cursor-pointer hover:border-electric-green-400 transition"
                    >
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">{getCategoryIcon(exercise.category)}</span>
                                <div>
                                    <h3 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                                        {currentLang === 'es' ? exercise.title : exercise.titleEn}
                                    </h3>
                                    <p class="text-xs text-carbon-500 dark:text-powder-blue-400">
                                        {getCategoryLabel(exercise.category, currentLang)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p class="text-sm text-carbon-600 dark:text-powder-blue-400 mb-4">
                            {currentLang === 'es' ? exercise.description : exercise.descriptionEn}
                        </p>

                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-2 py-1 rounded-lg text-xs bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400">
                                {exercise.duration}
                            </span>
                            <span class="px-2 py-1 rounded-lg text-xs {getDifficultyColor(exercise.difficulty)}">
                                {getDifficultyLabel(exercise.difficulty, currentLang)}
                            </span>
                        </div>

                        {#if completedExercises.includes(exercise.id)}
                            <div class="flex items-center gap-2 text-electric-green-600 dark:text-frozen-water-400 text-sm">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 8 0 000 8zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span>{currentLang === 'es' ? 'Completado' : 'Completed'}</span>
                            </div>
                        {:else}
                            <div class="flex items-center gap-2 text-carbon-500 dark:text-powder-blue-400 text-sm">
                                <ChevronRight class="w-4 h-4" />
                                <span>{currentLang === 'es' ? 'Ver ejercicio' : 'View exercise'}</span>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
