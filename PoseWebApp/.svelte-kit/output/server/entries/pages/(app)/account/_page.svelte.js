import { a as store_get, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import { e as escape_html } from "../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as $format } from "../../../../chunks/runtime.js";
import "@tauri-apps/plugin-dialog";
import "@tauri-apps/plugin-fs";
import "@tauri-apps/api/path";
import "@tauri-apps/api/core";
import "@tauri-apps/plugin-sql";
import { u as userStore } from "../../../../chunks/user.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let fullName = "";
    store_get($$store_subs ??= {}, "$userStore", userStore).avatarUrl;
    store_get($$store_subs ??= {}, "$userStore", userStore).user;
    fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("account.title"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("account.subtitle"))}</p> `);
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
