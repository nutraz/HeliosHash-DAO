# C3 — Governance vote/execute remediation (scope doc)

**Status:** SCOPING ONLY — awaiting sign-off before any implementation.
**Date:** 2026-05-23
**Implementation target (later):** `canisters/governance/Governance.mo` (the *deployed* governance canister)

## Context (code-observable)

The deployed governance canister is a 46-line stub. `createProposal` is its only
mutator; `votesFor` / `votesAgainst` / `executed` are set at proposal creation and
**never change** — there is no `vote` and no `execute`. State (`proposals`,
`nextProposalId`) is `transient`, so it is wiped on every upgrade. There is no
membership, quorum, threshold, deadline, or per-voter dedup.

C3 closes this functionality + authorization gap **on the deployed file**, reusing
the controller-gated owner pattern already shipped in C1/C4/C5/C6/H6.

## In scope

1. **Persist state.** `proposals`, `nextProposalId`, and the new vote/membership/
   config state become stable (plain stable storage; **no migration branch** — the
   deployed canister holds only test proposals, nothing live to reconstruct).
2. **`vote(proposalId, inFavor)`** — rejects anonymous; member-gated; **one vote per
   principal per proposal** (dedup); rejects if the proposal is missing, past its
   deadline, or already executed; updates `votesFor` / `votesAgainst`.
3. **`execute(proposalId)` — flag-only.** Sets `executed = true` (and records an
   outcome) once quorum + threshold are met and the deadline has passed; idempotent
   (no double-execute); rejects anonymous. **Does NOT call any other canister.**
4. **Membership** — an owner-managed member set held *inside the governance canister
   itself*; controller-gated admin (`setOwner`, `addMember` / `removeMember`)
   mirroring C1/C4/C6.
5. **`createProposal`** — rejects anonymous; member-gated (matches the C6 Option-A
   choice).
6. **Config** — numeric `quorum` / `threshold` / voting-period (deadline) with
   owner-gated setters. **1 member = 1 vote.**
7. **Anonymous rejection + `caller` binding** on every state mutation.

## Decisions requiring sign-off

These are the only real forks; defaults shown. Confirm or adjust before implementation.

| Decision | Default | Alternative |
|---|---|---|
| `createProposal` gating | member-gated | open to any non-anonymous caller |
| `execute` caller | any member, once conditions met | owner-only |
| Membership source | governance-local owner-managed set | shared with `hhdao_dao` (deferred — see non-goals) |

## Design intent (signed off 2026-05-23)

- **Owner controls admission/membership.** The governance owner manages the member set.
- **Members control execution.** Once a proposal's conditions (quorum + threshold + deadline) are met, members — not the owner — drive `execute`.
- **Owner-managed membership is interim only.** It is a bootstrap mechanism, not the end state.
- **Future-state membership should be replaced by an external source** — e.g. OWP identity, a soulbound credential, or a vouching graph — **not layered on top of the owner-managed set indefinitely.**

## Non-goals (explicit)

- **No cross-canister execution.** `execute` is flag-only; it does **not** invoke
  treasury / token / any canister. A constrained execution dispatcher (e.g.
  governance → `treasury.withdraw`) is a separate future pass and changes the trust
  model (treasury would have to trust governance as a caller).
- **No token-weighted voting.** 1 member = 1 vote; OWP/HHU weighting is future.
- **No coupling to `hhdao_dao` membership.** Governance keeps its own member set;
  unifying the two member sets is future debt.
- **Do not deploy the undeployed `canisters/dao/main.mo`** (the ~840-line alternate
  governance) — it carries an unauthenticated `setTestMode` backdoor and stays
  quarantined. C3 edits the deployed `Governance.mo` **only**.
- No new tokens, no integration code, no CI work, no changes to any other canister.
- None of the appendix items below.

## Acceptance probes (mechanically checkable via `dfx canister call`)

1. `vote` as `--identity anonymous` → documented reject; `getProposals[id]` tally unchanged.
2. `vote` as a non-member → documented reject; tally unchanged.
3. member `vote(p, true)` → `votesFor` +1; a second `vote` from the **same** principal on `p` → documented reject; tally unchanged (dedup).
4. `vote` on a missing / past-deadline / already-executed proposal → documented reject.
5. `execute(p)` with `votesFor < quorum` → reject; `executed` stays `false`.
6. `execute(p)` at/after quorum + threshold and past deadline → success; `executed` = `true`.
7. `execute(p)` again after success → documented no-op; tally and `executed` unchanged (idempotent).
8. `createProposal` as anonymous → reject; as non-member → reject (per the gating choice); as member → success.
9. Controller-gated admin: `setOwner` / `addMember` / `setQuorum` as anonymous → reject, as non-controller → reject, as controller → success (mirrors C1/C4).
10. Upgrade survival: create → vote → `dfx deploy governance --upgrade-unchanged` → proposal + tally + `executed` persist.

## Out-of-scope / future-compatibility (listed only — not designed)

- OWP token integration
- SubDAO charter logic
- Tribute splits
- 1gigE plug points: identity, reputation, treasury interface, governance link
