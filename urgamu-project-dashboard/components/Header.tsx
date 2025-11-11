import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 border-b-2 border-gold/20">
      <div className="chakra text-5xl md:text-6xl font-bold text-gold animate-pulse-glow mb-2">
        ॐ उर्गमू
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold text-lighttext tracking-wider">
        From Sunlight to Sovereignty
      </h1>
      <p className="text-cyan text-sm md:text-base mt-2">The First DAO-Governed Rural Economic Zone in India</p>
    </header>
  );
};

export default Header;
