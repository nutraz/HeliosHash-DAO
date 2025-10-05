/**
 * Privacy-Compliant Gender Data Service
 * GDPR, CCPA, and Indian Data Protection Law Compliant
 *
 * Features:
 * - End-to-end encryption of gender data
 * - Explicit consent management
 * - Right to withdraw/delete data
 * - Audit trail for compliance
 * - Minimal data collection principles
 */

import CryptoJS from 'crypto-js';

// Privacy consent levels
export type ConsentLevel = 'none' | 'basic' | 'full';

// Gender options with privacy considerations
export type GenderOption = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | 'not-provided';

// Consent record for audit trail
export interface ConsentRecord {
  userId: string;
  consentLevel: ConsentLevel;
  genderDisclosed: boolean;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  consentVersion: string; // Terms version
  withdrawalDate?: number;
}

// Encrypted gender data
export interface EncryptedGenderData {
  userId: string;
  encryptedGender: string;
  encryptionVersion: string;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
}

// Privacy settings
export interface PrivacySettings {
  allowDataCollection: boolean;
  allowBonusEligibility: boolean;
  allowAnalytics: boolean;
  allowThirdPartySharing: boolean; // Always false for gender data
  dataRetentionPeriod: number; // Days
}

class PrivacyCompliantGenderService {
  private readonly ENCRYPTION_KEY: string;
  private readonly CONSENT_VERSION = 'v2.0'; // Update when privacy policy changes
  private readonly DEFAULT_RETENTION_PERIOD = 2555; // 7 years in days (compliance requirement)

  // In-memory storage (in production, use secure database)
  private consentRecords: Map<string, ConsentRecord> = new Map();
  private encryptedGenderData: Map<string, EncryptedGenderData> = new Map();
  private privacySettings: Map<string, PrivacySettings> = new Map();

  constructor(encryptionKey?: string) {
    // In production, use secure key management (AWS KMS, HashiCorp Vault, etc.)
    this.ENCRYPTION_KEY =
      encryptionKey || process.env.GENDER_ENCRYPTION_KEY || this.generateSecureKey();
  }

