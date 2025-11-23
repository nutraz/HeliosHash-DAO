"use client"

import Link from 'next/link'
import React from 'react'

export default function WalletPage(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-300">Wallet</h1>
        <p className="text-slate-400 mt-2">Manage your connected wallets and transactions.</p>

        <div className="mt-6 bg-slate-800 p-4 rounded-lg">
          <div className="text-lg font-bold">Connected: MetaMask</div>
          <div className="text-slate-400 mt-2">Balance: <strong className="text-emerald-300">0.842 BTC</strong></div>
        </div>

        <div className="mt-6">
          <Link href="/helioshash-dao" className="inline-block px-4 py-2 bg-emerald-500 text-slate-900 rounded font-semibold">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
