"use client"
import React from 'react';

const ProfileHeader: React.FC<{displayName: string; handle: string; bio?: string; followers?: number}> = ({displayName, handle, bio, followers}) => {
  return (
    <div className="bg-white rounded-md p-4 shadow-sm flex items-center gap-4" data-testid="profile-header">
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold">{displayName[0]}</div>
      <div>
        <div className="text-lg font-semibold" data-testid="user-profile">{displayName} <span className="text-sm text-slate-500">@{handle}</span></div>
        <div className="text-sm text-slate-600 mt-1">{bio}</div>
        <div className="text-sm text-slate-500 mt-2">{followers ?? 0} followers</div>
      </div>
    </div>
  );
}

export default ProfileHeader;
