"use client";

import React from 'react';
import type { Project } from '@/lib/types';

type Props = {
  projects: Project[];
  onSelect?: (p: Project) => void;
  dashboard?: any;
};

const ProjectMap: React.FC<Props> = ({ projects, onSelect }) => {
  return (
    <div className="w-full h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 overflow-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {projects.map((p) => (
          <button key={p.id} onClick={() => onSelect && onSelect(p)} className="text-left bg-gray-800/60 hover:bg-gray-800/80 p-4 rounded-lg">
            <h4 className="font-semibold">{p.name}</h4>
            <p className="text-sm text-gray-400">{(p as any).location || ''}</p>
            <p className="text-xs text-gray-500 mt-2">Status: {(p as any).status || (p as any).stage || 'unknown'}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectMap;

