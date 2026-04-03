import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type ThemeMode = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
    if (!browser) return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialMode(): ThemeMode {
    if (!browser) return "system";
    return (localStorage.getItem("themeMode") as ThemeMode) ?? "system";
}

function applyTheme(mode: ThemeMode) {
    if (!browser) return;
    const resolved = mode === "system" ? getSystemTheme() : mode;
    document.documentElement.classList.toggle("dark", resolved === "dark");
}

function createThemeStore() {
    const { subscribe, set } = writable<ThemeMode>(getInitialMode());

    function apply(mode: ThemeMode) {
        localStorage.setItem("themeMode", mode);
        applyTheme(mode);
        set(mode);
    }

    // Reacciona a cambios del sistema cuando está en modo "system"
    if (browser) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            const stored = localStorage.getItem("themeMode") as ThemeMode;
            if (stored === "system") applyTheme("system");
        });
    }

    return { subscribe, set: apply };
}

export const theme = createThemeStore();
