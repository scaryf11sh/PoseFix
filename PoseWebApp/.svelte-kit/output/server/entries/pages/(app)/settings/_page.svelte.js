import { s as spread_props, a as store_get, d as attr, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as $format } from "../../../../chunks/runtime.js";
import "../../../../chunks/theme.js";
import { S as Save, s as settingsStore } from "../../../../chunks/settings.js";
import "@tauri-apps/plugin-sql";
import "../../../../chunks/user.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { e as escape_html } from "../../../../chunks/context.js";
function Rotate_ccw($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
      ],
      ["path", { "d": "M3 3v5h5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "rotate-ccw" },
      /**
       * @component @name RotateCcw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let loading = true;
    ({
      ...store_get($$store_subs ??= {}, "$settingsStore", settingsStore).notifications
    });
    store_get($$store_subs ??= {}, "$settingsStore", settingsStore).units;
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><div class="flex items-start justify-between mb-6 flex-wrap gap-3"><div><h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("settings.title"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("settings.subtitle"))}</p></div> <div class="flex gap-2 items-center">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <button class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2">`);
    Rotate_ccw($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$_", $format)("settings.restore"))}</button> <button${attr("disabled", loading, true)} class="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold transition-all shadow-lg shadow-sky-400/20 active:scale-95 disabled:opacity-60 flex items-center gap-2 cursor-pointer">`);
    {
      $$renderer2.push("<!--[!-->");
      Save($$renderer2, { class: "w-4 h-4" });
    }
    $$renderer2.push(`<!--]--> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("common.save"))}</button></div></div> `);
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
