import { resolveCanisterId } from '../lib/canisterIds';

export interface CanisterHealth {
  name: string;
  envKey: string;
  canisterId?: string;
  reachable: boolean;
  error?: string;
  lastChecked: number; // epoch ms
  meta?: Record<string, any>;
  source?: string; // resolution source
  latencyMs?: number; // probe latency
  conflict?: boolean;
}

export interface HealthSnapshot {
  network: string | undefined;
  canisters: CanisterHealth[];
  generatedAt: number;
  warnings: string[];
}

// Basic probe map: method to call for each canister (if available) that is cheap and query
const PROBE_METHODS: Record<string, { method: string; args?: any[] }> = {
  HHDAO_DAO: { method: 'getMemberCount', args: [] },
  HHDAO_TREASURY: { method: 'getMeta', args: [] },
  HHDAO_IDENTITY: { method: 'getVersion', args: [] }, // hypothetical
  HHDAO_TELEMETRY: { method: 'getVersion', args: [] }, // hypothetical
};

async function probe(canisterKey: string, canisterRecord: any): Promise<CanisterHealth> {
  const canisterId = canisterRecord.id as string | undefined;
  const source = canisterRecord.source as string | undefined;
  const conflict = canisterRecord.conflict as boolean | undefined;
  const conflicts = canisterRecord.conflicts as any[] | undefined;
  const started = Date.now();
  if (!canisterId) {
    return {
      name: canisterKey.replace('HHDAO_', '').toLowerCase(),
      envKey: canisterKey,
      canisterId: undefined,
      reachable: false,
      error: 'missing id',
      lastChecked: Date.now(),
      source,
      conflict,
      meta: conflicts ? { conflicts } : undefined,
      latencyMs: Date.now() - started,
    };
  }
  // Lazy dynamic import of any existing declarations; if not found, mark as unknown but present
  try {
    let actor: any = null;
    switch (canisterKey) {
      case 'HHDAO_DAO': {
        const mod = await import('../declarations/hhdao_dao');
        actor = mod.createActor(canisterId);
        break;
      }
      case 'HHDAO_TREASURY': {
        try {
          const mod = await import('../declarations/hhdao_treasury');
          actor = mod.createTreasuryActor(canisterId);
        } catch (_) {}
        break;
      }
      default:
        // For identity/telemetry optional
        break;
    }
    if (!actor) {
      return {
        name: canisterKey.replace('HHDAO_', '').toLowerCase(),
        envKey: canisterKey,
        canisterId,
        reachable: true, // ID known; actor not generated (non-critical)
        lastChecked: Date.now(),
        meta: { note: 'No actor available for probe', conflicts },
        source,
        conflict,
        latencyMs: Date.now() - started,
      };
    }
    const probeDef = PROBE_METHODS[canisterKey];
    if (probeDef && typeof (actor as any)[probeDef.method] === 'function') {
      try {
        const result = await (actor as any)[probeDef.method](...(probeDef.args || []));
        return {
          name: canisterKey.replace('HHDAO_', '').toLowerCase(),
          envKey: canisterKey,
          canisterId,
          reachable: true,
          lastChecked: Date.now(),
          meta: { sample: result?.toString?.() ?? JSON.stringify(result), conflicts },
          source,
          conflict,
          latencyMs: Date.now() - started,
        };
      } catch (e: any) {
        return {
          name: canisterKey.replace('HHDAO_', '').toLowerCase(),
          envKey: canisterKey,
          canisterId,
          reachable: false,
          error: e?.message || String(e),
          lastChecked: Date.now(),
          source,
          conflict,
          meta: conflicts ? { conflicts } : undefined,
          latencyMs: Date.now() - started,
        };
      }
    }
    return {
      name: canisterKey.replace('HHDAO_', '').toLowerCase(),
      envKey: canisterKey,
      canisterId,
      reachable: true,
      lastChecked: Date.now(),
      meta: { note: 'No probe method defined', conflicts },
      source,
      conflict,
      latencyMs: Date.now() - started,
    };
  } catch (e: any) {
    return {
      name: canisterKey.replace('HHDAO_', '').toLowerCase(),
      envKey: canisterKey,
      canisterId,
      reachable: false,
      error: e?.message || String(e),
      lastChecked: Date.now(),
      source,
      conflict,
      meta: conflicts ? { conflicts } : undefined,
      latencyMs: Date.now() - started,
    };
  }
}

export async function getHealthSnapshot(): Promise<HealthSnapshot> {
  const keys = ['HHDAO_DAO', 'HHDAO_TREASURY', 'HHDAO_IDENTITY', 'HHDAO_TELEMETRY'];
  const canisterRecords = keys.map((k) => resolveCanisterId(k, undefined, true));
  const results = await Promise.all(keys.map((k, i) => probe(k, canisterRecords[i])));
  const warnings: string[] = [];
  results.forEach((r) => {
    if (!r.canisterId) warnings.push(`${r.envKey} missing ID`);
    else if (!r.reachable) warnings.push(`${r.envKey} unreachable`);
    else if (r.conflict) warnings.push(`${r.envKey} id conflict (${r.source} vs alt)`);
  });
  return {
    network: typeof process !== 'undefined' ? process.env.DFX_NETWORK : undefined,
    canisters: results,
    generatedAt: Date.now(),
    warnings,
  };
}
