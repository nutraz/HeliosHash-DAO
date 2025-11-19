"use client"
import React from 'react';
import Link from 'next/link';

const HeliosBaghpatMapNode: React.FC = () => {
  return (
    <div className="border border-slate-100 rounded-md p-3 bg-white">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-md flex items-center justify-center text-white font-bold">HB</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Helios#Baghpat</div>
              <div className="text-xs text-slate-500">Baghpat district — Agrivoltaic microgrid</div>
            </div>
            <div className="text-sm text-slate-600">12.4 MWp</div>
          </div>

          <div className="mt-3 text-sm text-slate-700">
            <p>Early-stage agrivoltaic deployment combining solar canopy and regenerative agriculture — phased rollout and community co-ownership model.</p>
          </div>

          <div className="mt-3 flex gap-2">
            <Link href="/projects/helios-baghpat" className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">Open project</Link>
            <a href="#" className="text-sm bg-slate-100 text-slate-800 px-3 py-1 rounded-md">View metrics</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeliosBaghpatMapNode;
