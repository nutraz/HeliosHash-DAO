"use client";

import { useRouter } from "next/navigation";
import MultiAuthDashboard from "@/components/auth/MultiAuthDashboard";

export default function MultiAuthPage() {
  const router = useRouter();

  const onSuccess = async (method: string, principal?: string) => {
    // In a real flow you'd persist session and call backend/canisters
    console.log("Logged in with", method, principal);
    router.push('/dashboard');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Multi-Auth Login</h1>
      <MultiAuthDashboard onSuccess={onSuccess} />
    </div>
  );
}
"use client"

import MultiAuthDashboard from '@/components/auth/MultiAuthDashboard'

export default function Page() {
  return <MultiAuthDashboard />
}
