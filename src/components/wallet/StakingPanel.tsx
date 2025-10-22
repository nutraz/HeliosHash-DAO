import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useClaimRewardsMutation,
  useStakeMutation,
  useUnstakeMutation,
} from '@/hooks/useMutations';
import { useWalletBalance } from '@/hooks/useQuery';
import { formatOWP } from '@/lib/format';
import { useState } from 'react';

export function StakingPanel() {
  const { data: walletData, isLoading } = useWalletBalance();
  const stakeMutation = useStakeMutation();
  const unstakeMutation = useUnstakeMutation();
  const claimRewardsMutation = useClaimRewardsMutation();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (!isNaN(amount) && amount > 0) {
      stakeMutation.mutate(amount);
      setStakeAmount('');
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeAmount);
    if (!isNaN(amount) && amount > 0) {
      unstakeMutation.mutate(amount);
      setUnstakeAmount('');
    }
  };

  const handleClaimRewards = () => {
    claimRewardsMutation.mutate();
  };

  if (isLoading || !walletData) {
    return <div>Loading wallet data...</div>;
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Staking</CardTitle>
          <CardDescription>Stake your OWP tokens to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Available Balance</p>
                <p className='text-lg font-medium'>{formatOWP(walletData.balance)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Staked Amount</p>
                <p className='text-lg font-medium'>{formatOWP(walletData.stakedAmount)}</p>
              </div>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Pending Rewards</p>
              <div className='flex items-center gap-2'>
                <p className='text-lg font-medium'>{formatOWP(walletData.pendingRewards)}</p>
                <Button
                  onClick={handleClaimRewards}
                  disabled={claimRewardsMutation.isPending || walletData.pendingRewards <= 0}
                  size='sm'
                >
                  {claimRewardsMutation.isPending ? 'Claiming...' : 'Claim'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Stake Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='stake-amount'>Amount to Stake</Label>
                <Input
                  id='stake-amount'
                  type='number'
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder='0'
                  min='0'
                  max={walletData.balance.toString()}
                />
              </div>
              <Button
                onClick={handleStake}
                disabled={stakeMutation.isPending || !stakeAmount || parseFloat(stakeAmount) <= 0}
                className='w-full'
              >
                {stakeMutation.isPending ? 'Staking...' : 'Stake'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unstake Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='unstake-amount'>Amount to Unstake</Label>
                <Input
                  id='unstake-amount'
                  type='number'
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder='0'
                  min='0'
                  max={walletData.stakedAmount.toString()}
                />
              </div>
              <Button
                onClick={handleUnstake}
                disabled={
                  unstakeMutation.isPending || !unstakeAmount || parseFloat(unstakeAmount) <= 0
                }
                className='w-full'
              >
                {unstakeMutation.isPending ? 'Unstaking...' : 'Unstake'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {stakeMutation.isError && (
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <p className='text-red-700'>
              Staking failed: {(stakeMutation.error as Error)?.message}
            </p>
          </CardContent>
        </Card>
      )}

      {unstakeMutation.isError && (
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <p className='text-red-700'>
              Unstaking failed: {(unstakeMutation.error as Error)?.message}
            </p>
          </CardContent>
        </Card>
      )}

      {claimRewardsMutation.isError && (
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <p className='text-red-700'>
              Claiming rewards failed: {(claimRewardsMutation.error as Error)?.message}
            </p>
          </CardContent>
        </Card>
      )}

      {stakeMutation.isSuccess && (
        <Card className='border-green-200 bg-green-50'>
          <CardContent className='pt-6'>
            <p className='text-green-700'>Successfully staked tokens!</p>
          </CardContent>
        </Card>
      )}

      {unstakeMutation.isSuccess && (
        <Card className='border-green-200 bg-green-50'>
          <CardContent className='pt-6'>
            <p className='text-green-700'>Successfully unstaked tokens!</p>
          </CardContent>
        </Card>
      )}

      {claimRewardsMutation.isSuccess && (
        <Card className='border-green-200 bg-green-50'>
          <CardContent className='pt-6'>
            <p className='text-green-700'>Successfully claimed rewards!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
