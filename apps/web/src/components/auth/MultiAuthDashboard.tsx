import React, { useMemo, useState } from 'react';
import { 
  Shield, Smartphone, Mail, Chrome, Facebook, Twitter,
  CheckCircle, XCircle, AlertCircle, Loader, LogOut, Info, ArrowRight, Key,
  Lock, Unlock, Star, Award, Users, TrendingUp
} from 'lucide-react';

// Types & Enums (extracted from user's provided code)
export enum AuthMethod { INTERNET_IDENTITY = 'internet_identity', MOBILE_AADHAAR = 'mobile_aadhaar', EMAIL_PASSWORD = 'email_password', GOOGLE = 'google', FACEBOOK = 'facebook', TWITTER = 'twitter' }
export enum UserTier { UNVERIFIED = 'unverified', VERIFIED = 'verified', KYC_BASIC = 'kyc_basic', KYC_ADVANCED = 'kyc_advanced' }

export interface AuthProvider { id: AuthMethod; name: string; icon: React.ReactNode; tier: UserTier; description: string; available: boolean }
export interface UserProfile { principal?: string; email?: string; phone?: string; authMethod: AuthMethod; tier: UserTier; verifications: { email: boolean; phone: boolean; aadhaar: boolean; identity: boolean }; createdAt: number }

// MultiAuthService & PermissionsManager (kept local so tests can import) 
export class MultiAuthService {
  private currentUser: UserProfile | null = null;

  async authenticateInternetIdentity(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const profile: UserProfile = { principal: 'xxxxx-xxxxx-xxxxx-xxxxx-cai', authMethod: AuthMethod.INTERNET_IDENTITY, tier: UserTier.KYC_ADVANCED, verifications: { email: true, phone: true, aadhaar: false, identity: true }, createdAt: Date.now() };
    this.currentUser = profile;
    return profile;
  }

  async authenticateMobileAadhaar(phone: string, otp: string): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (otp !== '123456') throw new Error('Invalid OTP');
    const profile: UserProfile = { phone, authMethod: AuthMethod.MOBILE_AADHAAR, tier: UserTier.KYC_ADVANCED, verifications: { email: false, phone: true, aadhaar: true, identity: false }, createdAt: Date.now() };
    this.currentUser = profile;
    return profile;
  }

  async authenticateEmail(email: string, password: string): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const profile: UserProfile = { email, authMethod: AuthMethod.EMAIL_PASSWORD, tier: UserTier.VERIFIED, verifications: { email: true, phone: false, aadhaar: false, identity: false }, createdAt: Date.now() };
    this.currentUser = profile;
    return profile;
  }

  async authenticateSocial(provider: AuthMethod): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 120));
    const profile: UserProfile = { email: `user@${provider}.com`, authMethod: provider, tier: UserTier.UNVERIFIED, verifications: { email: false, phone: false, aadhaar: false, identity: false }, createdAt: Date.now() };
    this.currentUser = profile;
    return profile;
  }

  async upgradeToKYC(phone: string, aadhaarNumber: string): Promise<UserProfile> {
    if (!this.currentUser) throw new Error('No user logged in');
    await new Promise(resolve => setTimeout(resolve, 200));
    const upgraded: UserProfile = { ...this.currentUser, phone, tier: UserTier.KYC_ADVANCED, verifications: { ...this.currentUser.verifications, phone: true, aadhaar: true } };
    this.currentUser = upgraded;
    return upgraded;
  }

  getCurrentUser(): UserProfile | null { return this.currentUser }
  logout(): void { this.currentUser = null }
}

