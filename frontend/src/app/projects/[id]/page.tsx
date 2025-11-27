"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProjectById, Project } from '@/lib/mockProjects'

interface Props {
  params: { id: string }
}

export default function ProjectDetail({ params }: Props) {
  const router = useRouter()
  const [project, setProject] = useState<Project | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getProjectById(params.id).then((p) => {
      if (mounted) {
        setProject(p)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [params.id])

  if (loading) return <div className="p-6">Loading…</div>
  if (!project) return <div className="p-6">Project not found</div>

  return (
    <div className="p-6 container mx-auto">
      <button onClick={() => router.back()} className="mb-4 text-sm text-blue-600">← Back</button>
      <h1 className="text-2xl font-bold">{project.title}</h1>
      <p className="text-sm text-slate-500">{project.location} • {project.type}</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <section className="bg-white dark:bg-slate-800 rounded p-4 border">
            <h3 className="font-semibold mb-2">Overview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>Capacity: <strong>{project.capacity}</strong></div>
              <div>Governance: <strong>{project.governanceStatus}</strong></div>
              <div>Participants: <strong>{project.participants}</strong></div>
              <div>Status: <strong>{project.status}</strong></div>
            </div>
          </section>

          <section className="mt-4 bg-white dark:bg-slate-800 rounded p-4 border">
            <h3 className="font-semibold mb-2">Asset / Document Bin</h3>
            <p className="text-sm text-slate-500">Upload photos, agreements, certificates (dev placeholder).</p>
            <div className="mt-3">
              <label className="block text-sm text-slate-500">Upload files</label>
              <input aria-label="project-assets" type="file" multiple className="text-sm mt-2" />
            </div>
          </section>
        </div>

        <aside>
          <section className="bg-white dark:bg-slate-800 rounded p-4 border mb-4">
            <h4 className="font-semibold">Energy Metrics</h4>
            {project.energy ? (
              <div className="mt-2 text-sm">
                <div>Current output: <strong>{project.energy.currentKW} kW</strong></div>
                <div>Cumulative: <strong>{project.energy.cumulativeKWh} kWh</strong></div>
                {typeof project.energy.batteryChargePct !== 'undefined' && (
                  <div>Battery: <strong>{project.energy.batteryChargePct}%</strong></div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500 mt-2">No live metrics available</div>
            )}
          </section>

          <section className="bg-white dark:bg-slate-800 rounded p-4 border">
            <h4 className="font-semibold">Governance</h4>
            <p className="text-sm mt-2">Managed by: <strong>{project.governanceStatus}</strong></p>
            <button onClick={() => alert('Open governance / proposals (coming soon)')} className="mt-3 px-3 py-2 bg-blue-600 text-white rounded">Open Proposals</button>
          </section>
        </aside>
      </div>
    </div>
  )
}
