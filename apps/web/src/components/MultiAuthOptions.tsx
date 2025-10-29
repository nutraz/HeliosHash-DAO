import Image from 'next/image';
import { Button } from './ui/button';

export default function MultiAuthOptions({ onAuth }: { onAuth: (provider: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <h2 className="text-2xl font-bold mb-2">Sign in to HeliosHash DAO</h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={() => onAuth('google')}>
          <Image src="/assets/icons/google.svg" alt="Google" width={20} height={20} />
          Sign in with Google
        </Button>
        <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={() => onAuth('github')}>
          <Image src="/assets/icons/github.svg" alt="GitHub" width={20} height={20} />
          Sign in with GitHub
        </Button>
        <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={() => onAuth('icp')}>
          <Image src="/assets/icons/hhdaologo.svg" alt="Internet Identity" width={20} height={20} />
          Sign in with Internet Identity
        </Button>
        <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={() => onAuth('wallet')}>
          <span className="inline-block w-5 h-5 bg-gray-300 rounded-full" />
          Sign in with Wallet
        </Button>
      </div>
    </div>
  );
}
