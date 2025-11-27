"use client"

// Prevent static prerender for the error route
export const dynamic = 'force-dynamic'

export default function Error({ error, reset }) {
  // reference error to avoid "defined but never used" during linting
  void error
  return (
    <div style={{ padding: '48px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', margin: 0 }}>Something went wrong!</h2>
      <button
        onClick={reset}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Try Again
      </button>
    </div>
  )
}
