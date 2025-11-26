import { AuthProvider } from '../context/AuthContext';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata = {
  title: 'HeliosHash DAO - Web3 Renewable Energy',
  description: 'Decentralized renewable energy projects on Internet Computer',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
