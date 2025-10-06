'use client';

import {
  Award,
  Calculator,
  CheckCircle,
  CreditCard,
  Gift,
  Globe,
  Heart,
  Lock,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import our privacy and grant components
import { privacyService, type GenderOption } from '../services/privacyComplianceService';
import MicroGrantSystem from './MicroGrantSystem';
import PrivacyDashboard from './PrivacyDashboard';

interface TierInfo {
  tier: string;
  price: number; // USD
  priceINR: number; // INR
  baseOWP: number;
  womenBonusOWP: number;
  totalOWPForWomen: number;
  voteWeight: number;
  description: string;
  benefits: string[];
}

interface UserState {
  isConnected: boolean;
  address?: string;
  hasConsent: boolean;
  genderData?: GenderOption;
  selectedTier?: TierInfo;
  isWomen?: boolean;
  membershipTier?: string;
}

const Enhanced1WPIntegration = () => {
  const [activeSection, setActiveSection] = useState<'membership' | 'grants' | 'privacy'>(
    'membership'
  );
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [userState, setUserState] = useState<UserState>({
    isConnected: false,
    hasConsent: false,
  });

  const [showBonusCalculator, setShowBonusCalculator] = useState(false);
  const [showConsentFlow, setShowConsentFlow] = useState(false);
  const [selectedTierForCalculation, setSelectedTierForCalculation] = useState<TierInfo | null>(
    null
  );

  // 1WP Tier Structure (matching existing contract)
  const tierStructure: TierInfo[] = [
    {
      tier: 'Tier 7',
      price: 69.76,
      priceINR: 5790,
      baseOWP: 6976,
      womenBonusOWP: 1395,
      totalOWPForWomen: 8371,
      voteWeight: 1,
      description: 'Entry level membership',
      benefits: ['Basic voting rights', 'Community access', 'Solar project updates'],
    },
    {
      tier: 'Tier 6',
      price: 139.53,
      priceINR: 11580,
      baseOWP: 13953,
      womenBonusOWP: 2791,
      totalOWPForWomen: 16744,
      voteWeight: 2,
      description: 'Standard membership',
      benefits: ['Enhanced voting power', 'Project insights', 'Early access to features'],
    },
    {
      tier: 'Tier 5',
      price: 279.07,
      priceINR: 23162,
      baseOWP: 27907,
      womenBonusOWP: 5581,
      totalOWPForWomen: 33488,
      voteWeight: 4,
      description: 'Premium membership',
      benefits: ['Priority voting', 'Detailed analytics', 'Beta feature access'],
    },
    {
      tier: 'Tier 4',
      price: 558.13,
      priceINR: 46324,
      baseOWP: 55813,
      womenBonusOWP: 11163,
      totalOWPForWomen: 66976,
      voteWeight: 8,
      description: 'Advanced membership + Grant Eligibility',
      benefits: [
        'Micro-grant eligibility',
        'Priority support',
        'Advanced features',
        'Community leadership',
      ],
    },
    {
      tier: 'Tier 3',
      price: 1116.25,
      priceINR: 92647,
      baseOWP: 111625,
      womenBonusOWP: 22325,
      totalOWPForWomen: 133950,
      voteWeight: 16,
      description: 'Professional membership',
      benefits: ['Higher grant amounts', 'Project collaboration', 'Governance participation'],
    },
    {
      tier: 'Tier 2',
      price: 2232.5,
      priceINR: 185295,
      baseOWP: 223250,
      womenBonusOWP: 44650,
      totalOWPForWomen: 267900,
      voteWeight: 32,
      description: 'Enterprise membership',
      benefits: ['Maximum grant eligibility', 'Partnership opportunities', 'Strategic governance'],
    },
    {
      tier: 'Tier 1',
      price: 3162.5,
      priceINR: 262628,
      baseOWP: 316250,
      womenBonusOWP: 63250,
      totalOWPForWomen: 379500,
      voteWeight: 64,
      description: 'Founder membership',
      benefits: ['Founder status', 'Maximum benefits', 'Strategic advisory access'],
    },
  ];

  // Text translations
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "HeliosHash DAO - Women's Empowerment Enhancement",
        subtitle: '1WP Integration with Privacy-First Gender Incentives',
        membershipTab: 'Tier Membership',
        grantsTab: 'Micro-Grants',
        privacyTab: 'Privacy Settings',
        womenBonus: "Women's Bonus",
        baseTokens: 'Base Tokens',
        totalTokens: 'Total Tokens',
        voteWeight: 'Vote Weight',
        grantEligible: 'Grant Eligible',
        connectWallet: 'Connect Wallet',
        selectTier: 'Select Membership Tier',
        calculateBonus: "Calculate Women's Bonus",
        privacyFirst: 'Privacy-First Design',
        grantProgram: '$8K Grant Program',
        currentPhase: 'Phase 1: $167.4K / $300K Raised',
        memberCount: '2 / 1,500 Members',
        features: 'Key Features',
        howItWorks: 'How It Works',
      },
      hi: {
        title: 'हेलिओसहैश डीएओ - महिला सशक्तिकरण वृद्धि',
        subtitle: 'गोपनीयता-प्रथम लिंग प्रोत्साहन के साथ 1WP एकीकरण',
        membershipTab: 'टियर सदस्यता',
        grantsTab: 'माइक्रो-ग्रांट',
        privacyTab: 'गोपनीयता सेटिंग्स',
        womenBonus: 'महिला बोनस',
        baseTokens: 'आधार टोकन',
        totalTokens: 'कुल टोकन',
        voteWeight: 'वोट वेट',
        grantEligible: 'ग्रांट योग्य',
        connectWallet: 'वॉलेट कनेक्ट करें',
        selectTier: 'सदस्यता टियर चुनें',
        calculateBonus: 'महिला बोनस की गणना करें',
        privacyFirst: 'गोपनीयता-प्रथम डिज़ाइन',
        grantProgram: '$8K ग्रांट प्रोग्राम',
        currentPhase: 'चरण 1: $167.4K / $300K जुटाया गया',
        memberCount: '2 / 1,500 सदस्य',
        features: 'मुख्य विशेषताएं',
        howItWorks: 'यह कैसे काम करता है',
      },
    };
    return translations[language][key] || key;
  };

  // Load user state
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Mock wallet connection check
    const isConnected = localStorage.getItem('wallet_connected') === 'true';
    if (isConnected) {
      const address = localStorage.getItem('wallet_address') || '0x1234...5678';
      const dashboardData = await privacyService.getPrivacyDashboard(address);

      setUserState({
        isConnected: true,
        address,
        hasConsent: dashboardData.hasConsent,
        genderData: dashboardData.genderStored ? 'female' : undefined,
        isWomen: dashboardData.genderStored ? true : undefined,
        membershipTier: localStorage.getItem('user_tier') || undefined,
      });
    }
  };

  const handleWalletConnect = async () => {
    // Mock wallet connection
    localStorage.setItem('wallet_connected', 'true');
    localStorage.setItem('wallet_address', '0x1234567890123456789012345678901234567890');
    await loadUserData();

    // Show consent flow for new users
    if (!userState.hasConsent) {
      setShowConsentFlow(true);
    }
  };

  const handleTierPurchase = async (tier: TierInfo) => {
    if (!userState.isConnected) {
      alert(language === 'hi' ? 'कृपया पहले वॉलेट कनेक्ट करें' : 'Please connect wallet first');
      return;
    }

    // Check privacy consent for women's bonus
    if (!userState.hasConsent) {
      setShowConsentFlow(true);
      return;
    }

    // Mock purchase process
    const confirmed = confirm(
      language === 'hi'
        ? `क्या आप ${tier.tier} (${tier.priceINR} INR) खरीदना चाहते हैं?`
        : `Do you want to purchase ${tier.tier} for ₹${tier.priceINR} ($${tier.price})?`
    );

    if (confirmed) {
      // Mock successful purchase
      localStorage.setItem('user_tier', tier.tier);
      setUserState((prev) => ({ ...prev, selectedTier: tier, membershipTier: tier.tier }));

      alert(
        language === 'hi'
          ? `${tier.tier} सफलतापूर्वक खरीदा गया! ${
              userState.isWomen ? `आपको ${tier.womenBonusOWP} बोनस OWP टोकन मिलेंगे।` : ''
            }`
          : `${tier.tier} purchased successfully! ${
              userState.isWomen ? `You'll receive ${tier.womenBonusOWP} bonus OWP tokens.` : ''
            }`
      );
    }
  };

  const BonusCalculator = ({ tier }: { tier: TierInfo }) => (
    <div className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200'>
      <div className='flex items-center gap-2 mb-4'>
        <Calculator className='w-5 h-5 text-pink-600' />
        <h4 className='font-semibold text-gray-800'>
          {language === 'hi' ? 'महिला बोनस कैलकुलेटर' : "Women's Bonus Calculator"}
        </h4>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
        <div className='bg-white rounded-lg p-4'>
          <div className='text-2xl font-bold text-blue-600'>{tier.baseOWP.toLocaleString()}</div>
          <div className='text-sm text-gray-600'>{t('baseTokens')}</div>
        </div>

        <div className='bg-white rounded-lg p-4'>
          <div className='text-2xl font-bold text-pink-600'>
            +{tier.womenBonusOWP.toLocaleString()}
          </div>
          <div className='text-sm text-gray-600'>{t('womenBonus')} (20%)</div>
        </div>

        <div className='bg-white rounded-lg p-4 border-2 border-pink-300'>
          <div className='text-2xl font-bold text-purple-600'>
            {tier.totalOWPForWomen.toLocaleString()}
          </div>
          <div className='text-sm text-gray-600'>{t('totalTokens')}</div>
        </div>
      </div>

      <div className='mt-4 p-3 bg-pink-100 rounded-lg'>
        <p className='text-sm text-pink-800'>
          <Sparkles className='w-4 h-4 inline mr-1' />
          {language === 'hi'
            ? 'महिला सदस्यों को 20% बोनस OWP टोकन मिलते हैं, लेकिन वोटिंग वेट नहीं बढ़ता।'
            : 'Women members receive 20% bonus OWP tokens, but voting weight remains unchanged.'}
        </p>
      </div>
    </div>
  );

  const ConsentFlowModal = () =>
    showConsentFlow && (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
        <div className='bg-white rounded-xl p-6 max-w-md w-full'>
          <div className='flex items-center gap-2 mb-4'>
            <Shield className='w-6 h-6 text-blue-600' />
            <h3 className='text-lg font-bold text-gray-800'>
              {language === 'hi' ? 'गोपनीयता सहमति' : 'Privacy Consent'}
            </h3>
          </div>

          <p className='text-gray-600 mb-4'>
            {language === 'hi'
              ? 'महिला बोनस टोकन पात्रता के लिए, हमें GDPR-अनुपालित तरीके से आपकी लिंग जानकारी संग्रहीत करने की आवश्यकता है।'
              : "To enable women's bonus token eligibility, we need to store your gender information in a GDPR-compliant manner."}
          </p>

          <div className='space-y-3 mb-6'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <CheckCircle className='w-4 h-4 text-green-500' />
              {language === 'hi' ? 'AES-256 एन्क्रिप्शन' : 'AES-256 Encryption'}
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <CheckCircle className='w-4 h-4 text-green-500' />
              {language === 'hi' ? 'किसी भी समय वापस लेने का अधिकार' : 'Right to withdraw anytime'}
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <CheckCircle className='w-4 h-4 text-green-500' />
              {language === 'hi' ? 'डेटा पोर्टेबिलिटी और विलोपन' : 'Data portability & deletion'}
            </div>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setShowConsentFlow(false)}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
            >
              {language === 'hi' ? 'बाद में' : 'Later'}
            </button>
            <button
              onClick={() => {
                setShowConsentFlow(false);
                setActiveSection('privacy');
              }}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              {language === 'hi' ? 'गोपनीयता सेटिंग्स' : 'Privacy Settings'}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>{t('title')}</h1>
              <p className='text-blue-100'>{t('subtitle')}</p>
            </div>

            <div className='flex items-center gap-4'>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className='flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors'
              >
                <Globe className='w-4 h-4' />
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>

              {!userState.isConnected ? (
                <button
                  onClick={handleWalletConnect}
                  className='flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors'
                >
                  <Wallet className='w-4 h-4' />
                  {t('connectWallet')}
                </button>
              ) : (
                <div className='text-right'>
                  <div className='text-sm opacity-90'>Connected</div>
                  <div className='text-xs font-mono'>{userState.address?.slice(0, 8)}...</div>
                </div>
              )}
            </div>
          </div>

          {/* Phase Status */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold'>$167.4K / $300K</div>
              <div className='text-sm opacity-90'>{t('currentPhase')}</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>2 / 1,500</div>
              <div className='text-sm opacity-90'>{t('memberCount')}</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>$8K</div>
              <div className='text-sm opacity-90'>{t('grantProgram')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-6xl mx-auto px-6'>
          <nav className='flex space-x-8'>
            {[
              { id: 'membership', label: t('membershipTab'), icon: <Users className='w-4 h-4' /> },
              { id: 'grants', label: t('grantsTab'), icon: <Gift className='w-4 h-4' /> },
              { id: 'privacy', label: t('privacyTab'), icon: <Shield className='w-4 h-4' /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Membership Section */}
        {activeSection === 'membership' && (
          <div className='space-y-6'>
            {/* Key Features */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>{t('features')}</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center p-4'>
                  <Heart className='w-12 h-12 text-pink-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    {language === 'hi' ? '20% महिला बोनस' : "20% Women's Bonus"}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {language === 'hi'
                      ? 'महिला सदस्यों को अतिरिक्त OWP टोकन मिलते हैं'
                      : 'Women members receive additional OWP tokens'}
                  </p>
                </div>

                <div className='text-center p-4'>
                  <Lock className='w-12 h-12 text-blue-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-800 mb-2'>{t('privacyFirst')}</h3>
                  <p className='text-sm text-gray-600'>
                    {language === 'hi'
                      ? 'GDPR-अनुपालित एन्क्रिप्टेड डेटा सुरक्षा'
                      : 'GDPR-compliant encrypted data protection'}
                  </p>
                </div>

                <div className='text-center p-4'>
                  <Award className='w-12 h-12 text-green-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    {language === 'hi' ? 'माइक्रो-ग्रांट' : 'Micro-Grants'}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {language === 'hi'
                      ? '$500-$2K ग्रांट टियर 4+ सदस्यों के लिए'
                      : '$500-$2K grants for Tier 4+ members'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tier Selection */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>{t('selectTier')}</h2>
                <button
                  onClick={() => setShowBonusCalculator(!showBonusCalculator)}
                  className='flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors'
                >
                  <Calculator className='w-4 h-4' />
                  {t('calculateBonus')}
                </button>
              </div>

              {showBonusCalculator && selectedTierForCalculation && (
                <div className='mb-6'>
                  <BonusCalculator tier={selectedTierForCalculation} />
                </div>
              )}

              <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                {tierStructure.map((tier) => (
                  <div
                    key={tier.tier}
                    className={`border-2 rounded-xl p-6 transition-all cursor-pointer ${
                      userState.membershipTier === tier.tier
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTierForCalculation(tier)}
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-xl font-bold text-gray-800'>{tier.tier}</h3>
                      {userState.membershipTier === tier.tier && (
                        <CheckCircle className='w-5 h-5 text-blue-600' />
                      )}
                    </div>

                    <div className='mb-4'>
                      <div className='text-2xl font-bold text-blue-600'>
                        ₹{tier.priceINR.toLocaleString('en-IN')}
                      </div>
                      <div className='text-sm text-gray-600'>${tier.price} USD</div>
                    </div>

                    <p className='text-sm text-gray-600 mb-4'>{tier.description}</p>

                    {/* Token Information */}
                    <div className='grid grid-cols-2 gap-3 mb-4'>
                      <div className='text-center bg-gray-50 rounded-lg p-3'>
                        <div className='text-lg font-bold text-gray-800'>
                          {tier.baseOWP.toLocaleString()}
                        </div>
                        <div className='text-xs text-gray-600'>{t('baseTokens')}</div>
                      </div>
                      <div className='text-center bg-pink-50 rounded-lg p-3'>
                        <div className='text-lg font-bold text-pink-600'>
                          +{tier.womenBonusOWP.toLocaleString()}
                        </div>
                        <div className='text-xs text-pink-600'>{t('womenBonus')}</div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className='space-y-2 mb-4'>
                      {tier.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className='flex items-center gap-2 text-sm text-gray-600'>
                          <CheckCircle className='w-3 h-3 text-green-500' />
                          {benefit}
                        </div>
                      ))}
                      {tier.tier.includes('4') && (
                        <div className='flex items-center gap-2 text-sm text-green-700 font-medium'>
                          <Gift className='w-3 h-3 text-green-500' />
                          {t('grantEligible')}
                        </div>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTierPurchase(tier);
                      }}
                      disabled={userState.membershipTier === tier.tier}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        userState.membershipTier === tier.tier
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {userState.membershipTier === tier.tier
                        ? language === 'hi'
                          ? 'खरीदा गया'
                          : 'Purchased'
                        : language === 'hi'
                          ? 'खरीदें'
                          : 'Purchase'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>{t('howItWorks')}</h2>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                {[
                  {
                    step: '1',
                    icon: <Wallet className='w-6 h-6' />,
                    title: language === 'hi' ? 'वॉलेट कनेक्ट करें' : 'Connect Wallet',
                    desc: language === 'hi' ? 'अपना वॉलेट कनेक्ट करें' : 'Connect your wallet',
                  },
                  {
                    step: '2',
                    icon: <Shield className='w-6 h-6' />,
                    title: language === 'hi' ? 'गोपनीयता सेटिंग्स' : 'Privacy Settings',
                    desc:
                      language === 'hi' ? 'बोनस के लिए सहमति दें' : 'Consent for bonus eligibility',
                  },
                  {
                    step: '3',
                    icon: <CreditCard className='w-6 h-6' />,
                    title: language === 'hi' ? 'टियर खरीदें' : 'Purchase Tier',
                    desc: language === 'hi' ? 'UPI/कार्ड से भुगतान करें' : 'Pay via UPI/Card',
                  },
                  {
                    step: '4',
                    icon: <Gift className='w-6 h-6' />,
                    title: language === 'hi' ? 'बोनस प्राप्त करें' : 'Receive Bonus',
                    desc: language === 'hi' ? 'महिला बोनस टोकन पाएं' : "Get women's bonus tokens",
                  },
                ].map((step) => (
                  <div key={step.step} className='text-center'>
                    <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold'>
                      {step.step}
                    </div>
                    <div className='mb-2 text-blue-600'>{step.icon}</div>
                    <h4 className='font-semibold text-gray-800 mb-1'>{step.title}</h4>
                    <p className='text-sm text-gray-600'>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grants Section */}
        {activeSection === 'grants' && (
          <MicroGrantSystem
            userTier={(userState.membershipTier as any) || 'Tier4'}
            isWomen={userState.isWomen || false}
            userId={userState.address || 'demo-user'}
          />
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <PrivacyDashboard userId={userState.address || 'demo-user'} />
        )}
      </div>

      {/* Consent Flow Modal */}
      <ConsentFlowModal />

      {/* Footer */}
      <div className='bg-gray-900 text-white py-8 mt-12'>
        <div className='max-w-6xl mx-auto px-6 text-center'>
          <p className='text-gray-400 mb-4'>
            {language === 'hi'
              ? 'हेलिओसहैश डीएओ - भारत में सौर ऊर्जा के माध्यम से महिला सशक्तिकरण'
              : 'HeliosHash DAO - Empowering Women Through Solar Energy in India'}
          </p>
          <div className='flex items-center justify-center gap-4 text-sm'>
            <span className='flex items-center gap-1'>
              <Shield className='w-4 h-4' />
              {language === 'hi' ? 'GDPR अनुपालित' : 'GDPR Compliant'}
            </span>
            <span className='flex items-center gap-1'>
              <Lock className='w-4 h-4' />
              {language === 'hi' ? 'एन्क्रिप्टेड' : 'Encrypted'}
            </span>
            <span className='flex items-center gap-1'>
              <Heart className='w-4 h-4' />
              {language === 'hi' ? 'महिला केंद्रित' : 'Women-Focused'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enhanced1WPIntegration;
