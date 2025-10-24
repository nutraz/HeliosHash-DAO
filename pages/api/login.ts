import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { z } from 'zod';
import Sentry from '@/lib/sentry';
import { loginInputSchema } from '@/lib/validation';
import { limiter } from './_rate-limit';
import { randomBytes } from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret';
const SESSION_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 1 week


function getCookie(req: NextApiRequest, name: string) {
  const cookies = req.headers.cookie?.split(';').map(c => c.trim()) || [];
  for (const cookie of cookies) {
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return undefined;
}

/**
 * Handles user login, CSRF validation, and session/refresh token issuance.
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
  // ...existing code...
    if (typeof limiter.checkNext === 'function') {
  // @ts-expect-error: Accept NextApiRequest for limiter in API route
  limiter.checkNext(req as any, 10);
    }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let parsed;
  try {
    parsed = loginInputSchema.parse(JSON.parse(req.body || '{}'));
  } catch (err) {
  return res.status(400).json({ error: 'Invalid input', details: err instanceof z.ZodError ? err.issues : undefined });
  }
  const { userId, csrfToken, email, phone } = parsed;

  // CSRF double-submit cookie check
  const csrfCookie = getCookie(req, 'hhdao_csrf');
  if (!csrfCookie || csrfCookie !== csrfToken) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }

  // Only allow mock login in development
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
      return res.status(403).json({ error: 'Mock login not allowed in production' });
    }

  const sessionToken = Buffer.from(`${userId}:${randomBytes(16).toString('hex')}`).toString('base64');
  const refreshToken = randomBytes(64).toString('hex');

  // ...existing code...

    res.setHeader('Set-Cookie', [
      serialize('hhdao_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: SESSION_MAX_AGE,
      }),
      serialize('hhdao_refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_MAX_AGE,
      })
    ]);
  res.status(200).json({ ok: true });
  } catch (error) {
    Sentry.captureException(error);
    if (process.env.NODE_ENV !== 'production') {
      console.error('API /login error:', error);
    }
    return res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
}
