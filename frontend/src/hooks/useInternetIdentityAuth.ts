import { useEffect, useState, useCallback } from 'react';
import { ICActorFactory } from '@/lib/ic/actors';

export function useInternetIdentityAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const auth = await ICActorFactory.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        const p = await ICActorFactory.getPrincipal();
        setPrincipal(p);
      } else {
        setPrincipal(null);
      }
    } catch (err) {
      console.error('Auth check failed', err);
      setIsAuthenticated(false);
      setPrincipal(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      await ICActorFactory.login();
      await checkAuth();
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await ICActorFactory.logout();
      await checkAuth();
    } catch (err) {
      console.error('Logout failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  return { isAuthenticated, principal, loading, login, logout, refresh: checkAuth } as const;
}
