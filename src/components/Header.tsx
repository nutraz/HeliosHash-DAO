import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="top-0 z-50 sticky bg-gradient-to-b from-indigo-950/90 via-indigo-900/80 to-indigo-950/60 backdrop-blur-lg">
      <div className="flex justify-between items-center gap-4 mx-auto px-5 py-4 max-w-6xl">
        <Link className="brand" to="/">
          <img src="/logo no background.png" alt="HeliosHash DAO Logo" style={{display:'inline-block',width:'34px',height:'34px'}}/>
          <span className="font-extrabold tracking-tight">HeliosHash DAO</span>
        </Link>
        <nav className="hidden md:flex flex-wrap items-center gap-6 navlinks">
          <Link to="/#dao" className="opacity-90 text-white text-sm no-underline">DAO</Link>
          <Link to="/#smb" className="opacity-90 text-white text-sm no-underline">Small Businesses</Link>
          <Link to="/#resources" className="opacity-90 text-white text-sm no-underline">Resources</Link>
          <Link to="/dashboard" className="opacity-90 text-white text-sm no-underline">Dashboard</Link>
        </nav>
        <div className="flex flex-wrap items-center gap-2 actions">
          <Link className="bg-[#17171a] px-4 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn" to="/#list">List a Project</Link>
          <Link className="bg-gradient-to-r from-[#3a2a66] to-[#191a1f] shadow-lg px-4 py-2 border border-white/10 rounded-full font-semibold text-white text-sm no-underline btn primary" to="/#signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}
