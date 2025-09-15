
import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export default function LandingPage() {
  const { isConnected, address, connect, disconnect } = useWallet();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCreateProject = () => {
    setShowProjectForm(true);
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate project creation
    setShowSuccessMessage(true);
    setShowProjectForm(false);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 min-h-screen font-sans text-white">

      {/* Hero */}
  <section className="items-center gap-12 grid grid-cols-1 md:grid-cols-2 mx-auto px-5 pt-24 pb-10 max-w-6xl">
        <div>
          <div className="bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 font-bold text-transparent text-sm uppercase tracking-widest mb-2">We Bring Together</div>
          <h1 className="mb-4 font-bold text-4xl md:text-5xl leading-tight">
            Organisations, Investors, and <span className="bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 text-transparent">Local Communities</span>
          </h1>
          <p className="mb-4 max-w-xl text-gray-300">
            To fund vital infrastructure, 100% community owned, where 100% of the profits go back to participants.
          </p>
          <div className="mb-4 font-bold text-cyan-300 text-xs">From Sunlight to Sovereignty. One Block at a Time.</div>
          <div className="flex gap-4 mt-6">
            {!isConnected ? (
              <button 
                className="px-6 py-3 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition" 
                data-testid="connect-wallet"
                onClick={connect}
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span data-testid="wallet-address" className="text-green-300">
                  Connected: {address?.slice(0, 8)}...{address?.slice(-4)}
                </span>
                <button 
                  className="px-4 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
                  data-testid="disconnect-button"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
                <button 
                  className="px-6 py-3 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
                  data-testid="create-project"
                  onClick={handleCreateProject}
                >
                  Create Project
                </button>
              </div>
            )}
            <a className="px-6 py-3 rounded bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition" href="#learn">Learn More</a>
          </div>
        </div>
  <div className="relative bg-gradient-to-b from-indigo-800 to-indigo-950 shadow-2xl border border-white/10 rounded-3xl min-h-[360px] overflow-hidden" aria-hidden="true">
          {/* Graphic image as background */}
          <img
            src="/1wp landing page graphic .png"
            alt="Landing Page Graphic"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
              zIndex: 0,
              opacity: 0.95
            }}
          />
          {/* Badges above the image */}
          <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">DAO Central</div>
          <div className="absolute top-4 right-6 z-10 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Job Board</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-indigo-700 text-cyan-100 text-xs font-bold px-3 py-1 rounded-full shadow">Small Business</div>
          {/* Orb animation (optional, above image but below badges) */}
          <div className="orb" style={{zIndex: 1}}></div>
        </div>
      </section>

      {/* Sustainable Ecosystem */}
      <section id="ecosystem" className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 shadow-2xl p-10 border border-white/10 rounded-3xl">
            <span className="bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 font-bold text-transparent text-sm uppercase tracking-widest mb-2">The HHDAO Platform</span>
            <h3 className="mb-2 font-bold text-2xl md:text-3xl">Sustainable Ecosystem</h3>
            <p className="mb-6 max-w-2xl text-gray-300">HHDAO brings together a sustainable ecosystem of services on one platform.</p>
            <div className="gap-6 grid md:grid-cols-3 mt-4">
              <article className="gap-2 grid bg-gradient-to-b from-indigo-800 to-indigo-950 p-6 border border-white/10 rounded-xl">
                <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-cyan-400 shadow-inner rounded-lg w-10 h-10 font-extrabold text-indigo-950">◎</div>
                <h4 className="font-bold text-lg">DAO</h4>
                <p className="text-gray-300 text-sm">Organisations or communities that fund and own their infrastructure, receiving 100% of the profits. Raise funds, manage resources transparently and collectively vote on project execution.</p>
              </article>
              <article className="gap-2 grid bg-gradient-to-b from-indigo-800 to-indigo-950 p-6 border border-white/10 rounded-xl">
                <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-cyan-400 shadow-inner rounded-lg w-10 h-10 font-extrabold text-indigo-950">₪</div>
                <h4 className="font-bold text-lg">Small Business</h4>
                <p className="text-gray-300 text-sm">Access funding, resources, and global markets through our decentralised platform, creating opportunities for growth and sustainability.</p>
              </article>
              <article className="gap-2 grid bg-gradient-to-b from-indigo-800 to-indigo-950 p-6 border border-white/10 rounded-xl">
                <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-cyan-400 shadow-inner rounded-lg w-10 h-10 font-extrabold text-indigo-950">⟡</div>
                <h4 className="font-bold text-lg">Jobs Board</h4>
                <p className="text-gray-300 text-sm">Connect talent with opportunities. Professionals contribute to projects in exchange for equity or direct payment, fostering a symbiotic growth environment.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Why HHDAO */}
      <section className="px-5 py-16 why" id="why">
        <div className="mx-auto max-w-[1200px] wrap">
          <h2 className="mb-4 font-dela font-bold text-2xl md:text-3xl">Why HeliosHash DAO</h2>
          <p className="mb-4 text-[#a9a9b3]">HHDAO harnesses blockchain to transform capital markets. We level the playing field for funding so anyone, anywhere can access resources and investment, nurturing global economic development where sustainable opportunities flourish.</p>
          <div className="gap-3 grid mt-4 bullets">
            <div>
              <b className="block mb-1 text-[#c5a8ff]">Empowers Communities</b>
              Whether you’re an entrepreneur with a vision or a community eager to support local growth, our platform provides the tools to bring your ideas to life.
            </div>
            <div>
              <b className="block mb-1 text-[#c5a8ff]">Democratises Funding</b>
              Say goodbye to centralised gatekeepers—raise and allocate capital transparently with community-aligned incentives.
            </div>
            <div>
              <b className="block mb-1 text-[#c5a8ff]">Fosters Collaboration</b>
              The marketplace matches talent, capital, and ideas to accelerate real-world impact.
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-16 how" id="how">
        <div className="mx-auto max-w-[1200px] wrap">
          <h2 className="mb-4 font-dela font-bold text-2xl md:text-3xl">How It Works</h2>
          <div className="items-start gap-8 grid md:grid-cols-2 mt-4 cols">
            <div className="flex flex-col justify-center items-center bg-gradient-to-b from-[#0f1014] to-[#15161c] border border-white/10 rounded-2xl aspect-[3/4] font-extrabold text-[#9fb3ff] tracking-wide device">
              {/* Animated logo in device panel */}
              <span style={{display:'inline-block',width:'48px',height:'48px'}}>
                <svg className="device-logo-anim" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="22" stroke="#8c42c8" strokeWidth="2" fill="#0e0e10" />
                  <path d="M12 24c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12z" fill="#65bad6" />
                  <path d="M24 16v8l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {/* Verification pulse animation */}
              <span className="verification-pulse" aria-label="Verified" />
              <span>KYC / KYB • Verified</span>
            </div>
            <div className="gap-4 grid steps">
              <div className="gap-1 grid bg-white/5 p-4 border border-white/10 rounded-xl step">
                <span className="step-badge">1</span>
                <span className="font-bold s-title">Join the HHDAO Platform</span>
                <span className="text-[#bfc3ce] text-base muted">Sign up and create a profile. Complete verification to keep the ecosystem secure and compliant.</span>
              </div>
              <div className="gap-1 grid bg-white/5 p-4 border border-white/10 rounded-xl step">
                <span className="step-badge">2</span>
                <span className="font-bold s-title">Choose Your Path</span>
                <span className="text-[#bfc3ce] text-base muted">Create or join a DAO, list a project, discover opportunities, or find work that matches your skills.</span>
              </div>
              <div className="gap-1 grid bg-white/5 p-4 border border-white/10 rounded-xl step">
                <span className="step-badge">3</span>
                <span className="font-bold s-title">Govern & Grow</span>
                <span className="text-[#bfc3ce] text-base muted">Fund, vote, and manage resources transparently. Share outcomes with community stakeholders.</span>
              </div>
            </div>
          </div>
          <div className="items-center gap-4 grid md:grid-cols-2 bg-gradient-to-b from-[#1d1e22] to-[#121317] mt-10 p-7 border border-white/10 rounded-[40px] cta-band">
            <div>
              <div className="bg-clip-text bg-gradient-to-r from-[#8c42c8] to-[#65bad6] font-bold text-transparent text-sm uppercase eyebrow">Jump Right In</div>
              <h3 className="mt-1 mb-0 font-dela font-bold text-xl">Start Raising Funds and Contributing to Projects Today</h3>
            </div>
            <a className="bg-gradient-to-r from-[#3a2a66] to-[#191a1f] shadow-lg px-5 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn primary" href="#signup">Get Started</a>
          </div>
        </div>
      </section>

      {/* Resources section placeholder for dead nav link */}
      <section id="resources" className="wrap" aria-label="Resources" style={{paddingTop:'24px'}}>
        <h2 style={{margin:'0 0 12px'}}>Resources</h2>
        <p className="muted">Docs, guides, and FAQs are coming soon.</p>
      </section>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50" data-testid="success-message">
          Project created successfully!
        </div>
      )}

      {/* Project Creation Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-indigo-900 p-8 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">Create New Solar Project</h3>
            <form onSubmit={handleSubmitProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  data-testid="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-800 border border-indigo-700 rounded-lg text-white"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Project Location</label>
                <input
                  type="text"
                  data-testid="project-location"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-800 border border-indigo-700 rounded-lg text-white"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  data-testid="submit-project"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Submit Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

