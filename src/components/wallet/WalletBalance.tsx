'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWalletBalance } from '@/hooks/useQuery';
import { formatINR, formatOWP } from '@/lib/format';

export function WalletBalance() {
  const { data, isLoading, error, refetch } = useWalletBalance();

  // Derive fields safely
  const balance = data?.balance ?? 0;
  const pendingRewards = data?.pendingRewards ?? 0;
  const stakedAmount = data?.stakedAmount ?? 0;
  const fiatValue = data?.fiatValue ?? 0;
  const transactions = data?.transactions ?? 0;

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Loading wallet data...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 bg-gray-200 rounded dark:bg-gray-700' />
              <div className='grid grid-cols-2 gap-4'>
                <div className='h-6 bg-gray-200 rounded dark:bg-gray-700' />
                <div className='h-6 bg-gray-200 rounded dark:bg-gray-700' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Wallet data unavailable</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-red-500'>{(error as Error).message}</p>
            <Button size='sm' variant='outline' onClick={() => refetch()} disabled={isLoading}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>Your OWP token holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-baseline gap-2'>
              <div className='text-3xl font-bold'>
                {formatOWP(balance, { decimals: 2, withFiat: true })}
              </div>
              <Badge variant='secondary'>Primary</Badge>
              <Button size='sm' variant='ghost' onClick={() => refetch()} disabled={isLoading}>
                Refresh
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Pending Rewards</p>
                <p className='text-lg font-medium'>{formatOWP(pendingRewards)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Staked Amount</p>
                <p className='text-lg font-medium'>{formatOWP(stakedAmount)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Overview of recent token activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm'>Total Transactions</span>
              <span className='text-sm font-medium'>{transactions}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm'>Fiat Equivalent</span>
              <span className='text-sm font-medium'>{formatINR(fiatValue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
