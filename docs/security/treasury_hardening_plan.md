# Treasury Hardening Plan (HeliosHash DAO)

This document outlines low-risk, high-impact steps to harden the on-chain treasury canister and surrounding operational practices.

Goal: Prevent single-point-of-failure fund drains, enforce multi-party governance, and ensure auditable, minimal-trust operations.

## Quick summary

- Implement an on-chain multisig / timelock pattern for high-value operations (mint, burn, large transfers).
- Lock critical configuration until explicit DAO governance sets canister references.
- Add read-only status endpoints and monitoring for treasury changes.
- Introduce off-chain approvals + on-chain verification (threshold signatures or guardian pattern).
- Perform a professional Motoko/IC audit and a security review of any signer key custody.

## Low-risk code changes (priority)

1) Add `setDaoCanister` and `setIdentityCanister` guards (already present)
   - Ensure these methods can only be called once or by a configured admin group.
   - Keep the `locked` flag; document expected lifecycle.

2) Multisig wrapper (recommended):
   - Create a separate `TreasuryGuard` canister or integrate a multisig module in `treasury/ledger.mo`.
   - Pattern: `proposeTx` -> collect `N` signatures -> `executeTx` after threshold reached.
   - Use small, audited helper functions that only call `Ledger.transfer` after threshold verification.

3) Timelock on large transfers (defense-in-depth)
   - For transfers exceeding a configurable threshold, require a time delay (e.g., 24–72h) before execution.
   - Allow emergency veto by DAO governance during the window.

4) Minimize privileged callers
   - Avoid leaving deployer or single principal with live mint/burn authority.
   - Prefer the DAO canister or a DAO voting outcome to be the ultimate authority (set via `setDaoCanister`).

5) Read-only status & audit hooks
   - `getSecurityStatus()` (added) and `getMeta()` provide lightweight audit info.
   - Add event logs (tx meta) that can be exported for off-chain monitoring.

## Operational recommendations

- Use a hardware-backed signing solution or multi-party custody for keys.
- Establish an emergency rotation plan (rotate owner principal with a multisig vote).
- Maintain an off-chain escrow for critical private keys (air-gapped HSM) and test recovery drills.

## Monitoring & alerting

- Export ledger txs to an off-chain indexer (e.g., via a small service that polls `listTx`) and alert on large outgoing transfers or governance changes.
- Integrate with Slack/Matrix/Email for on-call alerts.

## Testing & verification

- Add unit tests for multisig and timelock logic using the repo's Motoko test runner.
- Run `pnpm test:canister` (see repo scripts) and include integration tests where the DAO proposes and treasury executes transfers.

## Audit

- Before moving funds, commission a Motoko/smart-contract audit from a reputable firm.
- Fix critical and high issues; re-run tests and do a public post-audit disclosure.

## Next actionable steps I can take now

1. ✅ Implement a minimal on-chain multisig module under `canisters/treasury/multisig.mo` (dev-only, test-covered).

2. ✅ Add timelock checks in `treasury/main.mo` for transfers > threshold.

3. ✅ Add an off-chain script in `scripts/treasury_monitor.js` that polls `treasury.listTx` and emits alerts for large transfers.

## Additional Security Enhancements Implemented

4. ✅ Governance integration with emergency pause/resume functions
5. ✅ Vote thresholds (51% regular, 75% emergency proposals)
6. ✅ Enhanced security status monitoring
7. ✅ Multi-authorization for treasury operations

## Additional Security Enhancements Implemented

8. ✅ **RBAC with Principle of Least Privilege**
   - Implemented comprehensive role-based access control
   - Function-level access modifiers for all treasury operations
   - Clear separation of privileges across DAO, Governance, Multisig, Identity, and User roles

9. ✅ **Upgradeable Proxy Pattern with Governance Control**
   - Created `proxy.mo` canister for upgradeable treasury functionality
   - 7-day timelock for upgrades requiring governance approval
   - Secure upgrade process preventing unauthorized changes

## Remaining High-Priority Items (from user feedback)

- Complete independent smart contract audit by reputable firm
- Publish all token contract addresses on-chain
- Implement Proof of Reserves mechanism
- Obtain legal opinion on securities classification
- Deploy multi-sig for all token operations (multisig canister exists, needs deployment)
- Deploy upgradeable proxy pattern (proxy canister created, needs deployment)
