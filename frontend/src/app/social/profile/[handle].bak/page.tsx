"use client"
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ProfilePage({ params }: { params: { handle: string } }){
  const { handle } = params;
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(()=>{
    async function load(){
      const res = await fetch(`/api/social/profiles?handle=${encodeURIComponent(handle)}`);
      if (res.status===404) { setProfile(null); return; }
      const j = await res.json();
      setProfile(j.data);
    }
    load();
  }, [handle]);

  if (!profile) return (
    <div className="p-6">Profile not found — <button onClick={()=>router.back()} className="text-indigo-600">go back</button></div>
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-md p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xl">{profile.displayName[0]}</div>
          <div>
            <div className="text-xl font-semibold">{profile.displayName}</div>
            <div className="text-sm text-slate-500">@{profile.handle} · {profile.followers ?? 0} followers</div>
            <div className="mt-2 text-sm text-slate-700">{profile.bio}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
