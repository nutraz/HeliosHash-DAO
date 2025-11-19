<<<<<<< HEAD
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.js'],
  exclude: ['tests/**', 'e2e/**', '**/node_modules/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@web": path.resolve(__dirname, "src"),
    },
  },
=======
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
  },
>>>>>>> 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))
});
