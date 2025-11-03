import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: [
      'src/test/governance.test.ts',
      'src/test/compliance.test.ts', 
      'src/test/index.test.ts',
      'src/utils/**/*.test.ts',
      'src/services/wallets/__tests__/multiChainWallet.test.ts',
      'src/services/cache.test.ts'
    ],
    exclude: [
      'src/test/LocalGovernanceDashboard.integration.test.tsx',
      'src/test/animal-care.test.ts',
      'src/test/integration/canister-integration.test.ts', 
      'src/services/authService.test.ts',
      'src/services/api.projects.spec.ts',
      'src/test/india-compliance.test.ts',
      'src/services/wallets/__tests__/treasuryIntegration.test.ts'
    ]
  }
});
