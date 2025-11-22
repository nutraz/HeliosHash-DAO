import { http, HttpResponse } from 'msw';

// Mock data for /api/*
export const handlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Mock Solar Project',
        description: 'Seeded mock solar project for testing',
        status: 'active',
        capacity: '10kW',
        location: 'Test Village',
      },
      {
        id: 2,
        name: 'Another Solar Project',
        description: 'Additional seeded project',
        status: 'pending',
        capacity: '5kW',
        location: 'Test Area',
      },
    ]);
  }),

  http.get('/api/dashboard', () => {
    return HttpResponse.json({
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'member',
      },
      stats: {
        projects: 2,
        rewards: 5,
        votes: 3,
      },
    });
  }),

  http.get('/api/rewards', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Reward 1',
        type: 'nft',
        claimed: false,
      },
      {
        id: 2,
        name: 'Reward 2',
        type: 'token',
        claimed: true,
      },
    ]);
  }),

  http.get('/api/urgam', () => {
    return HttpResponse.json({
      pilotOperations: 'Urgam Valley Pilot Operations',
      capacity: '668km',
      sites: [
        { id: 'UV-001', name: 'Urgam Village Center', capacity: '5.2MW', status: 'Ready' },
        { id: 'UV-002', name: 'Valley Upper Slopes', capacity: '8.9MW', status: 'In Progress' },
      ],
    });
  }),

  // Mock IC canister calls
  http.get('**/ic-api/**', () => {
    return HttpResponse.json({
      canisterId: 'mock-hhdao',
      data: {
        projects: [{ id: 1, name: 'IC Mock Project' }],
        user: { principal: 'mock-principal' },
      },
      status: 'success',
    });
  }),

  http.post('**/ic0.*', () => {
    return HttpResponse.json({
      result: 'mock-update-success',
      canisterResponse: 'seeded-data-applied',
    });
  }),

  // Add more handlers as needed for other /api/* endpoints
];
