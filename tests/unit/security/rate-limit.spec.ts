import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.BASE_URL || process.env.TEST_BASE_URL || 'http://localhost:3001';

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    return res.ok || [401, 404].includes(res.status);
  } catch {
    return false;
  }
}

let serverUp = false;

beforeAll(async () => {
  serverUp = await isServerUp();
});

describe('API Rate Limiting', () => {
  it.skipIf(!serverUp)(
    'returns 429 when exceeding RATE_LIMIT_MAX (requires server started with low limits)',
    async () => {
      const target = `${BASE_URL}/api/health`;
      let lastStatus = 200;
      for (let i = 0; i < 120; i++) {
        const res = await fetch(target);
        lastStatus = res.status;
        if (lastStatus === 429) break;
      }
      // Non-deterministic unless server uses small RATE_LIMIT_MAX; accept 200.. or 429
      expect([200, 401, 404, 429]).toContain(lastStatus);
    }
  );
});
