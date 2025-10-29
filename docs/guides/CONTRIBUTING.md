# Contributing to HeliosHash DAO

Thank you for helping build a regenerative, community-owned energy future!

## Requirements for All Contributions

- **Vision Alignment**: All code and content must align with the principles in `VISION.md`.
- **Multilingual UI**: All new features must include Hindi and Gujarati UI strings (see `/src/i18n/` for examples).
- **Mobile-First, Low-Bandwidth**: Design for rural users and slow networks by default.
- **No Speculative Tokens**: Do not introduce tokenomics or features that encourage speculation.
- **Community Review**: Major changes require review by at least one local community member or steward.


## Test Types: E2E vs. Unit/Integration


HeliosHash DAO uses two types of automated tests:

- **Playwright E2E tests** (`e2e/`):
		- Run in a real browser against the full app (dev server must be running).
		- Validate real user flows: login, navigation, wallet, dashboard, etc.
		- Run with: `pnpm exec playwright test` (see `playwright.config.ts`).
		- **Recommended for most contributors.**

- **Vitest/Jest unit & integration tests** (`src/test/`):
		- Run in Node.js/JSDOM, not a real browser.
		- Test React components and logic in isolation.
		- May fail if mocks or async UI state are not handled.
		- Run with: `pnpm test:run` (currently disabled by default).
		- **Optional for component-level TDD or advanced debugging.**

> For most PRs, passing Playwright E2E tests is sufficient. You do not need to fix or run Vitest/Jest tests unless you are working on low-level component logic.

---

1. Fork the repo and create a feature branch.
2. Add/modify code, tests, and documentation.
3. Ensure all UI/UX is accessible in Hindi, Gujarati, and English.
4. Run all tests and structure checks before submitting a PR.
5. Submit a pull request with a clear description and screenshots (if UI).

## Code of Conduct

- Be respectful, inclusive, and collaborative.
- Prioritize local needs and feedback.
- Build for stewardship, not extraction.

---

_“The Sun is the only celebrity.”_
