'use client';

import { useAuthContext } from '@/hooks/useAuthContext';
import { CURRENCIES, JOB_CATEGORIES, JobPosting } from '@/types/jobs';
import { useState } from 'react';

interface JobDetailsProps {
  job: JobPosting;
  onBack: () => void;
  onApply: () => void;
  className?: string;
}

export default function JobDetails({ job, onBack, onApply, className }: JobDetailsProps) {
  const { user } = useAuthContext();
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

}
