import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Proves the post-connect redirect wiring added for the /dashboard auth gate:
// login(returnTo) must navigate to `returnTo` on success, and login() with no
// argument must fall back to the default landing route. The real Internet
// Identity round-trip can't complete in CI, so this drives a stubbed
// AuthClient whose login() immediately resolves its onSuccess callback.

const { pushMock, loginImpl, stubClient } = vi.hoisted(() => {
  const loginImpl = vi.fn(async (opts: { onSuccess: () => Promise<void> | void }) => {
    await opts.onSuccess();
  });
  const stubClient = {
    isAuthenticated: vi.fn(async () => false),
    getIdentity: () => ({
      getPrincipal: () => ({ toText: () => 'aaaaa-aa', isAnonymous: () => false }),
    }),
    login: loginImpl,
    logout: vi.fn(async () => {}),
  };
  return { pushMock: vi.fn(), loginImpl, stubClient };
});

vi.mock('@dfinity/auth-client', () => ({
  AuthClient: { create: vi.fn(async () => stubClient) },
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
}));
vi.mock('@/lib/canisters/identity', () => ({
  ensureKycAndMint: vi.fn(async () => ({})),
}));

import { AuthProvider, useAuth } from './AuthContext';

function Consumer({ returnTo }: { returnTo?: string }) {
  const { login, isLoading } = useAuth();
  return (
    <div>
      <span>{isLoading ? 'loading' : 'ready'}</span>
      <button onClick={() => { void login(returnTo); }}>go</button>
    </div>
  );
}

beforeEach(() => {
  // Skip the local-replica probe in login() so it resolves deterministically.
  vi.stubEnv('NEXT_PUBLIC_DFX_NETWORK', 'ic');
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('post-connect redirect', () => {
  it('returns the user to the originating route when login(returnTo) is given', async () => {
    render(
      <AuthProvider>
        <Consumer returnTo="/dashboard" />
      </AuthProvider>,
    );

    // Wait until the AuthClient is ready (login throws otherwise).
    await screen.findByText('ready');
    fireEvent.click(screen.getByText('go'));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/dashboard'));
    expect(pushMock).not.toHaveBeenCalledWith('/helioshash-dao');
  });

  it('falls back to the default landing route when no returnTo is given', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await screen.findByText('ready');
    fireEvent.click(screen.getByText('go'));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/helioshash-dao'));
  });
});
