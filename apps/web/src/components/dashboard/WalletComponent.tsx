"use client"

import React from 'react'

export default function WalletComponent() {
  const balance = '0.842 BTC'
  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-md">
      <h4 className="text-sm text-slate-300">Wallet</h4>
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-xl font-bold">{balance}</div>
          <div className="text-xs text-slate-400">Connected: Metamask</div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="px-3 py-1 rounded bg-emerald-500 text-slate-900 font-semibold" onClick={() => console.log('Open Wallet')}>Open Wallet</button>
          <button className="px-3 py-1 rounded bg-white/5 text-white" onClick={() => console.log('Send')}>Send</button>
        </div>
      </div>
    </div>
  )
}
