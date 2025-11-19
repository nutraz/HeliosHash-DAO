"use client";

import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen flex items-start justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-3xl bg-white/5 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-rose-500">Tailwind Diagnostic</h1>
        <p className="mt-3 text-sm text-gray-300">This page confirms that Tailwind utility classes are compiled and working.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg bg-green-500 text-white">bg-green-500</div>
          <div className="p-6 rounded-lg bg-blue-500 text-white">bg-blue-500</div>
          <div className="p-6 rounded-lg bg-purple-500 text-white">bg-purple-500</div>
        </div>

        <div className="mt-6">
          <div className="inline-flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-yellow-300 text-black font-semibold">badge</span>
            <span className="text-xl font-medium text-emerald-300">text-emerald-300</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="p-4 bg-saffron-500 text-black">Custom color (saffron)</div>
            <div className="p-4 bg-green text-white">Custom color (green)</div>
            <div className="p-4 bg-navy text-white">Custom color (navy)</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-300">Utility checks:</div>
          <ul className="list-disc ml-6 mt-2 text-gray-200">
            <li className="mb-1">text-3xl</li>
            <li className="mb-1">grid-cols-3</li>
            <li className="mb-1">bg-blue-500</li>
            <li className="mb-1">rounded-lg</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
