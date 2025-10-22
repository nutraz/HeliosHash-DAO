'use client';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/format';

interface ProfileMiningRewardsProps {
  dailyOWP?: number;
  monthlyOWP?: number;
}

/**
 * ProfileMiningRewards
 * Lightweight placeholder component to host mining rewards summary now that it is
 * removed from the dashboard. Future enhancement: fetch real aggregated mining rewards
 * via a dedicated service hook.
 */
export function ProfileMiningRewards({
  dailyOWP = 452.3,
  monthlyOWP = dailyOWP * 30,
}: ProfileMiningRewardsProps) {
  return (
    <Card className='p-6 space-y-4'>
      <div>
        <h3 className='text-lg font-semibold'>Mining Rewards</h3>
        <p className='text-sm text-muted-foreground'>
          Summary of mining-derived OWP token earnings.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-4 text-center'>
        <div className='rounded-lg bg-muted/40 p-4'>
          <p className='text-2xl font-bold'>{formatNumber(dailyOWP)} OWP</p>
          <p className='text-xs text-muted-foreground mt-1'>Daily</p>
        </div>
        <div className='rounded-lg bg-muted/40 p-4'>
          <p className='text-2xl font-bold'>{formatNumber(monthlyOWP)} OWP</p>
          <p className='text-xs text-muted-foreground mt-1'>Projected Monthly</p>
        </div>
      </div>
      <div className='pt-2 text-xs text-muted-foreground'>
        Values are illustrative. Replace with live calculations once mining reward API is available.
      </div>
    </Card>
  );
}
