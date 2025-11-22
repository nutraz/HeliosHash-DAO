import React, { useState } from "react";
import { acceptValidatorTask, submitAttestation } from "../../lib/mockApi";

const demoTasks = [
  { id: "t1", title: "Inspect site preparation", reward: "10 ICP" },
  { id: "t2", title: "Verify panel alignment", reward: "15 ICP" },
];

export default function ValidatorConsole() {
  const [tasks] = useState(demoTasks);
  const [busy, setBusy] = useState(false);

  async function onAccept(id: string) {
    setBusy(true);
    await acceptValidatorTask(id);
    setBusy(false);
    alert(`Accepted ${id}`);
  }

  async function onSubmit(id: string) {
    setBusy(true);
    await submitAttestation(id, { photo: "data" });
    setBusy(false);
    alert(`Submitted attestation for ${id}`);
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold">Validator Console</h3>
      <div className="mt-3 space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="p-3 bg-white rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-slate-600">Reward: {t.reward}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={() => onAccept(t.id)} disabled={busy}>
                Accept
              </button>
              <button className="btn" onClick={() => onSubmit(t.id)} disabled={busy}>
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
