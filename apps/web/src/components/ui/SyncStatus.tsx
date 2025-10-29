import React from 'react';

interface SyncStatusProps {
  lastSynced: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ lastSynced }) => (
  <div className="text-xs text-gray-400 mt-2" aria-live="polite">
    Last synced at: {lastSynced}
  </div>
);
