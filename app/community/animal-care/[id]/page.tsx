'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createActor } from '@/declarations/hhdao_dao';
import { useAuthContext } from '@/hooks/useAuthContext';

export default function AnimalReportPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [report, setReport] = useState<any | null>(null);
  const { user } = useAuthContext();

  const load = async () => {
    const actor = createActor(process.env.NEXT_PUBLIC_DAO_CANISTER_ID!);
    const r = await actor.getAnimalReport(Number(id));
    setReport(r ?? null);
  };

  useEffect(() => {
    load();
  }, [id]);

  const vote = async (inFavor: boolean) => {
    if (!user) return alert('Please sign in (mock)');
    const actor = createActor(process.env.NEXT_PUBLIC_DAO_CANISTER_ID!);
    await actor.voteOnAnimalReport(Number(id), inFavor);
    await load();
  };

  if (!report) return <div className='p-6'>Report not found</div>;

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold'>Report {report.id}</h1>
      <div className='mt-3'>Location: {report.location}</div>
      <div className='mt-3'>Description: {report.description}</div>
      <div className='mt-3'>
        Votes: {report.votesFor} / {report.votesRequired}
      </div>
      <div className='mt-4 space-x-3'>
        <button onClick={() => vote(true)} className='px-3 py-2 bg-green-600 text-white rounded'>
          Vote Yes
        </button>
        <button onClick={() => vote(false)} className='px-3 py-2 bg-red-600 text-white rounded'>
          Vote No
        </button>
      </div>
    </div>
  );
}
