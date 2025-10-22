import { useAuth } from '@/hooks/useAuthContext';
import { useTreasuryBalance, useTreasuryMeta } from '@/hooks/useTreasury';
import { formatOwpAtomic } from '@/services/treasuryService';
import React from 'react';

export const TreasuryCard: React.FC = () => {
  const { data, isLoading, error } = useTreasuryMeta();
  const { user } = useAuth();
  const principal = user?.principal;
  const balanceQuery = useTreasuryBalance(principal);

  return (
    <div className='rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 flex flex-col gap-2'>
      <div className='text-sm font-semibold tracking-wide text-white/80'>Treasury (OWP)</div>
      {isLoading && <div className='text-xs text-white/60'>Loading...</div>}
      {error && <div className='text-xs text-red-400'>Error loading treasury</div>}
      {data && (
        <>
          <div className='flex items-end justify-between gap-4'>
            <div className='text-2xl font-bold text-white'>
              {(Number(data.totalSupply) / 100_000_000).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{' '}
              <span className='text-xs font-medium text-white/60'>{data.symbol}</span>
            </div>
            {principal && (
              <div className='text-right text-xs text-white/70'>
                <div className='uppercase tracking-wide text-white/40'>Your Balance</div>
                {balanceQuery.isLoading && <span className='text-white/40'>...</span>}
                {balanceQuery.data !== undefined && !balanceQuery.isLoading && (
                  <span className='font-semibold text-white'>
                    {formatOwpAtomic(balanceQuery.data, 8, 4)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className='grid grid-cols-3 gap-3 text-xs text-white/60 mt-2'>
            <div className='flex flex-col'>
              <span className='font-medium text-white/70'>Holders</span>
              {String(data.holderCount)}
            </div>
            <div className='flex flex-col'>
              <span className='font-medium text-white/70'>Tx</span>
              {String(data.txCount)}
            </div>
            <div className='flex flex-col'>
              <span className='font-medium text-white/70'>Locked</span>
              {data.locked ? 'Yes' : 'No'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
