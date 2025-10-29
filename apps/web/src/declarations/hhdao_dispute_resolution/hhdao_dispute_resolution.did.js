export const idlFactory = ({ IDL }) => {
  const DisputeId = IDL.Nat;
  const Result_1 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const DisputeCategory = IDL.Variant({
    TreasuryDispute: IDL.Null,
    ContractDispute: IDL.Null,
    GovernanceDispute: IDL.Null,
    ProjectDispute: IDL.Null,
    MembershipDispute: IDL.Null,
    TechnicalDispute: IDL.Null,
  });
  const DisputePriority = IDL.Variant({
    Low: IDL.Null,
    High: IDL.Null,
    Medium: IDL.Null,
    Critical: IDL.Null,
  });
  const Result_2 = IDL.Variant({ ok: DisputeId, err: IDL.Text });
  const DisputeStatus = IDL.Variant({
    UnderReview: IDL.Null,
    Closed: IDL.Null,
    CommunityVoting: IDL.Null,
    Mediation: IDL.Null,
    Filed: IDL.Null,
    Escalated: IDL.Null,
    Resolved: IDL.Null,
  });
  const Time = IDL.Int;
  const EvidenceType = IDL.Variant({
    Transaction: IDL.Null,
    Communication: IDL.Null,
    Document: IDL.Null,
    Testimony: IDL.Null,
    Other: IDL.Text,
    TechnicalLog: IDL.Null,
  });
  const Evidence = IDL.Record({
    id: IDL.Nat,
    verified: IDL.Bool,
    content: IDL.Text,
    submitter: IDL.Principal,
    timestamp: Time,
    evidenceType: EvidenceType,
  });
  const Dispute = IDL.Record({
    id: DisputeId,
    filer: IDL.Principal,
    status: DisputeStatus,
    title: IDL.Text,
    resolutionProposal: IDL.Opt(IDL.Text),
    lastUpdated: Time,
    description: IDL.Text,
    finalOutcome: IDL.Opt(IDL.Text),
    evidence: IDL.Vec(Evidence),
    category: DisputeCategory,
    respondent: IDL.Opt(IDL.Principal),
    priority: DisputePriority,
    mediators: IDL.Vec(IDL.Principal),
    filedAt: Time,
  });
  const MediationSession = IDL.Record({
    participants: IDL.Vec(IDL.Principal),
    scheduledTime: Time,
    completed: IDL.Bool,
    mediator: IDL.Principal,
    notes: IDL.Opt(IDL.Text),
    sessionId: IDL.Nat,
    outcome: IDL.Opt(IDL.Text),
    disputeId: DisputeId,
  });
  const Result = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  return IDL.Service({
    acceptMediationRole: IDL.Func([DisputeId], [Result_1], []),
    applyToBeMediator: IDL.Func([], [Result_1], []),
    fileDispute: IDL.Func(
      [IDL.Text, IDL.Text, DisputeCategory, DisputePriority, IDL.Opt(IDL.Principal)],
      [Result_2],
      []
    ),
    finalizeDispute: IDL.Func([DisputeId, IDL.Text, IDL.Bool], [Result_1], []),
    getAllDisputes: IDL.Func([], [IDL.Vec(Dispute)], ['query']),
    getDispute: IDL.Func([DisputeId], [IDL.Opt(Dispute)], ['query']),
    getDisputeStats: IDL.Func(
      [],
      [
        IDL.Record({
          activeDisputes: IDL.Nat,
          totalDisputes: IDL.Nat,
          totalMediators: IDL.Nat,
          resolvedDisputes: IDL.Nat,
          disputesByCategory: IDL.Vec(IDL.Tuple(DisputeCategory, IDL.Nat)),
        }),
      ],
      ['query']
    ),
    getDisputesByCategory: IDL.Func([DisputeCategory], [IDL.Vec(Dispute)], ['query']),
    getDisputesByStatus: IDL.Func([DisputeStatus], [IDL.Vec(Dispute)], ['query']),
    getMediationSessions: IDL.Func([DisputeId], [IDL.Vec(MediationSession)], ['query']),
    getMyDisputes: IDL.Func([IDL.Principal], [IDL.Vec(Dispute)], ['query']),
    isMediator: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    proposeResolution: IDL.Func([DisputeId, IDL.Text], [Result_1], []),
    scheduleMediationSession: IDL.Func([DisputeId, Time, IDL.Vec(IDL.Principal)], [Result], []),
    submitEvidence: IDL.Func([DisputeId, IDL.Text, EvidenceType], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
