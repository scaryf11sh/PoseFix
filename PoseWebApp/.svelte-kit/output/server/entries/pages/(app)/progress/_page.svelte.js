import { s as spread_props, a as store_get, d as attr, e as ensure_array_like, b as attr_class, m as clsx, u as unsubscribe_stores, c as stringify } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as $format, b as $locale } from "../../../../chunks/runtime.js";
import { formatDistanceToNow, isThisYear, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import "@tauri-apps/plugin-sql";
import { e as escape_html } from "../../../../chunks/context.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { S as Search } from "../../../../chunks/search.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { D as Download } from "../../../../chunks/download.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { D as Dumbbell } from "../../../../chunks/dumbbell.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
function Chart_no_axes_column($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M5 21v-6" }],
      ["path", { "d": "M12 21V3" }],
      ["path", { "d": "M19 21V9" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "chart-no-axes-column" },
      /**
       * @component @name ChartNoAxesColumn
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAyMXYtNiIgLz4KICA8cGF0aCBkPSJNMTIgMjFWMyIgLz4KICA8cGF0aCBkPSJNMTkgMjFWOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chart-no-axes-column
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
function Sliders_horizontal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M10 5H3" }],
      ["path", { "d": "M12 19H3" }],
      ["path", { "d": "M14 3v4" }],
      ["path", { "d": "M16 17v4" }],
      ["path", { "d": "M21 12h-9" }],
      ["path", { "d": "M21 19h-5" }],
      ["path", { "d": "M21 5h-7" }],
      ["path", { "d": "M8 10v4" }],
      ["path", { "d": "M8 12H3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "sliders-horizontal" },
      /**
       * @component @name SlidersHorizontal
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgNUgzIiAvPgogIDxwYXRoIGQ9Ik0xMiAxOUgzIiAvPgogIDxwYXRoIGQ9Ik0xNCAzdjQiIC8+CiAgPHBhdGggZD0iTTE2IDE3djQiIC8+CiAgPHBhdGggZD0iTTIxIDEyaC05IiAvPgogIDxwYXRoIGQ9Ik0yMSAxOWgtNSIgLz4KICA8cGF0aCBkPSJNMjEgNWgtNyIgLz4KICA8cGF0aCBkPSJNOCAxMHY0IiAvPgogIDxwYXRoIGQ9Ik04IDEySDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sliders-horizontal
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
function Star($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "star" },
      /**
       * @component @name Star
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuNTI1IDIuMjk1YS41My41MyAwIDAgMSAuOTUgMGwyLjMxIDQuNjc5YTIuMTIzIDIuMTIzIDAgMCAwIDEuNTk1IDEuMTZsNS4xNjYuNzU2YS41My41MyAwIDAgMSAuMjk0LjkwNGwtMy43MzYgMy42MzhhMi4xMjMgMi4xMjMgMCAwIDAtLjYxMSAxLjg3OGwuODgyIDUuMTRhLjUzLjUzIDAgMCAxLS43NzEuNTZsLTQuNjE4LTIuNDI4YTIuMTIyIDIuMTIyIDAgMCAwLTEuOTczIDBMNi4zOTYgMjEuMDFhLjUzLjUzIDAgMCAxLS43Ny0uNTZsLjg4MS01LjEzOWEyLjEyMiAyLjEyMiAwIDAgMC0uNjExLTEuODc5TDIuMTYgOS43OTVhLjUzLjUzIDAgMCAxIC4yOTQtLjkwNmw1LjE2NS0uNzU1YTIuMTIyIDIuMTIyIDAgMCAwIDEuNTk3LTEuMTZ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/star
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
function User($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
      ["circle", { "cx": "12", "cy": "7", "r": "4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "user" },
      /**
       * @component @name User
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
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
function ExerciseChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { dailyStats, mode = "count", days = 7 } = $$props;
    const W = 440;
    const H = 150;
    const PL = 30;
    const PR = 8;
    const PT = 16;
    const PB = 26;
    const cW = W - PL - PR;
    const cH = H - PT - PB;
    const color = mode === "points" ? "#f59e0b" : "#38bdf8";
    const gradId = mode === "points" ? "grad-pts" : "grad-cnt";
    function localKey(d) {
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    }
    function buildDays() {
      const statMap = new Map(dailyStats.map((s) => [s.day, s]));
      const out = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() - i);
        const key = localKey(d);
        const stat = statMap.get(key);
        const value = stat ? mode === "count" ? stat.exercise_count : stat.total_points : 0;
        const shortLabel = d.toLocaleDateString("es", { weekday: "short" }).slice(0, 2);
        out.push({
          key,
          value,
          isToday: i === 0,
          shortLabel,
          dayNum: d.getDate(),
          date: d
        });
      }
      return out;
    }
    function buildWeeks() {
      const allDays = buildDays();
      const weeks = [];
      for (let i = 0; i < allDays.length; i += 7) {
        const chunk = allDays.slice(i, i + 7);
        const total = chunk.reduce((s, d) => s + d.value, 0);
        const first = chunk[0].date;
        chunk[chunk.length - 1].date;
        const label = `${first.getDate()}/${first.getMonth() + 1}`;
        const isCurrentWeek = chunk.some((d) => d.isToday);
        weeks.push({ label, value: total, isCurrentWeek });
      }
      return weeks;
    }
    let dayData = buildDays();
    let weekData = buildWeeks();
    let hasData = dayData.some((d) => d.value > 0);
    let maxDay = Math.max(...dayData.map((d) => d.value), 1);
    let maxWeek = Math.max(...weekData.map((w) => w.value), 1);
    let avgDay = Math.round(dayData.reduce((s, d) => s + d.value, 0) / Math.max(dayData.filter((d) => d.value > 0).length, 1));
    const BAR_W7 = Math.min(36, Math.floor(cW / 7 * 0.72));
    function barProps7(i, v) {
      const gap = cW / 7;
      const x = PL + i * gap + (gap - BAR_W7) / 2;
      const h = Math.max(3, v / maxDay * cH);
      const y = PT + cH - h;
      return { x, y, h };
    }
    function linePoints14() {
      return dayData.map((d, i) => ({
        x: PL + i / (dayData.length - 1) * cW,
        y: PT + cH - d.value / maxDay * cH,
        value: d.value,
        isToday: d.isToday,
        dayNum: d.dayNum
      }));
    }
    function bezierPath(pts) {
      if (pts.length < 2) return "";
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const cpx = (pts[i - 1].x + pts[i].x) / 2;
        d += ` C ${cpx.toFixed(1)} ${pts[i - 1].y.toFixed(1)} ${cpx.toFixed(1)} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
      }
      return d;
    }
    function areaPath14(pts) {
      const base = PT + cH;
      return `${bezierPath(pts)} L ${pts[pts.length - 1].x.toFixed(1)} ${base} L ${pts[0].x.toFixed(1)} ${base} Z`;
    }
    let pts14 = linePoints14();
    let pathLine14 = bezierPath(pts14);
    let pathArea14 = areaPath14(pts14);
    const avgY14 = PT + cH - avgDay / maxDay * cH;
    const WEEK_COUNT = weekData.length;
    const BAR_W30 = Math.min(52, Math.floor(cW / WEEK_COUNT * 0.65));
    function weekBarProps(i, v) {
      const gap = cW / WEEK_COUNT;
      const x = PL + i * gap + (gap - BAR_W30) / 2;
      const h = Math.max(3, v / maxWeek * cH);
      const y = PT + cH - h;
      return { x, y, h };
    }
    function yTicks(max) {
      const step = max <= 5 ? 1 : max <= 20 ? 5 : max <= 50 ? 10 : 25;
      const ticks = [];
      for (let v = 0; v <= max; v += step) ticks.push(v);
      if (ticks[ticks.length - 1] < max) ticks.push(max);
      return ticks.filter((v, i, a) => i === 0 || i === a.length - 1 || v % step === 0).slice(0, 5);
    }
    $$renderer2.push(`<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="grad-cnt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"></stop><stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.6"></stop></linearGradient><linearGradient id="grad-pts" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"></stop><stop offset="100%" stop-color="#d97706" stop-opacity="0.6"></stop></linearGradient><linearGradient id="area-cnt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.01"></stop></linearGradient><linearGradient id="area-pts" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.01"></stop></linearGradient></defs></svg> <div class="w-full">`);
    if (!hasData) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-36 text-slate-300 dark:text-slate-600 text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.noData"))}</div>`);
    } else if (days === 7) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<svg${attr("viewBox", `0 0 ${stringify(W)} ${stringify(H)}`)} class="w-full" style="height:160px" aria-hidden="true"><!--[-->`);
      const each_array = ensure_array_like(yTicks(maxDay));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tick = each_array[$$index];
        const ty = PT + cH - tick / maxDay * cH;
        $$renderer2.push(`<line${attr("x1", PL)}${attr("y1", ty)}${attr("x2", W - PR)}${attr("y2", ty)} stroke="currentColor" stroke-width="0.5" opacity="0.08" class="text-slate-500"></line><text${attr("x", PL - 4)}${attr("y", ty + 3)} text-anchor="end" font-size="8" class="fill-slate-400 dark:fill-slate-500">${escape_html(tick)}</text>`);
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_1 = ensure_array_like(dayData);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let d = each_array_1[i];
        const { x, y, h } = barProps7(i, d.value);
        $$renderer2.push(`<rect${attr("x", x)}${attr("y", PT)}${attr("width", BAR_W7)}${attr("height", cH)} rx="5" class="fill-slate-100 dark:fill-slate-800" opacity="0.5"></rect>`);
        if (d.value > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<rect${attr("x", x)}${attr("y", y)}${attr("width", BAR_W7)}${attr("height", h)} rx="5"${attr("fill", `url(#${stringify(gradId)})`)}${attr("opacity", d.isToday ? 1 : 0.8)}></rect>`);
          if (d.isToday) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<rect${attr("x", x)}${attr("y", y)}${attr("width", BAR_W7)} height="3" rx="1.5"${attr("fill", color)}></rect>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--><text${attr("x", x + BAR_W7 / 2)}${attr("y", y - 4)} text-anchor="middle" font-size="9" font-weight="700"${attr("fill", color)}>${escape_html(d.value)}</text>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><text${attr("x", x + BAR_W7 / 2)}${attr("y", H - 6)} text-anchor="middle" font-size="9"${attr_class(clsx(d.isToday ? "font-bold" : "fill-slate-400 dark:fill-slate-500"))}${attr("fill", d.isToday ? color : void 0)}>${escape_html(d.shortLabel)}</text>`);
      }
      $$renderer2.push(`<!--]--></svg>`);
    } else if (days === 14) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<svg${attr("viewBox", `0 0 ${stringify(W)} ${stringify(H)}`)} class="w-full" style="height:160px" aria-hidden="true"><!--[-->`);
      const each_array_2 = ensure_array_like(yTicks(maxDay));
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let tick = each_array_2[$$index_2];
        const ty = PT + cH - tick / maxDay * cH;
        $$renderer2.push(`<line${attr("x1", PL)}${attr("y1", ty)}${attr("x2", W - PR)}${attr("y2", ty)} stroke="currentColor" stroke-width="0.5" opacity="0.08" class="text-slate-500"></line><text${attr("x", PL - 4)}${attr("y", ty + 3)} text-anchor="end" font-size="8" class="fill-slate-400 dark:fill-slate-500">${escape_html(tick)}</text>`);
      }
      $$renderer2.push(`<!--]--><path${attr("d", pathArea14)}${attr("fill", `url(#${stringify(mode === "points" ? "area-pts" : "area-cnt")})`)}></path>`);
      if (avgDay > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<line${attr("x1", PL)}${attr("y1", avgY14)}${attr("x2", W - PR)}${attr("y2", avgY14)}${attr("stroke", color)} stroke-width="1" stroke-dasharray="4,3" opacity="0.35"></line>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--><path${attr("d", pathLine14)} fill="none"${attr("stroke", color)} stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path><!--[-->`);
      const each_array_3 = ensure_array_like(pts14);
      for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
        let pt = each_array_3[i];
        if (pt.value > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<circle${attr("cx", pt.x)}${attr("cy", pt.y)}${attr("r", pt.isToday ? 5 : 3.5)}${attr("fill", pt.isToday ? color : "white")}${attr("stroke", color)}${attr("stroke-width", pt.isToday ? 0 : 2)}></circle>`);
          if (pt.isToday || pt.value === maxDay) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<text${attr("x", pt.x)}${attr("y", pt.y - 8)} text-anchor="middle" font-size="9" font-weight="700"${attr("fill", color)}>${escape_html(pt.value)}</text>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<circle${attr("cx", pt.x)}${attr("cy", pt.y)} r="2" class="fill-slate-200 dark:fill-slate-700" stroke="none"></circle>`);
        }
        $$renderer2.push(`<!--]-->`);
        if (i % 2 === 0 || pt.isToday) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<text${attr("x", pt.x)}${attr("y", H - 6)} text-anchor="middle" font-size="8.5"${attr("fill", pt.isToday ? color : void 0)}${attr_class(clsx(pt.isToday ? "font-semibold" : "fill-slate-400 dark:fill-slate-500"))}>${escape_html(pt.dayNum)}</text>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></svg>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<svg${attr("viewBox", `0 0 ${stringify(W)} ${stringify(H)}`)} class="w-full" style="height:160px" aria-hidden="true"><!--[-->`);
      const each_array_4 = ensure_array_like(yTicks(maxWeek));
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let tick = each_array_4[$$index_4];
        const ty = PT + cH - tick / maxWeek * cH;
        $$renderer2.push(`<line${attr("x1", PL)}${attr("y1", ty)}${attr("x2", W - PR)}${attr("y2", ty)} stroke="currentColor" stroke-width="0.5" opacity="0.08" class="text-slate-500"></line><text${attr("x", PL - 4)}${attr("y", ty + 3)} text-anchor="end" font-size="8" class="fill-slate-400 dark:fill-slate-500">${escape_html(tick)}</text>`);
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_5 = ensure_array_like(weekData);
      for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
        let wk = each_array_5[i];
        const { x, y, h } = weekBarProps(i, wk.value);
        $$renderer2.push(`<rect${attr("x", x)}${attr("y", PT)}${attr("width", BAR_W30)}${attr("height", cH)} rx="6" class="fill-slate-100 dark:fill-slate-800" opacity="0.5"></rect>`);
        if (wk.value > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<rect${attr("x", x)}${attr("y", y)}${attr("width", BAR_W30)}${attr("height", h)} rx="6"${attr("fill", `url(#${stringify(gradId)})`)}${attr("opacity", wk.isCurrentWeek ? 1 : 0.7)}></rect>`);
          if (wk.isCurrentWeek) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<rect${attr("x", x)}${attr("y", y)}${attr("width", BAR_W30)} height="3" rx="1.5"${attr("fill", color)}></rect>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--><text${attr("x", x + BAR_W30 / 2)}${attr("y", y - 5)} text-anchor="middle" font-size="10" font-weight="700"${attr("fill", color)}>${escape_html(wk.value)}</text>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><text${attr("x", x + BAR_W30 / 2)}${attr("y", H - 6)} text-anchor="middle" font-size="9"${attr("fill", wk.isCurrentWeek ? color : void 0)}${attr_class(clsx(wk.isCurrentWeek ? "font-semibold" : "fill-slate-400 dark:fill-slate-500"))}>${escape_html(wk.label)}</text>`);
      }
      $$renderer2.push(`<!--]--></svg>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let exerciseTotals = { total_exercises: 0, total_points: 0, best_day_points: 0 };
    let exerciseDailyStats = [];
    let recentExerciseLogs = [];
    let exerciseChartDays = 7;
    let exerciseChartMode = "count";
    let totalSessionsCount = 0;
    let totalDuration = 0;
    let totalWarningsCount = 0;
    let search = "";
    let dateRange = "Last 30 Days";
    let page = 1;
    const perPage = 5;
    let totalCount = 0;
    let totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    function dfnsLocale() {
      return store_get($$store_subs ??= {}, "$locale", $locale)?.startsWith("es") ? es : enUS;
    }
    function timeAgo(dateStr) {
      if (!dateStr) return "—";
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffDays = diffMs / 864e5;
      if (diffDays < 7) {
        return formatDistanceToNow(d, { addSuffix: true, locale: dfnsLocale() });
      }
      const fmt = isThisYear(d) ? dfnsLocale() === es ? "d MMM" : "MMM d" : dfnsLocale() === es ? "d MMM yyyy" : "MMM d, yyyy";
      return format(d, fmt, { locale: dfnsLocale() });
    }
    function formatTotalTime(seconds) {
      const h = Math.floor(seconds / 3600);
      return `${h}h`;
    }
    function visiblePages() {
      const pages = [];
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      pages.push(1, 2, 3);
      pages.push("...", totalPages);
      return pages;
    }
    const statCards = [
      {
        label: store_get($$store_subs ??= {}, "$_", $format)("reports.stats.totalSessions"),
        value: String(totalSessionsCount),
        unit: "",
        badge: "",
        badgeColor: "text-sky-400 bg-sky-400/10",
        icon: Clock,
        iconColor: "text-sky-400 bg-sky-400/10"
      },
      {
        label: store_get($$store_subs ??= {}, "$_", $format)("reports.stats.avgScore"),
        value: "—",
        unit: "",
        badge: "",
        badgeColor: "",
        icon: User,
        iconColor: "text-purple-400 bg-purple-400/10"
      },
      {
        label: store_get($$store_subs ??= {}, "$_", $format)("reports.stats.totalTime"),
        value: formatTotalTime(totalDuration),
        unit: "",
        badge: "",
        badgeColor: "",
        icon: Chart_no_axes_column,
        iconColor: "text-sky-400 bg-sky-400/10"
      },
      {
        label: store_get($$store_subs ??= {}, "$_", $format)("reports.stats.totalAlerts"),
        value: String(totalWarningsCount),
        unit: "",
        badge: "",
        badgeColor: "text-red-400 bg-red-400/10",
        icon: Triangle_alert,
        iconColor: "text-orange-400 bg-orange-400/10"
      }
    ];
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("reports.title"))}</h1> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><!--[-->`);
    const each_array = ensure_array_like(statCards);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let stat = each_array[$$index];
      $$renderer2.push(`<div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"><div class="flex items-start justify-between mb-4"><div${attr_class(`w-10 h-10 rounded-xl ${stringify(stat.iconColor)} flex items-center justify-center`)}>`);
      $$renderer2.push("<!---->");
      stat.icon?.($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></div> `);
      if (stat.badge) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span${attr_class(`text-xs font-semibold px-2 py-0.5 rounded-full ${stringify(stat.badgeColor)}`)}>${escape_html(stat.badge)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <p class="text-xs text-slate-400 mb-1">${escape_html(stat.label)}</p> <p class="text-3xl font-bold text-slate-800 dark:text-white">${escape_html(stat.value)}<span class="text-lg font-normal text-slate-400">${escape_html(stat.unit)}</span></p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"><div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800"><div class="relative flex-1 min-w-[180px]">`);
    Search($$renderer2, {
      class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
    });
    $$renderer2.push(`<!----> <input type="text"${attr("placeholder", store_get($$store_subs ??= {}, "$_", $format)("reports.search"))}${attr("value", search)} class="pl-9 pr-4 py-2 w-full rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"/></div> <div class="relative"><button class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-400 transition-all">`);
    Calendar($$renderer2, { class: "w-4 h-4 text-sky-400" });
    $$renderer2.push(`<!----> ${escape_html(dateRange)} `);
    Chevron_right($$renderer2, { class: "w-3.5 h-3.5 text-slate-400 rotate-90" });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-400 transition-all">`);
    Sliders_horizontal($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("common.filter"))}</button> <div class="ml-auto"><button class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white transition-all shadow-sm active:scale-95">`);
    Download($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("common.export"))}</button></div></div> <div class="overflow-x-auto">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-12 text-slate-400"><p class="text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("common.loading"))}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800"><p class="text-sm text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("reports.showing", {
      values: {
        from: Math.min((page - 1) * perPage + 1, totalCount),
        to: Math.min(page * perPage, totalCount),
        total: totalCount
      }
    }))}</p> <div class="flex items-center gap-1"><button${attr("disabled", page === 1, true)} class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">`);
    Chevron_left($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <!--[-->`);
    const each_array_4 = ensure_array_like(visiblePages());
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let p = each_array_4[$$index_4];
      if (p === "...") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">...</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attr_class(`w-8 h-8 rounded-lg text-sm font-medium transition-all ${stringify(page === p ? "bg-sky-400 text-white shadow-lg shadow-sky-400/30" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")}`)}>${escape_html(p)}</button>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <button${attr("disabled", page === totalPages, true)} class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">`);
    Chevron_right($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button></div></div></div> <div class="mt-8"><div class="flex items-center gap-2 mb-4">`);
    Dumbbell($$renderer2, { class: "w-5 h-5 text-sky-400" });
    $$renderer2.push(`<!----> <h2 class="text-xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.title"))}</h2></div> <div class="grid grid-cols-3 gap-4 mb-6"><div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center">`);
    Dumbbell($$renderer2, { class: "w-4 h-4 text-sky-400" });
    $$renderer2.push(`<!----></div></div> <p class="text-xs text-slate-400 mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.stats.totalExercises"))}</p> <p class="text-2xl font-bold text-slate-800 dark:text-white">${escape_html(exerciseTotals.total_exercises)}</p></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">`);
    Star($$renderer2, { class: "w-4 h-4 text-amber-400" });
    $$renderer2.push(`<!----></div></div> <p class="text-xs text-slate-400 mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.stats.totalPoints"))}</p> <p class="text-2xl font-bold text-slate-800 dark:text-white">${escape_html(exerciseTotals.total_points)}</p></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-4"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center">`);
    Trophy($$renderer2, { class: "w-4 h-4 text-emerald-400" });
    $$renderer2.push(`<!----></div></div> <p class="text-xs text-slate-400 mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.stats.bestDay"))}</p> <p class="text-2xl font-bold text-slate-800 dark:text-white">${escape_html(exerciseTotals.best_day_points)}</p></div></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-6"><div class="flex items-center justify-between mb-4 flex-wrap gap-3"><div class="flex items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800 p-1"><!--[-->`);
    const each_array_5 = ensure_array_like([7, 14, 30]);
    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
      let d = each_array_5[$$index_5];
      $$renderer2.push(`<button${attr_class(`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${stringify(exerciseChartDays === d ? "bg-sky-400 text-white shadow-sm shadow-sky-400/30" : "text-slate-500 dark:text-slate-400 hover:text-sky-400")}`)}>${escape_html(d === 7 ? store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.days7") : d === 14 ? store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.days14") : store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.days30"))}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800 p-1"><button${attr_class(`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${stringify(
      "bg-sky-400 text-white shadow-sm shadow-sky-400/30"
    )}`)}>${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.toggleCount"))}</button> <button${attr_class(`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${stringify("text-slate-500 dark:text-slate-400 hover:text-sky-400")}`)}>${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.chart.togglePoints"))}</button></div></div> `);
    ExerciseChart($$renderer2, {
      dailyStats: exerciseDailyStats,
      mode: exerciseChartMode,
      days: exerciseChartDays
    });
    $$renderer2.push(`<!----></div> <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800"><h3 class="font-semibold text-slate-800 dark:text-white text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.stats.recentActivity"))}</h3></div> `);
    if (recentExerciseLogs.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-10 text-slate-400">`);
      Dumbbell($$renderer2, { class: "w-8 h-8 mb-2 opacity-40" });
      $$renderer2.push(`<!----> <p class="text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.stats.noActivity"))}</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<ul class="divide-y divide-slate-50 dark:divide-slate-800/60"><!--[-->`);
      const each_array_6 = ensure_array_like(recentExerciseLogs);
      for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
        let log = each_array_6[$$index_6];
        $$renderer2.push(`<li class="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center flex-shrink-0">`);
        Dumbbell($$renderer2, { class: "w-4 h-4 text-sky-400" });
        $$renderer2.push(`<!----></div> <div><p class="text-sm font-semibold text-slate-800 dark:text-white">${escape_html(log.exercise)}</p> <p class="text-xs text-slate-400 mt-0.5">${escape_html(timeAgo(log.completed_at))} `);
        if (log.category) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`· ${escape_html(log.category)}`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></p></div></div> <span class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold">`);
        Trophy($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----> ${escape_html(log.points)} ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.stats.pointsEarned"))}</span></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
