// === UrgamU NFT Marketplace Page ===
// Buy NFTs to support valley transformation and Asia rebuilding

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import NFTMarketplace from '../../components/nft-marketplace';

// Mock OWP token balance (would come from wallet in real implementation)
const mockUserBalance = 250000; // 250K OWP tokens

export default function NFTPage() {
  const [userBalance, setUserBalance] = useState(mockUserBalance);
  const [transactionHistory, setTransactionHistory] = useState<
    Array<{
      id: string;
      type: 'nft_purchase';
      nftName: string;
      amount: number;
      timestamp: Date;
    }>
  >([]);

  // Handle NFT purchase
  const handlePurchaseNFT = async (nftId: string, price: number): Promise<void> => {
    if (userBalance < price) {
      throw new Error('Insufficient balance');
    }

    // Simulate purchase transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Deduct balance
    setUserBalance((prev) => prev - price);

    // Add to transaction history
    const transaction = {
      id: `nft_${Date.now()}`,
      type: 'nft_purchase' as const,
      nftName: `UrgamU NFT #${nftId}`,
      amount: price,
      timestamp: new Date(),
    };

    setTransactionHistory((prev) => [transaction, ...prev]);

    // Success notification could be added here
    console.log(`Successfully purchased NFT ${nftId} for ${price} OWP`);
  };

  return (
    <div className='min-h-screen'>
      {/* Page Header with Balance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 p-6 backdrop-blur'
      >
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>🏔️ UrgamU NFT Marketplace</h1>
            <p className='text-gray-300'>Support sustainable development across India and Asia</p>
          </div>

          <div className='text-right'>
            <div className='text-sm text-gray-400 mb-1'>Your Balance</div>
            <div className='text-2xl font-bold text-yellow-400'>
              {userBalance.toLocaleString()} OWP
            </div>
            <div className='text-xs text-gray-500'>
              ≈ ${(userBalance * 0.1).toLocaleString()} USD
            </div>
          </div>
        </div>
      </motion.div>

      {/* NFT Marketplace Component */}
      <NFTMarketplace userBalance={userBalance} onPurchaseNFT={handlePurchaseNFT} />

      {/* Recent Transactions */}
      {transactionHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='fixed bottom-6 right-6 max-w-sm'
        >
          <div className='bg-black/80 backdrop-blur rounded-xl p-4 border border-yellow-500/30'>
            <h3 className='text-white font-bold mb-3 flex items-center'>📝 Recent Purchases</h3>
            <div className='space-y-2 max-h-32 overflow-y-auto'>
              {transactionHistory.slice(0, 3).map((tx) => (
                <div key={tx.id} className='text-sm'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-300 truncate'>{tx.nftName}</span>
                    <span className='text-yellow-400 font-bold ml-2'>
                      -{tx.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className='text-xs text-gray-500'>{tx.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
