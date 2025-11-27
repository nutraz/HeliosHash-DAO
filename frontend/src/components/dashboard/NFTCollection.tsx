"use client"

import React from 'react'

export default function NFTCollection() {
  const items = [1,2,3]
  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-md">
      <h4 className="text-sm text-slate-300">NFT Collection</h4>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {items.map((i) => (
          <div key={i} className="bg-white/5 rounded p-2 flex items-center justify-center">NFT #{i}</div>
        ))}
      </div>
      <div className="mt-3">
        <button className="w-full py-2 rounded bg-cyan-500 text-slate-900 font-semibold" onClick={() => console.log('Open NFT Collection')}>Open NFT Collection</button>
      </div>
    </div>
  )
}
