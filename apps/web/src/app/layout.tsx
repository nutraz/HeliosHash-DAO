import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/layout'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HeliosHash DAO',
  description: 'Decentralized Autonomous Organization',
  icons: {
    icon: '/favicon.ico',
    apple: '/hhdaologo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
