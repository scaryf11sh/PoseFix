import { browser } from "$app/environment";
import { init, register, waitLocale } from "svelte-i18n";

export const prerender = true;
export const ssr = false;

register("en", () => import("$lib/i18n/locales/en.json"));
register("es", () => import("$lib/i18n/locales/es.json"));

export async function load() {
    const stored = browser ? localStorage.getItem("locale") : null;
    const nav    = browser ? navigator.language : "en";
    const locale = stored ?? (nav.startsWith("es") ? "es" : "en");

    init({ fallbackLocale: "en", initialLocale: locale });

    await waitLocale(locale);
    return {};
}
