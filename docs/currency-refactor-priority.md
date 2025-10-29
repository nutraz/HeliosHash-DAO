# Currency Refactoring Priority List

This document prioritizes currency formatting refactors based on user impact and complexity.

## Goals

- Eliminate raw occurrences of values like `₹250000` or `100 OWP`.
- Use `formatINR(amount)` for rupees and `formatOWP(amount)` for OWP token amounts.
- Maintain readability and avoid regressions (add tests for complex calcs where needed).

## Priority Legend

- ⭐⭐⭐⭐⭐ Critical user-facing / first impression
- ⭐⭐⭐⭐ High value
- ⭐⭐⭐ Medium
- ⭐⭐ Low
- ⭐ Very Low / Optional

## High Priority (Phase 1)

| Component/Page | Path                       | Notes                        | Priority   |
| -------------- | -------------------------- | ---------------------------- | ---------- |
| Landing Page   | `src/app/landing/page.tsx` | Marketing / first impression | ⭐⭐⭐⭐⭐ |
| Home Dashboard | `src/app/page.tsx`         | Main entry after auth        | ⭐⭐⭐⭐⭐ |
| NFT Page       | `src/app/nft/page.tsx`     | Token pricing clarity        | ⭐⭐⭐⭐   |

## Medium Priority (Phase 2)

| Component         | Path                                                                 | Notes                    | Priority |
| ----------------- | -------------------------------------------------------------------- | ------------------------ | -------- |
| Projects Overview | `src/app/projects/page.tsx`                                          | Multiple project metrics | ⭐⭐⭐⭐ |
| Community Page    | `src/app/community/page.tsx`                                         | Opportunities & bounties | ⭐⭐⭐⭐ |
| Job Filters Panel | `src/components/community/opportunities/filters/JobFiltersPanel.tsx` | Filter labels            | ⭐⭐⭐   |
| Collaborate Page  | `src/app/collaborate/page.tsx`                                       | Partnership cards        | ⭐⭐⭐   |

## Low Priority (Phase 3)

| Component            | Path                                      | Notes                                 | Priority |
| -------------------- | ----------------------------------------- | ------------------------------------- | -------- |
| DAO Proposals API    | `src/app/api/dao/proposals/route.ts`      | Server response formatting            | ⭐⭐     |
| Role Dashboard       | `src/components/role-based-dashboard.tsx` | Internal view                         | ⭐⭐     |
| Community Hub        | `src/components/community-hub.tsx`        | Testimonial-like content              | ⭐⭐     |
| Settings Components  | `src/components/settings/*`               | Minimal currency relevance            | ⭐⭐     |
| Tests (raw literals) | `**/*.test.tsx`                           | Usually safe to ignore / optional fix | ⭐       |

## Workflow

1. Run `pnpm refactor:currency` to regenerate suggestions after each batch.
2. For each file:
   - Replace literals with helper calls.
   - Prefer numeric literals (no commas) inside helper.
   - If dynamic (e.g., computed), pass the variable directly.
3. If large list/array of structured data includes raw amounts, consider extracting to a typed constant.
4. Add/update snapshot/unit tests where formatting influences UI logic (sorting, thresholds, etc.).

## Edge Cases

- Embedded formatted strings inside template literals: refactor to `${formatOWP(val)}` instead of manual concatenation.
- JSON-like mock objects used in tests can keep raw numbers (not formatted strings) and let the component format.
- Avoid double-formatting already formatted values (search for `OWP` followed by a helper call—should not happen).

## Tracking Template

Use this checklist while progressing:

```markdown
### Phase 1 Progress

- [ ] landing/page.tsx
- [ ] page.tsx
- [ ] nft/page.tsx

### Phase 2 Progress

- [ ] projects/page.tsx
- [ ] community/page.tsx
- [ ] JobFiltersPanel.tsx
- [ ] collaborate/page.tsx

### Phase 3 Progress

- [ ] proposals/route.ts
- [ ] role-based-dashboard.tsx
- [ ] community-hub.tsx
- [ ] settings/\*
- [ ] tests (optional)
```

## Next Steps

1. Commit helper script & this plan.
2. Execute Phase 1 replacements; run lint + tests.
3. Regenerate suggestions and proceed to Phase 2.
4. Document any non-trivial transformations (e.g., refactored mapping logic) in CHANGELOG or inline comments.

---

Generated plan to guide systematic currency formatting cleanup.
