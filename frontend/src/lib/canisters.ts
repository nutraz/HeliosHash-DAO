import { createActor } from '@/lib/actorFactory';

function envNameFor(canister: string) {
  return (
    'NEXT_PUBLIC_' +
    canister
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toUpperCase() +
    '_CANISTER_ID'
  );
}

async function tryImportDeclaration(name: string) {
  try {
    // dynamic import from generated declarations folder
    // path relative to this file: frontend/src/lib -> ../../declarations
    // keep it dynamic so builds don't fail when declarations are absent
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('../../declarations/' + name).catch(() => null);
    return mod as any | null;
  } catch (e) {
    return null;
  }
}

export async function getActor(canisterName: string, idlFactory?: any, identity?: any) {
  const env = process.env[envNameFor(canisterName) as keyof typeof process.env] as string | undefined;
  if (!env) {
    return null;
  }

  try {
    const decl = await tryImportDeclaration(canisterName);
    const factory = idlFactory || (decl && decl.idlFactory);
    if (!factory) {
      // create a minimal actor if we don't have an IDL factory — caller should handle missing methods
      return createActor(env, (arg: any) => arg.Service({}));
    }
    return await createActor(env, factory, identity as any);
  } catch (e) {
    // graceful fallback
    // eslint-disable-next-line no-console
    console.warn('getActor failed for', canisterName, e);
    return null;
  }
}

// Convenience getters for common canisters used by the app
export async function getAuditLogActor() {
  const actor = await getActor('audit_log_canister');
  if (actor) return actor;
  // fallback stub
  return {
    tail: async (_limit: bigint) => [] as any[],
    append: async (_text: string) => 0n,
  } as any;
}

export async function getIdentityActor() {
  const actor = await getActor('identity');
  if (actor) return actor;
  return null;
}

export async function getRevocationActor() {
  const actor = await getActor('revocation_canister');
  if (actor) return actor;
  return null;
}

export async function getHhuTokenActor() {
  const actor = await getActor('hhu_token');
  if (actor) return actor;
  return null;
}

export async function getTreasuryActor() {
  const actor = await getActor('treasury');
  if (actor) return actor;
  return null;
}

export async function getGovernanceActor() {
  const actor = await getActor('governance');
  if (actor) return actor;
  return null;
}

export async function getProjectHubActor() {
  const actor = await getActor('project_hub');
  if (actor) return actor;
  // fallback stub with a couple of safe methods the UI expects
  return {
    get_project_stats: async (_id: string) => ({ err: 'no-canister' }),
    create_project: async (_name: string, _loc: string, _cap: number, _meta: string) => ({ ok: false }),
    list_projects: async () => ([] as any[]),
  } as any;
}

export default {
  getActor,
  getAuditLogActor,
  getIdentityActor,
  getRevocationActor,
  getHhuTokenActor,
  getTreasuryActor,
  getGovernanceActor,
  getProjectHubActor,
};
