"use client";

import React from 'react';

type Props = {
  activeSetting?: string | null;
  setActiveSetting?: (s: string | null) => void;
  userData?: any;
};

const SettingsMenu: React.FC<Props> = ({ activeSetting, setActiveSetting, userData }) => {
  const sections = ['Profile', 'Wallet', 'Security', 'Preferences', 'Notifications', 'About'];

  return (
    <div className="space-y-2">
      <div className="text-gray-300 mb-3">Signed in as {userData?.name ?? 'Guest'}</div>
      {sections.map((s) => (
        <div key={s} className="flex items-center justify-between bg-gray-800/60 p-3 rounded-md">
          <div>
            <p className="font-medium">{s}</p>
            <p className="text-sm text-gray-400">Manage {s.toLowerCase()}</p>
          </div>
          <button onClick={() => setActiveSetting?.(s)} className="px-3 py-1 bg-gray-700 rounded">Open</button>
        </div>
      ))}
      {activeSetting && <div className="text-gray-300 mt-3">Active: {activeSetting}</div>}
    </div>
  );
};

export default SettingsMenu;
