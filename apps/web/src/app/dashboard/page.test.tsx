import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// H0c.2: the dashboard route must gate private content behind Internet
// Identity auth. These tests drive the three auth states the gate handles.

// Auth state is supplied per-test via this mutable holder so a single
// module-level mock can serve loading / unauthenticated / authenticated.
const authState: {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  principal: string | null;
} = {
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(async () => {}),
  principal: null,
};
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => authState,
}));

// Only the authenticated branch mounts DashboardContent, which fetches solar
// data on mount — keep it deterministic and offline.
vi.mock('@/services/icpService', () => ({
  icpService: {
    getSolarEnergy: async () => 720,
    getPanelCount: async () => 1200,
    getLocation: async () => 'Baghpat, Uttar Pradesh, India',
  },
}));

import DashboardPage from './page';

beforeEach(() => {
  authState.isAuthenticated = false;
  authState.isLoading = false;
  authState.principal = null;
  // DashboardContent reads matchMedia/localStorage on mount; jsdom lacks
  // matchMedia, so stub it for the authenticated render.
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('DashboardPage auth gate (H0c.2)', () => {
  it('shows a neutral loading state and no dashboard content while auth is resolving', () => {
    authState.isLoading = true;
    render(<DashboardPage />);

    expect(screen.getByTestId('dashboard-auth-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-auth-gate')).not.toBeInTheDocument();
    // Private dashboard content must not appear during loading.
    expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument();
    expect(screen.queryByText('DAO Modules')).not.toBeInTheDocument();
  });

  it('shows the connect gate and no dashboard content when unauthenticated', () => {
    authState.isAuthenticated = false;
    authState.isLoading = false;
    render(<DashboardPage />);

    expect(screen.getByTestId('dashboard-auth-gate')).toBeInTheDocument();
    expect(screen.getByText('Connect Internet Identity to continue')).toBeInTheDocument();
    // Private dashboard content must not render for unauthenticated visitors.
    expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument();
    expect(screen.queryByText('DAO Modules')).not.toBeInTheDocument();
  });

  it('renders the dashboard when authenticated', async () => {
    authState.isAuthenticated = true;
    authState.isLoading = false;
    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText('Quick Actions')).toBeInTheDocument());
    expect(screen.getByText('DAO Modules')).toBeInTheDocument();
    // The gate must not be present for authenticated users.
    expect(screen.queryByTestId('dashboard-auth-gate')).not.toBeInTheDocument();
  });

  it('shows the connected principal (not a fabricated identity) when authenticated', async () => {
    authState.isAuthenticated = true;
    authState.isLoading = false;
    authState.principal = 'abc12-def34-ghi56-jkl78-cai';
    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText('Quick Actions')).toBeInTheDocument());
    // Truncated principal is shown, with a copy affordance and full value in title.
    expect(screen.getByText('abc12...cai')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy full principal')).toBeInTheDocument();
    expect(screen.getByTitle('abc12-def34-ghi56-jkl78-cai')).toBeInTheDocument();
    // No fabricated identity must render.
    expect(screen.queryByText('Rahul Kumar')).not.toBeInTheDocument();
    expect(screen.queryByText('Investor & Collaborator')).not.toBeInTheDocument();
    expect(screen.queryByText('Level 6')).not.toBeInTheDocument();
    expect(screen.queryByText('Reputation Score')).not.toBeInTheDocument();
    expect(screen.queryByText('DAO Tier')).not.toBeInTheDocument();
  });

  it('shows a plausible demo solar-energy metric, not the impossible 420M', async () => {
    authState.isAuthenticated = true;
    authState.isLoading = false;
    render(<DashboardPage />);

    // Card value resolves once loadSolarData runs (mocked getSolarEnergy → 720).
    await waitFor(() => expect(screen.getByText('720')).toBeInTheDocument());
    expect(screen.getByText('Solar Energy (MWh/year) (demo)')).toBeInTheDocument();
    // Recent Activity must agree with the card (same value + unit, consistent panels).
    expect(screen.getByText(/720 MWh\/year \(demo\) from 1200 panels/)).toBeInTheDocument();
    // The impossible millions figure must be gone everywhere on the dashboard.
    expect(screen.queryByText(/420M/)).not.toBeInTheDocument();
  });
});
