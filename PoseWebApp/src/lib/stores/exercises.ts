import { writable } from 'svelte/store';
import type { Exercise } from '$lib/exercises';

export const allExercises = writable<Exercise[]>([]);
export const exercisesLoading = writable(false);
export const exercisesLoaded = writable(false);

let loadPromise: Promise<void> | null = null;

export function ensureExercisesLoaded(): Promise<void> {
    if (loadPromise) return loadPromise;

    exercisesLoading.set(true);

    loadPromise = import('$lib/api/exercisesService')
        .then(({ getAllExercises }) => getAllExercises())
        .then((list) => {
            allExercises.set(list);
            exercisesLoaded.set(true);
            exercisesLoading.set(false);
        })
        .catch((err) => {
            console.error('Failed to load exercises:', err);
            exercisesLoading.set(false);
        });

    return loadPromise;
}

export function getExerciseByIdFromStore(
    exercises: Exercise[],
    id: string,
): Exercise | undefined {
    return exercises.find((e) => e.id === id);
}
