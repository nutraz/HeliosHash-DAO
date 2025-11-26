// Lightweight runtime DAO client that creates an Actor with a small IDL
// so server code can call simple read-only methods without generated bindings.
export async function fetchProjectsFromAgent(agent: any, canisterId?: string) {
  if (!agent) return null;
  const cid = canisterId || process.env.NEXT_PUBLIC_DAO_CANISTER_ID || process.env.DAO_CANISTER_ID;
  if (!cid) return null;

  try {
    const { Actor } = await import('@dfinity/agent');

    const idlFactory = ({ IDL }: any) => {
      const Project = IDL.Record({
        id: IDL.Nat,
        name: IDL.Text,
        stage: IDL.Text,
        completion: IDL.Nat,
        funding: IDL.Text,
        isLive: IDL.Bool,
      });

      return IDL.Service({
        getProjects: IDL.Func([], IDL.Vec(Project), ['query']),
        get_projects: IDL.Func([], IDL.Vec(Project), ['query']),
        listProjects: IDL.Func([], IDL.Vec(Project), ['query']),
        list_projects: IDL.Func([], IDL.Vec(Project), ['query']),
      });
    };

    const actor = Actor.createActor(idlFactory as any, { agent, canisterId: cid });

    // Try a few common method names
    const tries = ['getProjects', 'get_projects', 'listProjects', 'list_projects'];
    for (const name of tries) {
      if (typeof (actor as any)[name] === 'function') {
        try {
          const res = await (actor as any)[name]();
          return res;
        } catch (e) {
          // try next
        }
      }
    }
  } catch (e) {
    console.error('daoClient fetch error', e);
  }

  return null;
}

export async function fetchUserFromAgent(agent: any, canisterId?: string) {
  if (!agent) return null;
  const cid = canisterId || process.env.NEXT_PUBLIC_DAO_CANISTER_ID || process.env.DAO_CANISTER_ID;
  if (!cid) return null;

  try {
    const { Actor } = await import('@dfinity/agent');

    const idlFactory = ({ IDL }: any) => {
      const User = IDL.Record({ name: IDL.Text, pfp: IDL.Text, rank: IDL.Text, tokenBalance: IDL.Nat });
      return IDL.Service({
        getUser: IDL.Func([], User, ['query']),
        get_user: IDL.Func([], User, ['query']),
      });
    };

    const actor = Actor.createActor(idlFactory as any, { agent, canisterId: cid });

    const tries = ['getUser', 'get_user'];
    for (const name of tries) {
      if (typeof (actor as any)[name] === 'function') {
        try {
          const res = await (actor as any)[name]();
          return res;
        } catch (e) {
          // try next
        }
      }
    }
  } catch (e) {
    console.error('daoClient fetchUser error', e);
  }

  return null;
}
