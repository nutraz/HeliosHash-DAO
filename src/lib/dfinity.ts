// Helper to connect an authenticated agent to your canisters.
// Usage:
// const ctx = await connectToCanisters();
// if (ctx) {
//   const { authClient, agent } = ctx;
//   const daoActor = Actor.createActor(daoIDL, { agent, canisterId: daoCanisterId });
// }
export const connectToCanisters = async () => {
  // Client-side helper: uses AuthClient for user-authenticated requests.
  // This must not run on the server since AuthClient depends on IndexedDB.
  if (typeof window === 'undefined') {
    return null;
  }

  const { AuthClient } = await import('@dfinity/auth-client');
  const { HttpAgent } = await import('@dfinity/agent');

  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity, host: process.env.NEXT_PUBLIC_IC_HOST });

    if (process.env.NEXT_PUBLIC_IC_HOST?.includes('localhost')) {
      try {
        // @ts-ignore
        await agent.fetchRootKey();
      } catch (e) {
        // ignore
      }
    }

    return { authClient, agent };
  }

  return null;
};

// Initialize backend connection for client-side use (auth + agent + optional generated bindings)
export const initBackend = async () => {
  if (typeof window === 'undefined') return null;

  const { AuthClient } = await import('@dfinity/auth-client');
  const { HttpAgent } = await import('@dfinity/agent');

  const authClient = await AuthClient.create();
  const isAuth = await authClient.isAuthenticated();
  const identity = isAuth ? await authClient.getIdentity() : undefined;

  // Default to local replica for development
  const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943';
  const agent = new HttpAgent({ identity, host });

  if (host.includes('localhost')) {
    try { await agent.fetchRootKey(); } catch (e) { /* ignore */ }
  }

  // Optionally import generated bindings at runtime. Set `HHU_BINDINGS_PATH` in .env
  // to something like './src/declarations/hhu_token' (runtime import via webpackIgnore).
  let bindings: any = null;
  const bindingsPath = process.env.HHU_BINDINGS_PATH || process.env.DAO_BINDINGS_PATH;
  if (bindingsPath) {
    try {
      bindings = await import(/* webpackIgnore: true */ bindingsPath);
    } catch (e) {
      // ignore — bindings may not exist in local dev or path may be wrong
      // eslint-disable-next-line no-console
      console.warn('Could not import HHU bindings from', bindingsPath, e);
    }
  }

  return { authClient, agent, identity, bindings };
};

