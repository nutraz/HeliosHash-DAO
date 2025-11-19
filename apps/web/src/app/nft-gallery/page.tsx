'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NFTGalleryRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/nfts');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Redirecting to /nfts...</div>
    </div>
  );
}
