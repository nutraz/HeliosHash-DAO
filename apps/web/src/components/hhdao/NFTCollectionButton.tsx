"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon } from 'lucide-react';

const NFTCollectionButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/nfts')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-md"
    >
      <ImageIcon size={18} />
      <span className="hidden sm:inline">NFT Collection</span>
    </button>
  );
};

export default NFTCollectionButton;