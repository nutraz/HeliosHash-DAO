"use client";
import { useState, useEffect } from 'react';

// Development-only authentication helper
export class DevAuth {
  private static instance: DevAuth;
  private isAuthenticated = false;

  private constructor() {}

  static getInstance(): DevAuth {
    if (!DevAuth.instance) {
      DevAuth.instance = new DevAuth();
    }
    return DevAuth.instance;
  }

  enableDevMode() {
    if (process.env.NODE_ENV === 'development') {
      this.isAuthenticated = true;
      // Store in localStorage for persistence
      localStorage.setItem('dev-auth', 'true');
      // eslint-disable-next-line no-console
      console.log('🔧 Development authentication enabled');
    }
  }

  disableDevMode() {
    this.isAuthenticated = false;
    localStorage.removeItem('dev-auth');
  }

  isDevAuthenticated(): boolean {
    if (process.env.NODE_ENV !== 'development') return false;
    // Check both memory and localStorage for persistence
    const stored = localStorage.getItem('dev-auth');
    this.isAuthenticated = stored === 'true';
    return this.isAuthenticated;
  }

  // Get headers for API calls
  getAuthHeaders(): HeadersInit {
    if (this.isDevAuthenticated()) {
      return {
        'x-dev-auth': 'true',
        'x-dev-user-id': 'dev-user-123'
      };
    }
    return {};
  }
}

// Hook for React components
export function useDevAuth() {
  const [, setTick] = useState(0);
  const devAuth = DevAuth.getInstance();

  useEffect(() => {
    // no-op, but keeps hook semantics; components can call methods below
    return () => {};
  }, []);

  const enableDevAuth = () => {
    devAuth.enableDevMode();
    // Refresh to apply changes
    window.location.reload();
  };
  const disableDevAuth = () => {
    devAuth.disableDevMode();
    // Refresh to apply changes
    window.location.reload();
  };
  const isDevAuthenticated = () => devAuth.isDevAuthenticated();
  const getAuthHeaders = () => devAuth.getAuthHeaders();

  return {
    enableDevAuth,
    disableDevAuth,
    isDevAuthenticated,
    getAuthHeaders
  };
}
