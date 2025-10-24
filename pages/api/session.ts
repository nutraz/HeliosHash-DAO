import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { limiter } from './_rate-limit';
import { z } from 'zod';
import { loginInputSchema } from '@/lib/validation';
import Sentry from '@/lib/sentry';

/**
 * Returns the current user session if valid, otherwise null.
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-expect-error: Accept NextApiRequest for limiter in API route
  await limiter.checkNext(req as any, 10);

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const sessionToken = cookies['hhdao_session'];
  if (!sessionToken) {
    return res.status(200).json({ user: null });
  }
  // ...existing code...
  const sessionSchema = z.string().min(10).max(256); // basic check
  const parseResult = sessionSchema.safeParse(sessionToken);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid session token', details: parseResult.error.issues });
  }
  try {
    const [userId] = Buffer.from(sessionToken, 'base64').toString().split(':');
    // Mock user data - in production, fetch from database
    const mockUsers: Record<string, any> = {
      community1: {
        id: 'community1',
        name: 'Rajesh Kumar',
        email: 'rajesh@gmail.com',
        isWoman: false,
        balance: 2450,
      },
      investor1: {
        id: 'investor1',
        name: 'Priya Sharma',
        email: 'priya@greenventures.com',
        isWoman: true,
        balance: 2930,
      },
    };
    const user = mockUsers[userId] || null;
    res.status(200).json({ user });
  } catch {
    res.status(200).json({ user: null });
  }
  try {
    // ...existing code...
  } catch (error) {
    Sentry.captureException(error);
    if (process.env.NODE_ENV !== 'production') {
      console.error('API /session error:', error);
    }
    return res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
}
