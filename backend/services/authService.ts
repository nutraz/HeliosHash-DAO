import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'helioshash_secret';

export function generateAuthToken(userId: string): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch (err) {
    return null;
  }
}
