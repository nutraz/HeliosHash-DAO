"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from './ProfileCard'
import WalletComponent from './WalletComponent'
import NFTCollection from './NFTCollection'
import ActionButtons from './ActionButtons'
import AuthButtons from "@/components/auth/AuthButtons";
import { useRouter } from "next/navigation";
import {
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Send,
  ArrowDownLeft,
  Image,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [showNFTCollection, setShowNFTCollection] = useState(false);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/users")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const u = json?.ok;
        if (u) setUserData(u);
      })
      .catch(() => {
        setUserData({
          name: "Rahul Kumar",
          pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
          rank: "Investor & Collaborator",
          communityRole: "Community Manager",
          stats: { projectsStarted: 3, projectsHelped: 12, membersAdded: 45 },
          tokenBalance: 15000,
          nftCollection: [],
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">HHDAO</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={
                  userData?.pfp ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=anon"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* USER PANEL */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <img
                src={
                  userData?.pfp ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=anon"
                }
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg"
              />

              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {userData?.name ?? "—"}
                </h2>

                <div className="flex items-center space-x-2 mt-1">
                  <Award className="w-4 h-4" />
                  <span className="text-blue-100 text-sm">
                    {userData?.rank ?? ""}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mt-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs sm:text-sm text-blue-100">
                    {userData?.communityRole ?? ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BALANCE */}
          <div className="mt-4 sm:mt-6 bg-white/20 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-blue-100">Token Balance</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {(userData?.tokenBalance ?? 0).toLocaleString()} HHD
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => router.push("/wallet/send")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  <Send size={16} /> Send
                </button>

                <button
                  onClick={() => router.push("/wallet/receive")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  <ArrowDownLeft size={16} /> Receive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: <TrendingUp size={20} className="text-green-400" />,
              label: "Projects Started",
              value: userData?.stats?.projectsStarted ?? 0,
            },
            {
              icon: <CheckCircle size={20} className="text-blue-400" />,
              label: "Projects Helped",
              value: userData?.stats?.projectsHelped ?? 0,
            },
            {
              icon: <Users size={20} className="text-purple-400" />,
              label: "Members Added",
              value: userData?.stats?.membersAdded ?? 0,
            },
          ].map((item, idx) => (
            <div key={idx} className="card text-white">
              <div className="flex items-center space-x-2 mb-2">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* NFT COLLECTION */}
        <div className="card overflow-hidden mb-6">
          <button
            onClick={() => setShowNFTCollection(!showNFTCollection)}
            className="w-full p-4 text-left hover:bg-gray-750"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image className="text-purple-400" size={24} />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    My NFT Collection
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {(userData?.nftCollection ?? []).length} NFTs
                  </p>
                </div>
              </div>

              <ChevronRight
                className={`transition-transform ${
                  showNFTCollection ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {showNFTCollection && (
            <div className="p-4 sm:p-6 border-t border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {(userData?.nftCollection ?? []).map((nft) => (
                  <button
                    key={nft.id}
                    onClick={() =>
                      router.push(
                        nft.projectId
                          ? `/projects/${nft.projectId}`
                          : "/projects"
                      )
                    }
                    className="group bg-gray-900 border-2 border-gray-700 rounded-xl p-3 hover:border-blue-500 transition"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gray-800">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h4 className="text-sm font-semibold">{nft.name}</h4>
                    <p className="text-xs text-gray-400">{nft.community}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-6 text-center text-gray-400">
        HHDAO v1.0 — Built on Internet Computer
      </footer>
    </div>
  );
}