// Example helper: create HHU token actor if bindings are available
export const getHHUTokenActor = async (agent: any) => {
  const bindingsPath = process.env.HHU_BINDINGS_PATH || process.env.DAO_BINDINGS_PATH;
  if (!bindingsPath) return null;
  try {
    const bindings = await import(/* webpackIgnore: true */ bindingsPath);
    if (bindings?.createActor && bindings?.canisterId) {
      return bindings.createActor(bindings.canisterId, { agent });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to create HHU actor from bindings', e);
  }
  return null;
};

// Example domain helpers that use an actor when available, otherwise fall back to mock
export const fetchUserTokens = async (principal?: string) => {
  try {
    const ctx = await initBackend();
    if (ctx && ctx.agent) {
      const actor = await getHHUTokenActor(ctx.agent);
      if (actor && actor.balanceOf) {
        // Many token canisters expose balanceOf returning Nat or similar
        const res = await actor.balanceOf(principal ?? (ctx.identity ? ctx.identity.getPrincipal().toString() : undefined));
        return res;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('fetchUserTokens failed, falling back to mock', e);
  }

  // Mock fallback
  return 25000;
};

export const fetchProposals = async () => {
  try {
    const ctx = await initBackend();
    if (ctx && ctx.agent) {
      const actor = await getHHUTokenActor(ctx.agent);
      if (actor && actor.getAllProposals) {
        return await actor.getAllProposals();
      }
      if (actor && actor.getProposals) {
        return await actor.getProposals();
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('fetchProposals failed, falling back to mock', e);
  }

  // Mock proposals
  return [
    { id: 1, title: 'Solar Farm Expansion', amount: 100000, status: 'active' },
    { id: 2, title: 'Village Microgrid', amount: 50000, status: 'funded' }
  ];
};

export const createProposal = async (title: string, description: string, amount: number) => {
  try {
    const ctx = await initBackend();
    if (ctx && ctx.agent) {
      const actor = await getHHUTokenActor(ctx.agent);
      if (actor && actor.createProposal) {
        return await actor.createProposal(title, description, BigInt(amount));
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('createProposal failed (mock)', e);
  }
  return { ok: false, error: 'mock' };
};

// Lightweight data helpers that can be replaced with real canister calls.
export const getUserData = async () => {
  // User data should be fetched via the client-authenticated path.
  try {
    const ctx = await connectToCanisters();
    if (ctx) {
      // TODO: create authenticated actor and return real user data.
      return null;
    }
  } catch (e) {
    // fall through to mock
  }

  return {
    name: 'Rahul Kumar',
    pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    rank: 'Investor & Collaborator',
    tokenBalance: 15000,
    nftCollection: [
      { id: 1, name: 'Solar Bitcoin Mining Hub' },
      { id: 2, name: 'EV Charging Network' }
    ]
  };
};

// Server-side context using a server identity (for public data)
export const getServerContext = async () => {
  // Only run on server
  if (typeof window !== 'undefined') return null;

  // Server secret key (base64 of the raw secret key bytes)
  const keyB64 = process.env.DFINITY_SERVER_KEY_B64 || process.env.SERVER_IDENTITY_B64;
  if (!keyB64) return null;

  const { HttpAgent } = await import('@dfinity/agent');
  const { Ed25519KeyIdentity } = await import('@dfinity/identity');

  try {
    let raw = Uint8Array.from(Buffer.from(keyB64, 'base64'));
    // Accept either 32-byte seed or 64-byte secretKey; convert to 32-byte seed
    if (raw.length === 64) {
      raw = raw.slice(0, 32);
    }
    const identity = Ed25519KeyIdentity.fromSecretKey(raw);
    const agent = new HttpAgent({ identity, host: process.env.NEXT_PUBLIC_IC_HOST });
    if (process.env.NEXT_PUBLIC_IC_HOST?.includes('localhost')) {
      try { await agent.fetchRootKey(); } catch (e) { /* ignore */ }
    }
    return { identity, agent };
  } catch (e) {
    console.error('Failed to create server identity:', e);
    return null;
  }
};

// getProjects: try server-side context first (public data), then fall back to client/mock
export const getProjects = async (serverCtx?: { agent?: any } | null) => {
  // If serverCtx not provided, try to create one (server-side execution)
  let ctx = serverCtx ?? null;
  if (!ctx && typeof window === 'undefined') {
    ctx = await getServerContext();
  }

  if (ctx && ctx.agent) {
    // If you generated TypeScript bindings, set `DAO_BINDINGS_PATH` in your env
    // to the runtime path of the generated module (e.g. './src/declarations/dao').
    // We only attempt to import when that env var is provided to avoid causing
    // build-time module resolution errors in Next.js.
    const bindingsPath = process.env.DAO_BINDINGS_PATH;
    if (bindingsPath) {
      try {
        // Import bindings at runtime without letting webpack attempt to resolve
        // the expression at build time.
        const bindings = await import(/* webpackIgnore: true */ bindingsPath);
        if (bindings?.createActor && bindings?.canisterId) {
          const actor = bindings.createActor(bindings.canisterId, { agent: ctx.agent });
          if (actor.getProjects) {
            return await actor.getProjects();
          }
          if (actor.listProjects) {
            return await actor.listProjects();
          }
        }
      } catch (e) {
        console.error('Error importing DAO bindings from', bindingsPath, e);
      }
    } else {
      // Try runtime client (no generated bindings) to call common read-only methods
      try {
        const { fetchProjectsFromAgent } = await import('./daoClient');
        const runtimeRes = await fetchProjectsFromAgent(ctx.agent);
        if (runtimeRes) return runtimeRes;
      } catch (e) {
        console.error('Error calling runtime DAO client', e);
      }
    }
  }

  // Fallback: return mock projects
  return [
    { id: 1, name: 'Solar Bitcoin Mining Hub', stage: 'functioning', completion: 100, funding: '₹2.5 Cr', isLive: true },
    { id: 6, name: "Helios#Baghpat Village DAO", stage: 'functioning', completion: 100, funding: '₹85L', isLive: true },
    { id: 7, name: 'UrgamU Delhi Solar Mining', stage: 'functioning', completion: 100, funding: '₹65L', isLive: true }
  ];
};
