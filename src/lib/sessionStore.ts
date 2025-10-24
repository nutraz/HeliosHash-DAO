import PrismaClient from '@prisma/client';

const prisma = new PrismaClient();

export async function createSession({ userId, sessionToken, refreshToken, sessionExpiresAt, refreshExpiresAt }: {
  userId: string;
  sessionToken: string;
  refreshToken: string;
  sessionExpiresAt: Date;
  refreshExpiresAt: Date;
}) {
  return prisma.session.create({
    data: {
      userId,
      sessionToken,
      refreshToken,
      sessionExpiresAt,
      refreshExpiresAt,
    },
  });
}

export async function getSessionByToken(sessionToken: string) {
  return prisma.session.findUnique({ where: { sessionToken } });
}

export async function getSessionByRefresh(refreshToken: string) {
  return prisma.session.findUnique({ where: { refreshToken } });
}

export async function deleteSession(sessionToken: string) {
  return prisma.session.delete({ where: { sessionToken } });
}

export async function rotateSession({ oldRefreshToken, newSessionToken, newRefreshToken, sessionExpiresAt, refreshExpiresAt }: {
  oldRefreshToken: string;
  newSessionToken: string;
  newRefreshToken: string;
  sessionExpiresAt: Date;
  refreshExpiresAt: Date;
}) {
  return prisma.session.update({
    where: { refreshToken: oldRefreshToken },
    data: {
      sessionToken: newSessionToken,
      refreshToken: newRefreshToken,
      sessionExpiresAt,
      refreshExpiresAt,
    },
  });
}

export async function deleteSessionByRefresh(refreshToken: string) {
  return prisma.session.delete({ where: { refreshToken } });
}
