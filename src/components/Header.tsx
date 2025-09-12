import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.tsx';

export const Header = () => {
  const { user, logout } = useAuthContext();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">HeliosHash DAO</div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.username}!</span>
              <ul className="flex space-x-4">
                <li><Link to="/" className="text-gray-700 hover:text-indigo-600">Dashboard</Link></li>
                <li><Link to="/projects" className="text-gray-700 hover:text-indigo-600">Projects</Link></li>
                <li><Link to="/governance" className="text-gray-700 hover:text-indigo-600">Governance</Link></li>
                <li><Link to="/nft" className="text-gray-700 hover:text-indigo-600">NFT</Link></li>
              </ul>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
