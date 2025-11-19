# Clean Directory Structure Plan (HeliosHash-DAO)

## Essential Directories/Files to KEEP
- app/
- src/
- pages/
- public/
- canisters/
- contracts/
- lib/
- scripts/
- docs/
- prisma/
- server.ts
- package.json
- pnpm-lock.yaml
- README.md
- .github/
- .env.local
- tailwind.config.ts
- tsconfig.json
- vitest.config.ts
- vite.config.ts
- next.config.ts
- Dockerfile
- docker-compose.yml
- dfx.json
- test/ (merge all tests here)
- extensions/ (only active extensions)
- mobile_hhdao_server.js
- mobile-setup.sh
- mobile-qr.sh
- start-mobile.sh
- start-mobile-dev.sh
- PILOT.md
- COPILOT_CONTEXT.md
- PRODUCTION_READY.md
- SECURITY.md
- TERMS_OF_SERVICE.md
- PRIVACY.md
- VISION.md
- RISK_MITIGATION_PLAN.md
- COMPLIANCE.md
- CONTRIBUTING.md
- TODO.md
- CRITICAL_FIXES_TODO.md

## REMOVE (delete or archive):
- All logs: dev-server.log, dev.log, dev.nohup.log, mobile_server.log
- All temp/cache/build artifacts: temp/, cache/, build/, artifacts/, node_modules/, __pycache__/, out/
- Duplicate/legacy folders: HeliosHash-DAO/ (subdir), test/ vs tests/ (merge into test/)
- Unused scripts, configs, markdowns not referenced in docs/scripts
- Old/backup/irrelevant files: other-structure.txt, llm_full.txt, test-analytics.json, test_current_proximity.js, test_proximity_system.js, test-dao-governance.sh, test-dao-simple.sh, test-threshold.mo, etc.
- Multiple VSIX files in extensions/voicenotesai/ (keep only latest or as needed)
- Multiple package-lock.yaml, pnpm-lock.yaml (keep only the one matching your package manager)
- pubspec.lock (if not using Dart/Flutter)
- android/, ios/, web/, flutter_assets/, native_assets/, unit_test_assets/ (if not using Flutter/mobile)
- wasm/, sys/, temp/, cache/ (if not referenced)
- .iml, .idea/

## Next Steps
- Confirm this plan or specify exceptions.
- Proceed to delete/archive the above items.
- Merge all tests into test/.
- Clean up scripts and extensions as needed.
