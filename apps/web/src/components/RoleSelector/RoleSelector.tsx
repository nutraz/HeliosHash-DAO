"use client";

import React from 'react';

type Props = {
  availableRoles: string[];
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
};

export default function RoleSelector({ availableRoles, selectedRoles, onChange }: Props) {
  const toggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {availableRoles.map((role) => {
        const active = selectedRoles.includes(role);
        return (
          <button
            key={role}
            type="button"
            onClick={() => toggle(role)}
            className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${active ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}
          >
            <input
              type="checkbox"
              checked={active}
              readOnly
              className="mr-2 hidden"
              aria-hidden
            />
            <span className="text-sm font-medium">{role}</span>
          </button>
        );
      })}
    </div>
  );
}
