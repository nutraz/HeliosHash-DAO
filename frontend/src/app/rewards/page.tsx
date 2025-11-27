"use client";

import Link from 'next/link'
import React from 'react'

export default function RewardsPage(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-300">Rewards & Exchange Hub</h1>
        <p className="text-slate-400 mt-2">View earned rewards, exchange tokens, and claim payouts.</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg">Total Rewards: <strong className="text-emerald-300">1200 HSH</strong></div>
          <div className="bg-slate-800 p-4 rounded-lg">Exchange widget (placeholder)</div>
          <div className="bg-slate-800 p-4 rounded-lg">Claim & Withdraw (placeholder)</div>
        </div>

        <div className="mt-6">
          <Link href="/helioshash-dao" className="inline-block px-4 py-2 bg-emerald-500 text-slate-900 rounded font-semibold">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
