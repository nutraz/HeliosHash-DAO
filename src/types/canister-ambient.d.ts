// Ambient module declarations to suppress TS2307 for generated canister bindings and dev-only modules.
// These are intentionally broad until proper type generation is wired.

declare module '@/declarations/*/service.did' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service: any;
  export default service;
}

declare module '@/declarations/*/service.did.d' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type _SERVICE = any; // temporary until real generated types are integrated
  export default service;
}

// Some code may import from directories without explicit file extension
// Provide a catch-all for now (minimize overuse; refine later).
declare module '@/declarations/*' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actor: any;
  export default actor;
}

// Vite-related ambient declarations (project currently uses Next.js but stray imports referenced)
declare module 'vite' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type UserConfig = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defineConfig: (...args: any[]) => any;
  export { defineConfig };
}

declare module '@vitejs/plugin-react' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin: (...args: any[]) => any;
  export default plugin;
}
