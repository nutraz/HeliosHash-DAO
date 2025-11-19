// MainLayout.tsx - Extracted from HHDAODashboard
import React from 'react';

interface MainLayoutProps {
  currentView: string;
  showSettings: boolean;
  selectedProject: any;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentView,
  showSettings,
  selectedProject,
  children
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header and navigation will go here */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      {/* Footer will go here */}
    </div>
  );
};
