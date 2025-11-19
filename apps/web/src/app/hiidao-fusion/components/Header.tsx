'use client';

interface HeaderProps {
  onLoginClick: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Header({ onLoginClick, activeSection, onSectionChange, isAuthenticated = false, onLogout }: HeaderProps) {
  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div className="logo">
          <h1>HeliosHash DAO</h1>
        </div>
        <nav className="navigation" aria-label="Main navigation">
          <ul>
            <li>
              <button 
                onClick={() => onSectionChange('dashboard')}
                aria-current={activeSection === 'dashboard' ? 'page' : undefined}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSectionChange('onboarding')}
                aria-current={activeSection === 'onboarding' ? 'page' : undefined}
              >
                Onboarding
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSectionChange('profile')}
                aria-current={activeSection === 'profile' ? 'page' : undefined}
              >
                Profile
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSectionChange('settings')}
                aria-current={activeSection === 'settings' ? 'page' : undefined}
              >
                Settings
              </button>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          {!isAuthenticated ? (
            <button 
              onClick={onLoginClick}
              className="login-button"
              aria-label="Login to your account"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={onLogout} className="logout-button">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
