import Image from 'next/image';

export default function SplashScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <Image src="/assets/icons/hhdaologo.svg" alt="HeliosHash Logo" width={120} height={120} priority />
      <h1 className="text-3xl font-bold text-saffron">Welcome to HeliosHash DAO</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center">
        Solar-powered, privacy-first, and community-driven. Transforming remote valleys with decentralized infrastructure and governance.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-green text-white rounded-lg text-lg font-semibold shadow hover:bg-saffron transition-colors"
        onClick={onContinue}
      >
        Enter App
      </button>
    </div>
  );
}
