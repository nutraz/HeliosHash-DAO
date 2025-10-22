/**
 * India-Specific Regulatory Compliance Module for HeliosHash DAO
 *
 * Handles RBI/SEBI compliance for USDC→INR conversions, FEMA documentation,
 * and GST compliance for DAO operations in India.
 *
 * LEGAL CONTEXT:
 * - Foreign Exchange Management Act (FEMA) 1999: Foreign investment reporting >₹50 lakh
 * - Securities and Exchange Board of India (SEBI): Crypto-to-INR on-ramps
 * - Goods and Services Tax (GST): 18% on "online services" (TBD classification)
 * - Income Tax Act: DAO revenue classification and member tax obligations
 */

export interface SEBIOnRamp {
  provider: 'TransFi' | 'CoinDCX' | 'WazirX' | 'ZebPay';
  license: string; // SEBI registration number
  maxDailyLimit: number; // INR
  fees: number; // Percentage
  supportedTokens: string[];
}

export interface FEMAReport {
  transactionId: string;
  amount: number; // INR equivalent
  currency: 'USDC' | 'USDT' | 'ETH' | 'BTC';
  investorType: 'FDI' | 'FPI' | 'ODI';
  purpose: 'infrastructure' | 'renewable-energy' | 'agriculture-tech';
  reportingDate: Date;
  complianceStatus: 'pending' | 'submitted' | 'approved';
}

export interface GSTCalculation {
  serviceType: 'dao-governance' | 'energy-trading' | 'computing-services';
  baseAmount: number; // INR
  gstRate: number; // 18% for most services
  igst?: number; // Inter-state GST
  cgst?: number; // Central GST
  sgst?: number; // State GST (Uttar Pradesh)
  totalAmount: number;
  gstNumber?: string; // If DAO registers for GST
}

export class IndiaComplianceService {
  private static readonly SEBI_ONRAMPS: SEBIOnRamp[] = [
    {
      provider: 'CoinDCX',
      license: 'SEBI/HO/MIRSD/DOP1/CIR/P/2021/615',
      maxDailyLimit: 10000000, // ₹1 crore
      fees: 0.99, // 0.99%
      supportedTokens: ['USDC', 'USDT', 'BTC', 'ETH'],
    },
    {
      provider: 'TransFi',
      license: 'MSB-FINCEN-31000225601293', // US license, operating in India via partnerships
      maxDailyLimit: 5000000, // ₹50 lakh
      fees: 1.2, // 1.2%
      supportedTokens: ['USDC', 'USDT'],
    },
  ];

  private static readonly FEMA_THRESHOLD = 5000000; // ₹50 lakh threshold for reporting
  private static readonly GST_RATE = 0.18; // 18% GST on online services

  /**
   * Get SEBI-compliant on-ramp for USDC→INR conversion
   */
  static getCompliantOnRamp(amount: number, token: string): SEBIOnRamp | null {
    const suitable = this.SEBI_ONRAMPS.filter(
      (onramp) => onramp.supportedTokens.includes(token) && amount <= onramp.maxDailyLimit
    ).sort((a, b) => a.fees - b.fees); // Lowest fees first

    return suitable[0] || null;
  }

  /**
   * Check if transaction requires FEMA reporting
   */
  static requiresFEMAReporting(amount: number): boolean {
    return amount >= this.FEMA_THRESHOLD;
  }

  /**
   * Generate FEMA report for foreign investment
   */
  static generateFEMAReport(
    transactionId: string,
    amount: number,
    currency: string,
    purpose: string
  ): FEMAReport {
    return {
      transactionId,
      amount,
      currency: currency as any,
      investorType: 'FDI', // Foreign Direct Investment for DAO treasury
      purpose: purpose as any,
      reportingDate: new Date(),
      complianceStatus: 'pending',
    };
  }

  /**
   * Calculate GST for DAO services
   */
  static calculateGST(
    serviceType: string,
    baseAmount: number,
    isInterState: boolean = false
  ): GSTCalculation {
    const gstAmount = baseAmount * this.GST_RATE;

    if (isInterState) {
      // IGST for inter-state transactions
      return {
        serviceType: serviceType as any,
        baseAmount,
        gstRate: this.GST_RATE,
        igst: gstAmount,
        totalAmount: baseAmount + gstAmount,
      };
    } else {
      // CGST + SGST for intra-state (Uttar Pradesh)
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;

      return {
        serviceType: serviceType as any,
        baseAmount,
        gstRate: this.GST_RATE,
        cgst,
        sgst,
        totalAmount: baseAmount + gstAmount,
      };
    }
  }

