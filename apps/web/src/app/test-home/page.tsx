import { redirect } from 'next/navigation';

export default function TestHome() {
  // Redirect legacy test page to the new landing hub
  redirect('/');
}
