"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProjectList, Project } from '@/lib/mockProjects'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getProjectList().then((list) => {
      if (mounted) {
        setProjects(list)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="p-6 container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Project Browser</h1>
        <Link href="/projects/create" className="bg-blue-600 text-white px-4 py-2 rounded">Start a Project</Link>
      </div>

      {loading ? (
        <div>Loading projects…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <article key={p.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{p.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{p.location} • {p.type}</p>
                </div>
                <div className="text-sm text-right">
                  <div className="font-semibold">{p.status}</div>
                  <div className="text-xs text-slate-500">{p.participants} participants</div>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{p.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <div>Capacity: <span className="font-medium">{p.capacity}</span></div>
                  <div>Governance: <span className="font-medium">{p.governanceStatus}</span></div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/projects/${p.id}`} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded">View</Link>
                  <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => alert('Join flow coming soon')}>Join</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

