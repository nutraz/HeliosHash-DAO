import React from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-hh-white">HeliosHash DAO</div>
      <div className="hidden md:flex space-x-8">
        <a href="#features" className="text-hh-white hover:text-hh-sky-blue">Features</a>
        <a href="#community" className="text-hh-white hover:text-hh-sky-blue">Community</a>
        <a href="#about" className="text-hh-white hover:text-hh-sky-blue">About</a>
      </div>
      <button className="btn btn-primary">Join Now</button>
    </nav>
  </header>
);

const Hero = () => (
  <section className="container mx-auto px-6 py-32 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-hh-white leading-tight">
        Empowering Communities with <span className="text-hh-sky-blue">Decentralized Solar Energy</span>
      </h1>
      <p className="mt-4 text-lg text-hh-white max-w-2xl mx-auto">
        Join HeliosHash DAO to fund, build, and benefit from community-owned solar energy projects.
      </p>
      <div className="mt-8 flex justify-center space-x-4">
        <button className="btn btn-primary">Get Started</button>
        <button className="btn btn-secondary">Learn More</button>
      </div>
    </motion.div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-hh-dark-blue">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-hh-white mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="glass-card p-8">
          <div className="text-5xl font-bold text-hh-sky-blue mb-4">1</div>
          <h3 className="text-2xl font-bold text-hh-white mb-2">Join the DAO</h3>
          <p className="text-hh-white">Become a member by acquiring a HeliosHash NFT. This gives you voting rights and access to our community.</p>
        </div>
        <div className="glass-card p-8">
          <div className="text-5xl font-bold text-hh-sky-blue mb-4">2</div>
          <h3 className="text-2xl font-bold text-hh-white mb-2">Fund a Project</h3>
          <p className="text-hh-white">Browse through community-proposed solar projects and use your tokens to fund the ones you believe in.</p>
        </div>
        <div className="glass-card p-8">
          <div className="text-5xl font-bold text-hh-sky-blue mb-4">3</div>
          <h3 className="text-2xl font-bold text-hh-white mb-2">Earn & Govern</h3>
          <p className="text-hh-white">Earn returns from the energy generated and participate in the governance of the projects you've funded.</p>
        </div>
      </div>
    </div>
  </section>
);

const Community = () => (
  <section id="community" className="py-20">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-hh-white mb-4">Join Our Community</h2>
      <p className="text-lg text-hh-white max-w-2xl mx-auto mb-8">
        Connect with other members, discuss proposals, and stay up-to-date with the latest news and developments.
      </p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="btn btn-primary">Join Discord</a>
        <a href="#" className="btn btn-secondary">Follow on Twitter</a>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section id="features" className="py-20">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-hh-white mb-12">Why Join HeliosHash DAO?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 text-center">
          <h3 className="text-2xl font-bold text-hh-sky-blue mb-4">Transparency</h3>
          <p className="text-hh-white">All decisions and transactions are recorded on the blockchain, ensuring full transparency and accountability.</p>
        </div>
        <div className="glass-card p-8 text-center">
          <h3 className="text-2xl font-bold text-hh-sky-blue mb-4">Community-Owned</h3>
          <p className="text-hh-white">You are not just an investor; you are an owner. Participate in governance and shape the future of the DAO.</p>
        </div>
        <div className="glass-card p-8 text-center">
          <h3 className="text-2xl font-bold text-hh-sky-blue mb-4">Sustainable Returns</h3>
          <p className="text-hh-white">Earn returns from solar energy production while contributing to a sustainable future.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-8">
    <div className="container mx-auto px-6 text-center text-sm text-hh-white">
      &copy; {new Date().getFullYear()} HeliosHash DAO. All Rights Reserved.
    </div>
  </footer>
);


export default function LandingPage() {
  return (
    <div className="bg-hh-dark-blue">
      <div className="background-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
