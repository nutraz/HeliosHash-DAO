"use client";

import React from "react";

interface Props {
  setActiveModule: (module: string) => void;
}

export default function SidebarNavigation({ setActiveModule }: Props) {
  const menu = [
    { label: "Home", key: "home" },
    { label: "Wallet", key: "wallet" },
    { label: "NFT Collection", key: "nft" },
    { label: "Opportunities", key: "opportunities" },
    { label: "Explore Projects", key: "projects" },
    { label: "Rewards", key: "rewards" },
    { label: "Social Hub", key: "social" },
    { label: "DAO Center", key: "dao" },
    { label: "UrgamU Delhi", key: "urgamU" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="px-4 py-6 font-bold text-gray-900 dark:text-gray-100">Navigation</div>
      <nav className="flex-1 px-2 space-y-2">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveModule(item.key)}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
