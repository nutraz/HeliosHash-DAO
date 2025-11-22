import React from "react";

export default function WalletPanel() {
  return (
    <div className="p-4">
      <h3 className="font-semibold">Wallet & Treasury</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded shadow-sm">
          <div className="text-sm text-slate-500">Balance</div>
          <div className="text-lg font-semibold mt-1">120.45 ICP</div>
          <div className="text-sm text-slate-600">~ ₹12,000</div>
        </div>

        <div className="p-3 bg-white rounded shadow-sm">
          <div className="text-sm text-slate-500">Escrow</div>
          <div className="text-lg font-semibold mt-1">2 active</div>
          <div className="mt-2">
            <button className="btn">Deposit</button>
            <button className="btn ml-2">Withdraw</button>
          </div>
        </div>
      </div>

      <section className="mt-4">
        <h4 className="font-medium">Recent Transactions</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          <li>2025-11-01 — Escrow created — 1000 ICP</li>
          <li>2025-10-28 — Deposit — 200 ICP</li>
        </ul>
      </section>
    </div>
  );
}
