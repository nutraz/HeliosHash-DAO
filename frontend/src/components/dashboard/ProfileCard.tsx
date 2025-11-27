"use client";
import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';
import Image from "next/image";

export type ProfileCardProps = {
  name: string;
  pfpUrl?: string;
  roleTags?: string[];
  level?: number;
  reputation?: number;
  badges?: string[];
  onEdit?: () => void;
  onViewNFTs?: () => void;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  pfpUrl,
  roleTags = [],
  level = 1,
  reputation = 0,
  badges = [],
  onEdit,
  onViewNFTs,
}) => {
  useRenderTrace('ProfileCard', { name });
  return (
    <div className="bg-white/80 dark:bg-slate-900/70 rounded-2xl p-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          {pfpUrl ? (
            // Next Image if you want optimization
            <Image src={pfpUrl} alt={`${name} avatar`} width={80} height={80} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-200 to-rose-100 flex items-center justify-center text-xl">
              {name?.[0] ?? "U"}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <div className="text-sm text-muted-foreground">{roleTags.join(" • ")}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Level</div>
              <div className="font-bold">{level}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="text-sm">Reputation</div>
            <div className="font-semibold">{reputation}</div>
            <div className="flex gap-1 ml-4">
              {badges.slice(0, 4).map((b) => (
                <span key={b} className="px-2 py-1 text-xs rounded bg-blue-50">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={onEdit} className="btn-primary">
              Edit Profile
            </button>
            <button onClick={onViewNFTs} className="btn-secondary">
              View NFTs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

