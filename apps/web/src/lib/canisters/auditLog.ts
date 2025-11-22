import { createActor, canisterId as auditLogCanisterId } from '../../../../../src/declarations/audit_log_canister';
import { HttpAgent } from '@dfinity/agent';

const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';

export function getAuditLogActor() {
  return createActor(auditLogCanisterId, {
    agentOptions: { host },
  });
}

export type AuditEntry = { 0: number; 1: string };
