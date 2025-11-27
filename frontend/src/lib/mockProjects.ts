export type ProjectType = 'solar' | 'mining' | 'infrastructure' | 'storage'

export interface Project {
  id: string
  title: string
  status: 'active' | 'proposal' | 'completed' | 'paused'
  type: ProjectType
  capacity: string
  location: string
  governanceStatus: string
  participants: number
  energy?: {
    currentKW: number
    cumulativeKWh: number
    batteryChargePct?: number
  }
  description?: string
}

const projects: Project[] = [
  {
    id: 'baghpat_solar',
    title: 'Baghpat Solar Pilot',
    status: 'active',
    type: 'solar',
    capacity: '500 kW',
    location: 'Baghpat, Uttar Pradesh, India',
    governanceStatus: 'Community-run (DAO)',
    participants: 128,
    energy: { currentKW: 420, cumulativeKWh: 124500 },
    description: 'Village-scale solar pilot providing daytime power and revenue-share to the community.'
  },
  {
    id: 'urgam_valley',
    title: 'Urgam Valley Proposals',
    status: 'proposal',
    type: 'infrastructure',
    capacity: 'N/A',
    location: 'Urgam Valley, Delhi NCR',
    governanceStatus: 'Proposal stage',
    participants: 24,
    energy: { currentKW: 0, cumulativeKWh: 0 },
    description: 'Series of proposals for smart-city microgrids and community infrastructure.'
  },
  {
    id: 'community_microgrid',
    title: 'Community Microgrid (Pilot)',
    status: 'paused',
    type: 'storage',
    capacity: '200 kWh storage',
    location: 'Rural cluster, Uttar Pradesh',
    governanceStatus: 'Maintenance',
    participants: 46,
    energy: { currentKW: 12, cumulativeKWh: 9850, batteryChargePct: 62 },
    description: 'Microgrid integrating solar + battery to serve critical community loads.'
  }
]

export async function getProjectList(): Promise<Project[]> {
  // simulate async
  return new Promise((res) => setTimeout(() => res(projects), 80))
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return new Promise((res) => setTimeout(() => res(projects.find((p) => p.id === id)), 60))
}

export async function createProjectDraft(payload: Partial<Project>): Promise<{ ok: boolean; id?: string }>{
  const id = (payload.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '_')
  projects.push({
    id,
    title: payload.title || 'Untitled Project',
    status: 'proposal',
    type: (payload.type as ProjectType) || 'solar',
    capacity: payload.capacity || 'TBD',
    location: payload.location || 'TBD',
    governanceStatus: payload.governanceStatus || 'Proposal',
    participants: payload.participants || 1,
    energy: payload.energy || { currentKW: 0, cumulativeKWh: 0 },
    description: payload.description || ''
  })
  return { ok: true, id }
}

export default projects
