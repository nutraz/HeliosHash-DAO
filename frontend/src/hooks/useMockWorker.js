// Small hook to load MSW worker in development when APP_MODE=demo
import { useEffect } from 'react'

export default function useMockWorker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (process.env.NEXT_PUBLIC_APP_MODE !== 'demo' && process.env.APP_MODE !== 'demo') return
    
    // Check if mocks are available before importing. We expect the mocks module
    // to expose an async factory `getWorker()` so bundlers don't resolve 'msw'
    // during production builds.
    const loadMockWorker = async () => {
      try {
        const mod = await import('../mocks/browser')
        // support both legacy `worker` export and new `getWorker()` factory
        if (typeof mod.getWorker === 'function') {
          const worker = await mod.getWorker()
          await worker.start()
        } else if (mod.worker) {
          await mod.worker.start()
        } else {
          console.warn('Mocks module did not export worker or getWorker')
        }
        console.log('MSW started successfully')
      } catch (error) {
        console.warn('MSW not available - continuing without mocks', error && error.message ? error.message : error)
        // Continue without mocks - this is safe for production
      }
    }
    
    loadMockWorker()
  }, [])
}
