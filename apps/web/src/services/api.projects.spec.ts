import { describe, expect, it, vi } from 'vitest';
import { projectsApi } from './api';

vi.mock('@/lib/canister-actors', () => {
  return {
    getCanisterActors: async () => ({
      hhdao: {
        getProjects: async () => [
          {
            id: 1,
            name: 'P1',
            location: 'L1',
            capacity: 10,
            status: { Planning: null },
            owner: { toString: () => 'aaaaa-aa' },
            createdAt: 100,
            governmentApprovals: [],
            telemetryId: [] as any,
            description: 'd',
            estimatedCost: 20,
            completionDate: [] as any,
          },
          {
            id: 2,
            name: 'P2',
            location: 'L2',
            capacity: 5,
            status: { Operational: null },
            owner: { toString: () => 'bbbbb-bb' },
            createdAt: 200,
            governmentApprovals: ['ok'],
            telemetryId: ['t2'] as any,
            description: 'd2',
            estimatedCost: 30,
            completionDate: [300] as any,
          },
        ],
      },
    }),
  };
});

describe('projectsApi.getAll', () => {
  it('maps projects and computes stats', async () => {
    const res = await projectsApi.getAll();
    expect(res.success).toBe(true);
    const data = res.data!;
    expect(data.projects.length).toBe(2);
    expect(data.totalProjects).toBe(2);
    expect(data.operationalProjects).toBe(1);
    expect(data.totalCapacity).toBe(15);
    expect(data.totalInvestment).toBe(50);
    const p2 = data.projects[1]!;
    expect(p2.status).toBe('Operational');
    expect(p2.telemetryId).toBe('t2');
    expect(p2.completionDate).toBe(300);
  });
});
