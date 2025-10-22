/**
 * UP State Compliance Dashboard Component
 * Comprehensive state-level regulatory compliance interface
 */

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  ElectricityConnection,
  LaborComplianceRequirement,
  UPLandRecord,
  upStateComplianceService,
  UPSubsidyProgram,
} from '../lib/upStateCompliance';

interface UPComplianceDashboardProps {
  district?: string;
  businessType?: string;
  employeeCount?: number;
}

export const UPComplianceDashboard: React.FC<UPComplianceDashboardProps> = ({
  district = 'Baghpat',
  businessType = 'SHG',
  employeeCount = 15,
}) => {
  const [activeTab, setActiveTab] = useState<
    'subsidies' | 'labor' | 'land' | 'electricity' | 'summary'
  >('subsidies');
  const [subsidyEligibility, setSubsidyEligibility] = useState<any>(null);
  const [complianceSummary, setComplianceSummary] = useState<any>(null);
  const [landRecord, setLandRecord] = useState<UPLandRecord | null>(null);
  const [electricityConnection, setElectricityConnection] = useState<ElectricityConnection | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadComplianceData();
  }, [district, businessType, employeeCount]);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      // Check subsidy eligibility
      const eligibility = await upStateComplianceService.checkSubsidyEligibility({
        projectType: 'GROUND_MOUNTED',
        applicantType: 'SHG',
        district: district,
        landArea: 12.5,
        annualIncome: 250000,
        hasElectricityConnection: true,
        hasPreviousSubsidy: false,
      });
      setSubsidyEligibility(eligibility);

      // Generate compliance summary
      const summary = upStateComplianceService.generateComplianceSummary({
        registrationId: 'SHG/BGP/2024/001',
        businessType: businessType,
        employeeCount: employeeCount,
        district: district,
        hasElectricityConnection: true,
        landArea: 12.5,
      });
      setComplianceSummary(summary);

      // Load sample land record
      const land = await upStateComplianceService.verifyLandRecord('145', '287');
      setLandRecord(land);

      // Load sample electricity connection
      const electricity = await upStateComplianceService.checkElectricityConnection('BGP123456789');
      setElectricityConnection(electricity);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const SubsidiesTab = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>UP State Subsidy Programs</h2>
        <span className='text-sm text-gray-500'>
          {subsidyEligibility?.eligiblePrograms.length || 0} programs available
        </span>
      </div>

      {subsidyEligibility?.eligiblePrograms.map((program: UPSubsidyProgram) => (
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white border rounded-lg p-6 shadow-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-green-800'>{program.name}</h3>
              <p className='text-gray-600'>{program.department}</p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-green-600'>
                ₹{(program.maxAmount / 100000).toFixed(1)}L
              </div>
              <div className='text-sm text-gray-500'>{program.coveragePercentage}% coverage</div>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium mb-2'>Eligibility Criteria</h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                {program.eligibilityCriteria.map((criteria, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-green-500 mr-2'>•</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className='font-medium mb-2'>Required Documents</h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                {program.requiredDocuments.slice(0, 4).map((doc, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-blue-500 mr-2'>•</span>
                    {doc}
                  </li>
                ))}
                {program.requiredDocuments.length > 4 && (
                  <li className='text-blue-600 text-xs'>
                    +{program.requiredDocuments.length - 4} more documents
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
            <div className='grid md:grid-cols-3 gap-4 text-sm'>
              <div>
                <strong>Processing Time:</strong> {program.processingTime}
              </div>
              <div>
                <strong>Contact:</strong> {program.contactInfo.office}
              </div>
              <div>
                <strong>Phone:</strong> {program.contactInfo.phone}
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <h5 className='font-medium mb-2'>Application Process</h5>
            <div className='flex flex-wrap gap-2'>
              {program.applicationProcess.map((step, index) => (
                <div
                  key={index}
                  className='flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'
                >
                  <span className='bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center mr-2 text-xs'>
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {subsidyEligibility?.ineligiblePrograms?.length > 0 && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <h3 className='font-semibold text-red-800 mb-2'>Ineligible Programs</h3>
          <div className='space-y-2'>
            {subsidyEligibility.ineligiblePrograms.map((item: any, index: number) => (
              <div key={index} className='text-sm'>
                <strong className='text-red-700'>{item.program.name}:</strong>
                <ul className='mt-1 space-y-1'>
                  {item.reasons.map((reason: string, reasonIndex: number) => (
                    <li key={reasonIndex} className='text-red-600 ml-4'>
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const LaborComplianceTab = () => {
    const laborRequirements = upStateComplianceService.getLaborComplianceRequirements(
      businessType,
      employeeCount
    );

    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Labor Law Compliance</h2>
          <span className='text-sm text-gray-500'>
            {laborRequirements.length} requirements applicable
          </span>
        </div>

        {laborRequirements.length > 0 ? (
          laborRequirements.map((requirement: LaborComplianceRequirement) => (
            <motion.div
              key={requirement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white border rounded-lg p-6 shadow-sm'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-orange-800'>{requirement.title}</h3>
                  <p className='text-gray-600'>{requirement.description}</p>
                </div>
                <span className='bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium'>
                  {requirement.renewalPeriod || 'One-time'}
                </span>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-medium mb-2'>Applicable For</h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    {requirement.applicableFor.map((criteria, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-orange-500 mr-2'>•</span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className='font-medium mb-2'>Required Documents</h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    {requirement.requiredDocuments.map((doc, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-blue-500 mr-2'>•</span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <h5 className='font-medium text-red-800 mb-1'>Non-Compliance Penalty</h5>
                <p className='text-sm text-red-700'>{requirement.penaltyForNonCompliance}</p>
              </div>

              <div className='mt-4 text-sm text-gray-600'>
                <strong>Contact Authority:</strong> {requirement.contactAuthority}
              </div>
            </motion.div>
          ))
        ) : (
          <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-center'>
            <h3 className='text-lg font-semibold text-green-800 mb-2'>
              No Labor Compliance Requirements
            </h3>
            <p className='text-green-700'>
              Based on your current business type ({businessType}) and employee count (
              {employeeCount}), you are not required to obtain additional labor law licenses at this
              time.
            </p>
          </div>
        )}
      </div>
    );
  };

  const LandRecordsTab = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>UP Land Records Verification</h2>
        <button
          onClick={loadComplianceData}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'
        >
          Verify Records
        </button>
      </div>

      {landRecord ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white border rounded-lg p-6 shadow-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-green-800'>Land Verification Successful</h3>
              <p className='text-gray-600'>
                Khata: {landRecord.khataNumber} | Khasra: {landRecord.khasraNumber}
              </p>
            </div>
            <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium'>
              Verified ✓
            </span>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium mb-3'>Owner Details</h4>
              <div className='space-y-2 text-sm'>
                <div>
                  <strong>Owner Name:</strong> {landRecord.ownerName}
                </div>
                <div>
                  <strong>Father's Name:</strong> {landRecord.fatherName}
                </div>
                <div>
                  <strong>Area:</strong> {landRecord.area} acres
                </div>
                <div>
                  <strong>Land Type:</strong>
                  <span className='ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                    {landRecord.landType}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-medium mb-3'>Land Characteristics</h4>
              <div className='space-y-2 text-sm'>
                <div>
                  <strong>Irrigation:</strong> {landRecord.irrigationType}
                </div>
                <div>
                  <strong>Soil Type:</strong> {landRecord.soilType}
                </div>
                <div>
                  <strong>Village:</strong> {landRecord.village}
                </div>
                <div>
                  <strong>Annual Revenue:</strong> ₹{landRecord.revenue}
                </div>
              </div>
            </div>
          </div>

          {landRecord.mutations.length > 0 && (
            <div className='mt-6'>
              <h4 className='font-medium mb-3'>Recent Mutations</h4>
              <div className='space-y-2'>
                {landRecord.mutations.map((mutation, index) => (
                  <div key={index} className='p-3 bg-gray-50 rounded border text-sm'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <strong>{mutation.type}</strong> - {mutation.date.toLocaleDateString()}
                      </div>
                      <span className='text-xs text-gray-500'>{mutation.registrationNumber}</span>
                    </div>
                    <div className='mt-1 text-gray-600'>
                      From: {mutation.fromOwner} → To: {mutation.toOwner}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className='bg-gray-50 border rounded-lg p-8 text-center'>
          <p className='text-gray-500'>Enter Khata and Khasra numbers to verify land records</p>
        </div>
      )}
    </div>
  );

  const ElectricityTab = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Electricity Connection Status</h2>
        <div className='text-sm text-gray-500'>UPPCL Connection</div>
      </div>

      {electricityConnection ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white border rounded-lg p-6 shadow-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-blue-800'>Connection Verified</h3>
              <p className='text-gray-600'>
                Connection No: {electricityConnection.connectionNumber}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                electricityConnection.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {electricityConnection.status}
            </span>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium mb-3'>Connection Details</h4>
              <div className='space-y-2 text-sm'>
                <div>
                  <strong>Connection Type:</strong> {electricityConnection.connectionType}
                </div>
                <div>
                  <strong>Sanctioned Load:</strong> {electricityConnection.sanctionedLoad} KW
                </div>
                <div>
                  <strong>Tariff Category:</strong> {electricityConnection.tariffCategory}
                </div>
                <div>
                  <strong>Connected Date:</strong>{' '}
                  {electricityConnection.connectedDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-medium mb-3'>Distribution Details</h4>
              <div className='space-y-2 text-sm'>
                <div>
                  <strong>DISCOM:</strong> {electricityConnection.distributionCompany}
                </div>
                <div>
                  <strong>Subdivision:</strong> {electricityConnection.subdivision}
                </div>
                <div>
                  <strong>Feeder:</strong> {electricityConnection.feederName}
                </div>
                <div>
                  <strong>Meter No:</strong> {electricityConnection.meterNumber}
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <h5 className='font-medium text-blue-800 mb-2'>Solar Compatibility</h5>
            <div className='text-sm text-blue-700'>
              ✓ Agricultural connection suitable for solar pump installation
              <br />
              ✓ Sufficient sanctioned load for net metering
              <br />✓ Active connection in good standing
            </div>
          </div>
        </motion.div>
      ) : (
        <div className='bg-gray-50 border rounded-lg p-8 text-center'>
          <p className='text-gray-500'>Enter connection number to verify electricity status</p>
        </div>
      )}
    </div>
  );

  const SummaryTab = () => (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold'>UP State Compliance Summary</h2>

      {complianceSummary && (
        <div className='grid md:grid-cols-3 gap-6'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6'
          >
            <h3 className='font-semibold text-blue-800 mb-2'>Compliance Score</h3>
            <div className='text-3xl font-bold text-blue-900'>
              {complianceSummary.complianceScore}%
            </div>
            <p className='text-blue-700 text-sm mt-1'>Overall compliance rating</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6'
          >
            <h3 className='font-semibold text-green-800 mb-2'>Available Subsidies</h3>
            <div className='text-3xl font-bold text-green-900'>
              {complianceSummary.eligibleSubsidies.length}
            </div>
            <p className='text-green-700 text-sm mt-1'>Programs accessible</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6'
          >
            <h3 className='font-semibold text-orange-800 mb-2'>Required Licenses</h3>
            <div className='text-3xl font-bold text-orange-900'>
              {complianceSummary.requiredLicenses.length}
            </div>
            <p className='text-orange-700 text-sm mt-1'>Labor compliance items</p>
          </motion.div>
        </div>
      )}

      {complianceSummary?.recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white border rounded-lg p-6'
        >
          <h3 className='font-semibold mb-4'>Recommendations</h3>
          <div className='space-y-2'>
            {complianceSummary.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className='flex items-start'>
                <span className='text-blue-500 mr-2'>•</span>
                <span className='text-gray-700'>{recommendation}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {complianceSummary?.nextActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white border rounded-lg p-6'
        >
          <h3 className='font-semibold mb-4'>Next Actions</h3>
          <div className='space-y-3'>
            {complianceSummary.nextActions.map((action: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded border-l-4 ${
                  action.priority === 'HIGH'
                    ? 'border-red-500 bg-red-50'
                    : action.priority === 'MEDIUM'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-green-500 bg-green-50'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        action.priority === 'HIGH'
                          ? 'bg-red-200 text-red-800'
                          : action.priority === 'MEDIUM'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {action.priority}
                    </span>
                    <div className='mt-2 font-medium'>{action.action}</div>
                  </div>
                  {action.deadline && (
                    <div className='text-sm text-gray-500'>Due: {action.deadline}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
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
            <h1 className='text-2xl font-bold'>UP State Compliance Dashboard</h1>
            <p className='opacity-90'>
              Comprehensive regulatory compliance for {district} district
            </p>
          </div>

          {/* Tab Navigation */}
          <div className='border-b'>
            <nav className='flex space-x-8 px-6'>
              {[
                { id: 'subsidies', label: 'Subsidy Programs' },
                { id: 'labor', label: 'Labor Compliance' },
                { id: 'land', label: 'Land Records' },
                { id: 'electricity', label: 'Electricity' },
                { id: 'summary', label: 'Summary' },
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
            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2'></div>
                  <p className='text-gray-500'>Loading compliance data...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'subsidies' && <SubsidiesTab />}
                {activeTab === 'labor' && <LaborComplianceTab />}
                {activeTab === 'land' && <LandRecordsTab />}
                {activeTab === 'electricity' && <ElectricityTab />}
                {activeTab === 'summary' && <SummaryTab />}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UPComplianceDashboard;
