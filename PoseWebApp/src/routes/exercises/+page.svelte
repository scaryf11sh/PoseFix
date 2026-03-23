<script lang="ts">
    import { Dumbbell, Stretching, Arm, Eye } from '@lucide/svelte';

    type Exercise = {
        id: number;
        title: string;
        duration: string;
        difficulty: 'easy' | 'medium' | 'hard';
        category: 'neck' | 'shoulders' | 'back' | 'eyes';
        description: string;
        steps: string[];
    };

    const exercises: Exercise[] = [
        {
            id: 1,
            title: "Rotación de cuello",
            duration: "2 min",
            difficulty: "easy",
            category: "neck",
            description: "Moviliza suavemente las cervicales",
            steps: [
                "Inclina la cabeza hacia adelante",
                "Rota lentamente hacia la derecha",
                "Vuelve al centro y repite hacia la izquierda",
                "Haz 5 repeticiones por lado"
            ]
        },
        {
            id: 2,
            title: "Elevación de hombros",
            duration: "3 min",
            difficulty: "easy",
            category: "shoulders",
            description: "Libera tensión en trapecios",
            steps: [
                "Levanta los hombros hacia las orejas",
                "Mantén 3 segundos",
                "Baja lentamente",
                "Repite 10 veces"
            ]
        },
        {
            id: 3,
            title: "Estiramiento de espalda",
            duration: "5 min",
            difficulty: "medium",
            category: "back",
            description: "Estira la columna torácica",
            steps: [
                "Siéntate con la espalda recta",
                "Entrelaza las manos detrás de la cabeza",
                "Arquea suavemente hacia atrás",
                "Mantén 10 segundos y repite"
            ]
        },
        {
            id: 4,
            title: "Descanso visual 20-20-20",
            duration: "1 min",
            difficulty: "easy",
            category: "eyes",
            description: "Reduce fatiga visual",
            steps: [
                "Cada 20 minutos de trabajo",
                "Mira un objeto a 20 pies (6 metros)",
                "Mantén la vista 20 segundos",
                "Parpadea varias veces"
            ]
        }
    ];

    let selectedExercise: Exercise | null = null;
    let isDoingExercise = $state(false);
    let exerciseProgress = $state(0);

    function startExercise(exercise: Exercise) {
        selectedExercise = exercise;
        isDoingExercise = true;
        exerciseProgress = 0;
    }

    function completeExercise() {
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
</script>

<div class="h-full w-full p-8 overflow-auto">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">
            Ejercicios
        </h1>
        <p class="text-electric-green-600 dark:text-frozen-water-400 mb-6">
            Rutinas para mejorar tu postura y reducir fatiga
        </p>

        {#if isDoingExercise && selectedExercise}
            <!-- Vista de ejercicio en progreso -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-8 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-medium text-graphite-900 dark:text-powder-blue-100">
                        {selectedExercise.title}
                    </h2>
                    <span class="px-3 py-1 rounded-full text-sm {getDifficultyColor(selectedExercise.difficulty)}">
                        {selectedExercise.difficulty === 'easy' ? 'Fácil' : selectedExercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                    </span>
                </div>

                <div class="mb-6">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-carbon-600 dark:text-powder-blue-400">Progreso</span>
                        <span class="text-graphite-900 dark:text-powder-blue-100">{exerciseProgress}%</span>
                    </div>
                    <div class="w-full bg-carbon-300 dark:bg-twilight-indigo-700 rounded-full h-3">
                        <div class="bg-electric-green-600 h-3 rounded-full transition-all duration-300" style="width: {exerciseProgress}%"></div>
                    </div>
                </div>

                <div class="space-y-4 mb-6">
                    <h3 class="font-medium text-carbon-700 dark:text-powder-blue-300">Pasos:</h3>
                    {#each selectedExercise.steps as step, i}
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
                        Marcar paso completado
                    </button>
                    <button
                        onclick={completeExercise}
                        class="px-6 py-3 rounded-xl bg-carbon-400 text-powder-blue-100 font-medium hover:bg-carbon-500 transition"
                    >
                        Finalizar
                    </button>
                </div>
            </div>
        {:else}
            <!-- Lista de ejercicios -->
            <div class="grid gap-4 md:grid-cols-2">
                {#each exercises as exercise}
                    <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                                    {exercise.title}
                                </h3>
                                <p class="text-sm text-carbon-600 dark:text-powder-blue-400">
                                    {exercise.description}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-2 py-1 rounded-lg text-xs bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400">
                                {exercise.duration}
                            </span>
                            <span class="px-2 py-1 rounded-lg text-xs {getDifficultyColor(exercise.difficulty)}">
                                {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                            </span>
                            <span class="px-2 py-1 rounded-lg text-xs bg-frozen-water-200 dark:bg-frozen-water-900 text-frozen-water-800 dark:text-frozen-water-300">
                                {exercise.category === 'neck' ? 'Cuello' : exercise.category === 'shoulders' ? 'Hombros' : exercise.category === 'back' ? 'Espalda' : 'Ojos'}
                            </span>
                        </div>

                        <button
                            onclick={() => startExercise(exercise)}
                            class="w-full py-2 rounded-xl bg-electric-green-600 text-twilight-indigo-50 font-medium hover:bg-electric-green-500 transition"
                        >
                            Comenzar ejercicio
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
