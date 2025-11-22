# HeliosHash DAO – 25-Line Agent Cheat Sheet (Nov 19 2025)

Repo: /home/nutarzz/HeliosHash-DAO/HHDAO-FUSION
Stack: Next.js14 + Flutter + ICP Motoko + Polygon Solidity
Chains: ICP (governance) ↔ Polygon (RWAs via bridge)

Sacred rules:
- TS only, no JS
- No mock auth → use ICP Internet Identity
- Every feature needs Playwright/Flutter test
- 48 h timelock on mainnet proposals

Top commands:
./scripts/dev-setup.sh       # everything local
dfx deploy --network=local
npm run bridge:sync
npm run audit:prep

High-priority TODOs:
1. Replace mock auth
2. Bridge message verification
3. Full E2E Playwright proposal flow
4. IndiaStack KYC
5. Link UrgamU dashboard to 1WP dApp

India/1WP tags for every PR: 1WP-Merit:+xxxx, india-rwa, @nutraazz @crypdohcrypto
