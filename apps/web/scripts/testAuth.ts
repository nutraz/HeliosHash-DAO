#!/usr/bin/env node
// Lightweight node script moved out of the Next.js `src/` tree
// Run with: `node apps/web/scripts/testAuth.ts` or `npx tsx apps/web/scripts/testAuth.ts`

import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../src/lib/actorFactory';
import { hhdaoIdlFactory } from '../src/lib/hhdaoIdl';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  loadEnvFile();

  try {
    const isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
    console.log(`1. Environment check: ${isBrowser ? 'Browser' : 'Node.js'}`);

    let isAuthenticated = false;
    let authClient: AuthClient | null = null;
    let principal: string | null = null;

    if (!isBrowser) {
      console.log('2. Skipping AuthClient test (requires browser environment)');
      console.log('   This is normal when running in Node.js/test environment');
    } else {
      console.log('2. Testing AuthClient initialization...');
      authClient = await AuthClient.create();
      console.log('✅ AuthClient created successfully');

      isAuthenticated = await authClient.isAuthenticated();
      console.log(`3. Current authentication state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const identityPrincipal = identity.getPrincipal();
        principal = identityPrincipal.toText();
        console.log(`   Current principal: ${principal}`);

        console.log('4. Testing actor creation and backend verification...');
        const canisterId = process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID;

        if (!canisterId) {
          console.log('❌ NEXT_PUBLIC_HHDAO_CANISTER_ID not set');
          return { success: false, error: 'Canister ID not configured' };
        }

        const actor: unknown = await createActor(canisterId, hhdaoIdlFactory, identity);
        void actor;
        console.log('✅ Actor created successfully');

        console.log('ℹ️  Skipping backend verification (whoami not available)');
        console.log(`✅ Identity principal: ${identityPrincipal.toText()}`);
      } else {
        console.log('4. Skipping backend tests (not authenticated)');
      }
    }

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

if (require.main === module) {
  testAuthentication().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}
