import { type FC } from 'react';
import { Link } from 'react-router-dom';

const Navbar: FC = () => {
  return (
    <nav className="navbar">
      <a className="brand" href="/">
        HeliosHash DAO
      </a>
      <div className="space-x-6 font-medium text-base">
        <Link to="/">Dashboard</Link>
        <Link to="/stake">Stake</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/kyc">KYC</Link>
        <Link to="/nfts">NFTs</Link>
      </div>
    </nav>
  );
};

export default Navbar;
