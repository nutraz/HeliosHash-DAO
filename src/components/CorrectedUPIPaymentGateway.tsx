'use client';

import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Receipt,
  Shield,
  Smartphone,
  Star,
  Vote,
  Wallet,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// 1WP Tier System Interface
interface TierInfo {
  tier: number;
  priceUSDC: number;
  baseOWP: number;
  voteWeight: number;
  targetMembers: number;
  benefits: string[];
}

interface PaymentStep {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

interface TierBenefits {
  tierInfo: TierInfo;
  priceINR: number;
  priceUSDC: number;
  baseOWP: number;
  bonusOWP: number;
  totalOWP: number;
  voteWeight: number;
  fees: {
    razorpay: number;
    transfi: number;
    network: number;
  };
  totalFees: number;
  totalCost: number;
}

const CorrectedUPIPaymentGateway = () => {
  const [step, setStep] = useState(1); // 1: Tier Selection, 2: Gender & KYC, 3: Payment, 4: Processing, 5: Success
  const [selectedTier, setSelectedTier] = useState<number>(7); // Default to Tier 7 (most affordable)
  const [gender, setGender] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [aadhaar, setAadhaar] = useState<string>('');
  const [pan, setPan] = useState<string>('');
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string>('');

  // 1WP Tier System (Aligned with existing contract 0xDaa7...F61e30)
  const usdToINRRate = 83.2;
  const usdcToOwpRate = 100; // 1 USDC = 100 OWP

  const tierSystem: TierInfo[] = [
    {
      tier: 1,
      priceUSDC: 3162.5,
      baseOWP: 316250,
      voteWeight: 64,
      targetMembers: 95,
      benefits: [
        'Maximum voting power',
        'Highest dividend share',
        'Exclusive governance access',
        'Leadership role eligibility',
      ],
    },
    {
      tier: 2,
      priceUSDC: 1581.25,
      baseOWP: 158125,
      voteWeight: 32,
      targetMembers: 95,
      benefits: [
        'High voting power',
        'Significant dividend share',
        'Governance participation',
        'Committee member eligibility',
      ],
    },
    {
      tier: 3,
      priceUSDC: 841.28,
      baseOWP: 84128,
      voteWeight: 16,
      targetMembers: 120,
      benefits: [
        'Strong voting power',
        'Good dividend share',
        'Proposal submission rights',
        'Project lead eligibility',
      ],
    },
    {
      tier: 4,
      priceUSDC: 420.64,
      baseOWP: 42064,
      voteWeight: 8,
      targetMembers: 150,
      benefits: [
        'Moderate voting power',
        'Regular dividends',
        'Micro-grant eligibility (women)',
        'Community role access',
      ],
    },
    {
      tier: 5,
      priceUSDC: 209.21,
      baseOWP: 20921,
      voteWeight: 4,
      targetMembers: 250,
      benefits: [
        'Basic voting power',
        'Regular dividends',
        'Community participation',
        'Training program access',
      ],
    },
    {
      tier: 6,
      priceUSDC: 139.52,
      baseOWP: 13952,
      voteWeight: 2,
      targetMembers: 390,
      benefits: [
        'Entry-level voting',
        'Basic dividends',
        'Community events',
        'Skill development access',
      ],
    },
    {
      tier: 7,
      priceUSDC: 69.76,
      baseOWP: 6976,
      voteWeight: 1,
      targetMembers: 400,
      benefits: [
        'Community voting',
        'Basic dividends',
        'Event participation',
        'Learning opportunities',
      ],
    },
  ];

  // Get tier information
  const getTierInfo = (tier: number): TierInfo => {
    return tierSystem.find((t) => t.tier === tier) || tierSystem[6]; // Default to Tier 7
  };

  // Calculate tokens including women's bonus
  const calculateTierBenefits = (tier: number, isWoman: boolean = false): TierBenefits => {
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

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatUSDC = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Simulate payment processing
  const processPayment = async () => {
    setIsProcessing(true);
    setStep(4);

    const steps: PaymentStep[] = [
      {
        step: 'Creating 1WP Tier Purchase',
        status: 'pending',
        message: 'Initializing tier purchase on Polygon...',
      },
      {
        step: 'Processing UPI Payment',
        status: 'pending',
        message: 'Waiting for UPI payment confirmation...',
      },
      {
        step: 'Minting NFT Membership',
        status: 'pending',
        message: 'Creating membership NFT on 1WP contract...',
      },
      {
        step: "Calculating Women's Bonus",
        status: 'pending',
        message: 'Processing bonus tokens via ICP bridge...',
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
    setPaymentId(`1WP_${Date.now()}_T${selectedTier}`);
    setPaymentSuccess(true);
    setStep(5);
    setIsProcessing(false);
  };

  const getSuccessMessage = (stepIndex: number) => {
    const benefits = calculateTierBenefits(selectedTier, gender === 'female');
    switch (stepIndex) {
      case 0:
        return `Tier ${selectedTier} purchase initiated - ${formatUSDC(benefits.priceUSDC)}`;
      case 1:
        return 'UPI payment confirmed - Transaction processed via Razorpay';
      case 2:
        return `NFT minted - Membership ID: URGAMU_T${selectedTier}_${Math.random()
          .toString(36)
          .substring(7)}`;
      case 3:
        return gender === 'female'
          ? `Bonus applied - Extra ${benefits.bonusOWP.toLocaleString()} OWP tokens`
          : 'Standard tokens allocated';
      default:
        return 'Step completed';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4'>
            <Wallet className='w-6 h-6 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-800'>1WP Tier Purchase</h1>
          </div>
          <p className='text-gray-600'>
            Join HeliosHash DAO with UPI Payment | UPI से 1WP सदस्यता खरीदें
          </p>
          <div className='mt-2 text-sm text-gray-500'>
            Contract: 0xDaa7...F61e30 (Polygon) • Phase 1: $167.4K / $300K (55.8%)
          </div>
        </div>

        {/* Progress Indicator */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            {['Tier Selection', 'Gender & KYC', 'Payment', 'Processing', 'Success'].map(
              (label, index) => (
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
                  <span className='ml-2 text-sm font-medium text-gray-700 hidden sm:block'>
                    {label}
                  </span>
                  {index < 4 && (
                    <ArrowRight className='w-4 h-4 text-gray-400 ml-4 hidden sm:block' />
                  )}
                </div>
              )
            )}
          </div>
          <div className='bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500'
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Tier Selection */}
        {step === 1 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Star className='w-6 h-6 text-yellow-500' />
              Select Your Membership Tier | अपना सदस्यता टियर चुनें
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {tierSystem.map((tier) => {
                const benefits = calculateTierBenefits(tier.tier, gender === 'female');
                const isSelected = selectedTier === tier.tier;
                const isRecommended = tier.tier === 7; // Tier 7 is most accessible

                return (
                  <div
                    key={tier.tier}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTier(tier.tier)}
                  >
                    {isRecommended && (
                      <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                        <span className='bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className='text-center mb-4'>
                      <h3 className='text-xl font-bold text-gray-800 mb-2'>Tier {tier.tier}</h3>
                      <div className='text-3xl font-bold text-blue-600 mb-1'>
                        {formatINR(benefits.priceINR)}
                      </div>
                      <div className='text-sm text-gray-500'>{formatUSDC(tier.priceUSDC)} USDC</div>
                    </div>

                    <div className='space-y-3 mb-6'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>Base OWP Tokens:</span>
                        <span className='font-semibold'>{benefits.baseOWP.toLocaleString()}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>Vote Weight:</span>
                        <span className='font-semibold flex items-center gap-1'>
                          <Vote className='w-4 h-4' />
                          {tier.voteWeight} PTS
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>Available Spots:</span>
                        <span className='font-semibold'>{tier.targetMembers}</span>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='font-medium text-gray-800 text-sm'>Benefits Include:</h4>
                      {tier.benefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} className='flex items-center gap-2 text-xs text-gray-600'>
                          <CheckCircle className='w-3 h-3 text-green-500' />
                          {benefit}
                        </div>
                      ))}
                      {tier.benefits.length > 3 && (
                        <div className='text-xs text-blue-500'>
                          +{tier.benefits.length - 3} more benefits
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className='absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none'>
                        <div className='absolute top-2 right-2'>
                          <CheckCircle className='w-6 h-6 text-blue-500' />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Tier Summary */}
            {selectedTier && (
              <div className='mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200'>
                <h3 className='font-semibold text-gray-800 mb-4'>Selected: Tier {selectedTier}</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                  <div>
                    <div className='text-2xl font-bold text-blue-600'>
                      {formatINR(calculateTierBenefits(selectedTier).priceINR)}
                    </div>
                    <div className='text-xs text-gray-600'>Investment</div>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-green-600'>
                      {calculateTierBenefits(selectedTier).baseOWP.toLocaleString()}
                    </div>
                    <div className='text-xs text-gray-600'>OWP Tokens</div>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-purple-600'>
                      {getTierInfo(selectedTier).voteWeight}
                    </div>
                    <div className='text-xs text-gray-600'>Vote Points</div>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-orange-600'>
                      {getTierInfo(selectedTier).targetMembers}
                    </div>
                    <div className='text-xs text-gray-600'>Max Members</div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!selectedTier}
              className='w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue to KYC | KYC पर जाएं
              <ArrowRight className='w-5 h-5 inline ml-2' />
            </button>
          </div>
        )}

        {/* Step 2: Gender & KYC Information */}
        {step === 2 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Shield className='w-6 h-6 text-blue-600' />
              Personal Information & KYC | व्यक्तिगत जानकारी और KYC
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                {/* Gender Selection */}
                <div className='p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200'>
                  <h3 className='font-semibold text-gray-800 mb-3'>
                    Gender Information (Optional)
                  </h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    This information is used only for women's empowerment incentives. You can change
                    or hide this anytime.
                  </p>

                  <div className='space-y-2'>
                    {[
                      {
                        value: 'female',
                        label: 'Female (eligible for 20% bonus tokens)',
                        icon: '👩',
                      },
                      { value: 'male', label: 'Male', icon: '👨' },
                      { value: 'non-binary', label: 'Non-binary', icon: '🧑' },
                      { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '❓' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className='flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-white transition-colors'
                      >
                        <input
                          type='radio'
                          name='gender'
                          value={option.value}
                          checked={gender === option.value}
                          onChange={(e) => setGender(e.target.value)}
                          className='w-4 h-4 text-blue-600'
                        />
                        <span className='text-lg'>{option.icon}</span>
                        <span className='text-sm'>{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {gender === 'female' && (
                    <div className='mt-4 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border border-pink-300'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Zap className='w-5 h-5 text-pink-600' />
                        <span className='font-semibold text-pink-800'>Women's Bonus Applied!</span>
                      </div>
                      <div className='text-sm text-pink-700'>
                        You'll receive{' '}
                        <strong>
                          {calculateTierBenefits(selectedTier, true).bonusOWP.toLocaleString()}{' '}
                          extra OWP tokens
                        </strong>{' '}
                        (20% bonus)
                        <br />
                        Total: {calculateTierBenefits(
                          selectedTier,
                          true
                        ).totalOWP.toLocaleString()}{' '}
                        OWP instead of{' '}
                        {calculateTierBenefits(selectedTier, false).baseOWP.toLocaleString()} OWP
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800'>Personal Information</h3>

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
                      Aadhaar Number | आधार नंबर (Optional)
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
                      PAN Number | पैन नंबर (Optional)
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
              </div>

              <div className='space-y-6'>
                {/* Tier Summary */}
                <div className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200'>
                  <h3 className='font-semibold text-gray-800 mb-4'>
                    Your Tier {selectedTier} Purchase
                  </h3>

                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span>Tier Price:</span>
                      <span className='font-semibold'>
                        {formatINR(calculateTierBenefits(selectedTier).priceINR)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Base OWP Tokens:</span>
                      <span className='font-semibold'>
                        {calculateTierBenefits(selectedTier).baseOWP.toLocaleString()}
                      </span>
                    </div>
                    {gender === 'female' && (
                      <div className='flex justify-between text-pink-600'>
                        <span>Women's Bonus (20%):</span>
                        <span className='font-semibold'>
                          +{calculateTierBenefits(selectedTier, true).bonusOWP.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between border-t pt-3 font-bold'>
                      <span>Total OWP Tokens:</span>
                      <span className='text-blue-600'>
                        {calculateTierBenefits(
                          selectedTier,
                          gender === 'female'
                        ).totalOWP.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Voting Power:</span>
                      <span className='font-semibold'>
                        {getTierInfo(selectedTier).voteWeight} PTS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits Summary */}
                <div className='p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Membership Benefits</h3>

                  <div className='space-y-2'>
                    {getTierInfo(selectedTier).benefits.map((benefit, index) => (
                      <div key={index} className='flex items-center gap-2 text-sm text-gray-700'>
                        <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0' />
                        {benefit}
                      </div>
                    ))}
                    {gender === 'female' && selectedTier <= 4 && (
                      <div className='flex items-center gap-2 text-sm text-pink-700 bg-pink-100 p-2 rounded'>
                        <Award className='w-4 h-4 text-pink-500 flex-shrink-0' />
                        Micro-grant eligibility ($500-$2,000)
                      </div>
                    )}
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Shield className='w-5 h-5 text-yellow-600' />
                    <h4 className='font-medium text-yellow-800'>Privacy Protection</h4>
                  </div>
                  <p className='text-sm text-yellow-700'>
                    Your data is encrypted and never shared. You have the right to change or delete
                    your information anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-8'>
              <button
                onClick={() => setStep(1)}
                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                ← Back to Tiers
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!name || !email || !phone}
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

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div>
                <h3 className='font-semibold text-gray-800 mb-4'>Order Summary</h3>

                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span>Tier {selectedTier} Membership</span>
                    <span className='font-semibold'>
                      {formatINR(calculateTierBenefits(selectedTier).priceINR)}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span>Base OWP Tokens</span>
                    <span className='font-semibold'>
                      {calculateTierBenefits(selectedTier).baseOWP.toLocaleString()}
                    </span>
                  </div>
                  {gender === 'female' && (
                    <div className='flex justify-between py-2 border-b border-gray-200 text-pink-600'>
                      <span>Women's Bonus (20%)</span>
                      <span className='font-semibold'>
                        +{calculateTierBenefits(selectedTier, true).bonusOWP.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span>Transaction Fees</span>
                    <span className='text-red-600'>
                      {formatINR(calculateTierBenefits(selectedTier).totalFees)}
                    </span>
                  </div>
                  <div className='flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg'>
                    <span>Total Cost</span>
                    <span>{formatINR(calculateTierBenefits(selectedTier).totalCost)}</span>
                  </div>
                </div>

                <div className='p-4 bg-gray-50 rounded-lg'>
                  <h4 className='font-medium text-gray-800 mb-2'>Member Details</h4>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <div>Name: {name}</div>
                    <div>Email: {email}</div>
                    <div>Phone: {phone}</div>
                    <div>Gender: {gender || 'Not specified'}</div>
                    <div>
                      KYC Level:{' '}
                      {aadhaar && pan ? 'Advanced' : aadhaar || pan ? 'Intermediate' : 'Basic'}
                    </div>
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

                <div className='mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Shield className='w-5 h-5 text-green-600' />
                    <h4 className='font-medium text-green-800'>Secure 1WP Integration</h4>
                  </div>
                  <div className='text-sm text-green-700 space-y-1'>
                    <p>✓ Payment secured by Razorpay with bank-level encryption</p>
                    <p>✓ NFT minted on verified 1WP contract (0xDaa7...F61e30)</p>
                    <p>✓ Bonus tokens processed via secure ICP bridge</p>
                    <p>✓ Full compliance with Phase 1 governance rules</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-8'>
              <button
                onClick={() => setStep(2)}
                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                ← Back to KYC
              </button>
              <button
                onClick={processPayment}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2'
              >
                <Smartphone className='w-5 h-5' />
                Pay {formatINR(calculateTierBenefits(selectedTier).totalCost)} with UPI
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Processing */}
        {step === 4 && (
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Clock className='w-6 h-6 text-blue-600' />
              Processing 1WP Tier Purchase | 1WP सदस्यता प्रसंस्करण
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
                <br />
                📄 Contract: 0xDaa7...F61e30 (Polygon) | Bridge: ICP Canister
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
              Welcome to HeliosHash DAO! | स्वागत है!
            </h2>

            <p className='text-gray-600 mb-8'>
              Your Tier {selectedTier} membership has been activated and your OWP tokens have been
              minted.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg'>
                <Zap className='w-8 h-8 text-green-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-800 mb-2'>OWP Tokens</h3>
                <p className='text-2xl font-bold text-green-600'>
                  {calculateTierBenefits(
                    selectedTier,
                    gender === 'female'
                  ).totalOWP.toLocaleString()}
                </p>
                {gender === 'female' && (
                  <p className='text-xs text-pink-600 mt-1'>
                    +{calculateTierBenefits(selectedTier, true).bonusOWP.toLocaleString()} bonus
                  </p>
                )}
              </div>

              <div className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg'>
                <Vote className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-800 mb-2'>Voting Power</h3>
                <p className='text-2xl font-bold text-blue-600'>
                  {getTierInfo(selectedTier).voteWeight} PTS
                </p>
                <p className='text-xs text-blue-600 mt-1'>Financial votes</p>
              </div>

              <div className='p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg'>
                <Receipt className='w-8 h-8 text-purple-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-800 mb-2'>Membership ID</h3>
                <p className='text-sm font-mono text-purple-600 break-all'>{paymentId}</p>
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 justify-center'>
              <button
                onClick={() => alert('Redirecting to 1WP dashboard...')}
                className='px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all'
              >
                Go to Dashboard | डैशबोर्ड पर जाएं
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedTier(7);
                  setGender('');
                  setPaymentSuccess(false);
                  setPaymentSteps([]);
                }}
                className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors'
              >
                Buy Another Tier | दूसरा टियर खरीदें
              </button>
            </div>

            <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <h4 className='font-semibold text-yellow-800 mb-2'>Next Steps:</h4>
              <div className='text-sm text-yellow-700 space-y-1'>
                <p>1. Check your wallet for OWP tokens and NFT membership</p>
                <p>2. Join governance discussions on Discord/Telegram</p>
                <p>3. Participate in Phase 1 milestone voting</p>
                {gender === 'female' && selectedTier <= 4 && (
                  <p>4. Apply for micro-grants ($500-$2,000) for your projects</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectedUPIPaymentGateway;
