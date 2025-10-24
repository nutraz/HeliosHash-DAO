import { AuthProvider } from '@/hooks/useAuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        {process.env.NEXT_PUBLIC_DISABLE_MOCK_MODE === 'true' ? (
          <AuthProvider>{children}</AuthProvider>
        ) : (
          children // mock mode: skip auth
        )}
      </body>
    </html>
  );
}
