# PRIV-002 — Replace localStorage usage in `app/auth/login/page.tsx`

Description:

This task tracks replacing client-side `localStorage` usage in `app/auth/login/page.tsx` where user profile data is stored after login. Replace with server-side session handling or secure HTTP-only cookies and implement consent recording.

Files:

- `app/auth/login/page.tsx`

Acceptance criteria:

- Remove client writes/reads to `localStorage` for profile/session storage.
- Implement session cookie flow or server API to fetch user profile.
- Add unit tests and E2E tests to ensure no PII is stored in localStorage.

Priority: High
Assignee: @maintainers
Labels: security, privacy, high-priority
