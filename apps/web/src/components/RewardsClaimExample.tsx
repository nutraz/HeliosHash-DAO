"use client";

import { useTranslation } from '@/i18n/useTranslation';
import React from 'react';
import { formatINR } from '../utils/currency';

const RewardsClaimExample: React.FC = () => {
  const { t } = useTranslation();

  // Example amount to claim
  const claimAmount = 100.00;

  // Format the currency using the utility
  const formattedAmount = formatINR(claimAmount);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Rewards Claim</h2>
      <p className="text-gray-700">
        {t('rewards.claimAmount', { amount: formattedAmount })}
      </p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Claim Now
      </button>
    </div>
  );
};

export default RewardsClaimExample;
