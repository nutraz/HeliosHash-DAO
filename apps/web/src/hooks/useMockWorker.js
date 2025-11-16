// Small hook to load MSW worker in development when APP_MODE=demo
import { useEffect } from 'react'

export default function useMockWorker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (process.env.NEXT_PUBLIC_APP_MODE !== 'demo' && process.env.APP_MODE !== 'demo') return
    // Dynamically import and start the worker
    import('../mocks/browser').then(({ worker }) => {
      worker.start()
        .then(() => console.log('MSW started'))
        .catch((e) => console.warn('MSW failed', e))
    }).catch(e => console.warn('MSW import failed', e))
  }, [])
}
