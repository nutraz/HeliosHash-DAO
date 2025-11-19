import { FullConfig, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface CanisterIds {
  [canisterName: string]: {
    local: string;
  };
}

async function globalSetup(config: FullConfig) {
  // 1. Load canister IDs (if present) and set env vars for tests
  try {
    const canisterIdsPath = path.resolve(__dirname, '../.dfx/local/canister_ids.json');
    if (fs.existsSync(canisterIdsPath)) {
      const canisterIds: CanisterIds = JSON.parse(fs.readFileSync(canisterIdsPath, 'utf-8'));
      for (const [canisterName, ids] of Object.entries(canisterIds)) {
        if (ids.local) {
          process.env[`CANISTER_ID_${canisterName.toUpperCase()}`] = ids.local;
        }
      }
    }
  } catch (e) {
    console.warn('[global-setup] Could not load canister IDs:', e);
  }

  // 2. Create a pre-authenticated storage state (mock wallet / auth) + embed mock data
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Inject mock wallet/auth prior to any page scripts
    await context.addInitScript(() => {
      // Basic mock objects – extend as real auth evolves
      // @ts-ignore
      window.walletConnected = true;
      // @ts-ignore
      window.user = { id: 'mock-user', level: 1, rewards: 100 };
      // Use a cookie for mock-token instead of sessionStorage
      document.cookie = 'auth-token=mock-token; path=/';

      // Provide deterministic mock datasets consumed by pages that currently use in-component mock data.
      // These can be read by application code if we later wire it to window.__TEST_DATA__.
      // @ts-ignore
      window.__TEST_DATA__ = {
        jobs: [
          {
            id: 'job-1',
            title: 'Blockchain Protocol Engineer',
            company: 'Helios Labs',
            location: 'Remote',
            tags: ['blockchain', 'motoko', 'internet computer'],
            applications: 12,
            postedDaysAgo: 2,
          },
          {
            id: 'job-2',
            title: 'Frontend React Developer',
            company: 'SolarWave',
            location: 'Bangalore, India',
            tags: ['react', 'ui', 'typescript'],
            applications: 4,
            postedDaysAgo: 5,
          },
          {
            id: 'job-3',
            title: 'Smart Contract Auditor',
            company: 'SecureChain',
            location: 'Remote',
            tags: ['audit', 'blockchain', 'security'],
            applications: 8,
            postedDaysAgo: 1,
          },
        ],
        rewards: {
          available: [
            { id: 'rew-1', name: 'Early Contributor', amount: 25 },
            { id: 'rew-2', name: 'Bug Hunter', amount: 15 },
          ],
          claimed: [{ id: 'rew-10', name: 'Genesis Supporter', amount: 50 }],
          achievements: [
            { id: 'ach-1', title: 'First Project Vote' },
            { id: 'ach-2', title: 'Deployed a Canister' },
          ],
        },
      };
    });

    // A blank page to force storage state persistence
    const page = await context.newPage();
    // Network routing: if the app later fetches these endpoints, serve deterministic fixtures.
    try {
      await page.route('**/api/jobs', async (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify((window as any).__TEST_DATA__?.jobs ?? []),
        });
      });
      await page.route('**/api/rewards', async (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify((window as any).__TEST_DATA__?.rewards ?? {}),
        });
      });
    } catch (rErr) {
      console.warn('[global-setup] route mocking failed (non-fatal):', rErr);
    }
    await page.goto('about:blank');
    await context.storageState({ path: 'e2e/auth-state.json' });
    await context.close();
    await browser.close();
  } catch (e) {
    console.warn('[global-setup] Could not generate auth storage state:', e);
  }
}

export default globalSetup;
