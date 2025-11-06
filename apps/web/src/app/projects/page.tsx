'use client'

import React from 'react'
import Link from 'next/link'

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">DAO Projects</h1>
            <p className="text-gray-600">Manage and track all HeliosHash DAO initiatives</p>
          </div>
          <Link 
            href="/projects/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-4 md:mt-0"
          >
            + Create New Project
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Treasury Management</h3>
            <p className="text-gray-600 mb-4">Optimize DAO treasury allocation and yield farming strategies</p>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Active</span>
              <span className="text-sm text-gray-500">12 votes</span>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Community Outreach</h3>
            <p className="text-gray-600 mb-4">Expand DAO membership through educational initiatives</p>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">Planning</span>
              <span className="text-sm text-gray-500">8 votes</span>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-400 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Technical Infrastructure</h3>
            <p className="text-gray-600 mb-4">Upgrade smart contracts and governance mechanisms</p>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Review</span>
              <span className="text-sm text-gray-500">15 votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
