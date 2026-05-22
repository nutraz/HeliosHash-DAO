# Campaign A — Web Surface Hardening (scope doc)

**Status:** SCOPING ONLY — awaiting sign-off before any implementation.
**Date:** 2026-05-23
**Implementation targets (later):** `apps/web/` only (frontend). No backend/Motoko/canister changes.

Locations below were **verified against the working tree** (not just transcribed from the
private review). One correction is flagged in H16b.

## Findings in scope (with triaged severity)

### LIVE-exploitable today
- **H15 — Unvalidated `permalink` → `<a href>` (javascript:-URL XSS).** `apps/web/src/components/NFTDetailModal.tsx` — `assetData.permalink` bound to `href` at **lines 102 and 124**; `permalink` can derive from the OpenSea API response, so a `javascript:` value executes on click.
- **H16b — Secrets read via bare `process.env` in client-imported files.** **Correction to the review (which attributed this to `icpService.ts`):** the actual reads are `apps/web/src/services/kycService.ts:26` (`process.env.KYC_API_KEY`) and `apps/web/src/services/privacyComplianceService.ts:75` (`process.env.GENDER_ENCRYPTION_KEY`). If Next.js bundles these modules into client JS, the values ship to every browser.

### Live deception / hygiene (not direct exploitation)
- **H16a — Mock service returns `Math.random()` as tx receipts.** `apps/web/src/services/icpService.ts:23,27,32,36` (`createProject`/`transferTokens`/`postUpdate` return random ids + `tx_<ts>_<rand>`). Users believe on-chain actions occurred that didn't. (A second `apps/web/src/lib/services/icpService.ts` also uses `Math.random()` — confirm which is wired before fixing.)
- **H16c — PII in `console.log`.** `apps/web/src/services/privacyComplianceService.ts` (review cites :383). Trivial deletion.

### Latent / dev-only / no-grant
- **H0a — Mock auth provider grants `role:'admin'` to any login (latent).** `apps/web/src/context/AuthContext.tsx:32`. Dead code today (provider never mounted); future foot-gun.
- **H0b — Dev auth bypass authenticates every visitor (dev/local only).** `apps/web/src/contexts/AuthContext.tsx:223-224` (`NODE_ENV==='development'` → hardcoded principal `plmu2-…-tqe`); same principal in `apps/web/src/components/auth/InternetIdentityButton.tsx:11`. DCE'd in prod/Vercel.
- **H0c — Hardcoded plaintext creds in sign-in (no privilege grant).** `apps/web/src/app/sign-in/page.tsx:19` (`user@hhdao.com / password`), creds leaked in the error text at :22; on success routes to `/dashboard` (`apps/web/src/app/dashboard/page.tsx`) which has **no auth guard**.

## Proposed order (severity-first)

1. **H15** — smallest blast radius, biggest payoff.
2. **H16b** — secret bundle exposure; prove with bundle inspection (below).
3. **H16a** — **blocked on the product call** (see Decisions); treat as its own mini-scope round.
4. **Cleanup rollup** — one commit, each fix its own hunk: **H0c** (remove creds + creds-leaking error + add `/dashboard` guard) · **H16c** (delete PII logs) · **H0a** (delete dead admin-granting mock provider).
5. **H0b decision** — last; founder call (comment-and-keep vs strip). No live risk either way.

## Per-finding acceptance criteria

- **H15** — `href` only accepts an allowlisted URL scheme (`https:` / `http:` / `ipfs:`); anything else (e.g. `javascript:`) renders inert (disabled/`#`). Probe: a crafted `javascript:`-scheme permalink produces no executable href; a legitimate `https`/`ipfs` permalink still links out.
- **H16b** — env reads moved to server-only module(s); no client-imported file reads `KYC_API_KEY`/`GENDER_ENCRYPTION_KEY`. **PROVABLE acceptance (not code-review-attested):** run `next build` (`pnpm build:web`), then grep the built client output for both names:
  ```
  grep -rn "KYC_API_KEY\|GENDER_ENCRYPTION_KEY" apps/web/.next/static apps/web/.next/**/*.js
  ```
  → **must return zero hits** in client bundles (and the key *values* must not appear either).
- **H16a** — per the signed-off `NEXT_PUBLIC_DEMO_MODE` decision (below). Acceptance: `next build` with `NEXT_PUBLIC_DEMO_MODE=false` → a mocked action surfaces a clearly-marked user-facing error (UI shows `Coming soon`, not fake success); `next build` with `NEXT_PUBLIC_DEMO_MODE=true` → the `DEMO MODE — actions are simulated, not on-chain` banner is visible above the fold on every page.
- **H16c** — the PII `console.log`(s) deleted; grep confirms no PII logged.
- **H0c** — hardcoded creds + creds-leaking error message removed from `sign-in/page.tsx`; `/dashboard` redirects/blocks unauthenticated access. Probe: opening `/dashboard` unauthenticated no longer renders.
- **H0a** — dead mock provider **deleted entirely** (founder decision: delete-or-throw, never narrowed to a default user role); if imports break, fall back **only** to `throw new Error("not implemented")`. Consumers (`ProtectedRoute.tsx`, `ClientLogin.tsx`, `ClientRegister.tsx`) confirmed unaffected; one auth context remains.
- **H0b** — **kept** (founder decision); the verbatim DEV-ONLY documenting comment (see Founder decisions) is added near the dev branch; nothing stripped.

## Founder decisions (signed off 2026-05-23)

### H16a — `NEXT_PUBLIC_DEMO_MODE` flag (not real ICP integration yet)
- `NEXT_PUBLIC_DEMO_MODE=true`: mock services continue working as today.
- UI MUST show a prominent, persistent, **above-the-fold banner**: `DEMO MODE — actions are simulated, not on-chain`.
- `false` or unset (**production default**): mock services **throw a clear user-facing error**; the calling UI surfaces **`Coming soon`**, never fake success.
- Acceptance:
  - `next build` with `NEXT_PUBLIC_DEMO_MODE=false` → a mocked action surfaces a clearly-marked error in the UI.
  - `next build` with `NEXT_PUBLIC_DEMO_MODE=true` → the banner is visible above the fold on every page.

### H0b — keep, with documenting comment
Retain the dev-only branch; add this comment **verbatim** near it:
```
// DEV ONLY: this branch is dead-code-eliminated by Next.js in production builds via the NODE_ENV check. Removing the NODE_ENV gate would expose this auth bypass in production. Do not remove.
```

### H0a — delete entirely
Delete the dead mock auth provider that grants admin role to any login. If imports break, fall back **only** to `throw new Error("not implemented")`. Do **not** narrow it to a default user role. Delete or throw — nothing in between.

## Non-goals

- Any finding **beyond the A list** (e.g. H1/H3/H4/H7–H14, and the on-chain items already closed).
- **CI-infra residuals from the gate-restoration commit** (`8af8996`): the `PNPM Security Audit` `cache: 'pnpm'`-before-install ordering, the `trufflehog@main` floating tag, the `ci.yml` 0s parse failure — these belong to the **future full CI campaign**, not here.
- **Future-compat:** OWP, 1gigE, SubDAO, tribute splits.
- No backend, Motoko, or canister changes; no dependency upgrades (`next@14` bump is H11, separate).
