# PRIV-003 — Harden `src/components/PrivacyDashboard.tsx` and backend storage

Description:

`src/components/PrivacyDashboard.tsx` currently integrates with `privacyService` which uses in-memory storage. This task is to migrate privacy-related storage to encrypted persistent storage, integrate KMS-based key management, and validate consent flows and audits.

Files:

- `src/components/PrivacyDashboard.tsx`
- `src/services/privacyComplianceService.ts`
- `app/api/privacy/route.ts`

Acceptance criteria:

- Replace in-memory storage in `privacyComplianceService` with a persistent encrypted store (database) and KMS key management.
- Implement RBAC for audit log access and redact IPs/user-agents from user-facing exports.
- Add tests for withdrawConsentAndDeleteData behavior across persistent storage/backups.

Priority: Critical
Assignee: @maintainers
Labels: security, privacy, critical
