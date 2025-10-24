import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'auth',
  points: 5, // 5 attempts
  duration: 900, // per 15 min
});

export const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'api',
  points: 20, // 20 requests
  duration: 60, // per minute
});

export const readLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'read',
  points: 100, // 100 requests
  duration: 60, // per minute
});

export function getRateLimitKey(req: any) {
  // Use user id if authenticated, else IP
  if (req.user && req.user.id) return `user:${req.user.id}`;
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
}
