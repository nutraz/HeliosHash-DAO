"use client"

import React from 'react'
import Link from 'next/link'

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Helloashash DMO</h1>
          <p className="text-lg text-gray-600">localhost:3002/rewards</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Rewards Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-1">
                <span className="text-sm font-mono text-gray-700">0x5x8...a22</span>
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {['Database', 'Projects', 'Create Project', 'Alec Johnson'].map((item) => (
              <Link key={item} href="#" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{item.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </Link>
            ))}
          </div>

          {/* Placeholder Content */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">Content Coming Soon</h3>
            <p className="text-yellow-700 max-w-md mx-auto">
              This page is a placeholder. Rewards content and functionality will be added in the next update.
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-300">
            <span>🚀 HeliosHash DAO development aliases loaded!</span>
            <span>📚 Type 'hhdao-help' for available commands</span>
          </div>
        </div>
      </div>
    </div>
  )
}
