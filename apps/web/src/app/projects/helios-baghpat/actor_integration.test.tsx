import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Ensure env var for canister id so the actor path attempts to run
process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID = 'aaaaa-aa'

// Mock @dfinity/agent to provide Actor.createActor that returns a test actor
vi.mock('@dfinity/agent', () => {
  return {
    Actor: {
      createActor: (_idlFactory: any, _opts: any) => {
        return {
          get_project_stats: (projectId: string) =>
            Promise.resolve({
              ok: {
                total_energy_kwh: BigInt(500),
                efficiency_percentage: BigInt(88),
                operational_days: BigInt(365),
                revenue_generated_usd: BigInt(123456),
                last_production_date: null,
              },
            }),
        }
      },
    },
    HttpAgent: function HttpAgent() {
      return {}
    },
  }
})

// Mock @dfinity/candid to satisfy dynamic import in the module under test.
vi.mock('@dfinity/candid', () => ({ IDL: {} }))

// Mock auth-client to simulate an unauthenticated session by default
vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: async () => ({ isAuthenticated: async () => false, getIdentity: async () => null }),
  },
}))

// Provide a simple BroadcastChannel mock for jsdom environment
beforeEach(() => {
  // Minimal BroadcastChannel polyfill for tests
  class BC {
    name: string
    onmessage: any = null
    static channels: Record<string, BC[]> = {}
    constructor(name: string) {
      this.name = name
      BC.channels[name] = BC.channels[name] || []
      BC.channels[name].push(this)
    }
    postMessage(msg: any) {
      const peers = BC.channels[this.name] || []
      for (const p of peers) {
        if (p === this) continue
        if (typeof p.onmessage === 'function') {
          p.onmessage({ data: msg })
        }
      }
    }
    close() {
      BC.channels[this.name] = (BC.channels[this.name] || []).filter((p) => p !== this)
    }
  }
  // @ts-ignore
  global.BroadcastChannel = BC
})

// Import the real Overview component (it will use the real hook which in turn
// should call our mocked actor implementation above).
import HeliosBaghpatOverview from '../../../components/project/HeliosBaghpatOverview'

describe('Helios#Baghpat actor integration', () => {
  it('renders actor-backed stats', async () => {
    render(<HeliosBaghpatOverview />)

    // Wait for the hook to populate the view
    await waitFor(() => {
      expect(screen.getByText(/Solar Today/i)).toBeTruthy()
      // our mock actor returns 500 kWh
      expect(screen.getByText(/500/)).toBeTruthy()
    })
  })

  it('updates when BroadcastChannel pushes new stats', async () => {
    render(<HeliosBaghpatOverview />)

    await waitFor(() => screen.getByText(/Solar Today/i))

    // create a broadcaster and post an updated stats message
    // @ts-ignore
    const bc = new BroadcastChannel('helios_stats')
    const newStats = {
      solar_kwh: 900,
      btc_mined: 0.005,
      crop_yield_percent: 92,
      members: 2000,
      updated_at: Date.now(),
    }
    act(() => {
      bc.postMessage({ projectId: 'helios-baghpat', stats: newStats })
    })

    await waitFor(() => {
      expect(screen.getByText(/900/)).toBeTruthy()
    })
  })
})
