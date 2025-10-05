/**
 * Agricultural Land Dashboard Component
 * Baghpat District Land Validation & Urgam Valley Pilot Interface
 */

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  agriculturalLandService,
  FarmerBeneficiary,
  LandRecord,
  LeaseAgreement,
  RevenueAPIRequest,
} from '../lib/agriculturalLandValidation';

interface AgriculturalLandDashboardProps {
  district?: string;
  pilotMode?: boolean; // Urgam Valley pilot specific features
}

export const AgriculturalLandDashboard: React.FC<AgriculturalLandDashboardProps> = ({
  district = 'Baghpat',
  pilotMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<
    'verification' | 'lease' | 'farmers' | 'pilot' | 'reports'
  >('verification');
  const [landRecords, setLandRecords] = useState<LandRecord[]>([]);
  const [leaseAgreements, setLeaseAgreements] = useState<LeaseAgreement[]>([]);
  const [farmerBeneficiaries, setFarmerBeneficiaries] = useState<FarmerBeneficiary[]>([]);
  const [pilotReport, setPilotReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchForm, setSearchForm] = useState({
    khataNumber: '',
    khasraNumber: '',
    ownerName: '',
  });

  useEffect(() => {
    if (pilotMode) {
      loadUrgamValleyPilotData();
    }
  }, [pilotMode]);

  const loadUrgamValleyPilotData = async () => {
    setIsLoading(true);
    try {
      // Sample pilot land data for Urgam Valley
      const pilotLandRequests = [
        { khataNumber: '145', khasraNumber: '287', expectedOwner: 'Dhramendra Kumar' },
        { khataNumber: '146', khasraNumber: '288', expectedOwner: 'Ramesh Singh' },
      ];

      const bulkValidation = await agriculturalLandService.bulkLandValidation(pilotLandRequests);
      setLandRecords(bulkValidation.validatedLands);

      const report = agriculturalLandService.generateUrgamValleyReport(
        bulkValidation.validatedLands
      );
      setPilotReport(report);
    } catch (error) {
      console.error('Error loading pilot data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLandVerification = async () => {
    if (!searchForm.khataNumber || !searchForm.khasraNumber) {
      alert('Please enter both Khata and Khasra numbers');
      return;
    }

    setIsLoading(true);
    try {
      const request: RevenueAPIRequest = {
        district: district,
        tehsil: 'Baghpat',
        village: 'Baghpat',
        khataNumber: searchForm.khataNumber,
        khasraNumber: searchForm.khasraNumber,
        ownerName: searchForm.ownerName || undefined,
        requestType: 'LAND_RECORDS',
      };

      const response = await agriculturalLandService.verifyLandRecords(request);

      if (response.status === 'SUCCESS' && response.data) {
        setLandRecords(response.data);
      } else {
        alert(response.message || 'Land verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to verify land records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLeaseAgreement = async (landRecord: LandRecord) => {
    try {
      const lessorDetails = {
        name: landRecord.ownerName,
        aadhaar: 'hashed_aadhaar_value',
        contactNumber: '+91-9876543210',
        address: `${landRecord.village}, ${landRecord.district}, ${landRecord.pincode}`,
      };

      const leaseTerms = {
        startDate: new Date(),
        endDate: new Date(Date.now() + 25 * 365 * 24 * 60 * 60 * 1000), // 25 years
        renewalOption: true,
        renewalPeriod: 5,
        annualRent: landRecord.totalArea * 50000, // ₹50k per acre per year
        escalationClause: 5, // 5% annual increase
        securityDeposit: landRecord.totalArea * 100000, // ₹1 lakh per acre security
      };

      const { agreement, validationResults } = await agriculturalLandService.createLeaseAgreement(
        landRecord,
        lessorDetails,
        leaseTerms,
        ['SOLAR_INSTALLATION', 'AGRICULTURE']
      );

      setLeaseAgreements((prev) => [...prev, agreement]);

      if (!validationResults.isValid) {
        alert(`Agreement created with issues: ${validationResults.errors.join(', ')}`);
      } else {
        alert('Lease agreement created successfully!');
      }
    } catch (error) {
      console.error('Error creating lease agreement:', error);
      alert('Failed to create lease agreement');
    }
  };

  const LandVerificationTab = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Land Records Verification</h2>
        <div className='text-sm text-gray-500'>UP Revenue Department Integration</div>
      </div>

      {/* Search Form */}
      <div className='bg-white border rounded-lg p-6'>
        <h3 className='font-semibold mb-4'>Search Land Records</h3>
        <div className='grid md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Khata Number *</label>
            <input
              type='text'
              placeholder='Enter Khata Number'
              value={searchForm.khataNumber}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, khataNumber: e.target.value }))}
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Khasra Number *</label>
            <input
              type='text'
              placeholder='Enter Khasra Number'
              value={searchForm.khasraNumber}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, khasraNumber: e.target.value }))}
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Owner Name (Optional)
            </label>
            <input
              type='text'
              placeholder='Enter Owner Name'
              value={searchForm.ownerName}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, ownerName: e.target.value }))}
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500'
            />
          </div>
        </div>
        <button
          onClick={handleLandVerification}
          disabled={isLoading}
          className='mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50'
        >
          {isLoading ? 'Verifying...' : 'Verify Land Records'}
        </button>
      </div>

      {/* Verification Results */}
      {landRecords.length > 0 && (
        <div className='space-y-4'>
          <h3 className='font-semibold'>Verification Results</h3>
          {landRecords.map((record, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white border rounded-lg p-6'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h4 className='text-lg font-semibold text-green-800'>
                    Khata: {record.khataNumber} | Khasra: {record.khasraNumber}
                  </h4>
                  <p className='text-gray-600'>Owner: {record.ownerName}</p>
                </div>
                <div className='flex space-x-2'>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      record.encumbranceStatus === 'CLEAR'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.encumbranceStatus}
                  </span>
                  <button
                    onClick={() => handleCreateLeaseAgreement(record)}
                    className='bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700'
                  >
                    Create Lease
                  </button>
                </div>
              </div>

              <div className='grid md:grid-cols-3 gap-6'>
                <div>
                  <h5 className='font-medium mb-2'>Land Details</h5>
                  <div className='text-sm space-y-1'>
                    <div>
                      <strong>Total Area:</strong> {record.totalArea} acres
                    </div>
                    <div>
                      <strong>Cultivable:</strong> {record.cultivableArea} acres
                    </div>
                    <div>
                      <strong>Irrigated:</strong> {record.irrigatedArea} acres
                    </div>
                    <div>
                      <strong>Soil Type:</strong> {record.soilType}
                    </div>
                    <div>
                      <strong>Classification:</strong> {record.landClassification}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className='font-medium mb-2'>Administrative</h5>
                  <div className='text-sm space-y-1'>
                    <div>
                      <strong>Village:</strong> {record.village}
                    </div>
                    <div>
                      <strong>Tehsil:</strong> {record.tehsil}
                    </div>
                    <div>
                      <strong>District:</strong> {record.district}
                    </div>
                    <div>
                      <strong>Gram Panchayat:</strong> {record.gramPanchayat}
                    </div>
                    <div>
                      <strong>Pincode:</strong> {record.pincode}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className='font-medium mb-2'>Financial & Legal</h5>
                  <div className='text-sm space-y-1'>
                    <div>
                      <strong>Revenue:</strong> ₹{record.landRevenue}/year
                    </div>
                    <div>
                      <strong>Revenue Paid:</strong> {record.revenuePaid ? '✅' : '❌'}
                    </div>
                    <div>
                      <strong>PM-Kisan:</strong> {record.pmKisanEligible ? '✅' : '❌'}
                    </div>
                    <div>
                      <strong>KCC Linked:</strong> {record.kisanCreditCardLinked ? '✅' : '❌'}
                    </div>
                    <div>
                      <strong>GPS:</strong> {record.gpsCoordinates.latitude.toFixed(4)},{' '}
                      {record.gpsCoordinates.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>

              {record.cropPattern.length > 0 && (
                <div className='mt-4'>
                  <h5 className='font-medium mb-2'>Crop Pattern</h5>
                  <div className='flex space-x-4'>
                    {record.cropPattern.map((crop, cropIndex) => (
                      <div key={cropIndex} className='bg-gray-50 px-3 py-1 rounded text-sm'>
                        <strong>{crop.season}:</strong> {crop.crop} ({crop.area} acres)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const UrgamValleyPilotTab = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Urgam Valley Pilot Assessment</h2>
        <button
          onClick={loadUrgamValleyPilotData}
          disabled={isLoading}
          className='bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Refresh Pilot Data'}
        </button>
      </div>

      {pilotReport && (
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg border-2 ${
              pilotReport.pilotReadiness.status === 'EXCELLENT'
                ? 'border-green-500 bg-green-50'
                : pilotReport.pilotReadiness.status === 'READY'
                ? 'border-blue-500 bg-blue-50'
                : pilotReport.pilotReadiness.status === 'PARTIALLY_READY'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-red-500 bg-red-50'
            }`}
          >
            <h3 className='font-semibold mb-2'>Pilot Readiness</h3>
            <div className='text-3xl font-bold mb-1'>{pilotReport.pilotReadiness.score}%</div>
            <div className='text-sm font-medium'>{pilotReport.pilotReadiness.status}</div>
            <p className='text-xs mt-2'>{pilotReport.pilotReadiness.summary}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-blue-50 border border-blue-200 rounded-lg p-4'
          >
            <h3 className='font-semibold text-blue-800 mb-2'>Land Suitability</h3>
            <div className='text-2xl font-bold text-blue-900 mb-1'>
              {pilotReport.landSuitability.suitablePlots}
            </div>
            <div className='text-sm text-blue-700'>Suitable plots</div>
            <p className='text-xs mt-2 text-blue-600'>
              {pilotReport.landSuitability.totalArea.toFixed(1)} acres total
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-green-50 border border-green-200 rounded-lg p-4'
          >
            <h3 className='font-semibold text-green-800 mb-2'>Compliance</h3>
            <div className='text-2xl font-bold text-green-900 mb-1'>
              {pilotReport.regulatoryCompliance.clearTitles}
            </div>
            <div className='text-sm text-green-700'>Clear titles</div>
            <p className='text-xs mt-2 text-green-600'>
              {pilotReport.regulatoryCompliance.revenueCompliant} revenue compliant
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-purple-50 border border-purple-200 rounded-lg p-4'
          >
            <h3 className='font-semibold text-purple-800 mb-2'>Irrigation</h3>
            <div className='text-2xl font-bold text-purple-900 mb-1'>
              {pilotReport.landSuitability.irrigationCoverage.toFixed(1)}%
            </div>
            <div className='text-sm text-purple-700'>Coverage</div>
            <p className='text-xs mt-2 text-purple-600'>
              Avg plot: {pilotReport.landSuitability.averagePlotSize.toFixed(1)} acres
            </p>
          </motion.div>
        </div>
      )}

      {pilotReport?.recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white border rounded-lg p-6'
        >
          <h3 className='font-semibold mb-4'>Pilot Implementation Recommendations</h3>
          <div className='space-y-2'>
            {pilotReport.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className='flex items-start'>
                <span className='text-orange-500 mr-2'>•</span>
                <span className='text-gray-700'>{recommendation}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {pilotReport?.regulatoryCompliance.requiredApprovals && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white border rounded-lg p-6'
        >
          <h3 className='font-semibold mb-4'>Required Government Approvals</h3>
          <div className='grid md:grid-cols-2 gap-4'>
            {pilotReport.regulatoryCompliance.requiredApprovals.map(
              (approval: string, index: number) => (
                <div key={index} className='flex items-center space-x-3'>
                  <div className='w-4 h-4 border-2 border-gray-300 rounded'></div>
                  <span className='text-gray-700'>{approval}</span>
                </div>
              )
            )}
          </div>
        </motion.div>
      )}

      {landRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white border rounded-lg p-6'
        >
          <h3 className='font-semibold mb-4'>Verified Land Records for Pilot</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Khata/Khasra
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Owner
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Area
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Solar Eligible
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {landRecords.map((record, index) => (
                  <tr key={index}>
                    <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {record.khataNumber}/{record.khasraNumber}
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {record.ownerName}
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {record.totalArea} acres
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          record.encumbranceStatus === 'CLEAR'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.encumbranceStatus}
                      </span>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {record.encumbranceStatus === 'CLEAR' &&
                      record.revenuePaid &&
                      record.totalArea >= 1
                        ? '✅'
                        : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className='p-6 bg-gradient-to-br from-green-50 to-orange-50 min-h-screen'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-lg overflow-hidden'
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-green-500 to-orange-500 p-6 text-white'>
            <h1 className='text-2xl font-bold'>Agricultural Land Validation System</h1>
            <p className='opacity-90'>
              {pilotMode
                ? 'Urgam Valley Pilot Integration'
                : `${district} District Land Management`}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className='border-b'>
            <nav className='flex space-x-8 px-6'>
              {[
                { id: 'verification', label: 'Land Verification' },
                { id: 'pilot', label: 'Urgam Valley Pilot' },
                { id: 'lease', label: 'Lease Agreements' },
                { id: 'farmers', label: 'Farmer Onboarding' },
                { id: 'reports', label: 'Reports' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
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
            {activeTab === 'verification' && <LandVerificationTab />}
            {activeTab === 'pilot' && <UrgamValleyPilotTab />}
            {activeTab === 'lease' && (
              <div className='text-center py-12'>
                <p className='text-gray-500'>
                  Lease agreements management interface coming soon...
                </p>
              </div>
            )}
            {activeTab === 'farmers' && (
              <div className='text-center py-12'>
                <p className='text-gray-500'>
                  Farmer beneficiary onboarding interface coming soon...
                </p>
              </div>
            )}
            {activeTab === 'reports' && (
              <div className='text-center py-12'>
                <p className='text-gray-500'>Comprehensive reporting dashboard coming soon...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgriculturalLandDashboard;
