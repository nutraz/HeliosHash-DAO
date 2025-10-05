'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Award, BookOpen, Heart, Target, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

type GenderIdentity = 'Female' | 'Male' | 'NonBinary' | 'PreferNotToSay';

interface ParticipationStats {
  totalMembers: number;
  womenMembers: number;
  womenPercentage: number;
  quotaMet: boolean;
  mentorshipPrograms: number;
}

interface Member {
  id: string;
  joinedAt: bigint;
  contributionScore: number;
  gender?: GenderIdentity;
  isVerified: boolean;
  mentorshipStatus?: {
    isMentor: boolean;
    specialization: string;
  };
}

export function WomensParticipationDashboard() {
  const [stats, setStats] = useState<ParticipationStats>({
    totalMembers: 0,
    womenMembers: 0,
    womenPercentage: 0,
    quotaMet: false,
    mentorshipPrograms: 0,
  });
  const [selectedGender, setSelectedGender] = useState<GenderIdentity | ''>('');
  const [mentorshipData, setMentorshipData] = useState({
    specialization: '',
    isMentor: false,
  });
  const [quotaProposal, setQuotaProposal] = useState('33');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadParticipationStats();
  }, []);

  const loadParticipationStats = async () => {
    try {
      // TODO: Replace with actual canister calls when available
      const mockStats: ParticipationStats = {
        totalMembers: 45,
        womenMembers: 18,
        womenPercentage: 4000, // 40% in basis points
        quotaMet: true,
        mentorshipPrograms: 12,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load participation stats:', error);
    }
  };

  const handleGenderUpdate = async () => {
    if (!selectedGender) return;

    setLoading(true);
    try {
      // TODO: Replace with actual canister call
      // await daoActor.updateGenderIdentity({ [selectedGender]: null });
      console.log('Updated gender identity to:', selectedGender);

      // Show success message and refresh stats
      loadParticipationStats();
    } catch (error) {
      console.error('Failed to update gender identity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorshipRegistration = async () => {
    if (!mentorshipData.specialization.trim()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual canister call
      // await daoActor.registerMentorship(mentorshipData.specialization, mentorshipData.isMentor);
      console.log('Registered for mentorship:', mentorshipData);

      // Clear form and refresh stats
      setMentorshipData({ specialization: '', isMentor: false });
      loadParticipationStats();
    } catch (error) {
      console.error('Failed to register mentorship:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuotaProposal = async () => {
    const newQuotaBps = parseInt(quotaProposal) * 100; // Convert percentage to basis points

    setLoading(true);
    try {
      // TODO: Replace with actual canister call
      // await daoActor.proposeQuotaUpdate(newQuotaBps);
      console.log('Proposed quota update:', newQuotaBps);
    } catch (error) {
      console.error('Failed to propose quota update:', error);
    } finally {
      setLoading(false);
    }
  };

  const womenPercentageDisplay = (stats.womenPercentage / 100).toFixed(1);
  const quotaTarget = 33; // 33% target

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Heart className='h-8 w-8 text-pink-500' />
        <div>
          <h1 className='text-2xl font-bold'>Women's Participation Dashboard</h1>
          <p className='text-muted-foreground'>
            Empowering women's voices in solar energy governance
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Members</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Women Members</CardTitle>
            <Heart className='h-4 w-4 text-pink-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-pink-600'>{stats.womenMembers}</div>
            <p className='text-xs text-muted-foreground'>
              {womenPercentageDisplay}% of total membership
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Quota Status</CardTitle>
            <Target className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Badge variant={stats.quotaMet ? 'default' : 'destructive'}>
                {stats.quotaMet ? 'Met' : 'Not Met'}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>Target: {quotaTarget}% minimum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Mentorship Programs</CardTitle>
            <BookOpen className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.mentorshipPrograms}</div>
            <p className='text-xs text-muted-foreground'>Active programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Participation Progress */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Women's Participation Progress
          </CardTitle>
          <CardDescription>
            Track progress toward achieving gender balance in DAO governance
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Current: {womenPercentageDisplay}%</span>
              <span>Target: {quotaTarget}%</span>
            </div>
            <Progress
              value={parseFloat(womenPercentageDisplay)}
              max={quotaTarget}
              className='h-2'
            />
          </div>

          {!stats.quotaMet && (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
              <p className='text-sm text-amber-800'>
                <strong>Action Needed:</strong>{' '}
                {Math.ceil((quotaTarget * stats.totalMembers) / 100 - stats.womenMembers)} more
                women members needed to meet the {quotaTarget}% quota.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Gender Identity Registration */}
        <Card>
          <CardHeader>
            <CardTitle>Update Gender Identity</CardTitle>
            <CardDescription>
              Help us track diversity and ensure inclusive representation
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='gender-select'>Gender Identity</Label>
              <Select onValueChange={(value) => setSelectedGender(value as GenderIdentity)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select your gender identity' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Female'>Female</SelectItem>
                  <SelectItem value='Male'>Male</SelectItem>
                  <SelectItem value='NonBinary'>Non-Binary</SelectItem>
                  <SelectItem value='PreferNotToSay'>Prefer Not to Say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenderUpdate}
              disabled={!selectedGender || loading}
              className='w-full'
            >
              Update Identity
            </Button>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
              <p className='text-xs text-blue-700'>
                <strong>Privacy Note:</strong> This information is used only for diversity tracking
                and quota enforcement. Female members receive bonus OWP tokens and priority
                mentorship opportunities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mentorship Registration */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='h-5 w-5' />
              Mentorship Program
            </CardTitle>
            <CardDescription>Join our women's empowerment mentorship network</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='specialization'>Specialization Area</Label>
              <Input
                id='specialization'
                placeholder='e.g., Solar Installation, Financial Planning, Leadership'
                value={mentorshipData.specialization}
                onChange={(e) =>
                  setMentorshipData((prev) => ({
                    ...prev,
                    specialization: e.target.value,
                  }))
                }
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='is-mentor'
                checked={mentorshipData.isMentor}
                onChange={(e) =>
                  setMentorshipData((prev) => ({
                    ...prev,
                    isMentor: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <Label htmlFor='is-mentor' className='text-sm'>
                I want to be a mentor (not just a mentee)
              </Label>
            </div>

            <Button
              onClick={handleMentorshipRegistration}
              disabled={!mentorshipData.specialization.trim() || loading}
              className='w-full'
            >
              Join Program
            </Button>

            <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
              <p className='text-xs text-green-700'>
                <strong>Benefits:</strong> Mentors earn +50 contribution points, mentees earn +25
                points. All participants get priority in governance proposals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Governance Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quota Governance</CardTitle>
          <CardDescription>
            Propose changes to the women's participation requirements
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='quota-input'>New Quota Percentage</Label>
              <Input
                id='quota-input'
                type='number'
                min='0'
                max='50'
                value={quotaProposal}
                onChange={(e) => setQuotaProposal(e.target.value)}
                placeholder='33'
              />
            </div>
            <div className='md:col-span-2 flex items-end'>
              <Button
                onClick={handleQuotaProposal}
                disabled={!quotaProposal || parseInt(quotaProposal) > 50 || loading}
                className='w-full'
              >
                Propose Quota Change
              </Button>
            </div>
          </div>

          <div className='bg-purple-50 border border-purple-200 rounded-lg p-3'>
            <p className='text-xs text-purple-700'>
              <strong>Governance Process:</strong> Quota changes require community vote with{' '}
              {quotaTarget}% approval. Maximum quota is 50% to maintain balanced representation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
