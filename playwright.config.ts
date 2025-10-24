// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: /.*\.(spec|e2e)\.(ts|tsx|js)/,
  testIgnore: [
    '**/node_modules/**',
    '**/node_modules.bak/**',
    'src/**',
    'tests/**',
    'dist/**',
    '.dfx/**',
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  webServer: {
    command: 'pnpm dev:e2e',
    port: 3001,
    reuseExistingServer: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'smoke',
      testMatch: /.*\.spec\.ts/,
      grep: /@smoke/,
    },
    {
      name: 'security',
      testMatch: /.*\.spec\.ts/,
      grep: /@security/,
      use: {
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'X-Test-Security': 'true',
          'X-Security-Test-Mode': 'enabled',
        },
      },
      timeout: 90_000,
    },
  ],

  outputDir: 'test-results/',
  metadata: {
    project: 'HeliosHash DAO',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    buildId: process.env.BUILD_ID || 'local',
  },
});
