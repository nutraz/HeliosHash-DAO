// === UrgamU NFT Marketplace Component ===
// Supporting valley transformation and Asia rebuilding through NFTs

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProjectBenefitAlias, urgamUCollections, UrgamUNFT } from '../types/urgamu-nft';

interface NFTMarketplaceProps {
  userBalance?: number; // OWP token balance
  onPurchaseNFT?: (nftId: string, price: number) => Promise<void>;
}

export const NFTMarketplace = ({ userBalance = 0, onPurchaseNFT }: NFTMarketplaceProps) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedNFT, setSelectedNFT] = useState<UrgamUNFT | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [allNFTs, setAllNFTs] = useState<UrgamUNFT[]>([]);

  // Aggregate all NFTs from collections
  useEffect(() => {
    // Flatten collections (currently collections lack embedded NFTs; placeholder for future data source)
    // If real data source adds collection.nfts, map and enrich; otherwise mock empty array.
    const aggregatedNFTs = urgamUCollections.flatMap((collection: any) => {
      const nfts: UrgamUNFT[] = collection.nfts || [];
      return nfts.map((nft) => {
        const projectBenefits: ProjectBenefitAlias | undefined = nft.projectBenefits
          ? nft.projectBenefits
          : nft.projectBenefit
            ? {
                solarCapacityKW: nft.projectBenefit.solarCapacityContribution,
                jobsCreated: nft.projectBenefit.communityJobsSupported,
                carbonOffsetTons: nft.projectBenefit.carbonOffsetGenerated,
                villagesImpacted: nft.projectBenefit.villagesImpacted,
                directFundingUSD: nft.projectBenefit.directFunding,
                owpTokensGenerated: nft.projectBenefit.owpTokensGenerated,
              }
            : undefined;

        return {
          ...nft,
          collectionId: collection.id,
          price: nft.price ?? nft.owpPrice, // unify expected price field
          projectBenefits,
          rebuildingImpact: {
            ...nft.rebuildingImpact,
            scale: nft.rebuildingImpact.scale || nft.rebuildingImpact.replicationPotential,
            targetRegion: nft.rebuildingImpact.targetRegion || nft.rebuildingImpact.region,
            communitiesImpacted:
              nft.rebuildingImpact.communitiesImpacted ||
              nft.metadata?.sustainabilityMetrics?.familiesBenefited,
            crossBorderCollaboration: nft.rebuildingImpact.crossBorderCollaboration || false,
          },
        } as UrgamUNFT;
      });
    });
    setAllNFTs(aggregatedNFTs);
  }, []);

  // Filter NFTs by collection
  const filteredNFTs =
    selectedCollection === 'all'
      ? allNFTs
      : allNFTs.filter((nft) => nft.collectionId === selectedCollection);

  // Handle NFT purchase
  const handlePurchase = async (nft: UrgamUNFT) => {
    if (!onPurchaseNFT) return;

    setPurchaseLoading(nft.id);
    try {
      await onPurchaseNFT(nft.id, nft.price ?? nft.owpPrice);
      // Success feedback could be added here
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchaseLoading(null);
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
    return price.toString();
  };

  // Get impact color based on scale
  const getImpactColor = (scale: string) => {
    switch (scale) {
      case 'continental':
        return 'text-purple-400';
      case 'national':
        return 'text-blue-400';
      case 'regional':
        return 'text-green-400';
      case 'district':
        return 'text-yellow-400';
      case 'village':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-8'
      >
        <h1 className='text-4xl font-bold text-white mb-4'>🏔️ UrgamU NFT Marketplace</h1>
        <p className='text-gray-300 text-lg max-w-2xl mx-auto'>
          Support the transformation of UrgamU Valley and help rebuild India & Asia through
          sustainable solar infrastructure projects
        </p>

        {/* Balance Display */}
        <div className='mt-6 bg-black/20 backdrop-blur rounded-xl p-4 inline-block'>
          <span className='text-gray-300'>Your OWP Balance: </span>
          <span className='text-yellow-400 font-bold text-xl'>{formatPrice(userBalance)} OWP</span>
        </div>
      </motion.div>

      {/* Collection Filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='flex flex-wrap gap-2 mb-8 justify-center'
      >
        <button
          onClick={() => setSelectedCollection('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCollection === 'all'
              ? 'bg-yellow-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All Collections
        </button>
        {urgamUCollections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => setSelectedCollection(collection.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCollection === collection.id
                ? 'bg-yellow-500 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {collection.name} ({collection.totalSupply})
          </button>
        ))}
      </motion.div>

      {/* NFT Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className='bg-black/40 backdrop-blur rounded-xl overflow-hidden hover:bg-black/50 transition-all cursor-pointer'
            onClick={() => setSelectedNFT(nft)}
          >
            {/* NFT Image */}
            <div className='aspect-square bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 relative overflow-hidden'>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-6xl'>{nft.image || '🏔️'}</span>
              </div>
              <div className='absolute top-2 right-2'>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    nft.tier === 'founder'
                      ? 'bg-purple-500 text-white'
                      : nft.tier === 'platinum'
                        ? 'bg-gray-400 text-black'
                        : nft.tier === 'gold'
                          ? 'bg-yellow-500 text-black'
                          : nft.tier === 'silver'
                            ? 'bg-gray-300 text-black'
                            : 'bg-orange-600 text-white'
                  }`}
                >
                  {nft.tier.toUpperCase()}
                </span>
              </div>
            </div>

            {/* NFT Info */}
            <div className='p-4'>
              <h3 className='text-white font-bold text-lg mb-2 truncate'>{nft.name}</h3>
              <p className='text-gray-300 text-sm mb-3 line-clamp-2'>{nft.description}</p>

              {/* Project Benefits */}
              <div className='grid grid-cols-2 gap-2 mb-3'>
                <div className='text-xs'>
                  <span className='text-gray-400'>Solar: </span>
                  <span className='text-green-400 font-bold'>
                    {nft.projectBenefits?.solarCapacityKW ??
                      nft.projectBenefit?.solarCapacityContribution ??
                      0}{' '}
                    kW
                  </span>
                </div>
                <div className='text-xs'>
                  <span className='text-gray-400'>Jobs: </span>
                  <span className='text-blue-400 font-bold'>
                    {nft.projectBenefits?.jobsCreated ??
                      nft.projectBenefit?.communityJobsSupported ??
                      0}
                  </span>
                </div>
                <div className='text-xs'>
                  <span className='text-gray-400'>CO₂: </span>
                  <span className='text-purple-400 font-bold'>
                    {(
                      (nft.projectBenefits?.carbonOffsetTons ??
                        nft.projectBenefit?.carbonOffsetGenerated ??
                        0) / 1000
                    ).toFixed(1)}
                    k t
                  </span>
                </div>
                <div className='text-xs'>
                  <span className='text-gray-400'>Impact: </span>
                  <span
                    className={`font-bold ${getImpactColor(
                      nft.rebuildingImpact.scale || nft.rebuildingImpact.replicationPotential
                    )}`}
                  >
                    {nft.rebuildingImpact.scale || nft.rebuildingImpact.replicationPotential}
                  </span>
                </div>
              </div>

              {/* Price & Purchase */}
              <div className='flex items-center justify-between'>
                <div>
                  <span className='text-yellow-400 font-bold text-lg'>
                    {formatPrice(nft.price ?? nft.owpPrice)} OWP
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(nft);
                  }}
                  disabled={userBalance < (nft.price ?? nft.owpPrice) || purchaseLoading === nft.id}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    userBalance >= (nft.price ?? nft.owpPrice)
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {purchaseLoading === nft.id ? 'Buying...' : 'Buy NFT'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected NFT Modal */}
      {selectedNFT && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center p-6 z-50'
          onClick={() => setSelectedNFT(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-6'>
              {/* Modal Header */}
              <div className='flex justify-between items-start mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-white mb-2'>{selectedNFT.name}</h2>
                  <p className='text-gray-300'>{selectedNFT.description}</p>
                </div>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className='text-gray-400 hover:text-white text-2xl'
                >
                  ×
                </button>
              </div>

              {/* Detailed Benefits */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='bg-black/40 rounded-lg p-4'>
                  <h3 className='text-yellow-400 font-bold mb-3'>Project Impact</h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Solar Capacity:</span>
                      <span className='text-green-400 font-bold'>
                        {selectedNFT.projectBenefits?.solarCapacityKW ??
                          selectedNFT.projectBenefit?.solarCapacityContribution ??
                          0}{' '}
                        kW
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Jobs Created:</span>
                      <span className='text-blue-400 font-bold'>
                        {selectedNFT.projectBenefits?.jobsCreated ??
                          selectedNFT.projectBenefit?.communityJobsSupported ??
                          0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Carbon Offset:</span>
                      <span className='text-purple-400 font-bold'>
                        {selectedNFT.projectBenefits?.carbonOffsetTons ??
                          selectedNFT.projectBenefit?.carbonOffsetGenerated ??
                          0}{' '}
                        tons/year
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Direct Funding:</span>
                      <span className='text-orange-400 font-bold'>
                        $
                        {(
                          selectedNFT.projectBenefits?.directFundingUSD ??
                          selectedNFT.projectBenefit?.directFunding ??
                          0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-black/40 rounded-lg p-4'>
                  <h3 className='text-yellow-400 font-bold mb-3'>Rebuilding Impact</h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Scale:</span>
                      <span
                        className={`font-bold ${getImpactColor(
                          selectedNFT.rebuildingImpact.scale ||
                            selectedNFT.rebuildingImpact.replicationPotential
                        )}`}
                      >
                        {selectedNFT.rebuildingImpact.scale ||
                          selectedNFT.rebuildingImpact.replicationPotential}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Region:</span>
                      <span className='text-white'>
                        {selectedNFT.rebuildingImpact.targetRegion ||
                          selectedNFT.rebuildingImpact.region}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Communities:</span>
                      <span className='text-blue-400 font-bold'>
                        {selectedNFT.rebuildingImpact.communitiesImpacted ??
                          selectedNFT.metadata?.sustainabilityMetrics?.familiesBenefited ??
                          0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Cross-border:</span>
                      <span className='text-purple-400 font-bold'>
                        {selectedNFT.rebuildingImpact.crossBorderCollaboration ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div className='border-t border-gray-700 pt-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='text-gray-400 text-sm block'>Price</span>
                    <span className='text-yellow-400 font-bold text-3xl'>
                      {formatPrice(selectedNFT.price ?? selectedNFT.owpPrice)} OWP
                    </span>
                  </div>
                  <button
                    onClick={() => handlePurchase(selectedNFT)}
                    disabled={
                      userBalance < (selectedNFT.price ?? selectedNFT.owpPrice) ||
                      purchaseLoading === selectedNFT.id
                    }
                    className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                      userBalance >= (selectedNFT.price ?? selectedNFT.owpPrice)
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {purchaseLoading === selectedNFT.id ? 'Purchasing...' : 'Purchase NFT'}
                  </button>
                </div>

                {userBalance < (selectedNFT.price ?? selectedNFT.owpPrice) && (
                  <p className='text-red-400 text-sm mt-2'>
                    Insufficient OWP balance. You need{' '}
                    {formatPrice((selectedNFT.price ?? selectedNFT.owpPrice) - userBalance)} more
                    OWP.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredNFTs.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-16'>
          <div className='text-6xl mb-4'>🏔️</div>
          <h3 className='text-xl font-bold text-white mb-2'>No NFTs Available</h3>
          <p className='text-gray-400'>Check back soon for new UrgamU valley transformation NFTs</p>
        </motion.div>
      )}
    </div>
  );
};

export default NFTMarketplace;
