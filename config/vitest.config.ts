import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{integration,test}.{js,jsx,ts,tsx}'],
    exclude: [
      'src/test/index.test.ts',
      'src/test/integration/**',
      'e2e/**',
      'node_modules/**',
      'node_modules.bak/**',
      'dist/**',
      '.dfx/**',
    ],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
