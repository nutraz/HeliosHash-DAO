# Testing Frameworks & Quality Assurance

HeliosHash DAO uses a multi-layered testing approach to ensure reliability and correctness across frontend and backend components.

---

## 1. Unit Testing (Frontend)
- **Framework:** Vitest
- **Location:** `test/`, `src/components/__tests__/`, etc.
- **Run:**
  ```bash
  pnpm test:run
  ```
- **Coverage:** UI components, hooks, and utilities

---

## 2. End-to-End (E2E) Testing
- **Framework:** Playwright
- **Location:** `e2e/`
- **Run:**
  ```bash
  pnpm test:e2e
  ```
- **Coverage:** User flows, job board, governance, mobile QR flows

---

## 3. Motoko Canister Testing
- **Framework:** Custom Motoko test runner
- **Location:** `canisters/test-runner/`
- **Run:**
  ```bash
  pnpm test:canister
  ```
- **Coverage:** Business logic in Motoko canisters

---

## 4. Manual Testing
- **Guide:** See `MANUAL_TESTING_GUIDE.md` for manual test cases and procedures

---

## 5. Badges & Status
- [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/nutraz/HeliosHash-DAO)

---

## 6. Adding Tests
- Place new unit tests in `test/` or alongside components
- Add E2E tests in `e2e/`
- For Motoko, add `.test.mo` files and use the test runner

---

For troubleshooting, see `docs/development-setup.md` and `MANUAL_TESTING_GUIDE.md`.
