
import Link from 'next/link';
import Header from '@/components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground mb-6">
                HeliosHash{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DAO
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Decentralized solar infrastructure + community governance for rural India
              </p>
              <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                Empowering communities with 100% community-owned solar projects, transparent governance,
                and sustainable development from sunlight to sovereignty.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/projects"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore Projects
                </Link>
                <Link
                  href="/community"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Powering Sustainable Communities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our integrated approach combines solar energy, blockchain governance, and community empowerment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">☀️</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Solar Infrastructure</h3>
                <p className="text-muted-foreground">
                  Community-owned solar farms providing clean energy and economic opportunities for remote valleys.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-bold mb-4">DAO Governance</h3>
                <p className="text-muted-foreground">
                  Transparent, community-led decision making through decentralized autonomous organization principles.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-bold mb-4">OWP Rewards</h3>
                <p className="text-muted-foreground">
                  Earn One World Project tokens for participation, creating sustainable economic ecosystems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Urgam Valley Focus */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Transforming{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Urgam Valley
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Located in the remote Himalayas of Uttarakhand, Urgam Valley represents the perfect testbed 
                  for our decentralized solar governance model.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">100% renewable energy infrastructure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-foreground">Community-owned and operated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Transparent governance via blockchain</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">5 kW</div>
                    <div className="text-muted-foreground">Initial Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">50+</div>
                    <div className="text-muted-foreground">Households</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">100%</div>
                    <div className="text-muted-foreground">Community Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                    <div className="text-muted-foreground">Clean Energy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Notice */}
        <section className="py-16 bg-destructive/5 border-y border-destructive/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-destructive/10 text-destructive-foreground rounded-2xl p-8 border border-destructive/20">
              <h3 className="text-2xl font-bold mb-4">🚨 Important Security Notice</h3>
              <p className="text-lg mb-4">
                This project is in early alpha development. Smart contracts are unaudited and not production ready.
              </p>
              <p className="text-muted-foreground">
                Do not use with real funds. Estimated 8-12 months to production readiness.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">H</span>
                </div>
                <span className="text-xl font-bold text-foreground">HeliosHash DAO</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Transforming Uttarakhand's remote valleys through solar-powered decentralized governance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Project</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link></li>
                <li><Link href="/governance" className="hover:text-foreground transition-colors">Governance</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 HeliosHash DAO. Built with ❤️ for sustainable communities in the Himalayas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

