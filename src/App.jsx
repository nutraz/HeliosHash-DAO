import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Stake from './pages/Stake';
import Payments from './pages/Payments';
import KYC from './pages/KYC';
import NFT from './pages/NFT';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stake" element={<Stake />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/nfts" element={<NFT />} />
      </Routes>
    </Router>
  );
}

export default App;
