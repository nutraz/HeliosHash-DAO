# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core Commands & Workflows

### Installation & Workspace
- **Install dependencies (root workspace)**
  ```bash
  pnpm install
  ```
- The repo is a **pnpm monorepo** (`apps/*`, `packages/*`) orchestrated by **Turborepo**.

### Local IC (DFX) Backend
Key references: `docs/AGENTS.md`, `docs/guides/LOCAL_DEVELOPMENT_GUIDE.md`, `apps/backend/dfx.json`, root `dfx.json`.

Typical ICP workflow:

```bash
# From repo root or apps/backend

# Start local Internet Computer replica
dfx start --clean --background

# (First time) create canisters
dfx canister create --all

# Generate type declarations
dfx generate

# Build canisters
dfx build

# Deploy to local replica
dfx deploy

# Stop local replica
dfx stop
```

Linux/Fedora note (from `docs/guides/LOCAL_DEVELOPMENT_GUIDE.md`): after `dfx deploy`, prefer the "legacy" URL form:

```text
http://127.0.0.1:8000/?canisterId=<frontend-canister-id>
```

### Frontend Development (Next.js)
Key references: `apps/web/package.json`, `apps/web/next.config.{js,cjs}`, `docs/AGENTS.md`.

- **Root dev (runs workspace dev tasks via Turbo)**
  ```bash
  pnpm dev
  ```
- **Frontend-only dev**
  ```bash
  cd apps/web
  pnpm dev    # Next.js dev server (App Router)
  ```
- On Linux/mobile, the dev server is commonly accessed at:
  - `http://localhost:3001` (manual/dev usage)
  - `http://0.0.0.0:3001` (mobile devices on the same network)

### Build, Lint, and Clean
From the repo root (`package.json` + `turbo.json`):

```bash
# Build all workspaces (continues on errors)
pnpm build

# Build only the web app
pnpm build:web

# Lint all workspaces
pnpm lint

# Clean build artifacts
pnpm clean

# DFX-only helpers
pnpm dfx:build
pnpm dfx:deploy
```

### Testing Overview
Testing is split across **frontend (Vitest + Playwright)** and **canisters (Motoko test runner)**.

#### Playwright E2E Tests
Key references: `config/playwright.config.ts`, `docs/guides/LOCAL_DEVELOPMENT_GUIDE.md`, `docs/testing/TEST_CATEGORIES.md`.

- **Run all Playwright tests**
  ```bash
  pnpm exec playwright test
  ```

- **Category-based test scripts** (as documented in `docs/testing/TEST_CATEGORIES.md`):
  ```bash
  # Smoke (critical path)
  pnpm test:smoke

  # Integration (frontend + canisters)
  pnpm test:integration

  # Performance
  pnpm test:performance

  # Security
  pnpm test:security

  # All categories
  pnpm test:all

  # Show available categories
  pnpm test:categories
  ```

- **Run a single E2E spec** (example):
  ```bash
  pnpm exec playwright test e2e/homepage.spec.ts
  ```

Playwright is configured to:
- Use `./e2e` as the test directory and `*.spec.ts` files.
- Start a dev server via `pnpm run dev` (see `webServer` in `config/playwright.config.ts`).
- Use `baseURL` defaulting to `http://localhost:3001` for `page.goto('/')`.

#### Canister Test Runner
Key reference: `docs/testing/TEST_CATEGORIES.md`, `scripts/enhanced-canister-tests.sh`, `canisters/.github/copilot-instructions.md`.

- **Run categorized canister tests**:
  ```bash
  # Smoke tests
  ./scripts/enhanced-canister-tests.sh smoke

  # Integration tests
  ./scripts/enhanced-canister-tests.sh integration

  # Performance tests
  ./scripts/enhanced-canister-tests.sh performance

  # Security tests
  ./scripts/enhanced-canister-tests.sh security

  # All categories
  ./scripts/enhanced-canister-tests.sh all
  ```

#### Unit/Integration Tests (Vitest)
Key reference: `config/vitest.config.ts` and tests under `apps/web/src/**`.

- Vitest configuration:
  - JSDOM environment, global `test`/`expect`.
  - Includes: `src/**/*.{test,spec}.{ts,tsx}` and `src/**/*.{integration,test}.{js,jsx,ts,tsx}`.
  - Excludes Playwright `e2e/**` and build/DFX artifacts.

Typical usage pattern (from root):

```bash
# Run Vitest directly (uses shared config)
pnpm exec vitest

# Run a specific test file (example)
pnpm exec vitest apps/web/src/test/india-compliance.test.ts
```

> If project-level `test` scripts differ or are added later, prefer them over raw `pnpm exec vitest`.

### Turbo-Orchestrated Test & Lint

From the root `package.json`:

```bash
# Run all workspace tests via Turbo
pnpm test

# Run lint across workspaces
pnpm lint
```

Turbo tasks are defined in `turbo.json` (`build`, `dev`, `test`, `lint`, `clean`).

## High-Level Architecture & Structure

### Monorepo Layout

- **Root**
  - `package.json` — pnpm workspace + Turbo scripts.
  - `turbo.json` — defines shared tasks (`build`, `dev`, `test`, `lint`, `clean`).
  - `dfx.json` — minimal Motoko canister config (entry at `src/main.mo`).
  - `config/` — shared tooling configs: Vite, Vitest, Playwright.
  - `docs/` — project documentation, including agent guides and testing strategy.

