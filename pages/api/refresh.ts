import type { NextApiRequest, NextApiResponse } from 'next';
import { parse, serialize } from 'cookie';
import { limiter } from './_rate-limit';
import { z } from 'zod';

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev_refresh_secret';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_session_secret';

function verifyRefreshToken(token: string): string | null {
  // ...existing code...
  try {
    const [userId, secret] = Buffer.from(token, 'base64').toString().split(':');
    if (secret !== REFRESH_SECRET) return null;
    return userId;
  } catch {
    return null;
  }
}

function createSessionToken(userId: string): string {
  // ...existing code...
  return Buffer.from(`${userId}:${SESSION_SECRET}`).toString('base64');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ...existing code...

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ...existing code...
  const csrfToken = req.headers['x-csrf-token'] || req.body?.csrfToken;
  const csrfSchema = z.string().length(64);
  const parseResult = csrfSchema.safeParse(csrfToken);
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const csrfCookie = cookies['hhdao_csrf'];
    if (!parseResult.success || !csrfCookie || csrfCookie !== csrfToken) {
      return res.status(403).json({ error: 'CSRF validation failed', details: parseResult.error?.issues });
    }
  // ...existing code...
    const refreshTokenValue = cookies['hhdao_refresh'];
    const refreshSchema = z.string().min(10).max(256);
    const refreshParse = refreshSchema.safeParse(refreshTokenValue);
    if (!refreshParse.success) {
      return res.status(400).json({ error: 'Invalid refresh token', details: refreshParse.error?.issues });
    }

  const refreshToken = cookies['hhdao_refresh'];
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  const userId = verifyRefreshToken(refreshToken);
  if (!userId) {
  // ...existing code...
    res.setHeader('Set-Cookie', serialize('hhdao_refresh', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    }));
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // ...existing code...
  const sessionToken = createSessionToken(userId);
  res.setHeader('Set-Cookie', serialize('hhdao_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 15, // 15 min
  }));

  res.status(200).json({ ok: true });
}
