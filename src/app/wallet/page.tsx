'use client';
import { StakingPanel } from '@/components/wallet/StakingPanel';
import { WalletBalance } from '@/components/wallet/WalletBalance';

// Simplified wallet page focusing on composable balance component.
// Legacy tabbed implementation removed during refactor; can be reintroduced modularly later.
export default function WalletPage() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl space-y-8'>
      <header>
        <h1 className='text-3xl font-bold tracking-tight'>Wallet</h1>
        <p className='text-muted-foreground mt-1'>Overview of your OWP token holdings</p>
      </header>
      <WalletBalance />
      <section>
        <h2 className='text-2xl font-semibold mb-4'>Staking & Rewards</h2>
        <StakingPanel />
      </section>
    </div>
  );
}
