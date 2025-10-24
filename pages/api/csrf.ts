import { randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import Sentry from '@/lib/sentry';

/**
 * Issues a CSRF token for double-submit protection.
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).end();
    const csrfToken = randomBytes(32).toString('hex');
    res.setHeader('Set-Cookie', serialize('hhdao_csrf', csrfToken, {
      httpOnly: false, // must be readable by JS for double-submit
      secure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    }));
    res.status(200).json({ csrfToken });
  } catch (error) {
    Sentry.captureException(error);
    if (process.env.NODE_ENV !== 'production') {
      console.error('API /csrf error:', error);
    }
    return res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
}
