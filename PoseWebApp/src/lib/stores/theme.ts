import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type ThemeMode = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
    if (!browser) return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialMode(): ThemeMode {
    if (!browser) return "system";
    // Default: system si no hay nada guardado
    return (localStorage.getItem("themeMode") as ThemeMode) ?? "system";
}

function applyTheme(mode: ThemeMode) {
    if (!browser) return;
    const resolved = mode === "system" ? getSystemTheme() : mode;
    document.documentElement.classList.toggle("dark", resolved === "dark");
}

function createThemeStore() {
    const initial = getInitialMode();
    const { subscribe, set } = writable<ThemeMode>(initial);

    // Aplica inmediatamente al crear el store (cubre el caso de hot-reload)
    applyTheme(initial);

    function apply(mode: ThemeMode) {
        if (browser) localStorage.setItem("themeMode", mode);
        applyTheme(mode);
        set(mode);
    }

    // Reacciona a cambios del SO en tiempo real cuando está en modo "system"
    if (browser) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            const stored = (localStorage.getItem("themeMode") as ThemeMode) ?? "system";
            if (stored === "system") applyTheme("system");
        });
    }

    return { subscribe, set: apply };
}

export const theme = createThemeStore();
