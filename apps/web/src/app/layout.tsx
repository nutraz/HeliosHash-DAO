import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HeliosHash DAO',
  description: 'Decentralized renewable energy management platform',
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
        {/* Development-only CSP additions to allow local mock API/websocket connections */}
        {process.env.NODE_ENV !== 'production' && (
          <meta
            httpEquiv="Content-Security-Policy"
            content={`connect-src 'self' http://localhost:4000 ws://localhost:3002 http://localhost:3002;`}
          />
        )}
        <link rel="icon" type="image/avif" href="/assets/icons/hhdaologo.avif" />
        <link rel="icon" href="/assets/icons/hhdaologo.svg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/icons/hhdaologo.avif" />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
