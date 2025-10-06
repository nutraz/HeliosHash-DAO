'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCanisterHealth } from '@/hooks/useCanisterHealth';
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';

export function HealthPanel() {
  const { data, isLoading, refetch, isFetching, error } = useCanisterHealth();
  const anyWarnings = data?.warnings?.length;

  return (
    <Card className='p-4 space-y-4 bg-gradient-to-br from-slate-900/60 to-slate-800/40 border-slate-700/50'>
      <div className='flex items-center gap-2'>
        <h3 className='font-semibold text-sm tracking-wide uppercase text-slate-300'>
          System Health
        </h3>
        <div className='relative group'>
          <Info className='size-3.5 text-slate-500 hover:text-slate-300 cursor-help' />
          <div className='invisible group-hover:visible absolute z-10 top-full mt-1 w-64 text-[10px] p-2 rounded bg-slate-800 border border-slate-600 shadow-xl space-y-1'>
            <p className='font-semibold text-slate-200'>Source Legend</p>
            <ul className='space-y-0.5 list-disc ml-4 text-slate-400'>
              <li>
                <strong>override</strong>: Explicit runtime override passed to resolver
              </li>
              <li>
                <strong>global</strong>: Found on globalThis (window)
              </li>
              <li>
                <strong>env</strong>: From process.env at build/runtime
              </li>
              <li>
                <strong>import-meta</strong>: From import.meta.env
              </li>
              <li>
                <strong>dfx-file</strong>: Loaded from .dfx/&lt;network&gt;/canister_ids.json
              </li>
              <li>
                <strong>none</strong>: Not resolved
              </li>
            </ul>
          </div>
        </div>
        {anyWarnings ? (
          <Badge variant='outline' className='text-amber-400 border-amber-500/40 bg-amber-500/10'>
            <AlertTriangle className='size-3' /> {data?.warnings.length}
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
          >
            All Good
          </Badge>
        )}
        <Button
          size='icon'
          variant='ghost'
          aria-label='Refresh health'
          onClick={() => refetch()}
          disabled={isFetching}
          className='ml-auto'
        >
          <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {isLoading && <p className='text-xs text-slate-400'>Loading health...</p>}
      {error && <p className='text-xs text-red-400'>Health load error: {error.message}</p>}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {data?.canisters.map((c) => {
          const statusIcon = c.reachable ? (
            <CheckCircle2 className='size-4 text-emerald-400' />
          ) : (
            <XCircle className='size-4 text-red-400' />
          );
          const latency = c.latencyMs ?? 0;
          const latencyColor = !c.reachable
            ? 'text-red-400'
            : latency < 200
              ? 'text-emerald-400'
              : latency < 800
                ? 'text-amber-300'
                : 'text-red-400';
          const conflict = c.conflict;
          const conflictTooltip = conflict
            ? (c.meta?.conflicts || []).map((alt: any) => `${alt.source}: ${alt.id}`).join('\n') ||
              'ID conflict detected'
            : '';
          return (
            <div
              key={c.envKey}
              className={`flex flex-col gap-1 rounded-md border p-2 bg-slate-900/50 relative group ${
                conflict ? 'border-amber-500/40' : 'border-slate-700/50'
              }`}
            >
              <div className='flex items-center gap-1 text-xs font-mono'>
                {statusIcon}
                <span className='uppercase tracking-wide'>{c.name}</span>
                {conflict && (
                  <span className='ml-auto flex items-center'>
                    <OctagonAlert className='size-3 text-amber-400' />
                  </span>
                )}
              </div>
              <code className='text-[10px] truncate text-slate-400'>{c.canisterId || '—'}</code>
              {c.source && (
                <span className='text-[9px] uppercase tracking-wide text-slate-500'>
                  {c.source}
                </span>
              )}
              {conflict && (
                <div className='absolute top-1 right-1'>
                  <div className='relative'>
                    <div className='invisible group-hover:visible absolute z-20 right-0 mt-1 w-52 p-2 rounded bg-slate-800 border border-amber-600/40 shadow-xl'>
                      <p className='text-[10px] font-semibold text-amber-300 mb-1'>ID Conflict</p>
                      <p className='text-[9px] text-slate-300 whitespace-pre-wrap'>
                        {conflictTooltip}
                      </p>
                      <p className='text-[9px] text-slate-500 mt-1'>
                        Using: {c.source} ➝ {c.canisterId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {!c.reachable && c.error && (
                <span className='text-[10px] text-red-400 line-clamp-2'>{c.error}</span>
              )}
              {c.meta?.note && <span className='text-[10px] text-slate-500'>{c.meta.note}</span>}
              {typeof c.latencyMs === 'number' && (
                <span className={`text-[10px] font-mono ${latencyColor}`}>
                  {latency.toString()}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className='flex items-center justify-between text-[10px] text-slate-500'>
        <span>
          Network: <strong>{data?.network || 'unknown'}</strong> • Updated{' '}
          {data && new Date(data.generatedAt).toLocaleTimeString()}
        </span>
        <Link href='/api/status' className='underline underline-offset-2 hover:text-slate-300'>
          JSON
        </Link>
      </div>
      {anyWarnings && (
        <ul className='text-[10px] text-amber-300 space-y-1 list-disc ml-4'>
          {data!.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
