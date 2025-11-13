import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { vi, describe, it, beforeEach, expect } from 'vitest'

// Ensure env var for ws endpoint so the hook opens a WebSocket
process.env.NEXT_PUBLIC_HELIOS_WS = 'wss://example.test/ws'

// Mock @dfinity/agent to short-circuit actor creation in this test
vi.mock('@dfinity/agent', () => ({
  Actor: { createActor: () => ({ get_project_stats: () => Promise.resolve({ ok: { total_energy_kwh: BigInt(10), efficiency_percentage: BigInt(50), operational_days: BigInt(10), revenue_generated_usd: BigInt(0), last_production_date: null } }) }) },
  HttpAgent: function HttpAgent() { return {} }
}))

vi.mock('@dfinity/candid', () => ({ IDL: {} }))
vi.mock('@dfinity/auth-client', () => ({
  AuthClient: { create: async () => ({ isAuthenticated: async () => false, getIdentity: async () => null }) }
}))

// Simple mock WebSocket implementation that allows tests to push messages
class MockWebSocket {
  static instances: MockWebSocket[] = []
  onmessage: ((ev: MessageEvent) => void) | null = null
  onopen: ((ev: Event) => void) | null = null
  url: string
  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
    // simulate open
    setTimeout(() => { if (this.onopen) this.onopen(new Event('open')) }, 0)
  }
  // helper for tests to simulate a server message
  sendServerMessage(data: unknown) {
    if (this.onmessage) this.onmessage({ data: JSON.stringify(data) } as unknown as MessageEvent)
  }
  close() {}
}

global.WebSocket = MockWebSocket as unknown as typeof WebSocket

import HeliosBaghpatOverview from '../../../components/project/HeliosBaghpatOverview'

describe('Helios#Baghpat WS push', () => {
  beforeEach(() => {
    MockWebSocket.instances = []
  })

  it('updates view when ws message arrives', async () => {
    render(<HeliosBaghpatOverview />)

    // wait for initial render
    await waitFor(() => expect(screen.getByText(/Solar Today/i)).toBeTruthy())

    // find created WebSocket instance and push a message
    expect(MockWebSocket.instances.length).toBeGreaterThan(0)
    const inst = MockWebSocket.instances[0]

    const newStats = {
      projectId: 'helios-baghpat',
      stats: {
        solar_kwh: 777,
        btc_mined: 0.01,
        crop_yield_percent: 99,
        members: 3333,
        updated_at: Date.now(),
      }
    }

    act(() => {
      inst.sendServerMessage(newStats)
    })

    await waitFor(() => expect(screen.getByText(/777/)).toBeTruthy())
  })
})
