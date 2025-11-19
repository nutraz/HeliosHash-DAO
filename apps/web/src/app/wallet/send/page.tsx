"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleSend = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/wallet', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ to, amount }) });
      const json = await res.json();
      if (json?.ok) {
        setStatus('sent');
        setTimeout(() => router.push('/dashboard'), 800);
      } else {
        setStatus('error: ' + (json?.error || 'unknown'));
      }
    } catch (e: any) {
      setStatus('error: ' + String(e));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Send ICP (Demo)</h2>
        <label className="block text-sm text-gray-300">Recipient</label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 my-2"
          aria-label="Recipient address"
          placeholder="Enter recipient address"
          title="Recipient wallet address"
        />
        <label className="block text-sm text-gray-300">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 my-2"
          aria-label="Amount"
          placeholder="Enter amount"
          title="Amount to send"
        />
        <div className="mt-4 flex items-center space-x-2">
          <button onClick={handleSend} className="btn-primary">Send</button>
          <button onClick={() => router.push('/dashboard')} className="btn-secondary">Cancel</button>
        </div>
        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </div>
  );
}
