'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { CURRENCIES, JOB_CATEGORIES, JobPosting } from '@/types/jobs';
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Users,
} from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  onClick: () => void;
  className?: string;
}

export default function JobCard({ job, onClick, className }: JobCardProps) {
  const category = JOB_CATEGORIES.find((cat) => cat.value === job.category);
  const currency = CURRENCIES.find((curr) => curr.value === job.compensation.currency);

  const formatCompensation = () => {
    const { amount, currency: curr, paymentType, minAmount, maxAmount } = job.compensation;
    const supported = ['INR', 'USD', 'EUR', 'ICP', 'BTC'] as const;
    const normalize = (c: string) => (supported.includes(c as any) ? c : 'INR');
    const currNorm = normalize(curr);
    const formatter = (val: number) => formatCurrency(val, currNorm as any, { decimals: 0 });
    if (minAmount && maxAmount)
      return `${formatter(minAmount)} - ${formatter(maxAmount)} /${paymentType.toLowerCase()}`;
    if (minAmount) return `${formatter(minAmount)}+ /${paymentType.toLowerCase()}`;
    return `${formatter(amount)} /${paymentType.toLowerCase()}`;
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getDeadlineStatus = () => {
    if (!job.deadline) return null;

    const now = Date.now();
    const timeLeft = job.deadline - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { text: 'Expired', variant: 'destructive' as const };
    if (daysLeft === 0) return { text: 'Today', variant: 'destructive' as const };
    if (daysLeft === 1) return { text: '1 day left', variant: 'secondary' as const };
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, variant: 'secondary' as const };
    return { text: `${daysLeft} days left`, variant: 'outline' as const };
  };

  const getUrgencyColor = () => {
    switch (job.urgency) {
      case 'Critical':
        return 'text-red-500';
      case 'High':
        return 'text-orange-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const deadline = getDeadlineStatus();

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
        job.featured
          ? 'border-l-primary bg-gradient-to-r from-primary/5 to-transparent'
          : 'border-l-transparent hover:border-l-primary/50'
      } ${className}`}
      onClick={onClick}
      data-testid='job-card'
    >
      <CardContent className='p-6'>
        <div className='space-y-4'>
          {/* Header */}
          <div className='flex items-start justify-between'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-2'>
                {job.featured && <Star className='h-4 w-4 text-yellow-500 fill-current' />}
                <h3 className='text-lg font-semibold truncate group-hover:text-primary transition-colors'>
                  {job.title}
                </h3>
                {job.urgency && job.urgency !== 'Low' && (
                  <AlertCircle className={`h-4 w-4 ${getUrgencyColor()}`} />
                )}
              </div>

              <div className='flex items-center gap-4 text-sm text-muted-foreground mb-3'>
                <div className='flex items-center gap-1'>
                  <Briefcase className='h-3 w-3' />
                  {job.posterName || 'Anonymous'}
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  {getTimeAgo(job.created)}
                </div>
                {deadline && (
                  <Badge variant={deadline.variant} className='text-xs'>
                    <Calendar className='h-3 w-3 mr-1' />
                    {deadline.text}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
            {job.description}
          </p>

          {/* Job Details */}
          <div className='flex flex-wrap items-center gap-3 text-sm'>
            <div className='flex items-center gap-1 text-primary font-medium'>
              <span className='text-lg'>{category?.icon}</span>
              {job.category}
            </div>

            <div className='flex items-center gap-1 text-muted-foreground'>
              <MapPin className='h-4 w-4' />
              {job.location.type === 'OnSite'
                ? job.location.location
                : job.location.type === 'Remote'
                  ? 'Remote'
                  : `Hybrid • ${job.location.location}`}
            </div>

            <div className='flex items-center gap-1 text-green-600 font-medium'>
              <DollarSign className='h-4 w-4' />
              {formatCompensation()}
            </div>

            {job.workType && (
              <Badge variant='outline' className='text-xs'>
                {job.workType.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            )}

            {job.experienceLevel && (
              <Badge variant='outline' className='text-xs'>
                {job.experienceLevel} Level
              </Badge>
            )}
          </div>

          {/* Skills */}
          {job.skills.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {job.skills.slice(0, 5).map((skill, index) => (
                <Badge key={skill} variant='secondary' className='text-xs'>
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant='outline' className='text-xs'>
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className='flex items-center justify-between pt-2 border-t'>
            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Users className='h-3 w-3' />
                {job.applicationCount || 0} applicants
              </div>

              {job.urgency && (
                <div className='flex items-center gap-1'>
                  <AlertCircle className={`h-3 w-3 ${getUrgencyColor()}`} />
                  {job.urgency} Priority
                </div>
              )}
            </div>

            <div className='flex items-center gap-2'>
              {job.benefits && job.benefits.length > 0 && (
                <Badge variant='outline' className='text-xs'>
                  +{job.benefits.length} benefits
                </Badge>
              )}

              <Button
                size='sm'
                className='opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
