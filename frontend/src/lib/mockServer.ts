type User = {
  id: string;
  name: string;
  principal?: string;
  membershipTier?: string;
  pfp?: string;
  rank?: string;
  communityRole?: string;
  stats: { projectsStarted: number; projectsHelped: number; membersAdded: number };
  tokenBalance: number;
  nftCollection?: Array<any>;
};

const defaultUser: User = {
  id: '1',
  name: 'Rahul Kumar',
  principal: 'dev-user-principal-1',
  membershipTier: 'Gold',
  pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  rank: 'Investor & Collaborator',
  communityRole: 'Community Manager',
  stats: { projectsStarted: 3, projectsHelped: 12, membersAdded: 45 },
  tokenBalance: 15000,
  nftCollection: [
    { id: 1, name: 'Solar Bitcoin Mining Hub', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=bitcoin&backgroundColor=10b981', projectId: 1, community: 'Green Energy Collective' }
  ],
};

const state = {
  user: defaultUser as User | null,
  txs: [] as Array<any>,
};

export function getUser() {
  return state.user;
}

export function loginDemo() {
  // For demo, return the default user and ensure principal exists
  if (!state.user) state.user = defaultUser;
  return state.user;
}

export function sendTokens(to: string, amount: number) {
  const from = state.user;
  if (!from) throw new Error('Not authenticated');
  if (amount <= 0 || amount > from.tokenBalance) throw new Error('Invalid amount');
  from.tokenBalance = Math.max(0, from.tokenBalance - amount);
  const tx = { id: Date.now().toString(), from: from.principal, to, amount, status: 'confirmed', ts: Date.now() };
  state.txs.unshift(tx);
  return { tx, balance: from.tokenBalance };
}

export function getTxs() {
  return state.txs;
}

export function joinDaoMock() {
  if (!state.user) return null;
  // give membership NFT and tier Bronze
  state.user.membershipTier = 'Bronze';
  return state.user;
}

export default state;
