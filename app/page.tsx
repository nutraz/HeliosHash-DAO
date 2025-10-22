
import Link from 'next/link';
import { SunIcon, BuildingIcon, GroupIcon, HeartIcon, StarIcon, DollarIcon } from '@/components/ui/icons';

export default function HomePage() {
  return (
  <main className="min-h-screen bg-gradient-to-br from-saffron-500 via-white to-navy-900 font-poppins">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/10 to-navy-900/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-900 mb-6 font-poppins">
              HeliosHash <span className="text-saffron-500">DAO</span>
            </h1>
            <p className="text-xl sm:text-2xl text-navy-800 mb-8 max-w-3xl mx-auto">
              Decentralized solar infrastructure + community governance for rural India
            </p>
            <p className="text-lg text-navy-900/80 mb-12 max-w-2xl mx-auto">
              Empowering communities with 100% community-owned solar projects, transparent governance,
              and sustainable development from sunlight to sovereignty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="bg-saffron-500 hover:bg-saffron-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Explore Projects
              </Link>
              <Link
                href="/community"
                className="border-2 border-saffron-500 hover:border-saffron-600 text-saffron-500 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:bg-saffron-500"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
  <section className="py-16 bg-navy-800/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2"><SunIcon className="w-10 h-10 text-saffron-500" /></div>
              <div className="text-3xl font-bold text-saffron-500 mb-1">3</div>
              <div className="text-navy-900">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2"><BuildingIcon className="w-10 h-10 text-green-800" /></div>
              <div className="text-3xl font-bold text-green-800 mb-1">4</div>
              <div className="text-navy-900">Community Applications</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2"><GroupIcon className="w-10 h-10 text-navy-900" /></div>
              <div className="text-3xl font-bold text-navy-900 mb-1">3</div>
              <div className="text-navy-900">Governance Proposals</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2"><HeartIcon className="w-10 h-10 text-orange-500" /></div>
              <div className="text-3xl font-bold text-orange-500 mb-1">2</div>
              <div className="text-navy-900">Animal Care Reports</div>
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
            <div className="bg-white/90 rounded-xl p-6 border border-saffron-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <SunIcon className="w-10 h-10 text-saffron-500" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Solar Infrastructure</h3>
              <p className="text-navy-800 mb-4">
                Fund and manage community-owned solar projects in rural Gujarat. From Urgam Valley to Dharampur.
              </p>
              <Link href="/projects" className="text-saffron-500 hover:text-saffron-600 font-medium">
                View Projects →
              </Link>
            </div>

            {/* Community Governance */}
            <div className="bg-white/90 rounded-xl p-6 border border-green-800 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <BuildingIcon className="w-10 h-10 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">DAO Governance</h3>
              <p className="text-navy-800 mb-4">
                Participate in transparent decision-making. Vote on proposals, manage treasury, and shape the future.
              </p>
              <Link href="/governance" className="text-green-800 hover:text-green-900 font-medium">
                Join Governance →
              </Link>
            </div>

            {/* Community Applications */}
            <div className="bg-white/90 rounded-xl p-6 border border-navy-900 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <GroupIcon className="w-10 h-10 text-navy-900" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Community Hub</h3>
              <p className="text-navy-800 mb-4">
                Land partners, technical collaborators, and community contributors unite for sustainable development.
              </p>
              <Link href="/community" className="text-navy-900 hover:text-navy-800 font-medium">
                Explore Community →
              </Link>
            </div>

            {/* Animal Care */}
            <div className="bg-white/90 rounded-xl p-6 border border-orange-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <HeartIcon className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Animal Welfare</h3>
              <p className="text-navy-800 mb-4">
                Community-driven animal care initiatives. Report issues, vote on solutions, earn rewards.
              </p>
              <Link href="/community/animal-care" className="text-orange-500 hover:text-orange-600 font-medium">
                Help Animals →
              </Link>
            </div>

            {/* NFT Membership */}
            <div className="bg-white/90 rounded-xl p-6 border border-gold-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <StarIcon className="w-10 h-10 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">NFT Membership</h3>
              <p className="text-navy-800 mb-4">
                Own your stake in the community. Community, Supporter, Investor, and Partner tiers available.
              </p>
              <Link href="/wallet" className="text-gold-500 hover:text-gold-600 font-medium">
                View Membership →
              </Link>
            </div>

            {/* Rewards System */}
            <div className="bg-white/90 rounded-xl p-6 border border-electric-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <DollarIcon className="w-10 h-10 text-electric-500" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Rewards & Incentives</h3>
              <p className="text-navy-800 mb-4">
                Earn tokens for participation. Community contributions, governance votes, and project milestones.
              </p>
              <Link href="/rewards" className="text-electric-500 hover:text-electric-600 font-medium">
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
