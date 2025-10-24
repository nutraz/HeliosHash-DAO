/**
 * Enhanced Aadhaar Integration Service
 * Privacy-preserving identity verification for HHDAO local governance
 * Supports SHG member onboarding with consent-based verification
 */

import * as CryptoJS from 'crypto-js';
import { randomBytes } from 'crypto';

export interface AadhaarVerificationRequest {
  aadhaarNumber: string;
  name: string;
  dateOfBirth: string;
  address: string;
  phoneNumber?: string;
  consentGiven: boolean;
  purposeOfVerification:
    | 'SHG_ONBOARDING'
    | 'LAND_VERIFICATION'
    | 'SUBSIDY_ELIGIBILITY'
    | 'GOVERNANCE_PARTICIPATION';
}

export interface AadhaarVerificationResult {
  id: string;
  isVerified: boolean;
  verificationHash: string;
  maskedAadhaar: string;
  ageVerified: boolean;
  residencyVerified: boolean;
  eligibleForSHG: boolean;
  verificationTimestamp: Date;
  consentRecorded: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ConsentRecord {
  userId: string;
  consentId: string;
  purposeOfVerification: string;
  consentGiven: boolean;
  consentTimestamp: Date;
  dataUsageDescription: string;
  retentionPeriod: string;
  revokedAt?: Date;
}

export interface SHGEligibilityCheck {
  isEligible: boolean;
  ageRequirement: boolean; // 18-59 years
  residencyRequirement: boolean; // Local resident
  bankingRequirement: boolean; // Has bank account
  existingMembership: boolean; // Not already in SHG
  reasons: string[];
}

export class AadhaarService {
  private readonly VERIFICATION_SALT =
    process.env.AADHAAR_VERIFICATION_SALT || 'hhdao-verification-2024';
  private readonly MIN_AGE = 18;
  private readonly MAX_SHG_AGE = 59;
  private readonly CONSENT_RETENTION_PERIOD = '5 years';

  // Simulated Aadhaar database for demo purposes
  private mockAadhaarDatabase = new Map([
    [
      '123456789012',
      {
        name: 'Dhramendra Kumar',
        dateOfBirth: '1985-03-15',
        address: 'Village Baghpat, Uttar Pradesh 250101',
        phoneNumber: '+91-9876543210',
        district: 'Baghpat',
        state: 'Uttar Pradesh',
        pincode: '250101',
      },
    ],
    [
      '234567890123',
      {
        name: 'Sunita Devi',
        dateOfBirth: '1990-07-22',
        address: 'Village Baghpat, Uttar Pradesh 250101',
        phoneNumber: '+91-9876543211',
        district: 'Baghpat',
        state: 'Uttar Pradesh',
        pincode: '250101',
      },
    ],
    [
      '345678901234',
      {
        name: 'Ramesh Singh',
        dateOfBirth: '1982-12-08',
        address: 'Village Baghpat, Uttar Pradesh 250101',
        phoneNumber: '+91-9876543212',
        district: 'Baghpat',
        state: 'Uttar Pradesh',
        pincode: '250101',
      },
    ],
  ]);

  private consentRecords: ConsentRecord[] = [];
  private verificationResults: AadhaarVerificationResult[] = [];

