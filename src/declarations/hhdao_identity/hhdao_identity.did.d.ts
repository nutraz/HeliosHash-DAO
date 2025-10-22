import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { ok: UserProfile } | { err: string };
export type Result_1 = { ok: null } | { err: string };
export type Result_2 = { ok: bigint } | { err: string };
export type Result_3 = { ok: string } | { err: string };
export type Role =
  | { DAO: null }
  | { Authority: null }
  | { Partner: null }
  | { Investor: null }
  | { Community: null };
export interface UserProfile {
  bio: [] | [string];
  principal: Principal;
  username: [] | [string];
  prefersDuoValidation: boolean;
  displayName: [] | [string];
  createdAt: bigint;
  role: Role;
  secondaryRoles: Array<Role>;
  owpBalance: bigint;
  email: [] | [string];
  website: [] | [string];
  updatedAt: bigint;
  isVerified: boolean;
  verificationLevel: VerificationLevel;
  aadhaarVerified: boolean;
  location: [] | [string];
  avatar: [] | [string];
}
export type VerificationLevel =
  | { KYC: null }
  | { Enhanced: null }
  | { Email: null }
  | { Basic: null };
export interface VerificationRequest {
  id: bigint;
  status: VerificationStatus;
  documentHash: [] | [string];
  principal: Principal;
  verificationType: VerificationLevel;
  processedAt: [] | [bigint];
  notes: [] | [string];
  requestedAt: bigint;
}
export type VerificationStatus =
  | { Approved: null }
  | { InReview: null }
  | { Rejected: null }
  | { Pending: null };
export interface _SERVICE {
  addSecondaryRole: ActorMethod<[Role], Result>;
  createProfile: ActorMethod<[[] | [string], [] | [string], [] | [string], Role], Result>;
  createSession: ActorMethod<[], Result_3>;
  getAuthorities: ActorMethod<[], Array<Principal>>;
  getDuoValidationPreference: ActorMethod<[Principal], boolean>;
  getIdentityStats: ActorMethod<
    [],
    {
      totalProfiles: bigint;
      activeSessions: bigint;
      pendingVerifications: bigint;
      verifiedProfiles: bigint;
    }
  >;
  getMyVerificationRequests: ActorMethod<[], Array<VerificationRequest>>;
  getProfile: ActorMethod<[Principal], [] | [UserProfile]>;
  getProfileByUsername: ActorMethod<[string], [] | [UserProfile]>;
  getUserRole: ActorMethod<[Principal], [] | [Role]>;
  getUserRoles: ActorMethod<[Principal], [] | [{ secondary: Array<Role>; primary: Role }]>;
  getUsersWithDuoPreference: ActorMethod<[], Array<Principal>>;
  getVerificationRequest: ActorMethod<[bigint], [] | [VerificationRequest]>;
  hasRole: ActorMethod<[Principal, Role], boolean>;
  logout: ActorMethod<[string], Result_3>;
  processVerificationRequest: ActorMethod<[bigint, VerificationStatus, [] | [string]], Result_3>;
  requestVerification: ActorMethod<[VerificationLevel, [] | [string]], Result_2>;
  setAadhaarVerified: ActorMethod<[], Result>;
  setDuoValidationPreference: ActorMethod<[boolean], Result>;
  updateOWPBalance: ActorMethod<[Principal, bigint], Result_1>;
  updateProfile: ActorMethod<
    [
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
    ],
    Result
  >;
  updateUserRole: ActorMethod<[Role], Result>;
  validateSession: ActorMethod<[string], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
