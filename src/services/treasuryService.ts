// Treasury service (frontend) – currently mock until candid bindings generated.
export interface TreasuryMeta {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: bigint;
  holderCount: bigint;
  txCount: bigint;
  lastTxTime: bigint | null;
  locked: boolean;
  daoCanister?: string | null;
  identityCanister?: string | null;
}

export interface TreasuryService {
  getMeta(): Promise<TreasuryMeta>;
  getBalance(principal: string): Promise<bigint>;
}

// Minimal dynamic actor loader (to be replaced with generated declarations when available)
let actorPromise: Promise<any> | null = null;
async function getTreasuryActor(): Promise<any> {
  if (actorPromise) return actorPromise;
  const canisterId =
    (globalThis as any).CANISTER_ID_HHDAO_TREASURY ||
    (import.meta as any).env?.CANISTER_ID_HHDAO_TREASURY;
  if (!canisterId) return null;
  actorPromise = import('@/declarations/hhdao_treasury')
    .then((mod) => mod.createTreasuryActor(canisterId))
    .catch((e) => {
      console.warn('[treasuryService] actor load failed', e);
      return null;
    });
  return actorPromise;
}

class BasicTreasuryService implements TreasuryService {
  async getMeta(): Promise<TreasuryMeta> {
    // Try actor first (future)
    const actor = await getTreasuryActor();
    if (actor && actor.getMeta) {
      try {
        const meta = await actor.getMeta();
        return {
          symbol: meta.symbol,
          name: meta.name,
          decimals: Number(meta.decimals),
          totalSupply: BigInt(meta.totalSupply),
          holderCount: BigInt(meta.holderCount),
          txCount: BigInt(meta.txCount),
          lastTxTime: meta.lastTxTime.length ? BigInt(meta.lastTxTime[0]) : null,
          locked: meta.locked,
          daoCanister: meta.daoCanister.length
            ? meta.daoCanister[0].toText?.() || String(meta.daoCanister[0])
            : null,
          identityCanister: meta.identityCanister.length
            ? meta.identityCanister[0].toText?.() || String(meta.identityCanister[0])
            : null,
        } as TreasuryMeta;
      } catch (e) {
        // fall through to mock
        console.warn('[treasuryService] actor meta failed, using mock', e);
      }
    }
    // Mock fallback
    return {
      symbol: 'OWP',
      name: 'One World Power',
      decimals: 8,
      totalSupply: BigInt(0),
      holderCount: BigInt(0),
      txCount: BigInt(0),
      lastTxTime: null,
      locked: false,
      daoCanister: null,
      identityCanister: null,
    };
  }
  async getBalance(principal: string): Promise<bigint> {
    const actor = await getTreasuryActor();
    if (actor && actor.balanceOf) {
      try {
        return BigInt(await actor.balanceOf(principal));
      } catch {
        /* ignore */
      }
    }
    return BigInt(0);
  }
}

export const treasuryService: TreasuryService = new BasicTreasuryService();

export function formatOwpAtomic(v: bigint, decimals = 8, fractionDigits = 2): string {
  const denom = BigInt(10) ** BigInt(decimals);
  const whole = v / denom;
  const frac = v % denom;
  if (fractionDigits === 0) return whole.toString();
  const fracStr = (denom + frac)
    .toString()
    .slice(1)
    .padStart(decimals, '0')
    .slice(0, fractionDigits);
  return `${whole.toString()}.${fracStr}`;
}
