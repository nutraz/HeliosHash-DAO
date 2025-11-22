import React from "react";

export default function DisputeCard({ dispute }: { dispute?: any }) {
  const d =
    dispute ||
    ({ id: "d1", reason: "Payment not released", status: "open", bond: "10 ICP", created: "2025-11-12" });

  return (
    <div className="p-3 bg-white rounded shadow-sm">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">Dispute: {d.reason}</div>
          <div className="text-sm text-slate-600">Status: {d.status} — Bond: {d.bond}</div>
        </div>
        <div>
          <button className="btn">Open</button>
        </div>
      </div>
    </div>
  );
}
