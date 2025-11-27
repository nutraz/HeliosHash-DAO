import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';

type Action = {
  id: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export const QuickActions: React.FC<{ actions: Action[] }> = ({ actions }) => {
  useRenderTrace('QuickActions', { len: actions.length });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={a.onClick}
          className="bg-white/80 dark:bg-slate-900/70 p-4 rounded-lg shadow-sm text-left hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              {a.icon ?? a.title[0]}
            </div>
            <div>
              <div className="font-semibold">{a.title}</div>
              {a.subtitle && <div className="text-sm text-gray-500">{a.subtitle}</div>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
