import { redirect } from 'next/navigation';

// Demo Polish (MVP2): collapse the two dashboards into one. `/helioshash-dao`
// was an ungated second dashboard with a fake "Connect Wallet" toggle; the
// canonical, auth-gated dashboard is `/dashboard`. Redirect here so every
// entry point (login fallback, "Back to Dashboard" links, direct URL) lands on
// the single gated flow. The old HeliosHashDAO/Dashboard components remain in
// the tree but are now unrouted (deletion is a separate cleanup).
export default function HeliosHashDAOPage() {
  redirect('/dashboard');
}
