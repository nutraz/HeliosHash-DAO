import React from 'react';

export default function NFTPage(): JSX.Element {
  return (
    <main className="max-w-[1200px] mx-auto p-8 min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold mb-8">NFT Marketplace</h1>

      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {[1, 2, 3, 4].map((item) => (
          <article key={item} className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333] text-center">
            <div className="w-full h-48 rounded-md mb-4 bg-gradient-to-br from-indigo-500 to-purple-600" aria-hidden />
            <h3 className="text-lg font-semibold">HHDAO NFT #{item}</h3>
            <p className="text-sm text-gray-400 mb-4">Exclusive member NFT</p>
            <button className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition-colors">
              View Details
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
