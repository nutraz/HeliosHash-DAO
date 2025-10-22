// Ambient module declarations to suppress TS2307 for generated canister bindings and dev-only modules.
// These are intentionally broad until proper type generation is wired.

declare module '@/declarations/*/service.did' {
  const service: any;
  export default service;
}

declare module '@/declarations/*/service.did.d' {
  const service: any;

  export type _SERVICE = any; // temporary until real generated types are integrated
  export default service;
}

// Some code may import from directories without explicit file extension
// Provide a catch-all for now (minimize overuse; refine later).
declare module '@/declarations/*' {
  const actor: any;
  export default actor;
}

// Vite-related ambient declarations (project currently uses Next.js but stray imports referenced)
declare module 'vite' {
  export type UserConfig = any;

  const defineConfig: (...args: any[]) => any;
  export { defineConfig };
}

declare module '@vitejs/plugin-react' {
  const plugin: (...args: any[]) => any;
  export default plugin;
}
