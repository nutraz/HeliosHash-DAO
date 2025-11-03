#!/bin/bash

echo "=== Setting up Testing Infrastructure ==="

# Install testing dependencies
pnpm add -D jest @types/jest ts-jest eslint-plugin-testing-library @testing-library/react @testing-library/jest-dom

# Create test configuration
cat > jest.config.js << 'JEST'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
JEST

echo "✅ Testing infrastructure ready"
echo "Run tests with: pnpm test"
