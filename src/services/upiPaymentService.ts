'use client';

import { Principal } from '@dfinity/principal';
import { OWP_TOKEN_DECIMALS } from '@/types/owp-token';
import { owpTokenService } from './owpTokenService';

export interface UPIPaymentRequest {
  amount: number; // Amount in INR
  currency: 'INR';
  email: string;
  phone: string;
  name: string;
  description?: string;
  orderId?: string;
}

export interface UPIPaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export interface KYCData {
  name: string;
  email: string;
  phone: string;
  aadhaarNumber?: string;
  panNumber?: string;
  address?: string;
  dateOfBirth?: string;
  bankAccount?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
}

export interface KYCVerificationResult {
  verified: boolean;
  level: 'basic' | 'intermediate' | 'advanced';
  verificationId: string;
  errors?: string[];
}

export interface TokenConversionQuote {
  inputAmount: number; // INR
  outputAmount: number; // OWP tokens
  exchangeRate: number; // INR per OWP
  fees: {
    transfi: number; // TransFi fees
    razorpay: number; // Razorpay fees
    network: number; // Network fees
  };
  estimatedTime: string; // e.g., "2-5 minutes"
}

class UPIPaymentService {
  private razorpay: any;
  private transfiClient: any;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private async initialize() {
    try {
      // Initialize Razorpay (server-side initialization needed)
      // For now, we'll use simulation mode
      this.isInitialized = true;
      console.log('UPI Payment Service initialized in simulation mode');
    } catch (error) {
      console.error('Failed to initialize UPI Payment Service:', error);
    }
  }

  /**
   * Get conversion quote for INR to OWP tokens
   */
  async getConversionQuote(amountINR: number): Promise<TokenConversionQuote> {
    // Simulated conversion rates
    const owpToINRRate = 0.5; // 1 OWP = ₹0.50
    const outputTokens = amountINR / owpToINRRate;

    return {
      inputAmount: amountINR,
      outputAmount: outputTokens,
      exchangeRate: owpToINRRate,
      fees: {
        transfi: amountINR * 0.01, // 1% TransFi fee
        razorpay: Math.max(2, amountINR * 0.02), // 2% Razorpay fee, min ₹2
        network: 0.1, // Fixed network fee
      },
      estimatedTime: '2-5 minutes',
    };
  }

