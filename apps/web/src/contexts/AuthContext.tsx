'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '@/lib/actorFactory';
import { hhdaoIdlFactory } from '@/lib/hhdaoIdl';

interface User {
  principal: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  // Backwards-compatible fields for legacy wallet components
  isConnected: boolean;
  walletType: string | null;
  principal: string | null;
  connect: (type: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isClient, setIsClient] = useState(false);

  const logout = useCallback(async () => {
    if (authClient) {
      try {
        await authClient.logout();
      } catch {
        // ignore logout errors
      }
    }
    setUser(null);
  }, [authClient]);

  const handleAuthentication = useCallback(async (identity: unknown): Promise<void> => {
    try {
      // Narrow the unknown identity to the minimal shape we need
      type PrincipalLike = { toText?: () => string; isAnonymous?: () => boolean }
      const maybeIdentity = identity as { getPrincipal?: () => PrincipalLike };
      if (typeof maybeIdentity.getPrincipal !== 'function') {
        throw new Error('Invalid identity object');
      }

      const principal = maybeIdentity.getPrincipal();
      if (principal) {
        const p = principal as PrincipalLike
        if (typeof p.isAnonymous === 'function' && p.isAnonymous()) {
          throw new Error('Anonymous identity not allowed');
        }
      }

      // Create actor and verify authentication with backend
      const canisterId = process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID;
      if (!canisterId) {
        throw new Error('HHDAO canister ID not configured');
      }

  // createActor expects an `Identity` instance from @dfinity/agent
  await createActor(canisterId, hhdaoIdlFactory, identity as Identity);

      const principalText = typeof principal?.toText === 'function' ? principal.toText() : String(principal);
      setUser({
        principal: principalText,
        name: `User ${principalText.slice(0, 8)}...`,
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    setIsClient(true);

    (async function initializeAuth() {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        if (await client.isAuthenticated()) {
          await handleAuthentication(client.getIdentity());
        }
      } catch (error) {
        console.error("Failed to initialize auth client:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [handleAuthentication]);

  const login = async () => {
    if (!authClient) {
      throw new Error("Auth client not initialized");
    }

    try {
      // Determine identity provider. In local dev we may prefer a local
      // identity provider (dfx replica), but if it's unreachable we should
      // fall back to the public identity provider to avoid connection-refused
      // errors that can interrupt client rendering.
      let identityProvider = 'https://identity.ic0.app';
      if (process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic') {
        const localIi = `http://127.0.0.1:4943/?canisterId=${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}`;
        try {
          // probe local replica health endpoint
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 1000);
          const host = 'http://127.0.0.1:4943';
          await fetch(`${host}/api/v2/status`, { signal: controller.signal }).finally(() => clearTimeout(id));
          // local replica reachable, prefer local II in dev
          identityProvider = localIi;
        } catch {
          // fallback stays as https://identity.ic0.app
          // eslint-disable-next-line no-console
          console.warn('Local identity provider unreachable, falling back to https://identity.ic0.app');
        }
      }

      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          await handleAuthentication(authClient.getIdentity());
        },
        onError: (error) => {
          console.error("Login failed:", error);
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Provide default values when not on client
  const value: AuthContextType = {
    user: isClient ? user : null,
    isAuthenticated: isClient ? !!user : false,
    login,
    logout,
    isLoading: isClient ? isLoading : true,
    // legacy compatibility fields
    isConnected: isClient ? !!user : false,
    walletType: isClient && user ? 'internet-identity' : null,
    principal: isClient ? user?.principal || null : null,
    connect: login,
    disconnect: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return safe defaults during SSR/static generation
    return {
      user: null,
      isAuthenticated: false,
      login: async () => {},
      logout: async () => {},
      isLoading: true,
      isConnected: false,
      walletType: null,
      principal: null,
      connect: async () => {},
      disconnect: async () => {},
    };
  }
  return context;
}
