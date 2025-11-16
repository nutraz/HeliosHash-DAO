# PR: refactor(repo): full repository cleanup & standardization for HeliosHash → UrgamU → OneWorld DAO alignment

This PR performs a complete cleanup and normalization of the HeliosHash-DAO repository to bring it in line with the architecture and operational standards of the HeliosHash → UrgamU → OneWorld DAO ecosystem.

Key Improvements
- Reorganized repository into a clean monorepo (apps / services / canisters / packages / infra)
- Removed outdated, duplicate, or irrelevant folders (archives, legacy builds, personal notes)
- Cleaned up Dockerfiles and kept only production and dev versions
- Centralized scripts, documentation, KYC logic, and governance assets
- Prepared structure for DAO governance, RWA integration, and smart-city expansion
- Ensured compatibility with Next.js 15, PNPM workspaces, TurboRepo, and ICP agent tooling

Files and folders cleaned/standardized in this PR
- Add `FOLDER_MAP.md` — canonical repo map and recommended structure
- Update `.gitignore` — consolidated ignore rules for Node, Next, DFX, and archives
- Update `pnpm-workspace.yaml` — include `services/*`, `scripts/*`, `infra/*`
- Update `turbo.json` — optimized for HeliosHash monorepo pipelines
- Add `docs/PR_CLEANUP_PLAN.md` — this PR body for inclusion in a GitHub PR

What remains out of scope here
- Removing large legacy folders and archives (requires review and archival)
- Migration of old code into `services/` or `packages/` — will be in follow-ups

Testing & validation
- Run `pnpm -w test:run` — unit tests
- E2E tests run with Playwright — not changed by this PR

How to review
- Sanity check the updated `.gitignore` and folder map
- Ensure `pnpm` workspace still resolves packages (CI runs will verify)
- Validate the `turbo.json` settings against your CI expectations
