"use client"

import React from 'react';
import JoinModal from '@/components/auth/JoinModal';
import ProjectDashboard from '@/components/project/ProjectDashboard';

export default function DevPlaygroundPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dev Playground</h1>
      <div className="space-y-4">
        <JoinModal />
        <ProjectDashboard />
      </div>
    </div>
  );
}
