import { Actor, HttpAgent } from "@dfinity/agent";

// Simple caching layer so repeated calls to createActor for the same
// canister and identity reuse the same actor instance. This avoids
// recreating actors on every render and provides a stable actor object.
const anonymousCache = new Map<string, any>();
const identityCache = new WeakMap<object, Map<string, any>>();

export async function createActor<T>(
  canisterId: string,
  idlFactory: any,
  identity?: any
): Promise<any> {
  if (!canisterId) {
    throw new Error(`Canister ID not defined for actor creation`);
  }

  // Validate canister ID (loose check)
  if (!/^[a-z0-9\-]+$/.test(canisterId)) {
    throw new Error(`Invalid canister ID: ${canisterId}`);
  }

  // Attempt to return cached actor if present
  if (identity && typeof identity === 'object') {
    let map = identityCache.get(identity);
    if (map && map.has(canisterId)) return map.get(canisterId);
  } else {
    if (anonymousCache.has(canisterId)) return anonymousCache.get(canisterId);
  }

  const agent = new HttpAgent({
    identity,
    host: process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app'
  });

  if (process.env.NEXT_PUBLIC_DFX_NETWORK !== "ic") {
    // Fetch root key in non-ic (local) environments for cert validation
    try {
      await agent.fetchRootKey();
    } catch (e) {
      // non-fatal; continue without root key if fetch fails
      // eslint-disable-next-line no-console
      console.warn('fetchRootKey failed', e);
    }
  }

  const actor = Actor.createActor(idlFactory, { agent, canisterId }) as any;

  // Cache actor
  if (identity && typeof identity === 'object') {
    let map = identityCache.get(identity);
    if (!map) {
      map = new Map();
      identityCache.set(identity, map);
    }
    map.set(canisterId, actor);
  } else {
    anonymousCache.set(canisterId, actor);
  }

  return actor;
}