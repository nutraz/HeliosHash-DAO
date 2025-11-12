import React from 'react'
import Link from 'next/link'

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Simple Page</h1>
          <p className="text-lg text-gray-600">Simple component testing ground</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Component Testing Area</h2>
          
          {/* Test Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button Test */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Button Components</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Primary Button
                </button>
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Secondary Button
                </button>
              </div>
            </div>

            {/* Card Test */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Card Components</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-medium text-gray-800">Test Card</h4>
                <p className="text-sm text-gray-600 mt-1">This is a sample card component</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-400 underline mr-4">Go to Home</Link>
            <Link href="/dashboard" className="text-blue-400 underline">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import Link from 'next/link'

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Simple Page</h1>
          <p className="text-lg text-gray-600">Simple component testing ground</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Component Testing Area</h2>
          
          {/* Test Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button Test */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Button Components</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Primary Button
                </button>
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Secondary Button
                </button>
              </div>
            </div>

            {/* Card Test */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Card Components</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-medium text-gray-800">Test Card</h4>
                <p className="text-sm text-gray-600 mt-1">This is a sample card component</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-400 underline mr-4">Go to Home</Link>
            <Link href="/dashboard" className="text-blue-400 underline">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function TestSimple() {
import React from 'react';
import Link from 'next/link';

export default function TestSimple() {
  import React from 'react'
  import Link from 'next/link'

  export default function TestSimplePage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Simple Page</h1>
            <p className="text-lg text-gray-600">Simple component testing ground</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Component Testing Area</h2>
          
            {/* Test Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Button Test */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Button Components</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Primary Button
                  </button>
                  <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                    Secondary Button
                  </button>
                </div>
              </div>

              {/* Card Test */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Card Components</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium text-gray-800">Test Card</h4>
                  <p className="text-sm text-gray-600 mt-1">This is a sample card component</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 text-center">
              <Link href="/" className="text-blue-400 underline mr-4">Go to Home</Link>
              <Link href="/dashboard" className="text-blue-400 underline">Go to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
