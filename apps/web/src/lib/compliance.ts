import { KycService } from '../services/kycService';

export class IndiaComplianceService {
  static validateCompliance(data: any) {
    // Enhanced validation for KYC and GDPR compliance
    return true;
  }

  static getCompliantOnRamp(amount: number, token: string) {
    if (amount > 10000000) return null; // Exceeds CoinDCX ₹1 crore limit
    if (token !== 'USDC') return null;

    return {
      provider: 'CoinDCX',
      maxDailyLimit: 10000000, // ₹1 crore
      fees: 0.99, // 0.99%
      supportedTokens: ['USDC', 'USDT', 'BTC', 'ETH']
    };
  }

  static requiresFEMAReporting(amount: number) {
    return amount >= 5000000; // ₹50 lakh or more
  }

  static generateFEMAReport(transactionId: string, amount: number, currency: string, purpose: string) {
    return {
      transactionId,
      amount,
      currency,
      investorType: 'FDI',
      purpose,
      complianceStatus: 'pending',
      reportingDate: new Date()
    };
  }

  static calculateGST(serviceType: string, amount: number, isInterState: boolean) {
    const gstRate = 0.18; // 18%
    const gstAmount = amount * gstRate;

    if (isInterState) {
      return {
        serviceType,
        baseAmount: amount,
        gstRate,
        igst: gstAmount,
        cgst: undefined,
        sgst: undefined,
        totalAmount: amount + gstAmount
      };
    } else {
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return {
        serviceType,
        baseAmount: amount,
        gstRate,
        cgst,
        sgst,
        igst: undefined,
        totalAmount: amount + gstAmount
      };
    }
  }

  static validatePAN(pan: string) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  static validateAadhaar(aadhaar: string) {
    // Basic Aadhaar validation (12 digits)
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
  }

  static formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }

  static formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  static formatOWP(amount: number): string {
    return `${amount.toLocaleString('en-IN')} OWP`;
  }

  static getComplianceHooks(transactionType: string, amount: number) {
    const hooks: any[] = [];

    if (transactionType === 'crypto-to-inr' && amount > 5000000) {
      hooks.push({
        type: 'FEMA_REPORTING',
        required: true,
        threshold: 5000000
      });
    }

    if (transactionType === 'crypto-to-inr') {
      hooks.push({
        type: 'SEBI_ONRAMP',
        provider: 'CoinDCX',
        fees: Math.round(amount * 0.0099) // 0.99%
      });
    }

    if (transactionType === 'service-grid-management' && amount > 10000) {
      hooks.push({
        type: 'GST_COMPLIANCE',
        gstAmount: amount * 0.18,
        rate: 0.18
      });
    }

    return hooks;
  }

  static generateComplianceSummary(totalRevenue: number, foreignRevenue: number, serviceRevenue: number) {
    const femaReports = foreignRevenue >= 5000000 ? 1 : 0;
    const gstLiability = serviceRevenue * 0.18;
    const sebiTransactions = Math.ceil(foreignRevenue / 5000000);

    const alerts: string[] = [];
    if (femaReports > 0) {
      alerts.push(`FEMA reporting required for ${IndiaComplianceService.formatINR(foreignRevenue)} foreign investment`);
    }
    if (totalRevenue * 12 >= 50000000) { // Annual turnover > ₹5 crore
      alerts.push(`GST registration may be required (annual turnover projection: ${IndiaComplianceService.formatINR(totalRevenue * 12)})`);
    }
    if (totalRevenue >= 15000000) {
      alerts.push('Consider setting up Indian subsidiary for regulatory simplification');
    }

    // Remove duplicate alerts
    const uniqueAlerts = [...new Set(alerts)];

    return {
      revenue: {
        total: totalRevenue,
        foreign: foreignRevenue,
        domestic: totalRevenue - foreignRevenue,
        services: serviceRevenue
      },
      compliance: {
        femaReports,
        gstLiability,
        sebiTransactions
      },
      alerts: uniqueAlerts
    };
  }
}

export class GDPRComplianceService {
  static checkGDPRApplicability(userLocation: string) {
    // EU countries and UK
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB'
    ];
    return euCountries.includes(userLocation.toUpperCase());
  }

  static validateConsent(consentType: string, userId: string) {
    // Check if user has given valid consent for the specified type
    // This would integrate with a consent management system
    return true; // Placeholder
  }

  static logDataProcessing(activity: string, userId: string, dataCategories: string[]) {
    // Log data processing activities for GDPR compliance
    const logEntry = {
      timestamp: new Date(),
      activity,
      userId,
      dataCategories,
      legalBasis: 'consent'
    };
    console.log('GDPR Processing Log:', logEntry);
    return logEntry;
  }

  static handleDataSubjectRequest(requestType: 'access' | 'rectification' | 'erasure' | 'portability', userId: string) {
    // Handle GDPR data subject rights requests
    const request = {
      type: requestType,
      userId,
      timestamp: new Date(),
      status: 'pending'
    };

    // In production, this would trigger appropriate workflows
    return request;
  }
}

export class KYCComplianceService {
  static async initiateKYC(userId: string, kycType: 'aadhaar' | 'pan' | 'passport') {
    try {
      const kycService = new KycService();
      const result = await kycService.initiateVerification(userId, kycType);
      return result;
    } catch (error) {
      console.error('KYC initiation failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async verifyKYC(userId: string, verificationData: any) {
    try {
      const kycService = new KycService();
      const result = await kycService.verifyIdentity(userId, verificationData);
      return result;
    } catch (error) {
      console.error('KYC verification failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static checkKYCStatus(userId: string) {
    // Check if user has completed required KYC
    // This would query the KYC service or database
    return { verified: false, level: 'none' }; // Placeholder
  }

  static getRequiredKYCLevel(amount: number, activity: string) {
    // Determine required KYC level based on amount and activity
    if (amount >= 5000000 || activity === 'large_transaction') {
      return 'enhanced';
    } else if (amount >= 100000) {
      return 'standard';
    }
    return 'basic';
  }
}
