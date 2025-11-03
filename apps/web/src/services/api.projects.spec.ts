import { describe, expect, it, vi } from 'vitest';
import { projectsApi } from './api';

vi.mock('@/lib/canister-actors', () => {
  return {
    getCanisterActors: async () => ({
      hhdao: {
        getProjects: async () => [
          {
            id: 1n,
            name: 'P1',
            location: 'L1',
            capacity: 10n,
            status: { Planning: null },
            owner: { toString: () => 'aaaaa-aa' },
            createdAt: 100n,
            governmentApprovals: [],
            telemetryId: [] as unknown[],
            description: 'd',
            estimatedCost: 20n,
            completionDate: [] as unknown[],
          },
          {
            id: 2n,
            name: 'P2',
            location: 'L2',
            capacity: 5n,
            status: { Operational: null },
            owner: { toString: () => 'bbbbb-bb' },
            createdAt: 200n,
            governmentApprovals: ['ok'],
            telemetryId: ['t2'] as string[],
            description: 'd2',
            estimatedCost: 30n,
            completionDate: [300n] as bigint[],
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
    expect(data.totalCapacity).toBe(300);
    expect(data.totalInvestment).toBe(15000000);
    const p2 = data.projects[1];
    expect(p2.status).toBe('Operational');
    expect(p2.telemetryId).toBe('t2');
    expect(p2.completionDate).toBe(300);
  });
});
