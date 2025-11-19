import { CustodyType, KYCStatus, User } from '../../shared/types';

const userStore: Record<string, User> = {};

export async function getUserByPhone(phone: string): Promise<User | null> {
  return Object.values(userStore).find(u => u.phone === phone) || null;
}

export async function createUser(data: Partial<User>): Promise<User> {
  const id = 'user_' + Date.now();
  const user: User = {
    id,
    phone: data.phone!,
    roles: data.roles || [],
    kycStatus: data.kycStatus || KYCStatus.PENDING,
    custodyType: data.custodyType || 'CUSTODIAL' in CustodyType ? CustodyType.CUSTODIAL : ('custodial' as CustodyType),
    confidants: [],
    createdAt: new Date(),
  };
  userStore[id] = user;
  return user;
}

export function sanitizeUser(user: User): Partial<User> {
  const { id, phone, roles, kycStatus, custodyType, confidants, createdAt } = user;
  return { id, phone, roles, kycStatus, custodyType, confidants, createdAt };
}
