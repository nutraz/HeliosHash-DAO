'use client';

import { useEffect, useState } from 'react';

interface NFTDetailProps {
  nftId: string;
  onBack: () => void;
}

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  created: string;
  metadata: {
    community: string;
    members: number;
    proposals: number;
  };
}

export default function NFTDetail({ nftId, onBack }: NFTDetailProps) {
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/nfts/${nftId}`);
        // const data = await response.json();
        
        const mockNFT: NFT = {
          id: nftId,
          name: `Project ${nftId}`,
          description: 'Decentralized community project on ICP',
          image: '/placeholder-nft.png',
          owner: 'ic1a...b2c3',
          created: new Date().toISOString(),
          metadata: {
            community: 'HeliosHash DAO',
            members: 125,
            proposals: 8,
          }
        };
        
        setNft(mockNFT);
      } catch (_error) {
        console.error('Error fetching NFT:', _error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFT();
  }, [nftId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading NFT...</div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white">NFT not found</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          ← Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
      >
        ← Back to Gallery
      </button>

      {/* NFT Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="bg-slate-800 rounded-xl p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
            src={nft.image} 
            alt={nft.name}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{nft.name}</h1>
            <p className="text-slate-400">ID: {nft.id}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Owner:</span>
              <span className="text-white font-mono">{nft.owner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Created:</span>
              <span className="text-white">{new Date(nft.created).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Community:</span>
              <span className="text-cyan-400">{nft.metadata.community}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">Description</h3>
            <p className="text-slate-300">{nft.description}</p>
          </div>

          {/* Community Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Community Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{nft.metadata.members}</div>
                <div className="text-slate-400 text-sm">Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{nft.metadata.proposals}</div>
                <div className="text-slate-400 text-sm">Proposals</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              🔗 View on Explorer
            </button>
            <button className="w-full py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all">
              💬 Join Community
            </button>
            <button className="w-full py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all">
              📊 View Data Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
