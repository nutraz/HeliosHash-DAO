---
name: Deprecation Task
about: Track deprecation of legacy or transitional API/code paths
title: '[DEPRECATION] Replace JobFilters singular properties with array-based properties'
labels: deprecation, enhancement, priority:medium
assignees: ''
---

## Summary

Deprecate transitional singular field aliases in `JobFilters` and migrate all usage to canonical plural forms.

## Current Singular Aliases (deprecated)

- `category: JobCategory[]` (use `categories`)
- `location: string[]` (use `locations`)
- `experienceLevel: ('Entry' | 'Mid' | 'Senior' | 'Lead')[]` (use `experienceLevels`)
- `workType: ('FullTime' | 'PartTime' | 'Contract' | 'Internship')[]` (use `workTypes`)
- `minCompensation: number` (use `compensationRange.min`)
- `maxCompensation: number` (use `compensationRange.max`)

## Rationale

Unify filter model around plural, multi-select capable properties; reduce ambiguity and simplify future backend query translation.

## Tasks

- [ ] Update `JobFiltersPanel` to read/write only plural forms
- [ ] Migrate any components accessing singular fields
- [ ] Remove singular alias fields from `JobFilters` interface
- [ ] Update sample data / mocks
- [ ] Adjust tests (add coverage for plural usage)
- [ ] Update documentation & developer guide
- [ ] Add changeset / release notes entry for v2.1.0

## Migration Plan

1. Introduce shim layer mapping old -> new (already present).
2. Update UI components (PR 1) to stop writing singular keys.
3. Run repo-wide search ensuring no remaining singular references.
4. Remove deprecated fields (PR 2) & update docs.

## Backward Compatibility

No runtime break once UI updated; types will break on removal encouraging required migration.

## Target Version

v2.1.0

## Additional Notes

Coordinate with any backend filtering logic once implemented to ensure parity.
