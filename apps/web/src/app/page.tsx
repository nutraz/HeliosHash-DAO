import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-8 text-white bg-black">
      <h1 className="text-4xl font-bold">HeliosHash / UrgamU Platform</h1>

      <div className="flex flex-col gap-4 text-center">
        <Link href="/hiidao-fusion/login" className="text-xl underline">
          Multi-Auth Login
        </Link>
        <Link href="/dashboard" className="text-xl underline">
          Main User Dashboard
        </Link>
        <Link href="/project-hub" className="text-xl underline">
          Project Hub
        </Link>
        <Link href="/dao" className="text-xl underline">
          DAO Center
        </Link>
        <Link href="/urgamu-delhi" className="text-xl underline">
          UrgamU Delhi Dashboard
        </Link>
      </div>
    </main>
  );
}

