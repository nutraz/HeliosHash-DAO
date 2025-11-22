export interface User {
  id: string;
  phone: string;
  roles: UserRole[];
  kycStatus: KYCStatus;
  walletAddress?: string;
  custodyType: CustodyType;
  confidants: string[];
  createdAt: Date;
}

export enum UserRole {
  CITIZEN = 'citizen',
  LANDOWNER = 'landowner',
  CONTRACTOR = 'contractor',
  NODE_OPERATOR = 'node_operator',
  LABOURER = 'labourer'
}

export enum KYCStatus {
  PENDING = 'pending',
  BASIC = 'basic',
  PAN_VERIFIED = 'pan_verified',
  AADHAAR_VERIFIED = 'aadhaar_verified'
}

export interface Wallet {
  address: string;
  hhuBalance: number;
  inrBalance: number;
  custodyType: CustodyType;
  socialRecovery: SocialRecoveryConfig;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'withdraw' | 'convert';
  amount: number;
  currency: 'HHU' | 'INR';
  status: TransactionStatus;
  timestamp: Date;
  hash?: string;
  upiReference?: string;
}

export enum CustodyType {
  CUSTODIAL = 'custodial',
  SELF_CUSTODY = 'self_custody'
}

export interface SocialRecoveryConfig {
  confidants: string[];
  enabled: boolean;
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}
