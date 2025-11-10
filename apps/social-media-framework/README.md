# social-media-framework

This package contains integration-test scaffolding for the Social Media Framework used by the HeliosHash monorepo.

How to run integration tests

1. From the repository root or the package folder, install dependencies (if you haven't already):

```bash
cd apps/social-media-framework
pnpm install
```

2. Run the integration tests:

```bash
pnpm run test:integration
```

Notes on Safe Mode

- SAFE_MODE is set by the integration test setup to `true` to avoid making live API calls in tests.
- The provided `test/setup.integration.ts` sets `process.env.SAFE_MODE = 'true'` and `process.env.MAX_POSTS_PER_DAY = '1'`.
- If you need to run integration tests against real providers, set `SAFE_MODE=false` and provide the necessary secrets. Only do this in a controlled environment (local dev with disposable accounts or gated CI).

Environment & requirements

- Node.js >= 16
- pnpm (v7/8 recommended)
- A working network connection for any tests that reach external services (the default tests use SAFE_MODE to avoid external calls).

CI

There is a minimal GitHub Actions workflow under `.github/workflows/ci.yml` (inside this package) that demonstrates running the integration tests in SAFE_MODE. It is gated to only run when files inside `apps/social-media-framework/**` change.

Troubleshooting

- If vitest reports "No test files found", ensure your test files match the glob `**/*.integration.test.ts` (see `vitest.integration.config.ts`).
- If `pnpm run test:integration` fails with missing modules, run `pnpm install` at the package root.
# HeliosHash Social Media Framework

Lightweight, extensible social media orchestration service for HeliosHash projects (Urgamu, Baghpat, etc.).

This scaffold provides safe provider stubs, content templates, a strategy manager, and a minimal orchestrator so you can plug in real API keys and wire event triggers later.

Quick start

1. Copy the example env file and fill secrets:

```bash
cd apps/social-media-framework
cp .env.example .env
```

2. Install (use pnpm/npm/yarn per your preference):

```bash
pnpm install
```

3. Run the local runner (TypeScript runtime required, e.g. ts-node or compile first):

```bash
# with ts-node (recommended for development)
pnpm run start:dev
```

Important notes

- Files include clear TODO markers where real API calls and keys are required.
- Providers are mock-safe by default and only log outgoing posts.
- Integrations with the Internet Computer are stubbed and must be wired to canister events.

Where to start editing

- `src/core/SocialMediaOrchestrator.ts` — main entrypoint for orchestration logic
- `src/providers/*` — place to implement real API adapters
- `src/integrations/ICIntegration.ts` — hook canister events here

Please provide API credentials and preferred posting policy (rate limits, do-not-post windows) before enabling live posting.
