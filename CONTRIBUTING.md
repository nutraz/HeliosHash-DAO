# Contributing to HeliosHash DAO

HeliosHash DAO is a mission-critical infrastructure project under the
One World Project → UrgamU → HeliosHash initiative.

We follow strict quality, security, and governance standards.

---

## Roles
- **H#00 – Lead Architect (YOU)**
- **H#01 – Core Maintainer (Nick)**
- **H#02…H#11 – Initial Maintainers**
- Future maintainers are added only through DAO governance.

---

## Workflow Rules
1. All changes go through Pull Requests.
2. PR must pass:
   - `pnpm lint`
   - `pnpm build`
   - `dfx build`
   - All tests
3. At least **2 CODEOWNER approvals** required.
4. No direct pushes to `main`.
5. No secrets, ICP identities, or env variables in commits.

---

## Local development
```
pnpm install
pnpm dev
dfx start --background
dfx build
```

---

## Commit Style
Use descriptive commits:
```
feat: add role selector page
fix: stabilize AuthContext re-render loop
chore: CI update for canister tests
```

---

## Security Expectations
- Do not commit `.pem` keys
- Use `dfx identity` locally, never push IDs
- Review canister changes carefully
- Any auth change requires H#00 + H#01 approval

---

## DAO Governance
Major architectural changes require:
- A proposal
- Approval by H#00 + H#01
- Long term: on-chain vote

---

Thank you for building HHDAO responsibly.
