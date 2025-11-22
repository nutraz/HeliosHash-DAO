import React, { useState } from "react";
import { connectWallet, startKyc } from "../../lib/mockApi";

export default function JoinModal() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onWallet() {
    setLoading(true);
    const p = await connectWallet();
    setMessage(`Connected: ${p}`);
    setLoading(false);
  }

  async function onKyc(path: string) {
    setLoading(true);
    const res = await startKyc(path);
    setMessage(`KYC started: ${res.taskId}`);
    setLoading(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold">Join / Authenticate</h3>
        <p className="text-sm text-slate-600 mt-1">Choose a method to get started</p>

        <div className="mt-4 grid gap-2">
          <button className="btn" onClick={onWallet} disabled={loading}>
            Connect Wallet
          </button>
          <button className="btn" onClick={() => onKyc("onfido")} disabled={loading}>
            Start KYC (Onfido)
          </button>
          <button className="btn" onClick={() => onKyc("local-verifier")} disabled={loading}>
            Start KYC (Local verifier)
          </button>
          <button className="btn" onClick={() => setOpen(false)}>
            Continue as guest
          </button>
        </div>

        {message && <div className="mt-4 text-sm text-slate-700">{message}</div>}

        <div className="mt-6 text-right">
          <button className="text-sm text-slate-500" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
