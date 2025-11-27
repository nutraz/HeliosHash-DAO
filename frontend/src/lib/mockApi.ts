export type Principal = string;

export const mockProfile = {
  principal: "did:ic:abcd1234",
  displayName: "Dharmendra Sharma",
  roleTags: ["landowner", "validator"],
  verificationLevel: 3,
  voteWeight: 1,
  skills: ["electrician", "solar install"],
  assets: [{ parcelIdHash: "sha256:...", type: "land", size: "3acres" }],
  confidants: ["did:ic:conf1", "did:ic:conf2"],
  validatorScore: 4.2,
  vcHashes: ["sha256:vc1", "sha256:vc2"],
};

export const mockProjects = [
  {
    id: "helios-baghpat",
    name: "Helios#Baghpat",
    fundingProgress: 0.64,
    members: 124,
    treasuryBalance: "12000 ICP",
    milestones: [
      {
        id: "m1",
        title: "Site preparation",
        status: "inspection_pending",
        escrow: "1000 ICP",
        attestations: 1,
      },
      {
        id: "m2",
        title: "Panel installation",
        status: "locked",
        escrow: "3000 ICP",
        attestations: 0,
      },
    ],
  },
];

export async function connectWallet(): Promise<Principal> {
  // Use Internet Identity via auth client when available
  try {
    const ic = await import("./ic");
    const p = await ic.connect();
    return p;
  } catch (e) {
    return new Promise((res) => setTimeout(() => res("did:ic:wallet123"), 300));
  }
}

export async function startKyc(method: string): Promise<{ taskId: string }> {
  return new Promise((res) => setTimeout(() => res({ taskId: `kyc-${Date.now()}` }), 400));
}

export async function fetchProfile(): Promise<typeof mockProfile> {
  return new Promise((res) => setTimeout(() => res(mockProfile), 200));
}

export async function fetchProjects() {
  return new Promise((res) => setTimeout(() => res(mockProjects), 200));
}

export async function acceptValidatorTask(taskId: string) {
  return new Promise((res) => setTimeout(() => res({ ok: true }), 300));
}

export async function submitAttestation(taskId: string, evidence: any) {
  return new Promise((res) => setTimeout(() => res({ ok: true, attestationId: `att-${Date.now()}` }), 700));
}
