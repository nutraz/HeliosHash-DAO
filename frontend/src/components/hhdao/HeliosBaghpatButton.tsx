'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

/**
 * Helios#Baghpat live project quick-action button.
 * Reusable anywhere: routes to `/projects/helios-baghpat`.
 */
const HeliosBaghpatButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/projects/helios-baghpat')}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-orange-300 animate-ping absolute -inset-1 opacity-75" />
          <div className="w-3 h-3 rounded-full bg-orange-500 relative" />
        </div>
        <MapPin className="w-4 h-4" />
        <span>Helios#Baghpat (LIVE)</span>
      </div>
      <span className="text-xs opacity-90">Open project</span>
    </button>
  );
};

export default HeliosBaghpatButton;