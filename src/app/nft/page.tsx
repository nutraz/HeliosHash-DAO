// === UrgamU NFT Marketplace Page ===
// Buy NFTs to support valley transformation and Asia rebuilding

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Award, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock OWP token balance (would come from wallet in real implementation)
const mockUserBalance = 250000; /**
 * Render the "NFT Collection" page showing a user's HeliosHash energy NFTs, a mint action, and collection statistics.
 *
 * Displays a grid of mock NFTs (name, rarity, energy, visual gradient), an add/mint card, and a summary of collection statistics. Maintains local state for user balance and a transaction history placeholder used by the UI.
 *
 * @returns The React element representing the NFT Collection page UI.
 */

export default function NFTPage() {
  const [userBalance] = useState(mockUserBalance);
  const router = useRouter();
  const [transactionHistory, setTransactionHistory] = useState<
    Array<{
      id: string;
      type: 'nft_purchase';
      nftName: string;
      amount: number;
      timestamp: Date;
    }>
  >([]);

  const mockNFTs = [
    {
      id: 1,
      name: 'Solar Pioneer #001',
      rarity: 'Legendary',
      energy: 2500,
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      id: 2,
      name: 'Grid Guardian #156',
      rarity: 'Rare',
      energy: 1800,
      gradient: 'from-blue-400 to-purple-500',
    },
    {
      id: 3,
      name: 'Community Leader #089',
      rarity: 'Epic',
      energy: 2100,
      gradient: 'from-green-400 to-teal-500',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='flex items-center space-x-4 mb-6'>
        <Button
          onClick={() => router.back()}
          variant='outline'
          size='sm'
          className='border-gray-600 text-gray-300 hover:bg-gray-800'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
        <div>
          <h1 className='text-2xl font-bold text-white'>NFT Collection</h1>
          <p className='text-gray-400'>Your HeliosHash energy NFTs</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockNFTs.map((nft) => (
          <Card key={nft.id} className='bg-gray-800/50 border-gray-700 overflow-hidden'>
            <CardContent className='p-0'>
              {/* NFT Image Placeholder */}
              <div
                className={`h-48 bg-gradient-to-br ${nft.gradient} flex items-center justify-center`}
              >
                <div className='text-center text-white'>
                  <div className='w-16 h-16 mx-auto mb-2 opacity-75 bg-gray-600 rounded-lg flex items-center justify-center'>
                    <Award className='w-8 h-8 text-gray-400' />
                  </div>
                  <div className='text-lg font-bold'>{nft.name}</div>
                </div>
              </div>

              <div className='p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <Badge
                    variant={
                      nft.rarity === 'Legendary'
                        ? 'default'
                        : nft.rarity === 'Epic'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {nft.rarity}
                  </Badge>
                  <div className='flex items-center space-x-1 text-yellow-400'>
                    <Zap className='w-4 h-4' />
                    <span className='text-sm font-semibold'>{nft.energy}</span>
                  </div>
                </div>

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Energy Generation</span>
                    <span className='text-white'>{nft.energy} kW</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Collection</span>
                    <span className='text-white'>HeliosHash Genesis</span>
                  </div>
                </div>

                <Button className='w-full mt-4' variant='outline'>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add NFT Card */}
        <Card className='bg-gray-800/50 border-gray-700 border-dashed'>
          <CardContent className='p-6 text-center'>
            <div className='text-gray-400 mb-4'>
              <Award className='w-16 h-16 mx-auto mb-2' />
              <h3 className='text-lg font-semibold'>Mint New NFT</h3>
              <p className='text-sm'>Earn NFTs by contributing to the solar grid</p>
            </div>
            <Button className='bg-gradient-to-r from-orange-500 to-red-500'>Explore Minting</Button>
          </CardContent>
        </Card>
      </div>

      {/* NFT Stats */}
      <Card className='bg-gray-800/50 border-gray-700 mt-8'>
        <CardHeader>
          <CardTitle className='text-white'>Collection Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>3</div>
              <div className='text-sm text-gray-400'>Owned NFTs</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>6,400</div>
              <div className='text-sm text-gray-400'>Total Energy</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>1</div>
              <div className='text-sm text-gray-400'>Legendary</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>₹45,000</div>
              <div className='text-sm text-gray-400'>Est. Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}