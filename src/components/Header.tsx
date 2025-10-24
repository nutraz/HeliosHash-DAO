'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [language, setLanguage] = useState('en');
  const [voiceActive, setVoiceActive] = useState(false);
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const headingText = language === 'hi' ? 'हेलिओसहैश' : 'HeliosHash DAO';

  return (
    <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white" data-testid="main-heading">
              {headingText}
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8" aria-label="Navigation menu">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="dashboard-link">
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </Link>
            <Link href="/projects" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="projects-nav">
              {language === 'hi' ? 'परियोजनाएं' : 'Projects'}
            </Link>
            <Link href="/governance" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="governance-nav">
              {language === 'hi' ? 'शासन' : 'Governance'}
            </Link>
            <Link href="/wallet" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="wallet-nav">
              {language === 'hi' ? 'वॉलेट' : 'Wallet'}
            </Link>
            <Link href="/community" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="community-nav">
              {language === 'hi' ? 'समुदाय' : 'Community'}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative" data-testid="language-selector">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                data-testid="language-select"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi" data-testid="language-hindi">हिंदी</option>
              </select>
            </div>

            {/* Voice Activation */}
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className={`p-2 rounded-md ${voiceActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
              data-testid="voice-activation"
            >
              🎤
              {voiceActive && <span data-testid="voice-indicator" className="ml-1">●</span>}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              data-testid="theme-toggle"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              data-testid="mobile-menu-button"
            >
              ☰
            </button>

            {/* User Profile */}
            <div data-testid="user-profile" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                U
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t dark:border-gray-700">
            <nav className="px-4 py-2 space-y-2" aria-label="Mobile navigation" data-testid="mobile-menu">
              <Link href="/dashboard" className="block text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="dashboard-link-mobile">
                {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </Link>
              <Link href="/projects" className="block text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="projects-nav-mobile">
                {language === 'hi' ? 'परियोजनाएं' : 'Projects'}
              </Link>
              <Link href="/governance" className="block text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="governance-nav-mobile">
                {language === 'hi' ? 'शासन' : 'Governance'}
              </Link>
              <Link href="/wallet" className="block text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="wallet-nav-mobile">
                {language === 'hi' ? 'वॉलेट' : 'Wallet'}
              </Link>
              <Link href="/community" className="block text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" data-testid="community-nav-mobile">
                {language === 'hi' ? 'समुदाय' : 'Community'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