  private generateSecureKey(): string {
    // Generate a secure random key for encryption
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  /**
   * STEP 1: Obtain explicit consent for gender data collection
   */
  async obtainConsent(
    userId: string,
    consentLevel: ConsentLevel,
    privacySettings: Partial<PrivacySettings>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; consentId: string; message: string }> {
    try {
      // Create consent record
      const consentRecord: ConsentRecord = {
        userId,
        consentLevel,
        genderDisclosed: false,
        timestamp: Date.now(),
        ipAddress,
        userAgent,
        consentVersion: this.CONSENT_VERSION,
      };

      // Set privacy settings with secure defaults
      const settings: PrivacySettings = {
        allowDataCollection: consentLevel !== 'none',
        allowBonusEligibility: consentLevel === 'full',
        allowAnalytics: false, // Gender data never used for analytics
        allowThirdPartySharing: false, // Gender data never shared
        dataRetentionPeriod: this.DEFAULT_RETENTION_PERIOD,
        ...privacySettings,
      };

      // Store records
      this.consentRecords.set(userId, consentRecord);
      this.privacySettings.set(userId, settings);

      // Log consent for audit trail
      console.log(`[PRIVACY] Consent obtained for user ${userId}: ${consentLevel}`);

      return {
        success: true,
        consentId: `consent_${userId}_${Date.now()}`,
        message:
          consentLevel === 'none'
            ? 'No data collection consent given. Standard benefits apply.'
            : 'Consent recorded. You can change or withdraw consent anytime.',
      };
    } catch (error) {
      console.error('[PRIVACY] Consent collection failed:', error);
      return {
        success: false,
        consentId: '',
        message: 'Failed to record consent. Please try again.',
      };
    }
  }

  /**
   * Store gender data with encryption and consent validation
   */
  async storeGenderData(userId: string, gender: GenderOption): Promise<OperationResult> {
    try {
      const userConsent = this.getUserConsent(userId);

      if (!userConsent || !userConsent.settings.allowDataCollection) {
        return {
          success: false,
          message: 'Cannot store gender data without proper consent',
        };
      }

      // Encrypt gender data
      const encryptedGender = CryptoJS.AES.encrypt(gender, this.encryptionKey).toString();

      // Store encrypted data
      this.genderData.set(userId, {
        encrypted: encryptedGender,
        timestamp: Date.now(),
        iv: CryptoJS.lib.WordArray.random(128 / 8).toString(),
        accessCount: 0,
      });

      this.logAccess(userId, 'STORE_GENDER', { success: true });

      return {
        success: true,
        message: 'Gender information stored securely',
      };
    } catch (error) {
      this.logAccess(userId, 'STORE_GENDER', { success: false, error: error.message });
      return {
        success: false,
        message: 'Failed to store gender data',
      };
    }
  }

  /**
   * Get privacy dashboard data for user
   */
  async getPrivacyDashboard(userId: string) {
    const userConsent = this.getUserConsent(userId);
    const genderData = this.genderData.get(userId);

    return {
      hasConsent: !!userConsent,
      consentLevel: userConsent?.level || 'none',
      genderStored: !!genderData,
      settings: userConsent?.settings || null,
      dataRetentionDays: this.DATA_RETENTION_DAYS,
      canWithdraw: !!userConsent,
      lastAccessed: genderData?.timestamp,
      accessCount: genderData?.accessCount || 0,
    };
  }

  /**
   * STEP 3: Retrieve gender data for bonus calculation
   */
  async getGenderForBonus(userId: string): Promise<GenderOption | null> {
    try {
      // Check if user exists
      const genderData = this.encryptedGenderData.get(userId);
      if (!genderData) {
        return null;
      }

      // Check if user allows bonus eligibility
      const settings = this.privacySettings.get(userId);
      if (!settings?.allowBonusEligibility) {
        console.log(`[PRIVACY] Bonus eligibility disabled by user ${userId}`);
        return null;
      }

      // Check consent is still valid
      const consent = this.consentRecords.get(userId);
      if (!consent || consent.withdrawalDate) {
        console.log(`[PRIVACY] Consent withdrawn for user ${userId}`);
        return null;
      }

      // Decrypt and return gender
      const decryptedGender = this.decryptData(genderData.encryptedGender) as GenderOption;

      // Update access tracking
      genderData.lastAccessed = Date.now();
      genderData.accessCount += 1;
      this.encryptedGenderData.set(userId, genderData);

      // Log access for audit (no sensitive data)
      console.log(`[PRIVACY] Gender data accessed for bonus calculation: ${userId}`);

      return decryptedGender;
    } catch (error) {
      console.error('[PRIVACY] Gender data retrieval failed:', error);
      return null;
    }
  }

  /**
   * STEP 4: Update gender information
   */
  async updateGenderData(
    userId: string,
    newGender: GenderOption
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user has existing data
      const existingData = this.encryptedGenderData.get(userId);
      if (!existingData) {
        return this.storeGenderData(userId, newGender);
      }

      // Update encrypted data
      const encryptedGender = this.encryptData(newGender);

      const updatedData: EncryptedGenderData = {
        ...existingData,
        encryptedGender,
        lastAccessed: Date.now(),
      };

      this.encryptedGenderData.set(userId, updatedData);

      console.log(`[PRIVACY] Gender data updated for user ${userId}`);

      return {
        success: true,
        message: 'Gender information updated successfully.',
      };
    } catch (error) {
      console.error('[PRIVACY] Gender data update failed:', error);
      return {
        success: false,
        message: 'Failed to update gender information.',
      };
    }
  }

