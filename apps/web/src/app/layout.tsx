// Root layout for Next.js App Router
"use client";

import { SkipToContent } from '@/components/SkipToContent';
import { AuthProvider } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import './globals.css';

const navLinks = [
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/kyc-choice', label: 'KYC Choice' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/earn-task', label: 'Earn Task' },
  { href: '/wallet-withdraw', label: 'Wallet' },
  { href: '/project-hub', label: 'Project Hub' },
  { href: '/create-proposal', label: 'Create Proposal' },
  { href: '/recovery-test', label: 'Recovery Test' },
];

function isNavHidden(pathname: string) {
  return [
    '/',
    '/splash',
    '/auth',
    '/onboarding',
    '/kyc',
  ].some(route => pathname === route || pathname.startsWith(route + '/'));
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Use a client-side hook to get the current path
  const pathname = usePathname();
  const hideNav = isNavHidden(pathname);

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-navy via-dark to-darker min-h-screen flex flex-col text-light">
        <AuthProvider>
          {/* <I18nextProvider i18n={i18n}> */}
          <SkipToContent />
          {!hideNav && (
            <nav className="w-full bg-dark/80 backdrop-blur border-b border-gray-700 shadow-sm sticky top-0 z-40">
              <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2">
                <ul className="flex gap-3 text-base">
                  {navLinks.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-light hover:text-saffron font-medium transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Image src="/assets/icons/hhdaologo.svg" alt="HeliosHash DAO Logo" width={40} height={40} priority />
              </div>
            </nav>
          )}
          <main id="main-content" className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center justify-center">
            {children}
          </main>
          <footer className="w-full bg-darker border-t border-gray-700 py-3 text-center text-xs text-gray">
            &copy; {new Date().getFullYear()} HeliosHash DAO. All rights reserved.
          </footer>
          {/* </I18nextProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
