import type { Exercise } from '$lib/exercises';

export function calculateExercisePoints(exercise: Exercise): number {
    const d = exercise.durationVal;
    let base: number;
    if (d <= 1) base = 5;
    else if (d <= 2) base = 8;
    else if (d <= 3) base = 12;
    else if (d <= 5) base = 20;
    else base = 20 + (d - 5) * 3;

    const diffMult: Record<string, number> = { beginner: 1.0, intermediate: 1.5, advanced: 2.0 };
    const dm = diffMult[exercise.difficulty ?? 'beginner'] ?? 1.0;

    const highCats = ['Core Strength', 'Inversions', 'Balancing', 'Twists'];
    const midCats = ['yoga', 'Backbend', 'Forward Bend', 'Hip-Opening', 'Standing', 'Seated', 'Restorative'];
    let cm = 1.0;
    if (highCats.includes(exercise.category)) cm = 1.3;
    else if (midCats.includes(exercise.category)) cm = 1.15;

    return Math.round(base * dm * cm);
}
