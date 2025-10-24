// Simple Playwright config for running against existing dev server
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.ts/,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
<<<<<<< HEAD
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
=======
    baseURL: 'http://localhost:3001', // ← match your dev server
  },
  webServer: {
    port: 3004,
    reuseExistingServer: true,
    timeout: 60000,
>>>>>>> audit-clean
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
<<<<<<< HEAD
  // No webServer config - assume dev server is already running
=======
>>>>>>> audit-clean
});
