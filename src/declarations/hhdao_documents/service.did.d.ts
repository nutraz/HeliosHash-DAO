import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccessLevel =
  | { DAO: null }
  | { Private: null }
  | { Public: null }
  | { Restricted: Array<Principal> };
export interface Document {
  id: string;
  accessLevel: AccessLevel;
  status: DocumentStatus;
  documentType: DocumentType;
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
}
export type DocumentStatus =
  | { UnderReview: null }
  | { Approved: null }
  | { Draft: null }
  | { Rejected: null }
  | { Archived: null }
  | { Submitted: null };
export type DocumentType =
  | { Legal: null }
  | { Technical: null }
  | { Report: null }
  | { Image: null }
  | { Financial: null }
  | { Other: string }
  | { Video: null }
  | { Environmental: null }
  | { Certificate: null };
export interface DocumentVersion {
  changedBy: Principal;
  changeNote: [] | [string];
  hash: string;
  version: bigint;
  timestamp: bigint;
  documentId: string;
}
export interface DocumentWorkflow {
  id: bigint;
  status: WorkflowStatus;
  completedAt: [] | [bigint];
  assignedTo: [] | [Principal];
  createdAt: bigint;
  createdBy: Principal;
  steps: Array<WorkflowStep>;
  currentStep: bigint;
  workflowType: WorkflowType;
  documentId: string;
}
export type Result = { ok: Document } | { err: string };
export type Result_1 = { ok: bigint } | { err: string };
export type Result_2 = { ok: string } | { err: string };
export type ShareAccessLevel = { Edit: null } | { Read: null } | { Comment: null };
export type StepStatus =
  | { Skipped: null }
  | { InProgress: null }
  | { Completed: null }
  | { NotStarted: null };
export type WorkflowStatus =
  | { Cancelled: null }
  | { InProgress: null }
  | { Completed: null }
  | { Pending: null };
export interface WorkflowStep {
  id: bigint;
  status: StepStatus;
  completedAt: [] | [bigint];
  assignedTo: [] | [Principal];
  name: string;
  description: string;
  required: boolean;
  comments: [] | [string];
}
export type WorkflowType =
  | { Review: null }
  | { Approval: null }
  | { Custom: string }
  | { Audit: null }
  | { Certification: null };
export interface _SERVICE {
  completeWorkflowStep: ActorMethod<[bigint, bigint, [] | [string]], Result_2>;
  getAccessibleDocuments: ActorMethod<[], Array<Document>>;
  getDocument: ActorMethod<[string], Result>;
  getDocumentStats: ActorMethod<
    [],
    {
      activeWorkflows: bigint;
      documentsByStatus: Array<[DocumentStatus, bigint]>;
      documentsByType: Array<[DocumentType, bigint]>;
      totalDocuments: bigint;
      totalWorkflows: bigint;
    }
  >;
  getDocumentVersions: ActorMethod<[string], [] | [Array<DocumentVersion>]>;
  getDocumentWorkflows: ActorMethod<[string], Array<DocumentWorkflow>>;
  getMyDocuments: ActorMethod<[], Array<Document>>;
  getMyWorkflows: ActorMethod<[], Array<DocumentWorkflow>>;
  getWorkflow: ActorMethod<[bigint], [] | [DocumentWorkflow]>;
  searchDocuments: ActorMethod<
    [string, [] | [DocumentType], [] | [Array<string>]],
    Array<Document>
  >;
  shareDocument: ActorMethod<[string, Principal, ShareAccessLevel, [] | [bigint]], Result_2>;
  startWorkflow: ActorMethod<[string, WorkflowType, Array<string>, [] | [Principal]], Result_1>;
  updateDocument: ActorMethod<
    [
      string,
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [AccessLevel],
      [] | [Array<string>],
      [] | [string],
    ],
    Result
  >;
  uploadDocument: ActorMethod<
    [
      string,
      [] | [string],
      DocumentType,
      string,
      bigint,
      string,
      AccessLevel,
      Array<string>,
      Array<[string, string]>,
    ],
    Result
  >;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