export class PermissionsManager {
  static getTierPermissions(tier: UserTier) {
    switch (tier) {
      case UserTier.UNVERIFIED: return { canVote: false, canCreateProjects: false, canTransferTokens: false, maxTransferAmount: 0, canReceiveRewards: true, canAccessCommunity: true, requiresApproval: true };
      case UserTier.VERIFIED: return { canVote: false, canCreateProjects: false, canTransferTokens: true, maxTransferAmount: 1000, canReceiveRewards: true, canAccessCommunity: true, requiresApproval: true };
      case UserTier.KYC_BASIC: return { canVote: true, canCreateProjects: true, canTransferTokens: true, maxTransferAmount: 10000, canReceiveRewards: true, canAccessCommunity: true, requiresApproval: false };
      case UserTier.KYC_ADVANCED: return { canVote: true, canCreateProjects: true, canTransferTokens: true, maxTransferAmount: Infinity, canReceiveRewards: true, canAccessCommunity: true, requiresApproval: false };
    }
  }

  static getTierBadge(tier: UserTier) {
    switch (tier) {
      case UserTier.UNVERIFIED: return { label: 'Unverified', color: 'text-gray-400 bg-gray-900', icon: <AlertCircle size={16} /> };
      case UserTier.VERIFIED: return { label: 'Verified', color: 'text-blue-400 bg-blue-900', icon: <CheckCircle size={16} /> };
      case UserTier.KYC_BASIC: return { label: 'KYC Basic', color: 'text-green-400 bg-green-900', icon: <Shield size={16} /> };
      case UserTier.KYC_ADVANCED: return { label: 'KYC Advanced', color: 'text-purple-400 bg-purple-900', icon: <Award size={16} /> };
    }
  }
}

const LoadingOverlay: React.FC<{ message: string }>= ({ message }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50"><div className="bg-gray-800 rounded-xl p-8 max-w-sm"><Loader className="animate-spin text-blue-500 mx-auto mb-4" size={48} /><p className="text-white text-center font-medium">{message}</p></div></div>
);

const AuthMethodCard: React.FC<{ provider: AuthProvider; onSelect: () => void }>= ({ provider, onSelect }) => {
  const tierBadge = PermissionsManager.getTierBadge(provider.tier);
  return (
    <button onClick={onSelect} disabled={!provider.available} className={`w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all text-left group ${!provider.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-start justify-between mb-4"><div className="flex items-center space-x-3"><div className="text-blue-400">{provider.icon}</div><div><h3 className="text-lg font-bold text-white">{provider.name}</h3><p className="text-sm text-gray-400 mt-1">{provider.description}</p></div></div><ArrowRight className="text-gray-600 group-hover:text-blue-400 transition-colors" size={20} /></div>
      <div className="flex items-center justify-between"><div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${tierBadge.color}`}>{tierBadge.icon}<span className="text-xs font-medium">{tierBadge.label}</span></div>{!provider.available && <span className="text-xs text-gray-500">Coming Soon</span>}</div>
    </button>
  );
};

