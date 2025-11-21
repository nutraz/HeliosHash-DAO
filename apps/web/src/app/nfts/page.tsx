"use client";
import React from "react";

import users from "../../mocks/users.json";
import projects from "../../mocks/projects.json";

function NFTCard({ title, desc, link }: { title: string; desc: string; link?: string }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", padding: 16, borderRadius: 8, width: 320 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ color: "#475569" }}>{desc}</p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" style={{ color: "#0366d6" }}>
          View on OpenSea
        </a>
      ) : null}
    </div>
  );
}

export default function NftsPage() {
  const memberCount = (users as any[]).length;
  const projectCount = (projects as any[]).length;

  return (
    <div style={{ padding: 24 }}>
      <h1>NFTs — Demo</h1>
      <p>Simple demo view of NFT types in this monorepo. Uses local mocks when `NEXT_PUBLIC_USE_MOCKS=true`.</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <NFTCard title={`Membership NFTs (${memberCount})`} desc="DAO membership NFTs grant voting rights and rewards." link={process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL} />

        <NFTCard title={`Project NFTs (${projectCount})`} desc="Project-level NFTs represent projects and funding stakes." link={process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL} />

        <NFTCard title={`Identity NFTs`} desc="KYC / identity NFTs for on-chain identity assertions." link={process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL} />
      </div>
    </div>
  );
}
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
