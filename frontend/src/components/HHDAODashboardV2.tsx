"use client"

import React, { useState } from 'react'
import { TrendingUp, CheckCircle, Users, Zap } from 'lucide-react'

const HHDAODashboardV2: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard'|'map'>('dashboard')
  const [selectedProject, setSelectedProject] = useState<any | null>(null)

  const userData = {
    name: 'Rahul Kumar',
    communityRole: 'Community Manager',
    stats: { projectsStarted: 3, projectsHelped: 12, membersAdded: 45 },
    tokenBalance: 15000,
    nftCollection: [
      { id: 1, name: 'Solar Bitcoin Mining Hub', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=bitcoin&backgroundColor=10b981' },
      { id: 2, name: 'EV Charging Network', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ev&backgroundColor=eab308' },
      { id: 3, name: 'Data Center Green Power', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=data&backgroundColor=f97316' },
    ]
  }

  const projects = [
    { id: 1, name: 'Solar Bitcoin Mining Hub', stage: 'functioning', size: '5 MW', isLive: true, liveData: { currentOutput: 4.8, uptime: '99.2%' } },
    { id: 2, name: 'EV Charging Network', stage: 'tech-setup', size: '2 MW', isLive: false }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Zap />
          </div>
          <div>
            <h2 className="text-xl font-bold">HeliosHash Dashboard</h2>
            <p className="text-sm text-gray-300">{userData.name} • {userData.communityRole}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentView('map')} className="px-3 py-2 bg-blue-600 rounded">Projects</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {currentView === 'dashboard' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">Token Balance</p>
                    <p className="text-2xl font-bold">{userData.tokenBalance.toLocaleString()} HHD</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded p-4"> <TrendingUp /> <div className="font-bold">{userData.stats.projectsStarted}</div> <div className="text-sm">Projects Started</div></div>
                <div className="bg-gray-800 rounded p-4"> <CheckCircle /> <div className="font-bold">{userData.stats.projectsHelped}</div> <div className="text-sm">Projects Helped</div></div>
                <div className="bg-gray-800 rounded p-4"> <Users /> <div className="font-bold">{userData.stats.membersAdded}</div> <div className="text-sm">Members Added</div></div>
              </div>
            </div>
          )}

          {currentView === 'map' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded p-4"> 
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Projects</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects.map(p => (
                    <div key={p.id} className="bg-gray-900 rounded p-3 border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{p.name}</h4>
                          <div className="text-sm text-gray-400">{p.size} • {p.stage}</div>
                        </div>
                        <div className="text-right">
                          {p.isLive && <span className="text-red-400 text-sm">LIVE</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-gray-800 rounded p-4">
            <h4 className="font-semibold">Energy Metrics</h4>
            {selectedProject?.liveData ? (
              <div className="mt-2 text-sm">
                <div>Output: <strong>{selectedProject.liveData.currentOutput} kW</strong></div>
                <div>Uptime: <strong>{selectedProject.liveData.uptime}</strong></div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">No live metrics selected</div>
            )}
          </div>

          <div className="bg-gray-800 rounded p-4">
            <h4 className="font-semibold">NFT Collection</h4>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {userData.nftCollection.slice(0,6).map(n => (
                <img key={n.id} src={n.image} alt={n.name} className="w-full h-16 object-cover rounded" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default HHDAODashboardV2
