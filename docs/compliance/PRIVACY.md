# Privacy Policy

Last Updated: October 2025

This Privacy Policy describes how HeliosHash DAO ("we," "us," or "our") collects, uses, and protects your information when you use our platform, website, and related services (collectively, the "Service").

## 1. Information We Collect

### 1.1 Information You Provide

- **Account Information**: When you create an account or participate in our DAO, we may collect your wallet address, display name, and profile information.
- **KYC Information**: For certain features requiring identity verification, we may collect government-issued ID, Aadhaar number (India), or other verification documents.
- **Communications**: When you contact us or participate in community discussions, we collect the content of those communications.

### 1.2 Information We Collect Automatically

- **Blockchain Data**: Public wallet addresses, transaction history, and on-chain activity.
- **Usage Data**: How you interact with our Service, including pages visited, features used, and time spent.
- **Device Information**: IP address, browser type, operating system, and device identifiers.
- **Cookies and Tracking**: We use cookies and similar technologies to enhance your experience.

### 1.3 Information from Third Parties

- **KYC Providers**: Verification data from identity verification services.
- **Blockchain Networks**: Transaction and balance information from public blockchain networks.

## 2. How We Use Your Information

- **Provide the Service**: Process transactions, manage your account, and deliver DAO functionality.
- **Security and Compliance**: Verify identities, prevent fraud, and comply with legal requirements.
- **Communication**: Send important updates, respond to inquiries, and provide customer support.
- **Improvement**: Analyze usage patterns to improve our Service and develop new features.
- **Legal Obligations**: Comply with applicable laws, including anti-money laundering and know-your-customer regulations.

## 3. Information Sharing and Disclosure

We do not sell your personal information. We may share your information in the following circumstances:

- **With Your Consent**: When you explicitly agree to sharing.
- **Service Providers**: With trusted third parties who help us operate the Service (under strict confidentiality agreements).
- **Legal Requirements**: When required by law, court order, or to protect our rights and safety.
- **Business Transfers**: In connection with a merger, acquisition, or sale of assets.

## 4. Data Security

We implement appropriate technical and organizational measures to protect your information:

- **Encryption**: Data is encrypted in transit and at rest using industry-standard protocols.
- **Access Controls**: Limited access to personal data on a need-to-know basis.
- **Regular Audits**: Security assessments and penetration testing.
- **Incident Response**: Procedures to address potential security incidents.

## 5. Data Retention

We retain your information for as long as necessary to provide the Service and comply with legal obligations:

- **Account Data**: Retained while your account is active and for a reasonable period thereafter.
- **Transaction Data**: Retained as required for tax, legal, and regulatory purposes.
- **KYC Data**: Retained for the duration required by applicable regulations.

## 6. Your Rights

Depending on your location, you may have the following rights:

- **Access**: Request a copy of your personal information.
- **Correction**: Request correction of inaccurate or incomplete information.
- **Deletion**: Request deletion of your personal information (subject to legal requirements).
- **Portability**: Request transfer of your data in a structured format.
- **Objection**: Object to processing based on legitimate interests.
- **Consent Withdrawal**: Withdraw consent for processing based on consent.


To exercise these rights, contact us at [privacy@helioshash.org](mailto:privacy@helioshash.org).

## 7. International Data Transfers

Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.

## 8. Children's Privacy

Our Service is not intended for children under 18. We do not knowingly collect personal information from children under 18.

## 9. Cookies and Tracking Technologies

We use cookies and similar technologies to:

- Remember your preferences
- Analyze site usage
- Provide personalized content
- Ensure security

You can control cookie settings through your browser preferences.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on our website and updating the "Last Updated" date.

## 11. Contact Us

If you have questions about this Privacy Policy or our data practices, please contact us:

- **Email**: [privacy@helioshash.org](mailto:privacy@helioshash.org)
- **Address**: [Project Address - To be added after legal entity formation]

## 12. Governing Law

This Privacy Policy is governed by the laws of India, with specific provisions for GDPR compliance where applicable to EU users.

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
