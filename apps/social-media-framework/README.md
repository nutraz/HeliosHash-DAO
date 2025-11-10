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
<!-- If you have a logo file, place it at `apps/social-media-framework/logo.png` and it will display here -->
![logo](./logo.png)

# social-media-framework

This package contains integration-test scaffolding for the Social Media Framework used by the HeliosHash monorepo.

## How to run integration tests

1. From the repository root or the package folder, install dependencies (if you haven't already):

```bash
cd apps/social-media-framework
pnpm install
```

2. Run the integration tests:

```bash
pnpm run test:integration
```

### Notes on Safe Mode

- SAFE_MODE is set by the integration test setup to `true` to avoid making live API calls in tests.
- The provided `test/setup.integration.ts` sets `process.env.SAFE_MODE = 'true'` and `process.env.MAX_POSTS_PER_DAY = '1'`.
- If you need to run integration tests against real providers, set `SAFE_MODE=false` and provide the necessary secrets. Only do this in a controlled environment (local dev with disposable accounts or gated CI).

## Environment & requirements

- Node.js >= 16 (Node 18+ recommended)
- pnpm (v7/8 recommended)
- A working network connection for any tests that reach external services (the default tests use SAFE_MODE to avoid external calls).

## Unit tests

This package contains a tiny unit test example (`src/example.unit.test.ts`) that tests a small exported function (`src/sum.ts`). Run unit tests with:

```bash
pnpm run test
```

## TypeScript

The package includes a small TypeScript helper (`src/sum.ts`) with an exported `SumResult` type. Vitest runs TypeScript tests using the project's tooling (esbuild) so no extra setup is required for these examples.

## CI

There is a GitHub Actions workflow under `.github/workflows/ci.yml` that runs the package tests in SAFE_MODE. The workflow uses a small node-version matrix and caches pnpm state to speed up runs. It is triggered when files inside `apps/social-media-framework/**` change.

## Troubleshooting

- If vitest reports "No test files found", ensure your test files match the glob `**/*.integration.test.ts` (see `vitest.integration.config.ts`).
- If `pnpm run test:integration` fails with missing modules, run `pnpm install` at the package root.

## About this scaffold

Lightweight, extensible social media orchestration service for HeliosHash projects (Urgamu, Baghpat, etc.).

This scaffold provides safe provider stubs, content templates, a strategy manager, and a minimal orchestrator so you can plug in real API keys and wire event triggers later.

### Quick start

1. Copy the example env file and fill secrets:

```bash
cd apps/social-media-framework
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the local runner (TypeScript runtime required, e.g. ts-node or compile first):

```bash
# with ts-node (recommended for development)
pnpm run start:dev
```

### Important notes

- Files include clear TODO markers where real API calls and keys are required.
- Providers are mock-safe by default and only log outgoing posts.
- Integrations with the Internet Computer are stubbed and must be wired to canister events.

### Where to start editing

- `src/core/SocialMediaOrchestrator.ts` — main entrypoint for orchestration logic
- `src/providers/*` — place to implement real API adapters
- `src/integrations/ICIntegration.ts` — hook canister events here

Please provide API credentials and preferred posting policy (rate limits, do-not-post windows) before enabling live posting.
