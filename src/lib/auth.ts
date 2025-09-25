import { NextAuthOptions } from 'next-auth';
import { authService } from '@/services/authService';

export const authOptions: NextAuthOptions = {
  providers: [
    // Internet Identity Provider
    {
      id: 'internet-identity',
      name: 'Internet Identity',
      type: 'credentials',
      credentials: {
        principal: { label: 'Principal', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.principal) {
          return null;
        }

        try {
          // Use our existing auth service
          const user = authService.getUser();
          if (user && user.principal === credentials.principal) {
            return {
              id: user.principal,
              name: user.principal,
              email: user.walletAddress || undefined,
              image: undefined,
            };
          }

          return null;
        } catch (error) {
          console.error('Internet Identity authorization error:', error);
          return null;
        }
      },
    },
    // Wallet Provider (Plug, Stoic, NFID, Bitfinity)
    {
      id: 'wallet',
      name: 'Wallet',
      type: 'credentials',
      credentials: {
        walletType: { label: 'Wallet Type', type: 'text' },
        principal: { label: 'Principal', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.walletType || !credentials?.principal) {
          return null;
        }

        try {
          // Connect wallet using our auth service
          const result = await authService.connectWallet(
            credentials.walletType as 'plug' | 'stoic' | 'nfid' | 'bitfinity'
          );

          if (result.success) {
            const user = authService.getUser();
            if (user) {
              return {
                id: user.principal,
                name: user.principal,
                email: user.walletAddress || undefined,
                image: undefined,
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Wallet authorization error:', error);
          return null;
        }
      },
    },
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.principal = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.principal as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    principal: string;
    name: string;
  }
}
