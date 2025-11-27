import * as canisters from '@/lib/canisters';

const cache = new Map<string, any>();

async function cached(name: string, getter: () => Promise<any>) {
  if (cache.has(name)) return cache.get(name);
  const a = await getter();
  cache.set(name, a);
  return a;
}

export const icClient = {
  auditLog: async () => await cached('audit_log', () => canisters.getAuditLogActor()),
  identity: async () => await cached('identity', () => canisters.getIdentityActor()),
  revocation: async () => await cached('revocation', () => canisters.getRevocationActor()),
  hhuToken: async () => await cached('hhu_token', () => canisters.getHhuTokenActor()),
  treasury: async () => await cached('treasury', () => canisters.getTreasuryActor()),
  governance: async () => await cached('governance', () => canisters.getGovernanceActor()),
  projectHub: async () => await cached('project_hub', () => canisters.getProjectHubActor()),
};

export default icClient;
