"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleSelector from '@/components/RoleSelector/RoleSelector';
import { useAuth } from '@/contexts/AuthContext';

const AVAILABLE_ROLES = [
  'Land Owner',
  'Electrical Contractor',
  'Engineer / Technician',
  'Community Validator',
  'Investor / Contributor',
  'Village Admin / Sarpanch',
  'DAO Member',
  'District Supervisor',
  'Surveyor',
  'Auditor',
];

export default function RolesOnboardingPage() {
  const router = useRouter();
  const auth = useAuth();
  const initial = auth.user?.roles || [];
  const [selected, setSelected] = useState<string[]>(initial);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await auth.updateRoles(selected);
      router.push('/helioshash-dao');
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose your roles</h1>
      <p className="text-sm text-slate-500 mb-6">Select one or more roles that describe you. You can change these later in Settings → Roles & Permissions.</p>

      <RoleSelector availableRoles={AVAILABLE_ROLES} selectedRoles={selected} onChange={setSelected} />

      <div className="mt-6 flex items-center gap-3">
        <button
          className="px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save and Continue'}
        </button>
        <button className="px-4 py-2 border rounded" onClick={() => router.push('/helioshash-dao')}>Skip</button>
      </div>
    </div>
  );
}
