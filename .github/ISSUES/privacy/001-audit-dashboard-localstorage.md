# PRIV-001 — Replace localStorage usage in `app/dashboard/page.tsx`

Description:
This task tracks replacing client-side `localStorage` usage of the `user` profile in `app/dashboard/page.tsx` with a secure server-side session or HTTP-only cookie and adding consent checks before storing any profile/demographic data.

Files:

- `app/dashboard/page.tsx`

Acceptance criteria:

- Remove writes/reads to/from `localStorage` for persistent user profile data.
- Replace with server-side session retrieval (API + secure cookie) or short-lived token exchange.
- Add a consent flow and record consent via `app/api/privacy` endpoints.
- Add tests that verify data is not written to `localStorage` during workflows.

Priority: High
Assignee: @maintainers
Labels: security, privacy, high-priority
