import { redirect } from 'next/navigation';

export default function Home() {
  // Simple server-side redirect to the dashboard
  redirect('/dashboard');
}
