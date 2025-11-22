import React, { useEffect, useState } from "react";
import { fetchProjects } from "../../lib/mockApi";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects().then((p: any) => setProjects(p));
  }, []);

  if (!projects.length) return <div>Loading projects…</div>;

  const project = projects[0];

  return (
    <div className="p-4">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold">{project.name}</h2>
        <div className="text-sm text-slate-600">Funding: {Math.round(project.fundingProgress * 100)}% — Members: {project.members} — Treasury: {project.treasuryBalance}</div>
      </header>

      <section>
        <h3 className="font-medium">Milestones</h3>
        <div className="mt-3 grid gap-3">
          {project.milestones.map((m: any) => (
            <div key={m.id} className="p-3 border rounded bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-sm text-slate-600">Status: {m.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Escrow: {m.escrow}</div>
                  <button className="btn mt-2" disabled>
                    Release (disabled)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-medium">Validator Tasks</h3>
        <div className="mt-2 p-3 bg-slate-50 rounded">You have 2 assigned tasks</div>
      </section>
    </div>
  );
}
