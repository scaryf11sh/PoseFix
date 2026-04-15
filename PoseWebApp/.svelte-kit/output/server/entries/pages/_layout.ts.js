import { r as registerLocaleLoader, i as init, w as waitLocale } from "../../chunks/runtime.js";
const prerender = true;
const ssr = false;
registerLocaleLoader("en", () => import("../../chunks/en.js"));
registerLocaleLoader("es", () => import("../../chunks/es.js"));
async function load() {
  const nav = "en";
  const locale = nav.startsWith("es") ? "es" : "en";
  init({ fallbackLocale: "en", initialLocale: locale });
  await waitLocale(locale);
  return {};
}
export {
  load,
  prerender,
  ssr
};
