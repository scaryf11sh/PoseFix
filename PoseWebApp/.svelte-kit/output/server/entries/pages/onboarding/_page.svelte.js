import { a as store_get, g as attr_style, e as ensure_array_like, b as attr_class, d as attr, c as stringify, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { t as theme } from "../../../chunks/theme.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as $format } from "../../../chunks/runtime.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let step = 1;
    const totalSteps = 3;
    let username = "";
    let fullName = "";
    let profession = "";
    const professions = [
      "Software Engineer",
      "Software Architect",
      "Designer",
      "Product Manager",
      "Data Scientist",
      "DevOps Engineer",
      "Student",
      "Other"
    ];
    store_get($$store_subs ??= {}, "$theme", theme) ?? "dark";
    const stepLabels = [
      "Establishing your basic identity",
      "Connecting your hardware devices",
      "Setting up your preferences"
    ];
    $$renderer2.push(`<div class="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden px-4 py-8"><div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full bg-sky-400/5 dark:bg-sky-400/10 blur-[120px] pointer-events-none"></div> <div class="absolute top-5 left-6 flex items-center gap-2"><div class="w-8 h-8 rounded-xl bg-sky-400 flex items-center justify-center shadow-lg shadow-sky-400/30"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div> <span class="text-base font-bold text-slate-800 dark:text-white">PoseFix</span></div> <div class="w-full max-w-md relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden"><div class="h-1 bg-slate-100 dark:bg-slate-800"><div class="h-full bg-sky-400 transition-all duration-500 ease-out"${attr_style(`width: ${stringify(step / totalSteps * 100)}%`)}></div></div> <div class="p-7"><div class="flex items-center gap-1.5 mb-5"><!--[-->`);
    const each_array = ensure_array_like(Array.from({ length: totalSteps }));
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<div${attr_class(`h-1.5 rounded-full transition-all duration-300 ${stringify(i + 1 === step ? "w-6 bg-sky-400" : i + 1 < step ? "w-4 bg-sky-400/50" : "w-4 bg-slate-200 dark:bg-slate-700")}`)}></div>`);
    }
    $$renderer2.push(`<!--]--> <span class="ml-auto text-xs font-bold uppercase tracking-wider text-slate-400">Step ${escape_html(step)} of 3</span></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center text-center mb-6"><div class="w-14 h-14 rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div> <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to PoseFix</h1> <p class="text-sm text-slate-500 dark:text-slate-400">Let's set up your profile to optimize your workspace
                        posture.</p></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="space-y-4"><div><label for="username_input" class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("onboarding.username"))}</label> <div class="relative"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> <input id="username_input" type="text"${attr("value", username)} placeholder="e.g. johndoe92" class="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"/></div> <p class="text-[10px] text-slate-400 mt-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("onboarding.username_hint"))}</p></div> <div><label for="ob_full_name_input" class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.full_name"))}</label> <div class="relative"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> <input id="ob_full_name_input" type="text"${attr("value", fullName)} placeholder="John Doe" class="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"/></div></div> <div><label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5" for="ob_profession_input"><div class="relative"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg> `);
      $$renderer2.select(
        {
          id: "ob_profession_input",
          value: profession,
          class: `w-full appearance-none pl-10 pr-8 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all ${stringify("text-slate-400")}`
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "", disabled: true, selected: true }, ($$renderer4) => {
            $$renderer4.push(`Select your field`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(professions);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let p = each_array_1[$$index_1];
            $$renderer3.option({ value: p }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(p)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(` <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></div></label></div></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="mt-7 flex flex-col gap-3"><div class="flex gap-3">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <button${attr("disabled", true, true)}${attr_class(`flex-1 py-3 rounded-xl text-sm font-bold ${stringify("bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white")} disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2`)}>`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Next <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div> <div class="text-center">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="text-xs text-slate-400">${escape_html(stepLabels[step - 1])}</p>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
