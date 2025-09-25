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
  Briefcase, 
  Users, 
  TrendingUp, 
  Star,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { JobPosting, JobFilters, JobCategory } from '@/types/jobs';

// Enhanced mock data for comprehensive testing
const MOCK_JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Solar Panel Installation Technician',
    description: 'Lead our solar installation team across multiple villages in the Urgam Valley. This role involves managing installations, training local technicians, and ensuring quality standards. Perfect opportunity for experienced professionals to make a direct impact on rural communities while working with cutting-edge renewable energy technology.',
    category: 'Engineering',
    location: { type: 'OnSite', location: 'Urgam Valley, Gujarat' },
    compensation: { amount: 35000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Minimum 3 years solar installation experience',
      'Electrical certification required',
      'Team leadership experience',
      'Fluency in Gujarati and Hindi',
      'Valid driving license'
    ],
    skills: ['Solar Panel Installation', 'Electrical Wiring', 'Team Management', 'Safety Protocols', 'Quality Control'],
    poster: 'dao-admin',
    posterName: 'HeliosHash DAO',
    status: 'Active',
    created: Date.now() - 86400000,
    deadline: Date.now() + 604800000,
    applicants: [],
    applicationCount: 12,
    featured: true,
    urgency: 'High',
    experienceLevel: 'Entry',
    workType: 'FullTime'
  }
];

export default function JobBoard() {
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let filtered = jobs.filter(job => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      return true;
    });

    setFilteredJobs(filtered);
  }, [jobs, filters, searchQuery]);

  const stats = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter(job => job.status === 'Active').length,
    applications: jobs.reduce((sum, job) => sum + job.applicationCount, 0),
    featured: jobs.filter(job => job.featured).length
  }), [jobs]);

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleJobSubmitted = (formData: any) => {
    const newJob: JobPosting = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: { type: formData.locationType, location: formData.locationName },
      compensation: formData.compensation,
      requirements: formData.requirements || [],
      skills: formData.skills || [],
      poster: user?.id || 'anonymous',
      posterName: user?.name || 'Anonymous',
      status: 'Active',
      created: Date.now(),
      applicants: [],
      applicationCount: 0,
      experienceLevel: formData.experienceLevel || 'Entry',
      workType: formData.workType || 'FullTime'
    };

    setJobs(prev => [newJob, ...prev]);
    setShowPostForm(false);
    setActiveTab('browse');
  };

  if (selectedJob) {
    return (
      <JobDetails 
        job={selectedJob} 
        onBack={() => setSelectedJob(null)}
        onApply={() => console.log('Apply to job')}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Community Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover solar energy jobs and contribute to DAO projects
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, value: stats.total, label: 'Total Jobs', color: 'blue' },
            { icon: Star, value: stats.active, label: 'Active Jobs', color: 'green' },
            { icon: Users, value: stats.applications, label: 'Applications', color: 'purple' },
            { icon: TrendingUp, value: stats.featured, label: 'Featured', color: 'orange' }
          ].map((stat, index) => (
            <Card key={index} className={`border-${stat.color}-200 shadow-lg`}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 mx-auto mb-2`} />
                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 bg-white shadow-lg">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {isAuthenticated && (
                <Button onClick={() => setShowPostForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {showFilters && (
                <div className="lg:w-80 flex-shrink-0">
                  <JobFiltersPanel 
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
              )}

              <div className="flex-1 space-y-4">
                {filteredJobs.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onClick={() => handleJobSelect(job)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({});
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-jobs">
            <Card className="p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">My Applications</h3>
              <p className="text-gray-600 mb-4">Track your applications here.</p>
              <Badge variant="secondary">Coming Soon</Badge>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}