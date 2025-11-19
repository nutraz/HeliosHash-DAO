const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage-jest',
  testMatch: [
    '<rootDir>/**/jest/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/**/*.jest.{test,spec}.{ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
<<<<<<< HEAD
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
=======
    '<rootDir>/src/.*\\.test\\.(ts|tsx)$',
>>>>>>> audit-clean
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
