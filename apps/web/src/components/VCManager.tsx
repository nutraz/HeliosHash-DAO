"use client";
import React, { useState } from 'react';
import { useRevocation } from '@/hooks/useRevocation';

export default function VCManager() {
  const { revoked, loading, error, revoke, fetchList } = useRevocation();
  const [hash, setHash] = useState('');

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold">VC Manager</h3>
      <div className="mt-2">
        <input value={hash} onChange={(e) => setHash(e.target.value)} placeholder="VC hash" className="border p-2" />
        <button onClick={async () => { if (hash) { await revoke(hash); setHash(''); } }} className="ml-2 px-3 py-1 bg-red-600 text-white rounded">Revoke</button>
        <button onClick={fetchList} className="ml-2 px-3 py-1 bg-gray-600 text-white rounded">Refresh</button>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-3">
        {revoked.map((r) => (
          <li key={r} className="py-1 border-b">{r}</li>
        ))}
      </ul>
    </div>
  );
}
