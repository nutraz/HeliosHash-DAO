export const idlFactory = ({ IDL }) => {
  const Role = IDL.Variant({
    DAO: IDL.Null,
    Authority: IDL.Null,
    Partner: IDL.Null,
    Investor: IDL.Null,
    Community: IDL.Null,
  });
  const VerificationLevel = IDL.Variant({
    KYC: IDL.Null,
    Enhanced: IDL.Null,
    Email: IDL.Null,
    Basic: IDL.Null,
  });
  const UserProfile = IDL.Record({
    bio: IDL.Opt(IDL.Text),
    principal: IDL.Principal,
    username: IDL.Opt(IDL.Text),
    prefersDuoValidation: IDL.Bool,
    displayName: IDL.Opt(IDL.Text),
    createdAt: IDL.Int,
    role: Role,
    secondaryRoles: IDL.Vec(Role),
    owpBalance: IDL.Nat,
    email: IDL.Opt(IDL.Text),
    website: IDL.Opt(IDL.Text),
    updatedAt: IDL.Int,
    isVerified: IDL.Bool,
    verificationLevel: VerificationLevel,
    aadhaarVerified: IDL.Bool,
    location: IDL.Opt(IDL.Text),
    avatar: IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ ok: UserProfile, err: IDL.Text });
  const Result_3 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const VerificationStatus = IDL.Variant({
    Approved: IDL.Null,
    InReview: IDL.Null,
    Rejected: IDL.Null,
    Pending: IDL.Null,
  });
  const VerificationRequest = IDL.Record({
    id: IDL.Nat,
    status: VerificationStatus,
    documentHash: IDL.Opt(IDL.Text),
    principal: IDL.Principal,
    verificationType: VerificationLevel,
    processedAt: IDL.Opt(IDL.Int),
    notes: IDL.Opt(IDL.Text),
    requestedAt: IDL.Int,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Result_1 = IDL.Variant({ ok: IDL.Null, err: IDL.Text });
  return IDL.Service({
    addSecondaryRole: IDL.Func([Role], [Result], []),
    createProfile: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), Role],
      [Result],
      []
    ),
    createSession: IDL.Func([], [Result_3], []),
    getAuthorities: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    getDuoValidationPreference: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    getIdentityStats: IDL.Func(
      [],
      [
        IDL.Record({
          totalProfiles: IDL.Nat,
          activeSessions: IDL.Nat,
          pendingVerifications: IDL.Nat,
          verifiedProfiles: IDL.Nat,
        }),
      ],
      ['query']
    ),
    getMyVerificationRequests: IDL.Func([], [IDL.Vec(VerificationRequest)], ['query']),
    getProfile: IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
    getProfileByUsername: IDL.Func([IDL.Text], [IDL.Opt(UserProfile)], ['query']),
    getUserRole: IDL.Func([IDL.Principal], [IDL.Opt(Role)], ['query']),
    getUserRoles: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(IDL.Record({ secondary: IDL.Vec(Role), primary: Role }))],
      ['query']
    ),
    getUsersWithDuoPreference: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    getVerificationRequest: IDL.Func([IDL.Nat], [IDL.Opt(VerificationRequest)], ['query']),
    hasRole: IDL.Func([IDL.Principal, Role], [IDL.Bool], ['query']),
    logout: IDL.Func([IDL.Text], [Result_3], []),
    processVerificationRequest: IDL.Func(
      [IDL.Nat, VerificationStatus, IDL.Opt(IDL.Text)],
      [Result_3],
      []
    ),
    requestVerification: IDL.Func([VerificationLevel, IDL.Opt(IDL.Text)], [Result_2], []),
    setAadhaarVerified: IDL.Func([], [Result], []),
    setDuoValidationPreference: IDL.Func([IDL.Bool], [Result], []),
    updateOWPBalance: IDL.Func([IDL.Principal, IDL.Nat], [Result_1], []),
    updateProfile: IDL.Func(
      [
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
      ],
      [Result],
      []
    ),
    updateUserRole: IDL.Func([Role], [Result], []),
    validateSession: IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
