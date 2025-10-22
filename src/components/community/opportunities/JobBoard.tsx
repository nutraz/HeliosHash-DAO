'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import JobFiltersPanel from './filters/JobFiltersPanel';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import JobPostForm from './JobPostForm';
// import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCategory, JobFilters, JobPosting } from '@/types/jobs';
import {
  Award,
  Briefcase,
  Clock,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

// Enhanced mock data for comprehensive testing
const MOCK_JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Solar Panel Installation Technician',
    description:
      'Lead our solar installation team across multiple villages in the Urgam Valley. This role involves managing installations, training local technicians, and ensuring quality standards. Perfect opportunity for experienced professionals to make a direct impact on rural communities while working with cutting-edge renewable energy technology.',
    category: 'Engineering',
    location: { type: 'OnSite', location: 'Urgam Valley, Gujarat' },
    compensation: { amount: 35000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Minimum 3 years solar installation experience',
      'Electrical certification required',
      'Team leadership experience',
      'Fluency in Gujarati and Hindi',
      'Valid driving license',
    ],
    skills: [
      'Solar Panel Installation',
      'Electrical Wiring',
      'Team Management',
      'Safety Protocols',
      'Quality Control',
    ],
    poster: 'dao-admin',
    posterName: 'HeliosHash DAO Engineering Team',
    status: 'Active',
    created: Date.now() - 172800000, // 2 days ago
    deadline: Date.now() + 604800000, // 1 week from now
    applicants: ['user1', 'user2', 'user3'],
    applicationCount: 18,
    featured: true,
    urgency: 'High',
    experienceLevel: 'Senior',
    workType: 'FullTime',
    benefits: [
      'Health Insurance',
      'Transportation Provided',
      'Performance Bonuses',
      'Training & Certification',
    ],
    companyInfo: {
      name: 'HeliosHash DAO',
      description:
        'Decentralized solar energy infrastructure organization focused on sustainable rural development',
    },
  },
  {
    id: '2',
    title: 'Community Solar Project Manager',
    description:
      'Drive community engagement and coordinate solar installations across rural villages. Work directly with local leaders, manage project timelines, and ensure successful adoption of renewable energy solutions. This hybrid role combines project management with meaningful community impact.',
    category: 'Management',
    location: { type: 'Hybrid', location: 'Gujarat Region' },
    compensation: { amount: 45000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Project management experience (3+ years)',
      'Strong community engagement skills',
      'Understanding of renewable energy systems',
      'Excellent communication in local languages',
      "Bachelor's degree preferred",
    ],
    skills: [
      'Project Management',
      'Community Relations',
      'Solar Energy',
      'Leadership',
      'Stakeholder Management',
    ],
    poster: 'community-lead',
    posterName: 'Community Development Team',
    status: 'Active',
    created: Date.now() - 345600000, // 4 days ago
    deadline: Date.now() + 1209600000, // 2 weeks from now
    applicants: ['user4', 'user5'],
    applicationCount: 12,
    featured: false,
    urgency: 'Medium',
    experienceLevel: 'Mid',
    workType: 'FullTime',
    benefits: ['Flexible Hours', 'Community Impact', 'Professional Growth', 'Remote Work Options'],
    companyInfo: {
      name: 'HeliosHash DAO',
      description:
        'Decentralized solar energy infrastructure organization focused on sustainable rural development',
    },
  },
  {
    id: '3',
    title: 'Blockchain Developer - Smart Contracts',
    description:
      'Join our tech team to build and maintain smart contracts for solar energy tokenization and DAO governance. Work with Internet Computer Protocol and Motoko to create transparent, efficient systems for energy trading and community governance.',
    category: 'Technology',
    location: { type: 'Remote', location: 'Global' },
    compensation: { amount: 80000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Strong experience with Motoko or similar languages',
      'Blockchain development experience (2+ years)',
      'Understanding of DeFi and DAO mechanics',
      'Experience with Internet Computer Protocol',
      'Smart contract auditing knowledge',
    ],
    skills: ['Motoko', 'Smart Contracts', 'Internet Computer', 'DeFi', 'TypeScript', 'React'],
    poster: 'tech-lead',
    posterName: 'Technical Architecture Team',
    status: 'Active',
    created: Date.now() - 86400000, // 1 day ago
    deadline: Date.now() + 1814400000, // 3 weeks from now
    applicants: ['dev1', 'dev2', 'dev3', 'dev4'],
    applicationCount: 24,
    featured: true,
    urgency: 'High',
    experienceLevel: 'Mid',
    workType: 'FullTime',
    benefits: ['Competitive Salary', 'Token Rewards', 'Remote Work', 'Learning Budget'],
    companyInfo: {
      name: 'HeliosHash DAO',
      description:
        'Decentralized solar energy infrastructure organization focused on sustainable rural development',
    },
  },
  {
    id: '4',
    title: 'Solar Energy Education Coordinator',
    description:
      'Develop and deliver educational programs about solar energy and sustainability to local communities. Create engaging content, conduct workshops, and build digital literacy around renewable energy technologies.',
    category: 'Education',
    location: { type: 'OnSite', location: 'Multiple Villages, Gujarat' },
    compensation: { amount: 28000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Education background or teaching experience',
      'Passion for renewable energy and sustainability',
      'Strong presentation and communication skills',
      'Fluency in local languages',
      'Ability to travel between villages',
    ],
    skills: [
      'Teaching',
      'Content Creation',
      'Public Speaking',
      'Digital Literacy',
      'Community Outreach',
    ],
    poster: 'education-team',
    posterName: 'Education & Outreach Department',
    status: 'Active',
    created: Date.now() - 259200000, // 3 days ago
    deadline: Date.now() + 1209600000, // 2 weeks from now
    applicants: ['teacher1', 'teacher2'],
    applicationCount: 8,
    featured: false,
    urgency: 'Medium',
    experienceLevel: 'Entry',
    workType: 'PartTime',
    benefits: ['Flexible Schedule', 'Community Impact', 'Training Provided', 'Travel Allowance'],
    companyInfo: {
      name: 'HeliosHash DAO',
      description:
        'Decentralized solar energy infrastructure organization focused on sustainable rural development',
    },
  },
];

