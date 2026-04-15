

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CA6zE6Ca.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/eAIHomqp.js","_app/immutable/chunks/BDsbom6h.js","_app/immutable/chunks/D6QP-Cuq.js","_app/immutable/chunks/CeC5_ZR6.js","_app/immutable/chunks/BKPdkm06.js","_app/immutable/chunks/ldopNjTO.js","_app/immutable/chunks/C_XwWD7C.js","_app/immutable/chunks/CUrH3VPy.js","_app/immutable/chunks/D7fdwQT-.js","_app/immutable/chunks/DnIpD2yj.js","_app/immutable/chunks/Cto8QyCc.js","_app/immutable/chunks/BH_9lRRO.js","_app/immutable/chunks/D3bfhbyi.js","_app/immutable/chunks/DSy6Nfnl.js","_app/immutable/chunks/lq7ANbhS.js","_app/immutable/chunks/DmE_WUVg.js","_app/immutable/chunks/DOXTbm5f.js","_app/immutable/chunks/C_E0TI-S.js"];
export const stylesheets = ["_app/immutable/assets/0.BNVZjCc0.css"];
export const fonts = [];
