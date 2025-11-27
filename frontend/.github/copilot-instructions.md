% Copilot instructions for HeliosHash-DAO Web

These short instructions help an AI coding agent be productive in this repository.

## Quick facts & commands

- Dev server: `pnpm dev` (runs `next dev -p 3002`). Use this for local development.
- Build: `pnpm build` (Next.js build).
- Start (production): `pnpm start`.
- Lint: `pnpm lint`.
- Unit tests: `pnpm test` (Vitest). Interactive UI: `pnpm test:ui`. Headless run: `pnpm test:run`.
- E2E tests: `pnpm test:e2e` (Playwright).

## Big-picture architecture (what to know fast)

- This is a Next.js (v14) web app using the App Router. Primary entry is `src/app/`.
  - Server components are the default. Files that need client behavior include an explicit `"use client"` at the top.
  - Global layout and providers live in `src/app/layout.tsx` and `src/app/globals.css`.
- UI components are in `components/` (feature-organized subfolders). Example: `components/ui`, `components/layout/Navigation.tsx`.
- App-specific pages and feature routes live under `src/app/<feature>` (e.g. `src/app/dashboard/page.tsx`, `src/app/projects/page.tsx`).
- Shared logic and integrations are in `lib/` (look for `lib/api/`, `lib/contracts/`, `lib/services/`).
- Auth and global state providers: `contexts/AuthContext.tsx`.
- This repo integrates with DFINITY canisters (see `@dfinity/*` deps) and keeps candid declarations under `declarations/` (e.g. `declarations/project_hub/project_hub.did`). Changes to canister interfaces require updating these files and coordinating with backend build/codegen.

## Project-specific conventions and patterns

- Prefer the App Router conventions: server components for data fetching, client components for interactive UI. Look for `"use client"` when deciding.
- Styling: TailwindCSS + utility classes. Variant helpers use `class-variance-authority` and `tailwind-merge`.
- UI primitives: Radix UI (`@radix-ui/*`) + `lucide-react` for icons. Keep primitive wrappers in `components/ui`.
- State & data fetching: `@tanstack/react-query` is used for remote data; Auth is exposed via `contexts/AuthContext.tsx`.
- Tests: Vitest + Testing Library for unit/interaction tests. Example test path: `components/ui/__tests__/button.test.tsx`.

## Integration points & external dependencies (important touch points)

- DFINITY / Internet Computer: `@dfinity/agent`, `@dfinity/auth-client`, `@dfinity/candid`, and `.did` declarations in `declarations/`.
  - When changing canister APIs, update the `.did` and any generated JS/TS bindings used by `lib/contracts/`.
- Ethereum-related helpers use `ethers` in `lib/` or `components/exchange/` areas.
- i18n: `locales/en/translation.json` + `react-i18next` (update translations when adding visible strings).

## Files to inspect first when working on a feature

- `src/app/layout.tsx` — top-level layout, providers, and global CSS inclusion.
- `contexts/AuthContext.tsx` — how authentication flows and identity are provided to components.
- `lib/api/` and `lib/contracts/` — network / canister calling patterns.
- `declarations/project_hub/project_hub.did` — canonical example of a canister declaration.
- `components/ui/__tests__/button.test.tsx` — representative unit test showing testing patterns.

## Small, actionable edit patterns (examples)

- Adding a client-only interactive component:
  - Create the file under `components/` with `"use client"` at the top.
  - Use existing UI primitives (button, input) from `components/ui` to maintain consistency.
- Fetching data server-side in a route:
  - Prefer server component data fetching (e.g. call `lib/api` from a server component in `src/app/...`) and pass props to client subcomponents.
- Updating canister usage:
  - Update the `.did` in `declarations/`, regenerate bindings if you have a codegen step, and then update `lib/contracts/` calls.

## Do not assume / cautions

- Don't assume pages live under `pages/` — this project uses the App Router (`src/app/`).
- Avoid large combined refactors touching `apps/social-media-core` nested folders and `src/` in the same PR unless coordinated; the nested `apps/social-media-core/.../src/` exists and may contain shared/core logic.

## Where to look for more context

- `package.json` (scripts & deps) — confirm commands before running.
- `src/app/` and `components/` for examples of layout, composition, and the use of server vs client components.

If anything above is unclear or you want me to add CI examples, codegen commands for the DFINITY bindings, or more precise file examples, tell me which area to expand and I will update this file.
