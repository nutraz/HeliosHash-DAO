import Web3App from '../../components/Web3App';

// Force dynamic rendering to prevent SSR
export const dynamic = 'force-dynamic';

export default function SplashScreen() {
  return <Web3App />;
}
