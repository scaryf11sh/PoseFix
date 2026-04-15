import { s as spread_props, a as store_get, e as ensure_array_like, b as attr_class, u as unsubscribe_stores, c as stringify, d as attr } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { b as $locale, a as $format } from "../../../../chunks/runtime.js";
import { V as Video } from "../../../../chunks/video.js";
import { e as escape_html } from "../../../../chunks/context.js";
import { w as writable } from "../../../../chunks/index.js";
import { S as Search } from "../../../../chunks/search.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { X } from "../../../../chunks/x.js";
function Chevron_down($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
    Icon($$renderer2, spread_props([
      { name: "chevron-down" },
      /**
       * @component @name ChevronDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
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
function Loader_circle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
    Icon($$renderer2, spread_props([
      { name: "loader-circle" },
      /**
       * @component @name LoaderCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
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
const TAG_TO_FILTER_AREA = {
  Core: "Core",
  "Abdominal Muscle": "Core",
  "Digestive Organs": "Core",
  "Reproductive Organs": "Core",
  Back: "Back",
  Spine: "Back",
  "Lower Back": "Back",
  Neck: "Neck",
  Shoulders: "Shoulders",
  Arms: "Shoulders",
  "Upper Body": "Shoulders",
  Elbow: "Shoulders",
  Wrists: "Shoulders",
  "Carpel Tunnel Syndrome": "Shoulders",
  Chest: "Chest",
  "Respiratory Muscles": "Chest",
  Hip: "Hips",
  Hips: "Hips",
  Groins: "Hips",
  "Pelvic Muscle": "Hips",
  Legs: "Legs",
  Hamstrings: "Legs",
  Quadriceps: "Legs",
  Thighs: "Legs",
  Calves: "Legs",
  Glutes: "Legs",
  Knees: "Legs",
  Ankle: "Legs",
  "Lower Body": "Legs",
  "Entire Body": "Full Body",
  "Each part of body at cellular level": "Full Body",
  "Full Body": "Full Body"
};
function ExerciseCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      title,
      titleEs,
      duration,
      tags,
      tagsEs,
      recommended = false,
      recommendedLabel = "",
      hasVideo = false,
      difficulty,
      onTagClick
    } = $$props;
    const isEs = store_get($$store_subs ??= {}, "$locale", $locale)?.startsWith("es") ?? false;
    const displayTitle = isEs && titleEs ? titleEs : title;
    function getDisplayTag(i) {
      if (isEs && tagsEs?.[i]) return tagsEs[i];
      return tags[i] ?? "";
    }
    const DIFF_COLOURS = {
      beginner: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
      intermediate: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
      advanced: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
    };
    $$renderer2.push(`<div class="group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"><div class="relative h-44 overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-700 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 dark:bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${escape_html(duration)}</div> `);
    if (recommended) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-full border border-white/10"><div class="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg></div> <span class="font-medium leading-none text-[10px]">${escape_html(recommendedLabel)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="mx-2 mb-2 mt-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 pt-2.5 pb-3 flex flex-col gap-2"><div class="flex flex-wrap items-center gap-1.5"><!--[-->`);
    const each_array = ensure_array_like(tags);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<button type="button"${attr_class(`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 ${stringify(onTagClick ? "hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 transition-colors cursor-pointer" : "cursor-default")}`)}>${escape_html(getDisplayTag(i))}</button>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (difficulty) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span${attr_class(`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${stringify(DIFF_COLOURS[difficulty] ?? "")}`)}>${escape_html(store_get($$store_subs ??= {}, "$_", $format)(`exercises.difficulty.${difficulty}`))}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (hasVideo) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex-shrink-0">`);
      Video($$renderer2, { class: "w-2.5 h-2.5" });
      $$renderer2.push(`<!----> video</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <h3 class="text-sm font-bold text-slate-800 dark:text-white leading-tight line-clamp-2">${escape_html(displayTitle)}</h3> <button class="w-full py-2 rounded-xl bg-green-400 hover:bg-green-500 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-green-400/20 hover:shadow-green-400/40 active:scale-95"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.start"))}</button></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const allExercises = writable([]);
const exercisesLoading = writable(false);
const exercisesLoaded = writable(false);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const AREAS = [
      { key: "All", labelKey: "exercises.areas.all" },
      { key: "Neck", labelKey: "exercises.areas.neck" },
      { key: "Back", labelKey: "exercises.areas.back" },
      { key: "Shoulders", labelKey: "exercises.areas.shoulders" },
      { key: "Core", labelKey: "exercises.areas.core" },
      { key: "Hips", labelKey: "exercises.areas.hips" },
      { key: "Legs", labelKey: "exercises.areas.legs" },
      { key: "Chest", labelKey: "exercises.areas.chest" },
      { key: "Full Body", labelKey: "exercises.areas.fullBody" }
    ];
    let searchQuery = "";
    let selectedArea = "All";
    let selectedDiff = "All";
    let selectedCat = "All";
    let visibleCount = 9;
    const CAT_LABEL_KEY = {
      posture: "exercises.categories.posture",
      yoga: "exercises.categories.yoga",
      "Core Strength": "exercises.categories.corestrength",
      "Hip-Opening": "exercises.categories.hipopening",
      Backbend: "exercises.categories.backbend",
      "Forward Bend": "exercises.categories.forwardbend",
      Inversions: "exercises.categories.inversions",
      Seated: "exercises.categories.seated",
      Restorative: "exercises.categories.restorative",
      Standing: "exercises.categories.standing",
      Balancing: "exercises.categories.balancing",
      Twists: "exercises.categories.twists",
      // ExerciseDB categories
      strength: "exercises.categories.strength",
      cardio: "exercises.categories.cardio",
      stretching: "exercises.categories.stretching",
      plyometrics: "exercises.categories.plyometrics",
      powerlifting: "exercises.categories.powerlifting",
      olympic: "exercises.categories.olympic"
    };
    let categoryKeys = store_get($$store_subs ??= {}, "$allExercises", allExercises).length > 0 ? Array.from(new Set(store_get($$store_subs ??= {}, "$allExercises", allExercises).map((e) => e.category))).sort() : [];
    let filtered = store_get($$store_subs ??= {}, "$allExercises", allExercises).filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = e.title.toLowerCase().includes(q) || (e.titleEs ?? "").toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)) || (e.tagsEs ?? []).some((t) => t.toLowerCase().includes(q));
      const matchArea = selectedArea === "All" || e.area.includes(selectedArea);
      const matchDiff = selectedDiff === "All";
      const matchCat = selectedCat === "All" || e.category === selectedCat;
      const matchVideo = true;
      return matchSearch && matchArea && matchDiff && matchCat && matchVideo;
    });
    let visible = filtered.slice(0, visibleCount);
    let hasMore = filtered.length > visibleCount;
    let activeFilterCount = (selectedArea !== "All" ? 1 : 0) + 0 + (selectedCat !== "All" ? 1 : 0) + 0;
    function handleTagClick(tag) {
      const area = TAG_TO_FILTER_AREA[tag];
      if (area) {
        selectedArea = area;
        visibleCount = 9;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (categoryKeys.includes(tag)) {
        selectedCat = tag;
        visibleCount = 9;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      searchQuery = tag;
      visibleCount = 9;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><div class="flex items-start justify-between mb-5 gap-4 flex-wrap"><div><h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.title"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.subtitle"))} `);
    if (store_get($$store_subs ??= {}, "$exercisesLoaded", exercisesLoaded)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="ml-1 text-sky-400">· ${escape_html(store_get($$store_subs ??= {}, "$allExercises", allExercises).length)} ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.total"))}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></p></div> <div class="flex items-center gap-2"><div class="relative">`);
    Search($$renderer2, {
      class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
    });
    $$renderer2.push(`<!----> <input type="text"${attr("placeholder", store_get($$store_subs ??= {}, "$_", $format)("exercises.search"))}${attr("value", searchQuery)} class="pl-9 pr-4 py-2 rounded-xl text-sm w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all"/></div></div></div> <div class="space-y-2 mb-6"><div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none"><!--[-->`);
    const each_array = ensure_array_like(AREAS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let a = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${stringify(selectedArea === a.key ? "bg-sky-400 text-white shadow-md shadow-sky-400/30" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-500")}`)}>${escape_html(store_get($$store_subs ??= {}, "$_", $format)(a.labelKey))}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2 flex-wrap">`);
    if (categoryKeys.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative"><button${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${stringify(selectedCat !== "All" ? "bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/25" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-500")}`)}>${escape_html(selectedCat === "All" ? store_get($$store_subs ??= {}, "$_", $format)("exercises.filterCategory") : CAT_LABEL_KEY[selectedCat] ? store_get($$store_subs ??= {}, "$_", $format)(CAT_LABEL_KEY[selectedCat]) : selectedCat)} `);
      Chevron_down($$renderer2, {
        class: `w-3 h-3 ${stringify("")} transition-transform`
      });
      $$renderer2.push(`<!----></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="relative"><button${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${stringify("bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-500")}`)}>${escape_html(
      store_get($$store_subs ??= {}, "$_", $format)("exercises.filterDifficulty")
    )} `);
    Chevron_down($$renderer2, {
      class: `w-3 h-3 ${stringify("")} transition-transform`
    });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${stringify("bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 hover:text-amber-600")}`)}>`);
    Video($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.videoOnly"))}</button> `);
    if (activeFilterCount > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">`);
      X($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.clearFilters"))} <span class="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">${escape_html(activeFilterCount)}</span></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (store_get($$store_subs ??= {}, "$exercisesLoaded", exercisesLoaded) && !store_get($$store_subs ??= {}, "$exercisesLoading", exercisesLoading)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-slate-400 mb-4">${escape_html(filtered.length)} ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.total"))} `);
      if (activeFilterCount > 0 || searchQuery) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-slate-300 dark:text-slate-600">· ${escape_html(store_get($$store_subs ??= {}, "$allExercises", allExercises).length)} ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.total"))} total</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$exercisesLoading", exercisesLoading)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"><!--[-->`);
      const each_array_3 = ensure_array_like(Array(6));
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        each_array_3[$$index_3];
        $$renderer2.push(`<div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden animate-pulse"><div class="h-44 bg-slate-200 dark:bg-slate-700"></div> <div class="p-3 space-y-2"><div class="flex gap-1.5"><div class="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div> <div class="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div></div> <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div> <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mt-1"></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="flex items-center justify-center gap-2 text-slate-400 text-sm py-4">`);
      Loader_circle($$renderer2, { class: "w-4 h-4 animate-spin" });
      $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.loading"))}</div>`);
    } else if (visible.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-16 text-slate-400">`);
      Search($$renderer2, { class: "w-10 h-10 mb-3 opacity-40" });
      $$renderer2.push(`<!----> <p class="text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.noResults"))}</p> `);
      if (activeFilterCount > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="mt-3 text-xs text-sky-400 hover:text-sky-500 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.clearFilters"))}</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"><!--[-->`);
      const each_array_4 = ensure_array_like(visible);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let exercise = each_array_4[$$index_4];
        ExerciseCard($$renderer2, {
          title: exercise.title,
          titleEs: exercise.titleEs,
          duration: exercise.duration,
          tags: exercise.tags,
          tagsEs: exercise.tagsEs,
          image: exercise.image,
          recommended: exercise.recommended,
          recommendedLabel: exercise.recommendedLabel,
          hasVideo: exercise.hasVideo,
          difficulty: exercise.difficulty,
          source: exercise.source,
          onTagClick: handleTagClick
        });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (hasMore && !store_get($$store_subs ??= {}, "$exercisesLoading", exercisesLoading)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex justify-center pb-4"><button class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:border-sky-300 hover:text-sky-500 transition-all duration-200 shadow-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("exercises.loadMore"))} `);
      Chevron_down($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
