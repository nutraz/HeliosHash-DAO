// CSP violation report endpoint
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Log the violation payload. In production, forward to a logging/alerting service.
    try {
      console.log('CSP Violation:', req.body || '(empty payload)');
    } catch (err) {
      console.error('Failed to log CSP report', err);
    }
    // Return 204 (No Content)
    res.status(204).end();
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
  }
}
