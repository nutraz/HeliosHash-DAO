import { defineConfig, devices } from '@playwright/test';

/**
 * Enhanced Playwright Configuration for HeliosHash DAO
 * Supports web, mobile, and performance testing
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.ts/,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Global timeout for each test */
    actionTimeout: 10000,

    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Global setup and teardown */
  globalSetup: './e2e/global-setup.ts',

  /* Test timeout */
  timeout: 60000,

  /* Expect timeout */
  expect: {
    timeout: 10000,
  },

  /* Configure projects for major browsers */
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

    /* Test against mobile viewports. */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Tablet testing */
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad Pro'] },
    },

    /* Smoke tests - Critical path tests */
    {
      name: 'smoke',
      testMatch: /.*\.spec\.ts/,
      grep: /@smoke/,
      use: {
        ...devices['Desktop Chrome'],
      },
      timeout: 30000,
    },

    /* Integration tests - Canister integration tests */
    {
      name: 'integration',
      testMatch: /.*\.spec\.ts/,
      grep: /@integration/,
      use: {
        ...devices['Desktop Chrome'],
      },
      timeout: 60000,
    },

    /* Performance testing project */
    {
      name: 'performance',
      testMatch: /.*\.spec\.ts/,
      grep: /@performance/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--enable-precise-memory-info',
          ],
        },
      },
      timeout: 120000,
    },

    /* Security testing project */
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
      timeout: 90000,
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Metadata for test runs */
  metadata: {
    project: 'HeliosHash DAO',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    buildId: process.env.BUILD_ID || 'local',
  },
});
