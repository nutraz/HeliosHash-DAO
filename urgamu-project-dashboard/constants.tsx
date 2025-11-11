import React from 'react';

export const exchangeRates = [
  { asset: '1 USD', value: '₹84.60' },
  { asset: '1 MATIC', value: '$0.62' },
  { asset: '1 ETH', value: '$4,800' },
  { asset: '1 BTC', value: '$92,000' },
];

export const phase1Cost = [
  { component: 'DAO + Legal (IFSCA SPE)', usd: '$42k', inr: '₹3.55M', matic: '67k', eth: '8.8', btc: '0.46' },
  { component: 'Tech (ICP + Polygon)', usd: '$80k', inr: '₹6.77M', matic: '129k', eth: '16.7', btc: '0.87' },
  { component: 'Feasibility & Drone LiDAR', usd: '$58k', inr: '₹4.90M', matic: '94k', eth: '12.1', btc: '0.63' },
  { component: 'Community (Discord + Local)', usd: '$38k', inr: '₹3.22M', matic: '61k', eth: '7.9', btc: '0.41' },
  { component: 'Land Option (99-yr lease)', usd: '$67k', inr: '₹5.67M', matic: '108k', eth: '14.0', btc: '0.73' },
];

export const totalProjectCost = [
  { phase: '12 km Hybrid Highway', usd: '$13.2M', inr: '₹111.7Cr', matic: '21.3M', eth: '2,750', btc: '143' },
  { phase: '5 MW Solar + 2 MW Micro-Hydro', usd: '$2.4M', inr: '₹20.3Cr', matic: '3.9M', eth: '500', btc: '26' },
  { phase: 'DAO + Digital Infra', usd: '$0.68M', inr: '₹5.75Cr', matic: '1.1M', eth: '142', btc: '7.4' },
  { phase: 'Training & Jobs (5 yrs)', usd: '$0.61M', inr: '₹5.16Cr', matic: '0.98M', eth: '127', btc: '6.6' },
  { phase: 'Contingency (8%)', usd: '$1.83M', inr: '₹15.5Cr', matic: '3.0M', eth: '381', btc: '20' },
  { phase: 'Grand Total', usd: '$22.89M', inr: '₹193.6Cr', matic: '36.98M', eth: '4,900', btc: '255' },
];

export const daoGovernance = [
  { tier: 'Elder', seats: '7', entry: '5k ONE + 24 mo', voteWeight: '128 PTS', reputationSource: 'Proposals passed' },
  { tier: 'Steward', seats: '21', entry: '2k ONE + 12 mo', voteWeight: '64 PTS', reputationSource: 'GitHub + Jobs' },
  { tier: 'Citizen', seats: '∞', entry: '100 ONE or 1kWh ENERGY', voteWeight: '1 PTS', reputationSource: 'KYC + Aadhaar' },
];

export const teamPods = [
    { pod: 'Blockchain', heads: '12', avgSalary: '$78k', remote: '75%', local: '25%' },
    { pod: 'Civil & Energy', heads: '28', avgSalary: '$52k', remote: '30%', local: '70%' },
    { pod: 'Community', heads: '25', avgSalary: '$38k', remote: '60%', local: '40%' },
    { pod: 'Advisory', heads: '30', avgSalary: 'Pro-bono / tokens', remote: '–', local: '–' },
    { pod: 'Total', heads: '95', avgSalary: '$6.1M/yr', remote: '', local: '' },
];

export const urgamOneTokenomics = [
    { percentage: '50%', allocation: 'Community Airdrop + Staking (5 yr linear)' },
    { percentage: '20%', allocation: 'Ecosystem Fund (Quadratic Grants)' },
    { percentage: '15%', allocation: 'Core Team (4 yr cliff + linear)' },
    { percentage: '10%', allocation: 'Liquidity (Uniswap v4)' },
    { percentage: '05%', allocation: 'Treasury (5-of-9 Multi-sig)' },
];

export const energyTokenomics = [
    { title: 'Mint', description: '1 ENERGY = 1 kWh verified (I-REC + RE-C)' },
    { title: 'Burn', description: '30% on every spend' },
    { title: 'Utility', description: 'Pay electricity, stake for vote power, upgrade to Governance NFT' },
    { title: 'Anti-Whale', description: 'Max 0.5% per wallet' },
];

export const milestones = [
  { milestone: '1. DAO Launch', timeline: 'M1-3', cost: '$285k', deliverables: 'DApp, 1,500 members' },
  { milestone: '2. Land & Surveys', timeline: 'M4-9', cost: '$1.2M', deliverables: 'LiDAR, blueprints' },
  { milestone: '3. Infrastructure', timeline: 'M10-24', cost: '$18.2M', deliverables: '12 km highway, 7 MW grid' },
  { milestone: '4. Economic Zone', timeline: 'M25-36', cost: '$2.07M', deliverables: 'Token live, revenue' },
];

