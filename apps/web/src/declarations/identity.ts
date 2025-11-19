// Minimal test-time stub for canister declaration `identity`.
// Tests import this module and often mock `createActor`, so export the symbol.

export const canisterId = 'dev-identity';

export function createActor(_canisterId?: string, _options?: any) {
  // Return a minimal actor object. Tests typically replace/mock the methods.
  return {} as any;
}

export type _SERVICE = Record<string, any>;
