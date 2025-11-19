'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import Onboarding from './components/Onboarding';
import ProfileSection from './components/ProfileSection';
import SettingsSection from './components/SettingsSection';
import Footer from './components/Footer';
import HHDAODashboard from './components/HHDAODashboard';
import '../styles/hiidao-fusion.css';

export default function HiIDAOFusion() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<{ method?: string; principal?: string; name?: string } | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = (result: { method: string; principal?: string; name?: string }) => {
    console.log('Authenticated with', result.method, result.principal);
    setIsAuthenticated(true);
    setSession(result);
    try {
      localStorage.setItem('hiidao_session', JSON.stringify(result));
    } catch (e) {
      // ignore storage errors in some environments
    }
  };

  useEffect(() => {
    // Rehydrate session from localStorage
    try {
      const raw = localStorage.getItem('hiidao_session');
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.method) {
          setSession(obj);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return isAuthenticated ? <HHDAODashboard /> : <Dashboard />;
      case 'onboarding':
        return <Onboarding />;
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="hiidao-fusion-app">
      <Header 
        onLoginClick={handleLoginClick}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          setIsAuthenticated(false);
          setSession(null);
          try { localStorage.removeItem('hiidao_session'); } catch (e) {}
        }}
      />
      <main className="main-content">
        <Hero />
        {renderActiveSection()}
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
