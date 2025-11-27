"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ActionButtons(){
  const router = useRouter()

  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-md" data-testid="action-buttons">
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => router.push('/rewards')} className="py-3 rounded bg-amber-500 text-slate-900 font-semibold">Rewards & Exchange</button>
        <button onClick={() => router.push('/opportunities')} className="py-3 rounded bg-violet-500 text-white font-semibold">Opportunities</button>
        <button onClick={() => router.push('/nfts')} className="py-3 rounded bg-cyan-500 text-slate-900 font-semibold">My NFTs</button>
        <button onClick={() => router.push('/projects')} className="py-3 rounded bg-emerald-500 text-slate-900 font-semibold">Explore Projects</button>
      </div>
    </div>
  )
}
