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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/hhdaologo.svg" />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
