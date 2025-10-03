'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OWPTransaction, OWP_TOKEN_SYMBOL } from '@/types/owp-token';
import { ArrowUpRight, Clock, ExternalLink, Sun, TrendingUp, Users, Vote, Zap } from 'lucide-react';
import React from 'react';

interface OWPTransactionHistoryProps {
  transactions: OWPTransaction[];
  className?: string;
}

export const OWPTransactionHistory: React.FC<OWPTransactionHistoryProps> = ({
  transactions,
  className = '',
}) => {
  const getTransactionIcon = (type: OWPTransaction['type']) => {
    switch (type) {
      case 'mining_reward':
        return <Zap className='h-4 w-4 text-yellow-500' />;
      case 'community_reward':
        return <Users className='h-4 w-4 text-green-500' />;
      case 'staking_reward':
        return <TrendingUp className='h-4 w-4 text-blue-500' />;
      case 'governance_vote':
        return <Vote className='h-4 w-4 text-purple-500' />;
      case 'solar_dividend':
        return <Sun className='h-4 w-4 text-orange-500' />;
      case 'transfer':
        return <ArrowUpRight className='h-4 w-4 text-gray-500' />;
      default:
        return <ArrowUpRight className='h-4 w-4 text-gray-500' />;
    }
  };

  const getTransactionColor = (type: OWPTransaction['type']) => {
    switch (type) {
      case 'mining_reward':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'community_reward':
        return 'text-green-600 dark:text-green-400';
      case 'staking_reward':
        return 'text-blue-600 dark:text-blue-400';
      case 'governance_vote':
        return 'text-purple-600 dark:text-purple-400';
      case 'solar_dividend':
        return 'text-orange-600 dark:text-orange-400';
      case 'transfer':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: OWPTransaction['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge
            variant='secondary'
            className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          >
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='secondary'
            className='bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          >
            Pending
          </Badge>
        );
      case 'failed':
        return <Badge variant='destructive'>Failed</Badge>;
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          OWP Token Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {transactions.length === 0 ? (
            <p className='text-center text-gray-500 dark:text-gray-400 py-4'>
              No transactions yet. Start earning OWP tokens through mining and community
              participation!
            </p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                <div className='flex items-center gap-3'>
                  {getTransactionIcon(tx.type)}
                  <div>
                    <p className='font-medium text-sm text-gray-900 dark:text-gray-100'>
                      {tx.description}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatRelativeTime(tx.timestamp)}
                      </span>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                </div>

                <div className='text-right'>
                  <p className={`font-bold text-sm ${getTransactionColor(tx.type)}`}>
                    +{tx.amount.toFixed(2)} {OWP_TOKEN_SYMBOL}
                  </p>
                  {tx.txHash && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-xs mt-1'
                      onClick={() => {
                        // Open blockchain explorer (placeholder)
                        console.log(`View transaction: ${tx.txHash}`);
                      }}
                    >
                      <ExternalLink className='h-3 w-3 mr-1' />
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {transactions.length > 5 && (
          <div className='mt-4 text-center'>
            <Button variant='outline' size='sm'>
              View All Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
