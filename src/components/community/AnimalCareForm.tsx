'use client';

import React, { useState } from 'react';
import { createActor } from '@/declarations/hhdao_dao';
import { useAuthContext } from '@/hooks/useAuthContext';

type Props = {
  onSubmitted?: (id: number) => void;
};

export default function AnimalCareForm({ onSubmitted }: Props) {
  const { user } = useAuthContext();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState('');
  const [votesRequired, setVotesRequired] = useState<number | undefined>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('You must be signed in (mock) to submit');
      return;
    }

    try {
      setLoading(true);
      const actor = createActor(process.env.NEXT_PUBLIC_DAO_CANISTER_ID!);
      const photoList = photos
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      const id = await actor.submitAnimalReport(
        location,
        description,
        photoList,
        votesRequired,
        user.principal
      );
      if (onSubmitted) onSubmitted(Number(id));
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className='mt-1 block w-full'
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='mt-1 block w-full'
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Photos (comma-separated URLs)</label>
        <input
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
          className='mt-1 block w-full'
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Votes required</label>
        <input
          type='number'
          value={votesRequired ?? 3}
          onChange={(e) => setVotesRequired(Number(e.target.value) || 3)}
          className='mt-1 block w-24'
        />
      </div>
      <div>
        <button
          type='submit'
          disabled={loading}
          className='px-4 py-2 bg-blue-600 text-white rounded'
        >
          {loading ? 'Submitting...' : 'Submit report'}
        </button>
      </div>
      {error && <div className='text-sm text-red-600'>{error}</div>}
    </form>
  );
}
