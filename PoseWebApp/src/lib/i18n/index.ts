import { browser } from "$app/environment";
import { init, register, getLocaleFromNavigator } from "svelte-i18n";

register("en", () => import("./locales/en.json"));
register("es", () => import("./locales/es.json"));

export function setupI18n() {
    const stored = browser ? localStorage.getItem("locale") : null;
    const locale = stored ?? getLocaleFromNavigator() ?? "en";

    init({
        fallbackLocale: "en",
        initialLocale: locale.startsWith("es") ? "es" : "en",
    });
}

export { locale, locales, t, _ } from "svelte-i18n";
