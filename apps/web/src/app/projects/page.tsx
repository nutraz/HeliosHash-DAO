'use client'

import Link from 'next/link'
import React from 'react'

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="space-y-4">
        <Link href="/projects/create" className="block p-4 border rounded-lg hover:bg-gray-50">
          Create New Project
        </Link>
        <Link href="/projects/helios-baghpat" className="block p-4 border rounded-lg hover:bg-gray-50">
          Helios Baghpat Project
        </Link>
      </div>
    </div>
  );
}
