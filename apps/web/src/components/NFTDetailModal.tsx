"use client";

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';

interface NFTItem {
  id: number;
  name: string;
  image: string;
  projectId?: number | null;
  community?: string;
  opensea?: { contract?: string; tokenId?: string };
}

interface Props {
  nft: NFTItem | null;
  project?: { name?: string } | null;
  onClose: () => void;
}

export default function NFTDetailModal({ nft, project, onClose }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [assetData, setAssetData] = useState<any>(null);
  const [feed, setFeed] = useState<string[]>([]);

  useEffect(() => {
    if (!nft) return;

    const current = nft;
    let mounted = true;

    async function fetchOpenSea() {
      if (current.opensea && current.opensea.contract && current.opensea.tokenId) {
        try {
          const url = `https://api.opensea.io/api/v1/asset/${current.opensea.contract}/${current.opensea.tokenId}/?include_orders=false`;
          const res = await fetch(url);
          if (!mounted) return;
          if (res.ok) {
            const j = await res.json();
            setAssetData(j);
          } else {
            setAssetData({ error: `OpenSea returned ${res.status}` });
          }
        } catch (e) {
          setAssetData({ error: String(e) });
        }
      } else {
        // No OpenSea metadata available — show placeholder search link to OpenSea search by name
        const permalink = `https://opensea.io/assets?search[query]=${encodeURIComponent(current.name)}`;
        setAssetData({ info: 'No OpenSea contract available; showing local data.', permalink });
      }
    }

    fetchOpenSea();

    // Simulated real-time feed
    setFeed([`Opened view for ${nft.name}`]);
    const iv = setInterval(() => {
      setFeed(prev => [`${new Date().toLocaleTimeString()}: metric update • ${(Math.random()*100).toFixed(1)}`, ...prev].slice(0, 20));
    }, 3000);

    return () => { mounted = false; clearInterval(iv); };
  }, [nft]);

  if (!nft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative max-w-4xl w-full bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl z-10">
        <div className="flex items-start gap-6">
          <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
            <NextImage src={nft.image} alt={nft.name} width={400} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{nft.name}</h3>
                <p className="text-sm text-gray-400">{nft.community || 'Community'}</p>
              </div>
              <div className="text-right">
                <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 space-y-3">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Project</p>
                  <p className="text-lg font-bold text-white">{project ? project.name : 'External Project'}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">OpenSea</p>
                  {assetData ? (
                    assetData.error ? (
                      <p className="text-sm text-red-400">{assetData.error}</p>
                    ) : assetData.name ? (
                      <div>
                        <p className="text-white font-medium">{assetData.name}</p>
                        <p className="text-sm text-gray-400">{assetData.collection?.name}</p>
                        <a className="text-blue-400 text-sm" href={assetData.permalink} target="_blank" rel="noreferrer">View on OpenSea</a>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">{assetData.info || 'No asset metadata found'}</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-400">Loading OpenSea data...</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-4 h-40 overflow-auto">
                  <p className="text-sm text-gray-400 mb-2">Real-time feed</p>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {feed.map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Actions</p>
                  <div className="mt-2 flex flex-col space-y-2">
                    <a className="text-left bg-blue-600 text-white px-3 py-2 rounded-lg" href={assetData?.permalink || '#'} target="_blank" rel="noreferrer">Open on OpenSea</a>
                    <button className="bg-gray-700 text-gray-200 px-3 py-2 rounded-lg">Join Project Community</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
