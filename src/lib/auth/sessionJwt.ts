import jwt from 'jsonwebtoken';
import PrismaClient from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev_refresh_secret';

export function signJwt(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: expiresIn as string });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function generateRefreshToken() {
  return randomBytes(64).toString('hex');
}

export async function createSession({ userId, refreshToken, ip, userAgent, mfaVerified, refreshExpiresAt }: {
  userId: string;
  refreshToken: string;
  ip: string;
  userAgent: string;
  mfaVerified: boolean;
  refreshExpiresAt: Date;
}) {
  return prisma.session.create({
    data: {
      userId,
      refreshToken,
      ip,
      userAgent,
      mfaVerified,
      refreshExpiresAt,
    },
  });
}

export async function getSessionByRefresh(refreshToken: string) {
  return prisma.session.findUnique({ where: { refreshToken } });
}

export async function deleteSessionByRefresh(refreshToken: string) {
  return prisma.session.delete({ where: { refreshToken } });
}

export async function updateSessionMfa(refreshToken: string, mfaVerified: boolean) {
  return prisma.session.update({ where: { refreshToken }, data: { mfaVerified } });
}
