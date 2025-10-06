import ErrorBoundary from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuthContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// Force dynamic rendering to prevent useContext errors during static generation
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Only preload if actually used
});

export const metadata: Metadata = {
  title: 'HeliosHash DAO - Solar Energy Decentralized Autonomous Organization',
  description:
    "Empowering India's Solar Future through Decentralized Autonomous Organization powered by Internet Computer",
  keywords: [
    'HeliosHash',
    'DAO',
    'Solar Energy',
    'Internet Computer',
    'Blockchain',
    'India',
    'Renewable Energy',
  ],
  authors: [{ name: 'HeliosHash Team' }],
  openGraph: {
    title: 'HeliosHash DAO',
    description: "Empowering India's Solar Future through Decentralized Autonomous Organization",
    url: 'https://helioshash.org',
    siteName: 'HeliosHash DAO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeliosHash DAO',
    description: "Empowering India's Solar Future through Decentralized Autonomous Organization",
  },
};

/**
 * Root layout component that wraps application pages with global providers, theming, error handling, authentication, and shared UI.
 *
 * Renders the top-level HTML structure (<html> and <body>), composes global providers (Providers, ErrorBoundary, AuthProvider, ThemeProvider),
 * injects a persistent MVP simulation banner, renders the page `children`, and mounts the global Toaster for notifications.
 *
 * @param children - The page content to be rendered inside the root layout.
 * @returns The root HTML element hierarchy for the application containing providers, the MVP banner, the provided children, and the Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <ErrorBoundary>
            <AuthProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
              >
                {/* MVP Simulation Banner - informs testers no real funds */}
                <div className='w-full bg-amber-500/90 dark:bg-amber-600 text-black dark:text-white text-sm md:text-[13px] tracking-wide px-3 py-2 text-center font-medium shadow-sm z-50'>
                  <strong>MVP Simulation – No Real Funds or Wallets Active</strong>
                </div>
                {children}
                <Toaster />
              </ThemeProvider>
            </AuthProvider>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}