import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'

// Mock auth so component doesn't redirect
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { principal: 'P-TEST', name: 'Tester' }, isAuthenticated: true }),
}))

// Mock theme to avoid error about ThemeProvider - tests don't need full provider
vi.mock('@/lib/theme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: () => {} }),
  ThemeProvider: ({ children }: any) => React.createElement(React.Fragment, null, children),
  default: ({ children }: any) => React.createElement(React.Fragment, null, children),
}))

// Mock Next.js app router for useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

// Mock canister services to return deterministic projects
vi.mock('@/lib/services/icpService', () => ({
  ICPAuthService: function() { return { getPrincipal: () => 'P-TEST' } },
  ICPCanisterService: function() { return {
    getUserData: async () => ({ principal: 'P-TEST', name: 'Tester' }),
    getTokenBalance: async () => 42,
    getProjects: async () => [
      { id: 1, title: 'Baghpat Solar', name: 'Baghpat Solar', description: 'Solar farm', stage: 'development', opportunities: [
        { id: 'o-1', title: 'Install modules', description: 'Fix panels', budget: 45000, status: 'Open' }
      ] }
    ]
  }}
}))

import { useDashboardStore } from '@/lib/stores/dashboardStore'
import HHDAODashboard from '@/components/HHDAODashboard'
import ThemeProvider from '@/lib/theme'

// Reset global store between tests
beforeEach(() => useDashboardStore.setState({ projects: [], user: null, tokenBalance: 0, authenticated: false }))

describe('HHDAODashboard', () => {
  it('renders projects and shows selected project detail when clicked', async () => {
    render(
      <ThemeProvider>
        <HHDAODashboard />
      </ThemeProvider>
    )

    // Wait for the mocked project title to be displayed
    await waitFor(() => expect(screen.getByText(/Baghpat Solar/i)).toBeTruthy())

    // Click the project tile (button)
    const btn = screen.getByRole('button', { name: /Open project Baghpat Solar/i })
    fireEvent.click(btn)

    // The project detail should show the Opportunity
    await waitFor(() => expect(screen.getByText(/Install modules/i)).toBeTruthy())
  })
})
