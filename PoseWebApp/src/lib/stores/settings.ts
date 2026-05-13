import { writable } from "svelte/store";
import { browser } from "$app/environment";

type NotificationSettings = {
    posture: boolean;
    weekly:  boolean;
    stretch: boolean;
    drift:   boolean;
};

type HealthSettings = {
    breakInterval: number;
    breakDuration: number;
};

type SettingsStore = {
    notifications: NotificationSettings;
    health:        HealthSettings;
    units:         "metric" | "imperial";
    language:      string;
};

const DEFAULTS: SettingsStore = {
    notifications: {
        posture: true,
        weekly:  true,
        stretch: true,
        drift:   false,
    },
    health: {
        breakInterval: 60,
        breakDuration: 5,
    },
    units:    "metric",
    language: "en",
};

function loadSettings(): SettingsStore {
    if (!browser) return DEFAULTS;
    try {
        const stored = localStorage.getItem("appSettings");
        return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
    } catch {
        return DEFAULTS;
    }
}

function createSettingsStore() {
    const { subscribe, set, update } = writable<SettingsStore>(loadSettings());

    return {
        subscribe,

        save(settings: SettingsStore) {
            if (browser) localStorage.setItem("appSettings", JSON.stringify(settings));
            set(settings);
        },

        restore() {
            if (browser) localStorage.setItem("appSettings", JSON.stringify(DEFAULTS));
            set({ ...DEFAULTS });
        },
    };
}

export const settingsStore = createSettingsStore();
export { DEFAULTS as settingsDefaults };
