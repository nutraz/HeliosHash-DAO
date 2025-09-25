"use client";

import React, { useState, useEffect, useMemo } from 'react';
import JobCard from './JobCard';
import JobFiltersPanel from './filters/JobFiltersPanel';
import JobDetails from './JobDetails';
import JobPostForm from './JobPostForm';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { JobPosting, JobFilters, JobCategory, JOB_CATEGORIES } from '@/types/jobs';

// Mock data for development - replace with API calls
const MOCK_JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'Solar Panel Installation Technician',
    description: 'Join our team to install and maintain solar panel systems across the Urgam Valley. Perfect opportunity for local residents to gain technical skills in renewable energy.',
    category: 'Engineering',
    location: { type: 'OnSite', location: 'Urgam Valley, Gujarat' },
    compensation: { amount: 25000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Basic electrical knowledge',
      'Physical fitness for rooftop work',
      'Willingness to learn new technologies',
      'Local resident preferred'
    ],
    skills: ['Solar Panel Installation', 'Electrical Wiring', 'Safety Protocols'],
    poster: 'dao-admin',
    posterName: 'HeliosHash DAO',
    status: 'Active',
    created: Date.now() - 86400000, // 1 day ago
    deadline: Date.now() + 604800000, // 1 week from now
    applicants: [],
    applicationCount: 12,
    featured: true,
    urgency: 'High',
    experienceLevel: 'Entry',
    workType: 'FullTime',
    benefits: ['Health Insurance', 'Training Provided', 'Equipment Supplied'],
    companyInfo: {
      name: 'HeliosHash DAO',
      description: 'Decentralized solar energy infrastructure organization'
    }
  },
  {
    id: '2',
    title: 'Blockchain Developer - Smart Contracts',
    description: 'Develop and maintain smart contracts for our decentralized energy trading platform. Work with cutting-edge Internet Computer technology.',
    category: 'Technology',
    location: { type: 'Remote' },
    compensation: { amount: 80000, currency: 'USD', paymentType: 'Monthly' },
    requirements: [
      '3+ years blockchain development experience',
      'Proficiency in Motoko or Rust',
      'Understanding of DeFi protocols',
      'Experience with Internet Computer'
    ],
    skills: ['Motoko', 'Smart Contracts', 'Internet Computer', 'DeFi', 'Web3'],
    poster: 'tech-lead',
    posterName: 'Technical Team',
    status: 'Active',
    created: Date.now() - 172800000, // 2 days ago
    applicants: [],
    applicationCount: 8,
    urgency: 'Medium',
    experienceLevel: 'Senior',
    workType: 'Contract',
    benefits: ['Flexible Hours', 'Crypto Payments', 'Remote Work']
  },
  {
    id: '3',
    title: 'Community Outreach Coordinator',
    description: 'Build relationships with local communities and manage stakeholder engagement for our pilot projects.',
    category: 'Community',
    location: { type: 'Hybrid', location: 'Gujarat & Remote' },
    compensation: { amount: 40000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Strong communication skills in Gujarati and Hindi',
      'Experience in community engagement',
      'Understanding of rural development',
      'Local network preferred'
    ],
    skills: ['Community Engagement', 'Stakeholder Relations', 'Public Speaking'],
    poster: 'community-manager',
    posterName: 'Community Team',
    status: 'Active',
    created: Date.now() - 259200000, // 3 days ago
    applicants: [],
    applicationCount: 15,
    urgency: 'Medium',
    experienceLevel: 'Mid',
    workType: 'FullTime',
    benefits: ['Travel Allowance', 'Local Impact', 'Skill Development']
  }
];

interface JobBoardProps {
  className?: string;
}

export default function JobBoard({ className }: JobBoardProps) {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<JobFilters>({});
  const [loading, setLoading] = useState(false);

  // Filter jobs based on search and filters
  const applyFilters = useMemo(() => {
    return () => {
      let filtered = [...jobs];

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query)) ||
          job.category.toLowerCase().includes(query)
        );
      }

      // Category filter
      if (filters.category && filters.category.length > 0) {
        filtered = filtered.filter(job => filters.category!.includes(job.category));
      }

      // Location filter
      if (filters.location && filters.location.length > 0) {
        filtered = filtered.filter(job => filters.location!.includes(job.location.type));
      }

      // Experience level filter
      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        filtered = filtered.filter(job => 
          job.experienceLevel && filters.experienceLevel!.includes(job.experienceLevel)
        );
      }

      // Work type filter
      if (filters.workType && filters.workType.length > 0) {
        filtered = filtered.filter(job => 
          job.workType && filters.workType!.includes(job.workType)
        );
      }

      // Compensation range filter
      if (filters.minCompensation || filters.maxCompensation) {
        filtered = filtered.filter(job => {
          const amount = job.compensation.amount;
          if (filters.minCompensation && amount < filters.minCompensation) return false;
          if (filters.maxCompensation && amount > filters.maxCompensation) return false;
          return true;
        });
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        filtered = filtered.filter(job =>
          filters.skills!.some(skill => 
            job.skills.some(jobSkill => 
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      // Featured filter
      if (filters.featured) {
        filtered = filtered.filter(job => job.featured);
      }

      // Tab-based filtering
      if (activeTab !== 'all') {
        if (activeTab === 'featured') {
          filtered = filtered.filter(job => job.featured);
        } else if (activeTab === 'recent') {
          filtered = filtered.sort((a, b) => b.created - a.created).slice(0, 10);
        } else if (activeTab === 'urgent') {
          filtered = filtered.filter(job => job.urgency === 'High' || job.urgency === 'Critical');
        }
      }

      setFilteredJobs(filtered);
    };
  }, [jobs, searchQuery, filters, activeTab]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleJobClick = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getJobStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'Active').length;
    const featuredJobs = jobs.filter(job => job.featured).length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);

    return { totalJobs, activeJobs, featuredJobs, totalApplications };
  };

  const stats = getJobStats();

  if (selectedJob) {
    return (
      <JobDetails 
        job={selectedJob} 
        onBack={() => setSelectedJob(null)}
        onApply={() => {
          // Handle application - will implement in ApplicationForm component
          console.log('Apply to job:', selectedJob.id);
        }}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Discover jobs and contribute to the Urgam Valley solar project
          </p>
        </div>
        {isAuthenticated && (
          <Button className="lg:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.activeJobs}</p>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.featuredJobs}</p>
                <p className="text-xs text-muted-foreground">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">Fill Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, skills, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {(Object.keys(filters).length > 0 || searchQuery) && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category?.map(cat => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {JOB_CATEGORIES.find(c => c.value === cat)?.icon} {cat}
            </Badge>
          ))}
          {filters.location?.map(loc => (
            <Badge key={loc} variant="secondary">
              <MapPin className="h-3 w-3 mr-1" />
              {loc}
            </Badge>
          ))}
          {filters.experienceLevel?.map(level => (
            <Badge key={level} variant="secondary">
              {level} Level
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <JobFiltersPanel 
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>
        )}

        {/* Job Listings */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms to find more opportunities.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => handleJobClick(job)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}