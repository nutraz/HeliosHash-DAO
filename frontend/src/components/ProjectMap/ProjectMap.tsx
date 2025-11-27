"use client"
import React from 'react';
import Link from 'next/link';
import HeliosBaghpatMapNode from './HeliosBaghpatMapNode';

const ProjectMap: React.FC = () => {
  // Simple placeholder map with a highlighted Helios#Baghpat node
  return (
    <div className="w-full h-[420px] bg-gradient-to-b from-sky-50 to-white rounded-lg shadow-sm p-4">
      <div className="flex h-full gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full max-h-[380px]" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
              <rect x="0" y="0" width="1000" height="600" fill="#eef2ff" />
              {/* Example markers */}
              <circle cx="650" cy="220" r="18" fill="#0ea5e9" />
              <text x="670" y="225" fontSize="14" fill="#0f172a">Baghpat</text>
              <circle cx="380" cy="320" r="12" fill="#7c3aed" />
              <text x="400" y="325" fontSize="12" fill="#0f172a">Project X</text>
            </svg>
          </div>
        </div>

        <aside className="w-80 bg-white rounded-md p-3 shadow-inner overflow-auto">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Project nodes</h3>
            <p className="text-sm text-slate-500">Click a node for details</p>
          </div>

          <ul className="space-y-3">
            <li>
              <Link href="/projects/helios-baghpat" className="block hover:bg-slate-50 p-2 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-md flex items-center justify-center text-white font-bold">HB</div>
                  <div>
                    <div className="font-medium">Helios#Baghpat</div>
                    <div className="text-xs text-slate-500">Agrivoltaic microgrid — 12.4 MWp</div>
                  </div>
                </div>
              </Link>
            </li>

            <li>
              <Link href="/projects/project-x" className="block hover:bg-slate-50 p-2 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-md flex items-center justify-center text-slate-700">PX</div>
                  <div>
                    <div className="font-medium">Project X</div>
                    <div className="text-xs text-slate-500">Rural solar + storage pilot</div>
                  </div>
                </div>
              </Link>
            </li>
          </ul>

          <div className="mt-4">
            <HeliosBaghpatMapNode />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProjectMap;
