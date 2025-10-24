'use client';

import { AuthClient } from '@dfinity/auth-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    AuthClient.create().then(async client => {
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setPrincipal(client.getIdentity().getPrincipal().toString());
      }
    });
  }, []);

  const login = async () => {
    const client = await AuthClient.create();
    await client.login({
      onSuccess: () => {
        setIsAuthenticated(true);
        setPrincipal(client.getIdentity().getPrincipal().toString());
      },
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, principal, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return {
    user: context.isAuthenticated ? { principal: context.principal } : null,
  };
};
