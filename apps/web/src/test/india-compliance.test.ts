/* eslint-disable helioshash-rules/no-raw-currency */
import { IndiaComplianceService } from '@/lib/compliance';
import { describe, expect, it } from 'vitest';

/**
 * India-Specific Compliance Tests
 *
 * Tests regulatory compliance features for HeliosHash DAO operations in India:
 * - RBI/SEBI compliance for USDC→INR conversions
 * - FEMA reporting for foreign investments >₹50 lakh
 * - GST calculations for DAO services (18%)
 * - PAN validation for tax compliance
 *
 * Context: Baghpat, Uttar Pradesh operations with Dhramendra's land
 */

describe('India Compliance Service', () => {
  describe('SEBI On-Ramp Compliance', () => {
    it('should recommend CoinDCX for large USDC conversions', () => {
      const onramp = IndiaComplianceService.getCompliantOnRamp(5000000, 'USDC'); // ₹50 lakh

      expect(onramp).toBeDefined();
      expect(onramp?.provider).toBe('CoinDCX');
      expect(onramp?.maxDailyLimit).toBe(10000000); // ₹1 crore limit
      expect(onramp?.fees).toBe(0.99); // Lowest fees
      expect(onramp?.supportedTokens).toContain('USDC');
    });

    it('should recommend CoinDCX for smaller amounts', () => {
      const onramp = IndiaComplianceService.getCompliantOnRamp(3000000, 'USDC'); // ₹30 lakh

      expect(onramp).toBeDefined();
      // Should get CoinDCX (lowest fees) even for smaller amounts
      expect(onramp?.provider).toBe('CoinDCX');
      expect(onramp?.fees).toBe(0.99);
    });

    it('should return null for amounts exceeding daily limits', () => {
      const onramp = IndiaComplianceService.getCompliantOnRamp(12000000, 'USDC'); // ₹1.2 crore

      expect(onramp).toBeNull(); // Exceeds CoinDCX ₹1 crore limit
    });

    it('should return null for unsupported tokens', () => {
      const onramp = IndiaComplianceService.getCompliantOnRamp(1000000, 'DOGE');

      expect(onramp).toBeNull();
    });
  });

  describe('FEMA Reporting Requirements', () => {
    it('should require FEMA reporting for investments above ₹50 lakh', () => {
      expect(IndiaComplianceService.requiresFEMAReporting(6000000)).toBe(true); // ₹60 lakh
      expect(IndiaComplianceService.requiresFEMAReporting(5000000)).toBe(true); // Exactly ₹50 lakh
      expect(IndiaComplianceService.requiresFEMAReporting(4500000)).toBe(false); // ₹45 lakh
    });

    it('should generate proper FEMA report structure', () => {
      const report = IndiaComplianceService.generateFEMAReport(
        'TX-US-SOLAR-001',
        6000000, // ₹60 lakh
        'USDC',
        'infrastructure'
      );

      expect(report.transactionId).toBe('TX-US-SOLAR-001');
      expect(report.amount).toBe(6000000);
      expect(report.currency).toBe('USDC');
      expect(report.investorType).toBe('FDI'); // Foreign Direct Investment
      expect(report.purpose).toBe('infrastructure');
      expect(report.complianceStatus).toBe('pending');
      expect(report.reportingDate).toBeInstanceOf(Date);
    });

    it('should handle renewable energy sector classification', () => {
      const report = IndiaComplianceService.generateFEMAReport(
        'TX-SOLAR-PANELS-001',
        7500000, // ₹75 lakh
        'USDC',
        'renewable-energy'
      );

      expect(report.purpose).toBe('renewable-energy');
      expect(report.investorType).toBe('FDI');
      // Renewable energy allows 100% FDI under automatic route
    });
  });

  describe('GST Calculations', () => {
    it('should calculate GST correctly for intra-state services (UP)', () => {
      const gst = IndiaComplianceService.calculateGST('dao-governance', 1000000, false); // ₹10 lakh

      expect(gst.serviceType).toBe('dao-governance');
      expect(gst.baseAmount).toBe(1000000);
      expect(gst.gstRate).toBe(0.18); // 18%
      expect(gst.cgst).toBe(90000); // 9% Central GST
      expect(gst.sgst).toBe(90000); // 9% State GST (UP)
      expect(gst.igst).toBeUndefined();
      expect(gst.totalAmount).toBe(1180000); // ₹11.8 lakh
    });

    it('should calculate IGST for inter-state services', () => {
      const gst = IndiaComplianceService.calculateGST('energy-trading', 500000, true); // ₹5 lakh

      expect(gst.serviceType).toBe('energy-trading');
      expect(gst.baseAmount).toBe(500000);
      expect(gst.igst).toBe(90000); // 18% IGST
      expect(gst.cgst).toBeUndefined();
      expect(gst.sgst).toBeUndefined();
      expect(gst.totalAmount).toBe(590000); // ₹5.9 lakh
    });

    it('should handle computing services GST', () => {
      const gst = IndiaComplianceService.calculateGST('computing-services', 250000, false); // ₹2.5 lakh

      expect(gst.serviceType).toBe('computing-services');
      expect(gst.totalAmount).toBe(295000); // ₹2.95 lakh (18% GST added)
    });
  });

  describe('PAN Validation', () => {
    it('should validate correct PAN formats', () => {
      const validPANs = ['ABCDE1234F', 'PQRST5678Z', 'LMNOP9012A'];

      validPANs.forEach((pan) => {
        expect(IndiaComplianceService.validatePAN(pan)).toBe(true);
      });
    });

    it('should reject invalid PAN formats', () => {
      const invalidPANs = [
        'ABCD1234F', // Too short
        'ABCDE12345', // No letter at end
        '12345ABCDF', // Numbers in wrong position
        'abcde1234f', // Lowercase
        'ABCDE-1234-F', // Hyphens not allowed
        '',
      ];

      invalidPANs.forEach((pan) => {
        expect(IndiaComplianceService.validatePAN(pan)).toBe(false);
      });
    });
  });

  describe('Compliance Hooks Integration', () => {
    it('should generate all compliance hooks for large crypto-to-INR conversion', () => {
      const hooks = IndiaComplianceService.getComplianceHooks('crypto-to-inr', 6000000); // ₹60 lakh

      expect(hooks).toHaveLength(2); // SEBI + FEMA

      const sebiHook = hooks.find((h) => h.type === 'SEBI_ONRAMP');
      expect(sebiHook).toBeDefined();
      expect(sebiHook?.provider).toBe('CoinDCX');
      expect(sebiHook?.fees).toBe(59400); // 0.99% of ₹60 lakh

      const femaHook = hooks.find((h) => h.type === 'FEMA_REPORTING');
      expect(femaHook).toBeDefined();
      expect(femaHook?.required).toBe(true);
      expect(femaHook?.threshold).toBe(5000000);
    });

    it('should generate GST hook for service transactions', () => {
      const hooks = IndiaComplianceService.getComplianceHooks('service-grid-management', 300000); // ₹3 lakh

      expect(hooks).toHaveLength(1); // Only GST

      const gstHook = hooks[0];
      expect(gstHook.type).toBe('GST_COMPLIANCE');
      expect(gstHook.gstAmount).toBe(54000); // 18% of ₹3 lakh
      expect(gstHook.rate).toBe(0.18);
    });

    it('should handle small domestic transactions without hooks', () => {
      const hooks = IndiaComplianceService.getComplianceHooks('energy-sale-local', 100000); // ₹1 lakh

      expect(hooks).toHaveLength(0); // Below thresholds
    });
  });

  describe('Compliance Summary Generation', () => {
    it('should generate accurate monthly compliance summary for Baghpat operations', () => {
      const summary = IndiaComplianceService.generateComplianceSummary(
        8500000, // ₹85 lakh total revenue
        6000000, // ₹60 lakh foreign investment
        2500000 // ₹25 lakh service revenue
      );

      expect(summary.revenue.total).toBe(8500000);
      expect(summary.revenue.foreign).toBe(6000000);
      expect(summary.revenue.domestic).toBe(2500000); // 85L - 60L
      expect(summary.revenue.services).toBe(2500000);

      expect(summary.compliance.femaReports).toBe(1); // ₹60L > ₹50L threshold
      expect(summary.compliance.gstLiability).toBe(450000); // 18% of ₹25L services
      expect(summary.compliance.sebiTransactions).toBe(2); // ₹60L / ₹50L = 1.2 → 2

      expect(summary.alerts).toContain('FEMA reporting required for ₹60,00,000.00 foreign investment');
      expect(summary.alerts).toContain(
        'GST registration may be required (annual turnover projection: ₹60,00,000.00)'
      );
    });

    it('should recommend Indian subsidiary for high revenue operations', () => {
      const summary = IndiaComplianceService.generateComplianceSummary(
        15000000, // ₹1.5 crore monthly
        8000000, // ₹80 lakh foreign
        5000000 // ₹50 lakh services
      );

      expect(summary.alerts).toContain(
        'Consider setting up Indian subsidiary for regulatory simplification'
      );
    });

    it('should not generate false alerts for compliant operations', () => {
      const summary = IndiaComplianceService.generateComplianceSummary(
        3000000, // ₹30 lakh total
        1000000, // ₹10 lakh foreign (below FEMA threshold)
        1500000 // ₹15 lakh services (below GST registration threshold)
      );

      expect(summary.compliance.femaReports).toBe(0);
      expect(summary.alerts).toHaveLength(0); // No compliance alerts
    });
  });

  describe('Baghpat-Specific Scenarios', () => {
    it('should handle solar equipment purchase from US suppliers', () => {
      const equipmentPurchase = 6500000; // ₹65 lakh for solar panels + inverters

      const hooks = IndiaComplianceService.getComplianceHooks('crypto-to-inr', equipmentPurchase);
      const femaReport = IndiaComplianceService.generateFEMAReport(
        'BAGHPAT-SOLAR-001',
        equipmentPurchase,
        'USDC',
        'renewable-energy'
      );

      expect(hooks.some((h) => h.type === 'FEMA_REPORTING')).toBe(true);
      expect(femaReport.purpose).toBe('renewable-energy');
      expect(femaReport.amount).toBe(equipmentPurchase);
    });

    it('should calculate GST for grid management services to UP State Electricity Board', () => {
      const gridServices = 180000; // ₹1.8 lakh monthly grid management fee

      const gst = IndiaComplianceService.calculateGST('energy-trading', gridServices, false);

      expect(gst.cgst).toBe(16200); // 9% CGST
      expect(gst.sgst).toBe(16200); // 9% SGST (Uttar Pradesh)
      expect(gst.totalAmount).toBe(212400); // ₹2.124 lakh
    });

    it('should handle agricultural AI services for local farmers', () => {
      const aiServices = 45000; // ₹45,000 monthly AI services for crop monitoring

      const gst = IndiaComplianceService.calculateGST('computing-services', aiServices, false);

      expect(gst.totalAmount).toBe(53100); // ₹53,100 with 18% GST
      expect(gst.cgst).toBe(4050); // 9% CGST
      expect(gst.sgst).toBe(4050); // 9% SGST
    });
  });
});
