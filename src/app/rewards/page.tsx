"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Gift, Star, TrendingUp, CheckCircle, Coins, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface Reward {
  id: string;
  title: string;
  description: string;
  type: "nft" | "token" | "badge";
  value: string;
  rarity: "common" | "rare" | "epic" | "legendary";
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
    achievements: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRewards([
        {
          id: "1",
          title: "Solar Pioneer NFT",
          description: "Exclusive NFT for early solar mining supporters",
          type: "nft",
          value: "0.5 ETH",
          rarity: "rare",
          claimed: true,
          claimDate: "2023-11-15"
        },
        {
          id: "2",
          title: "Energy Saver Badge",
          description: "Awarded for contributing 100+ kWh of clean energy",
          type: "badge",
          value: "Premium",
          rarity: "common",
          claimed: true,
          claimDate: "2023-10-20"
        },
        {
          id: "3",
          title: "Mining Champion",
          description: "Top miner of the month with highest hashrate",
          type: "nft",
          value: "1.2 ETH",
          rarity: "epic",
          claimed: false
        },
        {
          id: "4",
          title: "Community Leader",
          description: "Recognized for active community participation",
          type: "badge",
          value: "Legendary",
          rarity: "legendary",
          claimed: false
        },
        {
          id: "5",
          title: "Token Bonus",
          description: "Bonus tokens for consistent mining activity",
          type: "token",
          value: "1000 HLX",
          rarity: "common",
          claimed: true,
          claimDate: "2023-11-01"
        }
      ]);

      setUserStats({
        totalRewards: 15,
        nftCollected: 3,
        tokensEarned: 5000,
        level: 12,
        nextLevelProgress: 75,
        achievements: 8
      });

      setAchievements([
        {
          id: "1",
          title: "First Steps",
          description: "Complete your first mining session",
          icon: "🌟",
          unlocked: true,
          unlockedDate: "2023-09-15"
        },
        {
          id: "2",
          title: "Energy Producer",
          description: "Generate 1 MWh of clean energy",
          icon: "⚡",
          unlocked: true,
          unlockedDate: "2023-10-05"
        },
        {
          id: "3",
          title: "Community Builder",
          description: "Invite 10 friends to join",
          icon: "👥",
          unlocked: true,
          unlockedDate: "2023-10-20"
        },
        {
          id: "4",
          title: "Token Master",
          description: "Earn 10,000 HLX tokens",
          icon: "🪙",
          unlocked: false
        },
        {
          id: "5",
          title: "NFT Collector",
          description: "Collect 5 unique NFTs",
          icon: "🎨",
          unlocked: false
        },
        {
          id: "6",
          title: "Solar Legend",
          description: "Reach level 20",
          icon: "🏆",
          unlocked: false
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nft": return <Gift className="h-5 w-5" />;
      case "token": return <Coins className="h-5 w-5" />;
      case "badge": return <Award className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Rewards</h1>
              <p className="text-muted-foreground">Earn NFTs, tokens, and badges</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button>View All Rewards</Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="minimal-card p-6 india-saffron">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Rewards</p>
                <p className="text-2xl font-bold">{userStats.totalRewards}</p>
              </div>
              <Trophy className="h-8 w-8 text-foreground/80" />
            </div>
          </Card>

          <Card className="minimal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">NFT Collection</p>
                <p className="text-2xl font-bold text-foreground">{userStats.nftCollected}</p>
              </div>
              <Gift className="h-8 w-8 text-primary/60" />
            </div>
          </Card>

          <Card className="minimal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">HLX Tokens</p>
                <p className="text-2xl font-bold text-foreground">{userStats.tokensEarned.toLocaleString()}</p>
              </div>
              <Coins className="h-8 w-8 text-primary/60" />
            </div>
          </Card>

          <Card className="minimal-card p-6 india-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Level</p>
                <p className="text-2xl font-bold">{userStats.level}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-foreground/80" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Rewards</TabsTrigger>
            <TabsTrigger value="claimed">My Collection</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.filter(r => !r.claimed).map((reward) => (
                <Card key={reward.id} className="minimal-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(reward.type)}
                        <h3 className="font-semibold text-foreground">{reward.title}</h3>
                      </div>
                      <Badge className={getRarityColor(reward.rarity)}>
                        {reward.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{reward.value}</span>
                      <Badge variant="outline">{reward.type.toUpperCase()}</Badge>
                    </div>
                    <Button className="w-full">Claim Reward</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="claimed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.filter(r => r.claimed).map((reward) => (
                <Card key={reward.id} className="minimal-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(reward.type)}
                        <h3 className="font-semibold text-foreground">{reward.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge className="bg-green-100 text-green-800">Claimed</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value</span>
                        <span className="font-medium text-foreground">{reward.value}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Claimed</span>
                        <span className="text-foreground">{reward.claimDate}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`minimal-card p-6 ${achievement.unlocked ? '' : 'opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {achievement.unlocked ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-400" />
                      )}
                      <Badge className={achievement.unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {achievement.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                  </div>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <p className="text-sm text-muted-foreground mt-3">Unlocked on {achievement.unlockedDate}</p>
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