import { describe, it, expect } from 'vitest'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

// Test the default initial state by calling the store directly
describe('dashboard store', () => {
  it('has sane defaults and can update', () => {
    const store = useDashboardStore.getState()
    expect(store.authenticated).toBe(false)
    expect(store.loading).toBe(false)
    store.setAuthenticated(true)
    store.setUser({ name: 'Test' } as any)
    expect(useDashboardStore.getState().authenticated).toBe(true)
    expect(useDashboardStore.getState().user?.name).toBe('Test')
    store.reset()
    expect(useDashboardStore.getState().authenticated).toBe(false)
  })
})
