import { NextResponse } from 'next/server';

interface UserStats {
  totalRewards: number;
  nftCollected: number;
  tokensEarned: number;
  level: number;
  nextLevelProgress: number;
  achievements: number;
}

const mockUserStats: UserStats = {
  totalRewards: 4,
  nftCollected: 1,
  tokensEarned: 150,
  level: 3,
  nextLevelProgress: 65,
  achievements: 2,
};

export async function GET() {
  return NextResponse.json(mockUserStats);
}
