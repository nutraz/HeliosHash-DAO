"use client";

import Link from 'next/link'
import React from 'react'

export default function ProjectsPage(){
  const projects = [
    { id: 'p1', title: 'Baghpat Solar Pilot', status: 'Live' },
    { id: 'p2', title: 'Urgamu Dashboard Integration', status: 'Live' },
    { id: 'p3', title: 'RWA Tokenization - Phase 1', status: 'Planning' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-300">Explore Projects</h1>
        <p className="text-slate-400 mt-2">Discover community projects and investment opportunities.</p>

        <div className="mt-6 space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-slate-400">Status: {p.status}</div>
              </div>
              <div>
                <Link href={`/projects/${p.id}`} className="px-3 py-1 bg-emerald-500 text-slate-900 rounded">View</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/helioshash-dao" className="inline-block px-4 py-2 bg-emerald-500 text-slate-900 rounded font-semibold">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
