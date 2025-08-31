import React from 'react';

export default function LandingPage() {
  return (
    <div className="bg-[#0e0e10] min-h-screen font-sans text-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', margin: 0, padding: 0 }}>
      <style>{`
        html { background: #0e0e10; }
        body::before { inset: -50vmax !important; }
        .header { position: sticky; top: 0; z-index: 100; }
        a:focus-visible, .btn:focus-visible {
          outline: 2px solid #65bad6;
          outline-offset: 2px;
          border-radius: 8px;
        }
        .muted { color: #bfc3ce !important; }
        .panel, .card { border-color: rgba(255,255,255,0.14) !important; }
        .grid-3 { grid-auto-rows: 1fr; }
        .btn.primary { font-weight: 700; box-shadow: 0 2px 16px #8c42c833,0 0 0 2px #8c42c822; }
        .btn { font-weight: 600; }
        .btn:not(.primary) { background: #17171a; border: 1px solid #65bad6; color: #bfc3ce; }
        .btn.primary { background: linear-gradient(111deg, #8c42c8, #65bad6); color: #fff; border: none; }
        .device-logo-anim {
          width: 48px; height: 48px; display: block; margin: 0 auto 12px auto;
          animation: logo-spin 3s linear infinite;
        }
        @keyframes logo-spin { 100% { transform: rotate(360deg); } }
        .verification-pulse {
          width: 18px; height: 18px; border-radius: 50%; background: #65bad6; box-shadow: 0 0 0 0 #65bad6;
          animation: pulse 1.5s infinite;
          margin: 0 auto 8px auto;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 #65bad6; }
          70% { box-shadow: 0 0 0 10px rgba(101,186,214,0); }
          100% { box-shadow: 0 0 0 0 rgba(101,186,214,0); }
        }
        .step-badge {
          display: inline-block; min-width: 24px; height: 24px; border-radius: 50%; background: #8c42c8; color: #fff; font-weight: 700; text-align: center; line-height: 24px; margin-right: 8px; font-size: 14px;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
          body::before, body::after { display: none !important; }
        }
      `}</style>
      {/* Header */}
      <header className="top-0 z-50 sticky bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/60 backdrop-blur-lg header">
        <div className="flex justify-between items-center gap-4 mx-auto px-5 py-3 max-w-[1200px] nav">
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
      <section className="items-center gap-10 grid grid-cols-1 md:grid-cols-2 mx-auto px-5 pt-20 pb-6 max-w-[1200px] hero">
        <div>
          <div className="bg-clip-text bg-gradient-to-r from-[#8c42c8] to-[#65bad6] font-bold text-transparent text-sm uppercase eyebrow">We Bring Together</div>
          <h1 className="mt-2 mb-2 font-dela font-bold text-4xl md:text-5xl leading-tight title">
            Organisations, Investors, and <span className="bg-clip-text bg-gradient-to-r from-[#8c42c8] to-[#65bad6] text-transparent accent">Local Communities</span>
          </h1>
          <p className="mb-2 max-w-xl text-[#a9a9b3] lead">
            To fund vital infrastructure, 100% community owned, where 100% of the profits go back to participants.
          </p>
          <div className="mt-3 mb-2 font-bold text-[#77c0ff] text-xs subline">From Sunlight to Sovereignty. One Block at a Time.</div>
          <div className="flex gap-3 mt-4 cta">
            <a className="bg-gradient-to-r from-[#3a2a66] to-[#191a1f] shadow-lg px-5 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn primary" href="#get-started">Get Started</a>
            <a className="bg-[#17171a] px-5 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn" href="#learn">Learn More</a>
          </div>
        </div>
        <div className="relative bg-gradient-to-b from-[#1d1e22] to-[#0d0e12] shadow-2xl border border-white/10 rounded-[40px] min-h-[360px] overflow-hidden hero-visual" aria-hidden="true" style={{position:'relative'}}>
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
          <div className="badge purple" style={{top: '16px', left: '16px', position: 'absolute', zIndex: 2}}>DAO Central</div>
          <div className="badge cyan" style={{top: '16px', right: '22px', position: 'absolute', zIndex: 2}}>Job Board</div>
          <div className="badge" style={{bottom: '18px', left: '50%', transform: 'translateX(-50%)', position: 'absolute', zIndex: 2, color:'#d6f1ff'}}>Small Business</div>
          {/* Orb animation (optional, above image but below badges) */}
          <div className="orb" style={{zIndex: 1}}></div>
        </div>
      </section>

      {/* Sustainable Ecosystem */}
      <section id="ecosystem" className="px-5 py-16">
        <div className="mx-auto max-w-[1200px] wrap">
          <div className="bg-gradient-to-b from-[#1d1e22] to-[#121317] shadow-2xl p-8 border border-white/10 rounded-[40px] panel">
            <span className="bg-clip-text bg-gradient-to-r from-[#8c42c8] to-[#65bad6] font-bold text-transparent text-sm uppercase eyebrow">The HHDAO Platform</span>
            <h3 className="mt-2 mb-2 font-dela font-bold text-2xl md:text-3xl">Sustainable Ecosystem</h3>
            <p className="mb-4 max-w-2xl text-[#a9a9b3] muted">HHDAO brings together a sustainable ecosystem of services on one platform.</p>
            <div className="gap-4 grid md:grid-cols-3 grid-3 mt-4">
              <article className="gap-2 grid bg-gradient-to-b from-[#1a1b1f] to-[#111217] p-5 border border-white/10 rounded-xl card" id="dao">
                <div className="flex justify-center items-center bg-gradient-to-r from-[#8c42c8] to-[#65bad6] shadow-inner rounded-lg w-9 h-9 font-extrabold text-[#0e0f12] icon">◎</div>
                <h4 className="font-dela font-bold text-lg">DAO</h4>
                <p className="text-[#a9a9b3] text-sm muted">Organisations or communities that fund and own their infrastructure, receiving 100% of the profits. Raise funds, manage resources transparently and collectively vote on project execution.</p>
              </article>
              <article className="gap-2 grid bg-gradient-to-b from-[#1a1b1f] to-[#111217] p-5 border border-white/10 rounded-xl card" id="smb">
                <div className="flex justify-center items-center bg-gradient-to-r from-[#8c42c8] to-[#65bad6] shadow-inner rounded-lg w-9 h-9 font-extrabold text-[#0e0f12] icon">₪</div>
                <h4 className="font-dela font-bold text-lg">Small Business</h4>
                <p className="text-[#a9a9b3] text-sm muted">Access funding, resources, and global markets through our decentralised platform, creating opportunities for growth and sustainability.</p>
              </article>
              <article className="gap-2 grid bg-gradient-to-b from-[#1a1b1f] to-[#111217] p-5 border border-white/10 rounded-xl card" id="jobs">
                <div className="flex justify-center items-center bg-gradient-to-r from-[#8c42c8] to-[#65bad6] shadow-inner rounded-lg w-9 h-9 font-extrabold text-[#0e0f12] icon">⟡</div>
                <h4 className="font-dela font-bold text-lg">Jobs Board</h4>
                <p className="text-[#a9a9b3] text-sm muted">Connect talent with opportunities. Professionals contribute to projects in exchange for equity or direct payment, fostering a symbiotic growth environment.</p>
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