  /**
   * Verify Aadhaar number with privacy preservation
   */
  async verifyAadhaar(request: AadhaarVerificationRequest): Promise<AadhaarVerificationResult> {
    const verificationId = this.generateVerificationId();
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate consent
    if (!request.consentGiven) {
      errors.push('Consent is required for Aadhaar verification');
    }

    // Validate Aadhaar format
    if (!this.isValidAadhaarFormat(request.aadhaarNumber)) {
      errors.push('Invalid Aadhaar number format');
    }

    if (errors.length > 0) {
      return this.createFailedVerification(verificationId, request, errors);
    }

    // Record consent
    const consentRecord = this.recordConsent(request);

    // Perform verification against mock database
    const aadhaarData = this.mockAadhaarDatabase.get(request.aadhaarNumber);
    const isVerified = aadhaarData !== undefined;

    if (!isVerified) {
      errors.push('Aadhaar number not found in database');
      return this.createFailedVerification(verificationId, request, errors);
    }

    // Verify personal details
    const nameMatch = this.fuzzyNameMatch(request.name, aadhaarData.name);
    const dobMatch = request.dateOfBirth === aadhaarData.dateOfBirth;

    if (!nameMatch) {
      warnings.push('Name does not match exactly');
    }

    if (!dobMatch) {
      warnings.push('Date of birth does not match');
    }

    // Age and residency verification
    const age = this.calculateAge(aadhaarData.dateOfBirth);
    const ageVerified = age >= this.MIN_AGE;
    const residencyVerified = this.verifyResidency(aadhaarData.address, 'Baghpat');

    // SHG eligibility check
    const eligibilityCheck = this.checkSHGEligibility({
      age,
      residency: residencyVerified,
      aadhaarNumber: request.aadhaarNumber,
    });

    const result: AadhaarVerificationResult = {
      id: verificationId,
      isVerified: nameMatch && dobMatch,
      verificationHash: this.generateVerificationHash(request.aadhaarNumber),
      maskedAadhaar: this.maskAadhaarNumber(request.aadhaarNumber),
      ageVerified,
      residencyVerified,
      eligibleForSHG: eligibilityCheck.isEligible,
      verificationTimestamp: new Date(),
      consentRecorded: true,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };

    // Store verification result
    this.verificationResults.push(result);

    return result;
  }

