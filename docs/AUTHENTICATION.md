# HeliosHash DAO — Authentication Design

This document describes the authentication strategy for HeliosHash DAO (HHDAO), aligned to the Three-Tier Roll-Out Strategy (Baghpat pilot, Urgam Special Energy Zone, and nationwide replication).

Summary
- Primary auth: Internet Computer Internet Identity (II) for production and staging.
- Secondary/fallback: 1WP session wallet integration (when available) and a local mock for developer experience.
- Strong privacy and minimal data retention: only store principal + minimal profile in localStorage; KYC data is handled separately and not persisted in plaintext.

Goals
- Provide secure, decentralized identity for on-chain interactions.
- Ensure reproducible local developer experience (mock fallback for II).
- Enable optional KYC flows (IndiaStack/Aadhaar) for regulated features while isolating sensitive data.
- Keep Baghpat pilot separate from Urgam funding and governance — auth/state must not conflate funding sources.

Architecture & Components

- Client-side
  - `AuthClient` (`@dfinity/auth-client`) is used to log users in via Internet Identity.
  - `apps/web/src/contexts/AuthContext.tsx` is the canonical React context the app uses. It already implements:
    - `login()` / `logout()` using `AuthClient`.
    - `handleAuthentication` to create canister actors (if enabled via env) and hydrate a minimal profile.
    - A development bypass that populates a debug principal in `development` mode.
  - Dev fallback: a lightweight mock principal stored in `localStorage` for developer flows and E2E tests.

- Backend / Canister integration
  - When `NEXT_PUBLIC_ENABLE_ACTOR` is `true` and canister IDs are present, the AuthContext will create actors referencing the authenticated identity. This enables server-side KYC checks, proposal signing, and other privileged actions.

- KYC / Identity issuance
  - KYC and ID-NFT minting are executed as background tasks triggered after authentication using `ensureKycAndMint(...)` (see `apps/web/src/contexts/AuthContext.tsx`).
  - KYC data collection and verification must be implemented with strict consent flows and secure server/canister interfaces — do not persist Aadhaar or other PII in client localStorage.

Environment variables (web)
- `NEXT_PUBLIC_ENABLE_ACTOR` — `true` to create canister actors on auth.
- `NEXT_PUBLIC_HHDAO_CANISTER_ID` — canister ID for HHDAO actor creation.
- `NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID` — optional local II canister ID for dev.
- `NEXT_PUBLIC_DFX_NETWORK` — `ic` for public network, otherwise local dev assumed.

Developer experience
- Local dev: If a local II replica is available (`http://127.0.0.1:4943`), the login command will prefer it; otherwise it falls back to `https://identity.ic0.app`.
- Debug bypass: in `development` the `AuthContext` temporarily seeds a debug principal to make local UI testing easier. Remove or disable this for staging/mainnet.

Layer-specific Considerations (A / B / C)

Layer A — Baghpat (Pilot)
- Purpose: demonstration; auth should be minimal and focused on onboarding residents and contributors.
- Policy: KYC optional for basic participation; required for any financial staking or payout features.
- Implementation note: Use Internet Identity for principal issuance; keep KYC modular so pilot can use a lightweight mock for testing.

Layer B — Urgam Valley (Special Energy Zone)
- Purpose: higher-assurance operational zone.
- Policy: KYC required for governance participation that affects material assets (timelocks, treasury ops).
- Implementation: Stronger linkage between II principals and identity attestations (KYC via IndiaStack where legally required). Use back-end canisters to store attestations and role assignments (not raw PII).

Layer C — Replication & Network Growth
- Purpose: scale and federation.
- Policy: Allow flexible integration points — regional KYC providers, federated identity bridges.
- Implementation: Maintain canonical mapping from principal → attestations (KYC/roles). Do not reuse pilot funding or conflate governance state across zones without explicit cross-chain or cross-canister governance flows.

Security & Privacy Best Practices
- Never store sensitive PII in `localStorage` or public canisters.
- Use canister-based attestations to represent KYC and minted ID NFTs; store only hashes/timestamps on-chain.
- Use short-lived tokens for any server-side operations; prefer principal-based authorization.
- Logging: avoid logging full principals or PII in production logs. Truncate principals if necessary for debugging.

Operational notes
- CI / E2E: Use mock identities for automated tests (Playwright should run against a dev server with mocked II). Ensure tests don't call public II endpoints.
- Migration: If canister interface changes require new IDL, run `dfx generate` and update TS bindings.

Developer checklist to enable real II in staging
1. Set `NEXT_PUBLIC_DFX_NETWORK=ic`.
2. Deploy canisters or configure `NEXT_PUBLIC_HHDAO_CANISTER_ID` for staging backend.
3. Remove the debug bypass in `AuthContext` (or gate it behind a feature flag and secure it).
4. Test login/logout flows with a staging II instance and verify KYC/mint background tasks.

References
- `apps/web/src/contexts/AuthContext.tsx` — current React integration.
- `apps/web/src/lib/actorFactory.ts` — actor creation helper.
- DFINITY docs: https://internetcomputer.org/docs/current/references/internet-identity

---

If you want, I can:
- Extract `AuthClient` logic into a dedicated `apps/web/src/lib/auth/internetIdentity.ts` adapter and update `AuthContext` to import from it.
- Add Playwright fixtures for mock identities and update `apps/web/e2e` tests to use them.
- Implement a server-side attestation canister pattern for KYC-backed role assignment (Motoko/IC).  

Which of these follow-ups should I do next?