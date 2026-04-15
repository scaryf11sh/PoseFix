import "clsx";
import { s as spread_props, a as store_get, e as ensure_array_like, d as attr, b as attr_class, c as stringify, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/index3.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as $format } from "../../../chunks/runtime.js";
import { u as userStore } from "../../../chunks/user.js";
import "@tauri-apps/plugin-sql";
import { I as Icon } from "../../../chunks/Icon.js";
import { V as Video } from "../../../chunks/video.js";
import { D as Dumbbell } from "../../../chunks/dumbbell.js";
import { e as escape_html } from "../../../chunks/context.js";
import "@tauri-apps/plugin-fs";
function Clipboard_clock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M16 14v2.2l1.6 1" }],
      ["path", { "d": "M16 4h2a2 2 0 0 1 2 2v.832" }],
      ["path", { "d": "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" }],
      ["circle", { "cx": "16", "cy": "16", "r": "6" }],
      [
        "rect",
        { "x": "8", "y": "2", "width": "8", "height": "4", "rx": "1" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "clipboard-clock" },
      /**
       * @component @name ClipboardClock
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTR2Mi4ybDEuNiAxIiAvPgogIDxwYXRoIGQ9Ik0xNiA0aDJhMiAyIDAgMCAxIDIgMnYuODMyIiAvPgogIDxwYXRoIGQ9Ik04IDRINmEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMiIgLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI2IiAvPgogIDxyZWN0IHg9IjgiIHk9IjIiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/clipboard-clock
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
function File_down($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        }
      ],
      ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
      ["path", { "d": "M12 18v-6" }],
      ["path", { "d": "m9 15 3 3 3-3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "file-down" },
      /**
       * @component @name FileDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJNMTIgMTh2LTYiIC8+CiAgPHBhdGggZD0ibTkgMTUgMyAzIDMtMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-down
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
function Layout_dashboard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }
      ],
      [
        "rect",
        { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }
      ],
      [
        "rect",
        { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }
      ],
      [
        "rect",
        { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "layout-dashboard" },
      /**
       * @component @name LayoutDashboard
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
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
function Log_out($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m16 17 5-5-5-5" }],
      ["path", { "d": "M21 12H9" }],
      ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "log-out" },
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
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
function Settings_2($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M14 17H5" }],
      ["path", { "d": "M19 7h-9" }],
      ["circle", { "cx": "17", "cy": "17", "r": "3" }],
      ["circle", { "cx": "7", "cy": "7", "r": "3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "settings-2" },
      /**
       * @component @name Settings2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMTdINSIgLz4KICA8cGF0aCBkPSJNMTkgN2gtOSIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE3IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjciIGN5PSI3IiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/settings-2
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
function SideBar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath = page.url.pathname;
    function isActive(href) {
      return currentPath === href;
    }
    let initials = store_get($$store_subs ??= {}, "$userStore", userStore).user ? store_get($$store_subs ??= {}, "$userStore", userStore).user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
    $$renderer2.push(`<aside class="h-screen hidden md:flex p-4 w-64 dark:bg-slate-950/75 border-r backdrop-blur-3xl border-sky-400/10 shadow-2xl z-40 sticky top-0"><div class="h-full flex flex-col justify-between w-full"><div><div class="flex flex-row items-center gap-x-1 mb-8"><img src="/icon.png" alt="Logo" class="w-12 h-12"/> <div><h2 class="text-lg font-bold text-deep-twilight-900 dark:text-frozen-lake-400">PoseFix</h2> <h3 class="text-xs uppercase text-deep-twilight-900/75 dark:text-frozen-lake-400/75">Ergonomic Planner</h3></div></div> <div class="flex flex-col gap-2"><!--[-->`);
    const each_array = ensure_array_like([
      {
        href: "/",
        icon: Layout_dashboard,
        label: store_get($$store_subs ??= {}, "$_", $format)("nav.dashboard")
      },
      {
        href: "/camera",
        icon: Video,
        label: store_get($$store_subs ??= {}, "$_", $format)("nav.monitor")
      },
      {
        href: "/exercises",
        icon: Dumbbell,
        label: store_get($$store_subs ??= {}, "$_", $format)("nav.exercises")
      },
      {
        href: "/progress",
        icon: Clipboard_clock,
        label: store_get($$store_subs ??= {}, "$_", $format)("nav.progress")
      },
      {
        href: "/export",
        icon: File_down,
        label: store_get($$store_subs ??= {}, "$_", $format)("nav.export")
      }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<a${attr("href", item.href)}${attr("aria-label", item.label)}${attr_class(`flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer ${stringify(isActive(item.href) ? "outline outline-frozen-lake-400/60 dark:outline-frozen-lake-800 bg-frozen-lake-400/15 text-deep-twilight-900 dark:text-frozen-lake-200" : "hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-deep-twilight-900/50 dark:text-frozen-lake-200/50 hover:translate-x-3")}`)}>`);
      $$renderer2.push("<!---->");
      item.icon?.($$renderer2, { class: "w-5 h-5 shrink-0" });
      $$renderer2.push(`<!----> <span class="flex-1 cursor-pointer">${escape_html(item.label)}</span></a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex flex-col gap-2"><a href="/settings"${attr("aria-label", store_get($$store_subs ??= {}, "$_", $format)("nav.settings"))}${attr_class(`flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer ${stringify(isActive("/settings") ? "outline outline-frozen-lake-400/60 dark:outline-frozen-lake-800 bg-frozen-lake-400/15 text-deep-twilight-900 dark:text-frozen-lake-200" : "hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-deep-twilight-900/50 dark:text-frozen-lake-200/50 hover:translate-x-3")}`)}>`);
    Settings_2($$renderer2, { class: "w-5 h-5 shrink-0" });
    $$renderer2.push(`<!----> <span class="flex-1 cursor-pointer">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("nav.settings"))}</span></a> <a href="/account"${attr("aria-label", store_get($$store_subs ??= {}, "$_", $format)("nav.account"))}${attr_class(`flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer ${stringify(isActive("/account") ? "outline outline-frozen-lake-400/60 dark:outline-frozen-lake-800 bg-frozen-lake-400/15 text-deep-twilight-900 dark:text-frozen-lake-200" : "hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-deep-twilight-900/50 dark:text-frozen-lake-200/50 hover:translate-x-3")}`)}><div class="w-6 h-6 rounded-full shrink-0 ring-1 ring-sky-400/50 overflow-hidden bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center">`);
    if (store_get($$store_subs ??= {}, "$userStore", userStore).avatarUrl) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", store_get($$store_subs ??= {}, "$userStore", userStore).avatarUrl)} alt="Profile" class="w-full h-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="text-[8px] font-bold text-white leading-none">${escape_html(initials)}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <span class="flex-1 cursor-pointer">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("nav.account"))}</span></a> <button class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer text-red-400/70 hover:text-red-400 hover:bg-red-400/10 hover:translate-x-3 text-left">`);
    Log_out($$renderer2, { class: "w-5 h-5 shrink-0" });
    $$renderer2.push(`<!----> <span class="flex-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("nav.logout"))}</span></button></div></div></aside>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    $$renderer2.push(`<main class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900">`);
    SideBar($$renderer2);
    $$renderer2.push(`<!----> <div class="flex-1 overflow-y-auto">`);
    children($$renderer2);
    $$renderer2.push(`<!----></div></main>`);
  });
}
export {
  _layout as default
};
