'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuthContext';
import { validationSessionService } from '@/services/validationSessionService';
import { ValidationSession } from '@/types/validation';
import {
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  RefreshCw,
  Star,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ValidationSessionCard } from './ValidationSessionCard';

export function ValidationSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ValidationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    duoSessions: 0,
    soloSessions: 0,
    totalOWPEarned: 0,
    averageRating: 0,
    partnerSessions: 0,
  });
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (user) {
      loadUserSessions();
      loadUserStats();
    }
  }, [user]);

  const loadUserSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userSessions = await validationSessionService.getUserValidationSessions(user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load validation sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const userStats = await validationSessionService.getUserValidationStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load validation stats:', error);
    }
  };

  const handleSessionUpdate = () => {
    // Refresh sessions and stats when a session is updated
    loadUserSessions();
    loadUserStats();
  };

  const getFilteredSessions = (filter: string): ValidationSession[] => {
    switch (filter) {
      case 'active':
        return sessions.filter((s) => s.status === 'Scheduled' || s.status === 'InProgress');
      case 'completed':
        return sessions.filter((s) => s.status === 'Completed');
      case 'duo':
        return sessions.filter((s) => s.sessionType === 'duo');
      case 'solo':
        return sessions.filter((s) => s.sessionType === 'solo');
      default:
        return sessions;
    }
  };

  const getTabCount = (filter: string): number => {
    return getFilteredSessions(filter).length;
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <RefreshCw className='w-8 h-8 animate-spin text-blue-400 mx-auto mb-4' />
          <div className='text-gray-400'>Loading your validation sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <CheckCircle className='w-8 h-8 text-green-400' />
              <div>
                <div className='text-2xl font-bold text-white'>{stats.completedSessions}</div>
                <div className='text-sm text-gray-400'>Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Users className='w-8 h-8 text-green-400' />
              <div>
                <div className='text-2xl font-bold text-white'>{stats.duoSessions}</div>
                <div className='text-sm text-gray-400'>Duo Validations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Coins className='w-8 h-8 text-yellow-400' />
              <div>
                <div className='text-2xl font-bold text-white'>{stats.totalOWPEarned}</div>
                <div className='text-sm text-gray-400'>OWP Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Star className='w-8 h-8 text-yellow-400' />
              <div>
                <div className='text-2xl font-bold text-white'>
                  {stats.averageRating > 0 ? stats.averageRating : '-'}
                </div>
                <div className='text-sm text-gray-400'>Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {stats.totalSessions > 0 && (
        <Card className='bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <TrendingUp className='w-6 h-6 text-green-400' />
                <div>
                  <div className='font-semibold text-white'>Validation Performance</div>
                  <div className='text-sm text-gray-300'>
                    {Math.round((stats.completedSessions / stats.totalSessions) * 100)}% completion
                    rate •{Math.round((stats.duoSessions / stats.totalSessions) * 100)}% duo
                    validations
                  </div>
                </div>
              </div>

              <div className='text-right'>
                <div className='text-2xl font-bold text-green-400'>
                  {stats.totalOWPEarned > 0 ? `+${stats.totalOWPEarned}` : '0'} OWP
                </div>
                <div className='text-sm text-gray-400'>Total earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2 md:grid-cols-4 bg-gray-800 border-gray-700'>
          <TabsTrigger
            value='active'
            className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'
          >
            <Clock className='w-4 h-4 mr-1' />
            Active ({getTabCount('active')})
          </TabsTrigger>

          <TabsTrigger
            value='completed'
            className='data-[state=active]:bg-green-600 data-[state=active]:text-white'
          >
            <CheckCircle className='w-4 h-4 mr-1' />
            Completed ({getTabCount('completed')})
          </TabsTrigger>

          <TabsTrigger
            value='duo'
            className='data-[state=active]:bg-purple-600 data-[state=active]:text-white'
          >
            <Users className='w-4 h-4 mr-1' />
            Duo ({getTabCount('duo')})
          </TabsTrigger>

          <TabsTrigger
            value='solo'
            className='data-[state=active]:bg-indigo-600 data-[state=active]:text-white'
          >
            <User className='w-4 h-4 mr-1' />
            Solo ({getTabCount('solo')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='mt-6'>
          {getFilteredSessions(activeTab).length > 0 ? (
            <div className='grid gap-6'>
              {getFilteredSessions(activeTab).map((session) => (
                <ValidationSessionCard
                  key={session.id}
                  session={session}
                  onSessionUpdate={handleSessionUpdate}
                />
              ))}
            </div>
          ) : (
            <Card className='bg-gray-800/50 border-gray-700'>
              <CardContent className='p-8 text-center'>
                <div className='text-gray-400 mb-4'>
                  {activeTab === 'active' && 'No active validation sessions'}
                  {activeTab === 'completed' && 'No completed validation sessions'}
                  {activeTab === 'duo' && 'No duo validation sessions'}
                  {activeTab === 'solo' && 'No solo validation sessions'}
                </div>
                <div className='text-sm text-gray-500'>
                  {activeTab === 'active'
                    ? 'Apply for validation opportunities to see sessions here'
                    : 'Complete some validations to build your track record'}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white'>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            <Button
              variant='outline'
              onClick={handleSessionUpdate}
              className='border-blue-500 text-blue-400 hover:bg-blue-500/20'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Refresh Sessions
            </Button>

            <Button
              variant='outline'
              onClick={() => {
                // Navigate to validation opportunities
                window.location.href = '/community#opportunities';
              }}
              className='border-green-500 text-green-400 hover:bg-green-500/20'
            >
              <Calendar className='w-4 h-4 mr-2' />
              Find New Validations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
