import { NextResponse } from 'next/server';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first action in the DAO',
    icon: '🎯',
    unlocked: true,
    unlockedDate: '2024-01-10',
  },
  {
    id: '2',
    title: 'Community Builder',
    description: 'Help grow the community',
    icon: '🤝',
    unlocked: true,
    unlockedDate: '2024-01-15',
  },
  {
    id: '3',
    title: 'Governance Champion',
    description: 'Vote in 10 proposals',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: '4',
    title: 'Token Holder',
    description: 'Hold 1000 HLX tokens',
    icon: '💰',
    unlocked: false,
  },
  {
    id: '5',
    title: 'NFT Collector',
    description: 'Collect 5 unique NFTs',
    icon: '🎨',
    unlocked: false,
  },
];

export async function GET() {
  return NextResponse.json(mockAchievements);
}
