"use client";
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Menu, X, Mic, MicOff } from 'lucide-react';

export default function Header() {
  const [language, setLanguage] = useState('en');
  const [voiceActive, setVoiceActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headingText = language === 'hi' ? 'हेलिओसहैश' : 'HeliosHash DAO';

  const navigationItems = [
    { href: '/dashboard', en: 'Dashboard', hi: 'डैशबोर्ड' },
    { href: '/projects', en: 'Projects', hi: 'परियोजनाएं' },
    { href: '/governance', en: 'Governance', hi: 'शासन' },
    { href: '/wallet', en: 'Wallet', hi: 'वॉलेट' },
    { href: '/community', en: 'Community', hi: 'समुदाय' },
  ];

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
              data-testid="main-heading"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">H</span>
              </div>
              {headingText}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Navigation menu">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium relative group px-2 py-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {language === 'hi' ? item.hi : item.en}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative" data-testid="language-selector">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium cursor-pointer"
                data-testid="language-select"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi" data-testid="language-hindi">हिंदी</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <span className="text-muted-foreground">▾</span>
              </div>
            </div>

            {/* Voice Activation */}
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                voiceActive 
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
              }`}
              data-testid="voice-activation"
              aria-label={voiceActive ? 'Disable voice' : 'Enable voice'}
            >
              {voiceActive ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
              {voiceActive && (
                <span 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
                  data-testid="voice-indicator"
                ></span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[color-mix(in_srgb,var(--color-muted)_80%,#000)] hover:scale-105 transition-all duration-200"
              data-testid="theme-toggle"
              aria-label={mounted ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : 'Switch to dark mode'}
            >
              {mounted ? (
                theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all duration-200"
              data-testid="mobile-menu-button"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* User Profile */}
            <div data-testid="user-profile" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold shadow-lg">
                U
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
            <nav className="px-2 py-4 space-y-3" aria-label="Mobile navigation" data-testid="mobile-menu">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {language === 'hi' ? item.hi : item.en}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
