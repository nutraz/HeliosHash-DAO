
export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 min-h-screen font-sans text-white">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-gradient-to-b from-indigo-950/90 via-indigo-900/80 to-indigo-950/60 backdrop-blur-lg">
        <div className="flex justify-between items-center gap-4 mx-auto px-5 py-4 max-w-6xl">
          <a className="brand" href="#">
            {/* Inline SVG logo */}
            <span style={{display:'inline-block',width:'34px',height:'34px'}}>
              <svg viewBox="0 0 48 48" fill="none" aria-label="HeliosHash DAO Logo">
                <circle cx="24" cy="24" r="22" stroke="#8c42c8" strokeWidth="2" fill="#0e0e10" />
                <circle cx="24" cy="24" r="14" fill="#65bad6" />
                {/* "H" hash mark */}
                <rect x="21" y="16" width="6" height="16" rx="3" fill="#fff" />
                <rect x="16" y="21" width="16" height="6" rx="3" fill="#fff" />
              </svg>
            </span>
            <span className="font-extrabold tracking-tight">HeliosHash DAO</span>
          </a>
          <nav className="hidden md:flex flex-wrap items-center gap-6 navlinks">
            <a href="#dao" className="opacity-90 text-white text-sm no-underline">DAO</a>
            <a href="#smb" className="opacity-90 text-white text-sm no-underline">Small Businesses</a>
            <a href="#resources" className="opacity-90 text-white text-sm no-underline">Resources</a>
          </nav>
          <div className="flex flex-wrap items-center gap-2 actions">
            <a className="bg-[#17171a] px-4 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn" href="#list">List a Project</a>
            <a className="bg-gradient-to-r from-[#3a2a66] to-[#191a1f] shadow-lg px-4 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn primary" href="#signup">Sign Up</a>
          </div>
        </div>
      </header>

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
            <a className="px-6 py-3 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition" href="#get-started">Get Started</a>
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

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0b0b0d] to-[#0a0a0c] px-5 py-6 border-white/10 border-t text-[#8f9098] text-xs">
        <div className="flex md:flex-row flex-col flex-wrap justify-between gap-3 mx-auto max-w-[1200px] footer-wrap">
          <div>© {new Date().getFullYear()} HHDAO. All rights reserved.</div>
          <div className="flex flex-wrap gap-4 footer-links">
            <a href="#" className="text-[#a6a6af] no-underline">Terms of Service</a>
            <a href="#" className="text-[#a6a6af] no-underline">Privacy Policy</a>
            <a href="#" className="text-[#a6a6af] no-underline">Contact</a>
            <a href="#" className="text-[#a6a6af] no-underline">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

