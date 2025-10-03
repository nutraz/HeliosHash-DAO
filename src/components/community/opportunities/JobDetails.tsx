'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuthContext';
import { CURRENCIES, JOB_CATEGORIES, JobPosting } from '@/types/jobs';
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Send,
  Share2,
  Star,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface JobDetailsProps {
  job: JobPosting;
  onBack: () => void;
  onApply: () => void;
  className?: string;
}

export default function JobDetails({ job, onBack, onApply, className }: JobDetailsProps) {
  const { user, isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const category = JOB_CATEGORIES.find((cat) => cat.value === job.category);
  const currency = CURRENCIES.find((curr) => curr.value === job.compensation.currency);

  const formatCompensation = () => {
    const { amount, currency: curr, paymentType } = job.compensation;
    const symbol = currency?.symbol || curr;

    if (job.compensation.minAmount && job.compensation.maxAmount) {
      return `${symbol}${job.compensation.minAmount.toLocaleString()} - ${symbol}${amount.toLocaleString()} per ${paymentType.toLowerCase()}`;
    }

    return `${symbol}${amount.toLocaleString()} per ${paymentType.toLowerCase()}`;
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `Posted ${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Posted just now';
  };

  const getDeadlineText = () => {
    if (!job.deadline) return null;

    const now = Date.now();
    const timeLeft = job.deadline - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'Application deadline has passed';
    if (daysLeft === 0) return 'Application deadline is today';
    if (daysLeft === 1) return 'Application deadline is tomorrow';
    return `Application deadline in ${daysLeft} days`;
  };

  const getUrgencyColor = () => {
    switch (job.urgency) {
      case 'Critical':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-muted-foreground bg-muted/50 border-muted';
    }
  };

  const canApply = () => {
    if (!isAuthenticated) return false;
    if (!job.deadline) return job.status === 'Active';
    return job.status === 'Active' && Date.now() < job.deadline;
  };

  const hasUserApplied = () => {
    return user && job.applicants.includes(user.id);
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='sm' onClick={onBack}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Jobs
        </Button>
        <div className='flex items-center gap-2 ml-auto'>
          <Button variant='outline' size='sm' onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
          <Button variant='outline' size='sm'>
            <Share2 className='h-4 w-4 mr-2' />
            Share
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-2'>
                    {job.featured && <Star className='h-5 w-5 text-yellow-500 fill-current' />}
                    <CardTitle className='text-2xl'>{job.title}</CardTitle>
                  </div>

                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      {job.companyInfo?.logo ? (
                        <Avatar className='h-6 w-6'>
                          <AvatarImage src={job.companyInfo.logo} />
                          <AvatarFallback>{job.posterName?.charAt(0) || 'C'}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Building className='h-4 w-4' />
                      )}
                      {job.posterName || 'Anonymous Employer'}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='h-4 w-4' />
                      {getTimeAgo(job.created)}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4' />
                      {job.applicationCount || 0} applicants
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Key Details */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{category?.icon}</span>
                  <div>
                    <p className='text-sm text-muted-foreground'>Category</p>
                    <p className='font-medium'>{job.category}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Location</p>
                    <p className='font-medium'>
                      {job.location.type === 'OnSite'
                        ? job.location.location
                        : job.location.type === 'Remote'
                        ? 'Remote'
                        : `Hybrid`}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <DollarSign className='h-4 w-4 text-green-600' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Compensation</p>
                    <p className='font-medium text-green-600'>{formatCompensation()}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Briefcase className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Type</p>
                    <p className='font-medium'>
                      {job.workType?.replace(/([A-Z])/g, ' $1').trim() || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className='flex flex-wrap gap-2 mb-6'>
                {job.experienceLevel && (
                  <Badge variant='outline'>{job.experienceLevel} Level</Badge>
                )}

                {job.urgency && job.urgency !== 'Low' && (
                  <Badge className={getUrgencyColor()}>
                    <AlertCircle className='h-3 w-3 mr-1' />
                    {job.urgency} Priority
                  </Badge>
                )}

                {job.deadline && (
                  <Badge variant='outline'>
                    <Calendar className='h-3 w-3 mr-1' />
                    {getDeadlineText()}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className='text-lg font-semibold mb-3'>Job Description</h3>
                <div className='prose prose-sm max-w-none'>
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className='mb-3 leading-relaxed'>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3'>
                {job.requirements.map((requirement, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Skills & Benefits */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant='secondary'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {job.benefits && job.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className='flex items-center gap-2 text-sm'>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Company Info */}
          {job.companyInfo && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>About {job.companyInfo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mb-4'>{job.companyInfo.description}</p>
                {job.companyInfo.website && (
                  <Button variant='outline' size='sm'>
                    <Globe className='h-4 w-4 mr-2' />
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Application Status */}
          <Card>
            <CardContent className='p-6'>
              {!isAuthenticated ? (
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Please sign in to apply for this position
                  </p>
                  <Button className='w-full'>Sign In to Apply</Button>
                </div>
              ) : hasUserApplied() ? (
                <div className='text-center'>
                  <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-3' />
                  <p className='font-medium text-green-600 mb-2'>Application Submitted</p>
                  <p className='text-sm text-muted-foreground'>Your application is under review</p>
                </div>
              ) : !canApply() ? (
                <div className='text-center'>
                  <XCircle className='h-12 w-12 text-red-500 mx-auto mb-3' />
                  <p className='font-medium text-red-600 mb-2'>Applications Closed</p>
                  <p className='text-sm text-muted-foreground'>
                    The deadline for this position has passed
                  </p>
                </div>
              ) : (
                <div className='text-center'>
                  <Button className='w-full mb-3' size='lg' onClick={onApply}>
                    <Send className='h-4 w-4 mr-2' />
                    Apply Now
                  </Button>
                  <p className='text-xs text-muted-foreground'>
                    Complete your profile to improve your application
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Application Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>Total Applicants</span>
                  <span className='font-medium'>{job.applicationCount || 0}</span>
                </div>

                <Separator />

                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>Job Status</span>
                  <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>

                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>Experience Level</span>
                  <span className='font-medium text-sm'>{job.experienceLevel || 'Any'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Find more opportunities in {job.category}
              </p>
              <Button variant='outline' className='w-full mt-3' size='sm'>
                Browse {job.category} Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
