import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';

export const OpportunitiesButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  useRenderTrace('OpportunitiesButton');
  return (
    <button onClick={onClick} className="w-full bg-emerald-50 rounded-lg p-3 shadow-sm">
      <div className="font-semibold">Opportunities</div>
      <div className="text-xs text-gray-500">Jobs, tasks, volunteering</div>
    </button>
  );
};

export default OpportunitiesButton;
