/**
 * Enhanced Aadhaar KYC Dashboard Component
 * Privacy-preserving identity verification interface
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  aadhaarService,
  AadhaarVerificationRequest,
  AadhaarVerificationResult,
  ConsentRecord,
} from '../lib/aadhaarService';

interface AadhaarKYCDashboardProps {
  onVerificationComplete?: (result: AadhaarVerificationResult) => void;
}

export const AadhaarKYCDashboard: React.FC<AadhaarKYCDashboardProps> = ({
  onVerificationComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'bulk' | 'reports' | 'consent'>('verify');
  const [verificationForm, setVerificationForm] = useState<Partial<AadhaarVerificationRequest>>({
    consentGiven: false,
    purposeOfVerification: 'SHG_ONBOARDING',
  });
  const [verificationResult, setVerificationResult] = useState<AadhaarVerificationResult | null>(
    null
  );
  const [bulkVerifications, setBulkVerifications] = useState<AadhaarVerificationResult[]>([]);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    // Load existing consent records
    setConsentRecords(aadhaarService.getConsentRecords());
  }, []);

  const handleSingleVerification = async () => {
    if (
      !verificationForm.aadhaarNumber ||
      !verificationForm.name ||
      !verificationForm.dateOfBirth
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (!verificationForm.consentGiven) {
      setShowConsentModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await aadhaarService.verifyAadhaar(
        verificationForm as AadhaarVerificationRequest
      );
      setVerificationResult(result);
      onVerificationComplete?.(result);

      // Refresh consent records
      setConsentRecords(aadhaarService.getConsentRecords());
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkVerification = async () => {
    const sampleRequests: AadhaarVerificationRequest[] = [
      {
        aadhaarNumber: '123456789012',
        name: 'Dhramendra Kumar',
        dateOfBirth: '1985-03-15',
        address: 'Village Baghpat, Uttar Pradesh 250101',
        consentGiven: true,
        purposeOfVerification: 'SHG_ONBOARDING',
      },
      {
        aadhaarNumber: '234567890123',
        name: 'Sunita Devi',
        dateOfBirth: '1990-07-22',
        address: 'Village Baghpat, Uttar Pradesh 250101',
        consentGiven: true,
        purposeOfVerification: 'SHG_ONBOARDING',
      },
      {
        aadhaarNumber: '345678901234',
        name: 'Ramesh Singh',
        dateOfBirth: '1982-12-08',
        address: 'Village Baghpat, Uttar Pradesh 250101',
        consentGiven: true,
        purposeOfVerification: 'SHG_ONBOARDING',
      },
    ];

    setIsLoading(true);
    try {
      const results = await aadhaarService.bulkVerifySHGMembers(sampleRequests);
      setBulkVerifications(results);
    } catch (error) {
      console.error('Bulk verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVerificationReport = () => {
    if (bulkVerifications.length === 0) return null;

    const verificationIds = bulkVerifications.map((v) => v.id);
    return aadhaarService.generateVerificationReport(verificationIds);
  };

  const ConsentModal = () => (
    <AnimatePresence>
      {showConsentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-white rounded-lg p-6 max-w-md mx-4'
          >
            <h3 className='text-xl font-bold mb-4'>Data Processing Consent</h3>
            <div className='space-y-4'>
              <p className='text-gray-600'>
                By providing consent, you agree to the processing of your Aadhaar data for the
                purpose of SHG onboarding and verification. Your data will be processed securely and
                retained for 5 years.
              </p>
              <div className='space-y-2'>
                <h4 className='font-semibold'>Data Usage:</h4>
                <ul className='list-disc list-inside text-sm text-gray-600'>
                  <li>Identity verification</li>
                  <li>Age and residency validation</li>
                  <li>SHG eligibility assessment</li>
                  <li>Compliance with governance requirements</li>
                </ul>
              </div>
              <div className='space-y-2'>
                <h4 className='font-semibold'>Your Rights:</h4>
                <ul className='list-disc list-inside text-sm text-gray-600'>
                  <li>Right to revoke consent</li>
                  <li>Right to data portability</li>
                  <li>Right to correction of inaccurate data</li>
                </ul>
              </div>
              <div className='flex space-x-3'>
                <button
                  onClick={() => {
                    setVerificationForm((prev) => ({ ...prev, consentGiven: true }));
                    setShowConsentModal(false);
                    handleSingleVerification();
                  }}
                  className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700'
                >
                  Give Consent & Proceed
                </button>
                <button
                  onClick={() => setShowConsentModal(false)}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className='p-6 bg-gradient-to-br from-orange-50 to-green-50 min-h-screen'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-lg overflow-hidden'
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-orange-500 to-green-500 p-6 text-white'>
            <h1 className='text-2xl font-bold'>Aadhaar KYC System</h1>
            <p className='opacity-90'>Privacy-preserving identity verification for HHDAO</p>
          </div>

          {/* Tab Navigation */}
          <div className='border-b'>
            <nav className='flex space-x-8 px-6'>
              {[
                { id: 'verify', label: 'Single Verification' },
                { id: 'bulk', label: 'Bulk Verification' },
                { id: 'reports', label: 'Reports' },
                { id: 'consent', label: 'Consent Management' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'verify' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <h2 className='text-xl font-semibold'>Single Aadhaar Verification</h2>

                <div className='grid md:grid-cols-2 gap-6'>
                  {/* Verification Form */}
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Aadhaar Number *
                      </label>
                      <input
                        type='text'
                        maxLength={12}
                        placeholder='123456789012'
                        value={verificationForm.aadhaarNumber || ''}
                        onChange={(e) =>
                          setVerificationForm((prev) => ({
                            ...prev,
                            aadhaarNumber: e.target.value.replace(/\D/g, ''),
                          }))
                        }
                        className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        placeholder='Enter full name as per Aadhaar'
                        value={verificationForm.name || ''}
                        onChange={(e) =>
                          setVerificationForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Date of Birth *
                      </label>
                      <input
                        type='date'
                        value={verificationForm.dateOfBirth || ''}
                        onChange={(e) =>
                          setVerificationForm((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Address
                      </label>
                      <textarea
                        placeholder='Enter address as per Aadhaar'
                        value={verificationForm.address || ''}
                        onChange={(e) =>
                          setVerificationForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500'
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Purpose of Verification
                      </label>
                      <select
                        value={verificationForm.purposeOfVerification}
                        onChange={(e) =>
                          setVerificationForm((prev) => ({
                            ...prev,
                            purposeOfVerification: e.target.value as any,
                          }))
                        }
                        className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500'
                      >
                        <option value='SHG_ONBOARDING'>SHG Onboarding</option>
                        <option value='LAND_VERIFICATION'>Land Verification</option>
                        <option value='SUBSIDY_ELIGIBILITY'>Subsidy Eligibility</option>
                        <option value='GOVERNANCE_PARTICIPATION'>Governance Participation</option>
                      </select>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <input
                        type='checkbox'
                        id='consent'
                        checked={verificationForm.consentGiven}
                        onChange={(e) =>
                          setVerificationForm((prev) => ({
                            ...prev,
                            consentGiven: e.target.checked,
                          }))
                        }
                        className='h-4 w-4 text-orange-600 focus:ring-orange-500'
                      />
                      <label htmlFor='consent' className='text-sm text-gray-700'>
                        I consent to the processing of my Aadhaar data for verification purposes
                      </label>
                    </div>

                    <button
                      onClick={handleSingleVerification}
                      disabled={isLoading}
                      className='w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50'
                    >
                      {isLoading ? 'Verifying...' : 'Verify Aadhaar'}
                    </button>
                  </div>

                  {/* Verification Result */}
                  <div>
                    {verificationResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-lg border-2 ${
                          verificationResult.isVerified
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <h3 className='font-semibold mb-3'>
                          {verificationResult.isVerified
                            ? '✅ Verification Successful'
                            : '❌ Verification Failed'}
                        </h3>

                        <div className='space-y-2 text-sm'>
                          <div>
                            <strong>Masked Aadhaar:</strong> {verificationResult.maskedAadhaar}
                          </div>
                          <div>
                            <strong>Age Verified:</strong>{' '}
                            {verificationResult.ageVerified ? '✅' : '❌'}
                          </div>
                          <div>
                            <strong>Residency Verified:</strong>{' '}
                            {verificationResult.residencyVerified ? '✅' : '❌'}
                          </div>
                          <div>
                            <strong>SHG Eligible:</strong>{' '}
                            {verificationResult.eligibleForSHG ? '✅' : '❌'}
                          </div>
                          <div>
                            <strong>Timestamp:</strong>{' '}
                            {verificationResult.verificationTimestamp.toLocaleString()}
                          </div>

                          {verificationResult.errors && (
                            <div>
                              <strong className='text-red-600'>Errors:</strong>
                              <ul className='list-disc list-inside text-red-600'>
                                {verificationResult.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {verificationResult.warnings && (
                            <div>
                              <strong className='text-yellow-600'>Warnings:</strong>
                              <ul className='list-disc list-inside text-yellow-600'>
                                {verificationResult.warnings.map((warning, index) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bulk' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-semibold'>Bulk SHG Member Verification</h2>
                  <button
                    onClick={handleBulkVerification}
                    disabled={isLoading}
                    className='bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50'
                  >
                    {isLoading ? 'Processing...' : 'Run Sample Verification'}
                  </button>
                </div>

                {bulkVerifications.length > 0 && (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Masked Aadhaar
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Status
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Age Verified
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Residency
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            SHG Eligible
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {bulkVerifications.map((result) => (
                          <tr key={result.id}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {result.maskedAadhaar}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  result.isVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {result.isVerified ? 'Verified' : 'Failed'}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {result.ageVerified ? '✅' : '❌'}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {result.residencyVerified ? '✅' : '❌'}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {result.eligibleForSHG ? '✅' : '❌'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <h2 className='text-xl font-semibold'>Verification Reports</h2>

                {(() => {
                  const report = generateVerificationReport();
                  if (!report) {
                    return (
                      <div className='text-center py-12'>
                        <p className='text-gray-500'>
                          No verification data available. Run bulk verification first.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      <div className='bg-blue-50 p-4 rounded-lg'>
                        <h3 className='font-semibold text-blue-800'>Total Verifications</h3>
                        <p className='text-2xl font-bold text-blue-900'>
                          {report.totalVerifications}
                        </p>
                      </div>

                      <div className='bg-green-50 p-4 rounded-lg'>
                        <h3 className='font-semibold text-green-800'>Successful</h3>
                        <p className='text-2xl font-bold text-green-900'>
                          {report.successfulVerifications}
                        </p>
                      </div>

                      <div className='bg-orange-50 p-4 rounded-lg'>
                        <h3 className='font-semibold text-orange-800'>Age Verified</h3>
                        <p className='text-2xl font-bold text-orange-900'>
                          {report.ageVerifiedCount}
                        </p>
                      </div>

                      <div className='bg-purple-50 p-4 rounded-lg'>
                        <h3 className='font-semibold text-purple-800'>Residency Verified</h3>
                        <p className='text-2xl font-bold text-purple-900'>
                          {report.residencyVerifiedCount}
                        </p>
                      </div>

                      <div className='bg-pink-50 p-4 rounded-lg'>
                        <h3 className='font-semibold text-pink-800'>SHG Eligible</h3>
                        <p className='text-2xl font-bold text-pink-900'>
                          {report.sghEligibleCount}
                        </p>
                      </div>

                      <div className='bg-gray-50 p-4 rounded-lg'>
                        <h3 className='font-semibold text-gray-800'>Success Rate</h3>
                        <p className='text-2xl font-bold text-gray-900'>
                          {Math.round(
                            (report.successfulVerifications / report.totalVerifications) * 100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {activeTab === 'consent' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <h2 className='text-xl font-semibold'>Consent Management</h2>

                {consentRecords.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Consent ID
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Purpose
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Timestamp
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Status
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {consentRecords.map((record) => (
                          <tr key={record.consentId}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {record.consentId}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {record.purposeOfVerification}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {record.consentTimestamp.toLocaleString()}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  record.revokedAt
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {record.revokedAt ? 'Revoked' : 'Active'}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              {!record.revokedAt && (
                                <button
                                  onClick={() => {
                                    aadhaarService.revokeConsent(record.consentId);
                                    setConsentRecords(aadhaarService.getConsentRecords());
                                  }}
                                  className='text-red-600 hover:text-red-900'
                                >
                                  Revoke
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <p className='text-gray-500'>No consent records found.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <ConsentModal />
    </div>
  );
};

export default AadhaarKYCDashboard;