export default function JobBoard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'featured' | 'applications'>(
    'recent'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Temporary mock auth data
  const user = null;
  const isAuthenticated = false;

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = jobs.filter((job) => {
      // Search query filter - enhanced to include more fields
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          job.category.toLowerCase().includes(query) ||
          (job.location.location && job.location.location.toLowerCase().includes(query));

        if (!matchesQuery) return false;
      }

      // Apply filters
      if (filters.categories?.length && !filters.categories.includes(job.category as JobCategory)) {
        return false;
      }

      if (filters.locations?.length) {
        const jobLocation = (job.location.location || '').toLowerCase();
        const matchesLocation = filters.locations.some(
          (loc) =>
            jobLocation.includes(loc.toLowerCase()) ||
            job.location.type.toLowerCase() === loc.toLowerCase()
        );
        if (!matchesLocation) return false;
      }

      if (
        filters.experienceLevels?.length &&
        !filters.experienceLevels.includes(job.experienceLevel)
      ) {
        return false;
      }

      if (filters.workTypes?.length && !filters.workTypes.includes(job.workType)) {
        return false;
      }

      if (filters.skills?.length) {
        const hasSkills = filters.skills.some((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasSkills) return false;
      }

      if (filters.compensationRange) {
        const { min, max } = filters.compensationRange;
        if (min !== undefined && job.compensation.amount < min) return false;
        if (max !== undefined && job.compensation.amount > max) return false;
      }

      return true;
    });

    // Enhanced sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.created - a.created;
        case 'deadline':
          const aDeadline = a.deadline || Infinity;
          const bDeadline = b.deadline || Infinity;
          return aDeadline - bDeadline;
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.created - a.created;
        case 'applications':
          return b.applicationCount - a.applicationCount;
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, filters, searchQuery, sortBy]);

  // Enhanced statistics
  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: jobs.length,
      active: jobs.filter((job) => job.status === 'Active').length,
      applications: jobs.reduce((sum, job) => sum + job.applicationCount, 0),
      featured: jobs.filter((job) => job.featured).length,
      urgent: jobs.filter((job) => job.urgency === 'High' || job.urgency === 'Critical').length,
      closingSoon: jobs.filter(
        (job) => job.deadline && job.deadline - now < 7 * 24 * 60 * 60 * 1000
      ).length,
    };
  }, [jobs]);

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  const handleJobSubmitted = (formData: any) => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newJob: JobPosting = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: { type: formData.locationType, location: formData.locationName },
        compensation: formData.compensation,
        requirements: formData.requirements || [],
        skills: formData.skills || [],
        poster: 'anonymous',
        posterName: 'Anonymous User',
        status: 'Active',
        created: Date.now(),
        applicants: [],
        applicationCount: 0,
        experienceLevel: formData.experienceLevel || 'Entry',
        workType: formData.workType || 'FullTime',
        urgency: formData.urgency,
        deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
        benefits: formData.benefits || [],
      };

      setJobs((prev) => [newJob, ...prev]);
      setShowPostForm(false);
      setActiveTab('browse');
      setIsLoading(false);
    }, 1000);
  };

  const refreshJobs = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={handleBackToList}
        onApply={() => {
          console.log('Applying to job:', selectedJob.id);
          // TODO: Implement application flow
        }}
      />
    );
  }

  if (showPostForm) {
    return (
      <JobPostForm
        isOpen={true}
        onClose={() => {
          setShowPostForm(false);
          setActiveTab('browse');
        }}
        onSubmit={handleJobSubmitted}
      />
    );
  }

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
      data-testid='job-board-wrapper'
    >
      <div className='max-w-7xl mx-auto p-4 md:p-6 space-y-8' data-testid='job-board-content'>
        {/* Enhanced Header */}
        <div className='text-center space-y-6'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <div className='p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl'>
              <Zap className='h-8 w-8 text-white' />
            </div>
            <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent'>
              Community Opportunities
            </h1>
          </div>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            Discover solar energy jobs, contribute to DAO projects, and build a sustainable future
            together. Join our decentralized community making renewable energy accessible to all.
          </p>
          <div className='flex items-center justify-center gap-6 text-sm text-gray-500'>
            <div className='flex items-center gap-2'>
              <Target className='h-4 w-4' />
              <span>Impact-Driven Roles</span>
            </div>
            <div className='flex items-center gap-2'>
              <Award className='h-4 w-4' />
              <span>Competitive Benefits</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4' />
              <span>Community First</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'
          data-testid='job-stats-cards'
        >
          {[
            {
              icon: Briefcase,
              value: stats.total,
              label: 'Total Jobs',
              color: 'blue',
              bgColor: 'bg-blue-50 dark:bg-blue-900/20',
              iconColor: 'text-blue-600',
              textColor: 'text-blue-600',
            },
            {
              icon: Star,
              value: stats.active,
              label: 'Active',
              color: 'green',
              bgColor: 'bg-green-50 dark:bg-green-900/20',
              iconColor: 'text-green-600',
              textColor: 'text-green-600',
            },
            {
              icon: Users,
              value: stats.applications,
              label: 'Applications',
              color: 'purple',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20',
              iconColor: 'text-purple-600',
              textColor: 'text-purple-600',
            },
            {
              icon: TrendingUp,
              value: stats.featured,
              label: 'Featured',
              color: 'orange',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20',
              iconColor: 'text-orange-600',
              textColor: 'text-orange-600',
            },
            {
              icon: Zap,
              value: stats.urgent,
              label: 'Urgent',
              color: 'red',
              bgColor: 'bg-red-50 dark:bg-red-900/20',
              iconColor: 'text-red-600',
              textColor: 'text-red-600',
            },
            {
              icon: Clock,
              value: stats.closingSoon,
              label: 'Closing Soon',
              color: 'yellow',
              bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
              iconColor: 'text-yellow-600',
              textColor: 'text-yellow-600',
            },
          ].map((stat, index) => (
            <Card
              key={index}
              data-testid={`job-stat-${stat.label.replace(/\s+/g, '-').toLowerCase()}`}
              className={`${stat.bgColor} border-${stat.color}-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer stats-card-pulse group`}
              onClick={() => {
                // Add quick filter for stat category
                if (stat.label === 'Featured') {
                  setFilters((prev) => ({ ...prev, featured: true }));
                } else if (stat.label === 'Urgent') {
                  setFilters((prev) => ({ ...prev, urgency: ['High', 'Critical'] }));
                } else if (stat.label === 'Closing Soon') {
                  setSortBy('deadline');
                }
              }}
            >
              <CardContent className='p-4 text-center relative'>
                <div className='flex items-center justify-center mb-3'>
                  <div
                    className={`p-2 ${stat.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-200`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform duration-200`}
                >
                  {stat.value}
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>{stat.label}</div>
                {/* Clickable indicator */}
                {(stat.label === 'Featured' ||
                  stat.label === 'Urgent' ||
                  stat.label === 'Closing Soon') && (
                  <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-8'
          data-testid='job-tabs'
        >
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <TabsList
              className='grid w-full md:w-auto grid-cols-2 md:grid-cols-3 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700'
              data-testid='job-tabs-list'
            >
              <TabsTrigger
                value='browse'
                className='data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium'
              >
                <Briefcase className='h-4 w-4 mr-2' />
                Browse Jobs
              </TabsTrigger>
              <TabsTrigger
                value='my-jobs'
                className='data-[state=active]:bg-green-600 data-[state=active]:text-white font-medium'
              >
                <Users className='h-4 w-4 mr-2' />
                My Applications
              </TabsTrigger>
              {isAuthenticated && (
                <TabsTrigger
                  value='post'
                  className='data-[state=active]:bg-purple-600 data-[state=active]:text-white font-medium'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Post Job
                </TabsTrigger>
              )}
            </TabsList>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={refreshJobs}
                disabled={isLoading}
                className='border-gray-300 hover:border-blue-500 hover:text-blue-600'
                data-testid='job-refresh-button'
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {activeTab === 'browse' && isAuthenticated && (
                <Button
                  onClick={() => {
                    setShowPostForm(true);
                    setActiveTab('post');
                  }}
                  className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                  size='sm'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Post New Job
                </Button>
              )}
            </div>
          </div>

          <TabsContent value='browse' className='space-y-8' data-testid='job-tab-browse'>
            {/* Enhanced Search and Filter Bar */}
            <Card
              className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg'
              data-testid='job-search-filter-card'
            >
              <div className='flex flex-col gap-4'>
                {/* Search Bar - Full Width on Mobile */}
                <div className='relative' data-testid='job-search-input'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10' />
                  <Input
                    placeholder='Search jobs by title, skills, location, or description...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10 pr-12 py-3 text-base md:text-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                    >
                      <div className='w-5 h-5 flex items-center justify-center text-xs font-bold'>
                        ×
                      </div>
                    </button>
                  )}
                </div>

                {/* Filters and Sort - Responsive Layout */}
                <div className='flex flex-col sm:flex-row gap-3'>
                  <Button
                    variant={showFilters ? 'default' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`${
                      showFilters
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    } transition-all duration-200 flex-1 sm:flex-none`}
                    data-testid='job-filters-toggle'
                  >
                    <Filter className='h-4 w-4 mr-2' />
                    <span className='sm:hidden'>Filters</span>
                    <span className='hidden sm:inline'>Advanced Filters</span>
                    {Object.values(filters).some(
                      (v) => v && (Array.isArray(v) ? v.length > 0 : true)
                    ) && <Badge className='ml-2 bg-red-100 text-red-800 text-xs'>Active</Badge>}
                  </Button>

                  <div className='flex gap-3 flex-1'>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className='flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                      data-testid='job-sort-select'
                    >
                      <option value='recent'>📅 Most Recent</option>
                      <option value='deadline'>⏰ Deadline (Urgent)</option>
                      <option value='featured'>⭐ Featured First</option>
                      <option value='applications'>👥 Most Popular</option>
                    </select>

                    {/* Quick Clear Filters Button */}
                    {(searchQuery ||
                      Object.values(filters).some(
                        (v) => v && (Array.isArray(v) ? v.length > 0 : true)
                      )) && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setSearchQuery('');
                          setFilters({});
                        }}
                        className='px-3 text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300'
                        data-testid='job-clear-all'
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchQuery ||
                  Object.values(filters).some(
                    (v) => v && (Array.isArray(v) ? v.length > 0 : true)
                  )) && (
                  <div className='flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-600'>
                    {searchQuery && (
                      <Badge variant='secondary' className='bg-blue-100 text-blue-800 text-sm'>
                        Search: "{searchQuery}"
                      </Badge>
                    )}
                    {filters.categories?.map((cat) => (
                      <Badge
                        key={cat}
                        variant='secondary'
                        className='bg-green-100 text-green-800 text-sm'
                      >
                        {cat}
                      </Badge>
                    ))}
                    {filters.experienceLevels?.map((level) => (
                      <Badge
                        key={level}
                        variant='secondary'
                        className='bg-purple-100 text-purple-800 text-sm'
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <div className='flex flex-col lg:flex-row gap-8'>
              {/* Enhanced Filters Sidebar */}
              {showFilters && (
                <div className='lg:w-80 flex-shrink-0'>
                  <div className='sticky top-4'>
                    <JobFiltersPanel filters={filters} onFiltersChange={setFilters} />
                  </div>
                </div>
              )}

              {/* Enhanced Job Listings */}
              <div className='flex-1 space-y-6'>
                {filteredJobs.length > 0 ? (
                  <>
                    <div
                      className='flex justify-between items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-4 border border-gray-200 dark:border-gray-700'
                      data-testid='job-showing-count'
                    >
                      <p className='text-gray-600 dark:text-gray-400 font-medium'>
                        Showing{' '}
                        <span className='text-blue-600 font-semibold'>{filteredJobs.length}</span>{' '}
                        of <span className='text-blue-600 font-semibold'>{jobs.length}</span> jobs
                      </p>
                      {searchQuery && (
                        <Badge
                          variant='outline'
                          className='bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        >
                          Searching: "{searchQuery}"
                        </Badge>
                      )}
                    </div>

                    <div className='grid gap-6' data-testid='job-list'>
                      {filteredJobs.map((job, index) => (
                        <div
                          key={job.id}
                          className='animate-fade-in'
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <JobCard
                            job={job}
                            onClick={() => handleJobSelect(job)}
                            className='hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-l-blue-500 hover:border-l-purple-500'
                            data-testid='job-card'
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Card
                    className='p-12 text-center border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur'
                    data-testid='job-empty-state'
                  >
                    <div className='space-y-6'>
                      <div className='mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
                        <Briefcase className='h-12 w-12 text-gray-400' />
                      </div>
                      <div className='space-y-2'>
                        <h3 className='text-2xl font-semibold text-gray-700 dark:text-gray-300'>
                          No Jobs Found
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                          {searchQuery
                            ? `No jobs match "${searchQuery}". Try adjusting your search terms or filters.`
                            : 'Try adjusting your search criteria or filters to find more opportunities.'}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSearchQuery('');
                          setFilters({});
                        }}
                        variant='outline'
                        className='border-gray-300 hover:border-blue-500 hover:text-blue-600'
                        data-testid='job-empty-clear'
                      >
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Clear All Filters
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='my-jobs' data-testid='job-tab-my-jobs'>
            <Card className='p-12 text-center border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur'>
              <div className='space-y-6'>
                <div className='mx-auto w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center'>
                  <Users className='h-12 w-12 text-green-600' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-semibold text-gray-700 dark:text-gray-300'>
                    My Applications & Jobs
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                    Track your job applications, manage posted jobs, and view application status all
                    in one place.
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Badge
                    variant='secondary'
                    className='bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-lg px-4 py-2'
                  >
                    🚧 Coming Soon
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600'
                  >
                    Feature in Development
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='post' data-testid='job-tab-post'>
            {isAuthenticated ? (
              <Card className='p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg'>
                <CardHeader className='text-center pb-8'>
                  <CardTitle className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    Post a New Job
                  </CardTitle>
                  <p className='text-gray-600 dark:text-gray-400 mt-2'>
                    Share opportunities with the HeliosHash community and find the perfect
                    candidates for your solar energy projects.
                  </p>
                </CardHeader>
                <JobPostForm
                  isOpen={true}
                  onClose={() => setActiveTab('browse')}
                  onSubmit={handleJobSubmitted}
                />
              </Card>
            ) : (
              <Card className='p-12 text-center border-gray-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur'>
                <div className='space-y-6'>
                  <div className='mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center'>
                    <Plus className='h-12 w-12 text-purple-600' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-semibold text-gray-700 dark:text-gray-300'>
                      Post a Job Opportunity
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                      Connect with talented individuals in the renewable energy space. Please log in
                      to post job opportunities.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                    size='lg'
                  >
                    <Users className='h-5 w-5 mr-2' />
                    Log In to Post Jobs
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
