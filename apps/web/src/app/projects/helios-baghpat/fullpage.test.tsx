import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

// Mock live hook
vi.mock('@/lib/api/heliosBaghpat', () => ({
  useHeliosLiveStats: () => ({
    data: {
      solar_kwh: 100,
      btc_mined: 0.002,
      crop_yield_percent: 66,
      members: 1200,
      updated_at: Date.now()
    },
    loading: false,
    error: null
  })
}))

// Mock heavy child components
vi.mock('@/components/project/community/CommunityHub', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'community-hub' }, 'Community Hub')
}))
vi.mock('@/components/project/opportunities/OpportunitiesHub', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'opportunities-hub' }, 'Opportunities Hub')
}))

import HeliosBaghpatProject from './page'

describe('Helios#Baghpat full page', () => {
  it('switches between tabs', () => {
    render(<HeliosBaghpatProject />)
    // Overview visible
    expect(screen.getByText(/About Helios#Baghpat/i)).toBeTruthy()

  // Click Community Hub tab
  const communityBtn = screen.getByRole('button', { name: /Community Hub/i })
  fireEvent.click(communityBtn)
  expect(screen.getByTestId('community-hub')).toBeTruthy()

    // Click Opportunities tab
  const oppBtn = screen.getByRole('button', { name: /Opportunities/i })
  fireEvent.click(oppBtn)
  expect(screen.getByTestId('opportunities-hub')).toBeTruthy()
  })
})
