"use client"

import React from 'react'

type Badge = { id: string; title: string }

export default function ProfileCard() {
  const badges: Badge[] = [
    { id: 'b1', title: 'Founder' },
    { id: 'b2', title: 'Solar Pilot' },
    { id: 'b3', title: 'Validator' },
  ]

  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-md">
      <div className="flex items-center gap-4">
        <img src="/hhdaologo-main.svg" alt="pfp" className="w-16 h-16 rounded-full ring-2 ring-emerald-400" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">Sanjay Verma</h3>
            <span className="text-xs px-2 py-1 bg-emerald-500 text-slate-900 rounded">Level 7</span>
          </div>
          <div className="text-sm text-slate-300">Position: Community Lead</div>
          <div className="text-sm text-slate-400">Rank: Gold</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b.id} className="text-xs bg-white/5 px-2 py-1 rounded">{b.title}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
