import { s as spread_props, a as store_get, d as attr, b as attr_class, m as clsx, e as ensure_array_like, u as unsubscribe_stores } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as $format } from "../../../chunks/runtime.js";
import "@tauri-apps/plugin-sql";
import "../../../chunks/toast.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { L as Lock } from "../../../chunks/lock.js";
import { E as Eye } from "../../../chunks/eye.js";
import { e as escape_html } from "../../../chunks/context.js";
function At_sign($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "4" }],
      ["path", { "d": "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "at-sign" },
      /**
       * @component @name AtSign
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xNiA4djVhMyAzIDAgMCAwIDYgMHYtMWExMCAxMCAwIDEgMC00IDgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/at-sign
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
    let emailOrUsername = "";
    let password = "";
    let loading = false;
    let errors = {};
    const inputClass = (hasError) => `w-full pl-10 pr-4 py-3 rounded-xl text-sm
         bg-slate-50 dark:bg-slate-800
         border ${hasError ? "border-red-400" : "border-slate-200 dark:border-slate-700"}
         text-slate-800 dark:text-white placeholder:text-slate-400
         focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all`;
    $$renderer2.push(`<div class="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden"><div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-400/5 dark:bg-sky-400/8 blur-[140px] pointer-events-none"></div> <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/5 dark:bg-blue-600/8 blur-[120px] pointer-events-none"></div> <div class="flex items-center justify-between px-6 py-4"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-xl bg-sky-400 flex items-center justify-center shadow-lg shadow-sky-400/30"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div> <span class="text-base font-bold text-sky-400">Glacier</span></div> <button aria-label="Help" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors shadow-sm cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></button></div> <div class="flex-1 flex items-center justify-center px-4 py-8"><div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden"><div class="h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400"></div> <div class="p-8"><div class="text-center mb-8"><h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.sign_in_title"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.sign_in_tagline"))}</p></div> <div class="space-y-4">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div><label for="auth-identifier" class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Email or Username</label> <div class="relative">`);
      At_sign($$renderer2, {
        class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
      });
      $$renderer2.push(`<!----> <input id="auth-identifier" type="text"${attr("value", emailOrUsername)} placeholder="john@example.com or johndoe92"${attr_class(clsx(inputClass(!!errors.identifier)))}/></div> `);
      if (errors.identifier) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xs text-red-400 mt-1">${escape_html(errors.identifier)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <div><div class="flex justify-between items-center mb-1.5"><label for="auth-password" class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.password"))}</label> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button" aria-label="Forgot password" class="text-[10px] text-sky-400 hover:text-sky-500 font-medium transition-colors cursor-pointer">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.forgot_password"))}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="relative">`);
    Lock($$renderer2, {
      class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
    });
    $$renderer2.push(`<!----> <input id="auth-password"${attr("type", "password")}${attr("value", password)} placeholder="••••••••"${attr_class(clsx(inputClass(!!errors.password).replace("pr-4", "pr-10")))}/> <button type="button"${attr("aria-label", "Show password")} class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">`);
    {
      $$renderer2.push("<!--[!-->");
      Eye($$renderer2, { class: "w-4 h-4" });
    }
    $$renderer2.push(`<!--]--></button></div> `);
    if (errors.password) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-red-400 mt-1">${escape_html(errors.password)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button type="button"${attr("aria-label", "Sign in")}${attr("disabled", loading, true)} class="w-full mt-6 py-3.5 rounded-xl font-bold text-sm cursor-pointer bg-slate-800 dark:bg-sky-500 hover:bg-slate-700 dark:hover:bg-sky-400 text-sky-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.sign_in"))}`);
    }
    $$renderer2.push(`<!--]--></button> <div class="flex items-center gap-3 my-5"><div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div> <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.or_continue_with"))}</span> <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div></div> <button type="button" aria-label="Continue with Google" class="w-full py-3 rounded-xl text-sm font-medium cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-300 hover:shadow-sm transition-all flex items-center justify-center gap-3"><svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> ${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.google"))}</button> <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.no_account"))} <button type="button" aria-label="Switch auth mode" class="text-sky-400 hover:text-sky-500 font-bold ml-1 transition-colors cursor-pointer">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("auth.create_account"))}</button></p></div></div></div> <div class="flex items-center justify-center gap-6 py-4 px-6 flex-wrap"><p class="text-[10px] uppercase tracking-widest text-slate-400">© 2024 Glacier Ergonomics</p> <div class="flex gap-4"><!--[-->`);
    const each_array = ensure_array_like(["Privacy", "Terms", "Support"]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr("aria-label", link)} class="text-[10px] uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">${escape_html(link)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
