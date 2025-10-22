'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useInvalidateQueries, useRewardsSources, useRewardsSummary } from '@/hooks/useQuery';
import { formatOWP } from '@/lib/format';

export function RewardsSummary() {
  const {
    data: rewardsSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useRewardsSummary();
  const {
    data: rewardsSources,
    isLoading: sourcesLoading,
    error: sourcesError,
  } = useRewardsSources();
  const { invalidateRewards } = useInvalidateQueries();
  const handleRetry = () => invalidateRewards();
  const isLoading = summaryLoading || sourcesLoading;
  const error = summaryError || sourcesError;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading rewards data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-200 rounded dark:bg-gray-700' />
            <div className='h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-red-500 text-sm'>
            Failed to load rewards data: {(error as Error).message}
          </p>
          <Button size='sm' variant='outline' onClick={handleRetry} disabled={isLoading}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!rewardsSummary || !rewardsSources) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>No rewards data available.</p>
          <Button size='sm' variant='outline' onClick={handleRetry}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { totalEarned, thisMonth, lastMonth, projected } = rewardsSummary;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Rewards Summary</CardTitle>
          <CardDescription>Your OWP token earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-baseline gap-2'>
              <div className='text-3xl font-bold'>
                {formatOWP(totalEarned, { decimals: 2, withFiat: true })}
              </div>
              <Badge variant='outline'>All Time</Badge>
              <Button size='sm' variant='ghost' onClick={handleRetry} disabled={isLoading}>
                Refresh
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>This Month</p>
                <p className='text-lg font-medium'>{formatOWP(thisMonth)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Last Month</p>
                <p className='text-lg font-medium'>{formatOWP(lastMonth)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rewards by Source</CardTitle>
          <CardDescription>Breakdown of your OWP earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {rewardsSources.map((source) => (
              <div key={source.name}>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm'>{source.name}</span>
                  <span className='text-sm font-medium'>
                    {formatOWP(source.amount)} ({source.percentage}%)
                  </span>
                </div>
                <Progress value={source.percentage} className='h-2' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Projection</CardTitle>
          <CardDescription>Expected earnings for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-baseline gap-2'>
            <div className='text-2xl font-bold'>
              {formatOWP(projected, { decimals: 2, withFiat: true })}
            </div>
            <Badge variant='secondary'>Projected</Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-2'>
            Based on current activity and performance
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
