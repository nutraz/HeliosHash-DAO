Audit Log Canister

Purpose:
- Store append-only audit hashes for actions (VC issuance anchored hash, milestone release proofs)

Example:
  dfx canister call audit_log_canister append '("sha256:abcd...")'
  dfx canister call audit_log_canister tail '(10)'
Audit Log Canister (skeleton)

Purpose:
- Store append-only audit hashes for actions (VC issuance anchored hash, milestone release proofs)

Example:
  dfx canister call audit_log_canister append '("sha256:abcd...")'
  dfx canister call audit_log_canister tail '(10)'

Notes:
- Minimal dev scaffold. Consider indexing and retention policies for production.
# Audit Log Canister (skeleton)

Stores audit entries and exposes simple retrieval APIs. Use this to anchor operational events (VC issuance, releases, disputes).

Example:

```
dfx canister call audit_log "recordAudit '(\"identity_canister\", \"VC anchored: sha256:...\")'"
```
