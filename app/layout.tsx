import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuthContext';
import { ThemeProvider } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HeliosHash DAO - Solar Energy Community',
  description: "India's node of the One World Project - Building solar-energy communities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-[#FF9933]/5 via-white to-[#138808]/5">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
