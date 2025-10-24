"use client";

import React, { useState } from "react";

// Mobile-first HeliosHash UI Skeleton
// Single-file React component (TypeScript-ready). Drop into a Next.js App Router route
// Example path: /src/app/(mobile)/page.tsx or /src/components/MobileAppShell.tsx

export default function MobileAppShell() {
  const [tab, setTab] = useState<"home" | "projects" | "governance" | "wallet" | "profile">("home");
  const [showOnboard, setShowOnboard] = useState(false);
  const [language, setLanguage] = useState("English");
  const [user, setUser] = useState<any>({
    name: "Guest",
    balance: 1.2,
    kyc: false,
    nftCount: 0,
    reputation: 0,
  });

  // Mock project list
  const projects = [
    { id: "urgam-1", name: "Urgam Valley Farm", location: "Uttarakhand, India", status: "building", energyToday: 12.4, revenueMonth: 1200 },
    { id: "solar-2", name: "Riverbend Microgrid", location: "Rajasthan, India", status: "operational", energyToday: 48.2, revenueMonth: 4300 },
    { id: "global-1", name: "Sahara Pilot", location: "Morocco", status: "planning", energyToday: 0, revenueMonth: 0 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">HeliosHash</h1>
            <p className="text-xs text-muted-foreground">Decentralized solar infrastructure — village-first</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-xs px-3 py-1 rounded-md bg-primary text-primary-foreground"
              onClick={() => setShowOnboard(true)}
            >
              Sign up / KYC
            </button>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">👤</div>
          </div>
        </div>
      </header>

      {/* App Body - mobile centered width */}
      <main className="max-w-md mx-auto p-4 pb-28">
        {tab === "home" && (
          <section>
            <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Welcome,</p>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">OWP Balance</p>
                  <p className="font-mono font-semibold text-lg">{user.balance.toFixed(2)} OWP</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="col-span-1 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">Earn</button>
                <button className="col-span-1 py-2 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-700">Mint ID NFT</button>
                <button className="col-span-2 mt-2 py-2 rounded-lg bg-primary text-primary-foreground" onClick={() => setTab("projects")}>Explore Projects</button>
              </div>
            </div>

            {/* Map & Projects quick view (placeholder) */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Nearby Projects (scannable map)</h3>
              <div className="h-48 rounded-lg bg-gradient-to-br from-sky-100 to-muted border border-border flex items-center justify-center text-muted-foreground">
                {/* In real app, replace with Map component (Leaflet / Mapbox) */}
                <div className="text-center">
                  <div className="text-2xl">🗺️</div>
                  <div className="mt-2 text-xs">Interactive map placeholder — tap a project to view details</div>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {projects.map((p) => (
                  <article key={p.id} className="bg-card rounded-lg p-3 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{p.name}</h4>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-semibold">{p.status}</div>
                        <div className="text-muted-foreground">{p.energyToday} kWh</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 py-2 rounded-md border border-border text-sm" onClick={() => alert(`Open project ${p.id}`)}>Open</button>
                      <button className="py-2 px-3 rounded-md bg-primary text-primary-foreground text-sm">Join</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "projects" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">All Projects</h3>
              <div className="flex gap-2">
                <button className="text-xs px-2 py-1 border rounded">🔍</button>
                <button className="text-xs px-2 py-1 border rounded">📍</button>
              </div>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={() => alert(`Open ${p.name}`)} />
              ))}
            </div>

            <div className="mt-4">
              <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Create New Project</button>
            </div>
          </section>
        )}

        {tab === "governance" && (
          <section>
            <h3 className="font-semibold">Governance</h3>
            <div className="mt-3 space-y-3">
              <div className="bg-card p-3 rounded-lg border border-border">Proposal: Buy new panels for Urgam Valley - Votes: 42/60 <div className="mt-2 flex gap-2"><button className="flex-1 py-2 rounded border border-border">Vote Yes</button><button className="flex-1 py-2 rounded border border-border">Vote No</button></div></div>
              <div className="bg-card p-3 rounded-lg border border-border">Dispute: Land boundary - mediation requested</div>
            </div>
          </section>
        )}

        {tab === "wallet" && (
          <section>
            <h3 className="font-semibold">Wallet</h3>
            <div className="mt-3 bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">OWP Balance</p>
                  <p className="font-mono font-semibold text-lg">{user.balance.toFixed(2)} OWP</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">NFTs</p>
                  <p className="font-semibold">{user.nftCount}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="py-2 rounded border border-border">Exchange</button>
                <button className="py-2 rounded border border-border">Rewards</button>
                <button className="col-span-2 py-2 rounded bg-primary text-primary-foreground">Send / Receive</button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Reward Partners</h4>
              <div className="flex gap-2 overflow-x-auto">
                <div className="min-w-[120px] bg-card p-3 rounded-lg border border-border text-center">Amazon</div>
                <div className="min-w-[120px] bg-card p-3 rounded-lg border border-border text-center">Hotels</div>
                <div className="min-w-[120px] bg-card p-3 rounded-lg border border-border text-center">Travel</div>
              </div>
            </div>
          </section>
        )}

        {tab === "profile" && (
          <section>
            <h3 className="font-semibold">Profile</h3>
            <div className="mt-3 bg-card p-4 rounded-lg border border-border">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">Reputation: {user.reputation}</p>
              <p className="text-xs text-muted-foreground">KYC: {user.kyc ? "Verified" : "Not verified"}</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="py-2 rounded border border-border">Add Confidant</button>
                <button className="py-2 rounded border border-border">Edit KYC</button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Roles & Types</h4>
              <div className="space-y-2">
                <RoleBadge role="Landowner"/>
                <RoleBadge role="Solar Contractor"/>
                <RoleBadge role="Collaborator"/>
                <RoleBadge role="Engineer"/>
                <RoleBadge role="Contributor"/>
                <RoleBadge role="Community Helper"/>
                <RoleBadge role="Security Guard"/>
                <RoleBadge role="Gardener"/>
                <RoleBadge role="Influencer"/>
                <RoleBadge role="Skilled Developer"/>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Bottom navigation (mobile) */}
      <nav className="fixed bottom-3 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-lg border border-border flex justify-between items-center p-2">
            <NavItem label="Home" active={tab==="home"} onClick={() => setTab("home")} icon="🏠" />
            <NavItem label="Projects" active={tab==="projects"} onClick={() => setTab("projects")} icon="⚡" />
            <div className="-mt-6">
              <button className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center" onClick={() => alert('Create new project')}>
                +
              </button>
            </div>
            <NavItem label="Governance" active={tab==="governance"} onClick={() => setTab("governance")} icon="📜" />
            <NavItem label="Wallet" active={tab==="wallet"} onClick={() => setTab("wallet")} icon="💰" />
          </div>
        </div>
      </nav>

      {/* Onboarding modal (simplified) */}
      {showOnboard && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-xl p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Create account</h4>
              <button onClick={() => setShowOnboard(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="mt-3 space-y-3">
              <label className="block text-xs">Language</label>
              <select className="w-full border rounded p-2" value={language} onChange={(e)=>setLanguage(e.target.value)} title="Select language">
                <option>English</option>
                <option>Hindi</option>
                <option>Garhwali</option>
                <option>Kumaoni</option>
              </select>

              <label className="block text-xs">Mobile number</label>
              <input className="w-full border rounded p-2" placeholder="+91 98xxxx..." />

              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 rounded border">Request OTP</button>
                <button className="py-2 rounded bg-primary text-primary-foreground" onClick={()=>{setUser({...user, name:'New User', balance:2.0, kyc:false}); setShowOnboard(false)}}>Continue</button>
              </div>

              <p className="text-xs text-muted-foreground">By continuing you agree to the terms. KYC options: Mobile OTP, Aadhaar (DigiLocker), PAN (optional), Retinal (optional).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function NavItem({label, active, onClick, icon}:{label:string, active:boolean, onClick:()=>void, icon:string}){
  return (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center py-2 ${active? 'text-primary': 'text-muted-foreground'}`}>
      <div className="text-lg">{icon}</div>
      <div className="text-[10px] mt-1">{label}</div>
    </button>
  );
}

function RoleBadge({role}:{role:string}){
  return <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-xs">{role}</div>;
}

function ProjectCard({project, onOpen}:{project:any, onOpen:()=>void}){
  return (
    <div className="bg-card rounded-lg p-3 border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{project.name}</h4>
          <p className="text-xs text-muted-foreground">{project.location}</p>
        </div>
        <div className="text-right text-xs">
          <div className="font-semibold">{project.status}</div>
          <div className="text-muted-foreground">{project.energyToday} kWh</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="flex-1 py-2 rounded-md border" onClick={onOpen}>Open</button>
        <button className="py-2 px-3 rounded-md bg-primary text-primary-foreground">Join</button>
      </div>
    </div>
  );
}
