'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  IndianRupee,
  Loader2,
  Receipt,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Interfaces from our service (simplified for standalone component)
interface UPIPaymentRequest {
  amount: number;
  email: string;
  phone: string;
  name: string;
}

interface PaymentStep {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

interface KYCLevel {
  level: 'basic' | 'intermediate' | 'advanced';
  dailyLimit: number;
  monthlyLimit: number;
  singleTransaction: number;
}

const UPIPaymentGateway = () => {
  const [step, setStep] = useState(1); // 1: Tier Selection, 2: Gender & KYC, 3: Payment, 4: Processing, 5: Success
  const [selectedTier, setSelectedTier] = useState<number>(7); // Default to Tier 7 (most affordable)
  const [amount, setAmount] = useState<string>(''); // Missing amount state
  const [gender, setGender] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [aadhaar, setAadhaar] = useState<string>('');
  const [pan, setPan] = useState<string>('');
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [owpTokens, setOwpTokens] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<string>('');

  // 1WP Tier System (Aligned with existing contract)
  const usdToINRRate = 83.2;
  const usdcToOwpRate = 100; // 1 USDC = 100 OWP
  const owpToINRRate = usdToINRRate / usdcToOwpRate; // OWP to INR rate

  const tierSystem = [
    { tier: 1, priceUSDC: 3162.5, baseOWP: 316250, voteWeight: 64, targetMembers: 95 },
    { tier: 2, priceUSDC: 1581.25, baseOWP: 158125, voteWeight: 32, targetMembers: 95 },
    { tier: 3, priceUSDC: 841.28, baseOWP: 84128, voteWeight: 16, targetMembers: 120 },
    { tier: 4, priceUSDC: 420.64, baseOWP: 42064, voteWeight: 8, targetMembers: 150 },
    { tier: 5, priceUSDC: 209.21, baseOWP: 20921, voteWeight: 4, targetMembers: 250 },
    { tier: 6, priceUSDC: 139.52, baseOWP: 13952, voteWeight: 2, targetMembers: 390 },
    { tier: 7, priceUSDC: 69.76, baseOWP: 6976, voteWeight: 1, targetMembers: 400 },
  ];

  // KYC Levels (maintained for compliance)
  const kycLevels: Record<string, KYCLevel> = {
    basic: {
      level: 'basic',
      dailyLimit: 5000,
      monthlyLimit: 25000,
      singleTransaction: 2000,
    },
    intermediate: {
      level: 'intermediate',
      dailyLimit: 25000,
      monthlyLimit: 200000,
      singleTransaction: 10000,
    },
    advanced: {
      level: 'advanced',
      dailyLimit: 100000,
      monthlyLimit: 1000000,
      singleTransaction: 50000,
    },
  };

  // Get tier information
  const getTierInfo = (tier: number) => {
    return tierSystem.find((t) => t.tier === tier) || tierSystem[6]; // Default to Tier 7
  };

  // Calculate tokens for custom amount
  const calculateTokens = (amountINR: number) => {
    const amountUSDC = amountINR / usdToINRRate;
    const tokens = amountUSDC * usdcToOwpRate;
    const fees = {
      razorpay: Math.max(2, amountINR * 0.02),
      transfi: amountINR * 0.01,
      network: 0.1,
    };
    const totalFees = fees.razorpay + fees.transfi + fees.network;

    return {
      tokens,
      amountUSDC,
      totalFees,
      fees,
    };
  };

  // Calculate tokens including women's bonus
  const calculateTierBenefits = (tier: number, isWoman: boolean = false) => {
    const tierInfo = getTierInfo(tier);
    const priceINR = tierInfo.priceUSDC * usdToINRRate;
    const baseOWP = tierInfo.baseOWP;
    const bonusOWP = isWoman ? Math.floor(baseOWP * 0.2) : 0; // 20% bonus for women
    const totalOWP = baseOWP + bonusOWP;

    const fees = {
      razorpay: Math.max(2, priceINR * 0.02),
      transfi: priceINR * 0.01,
      network: 0.1,
    };
    const totalFees = fees.razorpay + fees.transfi + fees.network;

    return {
      tierInfo,
      priceINR,
      priceUSDC: tierInfo.priceUSDC,
      baseOWP,
      bonusOWP,
      totalOWP,
      voteWeight: tierInfo.voteWeight,
      fees,
      totalFees,
      totalCost: priceINR + totalFees,
    };
  };

  // Determine KYC level
  const getKYCLevel = (): KYCLevel => {
    if (aadhaar && pan) return kycLevels.advanced;
    if (aadhaar || pan) return kycLevels.intermediate;
    return kycLevels.basic;
  };

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Simulate payment processing
  const processPayment = async () => {
    setIsProcessing(true);
    setStep(4);

    const steps: PaymentStep[] = [
      { step: 'Creating Payment Order', status: 'pending', message: 'Initializing payment...' },
      {
        step: 'Processing UPI Payment',
        status: 'pending',
        message: 'Waiting for payment confirmation...',
      },
      {
        step: 'Converting to USDC',
        status: 'pending',
        message: 'Converting INR to USDC via TransFi...',
      },
      {
        step: 'Minting OWP Tokens',
        status: 'pending',
        message: 'Minting tokens on Internet Computer...',
      },
    ];

    setPaymentSteps([...steps]);

    // Simulate each step with delays
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      steps[i].status = 'success';
      steps[i].message = getSuccessMessage(i);
      setPaymentSteps([...steps]);
    }

    // Final success
    const tokens = calculateTokens(parseFloat(amount));
    setOwpTokens(tokens.tokens);
    setPaymentId(`pay_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    setPaymentSuccess(true);
    setStep(5);
    setIsProcessing(false);
  };

  const getSuccessMessage = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return 'Payment order created successfully';
      case 1:
        return 'UPI payment confirmed - Transaction ID: UPI' + Date.now();
      case 2:
        return `Converted to ${(parseFloat(amount) / usdToINRRate).toFixed(4)} USDC`;
      case 3:
        return `Minted ${calculateTokens(parseFloat(amount)).tokens.toFixed(2)} OWP tokens`;
      default:
        return 'Step completed';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4'>
            <Wallet className='w-6 h-6 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-800'>UPI Payment Gateway</h1>
          </div>
          <p className='text-gray-600'>Buy OWP tokens with UPI | UPI से OWP टोकन खरीदें</p>
        </div>

        {/* Progress Indicator */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            {['Amount', 'KYC', 'Payment', 'Processing', 'Success'].map((label, index) => (
              <div key={label} className='flex items-center'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > index + 1
                      ? 'bg-green-500 text-white'
                      : step === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > index + 1 ? <CheckCircle className='w-5 h-5' /> : index + 1}
                </div>
                <span className='ml-2 text-sm font-medium text-gray-700'>{label}</span>
                {index < 4 && <ArrowRight className='w-4 h-4 text-gray-400 ml-4' />}
              </div>
            ))}
          </div>
          <div className='bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500'
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Amount Input */}
        {step === 1 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <IndianRupee className='w-6 h-6 text-green-600' />
              Enter Amount | राशि दर्ज करें
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Amount in INR | INR में राशि
                </label>
                <div className='relative'>
                  <IndianRupee className='w-5 h-5 text-gray-400 absolute left-3 top-3' />
                  <input
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
                    placeholder='Enter amount...'
                    min='10'
                    max='50000'
                  />
                </div>
                <p className='text-sm text-gray-500 mt-2'>Minimum: ₹10 | Maximum: ₹50,000</p>

                {amount && parseFloat(amount) > 0 && (
                  <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                    <h3 className='font-semibold text-gray-800 mb-2'>Conversion Details</h3>
                    <div className='space-y-1 text-sm'>
                      <div className='flex justify-between'>
                        <span>OWP Tokens:</span>
                        <span className='font-semibold'>
                          {calculateTokens(parseFloat(amount)).tokens.toFixed(2)} OWP
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Exchange Rate:</span>
                        <span>1 OWP = ₹{owpToINRRate}</span>
                      </div>
                      <div className='flex justify-between text-gray-600'>
                        <span>Transaction Fees:</span>
                        <span>₹{calculateTokens(parseFloat(amount)).totalFees.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <div className='p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <Zap className='w-6 h-6 text-green-600' />
                    <h3 className='font-semibold text-gray-800'>Why OWP Tokens?</h3>
                  </div>
                  <ul className='text-sm text-gray-600 space-y-1'>
                    <li>• Governance voting in DAO decisions</li>
                    <li>• EV charging payments at 20% discount</li>
                    <li>• Staking rewards up to 12% APY</li>
                    <li>• Priority access to solar projects</li>
                  </ul>
                </div>

                <div className='p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <Users className='w-6 h-6 text-purple-600' />
                    <h3 className='font-semibold text-gray-800'>Women's Bonus</h3>
                  </div>
                  <p className='text-sm text-gray-600'>
                    Women members get <strong>20% bonus tokens</strong> on all purchases!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!amount || parseFloat(amount) < 10}
              className='w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue to KYC | KYC पर जाएं
              <ArrowRight className='w-5 h-5 inline ml-2' />
            </button>
          </div>
        )}

        {/* Step 2: KYC Information */}
        {step === 2 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Shield className='w-6 h-6 text-blue-600' />
              KYC Verification | केवाईसी सत्यापन
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name | पूरा नाम *
                  </label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter your full name'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Address | ईमेल पता *
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='your@email.com'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone Number | फोन नंबर *
                  </label>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='+91 98765 43210'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Aadhaar Number | आधार नंबर (Optional for higher limits)
                  </label>
                  <input
                    type='text'
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='1234 5678 9012'
                    maxLength={12}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    PAN Number | पैन नंबर (Optional for higher limits)
                  </label>
                  <input
                    type='text'
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='ABCDE1234F'
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <h3 className='font-semibold text-gray-800 mb-4'>Transaction Limits</h3>

                {Object.entries(kycLevels).map(([key, level]) => {
                  const isCurrentLevel = level.level === getKYCLevel().level;
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border mb-3 ${
                        isCurrentLevel ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isCurrentLevel ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                        <h4 className='font-medium text-gray-800 capitalize'>
                          {level.level} Level
                        </h4>
                      </div>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <div>Daily: {formatINR(level.dailyLimit)}</div>
                        <div>Monthly: {formatINR(level.monthlyLimit)}</div>
                        <div>Per Transaction: {formatINR(level.singleTransaction)}</div>
                      </div>
                    </div>
                  );
                })}

                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <AlertCircle className='w-5 h-5 text-yellow-600' />
                    <h4 className='font-medium text-yellow-800'>Current Amount Check</h4>
                  </div>
                  <p className='text-sm text-yellow-700'>
                    Your amount of {formatINR(parseFloat(amount || '0'))} is{' '}
                    {parseFloat(amount || '0') <= getKYCLevel().singleTransaction
                      ? 'within limits'
                      : 'exceeds your current KYC limit'}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-8'>
              <button
                onClick={() => setStep(1)}
                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                Back | पीछे
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={
                  !name ||
                  !email ||
                  !phone ||
                  parseFloat(amount || '0') > getKYCLevel().singleTransaction
                }
                className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Proceed to Payment | भुगतान पर जाएं
                <ArrowRight className='w-5 h-5 inline ml-2' />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Confirmation */}
        {step === 3 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Receipt className='w-6 h-6 text-green-600' />
              Payment Confirmation | भुगतान पुष्टि
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h3 className='font-semibold text-gray-800 mb-4'>Order Summary</h3>

                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span>Amount</span>
                    <span className='font-semibold'>{formatINR(parseFloat(amount))}</span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span>OWP Tokens</span>
                    <span className='font-semibold'>
                      {calculateTokens(parseFloat(amount)).tokens.toFixed(2)} OWP
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span>Transaction Fees</span>
                    <span className='text-red-600'>
                      {formatINR(calculateTokens(parseFloat(amount)).totalFees)}
                    </span>
                  </div>
                  <div className='flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg'>
                    <span>Total</span>
                    <span>
                      {formatINR(
                        parseFloat(amount) + calculateTokens(parseFloat(amount)).totalFees
                      )}
                    </span>
                  </div>
                </div>

                <div className='p-4 bg-gray-50 rounded-lg'>
                  <h4 className='font-medium text-gray-800 mb-2'>User Details</h4>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <div>Name: {name}</div>
                    <div>Email: {email}</div>
                    <div>Phone: {phone}</div>
                    <div>KYC Level: {getKYCLevel().level}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='font-semibold text-gray-800 mb-4'>Payment Methods</h3>

                <div className='space-y-3'>
                  <div className='p-4 border-2 border-blue-500 bg-blue-50 rounded-lg'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Smartphone className='w-6 h-6 text-blue-600' />
                      <h4 className='font-medium text-gray-800'>UPI Payment</h4>
                      <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                        Recommended
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 mb-3'>
                      Pay instantly using any UPI app like GPay, PhonePe, Paytm
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      <span className='px-2 py-1 bg-white text-gray-700 text-xs rounded border'>
                        Google Pay
                      </span>
                      <span className='px-2 py-1 bg-white text-gray-700 text-xs rounded border'>
                        PhonePe
                      </span>
                      <span className='px-2 py-1 bg-white text-gray-700 text-xs rounded border'>
                        Paytm
                      </span>
                      <span className='px-2 py-1 bg-white text-gray-700 text-xs rounded border'>
                        BHIM
                      </span>
                    </div>
                  </div>

                  <div className='p-4 border border-gray-200 bg-gray-50 rounded-lg opacity-60'>
                    <div className='flex items-center gap-3 mb-2'>
                      <CreditCard className='w-6 h-6 text-gray-400' />
                      <h4 className='font-medium text-gray-500'>Credit/Debit Card</h4>
                      <span className='px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full'>
                        Coming Soon
                      </span>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Direct card payments will be available soon
                    </p>
                  </div>
                </div>

                <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Shield className='w-5 h-5 text-green-600' />
                    <h4 className='font-medium text-green-800'>Secure Payment</h4>
                  </div>
                  <p className='text-sm text-green-700'>
                    Your payment is secured by Razorpay with bank-level encryption
                  </p>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-8'>
              <button
                onClick={() => setStep(2)}
                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                Back | पीछे
              </button>
              <button
                onClick={processPayment}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2'
              >
                <Smartphone className='w-5 h-5' />
                Pay with UPI | UPI से भुगतान करें
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Processing */}
        {step === 4 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Clock className='w-6 h-6 text-blue-600' />
              Processing Payment | भुगतान प्रसंस्करण
            </h2>

            <div className='space-y-4'>
              {paymentSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    step.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : step.status === 'error'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className='flex-shrink-0'>
                    {step.status === 'success' ? (
                      <CheckCircle className='w-6 h-6 text-green-600' />
                    ) : step.status === 'error' ? (
                      <AlertCircle className='w-6 h-6 text-red-600' />
                    ) : (
                      <Loader2 className='w-6 h-6 text-blue-600 animate-spin' />
                    )}
                  </div>
                  <div className='flex-grow'>
                    <h3 className='font-medium text-gray-800'>{step.step}</h3>
                    <p className='text-sm text-gray-600'>{step.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-700'>
                🕐 Processing time: 2-5 minutes | प्रसंस्करण समय: 2-5 मिनट
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && paymentSuccess && (
          <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='w-12 h-12 text-green-600' />
            </div>

            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              Payment Successful! | भुगतान सफल!
            </h2>

            <p className='text-gray-600 mb-8'>
              Your OWP tokens have been minted and added to your wallet.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg'>
                <Zap className='w-8 h-8 text-green-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-800 mb-2'>Tokens Received</h3>
                <p className='text-2xl font-bold text-green-600'>{owpTokens.toFixed(2)} OWP</p>
              </div>

              <div className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg'>
                <Receipt className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-800 mb-2'>Payment ID</h3>
                <p className='text-sm font-mono text-blue-600 break-all'>{paymentId}</p>
              </div>

              <div className='p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg'>
                <TrendingUp className='w-8 h-8 text-purple-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-800 mb-2'>Next Steps</h3>
                <p className='text-sm text-gray-600'>Start voting in DAO proposals</p>
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 justify-center'>
              <button
                onClick={() => alert('Redirecting to dashboard...')}
                className='px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all'
              >
                Go to Dashboard | डैशबोर्ड पर जाएं
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setAmount('');
                  setPaymentSuccess(false);
                  setPaymentSteps([]);
                }}
                className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors'
              >
                Buy More Tokens | और टोकन खरीदें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIPaymentGateway;
