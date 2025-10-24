
"use client";

import { cn } from '@/lib/utils';

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
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([
    { id: '1', title: 'Genesis NFT', description: 'Early supporter NFT', points: 100, type: 'nft' },
    { id: '2', title: 'Solar Pioneer', description: 'First project reward', points: 200, type: 'token' },
  ]);
  const [claimedRewards, setClaimedRewards] = useState<Reward[]>([
    { id: '3', title: 'DAO Contributor', description: 'Contributed to governance', points: 150, type: 'nft', claimed: true },
  ]);
  const stats = {
    totalRewards: 450,
    nftCollected: 2,
    tokensEarned: 200,
    level: 3,
  };
  const achievements = [
    { id: 'a1', title: 'First Vote', description: 'Participated in a DAO vote', progress: 100, unlocked: true },
    { id: 'a2', title: 'Solar Advocate', description: 'Referred 5 users', progress: 60, unlocked: false },
  ];
  function handleClaimReward(id: string) {
    // stub for claim action
    setClaimedRewards([...claimedRewards, ...availableRewards.filter(r => r.id === id).map(r => ({ ...r, claimed: true }))]);
    setAvailableRewards(availableRewards.filter(r => r.id !== id));
  }
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div data-testid="rewards-header" className="text-foreground font-semibold">Total: 500 ICP</div>
        <p className="text-muted-foreground">
          Track your achievements and claim exclusive rewards for your contributions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
                <p data-testid="stat-total-rewards" className="text-2xl font-bold text-success">
                  ₹{stats.totalRewards}
                </p>
              </div>
              <Gift className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">NFT Collected</p>
                <p data-testid="stat-nft-collected" className="text-2xl font-bold text-info">
                  {stats.nftCollected}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tokens Earned</p>
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
                <p className="text-sm font-medium text-muted-foreground">Level</p>
                <p data-testid="stat-level" className="text-2xl font-bold text-warning">
                  {stats.level}
                </p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs data-testid="rewards-tabs" defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted rounded-lg mb-2">
          <TabsTrigger value="available" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-md transition">Available Rewards</TabsTrigger>
          <TabsTrigger value="claimed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-md transition">My Collection</TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-md transition">Achievements</TabsTrigger>
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
                    <span className="text-sm text-muted-foreground">
                      {reward.points} points
                    </span>
                    <Button
                      data-testid={`claim-reward-${reward.id}`}
                      onClick={() => handleClaimReward(reward.id)}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                    <Badge variant="outline" className="bg-success/10 text-success">
                      Claimed
                    </Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">
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
                    {achievement.unlocked && (<Badge className="bg-success/10 text-success">Unlocked</Badge>)}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        'bg-primary h-2 rounded-full transition-all duration-300',
                        achievement.progress === 100 ? 'w-full' : achievement.progress >= 90 ? 'w-11/12' : achievement.progress >= 80 ? 'w-10/12' : achievement.progress >= 70 ? 'w-9/12' : achievement.progress >= 60 ? 'w-8/12' : achievement.progress >= 50 ? 'w-7/12' : achievement.progress >= 40 ? 'w-6/12' : achievement.progress >= 30 ? 'w-5/12' : achievement.progress >= 20 ? 'w-4/12' : achievement.progress >= 10 ? 'w-3/12' : 'w-2/12'
                      )}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{achievement.progress}% complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
