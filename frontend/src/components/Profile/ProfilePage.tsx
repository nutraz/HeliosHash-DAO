import React, { useEffect, useState } from "react";
import { fetchProfile } from "../../lib/mockApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  if (!profile) return <div>Loading profile…</div>;

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200" />
        <div>
          <div className="text-xl font-semibold">{profile.displayName}</div>
          <div className="text-sm text-slate-600">Verification level: {profile.verificationLevel}</div>
          <div className="text-sm text-slate-600">Roles: {profile.roleTags.join(", ")}</div>
        </div>
      </div>

      <section className="mt-6">
        <h4 className="font-medium">Stats</h4>
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div className="p-2 bg-slate-50 rounded">Vote weight<br />{profile.voteWeight}</div>
          <div className="p-2 bg-slate-50 rounded">Validator score<br />{profile.validatorScore}</div>
          <div className="p-2 bg-slate-50 rounded">VCs<br />{profile.vcHashes.length}</div>
        </div>
      </section>

      <section className="mt-6">
        <h4 className="font-medium">Actions</h4>
        <div className="mt-2 flex gap-2">
          <button className="btn">Request Role</button>
          <button className="btn">Invite Member</button>
          <button className="btn">Edit public profile</button>
        </div>
      </section>
    </div>
  );
}
