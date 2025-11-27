import { Proposal } from '../types/governance';

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
      list = list.sort((a, b) => {
        const getTime = (val: any) => {
          if (typeof val === 'number') return val;
          if (typeof val === 'string') {
            const parsed = Date.parse(val);
            return isNaN(parsed) ? 0 : parsed;
          }
          if (val && typeof val.getTime === 'function') return val.getTime();
          return 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      });
      break;
    case 'oldest':
      list = list.sort((a, b) => {
        const getTime = (val: any) => {
          if (typeof val === 'number') return val;
          if (typeof val === 'string') {
            const parsed = Date.parse(val);
            return isNaN(parsed) ? 0 : parsed;
          }
          if (val && typeof val.getTime === 'function') return val.getTime();
          return 0;
        };
        return getTime(a.createdAt) - getTime(b.createdAt);
      });
      break;
    case 'most-votes':
      list = list.sort((a, b) => b.votesFor + b.votesAgainst - (a.votesFor + a.votesAgainst));
      break;
    case 'ending-soon':
      list = list.sort((a, b) => {
        const aTime = a.votingDeadline instanceof Date ? a.votingDeadline.getTime() : (typeof a.votingDeadline === 'number' ? a.votingDeadline : 0);
        const bTime = b.votingDeadline instanceof Date ? b.votingDeadline.getTime() : (typeof b.votingDeadline === 'number' ? b.votingDeadline : 0);
        return aTime - bTime;
      });
      break;
  }
  return list;
}

export function totalVotes(p: Proposal) {
  return p.votesFor + p.votesAgainst;
}
