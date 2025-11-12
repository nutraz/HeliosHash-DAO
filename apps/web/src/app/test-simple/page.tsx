import Link from 'next/link'

export default function TestSimple() {
  return (
    <div style={{ padding: '2rem', background: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <h1>🎯 HeliosHash DAO - System Test</h1>
      <p>If you see this, Next.js routing is working!</p>
      <ul style={{ marginTop: '2rem' }}>
        <li>✅ Server running</li>
        <li>✅ Route resolving</li>
        <li>✅ Component rendering</li>
      </ul>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Go to Home</Link> | {' '}
        <Link href="/dashboard" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Go to Dashboard</Link>
      </div>
    </div>
  )
}
