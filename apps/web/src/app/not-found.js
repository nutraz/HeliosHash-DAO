// Opt out of static prerendering for this route to avoid SSR client-only issues
export const dynamic = 'force-dynamic'

// Simple server-renderable not-found page for the App Router
export default function NotFound() {
  return (
    <html>
      <body style={{ padding: 40, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
        <p style={{ marginTop: 12, fontSize: 16 }}>Page not found.</p>
      </body>
    </html>
  )
}
