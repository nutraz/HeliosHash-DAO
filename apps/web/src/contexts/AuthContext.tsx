'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// Note: avoid importing Identity as a TS namespace type here to prevent
// compatibility issues with different @dfinity/agent type exports.
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '@/lib/actorFactory';
import { hhdaoIdlFactory } from '@/lib/hhdaoIdl';
import { ensureKycAndMint } from '@/lib/canisters/identity';

interface User {
  principal: string;
  name?: string;
  email?: string;
  avatar?: string;
  kycStatus?: string;
  idNftMinted?: boolean;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  updateRoles: (roles: string[]) => Promise<void>;
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const STORAGE_KEY = 'helioshash_user';

  const saveUserToStorage = useCallback((u: User | null) => {
    try {
      if (!u) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const minimal = { principal: u.principal, name: u.name, email: u.email, avatar: u.avatar, roles: u.roles || [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const loadUserFromStorage = useCallback((): Partial<User> | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    if (authClient) {
      try {
        await authClient.logout();
      } catch {
        // ignore logout errors
      }
    }
    setUser(null);
    // Reset auth-checked guard on logout so login flows can re-run
    authenticationChecked.current = false;
  }, [authClient]);

  // Stable ref to the authentication handler to avoid recreating the function
  // and triggering effect dependency loops.
  const handleAuthenticationRef = useRef<((identity: unknown) => Promise<void>) | null>(null);

  useEffect(() => {
    handleAuthenticationRef.current = async (identity: unknown): Promise<void> => {
      console.log('handleAuthentication called');
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

        // Create actor and verify authentication with backend if configured.
        // Actor creation can fail in dev (CSP, network, or replica down). We
        // should not throw on actor creation failure — proceed without backend
        // connectivity so the UI remains usable.
        const shouldCreateActor = process.env.NEXT_PUBLIC_ENABLE_ACTOR === 'true';

        if (!shouldCreateActor) {
          // Actor creation disabled by env; skip creating actor in dev by default
          // eslint-disable-next-line no-console
          console.warn('Actor creation skipped (NEXT_PUBLIC_ENABLE_ACTOR is not true)');
        } else {
          const canisterId = process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID;
          if (!canisterId) {
            // In local dev it's common not to have canister IDs; continue but warn.
            // Avoid throwing here so the UI can proceed and developer can still
            // test the login flow without a backend configured.
            // eslint-disable-next-line no-console
            console.warn('HHDAO canister ID not configured; skipping backend actor creation for local dev');
          } else {
            // createActor expects an identity-like object; cast to `any` to avoid
            // type errors stemming from mismatched Identity declarations.
            try {
              await createActor(canisterId, hhdaoIdlFactory, identity as any);
            } catch (actorError) {
              // Log and continue — don't throw to avoid triggering global auth error loops
              // eslint-disable-next-line no-console
              console.warn('Actor creation failed, continuing without backend connection:', actorError);
            }
          }
        }

        const principalText = typeof principal?.toText === 'function' ? principal.toText() : String(principal);
        // Base profile assembled from identity/principal and local wallet
        const baseProfile = {
          principal: principalText,
          name: `User ${principalText.slice(0, 8)}...`,
          email: undefined,
          avatar: undefined,
          kycStatus: 'unknown',
          idNftMinted: false,
        };

        setUser(baseProfile);

        // Kick off KYC + ID NFT issuance in the background; don't block UI.
        (async () => {
          try {
            const k = await ensureKycAndMint(identity, principalText, { name: baseProfile.name });
            if (k?.kyc) {
              setUser((prev) => prev ? { ...prev, kycStatus: k.kyc } : prev);
            }
            if (k?.minted) {
              setUser((prev) => prev ? { ...prev, idNftMinted: true } : prev);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Background KYC/mint failed', e);
          }
        })();

        // Navigate to the dashboard after successful authentication.
        try {
          router.push('/helioshash-dao');
        } catch (e) {
          // ignore navigation errors during SSR or tests
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        await logout();
      }
    };
  }, [logout, router]);

  // Debug: log re-renders and key auth state
  useEffect(() => {
    // Debug: log when key auth state changes (avoid logging on every render)
    console.log('AuthContext state', {
      user,
      authClient: !!authClient,
      isLoading,
      isClient,
    });
  }, [user, authClient, isLoading, isClient]);

  // Prevent multiple authentication checks from racing/re-triggering
  const authenticationChecked = useRef(false);

  useEffect(() => {
    setIsClient(true);

    (async function initializeAuthClient() {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
      } catch (error) {
        console.error("Failed to initialize auth client:", error);
      } finally {
        setIsLoading(false);
      }
    })();

    // hydrate user roles/profile from localStorage if present
    try {
      const stored = loadUserFromStorage();
      if (stored && (stored as any).principal) {
        setUser((prev) => ({ ...(prev || {}), principal: (stored as any).principal, name: (stored as any).name, email: (stored as any).email, avatar: (stored as any).avatar, roles: (stored as any).roles || [] } as User));
      }
    } catch (e) {
      // ignore
    }
  }, []); // Run only once on mount

  // Separate effect to check authentication once authClient is available
  useEffect(() => {
    if (!authClient) return;
    if (authenticationChecked.current) return;
    if (retryCount >= MAX_RETRIES) return;
    if (user) return; // already authenticated in state, no need to re-run

    (async function checkAuthentication() {
      authenticationChecked.current = true;
      try {
        console.log('Auth check triggered');
        if (await authClient.isAuthenticated()) {
          console.log('User is authenticated, proceeding with authentication...');
          await handleAuthenticationRef.current?.(authClient.getIdentity());
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        // increment retry count to avoid infinite retry loops
        setRetryCount((prev) => prev + 1);
        // allow another attempt later
        authenticationChecked.current = false;
      }
    })();
  }, [authClient, retryCount]); // Now handleAuthentication is stable

  const login = useCallback(async () => {
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
          await handleAuthenticationRef.current?.(authClient.getIdentity());
        },
        onError: (error) => {
          console.error("Login failed:", error);
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [authClient]);

  // update roles (persisted)
  const updateRoles = useCallback(async (roles: string[]) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, roles } : null;
      try { saveUserToStorage(updated as User); } catch {}
      return updated;
    });
  }, [saveUserToStorage]);

  // persist user changes to localStorage (minimal profile)
  useEffect(() => {
    if (!isClient) return;
    try { saveUserToStorage(user); } catch {}
  }, [user, isClient, saveUserToStorage]);

  // Provide default values when not on client
  const value: AuthContextType = React.useMemo(
    () => ({
      user: isClient ? user : null,
      isAuthenticated: isClient ? !!user : false,
      updateRoles,
      login,
      logout,
      isLoading: isClient ? isLoading : true,
      // legacy compatibility fields
      isConnected: isClient ? !!user : false,
      walletType: isClient && user ? 'internet-identity' : null,
      principal: isClient ? user?.principal || null : null,
      connect: login,
      disconnect: logout,
    }),
    [user, isClient, isLoading, login, logout, updateRoles]
  );

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
      updateRoles: async () => {},
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
