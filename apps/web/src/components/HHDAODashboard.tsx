"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Settings, Plus, Gift, Users, Activity } from 'lucide-react'
import NFTCollection from './shared/NFTCollection'
import HeliosBaghpatMapNode from './projects/HeliosBaghpatMapNode'

type NFTItem = { id: string; name: string; image?: string; projectId?: string; community?: string }
type Project = { id: string; name: string; status: 'live' | 'planning' | 'paused'; kW?: number; holders?: number }

const mockNFTs = Array.from({ length: 8 }).map((_, i) => ({
  id: `nft-${i + 1}`,
  name: `Project NFT #${i + 1}`,
  image: `https://picsum.photos/seed/nft${i + 1}/400/400`,
  projectId: i % 2 === 0 ? 'helios-baghpat' : 'urgamu-delhi',
  community: i % 2 === 0 ? 'Baghpat' : 'UrgamU',
})) as NFTItem[]

const mockProjects: Project[] = [
  { id: 'helios-baghpat', name: 'Helios#Baghpat', status: 'live', kW: 500, holders: 1500 },
  { id: 'urgamu-delhi', name: 'UrgamU Delhi', status: 'live', kW: 120, holders: 420 },
]

export default function HHDAODashboard(): JSX.Element {
  const [showNFTCollection, setShowNFTCollection] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentView, setCurrentView] = useState<'overview' | 'map' | 'create' | 'community' | 'rewards'>('overview')
  const [realtimeMetric, setRealtimeMetric] = useState<number>(Math.random() * 100)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<number>(0)
  const [createStep, setCreateStep] = useState<number>(1)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => setRealtimeMetric((v) => Number((v + Math.random() * 5 - 2).toFixed(2))), 2500)
    return () => clearInterval(iv)
  }, [])

  const stats = useMemo(() => ({ projectsStarted: 3, projectsHelped: 12, membersAdded: 45 }), [])

  function openProject(id: string) {
    const p = mockProjects.find((x) => x.id === id) || null
    setSelectedProject(p)
    setCurrentView('map')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header / Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <nav className="text-sm text-gray-400 mb-1">Home <ChevronRight className="inline-block align-middle mx-2" size={14} /> Dashboard</nav>
            <h1 className="text-3xl font-extrabold">HHDAO v1.0 — Community Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Built on Internet Computer — demo data</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <div className="text-xs text-gray-400">Real-time metric</div>
              <div className="text-xl font-bold text-cyan-300">{realtimeMetric.toFixed(2)} kW</div>
            </div>
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center gap-2">
              <Settings size={16} /> <span className="hidden sm:inline">Settings</span>
            </button>
            <button onClick={() => setCurrentView('create')} className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus size={16} /> <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile / Token Card */}
            <div className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold">RK</div>
                  <div>
                    <div className="text-lg font-bold">Rahul Kumar</div>
                    <div className="text-sm text-gray-200">Investor & Collaborator — Community Manager</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-200">Token Balance</div>
                  <div className="text-2xl font-bold">15,000 HHD</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400">Projects Started</div>
                <div className="text-2xl font-bold mt-2">{stats.projectsStarted}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400">Projects Helped</div>
                <div className="text-2xl font-bold mt-2">{stats.projectsHelped}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400">Members Added</div>
                <div className="text-2xl font-bold mt-2">{stats.membersAdded}</div>
              </div>
            </div>

            {/* NFT Collection */}
            <div className="bg-gray-800 rounded-xl p-4">
              <NFTCollection
                nfts={mockNFTs}
                userData={{ nftCollection: mockNFTs }}
                projects={mockProjects}
                showNFTCollection={showNFTCollection}
                setShowNFTCollection={setShowNFTCollection}
                setSelectedProject={(p) => { if (p) openProject(p.id); }}
                setCurrentView={(v) => setCurrentView(v as any)}
              />
            </div>

            {/* Live Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProjects.map((p) => (
                <div key={p.id} className="bg-gray-800 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Live Project</div>
                      <div className="text-xl font-bold">{p.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Capacity</div>
                      <div className="text-lg font-semibold">{p.kW} kW</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => openProject(p.id)} className="px-3 py-2 bg-blue-600 rounded-lg">Open</button>
                    <button onClick={() => alert('Receive clicked')} className="px-3 py-2 bg-green-600 rounded-lg">Receive</button>
                    <button onClick={() => alert('Send clicked')} className="px-3 py-2 bg-gray-700 rounded-lg">Send</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Project creation flow (condensed) */}
            {currentView === 'create' && (
              <div className="bg-gray-800 rounded-xl p-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold">Create Project — Step {createStep}</div>
                  <div className="text-sm text-gray-400">Quick form (mock)</div>
                </div>
                <div className="space-y-3">
                  {createStep === 1 && (
                    <div>
                      <input placeholder="Project name" className="w-full p-3 bg-gray-900 rounded" />
                      <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => setCurrentView('overview')} className="px-3 py-2 bg-gray-700 rounded">Cancel</button>
                        <button onClick={() => setCreateStep(2)} className="px-3 py-2 bg-blue-600 rounded">Next</button>
                      </div>
                    </div>
                  )}

                  {createStep === 2 && (
                    <div>
                      <textarea placeholder="Description" className="w-full p-3 bg-gray-900 rounded h-28" />
                      <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => setCreateStep(1)} className="px-3 py-2 bg-gray-700 rounded">Back</button>
                        <button onClick={() => setCreateStep(3)} className="px-3 py-2 bg-blue-600 rounded">Next</button>
                      </div>
                    </div>
                  )}

                  {createStep === 3 && (
                    <div>
                      <div className="text-sm text-gray-400">Upload example docs or connect sensors (mock)</div>
                      <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => setCreateStep(2)} className="px-3 py-2 bg-gray-700 rounded">Back</button>
                        <button onClick={() => { setCreateStep(1); setCurrentView('overview'); alert('Project created (mock)'); }} className="px-3 py-2 bg-green-600 rounded">Create</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Community Hub */}
            <div className="bg-gray-800 rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">Community Hub</div>
                <div className="text-sm text-gray-400">Latest activity</div>
              </div>
              <ul className="mt-3 space-y-2">
                <li className="p-3 bg-gray-900 rounded">Rahul created a proposal in Helios#Baghpat — <span className="text-blue-400">View</span></li>
                <li className="p-3 bg-gray-900 rounded">New member joined UrgamU Delhi — <span className="text-blue-400">Profile</span></li>
                <li className="p-3 bg-gray-900 rounded">Rewards claimed by community pool — <span className="text-blue-400">Details</span></li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <aside className="space-y-6">
            {/* Small nav / actions */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold">Quick Actions</div>
                <div className="text-sm text-gray-400">Shortcuts</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setCurrentView('rewards')} className="p-2 bg-yellow-600 rounded flex items-center gap-2"><Gift size={16}/> Rewards</button>
                <button onClick={() => setCurrentView('community')} className="p-2 bg-purple-600 rounded flex items-center gap-2"><Users size={16}/> Community</button>
                <button onClick={() => alert('Telemetry opened')} className="p-2 bg-cyan-600 rounded flex items-center gap-2"><Activity size={16}/> Telemetry</button>
                <button onClick={() => setShowNFTCollection(true)} className="p-2 bg-blue-600 rounded flex items-center gap-2"><ChevronRight size={16}/> My NFTs</button>
              </div>
            </div>

            {/* Mini map / project node preview */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="font-bold mb-2">Live Node</div>
              <HeliosBaghpatMapNode onNavigate={(p) => openProject(p)} />
            </div>

            {/* Rewards marketplace (mock) */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold">Rewards Marketplace</div>
                <div className="text-sm text-gray-400">Earn & Redeem</div>
              </div>
              <ul className="space-y-2">
                <li className="p-3 bg-gray-900 rounded flex justify-between items-center">Solar Lamp <button className="px-3 py-1 bg-blue-600 rounded">Redeem</button></li>
                <li className="p-3 bg-gray-900 rounded flex justify-between items-center">Community Voucher <button className="px-3 py-1 bg-blue-600 rounded">Redeem</button></li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Settings drawer */}
        {settingsOpen && (
          <div className="fixed right-6 top-24 w-96 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl z-50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold">Settings</div>
              <div className="text-sm text-gray-400">{['Profile','Wallets','Canisters','Notifications','Integrations','Advanced'][settingsTab]}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['Profile','Wallets','Canisters','Notifications','Integrations','Advanced'].map((t, idx) => (
                <button key={t} onClick={() => setSettingsTab(idx)} className={`p-2 text-sm rounded ${settingsTab===idx? 'bg-blue-600':'bg-gray-800'}`}>{t}</button>
              ))}
            </div>
            <div className="bg-gray-800 rounded p-3">
              <p className="text-sm text-gray-400">Settings content for tab {settingsTab+1} (mock)</p>
              <div className="mt-3 flex justify-end">
                <button onClick={() => setSettingsOpen(false)} className="px-3 py-2 bg-gray-700 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
