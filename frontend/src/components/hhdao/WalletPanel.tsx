"use client";

import React from 'react';
import TokenTransfer from '../dashboard/TokenTransfer';
import { ICPCanisterService } from '@/lib/services/icpService';
import { SecurityService } from '@/lib/services/securityService';
import type { ProfileStats } from './ProfileSection';

export interface WalletPanelProps {
  stats: ProfileStats;
  canisterService: ICPCanisterService;
  securityService: SecurityService;
  onTransferSuccess: () => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({
  stats,
  canisterService,
  securityService,
  onTransferSuccess,
}) => {
  return (
    <div className="space-y-6">
      <TokenTransfer
        canisterService={canisterService}
        securityService={securityService}
        onSuccess={onTransferSuccess}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded shadow-sm bg-white dark:bg-gray-800">
          <div className="text-sm text-gray-500">Contributions</div>
          <div className="text-xl font-bold">{stats.contributions}</div>
        </div>
        <div className="p-4 rounded shadow-sm bg-white dark:bg-gray-800">
          <div className="text-sm text-gray-500">Rewards</div>
          <div className="text-xl font-bold">{stats.rewards} HHU</div>
        </div>
        <div className="p-4 rounded shadow-sm bg-white dark:bg-gray-800">
          <div className="text-sm text-gray-500">Projects</div>
          <div className="text-xl font-bold">{stats.projectCount}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletPanel;
