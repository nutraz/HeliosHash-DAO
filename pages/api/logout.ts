import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { limiter } from './_rate-limit';
import { z } from 'zod';

function getCookie(req: NextApiRequest, name: string) {
  const cookies = req.headers.cookie?.split(';').map(c => c.trim()) || [];
  for (const cookie of cookies) {
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (typeof limiter.checkNext === 'function' && 'nextUrl' in req) {
      limiter.checkNext(req as any, 10);
    }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CSRF double-submit cookie check
  const csrfToken = req.headers['x-csrf-token'] || req.body?.csrfToken;
  const csrfSchema = z.string().length(64);
  const parseResult = csrfSchema.safeParse(csrfToken);
  const csrfCookie = getCookie(req, 'hhdao_csrf');
  if (!parseResult.success || !csrfCookie || csrfCookie !== csrfToken) {
    return res.status(403).json({ error: 'CSRF validation failed', details: parseResult.error?.issues });
  }

  // Only allow mock logout in development
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
      return res.status(403).json({ error: 'Mock logout not allowed in production' });
    }

  // ...existing code...
    res.setHeader('Set-Cookie', [
      serialize('hhdao_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      }),
      serialize('hhdao_refresh', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      }),
    ]);
  res.status(200).json({ ok: true });
}
