

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BJMvgKSp.js","_app/immutable/chunks/DWYFH0fm.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/DN49GcKe.js"];
export const stylesheets = [];
export const fonts = [];
