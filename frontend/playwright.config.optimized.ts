import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Reduced retries for speed
  workers: process.env.CI ? 2 : 4, // Optimized worker count
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    actionTimeout: 10000, // Reduced from 30s
    navigationTimeout: 15000, // Reduced from 30s
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Performance optimizations
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Global timeout per test
  timeout: 30000,

  // Expect timeout
  expect: {
    timeout: 10000
  }
});
