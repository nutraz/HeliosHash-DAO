import { describe, expect, it } from 'vitest';
import { Proposal } from '../types/governance';
import { filterAndSortProposals, MultiFilterOptions } from './governanceFilters';

function makeProposal(overrides: Partial<Proposal>): Proposal {
  const base: Proposal = {
    id: 'id',
    title: 't',
    description: 'd',
    proposer: 'user',
    status: 'active',
    votesFor: 0,
    votesAgainst: 0,
    createdAt: new Date(),
    votingDeadline: new Date(Date.now() + 1000 * 60 * 60),
    type: 'project',
  };
  return { ...base, ...overrides };
}

describe('filterAndSortProposals', () => {
  const proposals: Proposal[] = [
    makeProposal({
      id: '1',
      status: 'active',
      votesFor: 10,
      votesAgainst: 2,
      createdAt: new Date('2025-01-15'),
      votingDeadline: new Date('2025-01-30'),
      type: 'project',
      title: 'Active Project',
    }),
    makeProposal({
      id: '2',
      status: 'passed',
      votesFor: 20,
      votesAgainst: 5,
      createdAt: new Date('2025-01-10'),
      votingDeadline: new Date('2025-01-20'),
      type: 'community',
      title: 'Passed Community',
    }),
    makeProposal({
      id: '3',
      status: 'pending',
      votesFor: 5,
      votesAgainst: 1,
      createdAt: new Date('2025-01-05'),
      votingDeadline: new Date('2025-01-25'),
      type: 'treasury',
      title: 'Pending Treasury',
    }),
  ];

  function run(opts: Partial<MultiFilterOptions>) {
    const full: MultiFilterOptions = {
      statusFilters: new Set(),
      typeFilters: new Set(),
      sort: 'newest',
      ...opts,
    } as MultiFilterOptions;
    return filterAndSortProposals(proposals, full);
  }

  it('returns all when no filters', () => {
    const res = run({});
    expect(res).toHaveLength(3);
  });

  it('filters by single status', () => {
    const res = run({ statusFilters: new Set(['active']) });
    expect(res).toHaveLength(1);
    expect(res[0].status).toBe('active');
  });

  it('filters by multiple statuses', () => {
    const res = run({ statusFilters: new Set(['active', 'pending']) });
    expect(res).toHaveLength(2);
  });

  it('filters by type', () => {
    const res = run({ typeFilters: new Set(['community']) });
    expect(res).toHaveLength(1);
    expect(res[0].type).toBe('community');
  });

  it('sorts newest', () => {
    const res = run({ sort: 'newest' });
    expect(res[0].id).toBe('1'); // Jan 15
  });

  it('sorts oldest', () => {
    const res = run({ sort: 'oldest' });
    expect(res[0].id).toBe('3'); // Jan 05
  });

  it('sorts most votes', () => {
    const res = run({ sort: 'most-votes' });
    expect(res[0].id).toBe('2'); // total 25
  });

  it('sorts ending soon', () => {
    const res = run({ sort: 'ending-soon' });
    expect(res[0].id).toBe('2'); // deadline Jan 20 earliest
  });
});
