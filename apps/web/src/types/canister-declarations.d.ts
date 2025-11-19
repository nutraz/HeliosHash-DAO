declare module '../declarations/*' {
  const _any: any;
  export = _any;
}

declare module '@/declarations/*' {
  const _any: any;
  export = _any;
}

declare module '*did.d.ts' {
  const _any: any;
  export = _any;
}

declare module '../declarations' {
  const _any: any;
  export = _any;
}

declare module '@/declarations' {
  const _any: any;
  export = _any;
}

// Specific named exports for common generated canister declaration modules
declare module '../declarations/hhdao_dao' {
  export const createActor: any;
  export const canisterId: any;
  export type _SERVICE = any;
  export type ContributionType = any;
  export type Member = any;
  export type MemberId = any;
  export type ProposalId = any;
}

declare module '../declarations/hhdao' {
  export const idlFactory: any;
}

declare module '../declarations/hhdao_treasury' {
  const _any: any;
  export = _any;
}

declare module '../declarations/hhdao_identity' {
  const _any: any;
  export = _any;
}

declare module '@/declarations/treasury' {
  export const treasury: any;
}

declare module '@/declarations/treasury/treasury.did' {
  export type _SERVICE = any;
}

declare module '../lib/canisterIds' {
  export function resolveCanisterId(name: string): string;
}
