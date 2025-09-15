import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CanisterIds {
  [canisterName: string]: {
    local: string;
  };
}

async function globalSetup(config: FullConfig) {
  // Load canister IDs from local canister_ids.json
  const canisterIdsPath = path.resolve(__dirname, '../.dfx/local/canister_ids.json');
  
  // Check if the file exists before trying to read it
  if (!fs.existsSync(canisterIdsPath)) {
    console.log('Canister IDs file not found, skipping canister ID setup');
    return;
  }
  
  try {
    const canisterIds: CanisterIds = JSON.parse(fs.readFileSync(canisterIdsPath, 'utf-8'));

    // Set environment variables for canister IDs
    for (const [canisterName, ids] of Object.entries(canisterIds)) {
      if (ids.local) {
        process.env[`CANISTER_ID_${canisterName.toUpperCase()}`] = ids.local;
      }
    }
  } catch (error) {
    console.log('Error reading canister IDs:', error);
  }
}

export default globalSetup;
