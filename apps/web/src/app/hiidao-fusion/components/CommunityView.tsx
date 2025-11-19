import React from "react";

const CommunityView: React.FC = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-content">
        <h1 id="hero-title" className="hero-title">
          HeliosHash DAO
        </h1>
        <p className="hero-subtitle">
          From Sunlight to Sovereignty. One Block at a Time.
        </p>
        <p className="hero-description">
          Decentralized governance for rural communities through solar energy and blockchain technology
        </p>
        <div className="hero-actions">
          <button className="cta-button primary">Get Started</button>
          <button className="cta-button secondary">Learn More</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Community Members</span>
          </div>
          <div className="stat">
            <span className="stat-number">25MW</span>
            <span className="stat-label">Clean Energy</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        {/* Optional: Add an illustration or image here */}
        <div className="hero-graphic">
          <div className="solar-panel"></div>
          <div className="blockchain-node"></div>
          <div className="community-icon"></div>
        </div>
      </div>
    </section>
  );
};

export default CommunityView;