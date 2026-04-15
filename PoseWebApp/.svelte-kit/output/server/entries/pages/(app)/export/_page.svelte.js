import { s as spread_props, a as store_get, d as attr, e as ensure_array_like, b as attr_class, c as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as $format } from "../../../../chunks/runtime.js";
import "@tauri-apps/plugin-sql";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { D as Download } from "../../../../chunks/download.js";
import { L as Lock } from "../../../../chunks/lock.js";
import { e as escape_html } from "../../../../chunks/context.js";
function File_text($$renderer, $$props) {
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
      ["path", { "d": "M10 9H8" }],
      ["path", { "d": "M16 13H8" }],
      ["path", { "d": "M16 17H8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "file-text" },
      /**
       * @component @name FileText
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJNMTAgOUg4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxM0g4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxN0g4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-text
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
function List($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M3 5h.01" }],
      ["path", { "d": "M3 12h.01" }],
      ["path", { "d": "M3 19h.01" }],
      ["path", { "d": "M8 5h13" }],
      ["path", { "d": "M8 12h13" }],
      ["path", { "d": "M8 19h13" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "list" },
      /**
       * @component @name List
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTloLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDVoMTMiIC8+CiAgPHBhdGggZD0iTTggMTJoMTMiIC8+CiAgPHBhdGggZD0iTTggMTloMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
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
    function localDate(d = /* @__PURE__ */ new Date()) {
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    }
    const _start7 = /* @__PURE__ */ new Date();
    _start7.setDate(_start7.getDate() - 7);
    let startDate = localDate(_start7);
    let endDate = localDate();
    function daysDiff() {
      const a = new Date(startDate);
      const b = new Date(endDate);
      return Math.max(1, Math.round((b.getTime() - a.getTime()) / 864e5));
    }
    let categories = [
      {
        id: "posture",
        label: () => store_get($$store_subs ??= {}, "$_", $format)("export.categories_list.posture"),
        enabled: true
      },
      {
        id: "eye",
        label: () => store_get($$store_subs ??= {}, "$_", $format)("export.categories_list.eye"),
        enabled: true
      },
      {
        id: "sensor",
        label: () => store_get($$store_subs ??= {}, "$_", $format)("export.categories_list.sensor"),
        enabled: false
      },
      {
        id: "exercise",
        label: () => store_get($$store_subs ??= {}, "$_", $format)("export.categories_list.exercise"),
        enabled: true
      }
    ];
    let activeCount = categories.filter((c) => c.enabled).length;
    let selectedFormat = "pdf";
    const formats = [
      {
        id: "pdf",
        label: store_get($$store_subs ??= {}, "$_", $format)("export.pdf"),
        sub: store_get($$store_subs ??= {}, "$_", $format)("export.pdfSub")
      },
      {
        id: "csv",
        label: store_get($$store_subs ??= {}, "$_", $format)("export.csv"),
        sub: store_get($$store_subs ??= {}, "$_", $format)("export.csvSub")
      },
      {
        id: "json",
        label: store_get($$store_subs ??= {}, "$_", $format)("export.json"),
        sub: store_get($$store_subs ??= {}, "$_", $format)("export.jsonSub")
      }
    ];
    const recentExports = [
      {
        name: "Posture Analysis Report",
        id: "RPT-0041",
        date: "Oct 26, 2023",
        format: "PDF",
        status: "Completed"
      },
      {
        name: "Weekly Sensor Data",
        id: "RPT-0040",
        date: "Oct 19, 2023",
        format: "CSV",
        status: "Completed"
      },
      {
        name: "Exercise Log Export",
        id: "RPT-0039",
        date: "Oct 12, 2023",
        format: "JSON",
        status: "Completed"
      },
      {
        name: "Monthly Overview",
        id: "RPT-0038",
        date: "Sep 30, 2023",
        format: "PDF",
        status: "Archived"
      }
    ];
    let generating = false;
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><div class="mb-6"><h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.title"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.subtitle"))}</p></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"><div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"><div class="flex items-center gap-2 mb-4"><div class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500">`);
    Calendar($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h2 class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.dateRange"))}</h2></div> <div class="grid grid-cols-2 gap-3 mb-4"><div><label class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.startDate"))}</label> <input type="date"${attr("value", startDate)} class="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all"/></div> <div><label class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.endDate"))}</label> <input type="date"${attr("value", endDate)} class="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all"/></div></div> <div class="flex gap-2 mb-3"><!--[-->`);
    const each_array = ensure_array_like([
      [store_get($$store_subs ??= {}, "$_", $format)("export.last7"), 7],
      [
        store_get($$store_subs ??= {}, "$_", $format)("export.last30"),
        30
      ],
      [
        store_get($$store_subs ??= {}, "$_", $format)("export.yearToDate"),
        "ytd"
      ]
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [label, val] = each_array[$$index];
      $$renderer2.push(`<button class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-500 active:scale-95">${escape_html(label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"><div class="flex items-center gap-2 mb-4"><div class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500">`);
    List($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h2 class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.categories"))}</h2></div> <div class="grid grid-cols-2 gap-3"><!--[-->`);
    const each_array_1 = ensure_array_like(categories);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<div class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"><span class="text-sm text-slate-700 dark:text-slate-200">${escape_html(cat.label())}</span> <button${attr_class(`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${stringify(cat.enabled ? "bg-sky-400" : "bg-slate-200 dark:bg-slate-600")}`)}><span${attr_class(`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${stringify(cat.enabled ? "translate-x-5" : "translate-x-0")}`)}></span></button></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"><div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"><div class="flex items-center gap-2 mb-4"><div class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500">`);
    File_text($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h2 class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.format"))}</h2></div> <div class="flex flex-col gap-2"><!--[-->`);
    const each_array_2 = ensure_array_like(formats);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let fmt = each_array_2[$$index_2];
      $$renderer2.push(`<button${attr_class(`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${stringify(selectedFormat === fmt.id ? "bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-700" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600")} border`)}><div${attr_class(`w-9 h-9 rounded-lg ${stringify(selectedFormat === fmt.id ? "bg-sky-100 dark:bg-sky-900/40 text-sky-500" : "bg-slate-100 dark:bg-slate-700 text-slate-400")} flex items-center justify-center flex-shrink-0 transition-colors`)}>`);
      File_text($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></div> <div class="flex-1"><p class="text-sm font-semibold text-slate-800 dark:text-white">${escape_html(fmt.label)}</p> <p class="text-xs text-slate-400">${escape_html(fmt.sub)}</p></div> `);
      if (selectedFormat === fmt.id) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center flex-shrink-0">`);
        Circle_check_big($$renderer2, { class: "w-3.5 h-3.5 text-white" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center text-center gap-4"><div class="relative w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.15)]">`);
    Activity($$renderer2, { class: "w-9 h-9 text-sky-400" });
    $$renderer2.push(`<!----> <div class="absolute inset-0 rounded-full bg-sky-400/10 animate-pulse"></div></div> <div><h2 class="text-xl font-bold text-white mb-2">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.ready"))}</h2> <p class="text-sm text-slate-400 max-w-xs">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.readyDesc", {
      values: {
        days: daysDiff(),
        cats: activeCount,
        fmt: selectedFormat.toUpperCase()
      }
    }))}</p></div> <button${attr("disabled", generating, true)} class="flex items-center gap-2 px-8 py-3 rounded-2xl bg-sky-400 hover:bg-sky-500 disabled:opacity-70 text-white font-bold text-sm shadow-lg shadow-sky-400/30 transition-all duration-200 active:scale-95">`);
    {
      $$renderer2.push("<!--[!-->");
      Download($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.generate"))}`);
    }
    $$renderer2.push(`<!--]--></button> <div class="flex items-center gap-4 text-xs"><div class="flex items-center gap-1.5 text-slate-400"><span class="w-2 h-2 rounded-full bg-green-400"></span> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.systemReady"))}</div> <div class="flex items-center gap-1.5 text-slate-400">`);
    Lock($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.encryption"))}</div></div></div></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-500">`);
    Activity($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h2 class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.recent"))}</h2></div> <button class="text-xs font-bold uppercase tracking-widest text-sky-400 hover:text-sky-500 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.viewAll"))}</button></div> <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-slate-100 dark:border-slate-800"><!--[-->`);
    const each_array_3 = ensure_array_like([
      "Report Name & ID",
      "Date Generated",
      "Format",
      "Status",
      "Action"
    ]);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let col = each_array_3[$$index_3];
      $$renderer2.push(`<th class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4">${escape_html(col)}</th>`);
    }
    $$renderer2.push(`<!--]--></tr></thead><tbody><!--[-->`);
    const each_array_4 = ensure_array_like(recentExports);
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let row = each_array_4[$$index_4];
      $$renderer2.push(`<tr class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"><td class="py-3 pr-4"><p class="font-medium text-slate-800 dark:text-white">${escape_html(row.name)}</p> <p class="text-xs text-slate-400">${escape_html(row.id)}</p></td><td class="py-3 pr-4 text-slate-500 dark:text-slate-400">${escape_html(row.date)}</td><td class="py-3 pr-4"><span${attr_class(`px-2 py-0.5 rounded-md text-xs font-bold ${stringify(row.format === "PDF" ? "bg-red-50 dark:bg-red-900/20 text-red-500" : row.format === "CSV" ? "bg-green-50 dark:bg-green-900/20 text-green-500" : "bg-purple-50 dark:bg-purple-900/20 text-purple-500")}`)}>${escape_html(row.format)}</span></td><td class="py-3 pr-4"><span${attr_class(`flex items-center gap-1.5 text-xs font-medium ${stringify(row.status === "Completed" ? "text-green-500" : "text-slate-400")}`)}><span${attr_class(`w-1.5 h-1.5 rounded-full ${stringify(row.status === "Completed" ? "bg-green-400" : "bg-slate-300")}`)}></span> ${escape_html(row.status === "Completed" ? store_get($$store_subs ??= {}, "$_", $format)("export.status.completed") : store_get($$store_subs ??= {}, "$_", $format)("export.status.archived"))}</span></td><td class="py-3"><button class="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-500 font-medium transition-colors">`);
      Download($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("export.download"))}</button></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
