"use client"
import React, {useEffect, useState} from 'react';

type Msg = { id: string; from: string; to: string; text: string; createdAt: string };

export default function MessagesPage(){
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const me = 'demo';

  async function load(){
    setLoading(true);
    const res = await fetch(`/api/social/messages?user=${encodeURIComponent(me)}`);
    const j = await res.json();
    setMsgs(j.data ?? []);
    setLoading(false);
  }

  async function send(){
    if (!text.trim()) return;
    await fetch('/api/social/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: me, to: 'alice', text }) });
    setText('');
    load();
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="col-span-1 bg-white rounded-md p-4 shadow-sm">
          <h3 className="font-medium">Conversations</h3>
          <div className="mt-3 text-sm text-slate-600">Demo with a single conversation to Alice</div>
        </aside>

        <main className="col-span-2 bg-white rounded-md p-4 shadow-sm">
          <div className="mb-3">
            <div className="text-sm text-slate-600">To: Alice</div>
          </div>

          <div className="space-y-2 mb-4 max-h-64 overflow-auto">
            {loading && <div className="text-sm text-slate-500">Loading messages…</div>}
            {!loading && msgs.length===0 && <div className="text-sm text-slate-500">No messages yet.</div>}
            {msgs.map(m => (
              <div key={m.id} className={`p-2 rounded ${m.from===me? 'bg-indigo-50 self-end':'bg-slate-100'}`}>
                <div className="text-sm text-slate-700">{m.text}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded p-2" placeholder="Write a message to Alice" />
            <button onClick={send} className="bg-indigo-600 text-white px-3 py-1 rounded-md">Send</button>
          </div>
        </main>
      </div>
    </div>
  );
}
