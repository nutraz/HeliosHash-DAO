"use client"

import { useState, useCallback } from 'react'
import AuthSelection from '@/components/auth/AuthSelection'

export default function DemoAuthPage() {
  const [result, setResult] = useState<any>(null)

  const onAuthenticated = useCallback((userData: any) => {
    setResult(userData)
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, system-ui, -apple-system' }}>
      <h1>Demo Auth Page</h1>
      <p>Use this page to exercise mocked authentication methods.</p>
      <div style={{ marginTop: 24 }}>
        <AuthSelection onAuthenticated={onAuthenticated} />
      </div>

      <div id="auth-result" style={{ marginTop: 20 }}>
        {result ? (
          <pre data-testid="auth-result">{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <div data-testid="auth-empty">not authenticated</div>
        )}
      </div>
    </div>
  )
}