  /**
   * Validate DAO member PAN for tax compliance
   */
  static validatePAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  /**
   * Get compliance hooks for revenue flows
   */
  static getComplianceHooks(transactionType: string, amount: number) {
    const hooks: Array<{
      type: string;
      provider?: string;
      fees?: number;
      compliance?: string;
      threshold?: number;
      required?: boolean;
      deadline?: string;
      gstAmount?: number;
      rate?: number;
      components?: any;
    }> = [];

    // SEBI on-ramp compliance
    if (transactionType.includes('crypto-to-inr')) {
      const onramp = this.getCompliantOnRamp(amount, 'USDC');
      if (onramp) {
        hooks.push({
          type: 'SEBI_ONRAMP',
          provider: onramp.provider,
          fees: (amount * onramp.fees) / 100,
          compliance: 'SEBI-registered exchange required',
        });
      }
    }

    // FEMA reporting
    if (this.requiresFEMAReporting(amount)) {
      hooks.push({
        type: 'FEMA_REPORTING',
        threshold: this.FEMA_THRESHOLD,
        required: true,
        deadline: '60 days from transaction',
      });
    }

    // GST calculation
    if (transactionType.includes('service')) {
      const gst = this.calculateGST(transactionType, amount);
      hooks.push({
        type: 'GST_COMPLIANCE',
        gstAmount: gst.totalAmount - gst.baseAmount,
        rate: gst.gstRate,
        components: { cgst: gst.cgst, sgst: gst.sgst, igst: gst.igst },
      });
    }

    return hooks;
  }

  /**
   * Generate compliance summary for DAO treasury operations
   */
  static generateComplianceSummary(
    monthlyRevenue: number,
    foreignInvestments: number,
    serviceRevenue: number
  ) {
    const summary = {
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      revenue: {
        total: monthlyRevenue,
        foreign: foreignInvestments,
        domestic: monthlyRevenue - foreignInvestments,
        services: serviceRevenue,
      },
      compliance: {
        femaReports: foreignInvestments >= this.FEMA_THRESHOLD ? 1 : 0,
        gstLiability: serviceRevenue * this.GST_RATE,
        sebiTransactions: Math.ceil(foreignInvestments / 5000000), // Estimated transactions
      },
      alerts: [] as string[],
    };

    // Generate alerts
    if (foreignInvestments >= this.FEMA_THRESHOLD) {
      summary.alerts.push(
        `FEMA reporting required for ₹${foreignInvestments.toLocaleString(
          'en-IN'
        )} foreign investment`
      );
    }

    if (serviceRevenue > 2000000) {
      // ₹20 lakh threshold for mandatory GST registration
      summary.alerts.push(
        `GST registration may be required (annual turnover projection: ₹${(
          serviceRevenue * 12
        ).toLocaleString('en-IN')})`
      );
    }

    if (monthlyRevenue > 10000000) {
      // ₹1 crore
      summary.alerts.push('Consider setting up Indian subsidiary for regulatory simplification');
    }

    return summary;
  }
}

/**
 * React Hook for India Compliance
 */
export function useIndiaCompliance() {
  const checkCompliance = (amount: number, transactionType: string) => {
    return IndiaComplianceService.getComplianceHooks(transactionType, amount);
  };

  const validateTransaction = (amount: number, currency: string) => {
    const onramp = IndiaComplianceService.getCompliantOnRamp(amount, currency);
    const needsFEMA = IndiaComplianceService.requiresFEMAReporting(amount);

    return {
      approved: !!onramp,
      onramp,
      femaRequired: needsFEMA,
      maxAmount: onramp?.maxDailyLimit || 0,
    };
  };

  return {
    checkCompliance,
    validateTransaction,
    generateFEMAReport: IndiaComplianceService.generateFEMAReport,
    calculateGST: IndiaComplianceService.calculateGST,
    generateSummary: IndiaComplianceService.generateComplianceSummary,
  };
}
