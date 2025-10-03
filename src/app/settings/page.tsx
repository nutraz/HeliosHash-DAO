'use client';
import { CurrencySettings } from '@/components/settings/CurrencySettings';

export default function SettingsPage() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
        <p className='text-muted-foreground mt-1'>Customize your HeliosHash DAO experience</p>
      </div>
      <CurrencySettings />
    </div>
  );
}
