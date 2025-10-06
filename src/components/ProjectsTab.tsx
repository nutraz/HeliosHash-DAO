'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Type definitions for the projects system
interface ProjectApplication {
  id: string;
  projectName: string;
  projectType: 'Solar Farm' | 'Rooftop Solar' | 'Microgrid' | 'Storage System';
  applicantName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'On Hold';
  currentStage: string;
  capacity: number;
  estimatedCost: number;
  applicationDate: number;
  landRecordId: string;
}

interface LandRecord {
  id: string;
  surveyNumber: string;
  village: string;
  district: string;
  area: number;
  ownerName: string;
  solarPotential: {
    estimatedCapacity: number;
    averageSunlight: number;
  };
  verification: {
    verified: boolean;
  };
}

interface GovernmentApproval {
  id: string;
  departmentName: string;
  approvalType: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Conditional';
  submittedDate: number;
  targetCompletionDate: number;
  currentStage: string;
}

interface ProjectsTabProps {
  userRole: 'applicant' | 'government' | 'investor' | 'admin';
  userId?: string;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ userRole, userId }) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [landRecords, setLandRecords] = useState<LandRecord[]>([]);
  const [approvals, setApprovals] = useState<GovernmentApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});

  // Fetch data based on user role
  useEffect(() => {
    fetchProjectsData();
  }, [userRole, userId]);

  const fetchProjectsData = async () => {
    try {
      setLoading(true);

      // Fetch applications
      const appsResponse = await fetch(
        `/api/projects/applications?userRole=${userRole}&userId=${userId || ''}`
      );
      const appsData = await appsResponse.json();

      if (appsData.success) {
        setApplications(appsData.data.applications);
        setLandRecords(appsData.data.landRecords);
        setStats(appsData.data.stats);
      }

      // Fetch government approvals if applicable
      if (userRole === 'government' || userRole === 'admin') {
        const approvalsResponse = await fetch(
          `/api/government/approvals?userRole=${userRole}&userId=${userId || ''}`
        );
        const approvalsData = await approvalsResponse.json();

        if (approvalsData.success) {
          setApprovals(approvalsData.data.workflows);
        }
      }
    } catch (error) {
      console.error('Error fetching projects data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      case 'Under Review':
        return 'text-blue-600 bg-blue-100';
      case 'Submitted':
        return 'text-purple-600 bg-purple-100';
      case 'Draft':
        return 'text-gray-600 bg-gray-100';
      case 'On Hold':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Render Applications Tab
  const renderApplicationsTab = () => (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-lg text-white'
        >
          <h3 className='text-sm font-medium'>Total Applications</h3>
          <p className='text-2xl font-bold'>{stats.totalApplications || 0}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg text-white'
        >
          <h3 className='text-sm font-medium'>Approved Projects</h3>
          <p className='text-2xl font-bold'>{stats.byStatus?.approved || 0}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-lg text-white'
        >
          <h3 className='text-sm font-medium'>Total Capacity</h3>
          <p className='text-2xl font-bold'>{stats.totalCapacity || 0} kW</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg text-white'
        >
          <h3 className='text-sm font-medium'>Investment</h3>
          <p className='text-2xl font-bold'>{formatCurrency(stats.totalInvestment || 0)}</p>
        </motion.div>
      </div>

      {/* Applications List */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50'>
          <h3 className='text-lg font-semibold text-gray-900'>Project Applications</h3>
          {userRole === 'applicant' && (
            <p className='text-sm text-gray-600 mt-1'>
              Track your solar project applications and their status
            </p>
          )}
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Project
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Capacity
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stage
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Submitted
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {applications.map((application) => (
                <motion.tr
                  key={application.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className='transition-colors duration-150'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {application.projectName}
                      </div>
                      <div className='text-sm text-gray-500'>{application.applicantName}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {application.projectType}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {application.capacity} kW
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {application.currentStage}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(application.applicationDate)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      className='text-orange-600 hover:text-orange-900 mr-3'
                      onClick={() => {
                        /* View details */
                      }}
                    >
                      View
                    </button>
                    {userRole === 'applicant' && application.status === 'Draft' && (
                      <button
                        className='text-blue-600 hover:text-blue-900'
                        onClick={() => {
                          /* Edit application */
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Land Records Tab
  const renderLandRecordsTab = () => (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50'>
          <h3 className='text-lg font-semibold text-gray-900'>Land Records</h3>
          <p className='text-sm text-gray-600 mt-1'>
            Your registered land records with solar potential assessment
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Survey No.
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Area
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Solar Potential
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sunlight
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {landRecords.map((record) => (
                <motion.tr
                  key={record.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className='transition-colors duration-150'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>{record.surveyNumber}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{record.village}</div>
                    <div className='text-sm text-gray-500'>{record.district}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {record.area} acres
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {record.solarPotential.estimatedCapacity} kW
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {record.solarPotential.averageSunlight} hrs/day
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.verification.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {record.verification.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      className='text-green-600 hover:text-green-900 mr-3'
                      onClick={() => {
                        /* View land record details */
                      }}
                    >
                      View
                    </button>
                    <button
                      className='text-orange-600 hover:text-orange-900'
                      onClick={() => {
                        /* Create application for this land */
                      }}
                    >
                      Apply
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Government Approvals Tab
  const renderGovernmentTab = () => (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'>
          <h3 className='text-lg font-semibold text-gray-900'>Government Approvals</h3>
          <p className='text-sm text-gray-600 mt-1'>
            Track approval status from various government departments
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Approval Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Current Stage
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Submitted
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Target Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {approvals.map((approval) => (
                <motion.tr
                  key={approval.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className='transition-colors duration-150'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {approval.departmentName}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {approval.approvalType}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(approval.status)}`}
                    >
                      {approval.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {approval.currentStage}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(approval.submittedDate)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(approval.targetCompletionDate)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      className='text-blue-600 hover:text-blue-900 mr-3'
                      onClick={() => {
                        /* Track approval */
                      }}
                    >
                      Track
                    </button>
                    <button
                      className='text-green-600 hover:text-green-900'
                      onClick={() => {
                        /* View details */
                      }}
                    >
                      Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Tab Navigation */}
      <div className='mb-6'>
        <nav className='flex space-x-8'>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'applications'
                ? 'text-orange-600 border-orange-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Project Applications
          </button>

          {(userRole === 'applicant' || userRole === 'admin') && (
            <button
              onClick={() => setActiveTab('landRecords')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'landRecords'
                  ? 'text-green-600 border-green-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Land Records
            </button>
          )}

          {(userRole === 'government' || userRole === 'admin') && (
            <button
              onClick={() => setActiveTab('government')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'government'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Government Approvals
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'applications' && renderApplicationsTab()}
        {activeTab === 'landRecords' && renderLandRecordsTab()}
        {activeTab === 'government' && renderGovernmentTab()}
      </motion.div>
    </div>
  );
};

export default ProjectsTab;
