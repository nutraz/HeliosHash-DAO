export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 HeliosHash DAO</h1>
      <p>Security headers are now active! Check your browser console for CSP reports.</p>
      <div>
        <h2>Security Features Enabled:</h2>
        <ul>
          <li>✅ Content Security Policy (Report-Only)</li>
          <li>✅ HSTS Headers</li>
          <li>✅ X-Frame-Options: DENY</li>
          <li>✅ X-Content-Type-Options: nosniff</li>
          <li>✅ CSP Violation Reporting</li>
        </ul>
      </div>
    </div>
  );
}
