/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@/lib/actorFactory' {
  import type { Identity } from '@dfinity/agent'

  // Minimal createActor declaration; will be typed more strictly in a follow-up
  export function createActor(canisterId: string, idlFactory: any, identity?: Identity | null): any
}
/* eslint-enable @typescript-eslint/no-explicit-any */
