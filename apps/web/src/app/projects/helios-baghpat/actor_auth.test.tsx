import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, expect } from 'vitest'

// Test the authenticated actor flow: mock AuthClient as authenticated and
// ensure the actor path is used and surfaces the expected stats.

process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID = 'aaaaa-aa'

vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: async () => ({
      isAuthenticated: async () => true,
      getIdentity: async () => ({ getPrincipal: () => 'principal-1' }),
    }),
  },
}))

// Mock agent to return a unique stat so we can detect the authenticated path
vi.mock('@dfinity/agent', () => ({
  Actor: {
    createActor: (_idlFactory: any, _opts: any) => ({
      get_project_stats: (projectId: string) =>
        Promise.resolve({ ok: { total_energy_kwh: BigInt(9999), efficiency_percentage: BigInt(99), operational_days: BigInt(1000), revenue_generated_usd: BigInt(0), last_production_date: null } }),
    }),
  },
  HttpAgent: function HttpAgent(_opts?: any) { return {} }
}))

vi.mock('@dfinity/candid', () => ({ IDL: {} }))

import HeliosBaghpatOverview from '../../../components/project/HeliosBaghpatOverview'

describe('Helios#Baghpat authenticated actor path', () => {
  it('uses authenticated identity and shows actor stats', async () => {
    render(<HeliosBaghpatOverview />)
    await waitFor(() => expect(screen.getByText(/Solar Today/i)).toBeTruthy())
    // our mocked authenticated actor returns 9999 kWh
    await waitFor(() => expect(screen.getByText(/9999/)).toBeTruthy())
  })
})
