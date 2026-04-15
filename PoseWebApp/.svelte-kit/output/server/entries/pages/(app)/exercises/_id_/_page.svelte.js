import { a as store_get, u as unsubscribe_stores } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import { o as onDestroy } from "../../../../../chunks/index-server.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { b as $locale, a as $format } from "../../../../../chunks/runtime.js";
import "@tauri-apps/plugin-sql";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    store_get($$store_subs ??= {}, "$locale", $locale)?.startsWith("es") ?? false;
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-full text-slate-400"><p>${escape_html(store_get($$store_subs ??= {}, "$_", $format)("common.loading"))}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
