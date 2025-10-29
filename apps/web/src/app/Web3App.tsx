'use client'
import { Chrome, Globe, Mail, Wallet } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import Dashboard so SSR doesn't attempt to render the full app
const Dashboard = dynamic(() => import('@/components/dashboard/Dashboard'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading dashboard...</div>,
});

// Precompute spoke positions to avoid hydration issues
const SPOKE_POSITIONS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * 360) / 24;
  const radius = 100;
  const x2 = radius * Math.cos((angle - 90) * Math.PI / 180);
  const y2 = radius * Math.sin((angle - 90) * Math.PI / 180);
  return { x2: x2.toFixed(2), y2: y2.toFixed(2) };
});

const Web3App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if user has visited before
    const hasVisited = typeof window !== 'undefined' && localStorage.getItem('hasVisitedBefore');
    const savedLanguage = typeof window !== 'undefined' && localStorage.getItem('selectedLanguage');

    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      if (hasVisited) {
        setShowAuth(true);
      } else {
        setShowLanguageSelection(true);
      }
    }, 3000);

    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 16);

    return () => {
      clearTimeout(timer);
      clearInterval(rotationInterval);
    };
  }, []);

  // Development bypass: allow ?dev=1 or localStorage dev_bypass to show dashboard
  const [devBypass, setDevBypass] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const qp = new URLSearchParams(window.location.search).get('dev');
      const ls = localStorage.getItem('dev_bypass');
      if (qp === '1' || ls === 'true') setDevBypass(true);
    }
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', language);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    setShowLanguageSelection(false);
    setShowAuth(true);
  };

  const DhammaChakra = () => (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <div className="relative w-64 h-64" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Outer fiery ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 opacity-80 blur-sm animate-pulse"></div>

        {/* Main chakra body */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 shadow-2xl"></div>

        {/* Center circle */}
        <div className="absolute inset-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-inner"></div>

        {/* 24 Spokes - using precomputed positions */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
          <g transform="translate(128, 128)">
            {SPOKE_POSITIONS.map((spoke, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={spoke.x2}
                y2={spoke.y2}
                stroke="white"
                strokeWidth="3"
                opacity="0.9"
              />
            ))}
          </g>
        </svg>

        {/* Flame flares */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-full h-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 15}deg)`,
              transformOrigin: 'center'
            }}
          >
            <div
              className="absolute top-0 left-1/2 w-3 h-16 bg-gradient-to-t from-orange-600 via-orange-400 to-transparent rounded-full blur-sm"
              style={{
                transform: 'translateX(-50%) translateY(-20px)',
                animation: `flare ${1.5 + (i % 3) * 0.2}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          </div>
        ))}
        {[...Array(24)].map((_, i) => (
          <div
            key={`outer-${i}`}
            className="absolute top-1/2 left-1/2 w-full h-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 15 + 7.5}deg)`,
              transformOrigin: 'center'
            }}
          >
            <div
              className="absolute top-0 left-1/2 w-2 h-20 bg-gradient-to-t from-red-600 via-orange-500 to-transparent rounded-full blur-md"
              style={{
                transform: 'translateX(-50%) translateY(-25px)',
                animation: `flare ${1.8 + (i % 4) * 0.2}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.07}s`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const Logo = ({ small = false }: { small?: boolean }) => (
    <div className={`${small ? 'w-12 h-12' : 'w-32 h-32'} flex items-center justify-center`}>
      <img
        src="https://i.postimg.cc/1XxQvGCg/image.png"
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  const LanguageSelection = () => {
    const languages = [
      // Hindi and English first
      { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
      { code: 'en', name: 'English', flag: '🇬🇧' },

      // Indian and Subcontinental languages alphabetically
      { code: 'as', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
      { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
      { code: 'bho', name: 'भोजपुरी (Bhojpuri)', flag: '🇮🇳' },
      { code: 'brx', name: 'बड़ो (Bodo)', flag: '🇮🇳' },
      { code: 'doi', name: 'डोगरी (Dogri)', flag: '🇮🇳' },
      { code: 'dz', name: 'རྫོང་ཁ (Dzongkha)', flag: '🇧🇹' },
      { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
      { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
      { code: 'ks', name: 'كٲشُر (Kashmiri)', flag: '🇮🇳' },
      { code: 'kok', name: 'कोंकणी (Konkani)', flag: '🇮🇳' },
      { code: 'mai', name: 'मैथिली (Maithili)', flag: '🇮🇳' },
      { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
      { code: 'mni', name: 'ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)', flag: '🇮🇳' },
      { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
      { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
      { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
      { code: 'sa', name: 'संस्कृतम् (Sanskrit)', flag: '🇮🇳' },
      { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)', flag: '🇮🇳' },
      { code: 'sd', name: 'سنڌي (Sindhi)', flag: '🇵🇰' },
      { code: 'si', name: 'සිංහල (Sinhala)', flag: '🇱🇰' },
      { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
      { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
      { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },

      // Additional Indian regional languages
      { code: 'raj', name: 'राजस्थानी (Rajasthani)', flag: '🇮🇳' },
      { code: 'bhb', name: 'भीली (Bhili)', flag: '🇮🇳' },
      { code: 'awb', name: 'अवधी (Awadhi)', flag: '🇮🇳' },
      { code: 'mag', name: 'मगही (Magahi)', flag: '🇮🇳' },
      { code: 'bgc', name: 'हरयाणवी (Haryanvi)', flag: '🇮🇳' },
      { code: 'hne', name: 'छत्तीसगढ़ी (Chhattisgarhi)', flag: '🇮🇳' },
      { code: 'dv', name: 'ދިވެހި (Dhivehi)', flag: '🇲🇻' },
      { code: 'tcy', name: 'ತುಳು (Tulu)', flag: '🇮🇳' },
      { code: 'gbm', name: 'गढ़वळी (Garhwali)', flag: '🇮🇳' },
      { code: 'kfy', name: 'कुमाऊँनी (Kumaoni)', flag: '🇮🇳' },
      { code: 'khb', name: 'ᦟᦹᧉ (Tai Lü)', flag: '🇮🇳' },
      { code: 'lus', name: 'Mizo ṭawng', flag: '🇮🇳' },
      { code: 'grt', name: 'Garo', flag: '🇮🇳' },
      { code: 'njo', name: 'Ao', flag: '🇮🇳' },
      { code: 'kha', name: 'Khasi', flag: '🇮🇳' },
      { code: 'ach', name: 'Angami', flag: '🇮🇳' },
      { code: 'lep', name: 'Lepcha', flag: '🇮🇳' },
      { code: 'lif', name: 'Limbu', flag: '🇮🇳' },
      { code: 'rab', name: 'Rabha', flag: '🇮🇳' },
      { code: 'unr', name: 'Mundari', flag: '🇮🇳' },
      { code: 'hoc', name: 'Ho', flag: '🇮🇳' },
      { code: 'kru', name: 'Kurukh', flag: '🇮🇳' },
      { code: 'kfr', name: 'Korku', flag: '🇮🇳' },
      { code: 'kha', name: 'Kharia', flag: '🇮🇳' }
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLanguages = languages.filter(lang =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedLangObj = languages.find(lang => lang.code === selectedLanguage) || languages[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        <div className="p-4 flex justify-end">
          <Logo small={true} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-3">Select Language</h1>
              <p className="text-blue-200 text-lg">Choose your preferred language</p>
            </div>

            <div className="relative">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg border border-blue-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedLangObj.flag}</span>
                  <span>{selectedLangObj.name}</span>
                </div>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-2xl shadow-2xl border border-blue-500/30 max-h-96 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-4 border-b border-blue-500/20">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-blue-500/20 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Language List */}
                  <div className="overflow-y-auto max-h-80">
                    {filteredLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          handleLanguageSelect(language.code);
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full px-6 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                          selectedLanguage === language.code ? 'bg-blue-600' : ''
                        }`}
                      >
                        <span className="text-xl">{language.flag}</span>
                        <span className="text-white">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleLanguageSelect(selectedLanguage)}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Client-side guard
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden">
        <style>{`
          @keyframes flare {
            0% {
              opacity: 0.4;
              transform: translateX(-50%) translateY(-20px) scaleY(0.8);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) translateY(-40px) scaleY(1.3);
            }
          }
        `}</style>

        <DhammaChakra />
      </div>
    );
  }

  if (showLanguageSelection) {
    return <LanguageSelection />;
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        <div className="p-4 flex justify-end">
          <Logo small={true} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-3">Welcome</h1>
              <p className="text-blue-200 text-lg">Connect your wallet to continue</p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6" />
                <span>Connect with MetaMask</span>
              </button>

              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6" />
                <span>WalletConnect</span>
              </button>

              <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6" />
                <span>Coinbase Wallet</span>
              </button>

              <button
                onClick={() => window.location.href = 'https://identity.ic0.app/'}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3"
              >
                <Globe className="w-6 h-6" />
                <span>Internet Identity</span>
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-400/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900 text-blue-300">Or continue with</span>
                </div>
              </div>

              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3 border border-blue-500/30">
                <Mail className="w-6 h-6" />
                <span>Continue with Email</span>
              </button>

              <button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Chrome className="w-6 h-6" />
                <span>Continue with Google</span>
              </button>
            </div>

            <p className="text-center text-blue-300/60 text-sm mt-8">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Web3App;
