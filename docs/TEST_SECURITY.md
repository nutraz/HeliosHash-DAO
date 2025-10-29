# Security Tests Guide

This guide explains how to run security-focused tests for HeliosHash-DAO.

## Overview

Security tests are split across Vitest (API/integration) and Playwright (browser/E2E):

- Vitest
  - tests/security/api-auth.spec.ts — validates minimal API auth behavior
  - tests/security/rate-limit.spec.ts — exercises rate limiting (requires small limits)
  - tests/security/input-sanitization.spec.ts — placeholders for future sanitization tests

- Playwright
  - playwright/tests/security-xss.spec.ts — attempts XSS via common search input

## Prerequisites

- Dev server running locally:

```bash
pnpm dev
```

- For rate limit tests, start server with small limits (separate terminal):

```bash
RATE_LIMIT_MAX=5 RATE_LIMIT_WINDOW_MS=60000 pnpm dev
```

- To enforce API auth checks, set an auth token when starting the server:

```bash
AUTH_TOKEN=changeme pnpm dev
```

## Run Tests

- Vitest:

```bash
pnpm test:run -- tests/security
```

- Playwright (@security tag):

```bash
npx playwright test --grep "@security"
```

## Notes

- Tests auto-skip when the server is not reachable, or when required env vars are not set.
- XSS test uses a heuristic selector for search input; it will skip if not found.
- Add more app-specific tests as features and APIs stabilize.