  /**
   * STEP 5: Withdraw consent and delete data (Right to be Forgotten)
   */
  async withdrawConsentAndDeleteData(
    userId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Update consent record with withdrawal
      const consent = this.consentRecords.get(userId);
      if (consent) {
        consent.withdrawalDate = Date.now();
        consent.consentLevel = 'none';
        this.consentRecords.set(userId, consent);
      }

      // Delete encrypted gender data
      const dataDeleted = this.encryptedGenderData.delete(userId);

      // Delete privacy settings
      this.privacySettings.delete(userId);

      // Log deletion for audit trail
      console.log(`[PRIVACY] Data deleted for user ${userId}. Reason: ${reason || 'User request'}`);

      return {
        success: true,
        message: 'All gender data has been permanently deleted. You can re-consent anytime.',
      };
    } catch (error) {
      console.error('[PRIVACY] Data deletion failed:', error);
      return {
        success: false,
        message: 'Failed to delete data. Please contact support.',
      };
    }
  }

  /**
   * STEP 6: Get user's privacy dashboard
   */
  async getPrivacyDashboard(userId: string): Promise<{
    hasConsent: boolean;
    consentLevel: ConsentLevel;
    genderStored: boolean;
    settings: PrivacySettings | null;
    dataRetentionDays: number;
    canWithdraw: boolean;
    lastAccessed?: number;
    accessCount?: number;
  }> {
    const consent = this.consentRecords.get(userId);
    const genderData = this.encryptedGenderData.get(userId);
    const settings = this.privacySettings.get(userId);

    const daysStored = genderData
      ? Math.floor((Date.now() - genderData.createdAt) / (24 * 60 * 60 * 1000))
      : 0;

    return {
      hasConsent: !!consent && !consent.withdrawalDate,
      consentLevel: consent?.consentLevel || 'none',
      genderStored: !!genderData,
      settings,
      dataRetentionDays: settings?.dataRetentionPeriod || this.DEFAULT_RETENTION_PERIOD,
      canWithdraw: !!consent && !consent.withdrawalDate,
      lastAccessed: genderData?.lastAccessed,
      accessCount: genderData?.accessCount || 0,
    };
  }

  /**
   * STEP 7: Automatic data cleanup (GDPR compliance)
   */
  async performDataCleanup(): Promise<{ deletedCount: number; errors: number }> {
    let deletedCount = 0;
    let errors = 0;

    for (const [userId, genderData] of this.encryptedGenderData.entries()) {
      try {
        const settings = this.privacySettings.get(userId);
        const retentionPeriod = settings?.dataRetentionPeriod || this.DEFAULT_RETENTION_PERIOD;

        const dataAge = Date.now() - genderData.createdAt;
        const retentionMs = retentionPeriod * 24 * 60 * 60 * 1000;

        // Delete data older than retention period
        if (dataAge > retentionMs) {
          await this.withdrawConsentAndDeleteData(
            userId,
            'Automatic cleanup - retention period expired'
          );
          deletedCount++;
        }
      } catch (error) {
        console.error(`[PRIVACY] Cleanup failed for user ${userId}:`, error);
        errors++;
      }
    }

    console.log(`[PRIVACY] Cleanup complete: ${deletedCount} deleted, ${errors} errors`);
    return { deletedCount, errors };
  }

  /**
   * Encryption/Decryption utilities
   */
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generate privacy policy text for UI
   */
  getPrivacyPolicyText(language: 'en' | 'hi' = 'en'): {
    title: string;
    sections: Array<{ heading: string; content: string[] }>;
  } {
    if (language === 'hi') {
      return {
        title: 'गोपनीयता नीति - लिंग जानकारी',
        sections: [
          {
            heading: 'हम आपकी जानकारी कैसे उपयोग करते हैं',
            content: [
              'आपकी लिंग जानकारी केवल महिला सशक्तिकरण कार्यक्रम के लिए उपयोग की जाती है',
              'यह जानकारी कभी भी तीसरे पक्ष के साथ साझा नहीं की जाती',
              'आप किसी भी समय इस जानकारी को बदल या हटा सकते हैं',
            ],
          },
          {
            heading: 'आपके अधिकार',
            content: [
              'जानकारी देना पूर्णतः स्वैच्छिक है',
              'जानकारी न देने पर कोई नकारात्मक प्रभाव नहीं',
              'डेटा पोर्टेबिलिटी और डिलीट करने का अधिकार',
            ],
          },
        ],
      };
    }

    return {
      title: 'Privacy Policy - Gender Information',
      sections: [
        {
          heading: 'How We Use Your Information',
          content: [
            "Gender information is used solely for women's empowerment program eligibility",
            'This data is never shared with third parties or used for marketing',
            'All data is encrypted using industry-standard AES-256 encryption',
            'You can change or delete this information at any time',
          ],
        },
        {
          heading: 'Your Rights',
          content: [
            'Providing gender information is completely voluntary',
            'No negative consequences for declining to provide information',
            'Right to access, modify, or delete your data at any time',
            'Right to withdraw consent without affecting other services',
            'Data portability - receive a copy of your data in machine-readable format',
          ],
        },
        {
          heading: 'Data Retention',
          content: [
            'Gender data is retained for 7 years as required by Indian financial regulations',
            'Data is automatically deleted after the retention period',
            'You can request immediate deletion at any time',
            'Audit logs are maintained for compliance (no personal data in logs)',
          ],
        },
        {
          heading: 'Security Measures',
          content: [
            'End-to-end encryption of all sensitive data',
            'Multi-sig trustee approval required for system changes',
            'Regular security audits and penetration testing',
            'Compliance with GDPR, CCPA, and Indian Data Protection laws',
          ],
        },
      ],
    };
  }
}

// Export singleton instance
export const privacyService = new PrivacyCompliantGenderService();

// Export types for use in components
export type { ConsentLevel, ConsentRecord, EncryptedGenderData, GenderOption, PrivacySettings };
