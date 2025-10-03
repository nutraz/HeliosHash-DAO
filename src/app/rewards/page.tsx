'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, CheckCircle, Coins, Gift, Star, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'nft' | 'token' | 'badge';
  value: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  claimed: boolean;
  claimDate?: string;
}

interface UserStats {
  totalRewards: number;
  nftCollected: number;
  tokensEarned: number;
  level: number;
  nextLevelProgress: number;
  achievements: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalRewards: 0,
    nftCollected: 0,
    tokensEarned: 0,
    level: 1,
    nextLevelProgress: 0,
    achievements: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const rewardsResponse = await fetch('/api/rewards');
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData);

        const statsResponse = await fetch('/api/user-stats');
        const statsData = await statsResponse.json();
        setUserStats(statsData);

        const achievementsResponse = await fetch('/api/achievements');
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Failed to fetch rewards data:', error);
      }
    }

    fetchData();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'epic':
        return 'bg-purple-100 text-purple-800';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nft':
        return <Gift className='h-5 w-5' />;
      case 'token':
        return <Coins className='h-5 w-5' />;
      case 'badge':
        return <Award className='h-5 w-5' />;
      default:
        return <Gift className='h-5 w-5' />;
    }
  };

  return (
    <div className='min-h-screen bg-background pb-20'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8' data-testid='rewards-header'>
          <div className='flex items-center gap-4'>
            <Award className='h-8 w-8 text-primary' />
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Rewards</h1>
              <p className='text-muted-foreground'>Earn NFTs, tokens, and badges</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <ThemeToggle />
            <Button>View All Rewards</Button>
          </div>
        </div>

        {/* User Stats */}
        <div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'
          data-testid='rewards-stats'
        >
          <Card className='minimal-card p-6 india-saffron' data-testid='stat-total-rewards'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Total Rewards</p>
                <p className='text-2xl font-bold'>{userStats.totalRewards}</p>
              </div>
              <Trophy className='h-8 w-8 text-foreground/80' />
            </div>
          </Card>

          <Card className='minimal-card p-6' data-testid='stat-nft-collected'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>NFT Collection</p>
                <p className='text-2xl font-bold text-foreground'>{userStats.nftCollected}</p>
              </div>
              <Gift className='h-8 w-8 text-primary/60' />
            </div>
          </Card>

          <Card className='minimal-card p-6' data-testid='stat-tokens-earned'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>HLX Tokens</p>
                <p className='text-2xl font-bold text-foreground'>
                  {userStats.tokensEarned.toLocaleString()}
                </p>
              </div>
              <Coins className='h-8 w-8 text-primary/60' />
            </div>
          </Card>

          <Card className='minimal-card p-6 india-green' data-testid='stat-level'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Level</p>
                <p className='text-2xl font-bold'>{userStats.level}</p>
              </div>
              <TrendingUp className='h-8 w-8 text-foreground/80' />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue='available' className='space-y-6' data-testid='rewards-tabs'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='available'>Available Rewards</TabsTrigger>
            <TabsTrigger value='claimed'>My Collection</TabsTrigger>
            <TabsTrigger value='achievements'>Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value='available' className='space-y-4' data-testid='tab-available'>
            <div
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              data-testid='available-rewards'
            >
              {rewards
                .filter((r) => !r.claimed)
                .map((reward) => (
                  <Card
                    key={reward.id}
                    className='minimal-card p-6'
                    data-testid={`reward-available-${reward.id}`}
                  >
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          {getTypeIcon(reward.type)}
                          <h3 className='font-semibold text-foreground'>{reward.title}</h3>
                        </div>
                        <Badge className={getRarityColor(reward.rarity)}>{reward.rarity}</Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>{reward.description}</p>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-foreground'>{reward.value}</span>
                        <Badge variant='outline'>{reward.type.toUpperCase()}</Badge>
                      </div>
                      <Button className='w-full' data-testid={`claim-reward-${reward.id}`}>
                        Claim Reward
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value='claimed' className='space-y-4' data-testid='tab-claimed'>
            <div
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              data-testid='claimed-rewards'
            >
              {rewards
                .filter((r) => r.claimed)
                .map((reward) => (
                  <Card
                    key={reward.id}
                    className='minimal-card p-6'
                    data-testid={`reward-claimed-${reward.id}`}
                  >
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          {getTypeIcon(reward.type)}
                          <h3 className='font-semibold text-foreground'>{reward.title}</h3>
                        </div>
                        <div className='flex items-center gap-1'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <Badge className='bg-green-100 text-green-800'>Claimed</Badge>
                        </div>
                      </div>
                      <p className='text-sm text-muted-foreground'>{reward.description}</p>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>Value</span>
                          <span className='font-medium text-foreground'>{reward.value}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>Claimed</span>
                          <span className='text-foreground'>{reward.claimDate}</span>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        className='w-full'
                        data-testid={`view-reward-${reward.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value='achievements' className='space-y-4' data-testid='tab-achievements'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4' data-testid='achievements-list'>
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`minimal-card p-6 ${achievement.unlocked ? '' : 'opacity-60'}`}
                  data-testid={`achievement-${achievement.id}`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='text-2xl'>{achievement.icon}</div>
                      <div>
                        <h3 className='font-semibold text-foreground'>{achievement.title}</h3>
                        <p className='text-sm text-muted-foreground'>{achievement.description}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {achievement.unlocked ? (
                        <CheckCircle className='h-5 w-5 text-green-500' />
                      ) : (
                        <Star className='h-5 w-5 text-gray-400' />
                      )}
                      <Badge
                        className={
                          achievement.unlocked
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {achievement.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                  </div>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <p className='text-sm text-muted-foreground mt-3'>
                      Unlocked on {achievement.unlockedDate}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
