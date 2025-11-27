// Minimal placeholder for revocation_canister declarations used during local builds.
// Replace with generated canister bindings from `dfx generate` in CI/deploy.
export const canisterId = process.env.NEXT_PUBLIC_REVOCATION_CANISTER_ID || 'aaaaa-aa';

export function createActor(_id: string, _opts?: any) {
  return new Proxy({}, { get: () => () => { throw new Error('Canister actor not available in local placeholder'); } });
}
