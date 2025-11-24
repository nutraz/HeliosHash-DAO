import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';

export const SocialHubButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  useRenderTrace('SocialHubButton');
  return (
    <button onClick={onClick} className="w-full bg-sky-50 rounded-lg p-3 shadow-sm">
      <div className="font-semibold">Social Hub</div>
      <div className="text-xs text-gray-500">Community feed & groups</div>
    </button>
  );
};

export default SocialHubButton;
