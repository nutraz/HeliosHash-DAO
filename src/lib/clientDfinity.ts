// Client-side safe helpers that return mock data until canister bindings are available.
export const getUserData = async () => {
  return {
    name: 'Rahul Kumar',
    pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    rank: 'Investor & Collaborator',
    tokenBalance: 15000,
    nftCollection: [
      { id: 1, name: 'Solar Bitcoin Mining Hub' },
      { id: 2, name: 'EV Charging Network' }
    ]
  };
};

export const getProjects = async () => {
  return [
    { id: 1, name: 'Solar Bitcoin Mining Hub', stage: 'functioning', completion: 100, funding: '₹2.5 Cr', isLive: true },
    { id: 6, name: "Helios#Baghpat Village DAO", stage: 'functioning', completion: 100, funding: '₹85L', isLive: true },
    { id: 7, name: 'UrgamU Delhi Solar Mining', stage: 'functioning', completion: 100, funding: '₹65L', isLive: true }
  ];
};

// Note: Once canister bindings are available, you can replace imports in client
// components to call server-side endpoints or use the real `src/lib/dfinity.ts`
// via server actions or API routes so bundlers don't pull DFINITY libraries
// into the client bundle.
