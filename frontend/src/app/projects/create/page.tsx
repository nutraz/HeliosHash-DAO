"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectDraft } from '@/lib/mockProjects'
import { notify } from '@/lib/notify'

export default function CreateProjectPage(){
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'solar'|'mining'|'infrastructure'|'storage'>('solar')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const resp = await createProjectDraft({ title, type, location, capacity, description })
    setSubmitting(false)
    if (resp.ok) {
      notify.success('Project draft created: ' + (resp.id || 'ok'))
      router.push('/projects')
    } else {
      notify.error('Failed to create project draft')
    }
  }

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Start a Project</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="proj-title" className="block text-sm mb-1">Project Name</label>
          <input id="proj-title" placeholder="e.g. Baghpat Solar Pilot" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 rounded border" />
        </div>
        <div>
          <label htmlFor="proj-type" className="block text-sm mb-1">Type</label>
          <select id="proj-type" value={type} onChange={(e) => setType(e.target.value as any)} className="w-full p-3 rounded border">
            <option value="solar">Solar</option>
            <option value="mining">Mining / Data-center</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="storage">Storage / Battery</option>
          </select>
        </div>

        <div>
          <label htmlFor="proj-location" className="block text-sm mb-1">Location</label>
          <input id="proj-location" placeholder="City, State, Country" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full p-3 rounded border" />
        </div>

        <div>
          <label htmlFor="proj-capacity" className="block text-sm mb-1">Capacity / Notes</label>
          <input id="proj-capacity" placeholder="e.g. 500 kW" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full p-3 rounded border" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="proj-budget" className="block text-sm mb-1">Required Budget (INR)</label>
          <input id="proj-budget" placeholder="e.g. 5000000" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-3 rounded border" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="proj-desc" className="block text-sm mb-1">Description</label>
          <textarea id="proj-desc" placeholder="Short description of the project, goals, beneficiaries" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-3 rounded border" />
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded">
            {submitting ? 'Submitting…' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  )
}

