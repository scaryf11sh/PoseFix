// i18n translations
export type Language = 'es' | 'en';

export const translations = {
    es: {
        // Navigation
        dashboard: 'Dashboard',
        camera: 'Cámara',
        exercises: 'Ejercicios',
        gallery: 'Galería',
        export: 'Exportar',
        settings: 'Configuración',

        // Dashboard
        welcome: 'Bienvenido',
        keepImproving: 'Sigue mejorando día a día',
        sessionActive: 'Sesión activa',
        sessionInactive: 'Sesión inactiva',
        pose: 'Postura',
        eyeStrain: 'Fatiga Visual',
        nextBreak: 'Próximo Descanso',
        tips: 'Consejos',
        weeklyScore: 'Puntuación Semanal',
        monitoring: 'Monitoreo',

        // Common
        start: 'Iniciar',
        stop: 'Detener',
        complete: 'Completar',
        back: 'Volver',
        difficulty: 'Dificultad',
        duration: 'Duración',
        easy: 'Fácil',
        medium: 'Medio',
        hard: 'Difícil',

        // Categories
        neck: 'Cuello',
        shoulders: 'Hombros',
        back: 'Espalda',
        eyes: 'Ojos',
        full_body: 'Cuerpo completo',

        // Messages
        cameraNotActive: 'Cámara desactivada',
        cameraError: 'No se pudo acceder a la cámara. Verifica los permisos.',
        exportSuccess: 'Datos exportados correctamente',
        exerciseComplete: '¡Ejercicio completado!',
    },
    en: {
        // Navigation
        dashboard: 'Dashboard',
        camera: 'Camera',
        exercises: 'Exercises',
        gallery: 'Gallery',
        export: 'Export',
        settings: 'Settings',

        // Dashboard
        welcome: 'Welcome',
        keepImproving: 'Keep improving day by day',
        sessionActive: 'Session active',
        sessionInactive: 'Session inactive',
        pose: 'Pose',
        eyeStrain: 'Eye Strain',
        nextBreak: 'Next Break',
        tips: 'Tips',
        weeklyScore: 'Weekly Score',
        monitoring: 'Monitoring',

        // Common
        start: 'Start',
        stop: 'Stop',
        complete: 'Complete',
        back: 'Back',
        difficulty: 'Difficulty',
        duration: 'Duration',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',

        // Categories
        neck: 'Neck',
        shoulders: 'Shoulders',
        back: 'Back',
        eyes: 'Eyes',
        full_body: 'Full body',

        // Messages
        cameraNotActive: 'Camera inactive',
        cameraError: 'Could not access camera. Check permissions.',
        exportSuccess: 'Data exported successfully',
        exerciseComplete: 'Exercise completed!',
    }
} as const;

export type TranslationKey = keyof typeof translations.es;

let currentLanguage: Language = 'es';

export function setLanguage(lang: Language) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
}

export function getLanguage(): Language {
    return currentLanguage;
}

export function t(key: TranslationKey): string {
    return translations[currentLanguage][key] || translations.es[key] || key;
}

export function tOptional(key: string): string {
    const langKey = key as TranslationKey;
    return translations[currentLanguage][langKey] || translations['en'][langKey] || key;
}
