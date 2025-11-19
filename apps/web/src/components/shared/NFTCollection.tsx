"use client";

import React from 'react';
import { Image, ChevronRight } from 'lucide-react';
import type { NFT } from '@/lib/types';

type Props = {
  // Simple mode
  nfts?: NFT[];

  // Full mode (optional, legacy support)
  userData?: any;
  projects?: any[];
  showNFTCollection?: boolean;
  setShowNFTCollection?: (show: boolean) => void;
  setSelectedProject?: (project: any | null) => void;
  setCurrentView?: (view: string) => void;
};

export default function NFTCollection({
  nfts,
  userData,
  projects = [],
  showNFTCollection = false,
  setShowNFTCollection = () => {},
  setSelectedProject = () => {},
  setCurrentView = () => {},
}: Props) {
  // Simple render when `nfts` prop is provided (backwards compatibility)
  if (nfts) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {nfts.map((n) => (
          <div key={n.id} className="bg-gray-800/60 p-3 rounded-lg text-center">
            <div className="w-full h-28 bg-gray-700 rounded mb-2 flex items-center justify-center">NFT</div>
            <div className="text-sm font-medium">{(n as any).title || (n as any).name}</div>
            <div className="text-xs text-gray-400">Project: {(n as any).projectId}</div>
          </div>
        ))}
      </div>
    );
  }

  // Full mode: render collection UI driven by userData
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setShowNFTCollection(!showNFTCollection)}
        className="w-full p-6 text-left hover:bg-gray-750 transition-colors"
        title="Toggle NFT Collection"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="text-purple-400" size={28} />
            <div>
              <h3 className="text-xl font-bold text-white">My NFT Collection</h3>
              <p className="text-sm text-gray-400 mt-1">
                {userData?.nftCollection ? userData.nftCollection.length : 0} projects • Click any NFT to explore the project community and real-time data feed
              </p>
            </div>
          </div>
          <div className={`transform transition-transform ${showNFTCollection ? 'rotate-180' : ''}`}>
            <ChevronRight className="text-gray-400" size={24} />
          </div>
        </div>
      </button>

      {showNFTCollection && (
        <div className="p-6 pt-0 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {userData?.nftCollection && userData.nftCollection.map((nft: any) => (
              <button
                key={nft.id}
                onClick={() => {
                  if (nft.projectId) {
                    const project = projects.find((p) => p.id === nft.projectId);
                    if (project) {
                      setSelectedProject(project);
                      setCurrentView('map');
                      setShowNFTCollection(false);
                    }
                  } else {
                    alert(`Exploring ${nft.community}... (External project)`);
                  }
                }}
                className="group relative bg-gray-900 border-2 border-gray-700 rounded-xl p-3 hover:border-blue-500 hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-gray-800 to-gray-900">
                  {nft.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={nft.image} alt={nft.name || nft.title || 'NFT'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">NFT</div>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{nft.name || nft.title}</h4>
                <p className="text-xs text-gray-400 mb-2 line-clamp-1">{nft.community}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-medium">View Project</span>
                  <ChevronRight className="text-gray-600 group-hover:text-blue-400" size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
