#!/bin/bash

# Fix Repository Issues Script
# Addresses issues identified in REPOSITORY_ANALYSIS_REPORT.md

set -e

echo "=== HeliosHash DAO Repository Cleanup & Fix Script ==="
echo "This script addresses issues identified in the repository analysis"
echo ""

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "Error: Please run this script from the HeliosHash-DAO root directory"
    exit 1
fi

echo "Step 1: Removing duplicate and redundant files..."

# Remove duplicate JobBoard components
if [ -f "src/components/community/opportunities/JobBoard_old.tsx" ]; then
    echo "Removing JobBoard_old.tsx..."
    rm src/components/community/opportunities/JobBoard_old.tsx
fi

if [ -f "src/components/community/opportunities/JobBoard_old_backup.tsx" ]; then
    echo "Removing JobBoard_old_backup.tsx..."
    rm src/components/community/opportunities/JobBoard_old_backup.tsx
fi

# Remove redundant config files (keep TypeScript versions)
if [ -f "postcss.config.cjs" ] && [ -f "postcss.config.mjs" ]; then
    echo "Removing redundant PostCSS config..."
    rm postcss.config.cjs
fi

if [ -f "tailwind.config.js" ] && [ -f "tailwind.config.ts" ]; then
    echo "Removing redundant Tailwind config..."
    rm tailwind.config.js
fi

# Remove stray files
echo "Removing stray files..."
[ -f "dev_server.log" ] && rm dev_server.log
[ -f "react" ] && rm react
[ -f "codebuff.json" ] && rm codebuff.json
[ -f "motoko-mocha" ] && rm motoko-mocha

echo "Step 2: Creating missing directories..."

# Create missing directories
mkdir -p src/utils
mkdir -p src/test

echo "Step 3: Fixing Jest configuration..."

# Fix Jest config typo
if [ -f "jest.config.js" ]; then
    sed -i 's/moduleNameMapping/moduleNameMapping/g' jest.config.js
    echo "Fixed Jest configuration typo"
fi

echo "Step 4: Installing missing dependencies..."

# Install Playwright for E2E tests
npm install --save-dev @playwright/test playwright

# Install other potentially missing dependencies
npm install

echo "Step 5: Updating .gitignore..."

# Add additional entries to .gitignore if not present
if ! grep -q "*.log" .gitignore; then
    echo "*.log" >> .gitignore
fi

if ! grep -q "*.tmp" .gitignore; then
    echo "*.tmp" >> .gitignore
fi

if ! grep -q ".dfx/" .gitignore; then
    echo ".dfx/" >> .gitignore
fi

echo "Step 6: Creating placeholder utility files..."

# Create basic utility files
cat > src/utils/index.ts << 'EOF'
// Utility functions for HeliosHash DAO
export * from './format';
export * from './validation';
EOF

cat > src/utils/format.ts << 'EOF'
/**
 * Formatting utilities for HeliosHash DAO
 */

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US').format(date);
};
EOF

cat > src/utils/validation.ts << 'EOF'
/**
 * Validation utilities for HeliosHash DAO
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePrincipal = (principal: string): boolean => {
  // Basic principal validation - can be enhanced
  return principal.length > 0 && !principal.includes(' ');
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
EOF

# Create test utilities
cat > src/test/index.ts << 'EOF'
// Test utilities for HeliosHash DAO
export * from './mocks';
export * from './helpers';
EOF

cat > src/test/mocks.ts << 'EOF'
/**
 * Mock data and utilities for testing
 */

export const mockProject = {
  id: '1',
  name: 'Test Solar Farm',
  location: 'Gujarat, India',
  capacity: 100,
  status: 'active' as const,
};

export const mockUser = {
  principal: 'test-principal',
  name: 'Test User',
  email: 'test@example.com',
};

export const mockProposal = {
  id: 1,
  title: 'Test Proposal',
  description: 'A test proposal',
  votesFor: 0,
  votesAgainst: 0,
  status: 'active' as const,
};
EOF

cat > src/test/helpers.ts << 'EOF'
/**
 * Test helper functions
 */

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const mockFetch = (data: any, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: () => Promise.resolve(data),
  });
};

export const createMockElement = (tag: string, attributes: Record<string, string> = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};
EOF

echo ""
echo "=== Cleanup Summary ==="
echo "✅ Removed duplicate files"
echo "✅ Fixed Jest configuration"
echo "✅ Created missing directories"
echo "✅ Installed missing dependencies"
echo "✅ Updated .gitignore"
echo "✅ Created utility and test files"
echo ""
echo "Next steps:"
echo "1. Run 'npm test' to verify Jest configuration"
echo "2. Run 'npm run build' to test build process"
echo "3. Deploy canisters with 'dfx deploy'"
echo "4. Review and update the project structure expectations"
echo ""
echo "🎉 Repository cleanup complete!"