  /**
   * Bulk verify SHG members with enhanced validation
   */
  async bulkVerifySHGMembers(
    requests: AadhaarVerificationRequest[]
  ): Promise<AadhaarVerificationResult[]> {
    const results: AadhaarVerificationResult[] = [];

    // Process in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((request) => this.verifyAadhaar(request)));
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < requests.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Check SHG eligibility with comprehensive validation
   */
  checkSHGEligibility(data: {
    age: number;
    residency: boolean;
    aadhaarNumber: string;
  }): SHGEligibilityCheck {
    const reasons: string[] = [];

    const ageRequirement = data.age >= this.MIN_AGE && data.age <= this.MAX_SHG_AGE;
    if (!ageRequirement) {
      reasons.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_SHG_AGE} years`);
    }

    const residencyRequirement = data.residency;
    if (!residencyRequirement) {
      reasons.push('Must be a local resident of Baghpat district');
    }

    // Check existing SHG membership (simulated)
    const existingMembership = !this.hasExistingSHGMembership(data.aadhaarNumber);
    if (!existingMembership) {
      reasons.push('Already a member of another SHG');
    }

    // Banking requirement (simulated)
    const bankingRequirement = this.hasBankAccount(data.aadhaarNumber);
    if (!bankingRequirement) {
      reasons.push('Must have an active bank account');
    }

    const isEligible =
      ageRequirement && residencyRequirement && existingMembership && bankingRequirement;

    return {
      isEligible,
      ageRequirement,
      residencyRequirement,
      bankingRequirement,
      existingMembership,
      reasons,
    };
  }

  /**
   * Generate age and residency verification report
   */
  generateVerificationReport(verificationIds: string[]): {
    totalVerifications: number;
    successfulVerifications: number;
    ageVerifiedCount: number;
    residencyVerifiedCount: number;
    sghEligibleCount: number;
    commonIssues: string[];
  } {
    const results = this.verificationResults.filter((r) => verificationIds.includes(r.id));

    const commonIssues: Record<string, number> = {};
    results.forEach((result) => {
      if (result.errors) {
        result.errors.forEach((error) => {
          commonIssues[error] = (commonIssues[error] || 0) + 1;
        });
      }
      if (result.warnings) {
        result.warnings.forEach((warning) => {
          commonIssues[warning] = (commonIssues[warning] || 0) + 1;
        });
      }
    });

    return {
      totalVerifications: results.length,
      successfulVerifications: results.filter((r) => r.isVerified).length,
      ageVerifiedCount: results.filter((r) => r.ageVerified).length,
      residencyVerifiedCount: results.filter((r) => r.residencyVerified).length,
      sghEligibleCount: results.filter((r) => r.eligibleForSHG).length,
      commonIssues: Object.entries(commonIssues)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([issue]) => issue),
    };
  }

  /**
   * Revoke consent for data processing
   */
  async revokeConsent(consentId: string): Promise<boolean> {
    const consent = this.consentRecords.find((c) => c.consentId === consentId);
    if (consent && !consent.revokedAt) {
      consent.revokedAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * Get consent records for audit purposes
   */
  getConsentRecords(userId?: string): ConsentRecord[] {
    if (userId) {
      return this.consentRecords.filter((c) => c.userId === userId);
    }
    return [...this.consentRecords];
  }

  // Private helper methods
  private generateVerificationId(): string {
    // Use static import for crypto at the top of the file
    const rand = randomBytes(9).toString('hex');
    return `aadhaar_${Date.now()}_${rand}`;
  }

  private isValidAadhaarFormat(aadhaarNumber: string): boolean {
    return /^\d{12}$/.test(aadhaarNumber);
  }

  private generateVerificationHash(aadhaarNumber: string): string {
    return CryptoJS.SHA256(aadhaarNumber + this.VERIFICATION_SALT).toString();
  }

  private maskAadhaarNumber(aadhaarNumber: string): string {
    return `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private fuzzyNameMatch(input: string, reference: string): boolean {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');
    const normalizedInput = normalize(input);
    const normalizedReference = normalize(reference);

    // Simple similarity check - can be enhanced with Levenshtein distance
    return (
      normalizedInput === normalizedReference ||
      normalizedInput.includes(normalizedReference) ||
      normalizedReference.includes(normalizedInput)
    );
  }

  private verifyResidency(address: string, requiredDistrict: string): boolean {
    return address.toLowerCase().includes(requiredDistrict.toLowerCase());
  }

  private hasExistingSHGMembership(aadhaarNumber: string): boolean {
    // Simulated check - in real implementation, check against SHG database
    const existingMembers = ['111111111111', '999999999999'];
    return existingMembers.includes(aadhaarNumber);
  }

  private hasBankAccount(aadhaarNumber: string): boolean {
    // Simulated banking check - in real implementation, integrate with banking APIs
    return true; // Assume all users have bank accounts for demo
  }

  private recordConsent(request: AadhaarVerificationRequest): ConsentRecord {
    const crypto = require('crypto');
    const rand = crypto.randomBytes(6).toString('hex');
    const consentRecord: ConsentRecord = {
      userId: this.generateVerificationHash(request.aadhaarNumber),
      consentId: `consent_${Date.now()}_${rand}`,
      purposeOfVerification: request.purposeOfVerification,
      consentGiven: request.consentGiven,
      consentTimestamp: new Date(),
      dataUsageDescription: `Aadhaar verification for ${request.purposeOfVerification}`,
      retentionPeriod: this.CONSENT_RETENTION_PERIOD,
    };

    this.consentRecords.push(consentRecord);
    return consentRecord;
  }

  private createFailedVerification(
    verificationId: string,
    request: AadhaarVerificationRequest,
    errors: string[]
  ): AadhaarVerificationResult {
    return {
      id: verificationId,
      isVerified: false,
      verificationHash: '',
      maskedAadhaar: this.maskAadhaarNumber(request.aadhaarNumber),
      ageVerified: false,
      residencyVerified: false,
      eligibleForSHG: false,
      verificationTimestamp: new Date(),
      consentRecorded: request.consentGiven,
      errors,
    };
  }
}

export const aadhaarService = new AadhaarService();
