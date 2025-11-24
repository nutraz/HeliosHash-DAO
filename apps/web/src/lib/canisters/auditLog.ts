import { createActor } from '@/lib/actorFactory';
import { canisterId as auditLogCanisterId } from '../../../../../src/declarations/audit_log_canister';

const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';

export function getAuditLogActor() {
  try {
    // Create actor via shared factory; identity not provided here (uses default agent)
    return createActor(auditLogCanisterId, require('../../../../../src/declarations/audit_log_canister').idlFactory);
  } catch (e) {
    const stub = {
      tail: async (_limit: bigint) => [],
      append: async (_text: string) => 0n,
    } as const;
    return stub as any;
  }
}

export type AuditEntry = { 0: number; 1: string };
