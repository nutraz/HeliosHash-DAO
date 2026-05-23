# Demo Polish — MVP2 Single Demo Path

**Status: SCOPE ONLY — awaiting sign-off. No code changed.**

Goal: one clean demo/user path a real person can follow end-to-end —
*open HeliosHash → connect identity → land on dashboard → understand the
solar/energy project → see token/reward/treasury status → know the next action.*

---

## 1. Current demo path inventory

| Route | Works? | Data source | Real on-chain? |
|---|---|---|---|
| `/` (home) | ✅ | server `redirect('/dashboard')` | n/a (routing) |
| `/dashboard` | ✅ gated | **auth = real II** (`useAuth().login('/dashboard')`, H0c.2). Solar stats (420M kWh / 1200 panels / Baghpat) from `@/services/icpService` getters = **mock, hardcoded**. Profile "Rahul Kumar / Level 6", balance 15000, reputation 85/100 = **hardcoded**. Action buttons = mock `icpService`, DEMO-gated. | Auth only. Content mocked. |
| `/projects/helios-baghpat` | ✅ public | `useHeliosLiveStats` (`@/lib/api/heliosBaghpat`): tries canister → HTTP proxy → **mock fallback** (248.3 kWh, 0.0032 BTC, 87% crop, 1825 members) | Attempts canister, falls back to mock |
| `/helioshash-dao` | ✅ public | **second dashboard.** Fake "Connect Wallet" toggle (local state only) **and** `AuthButtons` "Sign in"→`/auth/signin`. `<Dashboard/>` fetches `/api/users` (no `/api` app dir → 404 → always mock "Rahul Kumar" / 15000 HHD). Send/Receive → `/wallet/send`,`/wallet/receive`. | No |
| `/wallet` | ⚠️ | hardcoded **"MetaMask" / "0.842 BTC"** | No |
| `/wallet/send` | ⚠️ | POSTs `/api/wallet` (likely 404) | No |
| `/rewards` | ⚠️ | "1200 HSH" + two "(placeholder)" cards | No |
| `/nft`, `/nfts` | ⚠️ | mock grids; `/nft` "View Details" is a dead button; NFTDetail has `TODO: replace with API` | No |

**Real on-chain/canister-backed in the web demo path: essentially nothing.** Internet
Identity auth is real; `helios-baghpat` *attempts* a canister then falls back; all other
data is mock/hardcoded. (Consistent with [[deployed-canisters-are-stubs]] — deployed
canisters are stubs.)

