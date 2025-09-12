import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface CanisterIds {
  [canisterName: string]: {
    local: string;
  };
}

async function globalSetup(config: FullConfig) {
  // Load canister IDs from local canister_ids.json
  const canisterIdsPath = path.resolve(__dirname, '../.dfx/local/canister_ids.json');
  const canisterIds: CanisterIds = JSON.parse(fs.readFileSync(canisterIdsPath, 'utf-8'));

  // Set environment variables for canister IDs
  for (const [canisterName, ids] of Object.entries(canisterIds)) {
    if (ids.local) {
      process.env[`CANISTER_ID_${canisterName.toUpperCase()}`] = ids.local;
    }
  }
}

export default globalSetup;
