'use client';

import AnimalCareForm from '@/components/community/AnimalCareForm';
import { createActor } from '@/declarations/hhdao_dao';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function AnimalCarePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const win: any = typeof window !== 'undefined' ? window : {};
      const actor = win.__HHDAO_MOCK_ACTOR
        ? win.__HHDAO_MOCK_ACTOR
        : createActor(process.env.NEXT_PUBLIC_DAO_CANISTER_ID!);
      const all = await actor.getAllAnimalReports();
      setReports(all as any[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Community Animal Care</h1>
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h2 className='text-lg font-semibold'>Submit report</h2>
          <AnimalCareForm
            onSubmitted={(id) => {
              loadReports();
              alert('Report submitted: ' + id);
            }}
          />
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Recent reports</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ul className='space-y-3'>
              {reports.map((r) => (
                <li key={r.id} className='p-3 border rounded'>
                  <div className='text-sm font-medium'>{r.location}</div>
                  <div className='text-xs text-gray-600'>{r.description}</div>
                  <div className='text-xs'>
                    Votes: {r.votesFor} / {r.votesRequired}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
