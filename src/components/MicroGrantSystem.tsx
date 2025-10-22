'use client';

import {
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Heart,
  Home,
  Info,
  Lightbulb,
  Plus,
  Send,
  Upload,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Types matching Motoko canister
type MembershipTier = 'Tier1' | 'Tier2' | 'Tier3' | 'Tier4' | 'Tier5' | 'Tier6' | 'Tier7';
type GrantCategory =
  | 'SolarInstallation'
  | 'WomenEntrepreneurship'
  | 'CommunityDevelopment'
  | 'TechnicalTraining'
  | 'EnergyAccess';
type ApplicationStatus =
  | 'Submitted'
  | 'UnderReview'
  | 'RequiresDocuments'
  | 'ApprovedByTrustee'
  | 'Rejected'
  | 'FundsReleased'
  | 'Completed';

interface GrantApplication {
  id: number;
  applicant: string;
  applicantTier: MembershipTier;
  isWomen: boolean;
  category: GrantCategory;
  title: string;
  description: string;
  requestedAmount: number; // In cents
  expectedImpact: string;
  timeline: string;
  documents: string[];
  submittedAt: number;
  status: ApplicationStatus;
  reviewNotes: ReviewNote[];
  approvedAmount?: number;
  disbursedAt?: number;
}

interface ReviewNote {
  reviewer: string;
  timestamp: number;
  note: string;
  action: string;
}

interface BudgetStatus {
  totalBudget: number;
  allocatedAmount: number;
  disbursedAmount: number;
  availableAmount: number;
}

interface GrantStatistics {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  womenApplicants: number;
  averageGrantSize: number;
  totalDisbursed: number;
}

const MicroGrantSystem = ({
  userTier = 'Tier4' as MembershipTier,
  isWomen = false,
  userId = 'user123',
}) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'my-grants' | 'browse' | 'dashboard'>(
    'apply'
  );
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [statistics, setStatistics] = useState<GrantStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Application form state
  const [formData, setFormData] = useState({
    category: 'WomenEntrepreneurship' as GrantCategory,
    title: '',
    description: '',
    requestedAmount: 500, // Default $500
    expectedImpact: '',
    timeline: '',
    documents: [] as string[],
  });

  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');

  // Grant categories with icons and descriptions
  const categories = [
    {
      id: 'SolarInstallation' as GrantCategory,
      icon: <Zap className='w-5 h-5' />,
      name: 'Solar Installation',
      description: 'Funding for residential or community solar panel installations',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 'WomenEntrepreneurship' as GrantCategory,
      icon: <Heart className='w-5 h-5' />,
      name: "Women's Entrepreneurship",
      description: 'Support for women-led business initiatives and startups',
      color: 'bg-pink-100 text-pink-800',
    },
    {
      id: 'CommunityDevelopment' as GrantCategory,
      icon: <Home className='w-5 h-5' />,
      name: 'Community Development',
      description: 'Projects that benefit local communities and infrastructure',
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 'TechnicalTraining' as GrantCategory,
      icon: <GraduationCap className='w-5 h-5' />,
      name: 'Technical Training',
      description: 'Educational programs and skill development initiatives',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'EnergyAccess' as GrantCategory,
      icon: <Lightbulb className='w-5 h-5' />,
      name: 'Energy Access',
      description: 'Expanding clean energy access to underserved areas',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  // Status badges
  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      Submitted: {
        icon: <Clock className='w-4 h-4' />,
        color: 'bg-blue-100 text-blue-800',
        text: 'Submitted',
      },
      UnderReview: {
        icon: <Eye className='w-4 h-4' />,
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Under Review',
      },
      RequiresDocuments: {
        icon: <FileText className='w-4 h-4' />,
        color: 'bg-orange-100 text-orange-800',
        text: 'Docs Needed',
      },
      ApprovedByTrustee: {
        icon: <CheckCircle className='w-4 h-4' />,
        color: 'bg-green-100 text-green-800',
        text: 'Approved',
      },
      Rejected: {
        icon: <XCircle className='w-4 h-4' />,
        color: 'bg-red-100 text-red-800',
        text: 'Rejected',
      },
      FundsReleased: {
        icon: <DollarSign className='w-4 h-4' />,
        color: 'bg-emerald-100 text-emerald-800',
        text: 'Funded',
      },
      Completed: {
        icon: <Award className='w-4 h-4' />,
        color: 'bg-purple-100 text-purple-800',
        text: 'Completed',
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (cents: number) => {
    return `₹${((cents / 100) * 83).toLocaleString('en-IN')}` + ` ($${(cents / 100).toFixed(0)})`;
  };

  // Get tier eligibility info
  const getTierInfo = (tier: MembershipTier) => {
    const tierMap = {
      Tier7: { priority: 'Highest', color: 'text-purple-600', amount: '$69.76' },
      Tier6: { priority: 'Very High', color: 'text-indigo-600', amount: '$139.53' },
      Tier5: { priority: 'High', color: 'text-blue-600', amount: '$279.07' },
      Tier4: { priority: 'Good', color: 'text-green-600', amount: '$558.13' },
      Tier3: { priority: 'Medium', color: 'text-yellow-600', amount: '$1116.25' },
      Tier2: { priority: 'Low', color: 'text-orange-600', amount: '$2232.50' },
      Tier1: { priority: 'Lowest', color: 'text-red-600', amount: '$3162.50' },
    };
    return tierMap[tier];
  };

  // Mock API calls (replace with actual canister calls)
  const mockAPI = {
    submitApplication: async (data: any) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      return { success: true, grantId: Math.floor(Math.random() * 1000) };
    },

    getUserApplications: async () => {
      // Mock data
      return [
        {
          id: 1,
          applicant: userId,
          applicantTier: userTier,
          isWomen: isWomen,
          category: 'WomenEntrepreneurship' as GrantCategory,
          title: "Women's Solar Cooperative",
          description:
            'Establishing a women-led solar panel installation cooperative in rural Maharashtra',
          requestedAmount: 150000, // $1,500
          expectedImpact: 'Train 25 women in solar installation, create 10 sustainable jobs',
          timeline: '6 months',
          documents: ['business-plan.pdf', 'community-approval.pdf'],
          submittedAt: Date.now() - 86400000 * 7, // 7 days ago
          status: 'UnderReview' as ApplicationStatus,
          reviewNotes: [],
          approvedAmount: undefined,
          disbursedAt: undefined,
        },
      ];
    },

    getBudgetStatus: async (): Promise<BudgetStatus> => {
      return {
        totalBudget: 800000, // $8,000
        allocatedAmount: 250000, // $2,500
        disbursedAmount: 100000, // $1,000
        availableAmount: 550000, // $5,500
      };
    },

    getStatistics: async (): Promise<GrantStatistics> => {
      return {
        totalApplications: 23,
        approvedApplications: 8,
        rejectedApplications: 3,
        womenApplicants: 15,
        averageGrantSize: 125000, // $1,250
        totalDisbursed: 100000, // $1,000
      };
    },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userApps, budget, stats] = await Promise.all([
        mockAPI.getUserApplications(),
        mockAPI.getBudgetStatus(),
        mockAPI.getStatistics(),
      ]);

      setApplications(userApps);
      setBudgetStatus(budget);
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.expectedImpact) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await mockAPI.submitApplication({
        ...formData,
        requestedAmount: formData.requestedAmount * 100, // Convert to cents
      });

      if (result.success) {
        alert(`Application submitted successfully! Grant ID: ${result.grantId}`);
        setFormData({
          category: 'WomenEntrepreneurship',
          title: '',
          description: '',
          requestedAmount: 500,
          expectedImpact: '',
          timeline: '',
          documents: [],
        });
        loadData(); // Refresh data
      }
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* Header with Budget Overview */}
      <div className='bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-3xl font-bold'>Micro-Grant System</h1>
          <div className='text-right'>
            <div className='text-sm opacity-90'>Available Funding</div>
            <div className='text-2xl font-bold'>
              {budgetStatus ? formatCurrency(budgetStatus.availableAmount) : '...'}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold'>{statistics.totalApplications}</div>
              <div className='text-sm opacity-90'>Total Applications</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>{statistics.womenApplicants}</div>
              <div className='text-sm opacity-90'>Women Applicants</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>{statistics.approvedApplications}</div>
              <div className='text-sm opacity-90'>Approved</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>
                {formatCurrency(statistics.averageGrantSize)}
              </div>
              <div className='text-sm opacity-90'>Average Grant</div>
            </div>
          </div>
        )}
      </div>

      {/* User Eligibility Card */}
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Your Grant Eligibility</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex items-center gap-3'>
            <Users className='w-5 h-5 text-blue-600' />
            <div>
              <div className='font-semibold'>{userTier}</div>
              <div className='text-sm text-gray-600'>
                Priority:{' '}
                <span className={getTierInfo(userTier).color}>
                  {getTierInfo(userTier).priority}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <DollarSign className='w-5 h-5 text-green-600' />
            <div>
              <div className='font-semibold'>$500 - $2,000</div>
              <div className='text-sm text-gray-600'>Grant Range</div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {isWomen ? (
              <Heart className='w-5 h-5 text-pink-600' />
            ) : (
              <Award className='w-5 h-5 text-gray-600' />
            )}
            <div>
              <div className='font-semibold'>{isWomen ? "Women's Priority" : 'Standard Track'}</div>
              <div className='text-sm text-gray-600'>
                {isWomen ? 'Fast-track review' : 'Regular review process'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='bg-white rounded-xl shadow-lg'>
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6'>
            {[
              { id: 'apply', label: 'Apply for Grant', icon: <Plus className='w-4 h-4' /> },
              { id: 'my-grants', label: 'My Applications', icon: <FileText className='w-4 h-4' /> },
              { id: 'browse', label: 'Browse Grants', icon: <Eye className='w-4 h-4' /> },
              { id: 'dashboard', label: 'Statistics', icon: <DollarSign className='w-4 h-4' /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
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

        <div className='p-6'>
          {/* Apply Tab */}
          {activeTab === 'apply' && (
            <div>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>Submit Grant Application</h3>

              <form onSubmit={handleSubmitApplication} className='space-y-6'>
                {/* Category Selection */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>
                    Grant Category <span className='text-red-500'>*</span>
                  </label>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {categories.map((category) => (
                      <label key={category.id} className='cursor-pointer'>
                        <input
                          type='radio'
                          name='category'
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value as GrantCategory })
                          }
                          className='sr-only'
                        />
                        <div
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            formData.category === category.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className='flex items-center gap-2 mb-2'>
                            {category.icon}
                            <h4 className='font-semibold text-gray-800'>{category.name}</h4>
                          </div>
                          <p className='text-sm text-gray-600'>{category.description}</p>
                          <span
                            className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${category.color}`}
                          >
                            {category.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Basic Information */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Project Title <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder='Brief, descriptive title for your project'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Requested Amount <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-2 text-gray-500'>$</span>
                      <input
                        type='number'
                        value={formData.requestedAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, requestedAmount: Number(e.target.value) })
                        }
                        min={500}
                        max={2000}
                        step={50}
                        className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                      />
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      Range: $500 - $2,000 | Equivalent:{' '}
                      {formatCurrency(formData.requestedAmount * 100)}
                    </p>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Project Description <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Detailed description of your project, methodology, and implementation plan...'
                    rows={4}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    maxLength={1000}
                    required
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Expected Impact and Timeline */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Expected Impact <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      value={formData.expectedImpact}
                      onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                      placeholder='Describe the expected outcomes, beneficiaries, and measurable impact...'
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      maxLength={500}
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Project Timeline <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder='Project phases, milestones, and expected completion date...'
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      maxLength={500}
                      required
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Supporting Documents
                  </label>
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                    <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                    <p className='text-sm text-gray-600 mb-2'>
                      Upload business plan, community letters, technical specifications, etc.
                    </p>
                    <button
                      type='button'
                      className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Choose Files
                    </button>
                    <p className='text-xs text-gray-500 mt-2'>PDF, DOC, JPG up to 10MB each</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className='flex items-center justify-between pt-4'>
                  <div className='text-sm text-gray-600'>
                    <Info className='w-4 h-4 inline mr-1' />
                    Applications are reviewed within 5-7 business days
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    className='flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    ) : (
                      <Send className='w-4 h-4' />
                    )}
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Applications Tab */}
          {activeTab === 'my-grants' && (
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-gray-800'>My Grant Applications</h3>
                <div className='flex items-center gap-2'>
                  <Filter className='w-4 h-4 text-gray-500' />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className='px-3 py-1 border border-gray-300 rounded-lg text-sm'
                  >
                    <option value='All'>All Status</option>
                    <option value='Submitted'>Submitted</option>
                    <option value='UnderReview'>Under Review</option>
                    <option value='ApprovedByTrustee'>Approved</option>
                    <option value='FundsReleased'>Funded</option>
                    <option value='Completed'>Completed</option>
                    <option value='Rejected'>Rejected</option>
                  </select>
                </div>
              </div>

              <div className='space-y-4'>
                {applications.length === 0 ? (
                  <div className='text-center py-8'>
                    <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600'>
                      No applications yet. Submit your first grant application!
                    </p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className='bg-gray-50 rounded-lg p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h4 className='text-lg font-semibold text-gray-800'>{app.title}</h4>
                          <p className='text-sm text-gray-600'>Grant ID: #{app.id}</p>
                        </div>
                        <div className='text-right'>
                          {getStatusBadge(app.status)}
                          <p className='text-sm text-gray-600 mt-1'>
                            Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <div>
                          <span className='text-sm text-gray-600'>Category:</span>
                          <p className='font-medium'>
                            {categories.find((c) => c.id === app.category)?.name}
                          </p>
                        </div>
                        <div>
                          <span className='text-sm text-gray-600'>Requested Amount:</span>
                          <p className='font-medium'>{formatCurrency(app.requestedAmount)}</p>
                        </div>
                        <div>
                          <span className='text-sm text-gray-600'>Timeline:</span>
                          <p className='font-medium'>{app.timeline}</p>
                        </div>
                      </div>

                      <p className='text-gray-700 mb-4'>{app.description}</p>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          {app.documents.length > 0 && (
                            <span className='text-sm text-gray-600'>
                              <FileText className='w-4 h-4 inline mr-1' />
                              {app.documents.length} documents
                            </span>
                          )}
                          {app.isWomen && (
                            <span className='text-sm text-pink-600'>
                              <Heart className='w-4 h-4 inline mr-1' />
                              Women's Priority
                            </span>
                          )}
                        </div>

                        <button className='px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors'>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Browse Tab - Placeholder */}
          {activeTab === 'browse' && (
            <div className='text-center py-8'>
              <Eye className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Browse Public Grant Applications
              </h3>
              <p className='text-gray-600'>
                View approved and completed projects from the community
              </p>
              <p className='text-sm text-gray-500 mt-4'>Feature coming soon...</p>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'dashboard' && statistics && budgetStatus && (
            <div>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>Grant Program Statistics</h3>

              {/* Budget Breakdown */}
              <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                <h4 className='font-semibold text-gray-800 mb-4'>Budget Allocation</h4>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {formatCurrency(budgetStatus.totalBudget)}
                    </div>
                    <div className='text-sm text-gray-600'>Total Budget</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {formatCurrency(budgetStatus.allocatedAmount)}
                    </div>
                    <div className='text-sm text-gray-600'>Allocated</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {formatCurrency(budgetStatus.disbursedAmount)}
                    </div>
                    <div className='text-sm text-gray-600'>Disbursed</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {formatCurrency(budgetStatus.availableAmount)}
                    </div>
                    <div className='text-sm text-gray-600'>Available</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mt-4'>
                  <div className='flex justify-between text-sm text-gray-600 mb-1'>
                    <span>Budget Utilization</span>
                    <span>
                      {Math.round((budgetStatus.allocatedAmount / budgetStatus.totalBudget) * 100)}%
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                      style={{
                        width: `${
                          (budgetStatus.allocatedAmount / budgetStatus.totalBudget) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Application Stats */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='bg-white border border-gray-200 rounded-lg p-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <FileText className='w-6 h-6 text-blue-600' />
                    <h5 className='font-semibold text-gray-800'>Applications</h5>
                  </div>
                  <div className='text-2xl font-bold text-gray-800 mb-1'>
                    {statistics.totalApplications}
                  </div>
                  <p className='text-sm text-gray-600'>Total submitted</p>
                </div>

                <div className='bg-white border border-gray-200 rounded-lg p-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <Heart className='w-6 h-6 text-pink-600' />
                    <h5 className='font-semibold text-gray-800'>Women Applicants</h5>
                  </div>
                  <div className='text-2xl font-bold text-pink-600 mb-1'>
                    {statistics.womenApplicants}
                  </div>
                  <p className='text-sm text-gray-600'>
                    {Math.round((statistics.womenApplicants / statistics.totalApplications) * 100)}%
                    of total
                  </p>
                </div>

                <div className='bg-white border border-gray-200 rounded-lg p-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <CheckCircle className='w-6 h-6 text-green-600' />
                    <h5 className='font-semibold text-gray-800'>Success Rate</h5>
                  </div>
                  <div className='text-2xl font-bold text-green-600 mb-1'>
                    {Math.round(
                      (statistics.approvedApplications / statistics.totalApplications) * 100
                    )}
                    %
                  </div>
                  <p className='text-sm text-gray-600'>
                    {statistics.approvedApplications} approved
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicroGrantSystem;
