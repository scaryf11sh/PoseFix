import { s as spread_props, a as store_get, e as ensure_array_like, d as attr, b as attr_class, c as stringify, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/ticks.js";
import "@layerstack/utils";
import "@layerstack/tailwind";
import "@layerstack/utils/env";
import "@layerstack/utils/object";
import "@layerstack/utils/serialize";
import "@layerstack/utils/rollup";
import "d3-interpolate-path";
import "@dagrejs/dagre";
import "d3-tile";
import "d3-sankey";
import { a as $format } from "../../../../chunks/runtime.js";
import "@tauri-apps/plugin-sql";
import "../../../../chunks/user.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { e as escape_html } from "../../../../chunks/context.js";
function Circle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["circle", { "cx": "12", "cy": "12", "r": "10" }]];
    Icon($$renderer2, spread_props([
      { name: "circle" },
      /**
       * @component @name Circle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle
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
function Power($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 2v10" }],
      ["path", { "d": "M18.4 6.6a9 9 0 1 1-12.77.04" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "power" },
      /**
       * @component @name Power
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMnYxMCIgLz4KICA8cGF0aCBkPSJNMTguNCA2LjZhOSA5IDAgMSAxLTEyLjc3LjA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/power
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
function Refresh_cw($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
      ],
      ["path", { "d": "M21 3v5h-5" }],
      [
        "path",
        { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
      ],
      ["path", { "d": "M8 16H3v5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "refresh-cw" },
      /**
       * @component @name RefreshCw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
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
function Video_off($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"
        }
      ],
      [
        "path",
        {
          "d": "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"
        }
      ],
      ["path", { "d": "m2 2 20 20" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "video-off" },
      /**
       * @component @name VideoOff
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuNjYgNkgxNGEyIDIgMCAwIDEgMiAydjIuNWw1LjI0OC0zLjA2MkEuNS41IDAgMCAxIDIyIDcuODd2OC4xOTYiIC8+CiAgPHBhdGggZD0iTTE2IDE2YTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmgyIiAvPgogIDxwYXRoIGQ9Im0yIDIgMjAgMjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/video-off
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
function Wifi_off($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 20h.01" }],
      ["path", { "d": "M8.5 16.429a5 5 0 0 1 7 0" }],
      ["path", { "d": "M5 12.859a10 10 0 0 1 5.17-2.69" }],
      ["path", { "d": "M19 12.859a10 10 0 0 0-2.007-1.523" }],
      ["path", { "d": "M2 8.82a15 15 0 0 1 4.177-2.643" }],
      ["path", { "d": "M22 8.82a15 15 0 0 0-11.288-3.764" }],
      ["path", { "d": "m2 2 20 20" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "wifi-off" },
      /**
       * @component @name WifiOff
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjBoLjAxIiAvPgogIDxwYXRoIGQ9Ik04LjUgMTYuNDI5YTUgNSAwIDAgMSA3IDAiIC8+CiAgPHBhdGggZD0iTTUgMTIuODU5YTEwIDEwIDAgMCAxIDUuMTctMi42OSIgLz4KICA8cGF0aCBkPSJNMTkgMTIuODU5YTEwIDEwIDAgMCAwLTIuMDA3LTEuNTIzIiAvPgogIDxwYXRoIGQ9Ik0yIDguODJhMTUgMTUgMCAwIDEgNC4xNzctMi42NDMiIC8+CiAgPHBhdGggZD0iTTIyIDguODJhMTUgMTUgMCAwIDAtMTEuMjg4LTMuNzY0IiAvPgogIDxwYXRoIGQ9Im0yIDIgMjAgMjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/wifi-off
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
    let latency = 0.04;
    let realCameras = [];
    let disabledCameraIds = /* @__PURE__ */ new Set();
    let enabledCameras = realCameras.filter((c) => !disabledCameraIds.has(c.deviceId));
    let viewMode = "single";
    let currentCamIndex = 0;
    let currentCam = enabledCameras[currentCamIndex] ?? null;
    let activeCams = enabledCameras.length;
    let sensors = [];
    function sensorStatusLabel(s) {
      if (s === "streaming") return "STREAMING";
      if (s === "paired") return "PAIRED";
      if (s === "handshake") return "HANDSHAKE";
      if (s === "connecting") return "CONNECTING";
      if (s === "failed") return "FAILED";
      return "DISCONNECTED";
    }
    function statusStyle(s) {
      if (s === "streaming") return "text-green-400 border-green-400/30 bg-green-400/10";
      if (s === "paired") return "text-sky-400 border-sky-400/30 bg-sky-400/10";
      if (s === "handshake" || s === "connecting") return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      if (s === "failed") return "text-red-400 border-red-400/30 bg-red-400/10";
      return "text-slate-400 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700";
    }
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-hidden bg-bright-snow-50 dark:bg-prussian-blue-900"><div class="flex items-center justify-between mb-5"><div><h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.title"))} <span class="text-sky-400">v2.4</span></h1> <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.subtitle"))}</p></div> <div class="hidden md:flex items-center gap-3 text-xs font-mono text-slate-400"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.latency", { values: { ms: latency } }))}</span> <span class="text-slate-600 dark:text-slate-600">•</span> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="flex items-center gap-1.5 text-slate-500">`);
      Wifi_off($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.dbFallback"))}</span>`);
    }
    $$renderer2.push(`<!--]--> <span class="text-slate-600 dark:text-slate-600">•</span> <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.neuralActive"))}</span></div></div> <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4"><div class="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span> <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.cameraMonitor"))}</h2> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.landmarksOffline"))}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5"><!--[-->`);
    const each_array = ensure_array_like([
      [
        "single",
        store_get($$store_subs ??= {}, "$_", $format)("monitor.singleView")
      ],
      ["2x2", "2×2"],
      ["3x3", "3×3"]
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [mode, label] = each_array[$$index];
      const disabled = activeCams <= 1 && mode !== "single" || activeCams <= 4 && mode === "3x3" || activeCams <= 2 && mode === "2x2";
      $$renderer2.push(`<button${attr("disabled", disabled, true)}${attr_class(`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${stringify(viewMode === mode ? "bg-sky-400 text-white shadow" : disabled ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")}`)}>${escape_html(label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="rounded-xl overflow-hidden bg-slate-900 dark:bg-slate-950 relative flex-1 min-h-[200px] transition-all duration-300">`);
    if (activeCams === 0) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">`);
      Video_off($$renderer2, { class: "w-8 h-8" });
      $$renderer2.push(`<!----> <p class="text-xs">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.noCamerasFound"))}</p> <button class="mt-2 flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300">`);
      Refresh_cw($$renderer2, { class: "w-3.5 h-3.5" });
      $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.refreshCameras"))}</button></div>`);
    } else {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center">`);
      if (currentCam) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="relative w-full h-full"><video autoplay="" playsinline="" muted="" class="w-full h-full object-cover"></video> <canvas class="absolute inset-0 w-full h-full pointer-events-none"></canvas></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full z-10"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> <span class="text-[9px] text-white font-bold uppercase tracking-wider">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.live"))} • ${escape_html(currentCam?.label || currentCam?.deviceId.slice(0, 8) || "—")}</span></div> `);
      if (activeCams > 1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="absolute top-1/2 left-2 -translate-y-1/2 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full cursor-pointer z-10">`);
        Chevron_left($$renderer2, { class: "w-6 h-6 text-white" });
        $$renderer2.push(`<!----></button> <button class="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full cursor-pointer z-10">`);
        Chevron_right($$renderer2, { class: "w-6 h-6 text-white" });
        $$renderer2.push(`<!----></button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="lg:col-span-2 flex flex-col gap-4"><div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"><div class="flex items-center gap-2 mb-4"><span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span> <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.cameraSignals"))}</h2></div> <div class="space-y-2 mb-4">`);
    if (realCameras.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-slate-400 text-center py-3">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.noCamerasFound"))}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_2 = ensure_array_like(realCameras);
      for (let idx = 0, $$length = each_array_2.length; idx < $$length; idx++) {
        let cam = each_array_2[idx];
        const isEnabled = !disabledCameraIds.has(cam.deviceId);
        $$renderer2.push(`<div${attr_class(`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${stringify(isEnabled ? "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700" : "bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 opacity-60")}`)}><div class="flex items-center gap-2.5"><span${attr_class(`w-2 h-2 rounded-full ${stringify(isEnabled ? "bg-sky-400" : "bg-slate-400")}`)}></span> <div><p class="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">${escape_html(cam.label || `Camera ${idx + 1}`)}</p> <p class="text-[10px] text-slate-400 font-mono">CAM-${escape_html(String(idx + 1).padStart(3, "0"))}</p></div></div> <button${attr("title", isEnabled ? "Deshabilitar cámara" : "Habilitar cámara")}${attr_class(`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer ${stringify(isEnabled ? "bg-sky-400/10 text-sky-400 border-sky-400/20 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20" : "bg-slate-200 dark:bg-slate-700 text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/20")}`)}>`);
        Power($$renderer2, { class: "w-2.5 h-2.5" });
        $$renderer2.push(`<!----> ${escape_html(isEnabled ? store_get($$store_subs ??= {}, "$_", $format)("monitor.live") : "OFF")}</button></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <button class="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-all">`);
    Refresh_cw($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.refreshCameras"))}</button></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex-1"><div class="flex items-center gap-2 mb-5"><span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span> <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.aiMetrics"))}</h2></div> <div class="grid grid-cols-3 gap-4"><div class="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"><div class="w-16 h-16 rounded-full border-2 border-sky-400/30 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="4" r="2"></circle><path d="M12 7v6l-3 4m3-4 3 4"></path><path d="M9 11H7m10 0h-2"></path></svg></div> <div class="text-center w-full"><p class="text-xs text-slate-400 uppercase tracking-wider mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.postureDetection"))}</p> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-sm text-slate-400 italic">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.noData"))}</p>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"><p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.eyeHealth"))}</p> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-slate-400 italic text-center py-3">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.noData"))}</p>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between"><p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.fatigue"))}</p> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-slate-400 italic text-center py-3">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.noData"))}</p>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span> <h2 class="text-xs font-bold uppercase tracking-widest text-sky-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.telemetry"))}</h2></div> <div class="flex items-center gap-3 text-xs text-slate-400"><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.environmental"))}</span> <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-sky-400"></span> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.kinetic"))}</span></div></div> `);
    if (sensors.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-slate-400 text-center py-6">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("monitor.noSensors"))}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-slate-100 dark:border-slate-800"><!--[-->`);
      const each_array_3 = ensure_array_like([
        store_get($$store_subs ??= {}, "$_", $format)("monitor.sensorNode"),
        store_get($$store_subs ??= {}, "$_", $format)("monitor.status"),
        "IP / PORT",
        "FIRMWARE",
        "SIGNAL",
        store_get($$store_subs ??= {}, "$_", $format)("monitor.dataStream"),
        ""
      ]);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let col = each_array_3[$$index_3];
        $$renderer2.push(`<th class="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4 first:pr-8">${escape_html(col)}</th>`);
      }
      $$renderer2.push(`<!--]--></tr></thead><tbody><!--[-->`);
      const each_array_4 = ensure_array_like(sensors);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let s = each_array_4[$$index_4];
        $$renderer2.push(`<tr${attr_class(`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${stringify(s.enabled ? "" : "opacity-40")}`)}><td class="py-3.5 pr-8"><div class="flex items-center gap-2.5"><div class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sky-400">`);
        Circle($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----></div> <div><p class="text-sm font-semibold text-slate-800 dark:text-white">${escape_html(s.label)}</p> <p class="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">${escape_html(s.deviceId !== "—" ? s.deviceId : s.id)}</p></div></div></td><td class="py-3.5 pr-4"><span${attr_class(`text-xs font-bold px-2.5 py-1 rounded-md border ${stringify(statusStyle(s.status))}`)}>${escape_html(sensorStatusLabel(s.status))}</span></td><td class="py-3.5 pr-4"><p class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">HOST</p> <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">${escape_html(s.ip)}:${escape_html(s.port)}</p></td><td class="py-3.5 pr-4"><p class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">FW</p> <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">${escape_html(s.firmware)}</p></td><td class="py-3.5 pr-4"><p class="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">RSSI</p> <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">${escape_html(s.signal > 0 ? `${s.signal}%` : "—")}</p></td><td class="py-3.5"><div class="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">`);
        if (s.enabled && s.status === "streaming") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="h-full rounded-full bg-sky-400 animate-pulse" style="width: 65%"></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="py-3.5 pl-2"><button${attr("title", s.enabled ? "Deshabilitar sensor" : "Habilitar sensor")}${attr_class(`p-1.5 rounded-lg border transition-colors cursor-pointer ${stringify(s.enabled ? "text-sky-400 border-sky-400/20 bg-sky-400/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20" : "text-slate-400 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/20")}`)}>`);
        Power($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></button></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
