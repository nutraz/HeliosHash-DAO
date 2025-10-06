// Utility to resolve canister IDs in multiple environments (Next.js / Vite style, global injection, .env)
// Order of resolution (first non-empty wins):
// 1. Explicit argument override (for tests)
// 2. globalThis.CANISTER_ID_<NAME>
// 3. process.env.CANISTER_ID_<NAME>
// 4. (import.meta as any).env?.CANISTER_ID_<NAME>
// Returns undefined if not found.
export type CanisterIdSource =
  | 'override'
  | 'global'
  | 'env'
  | 'env-next-public'
  | 'import-meta'
  | 'dfx-file'
  | 'none';

interface ResolutionRecord {
  id?: string;
  source: CanisterIdSource;
  // If conflicting values discovered during resolution, capture them for diagnostics
  conflicts?: { source: CanisterIdSource; id: string }[];
  conflict?: boolean; // convenience flag
}

const resolutionCache: Record<string, ResolutionRecord> = {};
let dfxIdsCache: Record<string, string> | null = null;
let dfxIdsLoaded = false;

function loadDfxIds(): Record<string, string> {
  if (dfxIdsLoaded) return dfxIdsCache || {};
  dfxIdsLoaded = true;
  try {
    const network = (typeof process !== 'undefined' && process.env.DFX_NETWORK) || 'local';
    const path = `.dfx/${network}/canister_ids.json`;
    // dynamic require via eval to avoid bundler complaints in browser

    const req = (0, eval)('require');
    const json = req(path);
    const flat: Record<string, string> = {};
    Object.entries(json).forEach(([k, v]: any) => {
      const val = v[network] || v.ic || v.local;
      if (val) flat[`CANISTER_ID_${k.toUpperCase()}`] = val;
    });
    dfxIdsCache = flat;
  } catch {
    dfxIdsCache = {};
  }
  return dfxIdsCache!;
}

export function resolveCanisterId(
  name: string,
  override?: string,
  withSource = false
): string | undefined {
  const key = `CANISTER_ID_${name.toUpperCase()}`;
  if (resolutionCache[key]) {
    return withSource ? (resolutionCache[key] as any) : resolutionCache[key].id;
  }
  let record: ResolutionRecord = { source: 'none', id: undefined };
  const candidates: { source: CanisterIdSource; id: string }[] = [];
  if (override) {
    candidates.push({ source: 'override', id: override });
  }
  // @ts-ignore
  const fromGlobal = (globalThis as any)[key];
  if (fromGlobal) candidates.push({ source: 'global', id: fromGlobal });
  if (typeof process !== 'undefined') {
    const fromProcess = (process.env as any)[key];
    if (fromProcess) {
      candidates.push({ source: 'env', id: fromProcess });
    }

    // Also check NEXT_PUBLIC_ prefixed version for client-side access
    const nextPublicKey = `NEXT_PUBLIC_${key}`;
    const fromNextPublic = (process.env as any)[nextPublicKey];
    if (fromNextPublic) {
      candidates.push({ source: 'env-next-public', id: fromNextPublic });
    }
  }
  // Skip import.meta access to avoid bundler warnings - rely on process.env instead
  const dfxIds = loadDfxIds();
  if (dfxIds[key]) candidates.push({ source: 'dfx-file', id: dfxIds[key] });

  if (candidates.length) {
    // Choose the first in precedence order (already pushed in precedence sequence)
    record.id = candidates[0].id;
    record.source = candidates[0].source;
    // Detect conflicts (distinct ids across sources)
    const distinct = new Map<string, CanisterIdSource[]>();
    candidates.forEach((c) => {
      if (!distinct.has(c.id)) distinct.set(c.id, []);
      distinct.get(c.id)!.push(c.source);
    });
    if (distinct.size > 1) {
      record.conflict = true;
      // All candidates excluding the chosen one become conflicts if they differ
      record.conflicts = candidates
        .filter((c) => c.id !== record.id)
        .map((c) => ({ source: c.source, id: c.id }));
    }
  }

  resolutionCache[key] = record;
  return withSource ? (record as any) : record.id;
}

export function requireCanisterId(name: string, override?: string): string {
  const id = resolveCanisterId(name, override) as string | undefined;
  if (!id) {
    throw new Error(
      `Canister ID is required, but resolved to undefined for ${name}. ` +
        'Ensure environment variables or global injection provide CANISTER_ID_' +
        name.toUpperCase()
    );
  }
  return id;
}

export function getCanisterIdResolutions(): Record<string, ResolutionRecord> {
  // Return a shallow copy to avoid external mutation
  return { ...resolutionCache };
}
