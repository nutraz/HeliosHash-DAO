"use client"

import React from 'react';

interface ProjectMapProps {
  user: { language: string };
  onNavigate: (path: string) => void;
}

export default function ProjectMap({ user, onNavigate }: ProjectMapProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Project Map</h2>
      <p>Project map component placeholder</p>
    </div>
  );
}
