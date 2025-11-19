# Compliance Checklist (Developer)

This file tracks legal and compliance items that must be completed before public launches or accepting funds.

## Securities & Tokens

- [ ] Remove all investment solicitation language from public-facing docs (README, PILOT.md, marketing content)
- [ ] Add clear "Not investment advice" disclaimers and a no-solicitation statement (done in README)
- [ ] Determine whether tokens are securities in jurisdictions where users may be located (consult securities lawyer)
- [ ] If tokens are securities, implement KYC/AML, registration, and reporting procedures as required by law
- [ ] Avoid any token sale or fundraising until legal clearance

## Data Privacy

- [ ] Remove PII from public docs and test fixtures
- [ ] Audit all data collection endpoints and mappings (privacy audit)
- [ ] Implement data subject rights (access, correction, deletion)
- [ ] Register with local authorities if required

## Consumer Protection

- [ ] Provide clear risk disclosures on the website and docs
- [ ] Add Terms of Service and Refund/Dispute policy (draft created)
- [ ] Ensure no false or misleading claims about production readiness or guaranteed returns

## Operational

- [ ] Turn off any demo flows that imply real-money transfers
- [ ] Move secret storage out of localStorage and into secure KMS/backends
- [ ] Harden canisters and perform independent Motoko audits

## File-specific remediation (developer tasks)

- `README.md` — Completed: removed direct investor solicitation lines and added clear disclaimers. Review marketing pages and `PILOT.md` for remaining phrasing.
- `app/dashboard/page.tsx`, `app/auth/login/page.tsx`, `src/components/PrivacyDashboard.tsx` — Replace `localStorage` usage for storing user profiles with server-side sessions or secure cookies. Add consent checks before storing demographic data.
- `app/payment/upi/page.tsx` — Mark as experimental and ensure form submissions are validated and not stored in plaintext. Add explicit consent checkbox for any personal data.
- `src/services/privacyComplianceService.ts` — Move from in-memory to persistent encrypted storage; integrate with KMS and set up role-based ACLs for audit logs.
- `app/components/WalletPanel.tsx` and `app/wallet/*` — Ensure private keys are never stored; document wallet integration as client-side only and require signing for any sensitive action.
- `hhdao_mobile_access.json`, `mobile_test_server.js` — Remove any remaining real user references and confirm history was scrubbed where necessary.
- `docs/security-audit-2025-10-19.md` — Keep as audit record but remove screenshots or logs that contain PII; redact sample balances if they are real accounts.

## High-priority legal & operational actions

1. Engage a securities lawyer to determine if OWP token usage or any token mechanics could be construed as securities (SEC, SEBI jurisdiction assessment).
2. Suspend any fundraising or token sale plans until legal clearance.
3. Perform a privacy/data-flow audit and remediate all localStorage or insecure data storage patterns.
4. Harden authentication and session management (move to HTTP-only cookies, server-side sessions, or OAuth/JWT with short lifetimes and revocation support).
5. Schedule professional Motoko/smart-contract audits before any mainnet or public deployment.

---

Keep this checklist updated and link it to issue tracking (create GitHub issues for each high-priority item). Prioritize items 1–3 before accepting any external users or funds.

## Recommended next steps

1. Engage securities counsel to review token model and fundraising plans (SEC/SEBI jurisdictions)
2. Engage a privacy lawyer for GDPR/Indian privacy compliance
3. Perform professional audits for smart contracts and the backend
4. Run a privacy/data-flow audit and remediate PII exposures

---

Keep this checklist synced with `SECURITY.md` and `PRIVACY.md`. Mark items complete as legal review or engineering work is performed.
