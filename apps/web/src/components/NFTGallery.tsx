"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Share2, ExternalLink, Download, Grid3x3 } from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  image: string;
  community: string;
  projectId?: string;
  description?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

interface NFTGalleryProps {
  nfts: NFTItem[];
  onNFTSelect?: (nft: NFTItem) => void;
  onBack?: () => void;
}

const NFTGallery: React.FC<NFTGalleryProps> = ({ nfts, onNFTSelect, onBack }) => {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');

  const sampleNFTs: NFTItem[] = [
    {
      id: 'solar-btc-1',
      name: 'Solar Bitcoin Miner #001',
      image: '/assets/icons/helioshash.svg',
      community: 'Green Energy Collective',
      projectId: '1',
      description: 'Genesis solar miner powered by Bitcoin rewards',
      attributes: [
        { trait_type: 'Power Output', value: '500 TH/s' },
        { trait_type: 'Location', value: 'Baghpat, India' },
        { trait_type: 'Energy Source', value: 'Solar + Bitcoin' }
      ]
    },
    {
      id: 'ev-charging-2',
      name: 'EV Charging Station #002',
      image: '/assets/icons/urgam.svg',
      community: 'Sustainable Transport DAO',
      projectId: '2',
      description: 'Fast-charging station with renewable energy backup',
      attributes: [
        { trait_type: 'Charging Speed', value: '150kW DC' },
        { trait_type: 'Location', value: 'Delhi Highway' },
        { trait_type: 'Energy Source', value: 'Solar + Grid' }
      ]
    },
    {
      id: 'data-center-3',
      name: 'Green Data Center #003',
      image: '/icons/llogo-nobackground.svg',
      community: 'Tech Infrastructure Hub',
      projectId: '3',
      description: 'Carbon-neutral data center powered by renewable energy',
      attributes: [
        { trait_type: 'Processing Power', value: '1000 cores' },
        { trait_type: 'Energy Source', value: '100% Solar' },
        { trait_type: 'Carbon Offset', value: '5000 tons/year' }
      ]
    },
    {
      id: 'temple-solar-4',
      name: 'Temple Solar Array #004',
      image: '/assets/icons/governance.svg',
      community: 'Community Power Network',
      projectId: '4',
      description: 'Community-owned solar array powering local temple',
      attributes: [
        { trait_type: 'Capacity', value: '500 kW' },
        { trait_type: 'Location', value: 'Uttarakhand' },
        { trait_type: 'Energy Source', value: '100% Solar' },
        { trait_type: 'Community Impact', value: '2500 households' }
      ]
    },
    {
      id: 'school-solar-5',
      name: 'School Solar Initiative #005',
      image: '/logo-simple.svg',
      community: 'Education Energy Alliance',
      projectId: '5',
      description: 'Solar installation at rural school providing clean energy education',
      attributes: [
        { trait_type: 'Educational Impact', value: '500 students' },
        { trait_type: 'Energy Source', value: '100% Solar' },
        { trait_type: 'Location', value: 'Rural Village' }
      ]
    }
  ];

  const handleNFTClick = (nft: NFTItem) => {
    setSelectedNFT(nft);
    if (onNFTSelect) {
      onNFTSelect(nft);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">My NFT Collection</h2>
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
            {nfts.length} NFTs
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Grid3x3 className="w-5 h-5" />
            <span>{viewMode === 'grid' ? 'Carousel View' : 'Grid View'}</span>
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* NFT Grid/Carousel View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...nfts, ...sampleNFTs].map((nft) => (
            <div
              key={nft.id}
              onClick={() => handleNFTClick(nft)}
              className={`relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedNFT?.id === nft.id ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg relative overflow-hidden">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white mb-1">{nft.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">#{nft.id}</span>
                    {nft.community && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {nft.community}
                      </span>
                    )}
                  </div>
                </div>
                
                {nft.description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{nft.description}</p>
                )}
                
                {/* Attributes */}
                {nft.attributes && nft.attributes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Attributes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.attributes.map((attr, idx) => (
                        <div key={idx} className="bg-gray-700 rounded-lg p-3">
                          <div className="text-xs text-gray-500">{attr.trait_type}</div>
                          <div className="text-sm text-white font-medium">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Actions */}
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
                <button className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-1 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-1 bg-green-600 rounded-full hover:bg-green-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-1 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Carousel View */
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Carousel View</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative bg-gray-800 rounded-xl p-8">
            {selectedNFT ? (
              <div className="text-center">
                  <div className="aspect-square max-w-2xl mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl overflow-hidden relative">
                  <Image
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{selectedNFT.name}</h3>
                <p className="text-gray-300 mb-4">#{selectedNFT.id}</p>
                
                {selectedNFT.community && (
                  <div className="mb-4">
                    <span className="bg-blue-600 text-white text-lg px-4 py-2 rounded-full">
                      {selectedNFT.community}
                    </span>
                  </div>
                )}
                
                {selectedNFT.description && (
                  <p className="text-gray-300 mb-6 text-center max-w-2xl">{selectedNFT.description}</p>
                )}
                
                {/* Attributes in Carousel */}
                {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <h4 className="text-lg font-semibold text-white mb-4">Attributes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedNFT.attributes.map((attr, idx) => (
                        <div key={idx} className="bg-gray-700 rounded-lg p-4">
                          <div className="text-sm text-gray-500 mb-1">{attr.trait_type}</div>
                          <div className="text-lg text-white font-medium">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Favorite</span>
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                    <ExternalLink className="w-5 h-5" />
                    <span>View on Explorer</span>
                  </button>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                    <Grid3x3 className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
                <p className="text-lg">Select an NFT to view details</p>
                <div className="flex justify-center space-x-4 mt-4">
                  {[...sampleNFTs].slice(0, 3).map((nft, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNFTClick(nft)}
                      className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors relative"
                    >
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTGallery;
