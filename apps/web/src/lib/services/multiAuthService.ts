export enum AuthMethod { INTERNET_IDENTITY = 'internet_identity', MOBILE_AADHAAR = 'mobile_aadhaar', EMAIL_PASSWORD = 'email_password', GOOGLE = 'google', FACEBOOK = 'facebook', TWITTER = 'twitter' }
export enum UserTier { UNVERIFIED = 'unverified', VERIFIED = 'verified', KYC_BASIC = 'kyc_basic', KYC_ADVANCED = 'kyc_advanced' }

export interface UserProfile { principal?: string; email?: string; phone?: string; authMethod: AuthMethod; tier: UserTier; verifications: { email: boolean; phone: boolean; aadhaar: boolean; identity: boolean }; createdAt: number }

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
      case UserTier.UNVERIFIED: return { label: 'Unverified', color: 'text-gray-400 bg-gray-900', icon: 'alert' };
      case UserTier.VERIFIED: return { label: 'Verified', color: 'text-blue-400 bg-blue-900', icon: 'check' };
      case UserTier.KYC_BASIC: return { label: 'KYC Basic', color: 'text-green-400 bg-green-900', icon: 'shield' };
      case UserTier.KYC_ADVANCED: return { label: 'KYC Advanced', color: 'text-purple-400 bg-purple-900', icon: 'award' };
    }
  }
}
