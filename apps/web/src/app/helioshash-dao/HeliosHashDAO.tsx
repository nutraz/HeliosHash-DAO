'use client'

import { useState } from 'react'

export default function HeliosHashDAO() {
  const [isConnected, setIsConnected] = useState(false)

  const projects = [
    {
      name: 'Solar Farm Initiative',
      description: 'Renewable energy project focusing on solar power generation in rural areas',
      status: 'Active',
      amount: '1.2M kbit'
    },
    {
      name: 'Wind Energy Research', 
      description: 'Advanced wind turbine technology development and deployment',
      status: 'Completed',
      amount: '200K kbit'
    },
    {
      name: 'Hydroelectric Upgrade',
      description: 'Modernization of existing hydroelectric facilities', 
      status: 'Planning',
      amount: '2.8M kbit'
    }
  ]

  const proposals = [
    {
      title: 'Protocol Upgrade v2.0',
      description: 'Major protocol upgrade introducing new governance features',
      for: '65%',
      against: '35%'
    },
    {
      title: 'Tracking Allocation Q4', 
      description: 'Allocate 500% HSH for community development initiatives',
      for: '42%',
      against: '58%'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HeliosHash DAO</h1>
              <p className="text-gray-600 mt-1">Decentralized Renewable Energy Platform</p>
            </div>
            
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isConnected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Hub */}
          <div className="lg:col-span-2">
            {/* Project Hub Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Hub</h2>
                <p className="text-gray-600 mt-1">Manage and track renewable energy projects</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                New Project
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' :
                      project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-gray-900 font-semibold">{project.amount}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Proposals */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Proposals</h2>
              
              <div className="space-y-6">
                {proposals.map((proposal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{proposal.description}</p>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{proposal.for}</div>
                        <div className="text-gray-600 text-sm">For</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{proposal.against}</div>
                        <div className="text-gray-600 text-sm">Agents</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-left">
                  Scaled Tokens
                </button>
                
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-left">
                  Participants in Governance
                </button>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-left">
                  Verify Identity
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
