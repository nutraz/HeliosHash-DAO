// Minimal placeholder for audit_log_canister declarations used during local builds.
// Replace with generated canister bindings from `dfx generate` in CI/deploy.
export const canisterId = process.env.NEXT_PUBLIC_AUDIT_LOG_CANISTER_ID || 'aaaaa-aa';

export function createActor(_id: string, _opts?: any) {
  // Return a very small stub actor that will not perform network calls.
  return new Proxy({}, { get: () => () => { throw new Error('Canister actor not available in local placeholder'); } });
}
