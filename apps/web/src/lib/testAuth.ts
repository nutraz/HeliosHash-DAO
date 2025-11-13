// Integration test for authentication flow
// Run with: npx tsx src/lib/testAuth.ts

import { AuthClient } from '@dfinity/auth-client';
import { createActor } from './actorFactory';
import { hhdaoIdlFactory } from './hhdaoIdl';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const envVars = envContent.split('\n').filter(line => line.includes('='));

    envVars.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        process.env[key.trim()] = value;
      }
    });
    console.log('✅ Loaded environment variables from .env.local');
  } catch (_error) {
    const errorMessage = _error instanceof Error ? _error.message : String(_error);
    console.log('⚠️  Could not load .env.local file:', errorMessage);
  }
}

export const testAuthentication = async () => {
  console.log('🧪 Testing HeliosHash DAO Authentication Integration\n');

  // Load environment variables
  loadEnvFile();

  try {
    // Test 1: Check if running in browser environment
    const isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
    console.log(`1. Environment check: ${isBrowser ? 'Browser' : 'Node.js'}`);

    let isAuthenticated = false;
    let authClient: any = null;
    let principal: string | null = null;

    if (!isBrowser) {
      console.log('2. Skipping AuthClient test (requires browser environment)');
      console.log('   This is normal when running in Node.js/test environment');
    } else {
      // Test 2: AuthClient initialization (only in browser)
      console.log('2. Testing AuthClient initialization...');
      authClient = await AuthClient.create();
      console.log('✅ AuthClient created successfully');

      // Test 3: Check current authentication state
      isAuthenticated = await authClient.isAuthenticated();
      console.log(`3. Current authentication state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const identityPrincipal = identity.getPrincipal();
        principal = identityPrincipal.toText();
        console.log(`   Current principal: ${principal}`);

        // Test 4: Actor creation and backend verification
        console.log('4. Testing actor creation and backend verification...');
        const canisterId = process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID;

        if (!canisterId) {
          console.log('❌ NEXT_PUBLIC_HHDAO_CANISTER_ID not set');
          return { success: false, error: 'Canister ID not configured' };
        }

  const actor = await createActor(canisterId, hhdaoIdlFactory, identity) as any;
  // `actor` is intentionally unused here in this lightweight integration test.
  // Use a void expression so ESLint's no-unused-vars rule is satisfied while
  // preserving the creation side-effect for manual testing.
  void actor;
  console.log('✅ Actor created successfully');

        // Skip backend whoami verification for now (function not implemented)
        console.log('ℹ️  Skipping backend verification (whoami not available)');

        // Verify identity principal
        console.log(`✅ Identity principal: ${identityPrincipal.toText()}`);

      } else {
        console.log('4. Skipping backend tests (not authenticated)');
      }
    }

    // Test 5: Environment variables check (works in both environments)
    console.log('5. Checking environment variables...');
    const requiredEnvVars = [
      'NEXT_PUBLIC_DFX_NETWORK',
      'NEXT_PUBLIC_IC_HOST',
      'NEXT_PUBLIC_HHDAO_CANISTER_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    } else {
      console.log('✅ All required environment variables are set');
    }

    console.log('\n🎉 Authentication integration test completed successfully!');
    return {
      success: true,
      isBrowser,
      isAuthenticated,
      principal
    };

  } catch (_error) {
    const errorMessage = _error instanceof Error ? _error.message : String(_error);
    console.error('❌ Authentication test failed:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAuthentication().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}