import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'

// Mock the live stats hook to return deterministic data
vi.mock('@/lib/api/heliosBaghpat', () => ({
  useHeliosLiveStats: () => ({
    data: {
      solar_kwh: 123.45,
      btc_mined: 0.0012,
      crop_yield_percent: 55,
      members: 1500,
      updated_at: Date.now()
    },
    loading: false,
    error: null
  })
}))

// Mock heavy child components to avoid path/alias resolution in test runner
vi.mock('@/components/project/community/CommunityHub', () => ({
  __esModule: true,
  default: () => React.createElement('div', {}, 'Community Hub')
}))
vi.mock('@/components/project/opportunities/OpportunitiesHub', () => ({
  __esModule: true,
  default: () => React.createElement('div', {}, 'Opportunities')
}))

// Mock simple UI primitives used by the page
vi.mock('@/components/ui/badge', () => ({
  __esModule: true,
  Badge: () => React.createElement('span', {}, 'Badge')
}))
vi.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: () => React.createElement('button', {}, 'Button')
}))
vi.mock('@/components/ui/card', () => ({
  __esModule: true,
  Card: () => React.createElement('div', {}, 'Card'),
  CardHeader: () => React.createElement('div', {}, 'CardHeader'),
  CardContent: () => React.createElement('div', {}, 'CardContent'),
  CardTitle: () => React.createElement('div', {}, 'CardTitle'),
  CardDescription: () => React.createElement('div', {}, 'CardDescription')
}))

import HeliosBaghpatOverview from '../../../components/project/HeliosBaghpatOverview'

describe('Helios#Baghpat Overview', () => {
  it('renders overview and live stats', () => {
    render(<HeliosBaghpatOverview />)
  expect(screen.getByText(/Solar Today/i)).toBeTruthy()
  expect(screen.getByText(/123.45 kWh/)).toBeTruthy()
  expect(screen.getByText(/BTC Mined/i)).toBeTruthy()
  })

  it('calls onViewBoard when view board clicked', () => {
    const onView = vi.fn()
    render(<HeliosBaghpatOverview onViewBoard={onView} />)
    const btn = screen.getByRole('button', { name: /View Board/i })
    fireEvent.click(btn)
    expect(onView).toHaveBeenCalled()
  })
})