DEMO_MODE: global amber non-dismissible banner ("DEMO MODE — actions shown are simulated,
not on-chain.") renders in `app/layout.tsx` when `NEXT_PUBLIC_DEMO_MODE=true`; the same
flag gates `icpService` action methods (throw "coming soon" when off, fabricated receipts
when on).

## 2. Friction points

1. **Two dashboards** — `/dashboard` (gated, solar-rich, alert-driven) vs `/helioshash-dao`
   (ungated, simpler, **fake** Connect-Wallet toggle). The core confusion. The general
   `login()` fallback and all three "Back to Dashboard" links point at the *ungated twin*.
2. **Fake success state** — `/helioshash-dao` "Connect Wallet" button only flips local
   state; nothing connects.
3. **The "understand the project" step is unreachable from the dashboard** — "Explore
   Projects" is an `alert()`, with no link to `/projects/helios-baghpat`.
4. **Dead-ends / fake dialogs on `/dashboard`** — most buttons are `alert()`/`prompt()`;
   DEMO-gated actions silently no-op when the flag is off.
5. **Auth-route sprawl & inconsistent gating** — 8+ entry points (`/auth`, `/auth/multi`,
   `/auth/signin`, `/auth/signup`, `/login`, `/sign-in`, `/demo-auth`, `/connect-wallet`);
   `/opportunities` hard-redirects to `/login`, `/dashboard` uses an inline gate, everything
   else is public.
6. **Wrong mental model** — `/wallet` shows "MetaMask / 0.842 BTC" for an ICP/HHD solar DAO.
7. **Identity mismatch** — hardcoded "Rahul Kumar" shown to every user, including a
   just-connected real principal.
8. **No single clear "next action"** anywhere on the path.

## 3. Recommended MVP2 demo path

**Route sequence:** `/` →(redirect)→ `/dashboard` (connect gate) → *Connect Internet
Identity* → `/dashboard` (authenticated) → **"Explore the Baghpat solar project"** CTA →
`/projects/helios-baghpat` → Back → `/dashboard`.

**User story:** *"I open HeliosHash, connect my Internet Identity, land on my dashboard,
see the Baghpat solar project's energy output and my token/reward/treasury status — all
clearly marked as a demo — click one clear button to explore the project in depth, and
return knowing my next step."*

**What the user sees:** honest connect gate → persistent DEMO banner → one dashboard with
solar stats + token/reward/treasury summary (visibly simulated) → one prominent CTA.

**What the user can safely do:** connect / disconnect (real II); view simulated stats;
navigate to the project page and back; trigger simulated actions **only while the DEMO
banner is visible** (otherwise actions honestly report "coming soon" — no fake on-chain
success).

## 4. Implementation plan

**Smallest PR (frontend-only; no canister / token / OWP / 1gigE changes):**

1. `app/helioshash-dao/page.tsx` → replace body with `redirect('/dashboard')` (1 line, same
   pattern as `/`). Collapses the two dashboards into one; the fake Connect-Wallet twin
   disappears; the login fallback, onboarding/Skip, and the three "Back to Dashboard" links
   all funnel to the single gated `/dashboard`.
2. `app/dashboard/page.tsx` → add **one** prominent `<Link href="/projects/helios-baghpat">`
   "Explore the Baghpat solar project →" CTA. Makes the "understand the project" step
   reachable and closes the loop.
3. Run/deploy the demo with `NEXT_PUBLIC_DEMO_MODE=true` (env/config only — no code) so the
   banner shows and simulated actions are labeled.

**Chained consequences (all improvements, none breaking):** redirecting `/helioshash-dao`
makes the login fallback (`AuthContext.tsx:176`) and the "Back to Dashboard" links double-hop
to `/dashboard`; `AuthContext.redirect.test.tsx` is unaffected (push-target string unchanged);
`HeliosHashDAO.tsx` / `components/dashboard/Dashboard.tsx` become unrouted (leave in place —
deletion is separate cleanup).

**Follow-ups (NOT in the smallest PR):** replace `/dashboard` alert()/prompt() side-buttons
with honest inline UI; fix `/wallet` "MetaMask/BTC" → ICP/HHD; `/rewards` placeholders;
`/nft` dead button; consolidate auth-route sprawl; show the connected principal instead of
"Rahul Kumar"; repoint the "Back to Dashboard" hrefs + login fallback directly to `/dashboard`
(drop the redirect hop) and update the two redirect-test assertions.

## 5. Acceptance criteria

| Criterion | Status |
|---|---|
| Visitor completes the path without confusion | **This PR** — single dashboard + reachable project step + one CTA |
| Demo/simulated actions clearly marked | **Already met** (global DEMO banner, H16a) when flag on |
| Dashboard remains auth-gated | **Already met** (H0c.2); unchanged |
| No private content leaks to unauthenticated users | **Already met** (H0c.2 gate; prerender verified); unchanged |
| No fake on-chain success unless demo mode visibly active | **Already met** (actions throw "coming soon" when off; banner when on); unchanged |

Prior campaigns already satisfy the four security/honesty criteria; this PR adds the missing
**UX coherence** (one dashboard, a reachable project step, a clear next action).

---

## Recommended single smallest implementation PR

**`feat(web): single demo path — collapse to one dashboard + project CTA`**
- `app/helioshash-dao/page.tsx`: `redirect('/dashboard')`.
- `app/dashboard/page.tsx`: one "Explore the Baghpat solar project →" link to
  `/projects/helios-baghpat`.
- Deploy/run with `NEXT_PUBLIC_DEMO_MODE=true`.

Two files, frontend-only. Closes the two-dashboard fork and makes the end-to-end loop
walkable. Everything else is deferred follow-up.

**Stopping for sign-off — no implementation.**
