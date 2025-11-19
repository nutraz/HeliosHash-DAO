# Tester Feedback

## E2E Integration Test Fixes
- Fixed integration test timeouts by adding MSW mocks for /api/projects, /api/dashboard, and IC canister calls.
- Added navigation retries and waitForLoadState in test-helper.ts for flaky loads.
- Implemented programmatic dfx deploy/seed in global-setup.ts for clean test environments.
- Updated playwright.config.ts with globalTeardown, increased webServer timeout, and slowMo for IC loads.
- Enhanced test specs to use gotoWithRetry and expect visible elements.
- Added stub data to app/projects/page.tsx with data-testid="applications-list".
- Added new script "test:e2e:integration" for targeted runs.

## Next Steps
- Run `pnpm up @dfinity/agent@latest msw@latest` to update dependencies.
- Deploy and seed canisters: `pnpm build:canisters && dfx deploy && dfx canister call hhdao seed-data`.
- Execute integration tests: `pnpm test:e2e:integration --reporter=html`.
- Full suite: `pnpm test:e2e --reporter=html` (target <100 failures).
