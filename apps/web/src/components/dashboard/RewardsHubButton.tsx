import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';

export const RewardsHubButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  useRenderTrace('RewardsHubButton');
  return (
    <button onClick={onClick} className="w-full bg-yellow-50 rounded-lg p-3 shadow-sm">
      <div className="font-semibold">Rewards Hub</div>
      <div className="text-xs text-gray-500">Convert points, redeem rewards</div>
    </button>
  );
};

export default RewardsHubButton;
