// This is the default home page component for the App Router in Next.js.
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/splash');
}
