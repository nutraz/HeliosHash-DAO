import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export type Category = { Governance: null } | { Project: null } | { Treasury: null };
export interface HHDAO {
  createProject: ActorMethod<[string, string, bigint, string, bigint, [] | [bigint]], Result_2>;
  createProposal: ActorMethod<
    [
      {
        title: string;
        votesRequired: bigint;
        description: string;
        category: Category;
      },
    ],
    Result_1
  >;
  getCyclesBalance: ActorMethod<[], bigint>;
  getDashboardData: ActorMethod<
    [],
    {
      documents: Array<{
        id: string;
        accessLevel:
          | { DAO: null }
          | { Private: null }
          | { Public: null }
          | { Restricted: Array<Principal> };
        status:
          | { UnderReview: null }
          | { Approved: null }
          | { Draft: null }
          | { Rejected: null }
          | { Archived: null }
          | { Submitted: null };
        documentType:
          | { Legal: null }
          | { Technical: null }
          | { Report: null }
          | { Image: null }
          | { Financial: null }
          | { Other: string }
          | { Video: null }
          | { Environmental: null }
          | { Certificate: null };
        owner: Principal;
        metadata: Array<[string, string]>;
        hash: string;
        name: string;
        createdAt: bigint;
        size: bigint;
        tags: Array<string>;
        mimeType: string;
        description: [] | [string];
        version: bigint;
        updatedAt: bigint;
      }>;
      projects: Array<Project>;
      userProfile:
        | []
        | [
            {
              bio: [] | [string];
              principal: Principal;
              username: [] | [string];
              displayName: [] | [string];
              createdAt: bigint;
              email: [] | [string];
              website: [] | [string];
              updatedAt: bigint;
              isVerified: boolean;
              verificationLevel:
                | { KYC: null }
                | { Enhanced: null }
                | { Email: null }
                | { Basic: null };
              location: [] | [string];
              avatar: [] | [string];
            },
          ];
      devices: Array<{
        id: string;
        status: { Error: null } | { Online: null } | { Maintenance: null } | { Offline: null };
        owner: Principal;
        metadata: Array<[string, string]>;
        name: string;
        deviceType:
          | { GridConnection: null }
          | { SolarPanel: null }
          | { Battery: null }
          | { EnergyMeter: null }
          | { Inverter: null }
          | { WeatherStation: null };
        registeredAt: bigint;
        lastPing: bigint;
        location: {
          region: [] | [string];
          latitude: number;
          longitude: number;
          address: [] | [string];
        };
      }>;
    }
  >;
  getNFTInfo: ActorMethod<[bigint], [] | [NFT]>;
  getProject: ActorMethod<[bigint], [] | [Project]>;
  getProjects: ActorMethod<[], Array<Project>>;
  getProposal: ActorMethod<
    [bigint],
    | []
    | [
        {
          id: bigint;
          status: { Passed: null } | { Active: null } | { Rejected: null } | { Executed: null };
          title: string;
          votesAgainst: bigint;
          votesFor: bigint;
          createdAt: bigint;
          votingDeadline: bigint;
          description: string;
          proposalType:
            | { Governance: null }
            | { Project: null }
            | { Treasury: null }
            | { Community: null };
          proposer: Principal;
          executionData: [] | [string];
        },
      ]
  >;
  getSystemStats: ActorMethod<[], { totalProjects: bigint; timestamp: bigint; totalUsers: bigint }>;
  joinPlatform: ActorMethod<[[] | [string], [] | [string], [] | [string]], Result>;
  mintMembershipNFT: ActorMethod<
    [
      {
        durationDays: bigint;
        tier: MembershipTier;
        recipient: Principal;
      },
    ],
    MintResult
  >;
  registerSolarDevice: ActorMethod<
    [
      string,
      string,
      (
        | { GridConnection: null }
        | { SolarPanel: null }
        | { Battery: null }
        | { EnergyMeter: null }
        | { Inverter: null }
        | { WeatherStation: null }
      ),
      number,
      number,
      [] | [string],
      Array<[string, string]>,
    ],
    Result
  >;
  updateProjectStatus: ActorMethod<[bigint, ProjectStatus], boolean>;
  uploadProjectDocument: ActorMethod<
    [
      bigint,
      string,
      [] | [string],
      (
        | { Legal: null }
        | { Technical: null }
        | { Report: null }
        | { Image: null }
        | { Financial: null }
        | { Other: string }
        | { Video: null }
        | { Environmental: null }
        | { Certificate: null }
      ),
      string,
      bigint,
      string,
      boolean,
    ],
    Result
  >;
  vote: ActorMethod<[bigint, boolean], Result>;
}
export type MembershipTier =
  | { Supporter: null }
  | { Partner: null }
  | { Investor: null }
  | { Community: null };
export type MintResult = { ok: bigint } | { err: string };
export interface NFT {
  id: bigint;
  expiresAt: bigint;
  owner: Principal;
  tier: MembershipTier;
  mintedAt: bigint;
}
export interface Project {
  id: bigint;
  status: ProjectStatus;
  completionDate: [] | [bigint];
  owner: Principal;
  name: string;
  createdAt: bigint;
  description: string;
  governmentApprovals: Array<string>;
  capacity: bigint;
  estimatedCost: bigint;
  location: string;
  telemetryId: [] | [string];
}
export type ProjectStatus =
  | { Operational: null }
  | { Maintenance: null }
  | { Planning: null }
  | { Construction: null };
export type Result = { ok: string } | { err: string };
export type Result_1 = { ok: bigint } | { err: string };
export type Result_2 = { ok: Project } | { err: string };
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface _SERVICE extends HHDAO {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
