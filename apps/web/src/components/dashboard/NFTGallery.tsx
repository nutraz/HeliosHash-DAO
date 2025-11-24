import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';

export type NFT = {
  id: string;
  title: string;
  image?: string;
  description?: string;
  issuer?: string;
  date?: string;
};

export const NFTGallery: React.FC<{ items: NFT[]; onOpen?: (id: string) => void }> = ({ items, onOpen }) => {
  useRenderTrace('NFTGallery', { len: items.length });
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((n) => (
          <div key={n.id} className="bg-white/80 dark:bg-slate-900/70 p-3 rounded-lg shadow-sm">
            <div className="w-full h-40 bg-gray-100 rounded overflow-hidden mb-2">
              {n.image ? <img src={n.image} alt={n.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">No image</div>}
            </div>
            <div className="font-semibold">{n.title}</div>
            <div className="text-xs text-gray-500">{n.issuer}</div>
            <div className="mt-2 flex justify-between">
              <button onClick={() => onOpen?.(n.id)} className="text-sm underline">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
