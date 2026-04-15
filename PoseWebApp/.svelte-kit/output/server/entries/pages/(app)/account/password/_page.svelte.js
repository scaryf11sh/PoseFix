import { a as store_get, u as unsubscribe_stores } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { a as $format } from "../../../../../chunks/runtime.js";
import "@tauri-apps/plugin-sql";
import "../../../../../chunks/user.js";
import { C as Chevron_left } from "../../../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><div class="flex items-center gap-3 mb-6"><a href="/account" class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-sky-400 hover:border-sky-400 transition-all cursor-pointer shadow-sm">`);
    Chevron_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></a> <div><h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("account.password"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("account.password_sub"))}</p></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64"><div class="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
