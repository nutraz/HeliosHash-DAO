'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileText,
  Info,
  Lock,
  Settings,
  Shield,
  Trash2,
  Unlock,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  privacyService,
  type ConsentLevel,
  type GenderOption,
  type PrivacySettings,
} from '../services/privacyComplianceService';

interface PrivacyDashboardState {
  hasConsent: boolean;
  consentLevel: ConsentLevel;
  genderStored: boolean;
  settings: PrivacySettings | null;
  dataRetentionDays: number;
  canWithdraw: boolean;
  lastAccessed?: number;
  accessCount?: number;
}

const PrivacyDashboard = ({ userId }: { userId: string }) => {
  const [dashboardData, setDashboardData] = useState<PrivacyDashboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenderForm, setShowGenderForm] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [selectedGender, setSelectedGender] = useState<GenderOption>('not-provided');
  const [consentLevel, setConsentLevel] = useState<ConsentLevel>('none');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Privacy policy text
  const privacyPolicy = privacyService.getPrivacyPolicyText(language);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await privacyService.getPrivacyDashboard(userId);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load privacy dashboard:', error);
    }
    setIsLoading(false);
  };

  const handleConsentUpdate = async () => {
    try {
      const result = await privacyService.obtainConsent(userId, consentLevel, {
        allowDataCollection: consentLevel !== 'none',
        allowBonusEligibility: consentLevel === 'full',
        allowAnalytics: false,
        allowThirdPartySharing: false,
      });

      if (result.success) {
        await loadDashboardData();
        setShowConsentForm(false);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to update consent. Please try again.');
    }
  };

  const handleGenderUpdate = async () => {
    try {
      const result = await privacyService.storeGenderData(userId, selectedGender);

      if (result.success) {
        await loadDashboardData();
        setShowGenderForm(false);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to update gender information. Please try again.');
    }
  };

  const handleDataDeletion = async () => {
    const confirmed = confirm(
      language === 'hi'
        ? 'क्या आप वास्तव में अपनी सभी लिंग जानकारी को स्थायी रूप से हटाना चाहते हैं? इससे आपको महिला बोनस टोकन नहीं मिलेंगे।'
        : "Are you sure you want to permanently delete all your gender information? This will make you ineligible for women's bonus tokens."
    );

    if (confirmed) {
      try {
        const result = await privacyService.withdrawConsentAndDeleteData(
          userId,
          'User requested deletion'
        );

        if (result.success) {
          await loadDashboardData();
          alert(result.message);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Failed to delete data. Please contact support.');
      }
    }
  };

  const handleDataExport = async () => {
    try {
      const data = await privacyService.getPrivacyDashboard(userId);

      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        consentLevel: data.consentLevel,
        hasGenderData: data.genderStored,
        dataRetentionDays: data.dataRetentionDays,
        lastAccessed: data.lastAccessed ? new Date(data.lastAccessed).toISOString() : null,
        accessCount: data.accessCount,
        note: 'Actual gender information is not included in exports for security reasons.',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `privacy-data-${userId}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert(
        language === 'hi'
          ? 'आपका डेटा एक्सपोर्ट पूरा हो गया। सुरक्षा कारणों से वास्तविक लिंग जानकारी शामिल नहीं है।'
          : 'Data export completed. Actual gender information is not included for security reasons.'
      );
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        <span className='ml-2'>{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className='text-center p-8'>
        <AlertTriangle className='w-12 h-12 text-yellow-500 mx-auto mb-4' />
        <p>{language === 'hi' ? 'डेटा लोड नहीं हो सका' : 'Failed to load privacy data'}</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <Shield className='w-8 h-8 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-800'>
              {language === 'hi' ? 'गोपनीयता डैशबोर्ड' : 'Privacy Dashboard'}
            </h1>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className='px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200'
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
        <p className='text-gray-600'>
          {language === 'hi'
            ? 'अपनी व्यक्तिगत जानकारी और गोपनीयता सेटिंग्स को प्रबंधित करें'
            : 'Manage your personal information and privacy settings'}
        </p>
      </div>

      {/* Current Status */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='flex items-center gap-2 mb-2'>
            {dashboardData.hasConsent ? (
              <CheckCircle className='w-5 h-5 text-green-500' />
            ) : (
              <AlertTriangle className='w-5 h-5 text-yellow-500' />
            )}
            <h3 className='font-semibold text-gray-800'>
              {language === 'hi' ? 'सहमति स्थिति' : 'Consent Status'}
            </h3>
          </div>
          <p className='text-sm text-gray-600'>
            {dashboardData.hasConsent
              ? language === 'hi'
                ? 'सहमति दी गई'
                : 'Consent Given'
              : language === 'hi'
              ? 'सहमति नहीं दी गई'
              : 'No Consent'}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            {language === 'hi' ? 'स्तर' : 'Level'}: {dashboardData.consentLevel}
          </p>
        </div>

        <div className='bg-white rounded-lg shadow p-4'>
          <div className='flex items-center gap-2 mb-2'>
            {dashboardData.genderStored ? (
              <Lock className='w-5 h-5 text-blue-500' />
            ) : (
              <Unlock className='w-5 h-5 text-gray-400' />
            )}
            <h3 className='font-semibold text-gray-800'>
              {language === 'hi' ? 'लिंग डेटा' : 'Gender Data'}
            </h3>
          </div>
          <p className='text-sm text-gray-600'>
            {dashboardData.genderStored
              ? language === 'hi'
                ? 'संग्रहीत और एन्क्रिप्टेड'
                : 'Stored & Encrypted'
              : language === 'hi'
              ? 'संग्रहीत नहीं'
              : 'Not Stored'}
          </p>
          {dashboardData.accessCount !== undefined && (
            <p className='text-xs text-gray-500 mt-1'>
              {language === 'hi' ? 'पहुंच' : 'Accessed'}: {dashboardData.accessCount}{' '}
              {language === 'hi' ? 'बार' : 'times'}
            </p>
          )}
        </div>

        <div className='bg-white rounded-lg shadow p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Clock className='w-5 h-5 text-purple-500' />
            <h3 className='font-semibold text-gray-800'>
              {language === 'hi' ? 'डेटा रिटेंशन' : 'Data Retention'}
            </h3>
          </div>
          <p className='text-sm text-gray-600'>
            {Math.ceil(dashboardData.dataRetentionDays / 365)}{' '}
            {language === 'hi' ? 'वर्ष' : 'years'}
          </p>
          {dashboardData.lastAccessed && (
            <p className='text-xs text-gray-500 mt-1'>
              {language === 'hi' ? 'अंतिम उपयोग' : 'Last used'}:{' '}
              {formatDate(dashboardData.lastAccessed)}
            </p>
          )}
        </div>

        <div className='bg-white rounded-lg shadow p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Database className='w-5 h-5 text-green-500' />
            <h3 className='font-semibold text-gray-800'>
              {language === 'hi' ? 'बोनस पात्रता' : 'Bonus Eligibility'}
            </h3>
          </div>
          <p className='text-sm text-gray-600'>
            {dashboardData.settings?.allowBonusEligibility
              ? language === 'hi'
                ? 'सक्रिय'
                : 'Active'
              : language === 'hi'
              ? 'निष्क्रिय'
              : 'Inactive'}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            {language === 'hi' ? '20% महिला बोनस' : "20% Women's Bonus"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>
          {language === 'hi' ? 'गोपनीयता कार्य' : 'Privacy Actions'}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Update Consent */}
          <div className='p-4 border border-gray-200 rounded-lg'>
            <div className='flex items-center gap-2 mb-3'>
              <Settings className='w-5 h-5 text-blue-600' />
              <h3 className='font-semibold text-gray-800'>
                {language === 'hi' ? 'सहमति अपडेट करें' : 'Update Consent'}
              </h3>
            </div>
            <p className='text-sm text-gray-600 mb-3'>
              {language === 'hi'
                ? 'अपनी डेटा संग्रह सहमति को बदलें'
                : 'Change your data collection consent level'}
            </p>
            <button
              onClick={() => setShowConsentForm(true)}
              className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              {language === 'hi' ? 'सहमति प्रबंधित करें' : 'Manage Consent'}
            </button>
          </div>

          {/* Update Gender */}
          {dashboardData.hasConsent && (
            <div className='p-4 border border-gray-200 rounded-lg'>
              <div className='flex items-center gap-2 mb-3'>
                <Lock className='w-5 h-5 text-green-600' />
                <h3 className='font-semibold text-gray-800'>
                  {language === 'hi' ? 'लिंग जानकारी' : 'Gender Information'}
                </h3>
              </div>
              <p className='text-sm text-gray-600 mb-3'>
                {language === 'hi'
                  ? 'अपनी लिंग जानकारी को अपडेट करें'
                  : 'Update your gender information'}
              </p>
              <button
                onClick={() => setShowGenderForm(true)}
                className='w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                {dashboardData.genderStored
                  ? language === 'hi'
                    ? 'जानकारी बदलें'
                    : 'Update Information'
                  : language === 'hi'
                  ? 'जानकारी जोड़ें'
                  : 'Add Information'}
              </button>
            </div>
          )}

          {/* Export Data */}
          <div className='p-4 border border-gray-200 rounded-lg'>
            <div className='flex items-center gap-2 mb-3'>
              <Download className='w-5 h-5 text-purple-600' />
              <h3 className='font-semibold text-gray-800'>
                {language === 'hi' ? 'डेटा एक्सपोर्ट' : 'Export Data'}
              </h3>
            </div>
            <p className='text-sm text-gray-600 mb-3'>
              {language === 'hi'
                ? 'अपनी गोपनीयता जानकारी डाउनलोड करें'
                : 'Download your privacy information'}
            </p>
            <button
              onClick={handleDataExport}
              className='w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
            >
              {language === 'hi' ? 'डाउनलोड करें' : 'Download Data'}
            </button>
          </div>

          {/* Delete Data */}
          {dashboardData.canWithdraw && (
            <div className='p-4 border border-red-200 rounded-lg bg-red-50'>
              <div className='flex items-center gap-2 mb-3'>
                <Trash2 className='w-5 h-5 text-red-600' />
                <h3 className='font-semibold text-red-800'>
                  {language === 'hi' ? 'डेटा हटाएं' : 'Delete Data'}
                </h3>
              </div>
              <p className='text-sm text-red-600 mb-3'>
                {language === 'hi'
                  ? 'सभी व्यक्तिगत जानकारी को स्थायी रूप से हटा दें'
                  : 'Permanently delete all personal information'}
              </p>
              <button
                onClick={handleDataDeletion}
                className='w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                {language === 'hi' ? 'सभी डेटा हटाएं' : 'Delete All Data'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Policy */}
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <div className='flex items-center gap-2 mb-4'>
          <FileText className='w-6 h-6 text-gray-600' />
          <h2 className='text-xl font-bold text-gray-800'>{privacyPolicy.title}</h2>
        </div>

        <div className='space-y-4'>
          {privacyPolicy.sections.map((section, index) => (
            <div key={index}>
              <h3 className='font-semibold text-gray-800 mb-2'>{section.heading}</h3>
              <ul className='space-y-1'>
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className='text-sm text-gray-600 flex items-start gap-2'>
                    <Info className='w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Form Modal */}
      {showConsentForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>
              {language === 'hi' ? 'सहमति स्तर चुनें' : 'Choose Consent Level'}
            </h3>

            <div className='space-y-3 mb-6'>
              {[
                {
                  value: 'none' as ConsentLevel,
                  label: language === 'hi' ? 'कोई डेटा संग्रह नहीं' : 'No Data Collection',
                  desc:
                    language === 'hi'
                      ? 'कोई व्यक्तिगत डेटा संग्रहीत नहीं किया जाएगा'
                      : 'No personal data will be stored',
                },
                {
                  value: 'basic' as ConsentLevel,
                  label: language === 'hi' ? 'बेसिक संग्रह' : 'Basic Collection',
                  desc:
                    language === 'hi'
                      ? 'डेटा संग्रहीत किया जाएगा लेकिन बोनस नहीं'
                      : 'Data stored but no bonus eligibility',
                },
                {
                  value: 'full' as ConsentLevel,
                  label: language === 'hi' ? 'पूर्ण सहमति' : 'Full Consent',
                  desc:
                    language === 'hi'
                      ? 'डेटा संग्रह और बोनस पात्रता'
                      : 'Data collection and bonus eligibility',
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className='flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50'
                >
                  <input
                    type='radio'
                    name='consent'
                    value={option.value}
                    checked={consentLevel === option.value}
                    onChange={(e) => setConsentLevel(e.target.value as ConsentLevel)}
                    className='w-4 h-4 text-blue-600 mt-1'
                  />
                  <div>
                    <div className='font-medium text-gray-800'>{option.label}</div>
                    <div className='text-sm text-gray-600'>{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowConsentForm(false)}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleConsentUpdate}
                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                {language === 'hi' ? 'अपडेट करें' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gender Form Modal */}
      {showGenderForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>
              {language === 'hi' ? 'लिंग जानकारी अपडेट करें' : 'Update Gender Information'}
            </h3>

            <div className='space-y-3 mb-6'>
              {[
                { value: 'female' as GenderOption, label: '👩 Female', bonus: true },
                { value: 'male' as GenderOption, label: '👨 Male', bonus: false },
                { value: 'non-binary' as GenderOption, label: '🧑 Non-binary', bonus: false },
                {
                  value: 'prefer-not-to-say' as GenderOption,
                  label: '❓ Prefer not to say',
                  bonus: false,
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className='flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50'
                >
                  <div className='flex items-center gap-3'>
                    <input
                      type='radio'
                      name='gender'
                      value={option.value}
                      checked={selectedGender === option.value}
                      onChange={(e) => setSelectedGender(e.target.value as GenderOption)}
                      className='w-4 h-4 text-blue-600'
                    />
                    <span>{option.label}</span>
                  </div>
                  {option.bonus && (
                    <span className='text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full'>
                      {language === 'hi' ? '20% बोनस' : '20% Bonus'}
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowGenderForm(false)}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleGenderUpdate}
                className='flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
              >
                {language === 'hi' ? 'सेव करें' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyDashboard;
