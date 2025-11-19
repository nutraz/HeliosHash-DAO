'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButtons from '@/components/auth/AuthButtons';

export default function Nav() {
  const pathname = usePathname() || '/';

  // Hide the site header on the auth screen and any auth-related routes
  if (pathname.startsWith('/auth')) return null;

  return (
    <nav className="bg-surface shadow-sm border-b" role="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="sr-only">HeliosHash Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
