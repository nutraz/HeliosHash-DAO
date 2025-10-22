import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.BASE_URL || process.env.TEST_BASE_URL || 'http://localhost:3001';
const AUTH_TOKEN = process.env.AUTH_TOKEN;

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/status`);
    return res.ok;
  } catch {
    return false;
  }
}

let serverUp = false;

beforeAll(async () => {
  serverUp = await isServerUp();
});

describe('API Authentication', () => {
  it.skipIf(!serverUp || !AUTH_TOKEN)(
    'denies unauthorized access when AUTH_TOKEN is configured',
    async () => {
      const res = await fetch(`${BASE_URL}/api/projects`);
      expect(res.status).toBe(401);
    }
  );

  it.skipIf(!serverUp || !AUTH_TOKEN)(
    'allows authorized access with Bearer token',
    async () => {
      const res = await fetch(`${BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      expect([200, 204, 404]).toContain(res.status);
    }
  );

  it.skipIf(!serverUp)(
    'status endpoint remains public (no auth required)',
    async () => {
      const res = await fetch(`${BASE_URL}/api/status`);
      expect(res.ok).toBe(true);
    }
  );
});
