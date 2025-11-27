"use client";

import React from 'react';

export default function Page() {
  const address = 'rdmx6-jaaaa-aaaah-qdrpq-cai';
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Receive ICP (Demo)</h2>
        <p className="text-gray-300 mb-4">Share this address to receive tokens</p>
        <div className="p-4 bg-gray-700 rounded-md select-all">{address}</div>
      </div>
    </div>
  );
}
