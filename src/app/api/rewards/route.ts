import { NextResponse } from 'next/server';

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

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Welcome NFT',
    description: 'Your first reward for joining HeliosHash DAO',
    type: 'nft',
    value: '1 NFT',
    rarity: 'common',
    claimed: false,
  },
  {
    id: '2',
    title: 'Early Adopter Token',
    description: 'Bonus tokens for early participation',
    type: 'token',
    value: '100 HLX',
    rarity: 'rare',
    claimed: true,
    claimDate: '2024-01-15',
  },
  {
    id: '3',
    title: 'Community Contributor',
    description: 'Badge for active community participation',
    type: 'badge',
    value: 'Contributor',
    rarity: 'epic',
    claimed: false,
  },
  {
    id: '4',
    title: 'Governance Participant',
    description: 'Token reward for voting in proposals',
    type: 'token',
    value: '50 HLX',
    rarity: 'common',
    claimed: true,
    claimDate: '2024-01-20',
  },
];

export async function GET() {
  return NextResponse.json(mockRewards);
}
