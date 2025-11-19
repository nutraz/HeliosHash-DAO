# PRIV-004 — Review `app/payment/upi/page.tsx` form fields and storage

Description:

The UPI payment flow collects name, email, and phone. Ensure form inputs are validated, consent is obtained before storing, and storage is secure (do not persist PII in localStorage or logs).

Files:

- `app/payment/upi/page.tsx`

Acceptance criteria:

- Add a consent checkbox for data collection before the form is submitted.
- Do not store the personal fields in `localStorage`. Use secure transmission to backend and store in encrypted persistent storage if needed.
- Mask or redact PII in logs and error messages.

Priority: Medium
Assignee: @maintainers
Labels: privacy, medium-priority
