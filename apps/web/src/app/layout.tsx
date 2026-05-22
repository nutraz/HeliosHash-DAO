import { Inter } from 'next/font/google'
// Import global styles
import './globals.css'
import ClientLayout from './ClientLayout'
import { isDemoMode } from '../lib/demoMode'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HeliosHash DAO',
  description: 'Decentralized renewable energy management platform',
  icons: {
    icon: ['/favicon.ico', '/assets/icons/helioshash.svg'],
    apple: '/assets/icons/helioshash.svg'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>HeliosHash DAO</title>
        <meta name="description" content="Decentralized Autonomous Organization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Development-only CSP additions to allow local mock API/websocket connections */}
        {process.env.NODE_ENV !== 'production' && (
          <meta
            httpEquiv="Content-Security-Policy"
            content={`connect-src 'self' http://localhost:4000 ws://localhost:3002 http://localhost:3002;`}
          />
        )}
        <link rel="icon" href="/assets/icons/helioshash.svg" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {/* H16a: persistent, non-dismissible DEMO MODE banner (above the fold). */}
        {isDemoMode() && (
          <div
            role="status"
            className="sticky top-0 z-50 w-full bg-amber-400 text-black text-center text-sm font-semibold py-2 px-4 border-b border-amber-600"
          >
            DEMO MODE — actions shown are simulated, not on-chain.
          </div>
        )}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
