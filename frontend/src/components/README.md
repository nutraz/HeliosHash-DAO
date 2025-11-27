# Dashboard Components (HeliosHash)

This directory contains the dashboard components used by the HeliosHash web app.

Components:
- ProfileCard - main user profile card with PFP, badges & quick actions
- QuickActions - grid of action tiles (wallet, rewards, opportunities)
- NFTGallery - gallery of user NFTs
- WalletPanel - wallet summary & actions
- RewardsHubButton / OpportunitiesButton / SocialHubButton - CTA buttons

Usage:
Import components from `@/components/dashboard/*`.

Storybook:
- Start Storybook locally: `pnpm --filter apps/web start-storybook -p 6006`.

E2E:
- Run Playwright tests: `pnpm --filter apps/web test:e2e`.

Design tokens:
- `tokens.json` contains spacing, colors, typography to keep visual consistency.
