 'use client'

import React from 'react'
import { MapPin, Zap, Leaf, Users, TrendingUp, ExternalLink } from 'lucide-react'

interface HeliosBaghpatMapNodeProps {
  onNavigate?: (path: string) => void
}

export default function HeliosBaghpatMapNode({ onNavigate }: HeliosBaghpatMapNodeProps) {
  return (
    <div
      className="group relative p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 rounded-2xl border-2 border-blue-600 shadow-xl hover:scale-105 transition-all cursor-pointer"
      onClick={() => onNavigate?.('project/helios-baghpat')}
    >
      <div className="absolute top-4 right-4 w-4 h-4 bg-green-500 rounded-full animate-pulse" />

      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-bold text-white">Helios#Baghpat</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-green-300">
          <Zap className="w-4 h-4" /> 50kW → 500kW
        </div>
        <div className="flex items-center gap-2 text-blue-300">
          <Leaf className="w-4 h-4" /> Agrivoltaics
        </div>
        <div className="flex items-center gap-2 text-purple-300">
          <Users className="w-4 h-4" /> 1,500+ NFT Holders
        </div>
        <div className="flex items-center gap-2 text-amber-300">
          <TrendingUp className="w-4 h-4" /> 200% IRR
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">LIVE</span>
        <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-white" />
      </div>
    </div>
  )
}
