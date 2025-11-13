import React from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Card from './components/Card';
import DataTable from './components/DataTable';
import CodeBlock from './components/CodeBlock';
import {
  exchangeRates,
  phase1Cost,
  totalProjectCost,
  daoGovernance,
  teamPods,
  urgamOneTokenomics,
  energyTokenomics,
  milestones,
  techStack,
  kpis,
  partners,
  highwayRedesign,
  legalRoadmap,
  motokoCode,
  icons
} from './constants';

const App: React.FC = () => {
  return (
    <div className="bg-navy text-lighttext min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="container mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-12">
            <Section title="Project Vision" icon={icons.vision}>
              <p className="text-lg text-slate-300">
                UrgamU transforms Urgam Valley, Uttarakhand into a decentralized, sustainable, and spiritually rooted smart city — the first DAO-governed rural economic zone in India. Powered by Blockchain (ICP + Polygon), Renewable Energy, and a blend of Traditional Wisdom with Web3 Innovation.
              </p>
            </Section>
          </div>
          
          <div className="lg:col-span-4">
            <Section title="Financial Snapshot (11 Nov 2025)" icon={icons.finance}>
              <div className="space-y-4">
                {exchangeRates.map((rate, index) => (
                  <Card key={index} className="flex justify-between items-center bg-slate-800/50">
                    <span className="text-slate-300">{rate.asset}</span>
                    <span className="text-xl font-bold text-cyan">{rate.value}</span>
                  </Card>
                ))}
              </div>
            </Section>
          </div>

          <div className="lg:col-span-8">
            <Section title="Total Project Cost: $22.89M (₹193.6 Cr)" icon={icons.cost}>
              <DataTable
                headers={['Phase', 'USD', 'INR', 'MATIC', 'ETH', 'BTC']}
                data={totalProjectCost}
                renderRow={(item) => (
                  <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-200">{item.phase}</td>
                    <td className="p-3 text-cyan">{item.usd}</td>
                    <td className="p-3 text-slate-300">{item.inr}</td>
                    <td className="p-3 text-slate-300">{item.matic}</td>
                    <td className="p-3 text-slate-300">{item.eth}</td>
                    <td className="p-3 text-slate-300">{item.btc}</td>
                  </tr>
                )}
              />
            </Section>
          </div>

          <div className="lg:col-span-12">
             <Section title="Phase 1: Foundation & DAO Setup – $285,000" icon={icons.phase1}>
                <DataTable
                  headers={['Component', 'USD', 'INR', 'MATIC', 'ETH', 'BTC']}
                  data={phase1Cost}
                  renderRow={(item) => (
                    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold text-slate-200">{item.component}</td>
                      <td className="p-3 text-cyan">{item.usd}</td>
                      <td className="p-3 text-slate-300">{item.inr}</td>
                      <td className="p-3 text-slate-300">{item.matic}</td>
                      <td className="p-3 text-slate-300">{item.eth}</td>
                      <td className="p-3 text-slate-300">{item.btc}</td>
                    </tr>
                  )}
                />
            </Section>
          </div>

          <div className="lg:col-span-7">
            <Section title="DAO Governance – Reputation + Stake" icon={icons.governance}>
              <DataTable
                headers={['Tier', 'Seats', 'Entry', 'Vote Weight', 'Reputation Source']}
                data={daoGovernance}
                renderRow={(item) => (
                  <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-gold">{item.tier}</td>
                    <td className="p-3 text-slate-300">{item.seats}</td>
                    <td className="p-3 text-slate-300">{item.entry}</td>
                    <td className="p-3 text-cyan font-semibold">{item.voteWeight}</td>
                    <td className="p-3 text-slate-300">{item.reputationSource}</td>
                  </tr>
                )}
              />
            </Section>
          </div>
          
          <div className="lg:col-span-5">
            <Section title="Tokenomics 2.0: UrgamONE (ERC-20)" icon={icons.token}>
                <ul className="space-y-2">
                    {urgamOneTokenomics.map((item, index) => (
                        <li key={index} className="flex justify-between p-2 bg-slate-800/50 rounded-md">
                            <span className="text-slate-300">{item.allocation}</span>
                            <span className="font-bold text-gold">{item.percentage}</span>
                        </li>
                    ))}
                </ul>
            </Section>
          </div>

          <div className="lg:col-span-12">
             <Section title="Tokenomics 2.0: ENERGY (SBT on ICP)" icon={icons.energy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {energyTokenomics.map((item, index) => (
                        <Card key={index} className="bg-slate-800/50">
                            <h4 className="text-gold font-bold text-lg">{item.title}</h4>
                            <p className="text-slate-300 mt-1">{item.description}</p>
                        </Card>
                    ))}
                </div>
            </Section>
          </div>

          <div className="lg:col-span-7">
            <Section title="Technical Architecture" icon={icons.tech}>
                <CodeBlock code={motokoCode} language="motoko" />
            </Section>
          </div>
          
          <div className="lg:col-span-5">
            <Section title="Blockchain Stack" icon={icons.stack}>
                <ul className="space-y-3">
                    {techStack.map((item, index) => (
                        <li key={index} className="p-3 bg-slate-800/50 rounded-md">
                            <div className="font-bold text-cyan">{item.component}</div>
                            <div className="text-slate-300">{item.detail}</div>
                        </li>
                    ))}
                </ul>
            </Section>
          </div>

          <div className="lg:col-span-12">
            <Section title="Milestone-Based Funding" icon={icons.milestone}>
              <DataTable
                headers={['Milestone', 'Timeline', 'Cost', 'Deliverables']}
                data={milestones}
                renderRow={(item) => (
                  <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-gold">{item.milestone}</td>
                    <td className="p-3 text-slate-300">{item.timeline}</td>
                    <td className="p-3 text-cyan">{item.cost}</td>
                    <td className="p-3 text-slate-300">{item.deliverables}</td>
                  </tr>
                )}
              />
            </Section>
          </div>
           <div className="lg:col-span-6">
              <Section title="KPIs & Revenue (Stress-Tested)" icon={icons.kpi}>
                <DataTable
                  headers={['Stream', 'Year 3', 'Year 5', 'Pessimistic (60%)']}
                  data={kpis}
                  renderRow={(item) => (
                    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold text-slate-200">{item.stream}</td>
                      <td className="p-3 text-cyan">{item.year3}</td>
                      <td className="p-3 text-cyan">{item.year5}</td>
                      <td className="p-3 text-slate-300">{item.pessimistic}</td>
                    </tr>
                  )}
                />
              </Section>
          </div>
          <div className="lg:col-span-6">
              <Section title="Organizational Structure (95 Members)" icon={icons.team}>
                <DataTable
                  headers={['Pod', 'Heads', 'Avg Salary', 'Remote %', 'Local %']}
                  data={teamPods}
                  renderRow={(item) => (
                    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold text-slate-200">{item.pod}</td>
                      <td className="p-3 text-slate-300">{item.heads}</td>
                      <td className="p-3 text-cyan">{item.avgSalary}</td>
                      <td className="p-3 text-slate-300">{item.remote}</td>
                      <td className="p-3 text-slate-300">{item.local}</td>
                    </tr>
                  )}
                />
              </Section>
          </div>
        </div>
      </main>
      <footer className="text-center text-slate-500 mt-12 pb-4">
        UrgamU DAO © 2025 | From Sunlight to Sovereignty
      </footer>
    </div>
  );
};

export default App;
