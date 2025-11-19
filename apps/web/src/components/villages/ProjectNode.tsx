'use client';

import React from 'react';
import { ZapIcon, UsersIcon } from './IconComponents';

interface ProjectNodeProps {
  id?: string;
  title: string;
  tagline?: string;
  icon?: string;
  status?: 'live' | 'offline' | 'maintaining';
  energy?: string;
  members?: string;
}

const ProjectNode: React.FC<ProjectNodeProps> = ({ title, tagline, icon, status = 'offline', energy, members }) => {
  const statusClasses: Record<string,string> = {
    live: 'bg-green-500/20 text-green-300 border-green-500',
    offline: 'bg-red-500/20 text-red-300 border-red-500',
    maintaining: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
  };

  return (
    <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg p-6">
        <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-5xl">{icon}</span>
                    <div>
                        <h2 className="text-3xl font-orbitron font-bold text-white">{title}</h2>
                        <p className="text-amber-300 text-lg">{tagline}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusClasses[status]}`}>
                    {status.toUpperCase()}
                </div>
            </div>
            <div className="mt-6 border-t border-slate-700 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                    <ZapIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                        <p className="text-sm text-slate-400">Total Energy Generated</p>
                        <p className="text-2xl font-bold text-white">{energy}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                    <UsersIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                        <p className="text-sm text-slate-400">DAO Members</p>
                        <p className="text-2xl font-bold text-white">{members}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectNode;
