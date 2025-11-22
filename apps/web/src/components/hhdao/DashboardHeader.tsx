"use client";

import React from "react";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">HeliosHash / UrgamU Platform</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="/pfp.png" alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <div className="text-gray-900 dark:text-gray-100 font-semibold">Rajesh Soni</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Rank: Explorer | Level: 5</div>
          </div>
        </div>
      </div>
    </header>
  );
}