  /**
   * Create UPI payment order
   */
  async createPaymentOrder(
    request: UPIPaymentRequest
  ): Promise<{ orderId: string; amount: number }> {
    // Simulate order creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log('Creating UPI payment order:', {
      orderId,
      amount: request.amount,
      currency: request.currency,
      email: request.email,
    });

    // In production, this would call Razorpay API:
    // const order = await this.razorpay.orders.create({
    //   amount: request.amount * 100, // Convert to paise
    //   currency: request.currency,
    //   receipt: orderId,
    //   notes: {
    //     email: request.email,
    //     phone: request.phone,
    //     name: request.name,
    //   },
    // });

    return {
      orderId,
      amount: request.amount,
    };
  }

  /**
   * Process UPI payment using Razorpay
   */
  async processUPIPayment(
    orderId: string,
    amount: number,
    userDetails: { name: string; email: string; phone: string }
  ): Promise<UPIPaymentResponse> {
    return new Promise((resolve) => {
      // Simulate Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_simulation',
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'HeliosHash DAO',
        description: 'OWP Token Purchase',
        order_id: orderId,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#8B5CF6', // Purple theme
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
        },
        handler: (response: any) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      // In a real implementation, we would load Razorpay script and open checkout
      // For simulation, we'll auto-resolve after 3 seconds
      setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate for simulation

        if (isSuccess) {
          resolve({
            success: true,
            paymentId: `pay_${Date.now()}_sim`,
            orderId,
            signature: `sig_${Date.now()}_sim`,
          });
        } else {
          resolve({
            success: false,
            error: 'Simulated payment failure - insufficient funds',
          });
        }
      }, 3000);
    });
  }

  /**
   * Convert INR to USDC using TransFi
   */
  async convertToUSDC(
    amountINR: number,
    paymentId: string
  ): Promise<{ success: boolean; usdcAmount?: number; transactionId?: string; error?: string }> {
    try {
      // Simulate TransFi conversion
      const usdToInrRate = 83.2; // Current approximate rate
      const usdcAmount = amountINR / usdToInrRate;

      console.log('Converting INR to USDC via TransFi:', {
        amountINR,
        usdcAmount: usdcAmount.toFixed(6),
        paymentId,
      });

      // Simulate conversion delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        success: true,
        usdcAmount: parseFloat(usdcAmount.toFixed(6)),
        transactionId: `transfi_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };

      // In production, this would use TransFi SDK:
      // const conversion = await this.transfiClient.convertFiatToCrypto({
      //   fiatAmount: amountINR,
      //   fiatCurrency: 'INR',
      //   cryptoCurrency: 'USDC',
      //   paymentReference: paymentId,
      // });
      // return conversion;
    } catch (error) {
      console.error('TransFi conversion failed:', error);
      return {
        success: false,
        error: 'Failed to convert INR to USDC',
      };
    }
  }

  /**
   * Mint OWP tokens on ICP
   */
  async mintOWPTokens(
    recipientPrincipal: string,
    amount: number,
    transactionReference: string
  ): Promise<{ success: boolean; tokenAmount?: number; error?: string }> {
    try {
      console.log('Minting OWP tokens on ICP:', {
        recipientPrincipal,
        amount,
        transactionReference,
      });

      const principal = Principal.fromText(recipientPrincipal);
      const amountInSmallestUnit = BigInt(Math.round(amount * 10 ** OWP_TOKEN_DECIMALS));

      const result = await owpTokenService.mint(principal, amountInSmallestUnit);

      if (result && 'ok' in result) {
        return {
          success: true,
          tokenAmount: amount,
        };
      } else {
        const error = result && 'err' in result ? JSON.stringify(result.err) : 'Unknown error';
        console.error('OWP token minting failed:', error);
        return {
          success: false,
          error: `Failed to mint OWP tokens: ${error}`,
        };
      }
    } catch (error) {
      console.error('OWP token minting failed:', error);
      return {
        success: false,
        error: 'Failed to mint OWP tokens',
      };
    }
  }

  /**
   * Complete end-to-end UPI to OWP conversion
   */
  async processCompletePayment(
    amountINR: number,
    userDetails: { name: string; email: string; phone: string; principal: string }
  ): Promise<{
    success: boolean;
    paymentId?: string;
    owpTokens?: number;
    steps: Array<{ step: string; status: 'pending' | 'success' | 'error'; message: string }>;
  }> {
    const steps: Array<{ step: string; status: 'pending' | 'success' | 'error'; message: string }> =
      [
        { step: 'Creating Payment Order', status: 'pending', message: 'Initializing payment...' },
        {
          step: 'Processing UPI Payment',
          status: 'pending',
          message: 'Waiting for payment confirmation...',
        },
        { step: 'Converting to USDC', status: 'pending', message: 'Converting INR to USDC...' },
        {
          step: 'Minting OWP Tokens',
          status: 'pending',
          message: 'Minting tokens on blockchain...',
        },
      ];

    try {
      // Step 1: Create payment order
      steps[0].status = 'success';
      steps[0].message = 'Payment order created successfully';
      const { orderId } = await this.createPaymentOrder({
        amount: amountINR,
        currency: 'INR',
        email: userDetails.email,
        phone: userDetails.phone,
        name: userDetails.name,
        description: 'OWP Token Purchase',
      });

      // Step 2: Process UPI payment
      const paymentResult = await this.processUPIPayment(orderId, amountINR, userDetails);

      if (!paymentResult.success) {
        steps[1].status = 'error';
        steps[1].message = paymentResult.error || 'Payment failed';
        return { success: false, steps };
      }

      steps[1].status = 'success';
      steps[1].message = `Payment successful - ID: ${paymentResult.paymentId}`;

      // Step 3: Convert to USDC (if needed)
      const conversionResult = await this.convertToUSDC(amountINR, paymentResult.paymentId!);

      if (!conversionResult.success) {
        steps[2].status = 'error';
        steps[2].message = conversionResult.error || 'Conversion failed';
        return { success: false, steps };
      }

      steps[2].status = 'success';
      steps[2].message = `Converted to ${conversionResult.usdcAmount} USDC`;

      // Step 4: Mint OWP tokens
      const quote = await this.getConversionQuote(amountINR);
      const mintResult = await this.mintOWPTokens(
        userDetails.principal,
        quote.outputAmount,
        paymentResult.paymentId!
      );

      if (!mintResult.success) {
        steps[3].status = 'error';
        steps[3].message = mintResult.error || 'Token minting failed';
        return { success: false, steps };
      }

      steps[3].status = 'success';
      steps[3].message = `Minted ${mintResult.tokenAmount} OWP tokens`;

      return {
        success: true,
        paymentId: paymentResult.paymentId,
        owpTokens: mintResult.tokenAmount,
        steps,
      };
    } catch (error) {
      console.error('Complete payment process failed:', error);
      return {
        success: false,
        steps: steps.map((step, index) => ({
          ...step,
          status: index === 0 ? ('error' as const) : ('pending' as const),
          message: index === 0 ? 'Failed to initialize payment' : step.message,
        })),
      };
    }
  }

  /**
   * Verify KYC data for compliance
   */
  async verifyKYC(kycData: KYCData): Promise<KYCVerificationResult> {
    console.log('Verifying KYC data:', { ...kycData, aadhaarNumber: '****masked****' });

    // Simulate KYC verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const hasBasicInfo = kycData.name && kycData.email && kycData.phone;
    const hasIntermediateInfo = hasBasicInfo && (kycData.aadhaarNumber || kycData.panNumber);
    const hasAdvancedInfo = hasIntermediateInfo && kycData.bankAccount;

    let level: 'basic' | 'intermediate' | 'advanced' = 'basic';
    const errors: string[] = [];

    if (!hasBasicInfo) {
      errors.push('Name, email, and phone are required');
    }

    if (hasAdvancedInfo) {
      level = 'advanced';
    } else if (hasIntermediateInfo) {
      level = 'intermediate';
    }

    return {
      verified: errors.length === 0,
      level,
      verificationId: `kyc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get payment limits based on KYC level
   */
  getPaymentLimits(kycLevel: 'basic' | 'intermediate' | 'advanced') {
    const limits = {
      basic: {
        dailyLimit: 5000, // ₹5,000 per day
        monthlyLimit: 25000, // ₹25,000 per month
        singleTransaction: 2000, // ₹2,000 per transaction
      },
      intermediate: {
        dailyLimit: 25000, // ₹25,000 per day
        monthlyLimit: 200000, // ₹2,00,000 per month
        singleTransaction: 10000, // ₹10,000 per transaction
      },
      advanced: {
        dailyLimit: 100000, // ₹1,00,000 per day
        monthlyLimit: 1000000, // ₹10,00,000 per month
        singleTransaction: 50000, // ₹50,000 per transaction
      },
    };

    return limits[kycLevel];
  }
}

// Export singleton instance
export const upiPaymentService = new UPIPaymentService();

// Export utility functions
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatOWP = (amount: number): string => {
  return (
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount) + ' OWP'
  );
};