export const kpis = [
    { stream: 'Pilgrimage', year3: '$0.9M', year5: '$1.6M', pessimistic: '$0.96M' },
    { stream: 'RE-C Sales', year3: '$0.6M', year5: '$1.1M', pessimistic: '$0.66M' },
    { stream: 'NFT Leases', year3: '$0.3M', year5: '$0.7M', pessimistic: '$0.42M' },
    { stream: 'Total', year3: '$1.8M', year5: '$3.4M', pessimistic: '$2.04M' },
];

export const partners = [
    { partner: 'IFSCA GIFT City', role: 'SPE for DAO' },
    { partner: 'SEBI Sandbox', role: 'Tokenized RE-C' },
    { partner: 'PM Gati Shakti', role: 'Highway alignment' },
    { partner: 'Polygon + ICP', role: 'Layer 1' },
    { partner: 'Uttarakhand Govt', role: 'Land + MoU' },
];

export const highwayRedesign = [
    { spec: 'Length', value: '12 km (loop)' },
    { spec: 'Type', value: 'Hybrid: 4 km cable-stay + 8 km viaduct' },
    { spec: 'Cost', value: '$13.2M ($1.1M/km)' },
    { spec: 'CO₂', value: '9.6 kt (50% recycled steel)' },
    { spec: 'Timeline', value: '18 months' },
];

export const legalRoadmap = [
    { step: '1', date: "Nov '25", action: 'File SPE @ IFSCA' },
    { step: '2', date: "Jan '26", action: 'SEBI Sandbox' },
    { step: '3', date: "Apr '26", action: 'RBI LRS' },
    { step: '4', date: "Jul '26", action: 'State MoU' },
];

export const techStack = [
    { component: 'Oracle', detail: 'Chainlink + IoT Meters (Sigfox)' },
    { component: 'Identity', detail: 'Aadhaar eKYC + Worldcoin (optional)' },
    { component: 'Frontend', detail: 'Next.js 15 + Lit + Tailwind v4' },
    { component: 'Features', detail: 'PWA + Offline + Hindi + Voice Mode (Grok-3)' },
];

export const motokoCode = `actor EnergyLedger {
  stable var totalMinted : Nat = 0;
  stable var totalBurned  : Nat = 0;

  public shared(msg) func mint(kwh: Nat) : async Bool {
    if (verifyRECertificate(kwh)) { 
      totalMinted += kwh; 
      return true; 
    }
    false
  };

  public shared(msg) func spend(amount: Nat) : async Bool {
    if (balanceOf(msg.caller) >= amount) {
      burn(amount * 3 / 10); // 30% burn
      return true;
    };
    false
  };
}`;

export const icons = {
  vision: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.43a1.012 1.012 0 011.43 0l4.43 4.43a1.012 1.012 0 010 1.43l-4.43 4.43a1.012 1.012 0 01-1.43 0l-4.43-4.43z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 9.11l-2.064 2.064a.75.75 0 000 1.06l2.064 2.064" /><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.11l-2.064 2.064a.75.75 0 000 1.06l2.064 2.064" /></svg>,
  finance: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 01.75.75v.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 01.75.75v.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 01.75.75v.75m0 0A3.75 3.75 0 0112 21.75H8.25A3.75 3.75 0 014.5 18V7.5A3.75 3.75 0 018.25 3.75h5.25a3.75 3.75 0 013.75 3.75V15M12 21.75v-4.137M15.75 21.75v-4.137" /></svg>,
  cost: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982l.879-.659m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  phase1: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-6.16 12.12A14.98 14.98 0 0015.59 14.37z" /></svg>,
  governance: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m7.512 2.72a8.97 8.97 0 01-7.512 0m7.512 2.72v-3.375c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v3.375m0 0a3 3 0 006.75 0h-6.75z" /></svg>,
  token: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.792V6.31a2.25 2.25 0 00-1.353-2.083l-7.5-4.5a2.25 2.25 0 00-2.294 0l-7.5 4.5A2.25 2.25 0 003 6.31v6.482a2.25 2.25 0 001.353 2.082l7.5 4.5a2.25 2.25 0 002.294 0l7.5-4.5A2.25 2.25 0 0021 12.792z" /></svg>,
  energy: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  tech: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  stack: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 15.25l5.571-3m-5.571 0l-5.571 3m5.571-3l5.571 3m0 0l4.179-2.25L12 9.75l-5.571 3z" /></svg>,
  milestone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  kpi: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
  team: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m7.512 2.72a8.97 8.97 0 01-7.512 0m7.512 2.72v-3.375c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v3.375m0 0a3 3 0 006.75 0h-6.75z" /></svg>,
};
