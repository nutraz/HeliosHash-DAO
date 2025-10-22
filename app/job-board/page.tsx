'use client';

import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Input } from '../../src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select';

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Blockchain Developer',
    location: 'Gujarat',
    type: 'Full-time',
    category: 'Technical',
    description: 'Develop smart contracts for solar projects',
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Solar Technician',
    location: 'Urgam Valley',
    type: 'Contract',
    category: 'Field',
    description: 'Install and maintain solar panels',
    posted: '1 week ago'
  },
  {
    id: 3,
    title: 'Community Coordinator',
    location: 'Dharampur',
    type: 'Part-time',
    category: 'Community',
    description: 'Engage with local communities',
    posted: '3 days ago'
  }
];

export default function JobBoardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      if (sortBy === 'recent') return b.id - a.id;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchQuery, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Job Board & Opportunities</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-testid="job-stats-cards">
        <Card data-testid="job-stat-total">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{MOCK_JOBS.length}</p>
          </CardContent>
        </Card>
        <Card data-testid="job-stat-active">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card data-testid="job-stat-categories">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1" data-testid="job-search-input">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48" data-testid="job-sort-select">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleRefresh}
          variant="outline"
          data-testid="job-refresh-button"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button onClick={handleClearFilters} variant="ghost">
          Clear Filters
        </Button>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600 mb-4" data-testid="job-showing-count">
        Showing {filteredJobs.length} of {MOCK_JOBS.length} opportunities
      </p>

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} data-testid="job-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{job.location} • {job.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {job.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{job.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Posted {job.posted}</p>
                  <Button size="sm">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card data-testid="job-empty-state">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No opportunities found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
