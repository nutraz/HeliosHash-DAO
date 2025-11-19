export function resolveCanisterId(name: string, fallback?: string, asRecord?: boolean): any {
  // Simple resolver for local development and tests.
  // Prefer explicit fallback (generated canisterId), then environment variable.
  const envKey = `NEXT_PUBLIC_CANISTER_${name}`;
  const env = process.env[envKey] || process.env[`CANISTER_${name}`] || process.env[`CANISTER_ID_${name}`];
  const id = fallback ? String(fallback) : env ? String(env) : '';
  if (asRecord) {
    return {
      id,
      source: env ? 'env' : fallback ? 'fallback' : 'none',
      conflict: false,
      conflicts: [] as any[],
    };
  }
  return id;
}
