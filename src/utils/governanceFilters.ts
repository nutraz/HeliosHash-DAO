import { Proposal } from '@/types/governance';

export type SortKey = 'newest' | 'oldest' | 'most-votes' | 'ending-soon';

export interface MultiFilterOptions {
  statusFilters: Set<Proposal['status']>; // empty = all
  typeFilters: Set<Proposal['type']>; // empty = all
  sort: SortKey;
}

/**
 * Pure utility to filter & sort proposals matching current UI semantics.
 * Accepts Sets for O(1) membership checks.
 */
export function filterAndSortProposals(
  proposals: Proposal[],
  opts: MultiFilterOptions
): Proposal[] {
  const { statusFilters, typeFilters, sort } = opts;
  let list = proposals.filter((p) => {
    const statusOk = statusFilters.size === 0 || statusFilters.has(p.status);
    const typeOk = typeFilters.size === 0 || typeFilters.has(p.type);
    return statusOk && typeOk;
  });

  switch (sort) {
    case 'newest':
      list = list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'oldest':
      list = list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
    case 'most-votes':
      list = list.sort((a, b) => b.votesFor + b.votesAgainst - (a.votesFor + a.votesAgainst));
      break;
    case 'ending-soon':
      list = list.sort((a, b) => a.votingDeadline.getTime() - b.votingDeadline.getTime());
      break;
  }
  return list;
}

export function totalVotes(p: Proposal) {
  return p.votesFor + p.votesAgainst;
}
