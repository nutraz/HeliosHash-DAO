"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeContextValue = {
  glowIntensity: number;
  setGlowIntensity: (v: number) => void;
  animationSpeed: string;
  setAnimationSpeed: (s: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useHHDAOTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useHHDAOTheme must be used within HHDAOThemeProvider');
  return ctx;
};

export function HHDAOThemeProvider({ children }: { children: React.ReactNode }) {
  const [glowIntensity, setGlowIntensity] = useState<number>(1);
  const [animationSpeed, setAnimationSpeed] = useState<string>('1s');

  useEffect(() => {
    // Apply CSS variables to document root
    const root = document.documentElement;
    root.style.setProperty('--hh-glow-intensity', String(glowIntensity));
    root.style.setProperty('--hh-animation-speed', animationSpeed);
  }, [glowIntensity, animationSpeed]);

  // Ensure base theme variables are present and in sync with CSS defaults.
  useEffect(() => {
    const root = document.documentElement;
    // Only set defaults if not already provided (allows CSS to override)
    if (!root.style.getPropertyValue('--hh-primary')) root.style.setProperty('--hh-primary', '#FB923C');
    if (!root.style.getPropertyValue('--hh-accent')) root.style.setProperty('--hh-accent', '#4ADE80');
    if (!root.style.getPropertyValue('--hh-background-start')) root.style.setProperty('--hh-background-start', '#0F172A');
    if (!root.style.getPropertyValue('--hh-background-end')) root.style.setProperty('--hh-background-end', '#071322');
    if (!root.style.getPropertyValue('--hh-text')) root.style.setProperty('--hh-text', '#FFFFFF');
    if (!root.style.getPropertyValue('--hh-muted')) root.style.setProperty('--hh-muted', '#97A6B2');
    if (!root.style.getPropertyValue('--hh-surface')) root.style.setProperty('--hh-surface', 'rgba(15,15,15,0.95)');
  }, []);

  const value = useMemo(() => ({ glowIntensity, setGlowIntensity, animationSpeed, setAnimationSpeed }), [glowIntensity, animationSpeed]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default HHDAOThemeProvider;
