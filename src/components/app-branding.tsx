"use client";

import Image from 'next/image';

export function AppBranding() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative">
          <Image 
            src="/1logo no background.svg" 
            alt="HeliosHash DAO Logo" 
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">HeliosHash DAO</h1>
          <p className="text-xs text-gray-400">Urgam Valley • India Node</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-1.5 h-6 bg-orange-500 rounded-sm animate-pulse"></div>
          <div className="w-1.5 h-6 bg-white rounded-sm animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-1.5 h-6 bg-green-600 rounded-sm animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <span className="text-xs text-gray-400">Live</span>
      </div>
    </div>
  );
}