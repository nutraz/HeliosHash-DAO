import { AuthClient } from '@dfinity/auth-client';

export async function initAuthClient(): Promise<AuthClient> {
  return await AuthClient.create();
}

export async function loginWithProvider(
  authClient: AuthClient,
  identityProvider: string,
  onSuccess?: () => void,
  onError?: (e: unknown) => void
) {
  return authClient.login({
    identityProvider,
    onSuccess: async () => {
      if (onSuccess) await onSuccess();
    },
    onError: (e) => {
      if (onError) onError(e);
    },
  });
}

export async function logoutClient(authClient: AuthClient) {
  try {
    await authClient.logout();
  } catch (e) {
    // swallow logout errors
    // eslint-disable-next-line no-console
    console.warn('AuthClient logout failed', e);
  }
}

export async function isAuthenticated(authClient: AuthClient): Promise<boolean> {
  try {
    return await authClient.isAuthenticated();
  } catch (e) {
    return false;
  }
}

export function getIdentity(authClient: AuthClient) {
  try {
    return authClient.getIdentity();
  } catch (e) {
    return undefined;
  }
}
