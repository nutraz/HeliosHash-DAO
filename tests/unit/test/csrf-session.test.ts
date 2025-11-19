import { createServer } from 'http';
import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import assert from 'assert';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function testCsrfTokenLifecycle() {
  // Simulate session
  const sessionId = randomBytes(16).toString('hex');
  // Issue CSRF token
  const csrfToken = randomBytes(32).toString('hex');
  await redisClient.set(`csrf:${sessionId}`, csrfToken, 'EX', 3600);
  // Retrieve and validate
  const stored = await redisClient.get(`csrf:${sessionId}`);
  assert.strictEqual(stored, csrfToken, 'CSRF token should match after set');
  // Expire token
  await redisClient.expire(`csrf:${sessionId}`, 1); // 1 second
  await new Promise((r) => setTimeout(r, 1100));
  const expired = await redisClient.get(`csrf:${sessionId}`);
  assert.strictEqual(expired, null, 'CSRF token should expire');
  console.log('CSRF token lifecycle test passed');
}

async function runAll() {
  await testCsrfTokenLifecycle();
  // Add more tests as needed
}

runAll().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
