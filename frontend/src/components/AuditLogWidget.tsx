"use client";
import React, { useState } from 'react';
import { useAuditLog } from '@/hooks/useAuditLog';

export default function AuditLogWidget() {
  const { logs, loading, error, append } = useAuditLog();
  const [text, setText] = useState('');

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold">Audit Log</h3>
      <div className="mt-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Audit text" className="border p-2" />
        <button onClick={async () => { if (text) { await append(text); setText(''); } }} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Append</button>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-3">
        {logs.map((l) => (
          <li key={l.id} className="py-1 border-b"><strong>{l.id}</strong>: {l.text}</li>
        ))}
      </ul>
    </div>
  );
}
