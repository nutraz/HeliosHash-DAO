import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes hex

export class PrivacyService {
  async deleteUserData(userId: string) {
    await prisma.userConsent.deleteMany({ where: { userId } });
    await prisma.encryptedUserData.deleteMany({ where: { userId } });
    await prisma.privacyAuditLog.create({
      data: { userId, action: 'gdpr_delete', details: JSON.stringify({ timestamp: new Date().toISOString() }) }
    });
    await prisma.privacyAuditLog.deleteMany({ where: { userId } });
  }
  private encrypt(data: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return { encrypted, iv: iv.toString('hex'), tag: tag.toString('hex') };
  }

  private decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  async recordConsent(userId: string, consentType: string, granted: boolean, metadata?: { ip?: string; userAgent?: string }) {
    await prisma.userConsent.create({
      data: {
        userId,
        consentType,
        granted,
        ipAddressHash: metadata?.ip ? this.hash(metadata.ip) : null,
        userAgentHash: metadata?.userAgent ? this.hash(metadata.userAgent) : null,
      }
    });
    await this.logAction(userId, granted ? 'consent_granted' : 'consent_withdrawn', { consentType, timestamp: new Date().toISOString() });
  }

  async withdrawConsentAndDelete(userId: string, consentType: string) {
    await prisma.userConsent.updateMany({
      where: { userId, consentType, withdrawnAt: null },
      data: { withdrawnAt: new Date() }
    });
    await this.logAction(userId, 'data_deleted', { consentType, timestamp: new Date().toISOString() });
  }

  async storeEncryptedData(userId: string, data: any) {
    const dataString = JSON.stringify(data);
    const { encrypted, iv, tag } = this.encrypt(dataString);
    const encryptedData = JSON.stringify({ encrypted, iv, tag });
    await prisma.encryptedUserData.upsert({
      where: { userId },
      create: { userId, encryptedData, encryptionKeyId: 'primary-key-v1' },
      update: { encryptedData, updatedAt: new Date() }
    });
    await this.logAction(userId, 'data_stored', { timestamp: new Date().toISOString() });
  }

  async getEncryptedData(userId: string): Promise<any | null> {
    const record = await prisma.encryptedUserData.findUnique({ where: { userId } });
    if (!record) return null;
    const { encrypted, iv, tag } = JSON.parse(record.encryptedData);
    const decrypted = this.decrypt(encrypted, iv, tag);
    await this.logAction(userId, 'data_accessed', { timestamp: new Date().toISOString() });
    return JSON.parse(decrypted);
  }

  private async logAction(userId: string, action: string, details: any) {
    await prisma.privacyAuditLog.create({
      data: { userId, action, details: JSON.stringify(details) }
    });
  }

  async getUserAuditTrail(userId: string) {
    const logs = await prisma.privacyAuditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      select: { action: true, timestamp: true }
    });
    return logs;
  }
}

export const privacyService = new PrivacyService();
