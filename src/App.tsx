import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// @ts-ignore
import Navbar from './components/Navbar';
// @ts-ignore
import LandingPage from "./pages/LandingPage";
import Dashboard from './components/Dashboard';
// @ts-ignore
import Stake from './pages/Stake';
// @ts-ignore
import Payments from './pages/Payments';
// @ts-ignore
import KYC from './pages/KYC';
// @ts-ignore
import NFT from './pages/NFT';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stake" element={<Stake />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/nfts" element={<NFT />} />
      </Routes>
    </Router>
  );
}

export default App;