const MultiAuthDashboard: React.FC = () => {
  const [view, setView] = useState<'login' | 'upgrade' | 'dashboard'>('login');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const authService = useMemo(() => new MultiAuthService(), []);

  const authProviders: AuthProvider[] = [
    { id: AuthMethod.INTERNET_IDENTITY, name: 'Internet Identity', icon: <Shield size={32} />, tier: UserTier.KYC_ADVANCED, description: 'Most secure - Full blockchain identity', available: true },
    { id: AuthMethod.MOBILE_AADHAAR, name: 'Mobile + Aadhaar', icon: <Smartphone size={32} />, tier: UserTier.KYC_ADVANCED, description: 'KYC verified - Indian residents', available: true },
    { id: AuthMethod.EMAIL_PASSWORD, name: 'Email & Password', icon: <Mail size={32} />, tier: UserTier.VERIFIED, description: 'Standard access with email verification', available: true },
    { id: AuthMethod.GOOGLE, name: 'Google', icon: <Chrome size={32} />, tier: UserTier.UNVERIFIED, description: 'Quick start - Limited features', available: true },
    { id: AuthMethod.FACEBOOK, name: 'Facebook', icon: <Facebook size={32} />, tier: UserTier.UNVERIFIED, description: 'Quick start - Limited features', available: false },
    { id: AuthMethod.TWITTER, name: 'Twitter/X', icon: <Twitter size={32} />, tier: UserTier.UNVERIFIED, description: 'Quick start - Limited features', available: false }
  ];

  const handleLogin = async (provider: AuthProvider) => {
    setError(null);
    setLoading(true);
    try {
      let profile: UserProfile;
      switch (provider.id) {
        case AuthMethod.INTERNET_IDENTITY:
          setLoadingMessage('Connecting to Internet Identity...');
          profile = await authService.authenticateInternetIdentity();
          break;
        case AuthMethod.MOBILE_AADHAAR:
          setLoadingMessage('Verifying Aadhaar...');
          profile = await authService.authenticateMobileAadhaar('+91-9876543210', '123456');
          break;
        case AuthMethod.EMAIL_PASSWORD:
          setLoadingMessage('Signing in...');
          profile = await authService.authenticateEmail('user@example.com', 'password');
          break;
        default:
          setLoadingMessage(`Connecting to ${provider.name}...`);
          profile = await authService.authenticateSocial(provider.id);
      }
      setUser(profile);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true); setLoadingMessage('Upgrading account...'); setError(null);
    try {
      const upgraded = await authService.upgradeToKYC('+91-9876543210', 'XXXX-XXXX-XXXX');
      setUser(upgraded);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upgrade failed');
    } finally { setLoading(false); setLoadingMessage(''); }
  };

  const handleLogout = () => { authService.logout(); setUser(null); setView('login'); };

  if (view === 'login') {
      return (
        <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
          {loading && <LoadingOverlay message={loadingMessage} />}

          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Shield className="text-white" size={40} />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">HeliosHash DAO</h1>
              <p className="text-gray-400 text-lg">Choose your authentication method to get started</p>
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-xl p-4 mb-6 flex items-center space-x-3">
                <XCircle className="text-red-400" size={24} />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {authProviders.map(provider => (
                <AuthMethodCard key={provider.id} provider={provider} onSelect={() => handleLogin(provider)} />
              ))}
            </div>

            <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-400 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-semibold mb-2">About Access Tiers</h4>
                  <p className="text-sm text-gray-300 mb-3">Your authentication method determines your initial access level. You can always upgrade later to unlock more features.</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• <span className="text-purple-400">KYC Advanced</span>: Full access, unlimited transfers</li>
                    <li>• <span className="text-green-400">KYC Basic</span>: Vote, create projects, medium limits</li>
                    <li>• <span className="text-blue-400">Verified</span>: Basic transfers, community access</li>
                    <li>• <span className="text-gray-400">Unverified</span>: View-only, requires approval</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }

  if (view === 'dashboard' && user) {
    const permissions = PermissionsManager.getTierPermissions(user.tier);
    const tierBadge = PermissionsManager.getTierBadge(user.tier);
    return (
      <div className="min-h-screen bg-gray-900 p-4 md:p-8"><div className="max-w-7xl mx-auto"><div className="mb-8 flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl"><Shield className="text-white" size={32} /></div><div><h1 className="text-3xl font-bold text-white">Welcome Back!</h1><p className="text-gray-400">{user.email || user.phone || user.principal}</p></div></div><button onClick={handleLogout} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"><LogOut size={20} /><span>Logout</span></button></div><div className="mb-6"><div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${tierBadge.color} border-2`}>{tierBadge.icon}<span className="font-bold">{tierBadge.label} Account</span></div></div>{user.tier !== UserTier.KYC_ADVANCED && (<div className="mb-6"><div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-500 rounded-xl p-6"><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center space-x-2 mb-2"><Star className="text-yellow-400" size={20} /><h3 className="text-lg font-bold text-white">Upgrade Your Account</h3></div><p className="text-sm text-gray-300 mb-4">Unlock more features and higher limits by upgrading to <span className={`font-bold ${PermissionsManager.getTierBadge(UserTier.KYC_BASIC).color.split(' ')[0]}`}>{PermissionsManager.getTierBadge(UserTier.KYC_BASIC).label}</span></p><button onClick={() => setView('upgrade')} className="bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Upgrade Now</button></div><div className="ml-4"><Award className="text-yellow-400" size={48} /></div></div></div></div>)}<div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-1"><div className="bg-gray-800 border border-gray-700 rounded-xl p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-white">Your Access Level</h3><div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${tierBadge.color}`}>{tierBadge.icon}<span className="text-sm font-medium">{tierBadge.label}</span></div></div><div className="space-y-3">{Object.entries(PermissionsManager.getTierPermissions(user.tier)).map(([k, v]) => (<div key={k} className="flex items-center justify-between"><div className="flex items-center space-x-2"><span className={v ? 'text-green-400' : 'text-gray-600'}>{v ? <CheckCircle size={16} /> : <Lock size={16} />}</span><span className={`text-sm ${v ? 'text-white' : 'text-gray-500'}`}>{k}</span></div>{v ? <CheckCircle className="text-green-400" size={16} /> : <Lock className="text-gray-600" size={16} />}</div>))}</div></div></div><div className="lg:col-span-2"><div className="bg-gray-800 border border-gray-700 rounded-xl p-6"><h3 className="text-xl font-bold text-white mb-6">Verification Status</h3><div className="space-y-4"><div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"><div className="flex items-center space-x-3"><Mail className={user.verifications.email ? 'text-green-400' : 'text-gray-600'} size={24} /><span className="text-white">Email Verified</span></div>{user.verifications.email ? (<CheckCircle className="text-green-400" size={24} />) : (<XCircle className="text-gray-600" size={24} />)}</div><div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"><div className="flex items-center space-x-3"><Smartphone className={user.verifications.phone ? 'text-green-400' : 'text-gray-600'} size={24} /><span className="text-white">Phone Verified</span></div>{user.verifications.phone ? (<CheckCircle className="text-green-400" size={24} />) : (<XCircle className="text-gray-600" size={24} />)}</div><div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"><div className="flex items-center space-x-3"><Key className={user.verifications.aadhaar ? 'text-green-400' : 'text-gray-600'} size={24} /><span className="text-white">Aadhaar KYC</span></div>{user.verifications.aadhaar ? (<CheckCircle className="text-green-400" size={24} />) : (<XCircle className="text-gray-600" size={24} />)}</div><div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"><div className="flex items-center space-x-3"><Shield className={user.verifications.identity ? 'text-green-400' : 'text-gray-600'} size={24} /><span className="text-white">Internet Identity</span></div>{user.verifications.identity ? (<CheckCircle className="text-green-400" size={24} />) : (<XCircle className="text-gray-600" size={24} />)}</div></div></div></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"><div className="bg-gray-800 border border-gray-700 rounded-xl p-6"><div className="flex items-center space-x-3 mb-2"><TrendingUp className="text-green-400" size={24} /><span className="text-gray-400">Projects Created</span></div><p className="text-3xl font-bold text-white">{permissions.canCreateProjects ? '3' : '0'}</p></div><div className="bg-gray-800 border border-gray-700 rounded-xl p-6"><div className="flex items-center space-x-3 mb-2"><Users className="text-blue-400" size={24} /><span className="text-gray-400">Community Votes</span></div><p className="text-3xl font-bold text-white">{permissions.canVote ? '12' : '0'}</p></div><div className="bg-gray-800 border border-gray-700 rounded-xl p-6"><div className="flex items-center space-x-3 mb-2"><Award className="text-purple-400" size={24} /><span className="text-gray-400">Rewards Earned</span></div><p className="text-3xl font-bold text-white">{permissions.canReceiveRewards ? '15,000 HHD' : '0 HHD'}</p></div></div></div></div>
    );
  }

  return null;
};

export default MultiAuthDashboard;
