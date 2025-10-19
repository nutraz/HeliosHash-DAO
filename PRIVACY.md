# Privacy Policy (Draft)

This is a draft privacy policy and compliance checklist intended for project maintainers and legal review. It is not a substitute for legal advice.

## Summary

- Project: HeliosHash DAO (development/research)
- Data controller: Project maintainers (see repository owner)
- Purpose: Development, testing, and community research. No production data processing without legal/compliance review.

## What we collect

- Public blockchain addresses and on-chain data (when interacting with canisters)
- Minimal development/test user profile data (display names, non-sensitive metadata)
- Logging and telemetry data for debugging (IP addresses, user agent, timestamps) — minimized and masked where possible
- Consent-driven optional metadata (e.g., gender for research features)

## Principles

- Minimize data collection
- Keep data encrypted at rest and in transit
- Store only for as long as necessary for the stated purpose
- Provide mechanisms for data access, correction, and deletion where applicable

## Data handling checklist (developer actions)

- [ ] Map where PII is stored in the codebase (search for `localStorage`, `storeGender`, `user`, `email`)
- [ ] Stop storing secrets in localStorage; use secure cookies or ephemeral session storage
- [ ] Move logs with IPs to a secure logging backend and redact before public sharing
- [ ] Use encryption for sensitive fields (AES-256 or equivalent) and manage keys with a secure KMS
- [ ] Add consent flows where collecting optional gender or demographic data
- [ ] Document retention periods for data and implement automatic deletion
- [ ] Implement an access control policy for staff and maintainers

## Rights & Requests

- Provide contact for data access, correction, or deletion requests (TODO: add email/contact)
- Respond to GDPR/SEBI/other applicable jurisdictional requests within required timeframes (seek legal counsel)

## Legal & Regulatory

- Determine whether data processing requires registration under local privacy laws (e.g., GDPR, Indian IT Rules, SEBI guidance)
- If processing includes special categories (sensitive personal data), follow stricter controls and consent

## Next steps

- Convert this draft into a formal `PRIVACY.md` and publish once legal review is complete
- Add a small data subject request handling endpoint (protected) for manual requests

---

### Code → Data Mapping (quick inventory)

The following files/components have been identified in the codebase and map to personal or sensitive data. Use this list to prioritize remediation.

- `src/services/privacyComplianceService.ts` — consent records, encrypted gender data, privacy settings, audit logs (in-memory in current code). Supports: storeGenderData, withdrawConsentAndDeleteData, getPrivacyDashboard.
- `app/api/privacy/route.ts` — API endpoints that call the privacy service (storeGender, updateGender, withdrawConsent, audit log retrieval).
- `src/components/PrivacyDashboard.tsx` — UI that obtains consent and displays privacy dashboard (reads/writes via `privacyService`).
- `app/dashboard/page.tsx` and `app/auth/login/page.tsx` — read and write `localStorage` key `user` (profile data, mock identities).
- `app/admin/page.tsx` and `middleware.ts` — admin/auth flows read `auth_token` (cookie/local storage); `server.ts` previously added an `AUTH_TOKEN` env check.
- `app/components/WalletPanel.tsx`, `app/wallet/*`, and `mobile_hhdao_server.js` — wallet addresses and token balance display (on-chain data). These interact with wallets via `window.ethereum` or test fixtures; avoid storing private keys.
- `hhdao_mobile_access.json`, `mobile_test_server.js`, and other demo assets — contain placeholder or sample balances and may include PII in older commits (sanitized but double-check history).
- `app/payment/upi/page.tsx` — collects name/email/phone in UI (mock/payment flows). Treat as sensitive until formalized.
- `pages/api/createProposal.js` and other API endpoints — may accept user-submitted content; ensure inputs are validated and sanitized before storage or rendering.

High-level notes:

- Several modules use in-memory or localStorage storage for consent and profiles. In production these must be replaced with encrypted persistent storage, KMS-managed keys, and audit controls.
- Never store private keys or long-lived secrets in localStorage. Use secure HTTP-only cookies or short-lived server sessions.

### Data Subject Requests (DSR) — minimal procedure (developer-facing)

1. Contact point: add `privacy@helioshash.org` and `security@helioshash-dao.org` to repository secrets/docs and public `SECURITY.md` if not already present.
2. Verification: require requestor to prove control of account (sign a message from their wallet address or provide other verified identity proof). Log verification steps in the audit log.
3. Export: provide user data export in JSON (include consent records, audit events, stored non-sensitive profile fields). Redact IPs and user agents before export unless legitimately requested with legal basis.
4. Rectification: accept updates via authenticated endpoint; log changes and notify the user.
5. Deletion: on verified deletion requests, call `privacyService.withdrawConsentAndDeleteData(userId, reason)` or equivalent; ensure backups and logs are considered and that deletion cascades to any persistent stores and third parties.
6. Timeline: acknowledge request within 7 calendar days; complete action within 30 calendar days (adjust per legal advice and jurisdictional obligations).

### Minimal developer actions (immediate)

- [ ] Add/confirm `privacy@helioshash.org` contact and DSR email in `SECURITY.md` and `PRIVACY.md`.
- [ ] Replace any storage of sensitive data in `localStorage` with secure server-side storage or HTTP-only cookies for session tokens.
- [ ] Encrypt PII at rest (AES-256 or equivalent) and manage keys via a KMS (AWS KMS, GCP KMS, HashiCorp Vault).
- [ ] Add logging redaction for IP addresses and user agents when returning audit logs to users.
- [ ] Implement the DSR endpoints (protected) under `app/api/privacy/` if not already present (they exist but must be hardened and backed by persistent, auditable storage).

---

_This draft is developer-facing. After implementing remediation, produce a user-facing `PRIVACY_POLICY.md` reviewed by counsel._
