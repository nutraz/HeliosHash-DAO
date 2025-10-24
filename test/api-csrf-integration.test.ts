import fetch from 'node-fetch';
import Redis from 'ioredis';
import assert from 'assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function getSessionAndCsrf() {
  // Simulate login to get session cookie
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'testuser',
      csrfToken: 'x'.repeat(64),
      email: 'test@example.com',
      phone: '+12345678901',
    }),
  });
  assert.strictEqual(loginRes.status, 200, 'Login should succeed');
  const cookies = loginRes.headers.raw()['set-cookie'] || [];
  const sessionCookie = cookies.find((c) => c.startsWith('hhdao_session='));
  assert(sessionCookie, 'Session cookie should be set');
  // Get CSRF token
  const csrfRes = await fetch(`${BASE_URL}/api/csrf`, {
    method: 'GET',
    headers: { Cookie: sessionCookie },
  });
  assert.strictEqual(csrfRes.status, 200, 'CSRF token fetch should succeed');
  const csrfData = await csrfRes.json();
  const csrfCookie = csrfRes.headers.raw()['set-cookie'].find((c) => c.startsWith('hhdao_csrf='));
  assert(csrfCookie, 'CSRF cookie should be set');
  return { sessionCookie, csrfToken: csrfData.csrfToken, csrfCookie };
}

async function testProtectedApi() {
  const { sessionCookie, csrfToken, csrfCookie } = await getSessionAndCsrf();
  // Try a protected endpoint (e.g., /api/logout)
  const res = await fetch(`${BASE_URL}/api/logout`, {
    method: 'POST',
    headers: {
      Cookie: `${sessionCookie}; ${csrfCookie}`,
      'x-csrf-token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ csrfToken }),
  });
  assert.strictEqual(res.status, 200, 'Logout should succeed with valid CSRF');
}

async function testCsrfFailure() {
  const { sessionCookie } = await getSessionAndCsrf();
  // Try a protected endpoint with missing/invalid CSRF
  const res = await fetch(`${BASE_URL}/api/logout`, {
    method: 'POST',
    headers: {
      Cookie: sessionCookie,
      'x-csrf-token': 'invalid',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ csrfToken: 'invalid' }),
  });
  assert.strictEqual(res.status, 403, 'Logout should fail with invalid CSRF');
}

async function runAll() {
  await testProtectedApi();
  await testCsrfFailure();
  console.log('API integration tests passed');
}

runAll().catch((err) => {
  console.error('API integration test failed:', err);
  process.exit(1);
});
