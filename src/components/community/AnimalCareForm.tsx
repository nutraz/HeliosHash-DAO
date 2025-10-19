'use client';

import { createActor } from '@/declarations/hhdao_dao';
import { useAuthContext } from '@/hooks/useAuthContext';
import React, { useState } from 'react';

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
      // Prefer injected mock actor in test environments (Playwright) if available
      const win: any = typeof window !== 'undefined' ? window : {};
      const actor = win.__HHDAO_MOCK_ACTOR
        ? win.__HHDAO_MOCK_ACTOR
        : createActor(process.env.NEXT_PUBLIC_DAO_CANISTER_ID!);
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
        <label htmlFor='location' className='block text-sm font-medium'>Location</label>
        <input
          id='location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className='mt-1 block w-full'
        />
      </div>
      <div>
        <label htmlFor='description' className='block text-sm font-medium'>Description</label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='mt-1 block w-full'
        />
      </div>
      <div>
        <label htmlFor='photos' className='block text-sm font-medium'>Photos (comma-separated URLs)</label>
        <input
          id='photos'
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
          className='mt-1 block w-full'
        />
      </div>
      <div>
        <label htmlFor='votesRequired' className='block text-sm font-medium'>Votes required</label>
        <input
          id='votesRequired'
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
