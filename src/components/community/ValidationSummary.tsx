'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuthContext';
import { validationService } from '@/services/validationService';
import { AlertTriangle, ArrowRight, CheckCircle, User, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ValidationSummaryProps {
  onViewAll?: () => void;
}

export function ValidationSummary({ onViewAll }: ValidationSummaryProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    duoOpportunities: 0,
    partnerNeeded: 0,
    highPriority: 0,
    averageReward: 0,
    averageDuoReward: 0,
  });
  const [loading, setLoading] = useState(true);

  const userPrefersDuo = user?.prefersDuoValidation || false;

  useEffect(() => {
    loadStats();
  }, [userPrefersDuo]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const validationStats = await validationService.getValidationStats(userPrefersDuo);
      setStats(validationStats);
    } catch (error) {
      console.error('Failed to load validation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardContent className='p-6'>
          <div className='animate-pulse space-y-3'>
            <div className='h-4 bg-gray-700 rounded w-1/2'></div>
            <div className='h-8 bg-gray-700 rounded w-1/3'></div>
            <div className='h-3 bg-gray-700 rounded w-3/4'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 hover:border-blue-500/50 transition-all'>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='p-2 bg-blue-500/20 rounded-lg'>
                <CheckCircle className='w-5 h-5 text-blue-400' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>Solar Validations</h3>
                <p className='text-sm text-gray-400'>Earn OWP by validating projects</p>
              </div>
            </div>
            {userPrefersDuo && stats.partnerNeeded > 0 && (
              <Badge variant='outline' className='text-green-400 border-green-500 animate-pulse'>
                {stats.partnerNeeded} Need Partners
              </Badge>
            )}
          </div>

          {/* Key Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>{stats.totalOpportunities}</div>
              <div className='text-xs text-gray-400'>Available</div>
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold text-green-400'>{stats.duoOpportunities}</div>
              <div className='text-xs text-gray-400'>Duo Options</div>
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold text-yellow-400'>
                {Math.round(stats.averageReward)}
              </div>
              <div className='text-xs text-gray-400'>Avg OWP</div>
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-400'>{stats.highPriority}</div>
              <div className='text-xs text-gray-400'>Urgent</div>
            </div>
          </div>

          {/* User-specific recommendations */}
          <div className='space-y-2'>
            {userPrefersDuo ? (
              <div className='flex items-center gap-2 text-sm'>
                <Users className='w-4 h-4 text-green-400' />
                <span className='text-gray-300'>
                  <span className='text-green-400 font-semibold'>{stats.duoOpportunities}</span> duo
                  validations available
                </span>
                {stats.averageDuoReward > stats.averageReward && (
                  <Badge variant='outline' className='text-green-400 border-green-500 text-xs'>
                    +{Math.round(stats.averageDuoReward - stats.averageReward)} OWP bonus
                  </Badge>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-2 text-sm'>
                <User className='w-4 h-4 text-blue-400' />
                <span className='text-gray-300'>
                  <span className='text-blue-400 font-semibold'>{stats.totalOpportunities}</span>{' '}
                  solo validations ready
                </span>
              </div>
            )}

            {stats.partnerNeeded > 0 && (
              <div className='flex items-center gap-2 text-sm'>
                <AlertTriangle className='w-4 h-4 text-yellow-400' />
                <span className='text-gray-300'>
                  <span className='text-yellow-400 font-semibold'>{stats.partnerNeeded}</span>{' '}
                  validation{stats.partnerNeeded > 1 ? 's' : ''} need partners
                </span>
                {userPrefersDuo && (
                  <Badge variant='outline' className='text-yellow-400 border-yellow-500 text-xs'>
                    Great match!
                  </Badge>
                )}
              </div>
            )}

            {stats.highPriority > 0 && (
              <div className='flex items-center gap-2 text-sm'>
                <Zap className='w-4 h-4 text-red-400' />
                <span className='text-gray-300'>
                  <span className='text-red-400 font-semibold'>{stats.highPriority}</span>{' '}
                  high-priority validation{stats.highPriority > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white' onClick={onViewAll}>
            <span className='flex items-center gap-2'>
              View All Validations
              <ArrowRight className='w-4 h-4' />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
