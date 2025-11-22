# Audit Log Canister (skeleton)

Stores audit entries and exposes simple retrieval APIs. Use this to anchor operational events (VC issuance, releases, disputes).

Example:

```
dfx canister call audit_log "recordAudit '(\"identity_canister\", \"VC anchored: sha256:...\")'"
```
