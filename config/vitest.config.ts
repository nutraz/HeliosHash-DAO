import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  // Register DOM test helpers (jest-dom) and any workspace-level setup.
  // The path is relative to the repo root when this config is re-exported.
  setupFiles: ['./config/src/test/setup.ts'],
  // Include tests from apps, packages, and root tests only; avoid third-party
  // packages that ship their own tests in node_modules.
  include: [
    'apps/**/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
    'packages/**/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
    'tests/**/*.{test,spec}.{ts,tsx,js,jsx}',
    'tests/unit/**/*.{test,spec}.{ts,tsx,js,jsx}',
  ],
  exclude: [
      'src/test/index.test.ts',
      'src/test/integration/**',
  'e2e/**',
  // Some Playwright-style tests live under `tests/**` and playbook folders.
  'tests/**',
  // Do not run Playwright or other integration tests inside the unit test runner
  // so Vitest does not try to execute @playwright/test specs.
  'tests/**',
  // Ensure we exclude third-party tests in nested node_modules
  // Block tests under node_modules at any depth (some packages contain tests)
  '**/node_modules/**',
  'node_modules/**',
  'node_modules.bak/**',
  // Do not run Svelte backend tests from workspace root — apps/backend has its own setup.
  'apps/backend/**',
      'dist/**',
      '.dfx/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      // Make `@/` point to the web app src directory by default so workspace-wide
      // tests using `@/...` for the web app resolve correctly when run from root.
      '@': path.resolve(__dirname, '../apps/web/src'),
      // Keep a dedicated alias in case other packages need to import web sources
      '@web': path.resolve(__dirname, '../apps/web/src'),
    },
  },
});
