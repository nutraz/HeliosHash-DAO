// Small hook to load MSW worker in development when APP_MODE=demo
import { useEffect } from 'react'

export default function useMockWorker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (process.env.NEXT_PUBLIC_APP_MODE !== 'demo' && process.env.APP_MODE !== 'demo') return
    
    // Check if mocks are available before importing
    const loadMockWorker = async () => {
      try {
        const { worker } = await import('../mocks/browser')
        await worker.start()
        console.log('MSW started successfully')
      } catch (error) {
        console.warn('MSW not available - continuing without mocks', error.message)
        // Continue without mocks - this is safe for production
      }
    }
    
    loadMockWorker()
  }, [])
}
