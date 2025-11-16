'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NFTDetail from '@/components/nft/NFTDetail';
import NFTGallery from '@/components/NFTGallery';
import { nftCollection } from '@/lib/mockData';

export default function NFTsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nftId = searchParams?.get('id') ?? null;
  
  const [view, setView] = useState<'gallery' | 'create' | 'detail'>('gallery');

  useEffect(() => {
    if (nftId) {
      setView('detail');
    } else {
      setView('gallery');
    }
  }, [nftId]);

  const handleBackToGallery = () => {
    router.push('/nfts');
    setView('gallery');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">🎨 NFT Collection</h1>
          <nav className="flex items-center gap-2 text-sm text-slate-400 mt-2">
            <button onClick={() => router.push('/')} className="hover:text-white">
              Dashboard
            </button>
            <span>/</span>
            <span className="text-white">NFTs</span>
            {nftId && (
              <>
                <span>/</span>
                <span className="text-cyan-400">{nftId}</span>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="py-8">
        {view === 'detail' && nftId ? (
          <NFTDetail nftId={nftId} onBack={handleBackToGallery} />
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">All NFTs</h2>
            <NFTGallery nfts={nftCollection} />
          </div>
        )}
      </main>
    </div>
  );
}
