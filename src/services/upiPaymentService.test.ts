import { describe, it, expect, beforeEach, vi } from 'vitest';
import { upiPaymentService, formatINR, formatOWP, UPIPaymentRequest, KYCData } from './upiPaymentService';

describe('UPIPaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getConversionQuote', () => {
    it('should calculate correct OWP tokens for INR amount', async () => {
      const quote = await upiPaymentService.getConversionQuote(1000);
      expect(quote.inputAmount).toBe(1000);
      expect(quote.outputAmount).toBe(2000);
      expect(quote.exchangeRate).toBe(0.5);
    });

    it('should include all fee components', async () => {
      const quote = await upiPaymentService.getConversionQuote(1000);
      expect(quote.fees.transfi).toBe(10);
      expect(quote.fees.razorpay).toBe(20);
      expect(quote.fees.network).toBe(0.1);
    });

    it('should enforce minimum Razorpay fee', async () => {
      const quote = await upiPaymentService.getConversionQuote(50);
      expect(quote.fees.razorpay).toBe(2);
    });
  });

  describe('createPaymentOrder', () => {
    const validRequest: UPIPaymentRequest = {
      amount: 1000,
      currency: 'INR',
      email: 'test@example.com',
      phone: '9876543210',
      name: 'Test User',
    };

    it('should create payment order with valid data', async () => {
      const result = await upiPaymentService.createPaymentOrder(validRequest);
      expect(result.orderId).toBeTruthy();
      expect(result.orderId).toMatch(/^order_/);
      expect(result.amount).toBe(1000);
    });

    it('should generate unique order IDs', async () => {
      const result1 = await upiPaymentService.createPaymentOrder(validRequest);
      const result2 = await upiPaymentService.createPaymentOrder(validRequest);
      expect(result1.orderId).not.toBe(result2.orderId);
    });
  });

  describe('verifyKYC', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should verify basic KYC successfully', async () => {
      const kycData: KYCData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
      };
      const promise = upiPaymentService.verifyKYC(kycData);
      vi.advanceTimersByTime(2000);
      const result = await promise;
      expect(result.verified).toBe(true);
      expect(result.level).toBe('basic');
    });

    it('should verify intermediate KYC with Aadhaar', async () => {
      const kycData: KYCData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        aadhaarNumber: '123456789012',
      };
      const promise = upiPaymentService.verifyKYC(kycData);
      vi.advanceTimersByTime(2000);
      const result = await promise;
      expect(result.verified).toBe(true);
      expect(result.level).toBe('intermediate');
    });
  });

  describe('getPaymentLimits', () => {
    it('should return correct limits for basic KYC', () => {
      const limits = upiPaymentService.getPaymentLimits('basic');
      expect(limits.dailyLimit).toBe(5000);
      expect(limits.monthlyLimit).toBe(25000);
      expect(limits.singleTransaction).toBe(2000);
    });

    it('should return correct limits for advanced KYC', () => {
      const limits = upiPaymentService.getPaymentLimits('advanced');
      expect(limits.dailyLimit).toBe(100000);
      expect(limits.monthlyLimit).toBe(1000000);
      expect(limits.singleTransaction).toBe(50000);
    });
  });

  describe('formatINR', () => {
    it('should format INR correctly', () => {
      expect(formatINR(1000)).toContain('1,000');
      expect(formatINR(0)).toContain('0');
    });
  });

  describe('formatOWP', () => {
    it('should format OWP correctly', () => {
      expect(formatOWP(1000)).toContain('1,000');
      expect(formatOWP(1000)).toContain('OWP');
    });
  });
});