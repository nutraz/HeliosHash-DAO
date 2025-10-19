import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              HeliosHash
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}DAO
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Decentralized solar infrastructure + community governance for rural India
            </p>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              Empowering communities with 100% community-owned solar projects, transparent governance,
              and sustainable development from sunlight to sovereignty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Explore Projects
              </Link>
              <Link
                href="/community"
                className="border-2 border-slate-400 hover:border-slate-300 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-slate-800"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <div className="text-slate-300">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
              <div className="text-slate-300">Community Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">3</div>
              <div className="text-slate-300">Governance Proposals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">2</div>
              <div className="text-slate-300">Animal Care Reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Complete DAO Ecosystem
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From solar project funding to community governance, animal welfare, and transparent treasury management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Solar Projects */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Solar Infrastructure</h3>
              <p className="text-slate-300 mb-4">
                Fund and manage community-owned solar projects in rural Gujarat. From Urgam Valley to Dharampur.
              </p>
              <Link href="/projects" className="text-blue-400 hover:text-blue-300 font-medium">
                View Projects →
              </Link>
            </div>

            {/* Community Governance */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">DAO Governance</h3>
              <p className="text-slate-300 mb-4">
                Participate in transparent decision-making. Vote on proposals, manage treasury, and shape the future.
              </p>
              <Link href="/governance" className="text-purple-400 hover:text-purple-300 font-medium">
                Join Governance →
              </Link>
            </div>

            {/* Community Applications */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-green-500/50 transition-all duration-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Hub</h3>
              <p className="text-slate-300 mb-4">
                Land partners, technical collaborators, and community contributors unite for sustainable development.
              </p>
              <Link href="/community" className="text-green-400 hover:text-green-300 font-medium">
                Explore Community →
              </Link>
            </div>

            {/* Animal Care */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all duration-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Animal Welfare</h3>
              <p className="text-slate-300 mb-4">
                Community-driven animal care initiatives. Report issues, vote on solutions, earn rewards.
              </p>
              <Link href="/community/animal-care" className="text-orange-400 hover:text-orange-300 font-medium">
                Help Animals →
              </Link>
            </div>

            {/* NFT Membership */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all duration-200">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">NFT Membership</h3>
              <p className="text-slate-300 mb-4">
                Own your stake in the community. Community, Supporter, Investor, and Partner tiers available.
              </p>
              <Link href="/wallet" className="text-pink-400 hover:text-pink-300 font-medium">
                View Membership →
              </Link>
            </div>

            {/* Rewards System */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200">
              <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Rewards & Incentives</h3>
              <p className="text-slate-300 mb-4">
                Earn tokens for participation. Community contributions, governance votes, and project milestones.
              </p>
              <Link href="/rewards" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Claim Rewards →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Join the Solar Revolution?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Connect your wallet and become part of India's first community-owned solar DAO.
            From sunlight to sovereignty, one block at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-testid="connect-wallet-button"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Connect Wallet
            </button>
            <Link
              href="/auth/login"
              className="border-2 border-slate-400 hover:border-slate-300 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-slate-800 text-center"
            >
              Sign In
            </Link>
          </div>

          <p className="text-slate-400 mt-6 text-sm">
            Built on Internet Computer • Fully Decentralized • Community Owned
          </p>
        </div>
      </section>
    </main>
  );
}
