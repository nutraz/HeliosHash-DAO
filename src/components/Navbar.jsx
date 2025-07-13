import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">HeliosHash DAO</h1>
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/stake">Stake</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/kyc">KYC</Link>
        <Link to="/nfts">NFTs</Link>
      </div>
    </nav>
  );
}

export default Navbar;