- **Applications (`apps/*`)**
  - `apps/web/` — Next.js 14 **App Router** frontend (TypeScript + Tailwind).
  - `apps/backend/` — ICP/DFX backend harness and config.
  - `apps/mobile/` — mobile-related tooling and upstream Flutter/Android infra (mostly vendored docs and build files).

- **Packages (`packages/*`)**
  - `packages/urgamu-ui/` — Vite-based UI/component library.
  - `packages/extensions/voicenotesai/` — extension package with its own Node/TS setup and tests.

- **Canisters (`canisters/*`)**
  - Domain-focused Motoko canisters (e.g. `hhdao`, DAO modules) plus shared test runner scripts.

### Frontend (Next.js App Router) Overview

Key references: `apps/web/src/app/**`, `apps/web/package.json`, `config/vitest.config.ts`, `.github/copilot-instructions.md`.

- **Routing**
  - Uses **App Router** under `apps/web/src/app` with route groups for major flows:
    - `(auth)` — login/registration.
    - `(dashboard)` — DAO dashboard views (governance, treasury, projects, profile, etc.).
    - `(public)` — public pages (about, stats, map, etc.).
    - Additional top-level routes: `auth/`, `dashboard/`, `nft/`, `project-hub/`, `wallet-withdraw/`, etc.
  - Root `apps/web/src/app/page.tsx` performs a server-side redirect to `/auth`.

- **State & Services**
  - React components and services live in `apps/web/src/**` (including `services/` and feature folders).
  - Tests for services and flows are colocated, e.g. `apps/web/src/services/**/__tests__/*.test.ts` and `apps/web/src/test/*.test.ts`.
  - Vitest uses an alias `@` (configured in `config/vitest.config.ts`) for imports from the app `src` directory.

- **Config & DX**
  - `apps/web/next.config.js` and `next.config.cjs` configure build behavior and relax TypeScript/ESLint enforcement during builds.
  - `apps/web/package.json` exposes the usual `dev`, `build`, `start`, and `lint` scripts.

- **Testing Integration**
  - Playwright (`config/playwright.config.ts`) drives E2E tests under `e2e/` using the dev server started via `pnpm run dev`.
  - Category tags (`@smoke`, `@integration`, `@performance`, `@security`) are used in Playwright specs to drive the category scripts documented in `docs/testing/TEST_CATEGORIES.md`.

### ICP / Motoko Canister Architecture

Key references: `docs/AGENTS.md`, `.github/copilot-instructions.md`, `canisters/.github/copilot-instructions.md`, `canisters/hhdao/src/**`.

- **Domain-Driven Layout**
  - Each major business domain (DAO core, governance, treasury, NFT, micro_grants, etc.) is modeled as its own canister or module under `canisters/`.
  - Within each canister directory:
    - `src/main.mo` — actor entrypoint.
    - `src/lib.mo` — core business logic and shared utilities.
    - `src/types/*.mo` — shared type definitions and error types (e.g. `canisters/hhdao/src/types/errors.mo`).
    - `test/` or `.test.mo` files — unit or scenario tests.

- **Patterns & Conventions** (from Copilot instructions)
  - Keep **business logic in `lib.mo`**, and use `main.mo` as a thin actor wrapper.
  - Use `Result.Result<Payload, Text>` for errors and user-facing messages.
  - Public canister methods are `async`, and identity is handled via `shared ({ caller })`.
  - Shared error handling is centralized (e.g., `CustomError` and helpers in `errors.mo`).

- **Canister Testing**
  - Test runner scripts live under `test-runner/` and related directories (see `canisters/.github/copilot-instructions.md`).
  - `scripts/enhanced-canister-tests.sh` orchestrates categorized test runs aligned with the frontend test categories.

### Cross-Cutting Rules for Agents

These rules are distilled from `docs/AGENTS.md` and `.github/copilot-instructions.md`:

- **ICP-first backend**
  - Treat the backend as **Motoko canisters on Internet Computer**, not a traditional Node/Express backend.
  - Backend build and deploy are handled by **DFX**, not npm scripts.

- **Keep canister boundaries clear**
  - Each domain canister is self-contained; avoid introducing circular dependencies between canisters/modules.
  - Shared logic within a domain belongs in that domain’s `lib.mo`, not in unrelated canisters.

- **Use generated bindings on the frontend**
  - TypeScript bindings for canisters are generated via `dfx generate`/`dfx deploy` and consumed from `src/declarations/**` (when present).
  - Frontend code should prefer these generated types over ad-hoc interfaces.

- **Mocked auth/wallet flows**
  - Authentication, wallet, and UPI/payment flows are **mocked/simulated**; do not implement real payment or wallet integrations in this repo.

- **Follow existing patterns**
  - When adding features:
    - For frontend, mirror existing route and component patterns under `apps/web/src/app/**` and related services/tests.
    - For canisters, follow the `main.mo` (entrypoint) + `lib.mo` (logic) structure and add categorized tests where appropriate.
  - Prefer actual code patterns over older or aspirational documentation when in doubt.
