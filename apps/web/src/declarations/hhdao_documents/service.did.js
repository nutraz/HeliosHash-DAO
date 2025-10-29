export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const AccessLevel = IDL.Variant({
    DAO: IDL.Null,
    Private: IDL.Null,
    Public: IDL.Null,
    Restricted: IDL.Vec(IDL.Principal),
  });
  const DocumentStatus = IDL.Variant({
    UnderReview: IDL.Null,
    Approved: IDL.Null,
    Draft: IDL.Null,
    Rejected: IDL.Null,
    Archived: IDL.Null,
    Submitted: IDL.Null,
  });
  const DocumentType = IDL.Variant({
    Legal: IDL.Null,
    Technical: IDL.Null,
    Report: IDL.Null,
    Image: IDL.Null,
    Financial: IDL.Null,
    Other: IDL.Text,
    Video: IDL.Null,
    Environmental: IDL.Null,
    Certificate: IDL.Null,
  });
  const Document = IDL.Record({
    id: IDL.Text,
    accessLevel: AccessLevel,
    status: DocumentStatus,
    documentType: DocumentType,
    owner: IDL.Principal,
    metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    hash: IDL.Text,
    name: IDL.Text,
    createdAt: IDL.Int,
    size: IDL.Nat,
    tags: IDL.Vec(IDL.Text),
    mimeType: IDL.Text,
    description: IDL.Opt(IDL.Text),
    version: IDL.Nat,
    updatedAt: IDL.Int,
  });
  const Result = IDL.Variant({ ok: Document, err: IDL.Text });
  const DocumentVersion = IDL.Record({
    changedBy: IDL.Principal,
    changeNote: IDL.Opt(IDL.Text),
    hash: IDL.Text,
    version: IDL.Nat,
    timestamp: IDL.Int,
    documentId: IDL.Text,
  });
  const WorkflowStatus = IDL.Variant({
    Cancelled: IDL.Null,
    InProgress: IDL.Null,
    Completed: IDL.Null,
    Pending: IDL.Null,
  });
  const StepStatus = IDL.Variant({
    Skipped: IDL.Null,
    InProgress: IDL.Null,
    Completed: IDL.Null,
    NotStarted: IDL.Null,
  });
  const WorkflowStep = IDL.Record({
    id: IDL.Nat,
    status: StepStatus,
    completedAt: IDL.Opt(IDL.Int),
    assignedTo: IDL.Opt(IDL.Principal),
    name: IDL.Text,
    description: IDL.Text,
    required: IDL.Bool,
    comments: IDL.Opt(IDL.Text),
  });
  const WorkflowType = IDL.Variant({
    Review: IDL.Null,
    Approval: IDL.Null,
    Custom: IDL.Text,
    Audit: IDL.Null,
    Certification: IDL.Null,
  });
  const DocumentWorkflow = IDL.Record({
    id: IDL.Nat,
    status: WorkflowStatus,
    completedAt: IDL.Opt(IDL.Int),
    assignedTo: IDL.Opt(IDL.Principal),
    createdAt: IDL.Int,
    createdBy: IDL.Principal,
    steps: IDL.Vec(WorkflowStep),
    currentStep: IDL.Nat,
    workflowType: WorkflowType,
    documentId: IDL.Text,
  });
  const ShareAccessLevel = IDL.Variant({
    Edit: IDL.Null,
    Read: IDL.Null,
    Comment: IDL.Null,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  return IDL.Service({
    completeWorkflowStep: IDL.Func([IDL.Nat, IDL.Nat, IDL.Opt(IDL.Text)], [Result_2], []),
    getAccessibleDocuments: IDL.Func([], [IDL.Vec(Document)], ['query']),
    getDocument: IDL.Func([IDL.Text], [Result], ['query']),
    getDocumentStats: IDL.Func(
      [],
      [
        IDL.Record({
          activeWorkflows: IDL.Nat,
          documentsByStatus: IDL.Vec(IDL.Tuple(DocumentStatus, IDL.Nat)),
          documentsByType: IDL.Vec(IDL.Tuple(DocumentType, IDL.Nat)),
          totalDocuments: IDL.Nat,
          totalWorkflows: IDL.Nat,
        }),
      ],
      ['query']
    ),
    getDocumentVersions: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(DocumentVersion))], ['query']),
    getDocumentWorkflows: IDL.Func([IDL.Text], [IDL.Vec(DocumentWorkflow)], ['query']),
    getMyDocuments: IDL.Func([], [IDL.Vec(Document)], ['query']),
    getMyWorkflows: IDL.Func([], [IDL.Vec(DocumentWorkflow)], ['query']),
    getWorkflow: IDL.Func([IDL.Nat], [IDL.Opt(DocumentWorkflow)], ['query']),
    searchDocuments: IDL.Func(
      [IDL.Text, IDL.Opt(DocumentType), IDL.Opt(IDL.Vec(IDL.Text))],
      [IDL.Vec(Document)],
      ['query']
    ),
    shareDocument: IDL.Func(
      [IDL.Text, IDL.Principal, ShareAccessLevel, IDL.Opt(IDL.Int)],
      [Result_2],
      []
    ),
    startWorkflow: IDL.Func(
      [IDL.Text, WorkflowType, IDL.Vec(IDL.Text), IDL.Opt(IDL.Principal)],
      [Result_1],
      []
    ),
    updateDocument: IDL.Func(
      [
        IDL.Text,
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(AccessLevel),
        IDL.Opt(IDL.Vec(IDL.Text)),
        IDL.Opt(IDL.Text),
      ],
      [Result],
      []
    ),
    uploadDocument: IDL.Func(
      [
        IDL.Text,
        IDL.Opt(IDL.Text),
        DocumentType,
        IDL.Text,
        IDL.Nat,
        IDL.Text,
        AccessLevel,
        IDL.Vec(IDL.Text),
        IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
      ],
      [Result],
      []
    ),
  });
};
export const init = ({ IDL }) => {
  return [];
};
