"use client"

import React, { useState } from 'react';
import DashboardView from './DashboardView';
import Header from './Header';
import Footer from './Footer';

export default function HHDAODashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="helioshash-dao-app">
      {/* Header component likely handles its own state internally */}
      <Header />
      <main>
        {renderSection()}
      </main>
      <Footer />
    </div>
  );
}
