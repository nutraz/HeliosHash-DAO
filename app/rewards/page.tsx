"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Gift, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'nft' | 'token' | 'achievement';
  claimed?: boolean;
}

export default function RewardsPage() {
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<Reward[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRewards: 0,
    nftCollected: 0,
    tokensEarned: 0,
    level: 1,
  });

  useEffect(() => {
    // Load data immediately without delay
    setAvailableRewards([
      {
        id: '1',
        title: 'Solar Pioneer',
        description: 'First solar installation milestone',
        points: 500,
        type: 'token',
      },
    ]);

    setClaimedRewards([
      {
        id: 'claimed-1',
        title: 'Early Adopter',
        description: 'Joined during beta phase',
        points: 50,
        type: 'nft',
        claimed: true,
      },
    ]);

    setAchievements([
      {
        id: '1',
        title: 'Level 1',
        description: 'Complete your profile setup',
        unlocked: true,
        progress: 100,
      },
    ]);

    setStats({
      totalRewards: 850,
      nftCollected: 2,
      tokensEarned: 550,
      level: 3,
    });
  }, []);

  const handleClaimReward = (rewardId: string) => {
    // Mock claim functionality
    console.log('Claiming reward:', rewardId);
    // In real implementation, this would call an API
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div data-testid="rewards-header">Total: 500 ICP</div>
        <p className="text-gray-600">
          Track your achievements and claim exclusive rewards for your contributions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                <p data-testid="stat-total-rewards" className="text-2xl font-bold text-green-600">
                  ₹{stats.totalRewards}
                </p>
              </div>
              <Gift className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NFT Collected</p>
                <p data-testid="stat-nft-collected" className="text-2xl font-bold text-blue-600">
                  {stats.nftCollected}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tokens Earned</p>
                <p data-testid="stat-tokens-earned" className="text-2xl font-bold text-purple-600">
                  {stats.tokensEarned}
                </p>
              </div>
              <Coins className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p data-testid="stat-level" className="text-2xl font-bold text-orange-600">
                  {stats.level}
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs data-testid="rewards-tabs" defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="claimed">My Collection</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div data-testid="available-rewards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} data-testid={`reward-available-${reward.id}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <Badge variant={reward.type === 'nft' ? 'default' : 'secondary'}>
                      {reward.type.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {reward.points} points
                    </span>
                    <Button
                      data-testid={`claim-reward-${reward.id}`}
                      onClick={() => handleClaimReward(reward.id)}
                      size="sm"
                    >
                      Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claimed" className="mt-6">
          <div data-testid="claimed-rewards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {claimedRewards.map((reward) => (
              <Card key={reward.id} data-testid={`reward-claimed-${reward.id}`} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-800">
                      Claimed
                    </Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-600">
                    {reward.points} points
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div data-testid="achievements-list" className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} data-testid={`achievement-${achievement.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    {achievement.unlocked && (
                      <Badge className="bg-green-50 text-green-800">Unlocked</Badge>
                    )}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {achievement.progress}% complete
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
