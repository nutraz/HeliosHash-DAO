# Tester Onboarding (quick)

Purpose: get a tester online quickly with the mobile dev server and a short checklist for smoke tests.

1) Prerequisites
- Be on the same LAN as the dev machine.
- Scan the QR or visit the network URL shared by the dev: http://<LAN_IP>:3003
- Use a modern mobile browser (Chrome/Safari) and allow camera if prompted for QR utilities.

2) Quick smoke checklist
- Open URL and confirm homepage loads.
- Sign in via the mocked local auth flow (if prompted).
- Navigate to Community → Projects and open any proposal.
- Submit a simple application form (use placeholder values).
- Report results in `TESTER_FEEDBACK.md`.

3) Contact
- Add notes and screenshots to the feedback file and ping the maintainer in the team chat.

4) Running the Playwright mobile smoke (optional)
- Ensure the mobile server is running and reachable on the LAN (see `scripts/smoke-mobile.sh`).
- Run Playwright mobile smoke locally (replace MOBILE_TEST_BASE if your LAN IP differs):

```bash
# Run the mobile smoke test (uses `MOBILE_TEST_BASE` env if provided)
MOBILE_TEST_BASE="http://192.168.29.210:3003" pnpm test:e2e --grep smoke-animal-care
```

Or run the test file directly:

```bash
npx playwright test playwright/tests/smoke-animal-care.spec.ts --project=mobile-chrome
```
# HeliosHash DAO – 50kW Solar Co‑Ownership MVP Tester Guide

> **MVP Simulation – No Real Funds or Wallets Active**
>
> This build is a functional prototype for validating the early user journey. On‑chain logic, payment settlement, and wallet interactions are simulated.

---

## 1. Purpose

Validate the core usability, clarity, and basic interaction flow for the 50kW solar co‑ownership MVP before expanding features or connecting real token/payment infrastructure.

## 2. In-Scope Features

- Project application form & listing
- Governance panel (placeholder / structural presence)
- UPI payment simulation component (UI only – shows conversions)
- Badge / incentives visibility (read-only)
- Mobile responsiveness (navigation + dashboard)

## 3. Out of Scope (Ignore If Encountered)

- Real wallet connection / token transfers
- Cross-chain or ckBTC flows
- Enhanced micro‑grants logic (quarantined)
- Advanced performance/security guarantees
- Persistence guarantees across restarts (may reset)

## 4. Environment

| Context               | URL / Action                                                  |
| --------------------- | ------------------------------------------------------------- |
| Desktop               | `http://localhost:3001`                                       |
| Mobile / Other Device | `http://YOUR_LAN_IP:3001` (e.g. `http://192.168.29.xxx:3001`) |
| Socket.IO (internal)  | `ws://0.0.0.0:3001/api/socketio`                              |

If pages appear blank: hard refresh (Ctrl+Shift+R) or clear cache.

## 5. Core Flow (Must Complete)

| #   | Action                                              | Expected Success Criteria                           |
| --- | --------------------------------------------------- | --------------------------------------------------- |
| 1   | Open landing / dashboard                            | Layout renders, navigation visible                  |
| 2   | Navigate to Projects / Applications                 | Application form button / panel visible             |
| 3   | Submit new project (dummy data)                     | Confirmation or appears in list / success feedback  |
| 4   | Open Governance area                                | Panel loads (even if minimal) without error banners |
| 5   | Open UPI payment module                             | Amount + conversion UI visible                      |
| 6   | Enter `1000` amount                                 | INR + token calc updates                            |
| 7   | Change to `2500`                                    | New conversion recalculates instantly               |
| 8   | Navigate between 3–4 sections then return           | No layout crashes or stuck state                    |
| 9   | Load on mobile or narrow viewport                   | Layout responsive and usable                        |
| 10  | (Optional) Trigger validation errors (empty fields) | Inline validation feedback shown                    |

## 6. Quick Visual Indicators of Success

- No perpetual loading spinners
- No red error text in console (if open) during basic flow
- State resets are clean (no orphaned UI artifacts)

## 7. Issue Reporting Format

Report each issue with:

```
Page / Area:
Severity: Blocker | Minor | Suggestion
Steps to Reproduce:
Expected:
Actual:
Screenshot: (y/n)
```

Severity Definitions:

- **Blocker**: Prevents completing a core flow step.
- **Minor**: UI polish / clarity issue.
- **Suggestion**: Enhancement idea; not required for MVP validation.

## 8. Feedback Template (Copy & Fill)

```
# HeliosHash 50kW MVP Tester Feedback

Tester ID (initials):
Device + Browser:
Network Type (WiFi/4G):

## Overall Experience (1–5):
( ) 1 ( ) 2 ( ) 3 ( ) 4 ( ) 5

## Core Flow Results
- Application Submission: PASS / FAIL / NOTES
- Governance Panel Visibility: PASS / FAIL / NOTES
- UPI Simulation: PASS / FAIL / NOTES
- Mobile Layout: PASS / FAIL / NOTES

## Issues Found
1. Title:
   Page:
   Severity:
   Steps:
   Expected:
   Actual:
   Screenshot:

2. ...

## Performance Perception
Time to first usable screen: fast / acceptable / slow
Any noticeable lag? (describe)

## Suggestions
-
-

## Would you invest based on this interface prototype? (Y/N + why)
```

## 9. Success Criteria for This Round

We consider the MVP acceptable if:

- 2+ testers complete the full flow
- ≤ 2 Blocker issues remain
- Conversion logic and navigation both rated ≥ 4/5 average

## 10. Known Limitations (No Need to Report)

- Wallet connect is placeholder only
- Data may reset between reloads
- Some navigation destinations are stubs
- Micro-grants enhanced module removed from build

## 11. Next (Post-Feedback) Milestones

| Milestone                                    | Target                           |
| -------------------------------------------- | -------------------------------- |
| Apply urgent fixes                           | 48h after feedback window closes |
| Add persistence layer (canisters / storage)  | Next sprint                      |
| Introduce proposal creation + minimal voting | Post persistence                 |
| Early tokenomics simulation                  | After voting foundation          |

## 12. Contact / Support

Submit feedback via preferred channel (GitHub issue, Notion page, or direct email). If completely blocked, include console log excerpt if possible.

---

Thank you for helping bootstrap community solar ownership. Your feedback directly shapes the launch trajectory. ☀️
