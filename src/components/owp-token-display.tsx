'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OWPTokenBalance, OWP_TOKEN_SYMBOL } from '@/types/owp-token';
import { Coins, TrendingUp, Users, Zap } from 'lucide-react';
import React from 'react';

interface OWPTokenDisplayProps {
  balance: OWPTokenBalance;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const OWPTokenDisplay: React.FC<OWPTokenDisplayProps> = ({
  balance,
  size = 'md',
  showDetails = true,
  className = '',
}) => {
  const totalBalance = balance.balance + balance.lockedBalance;

  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`;
    return amount.toFixed(2);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}>
        <Coins className={`text-orange-500 ${iconSizes[size]}`} />
        <span className='font-bold text-orange-400'>
          {formatTokenAmount(balance.balance)} {OWP_TOKEN_SYMBOL}
        </span>
      </div>
    );
  }

  return (
    <Card
      className={`bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 dark:from-orange-950 dark:to-yellow-950 dark:border-orange-800 ${className}`}
    >
      <CardContent className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <Coins className='h-6 w-6 text-orange-500' />
            <h3 className='font-semibold text-orange-900 dark:text-orange-100'>
              OWP Token Balance
            </h3>
          </div>
          <Badge
            variant='secondary'
            className='bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
          >
            1WP Ecosystem
          </Badge>
        </div>

        <div className='space-y-3'>
          {/* Main Balance */}
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600 dark:text-gray-400'>Available Balance</span>
            <span className='text-lg font-bold text-orange-600 dark:text-orange-400'>
              {formatTokenAmount(balance.balance)} {OWP_TOKEN_SYMBOL}
            </span>
          </div>

          {/* Locked Balance */}
          {balance.lockedBalance > 0 && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Staked/Locked</span>
              <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                {formatTokenAmount(balance.lockedBalance)} {OWP_TOKEN_SYMBOL}
              </span>
            </div>
          )}

          {/* Rewards Breakdown */}
          <div className='pt-2 border-t border-orange-200 dark:border-orange-800'>
            <div className='grid grid-cols-3 gap-2 text-xs'>
              <div className='text-center'>
                <div className='flex items-center justify-center gap-1 mb-1'>
                  <Zap className='h-3 w-3 text-yellow-500' />
                  <span className='text-gray-600 dark:text-gray-400'>Mining</span>
                </div>
                <span className='font-medium text-yellow-600 dark:text-yellow-400'>
                  +{formatTokenAmount(balance.miningRewards)}
                </span>
              </div>

              <div className='text-center'>
                <div className='flex items-center justify-center gap-1 mb-1'>
                  <TrendingUp className='h-3 w-3 text-blue-500' />
                  <span className='text-gray-600 dark:text-gray-400'>Staking</span>
                </div>
                <span className='font-medium text-blue-600 dark:text-blue-400'>
                  +{formatTokenAmount(balance.stakingRewards)}
                </span>
              </div>

              <div className='text-center'>
                <div className='flex items-center justify-center gap-1 mb-1'>
                  <Users className='h-3 w-3 text-green-500' />
                  <span className='text-gray-600 dark:text-gray-400'>Community</span>
                </div>
                <span className='font-medium text-green-600 dark:text-green-400'>
                  +{formatTokenAmount(balance.communityRewards)}
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className='flex items-center justify-between pt-2 border-t border-orange-200 dark:border-orange-800'>
            <span className='font-medium text-gray-700 dark:text-gray-300'>Total OWP Tokens</span>
            <span className='text-xl font-bold text-orange-600 dark:text-orange-400'>
              {formatTokenAmount(totalBalance)} {OWP_TOKEN_SYMBOL}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compact token balance for navigation bars
export const OWPTokenNavDisplay: React.FC<{ balance: number }> = ({ balance }) => {
  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toFixed(1);
  };

  return (
    <div className='flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900 rounded-full'>
      <Coins className='h-4 w-4 text-orange-600 dark:text-orange-400' />
      <span className='text-sm font-semibold text-orange-700 dark:text-orange-300'>
        {formatTokenAmount(balance)} {OWP_TOKEN_SYMBOL}
      </span>
    </div>
  );
};
