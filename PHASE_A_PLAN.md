# Phase A Build Plan — Complete the Spartan X Prototype to Full PRD/Design Fidelity

> **STATUS: COMPLETED 2026-06-21.** All waves (A1–A7) shipped and QA-locked (37/37 headless). See AUDIT.md §6.

Goal: flesh out every remaining feature so the prototype matches the PRD rule engine and the
Design Document, **while staying dependency-free, client-side, and QA-locked**. No backend.
Source of truth: `Spartan X Master PRD v3.0.docx` (§ refs below) + `Spartan X Design Document.docx`.
Baseline: commit `42dc526`, QA at 22/22. See `AUDIT.md` for the gap analysis this plan closes.

---

## Ground rules (prior lessons — apply to every task)
- **QA-locked**: every task ships with tests in `qa.html`; do not mark done until the full suite is green headless (Playwright harness in `D:\_qaverify\run.js`).
- **Escaping**: any new user/text interpolation into HTML uses `escapeHtml`/`escapeAttr` at the sink.
- **Module proofs stay gated**: do not regress the `source:"module"` rule — module activity must not move the headline standard tier (`standardStageIndex` counts `source !== "module"` only).
- **Safety overrides everything**: `hasCriticalSafetyFlag()` must still block elevation/PRESS in any new path (PRD §5.9 Safety Override, §7.11 acceptance "Safety overrides all other rules").
- **State growth is safe**: `deepMerge(DEFAULT_STATE, stored)` backfills new keys, so *additive* `DEFAULT_STATE` fields need no migration. **Bump `STATE_VERSION` to 2 only on a breaking shape change** (e.g., `standards[domain]` string → object — see A1).
- **Unit-testable**: top-level `function`s are globals on the iframe `window` (`win().fn(...)`); seed via `loadStateForToday`. `let state` is NOT global — seed through localStorage.
- **Naming**: keep stoic naming (PRODUCT_DIRECTION + Design §14.3). No military/XP/badge terms in user-facing strings.

---

## Sequencing
- **Wave 1 [S]**: A1 Moving Standard → A2 Qualification ladder (A2 depends on A1's per-domain data).
- **Wave 2 [P]**: A3 Deconstruction, A4 Mission assignment (independent of each other).
- **Wave 3 [P]**: A5 Step AAR, A6 Re-entry/reminders, A7 Polish.
Each wave: implement → add QA → run full suite → commit.

---

## A1 — Moving Standard engine  [Wave 1, effort M]
**Refs**: PRD §5.9 (states + elevation/stabilization/regression/safety-override), Design §13.9.
**Touch**: `DEFAULT_STATE.standards`, `updateStandardsFromProof` (~3051), `standardStageIndex` (~3068), `buildStandardSummary` (~2982), `renderStandardTab` (~1174), `standardEffect` (~3042).

**Data model** (breaking → **bump `STATE_VERSION` to 2**): change each `standards[domain]` from a string to:
```
{ level: "Untested", proofCount: 0, requiredProofs: 3, oldMax: null, nextThreshold: null }
```
States: `Untested → Tested → Stabilizing → Baseline → Elevated`, plus `Regressed`, `Under Review`.

**Algorithm** (reflected proof only; module proof still caps at `Tested`, no elevation):
- On Accepted reflected proof for a domain: `proofCount += 1`.
- **Elevate** (§5.9): `proofCount >= requiredProofs` ∧ avg friction over those proofs ≤ medium ∧ AAR quality ≥ Acceptable (≥2) ∧ no safety flag ⇒ advance one level (Tested→Stabilizing→Baseline→Elevated), set `oldMax`, reset counter for next threshold.
- **Stabilize**: completed but friction = high ⇒ hold at `Stabilizing`.
- **Regress**: domain failed 3× without correction ⇒ `Under Review`.
- **Safety override**: any active critical flag ⇒ no elevation this cycle.

**Acceptance**: domain elevates only after the full rule; high-friction completions stay Stabilizing; 3 uncorrected fails ⇒ Under Review; safety flag blocks elevation; module proofs never elevate.
**QA**: `testStandardElevatesAfterThree`, `testHighFrictionStaysStabilizing`, `testRegressionUnderReview`, `testSafetyBlocksElevation`, `testModuleProofNeverElevates` (extend existing).
**Risk**: breaking `standards` shape — every read site (`renderStandardTab`, `buildStandardSummary`, `domainNote`, QA `loadStateForToday` base) must move to `.level`. Grep `state.standards` first. Mitigate with STATE_VERSION bump + update QA base.

## A2 — Qualification ladder  [Wave 1, effort M–L]
**Refs**: PRD §5.10 (Recruit Qualified / Candidate / Operator / Spartan Standard requirement lists), §1.10 + §3 (V1 access locked until self-command proven), Design §12.18/§13.7 (lock cards).
**Touch**: new `computeQualification()`; `updateAdvancedTier` (~2441), `state.status`, `renderStandardTab`, modules gating in `renderModulesTab`/`renderActiveModule` (~1285).

**Algorithm**: derive eligibility from real state, not clicks:
- Recruit Qualified: First Order done ∧ claim selected ∧ 7-day Foundation complete ∧ ≥5 reflections ∧ ≥1 no-mood ∧ ≥1 recovery obeyed ∧ safety clear.
- Candidate: 21 active days ∧ ≥15 reflections ∧ ≥1 claim deconstructed ∧ BODY/MIND/WILL/OPERATOR baselines ∧ no unresolved safety.
- Operator: ≥1 integrated pressure trial ∧ correction-rate ≥70% ∧ readiness adherence ≥80% ∧ minimum-rescue ≥60% ∧ proof in 4 domains.
- Spartan Standard: all domain qualifications ∧ Doctrine Proven ∧ Integrity Stable ∧ avg AAR ≥ Strong ∧ moving standard active in ≥3 domains.
- **Lock V1 modules** (Circle/Connection/Pressure) behind Recruit Qualified; show lock cards with the missing requirements.

**Acceptance**: tiers never granted without underlying proof (clicking modules can't shortcut); each tier shows met/unmet requirements; locked modules inaccessible until qualified.
**QA**: `testRecruitRequiresRealProof`, `testTierLocksModules`, `testQualificationNoClickShortcut`.
**Risk**: "active days" needs a day counter — add `state.activeDays` set keyed by date (use existing date formatting; note non-determinism — store ISO dates). Keep deterministic for QA by seeding dates via `loadStateForToday`.

## A3 — Deconstruction depth  [Wave 2, effort M]
**Refs**: PRD §5.8 (per-claim evidence-required + contradiction rules + replacement doctrine).
**Touch**: `buildClaimCase` (~2865), `claimCaseFromEvidence`, `CLAIMS` (~27).
**Work**: implement evidence-required + contradiction rule for all 9 claims (PRD lists time / disciplined / train hard / know my limits explicitly; design the rest consistently). On contradiction, assign a replacement doctrine string. Drive evidence from real `proofLedger`/friction/readiness data.
**Acceptance**: each claim reaches `Contradiction forming` → `Contradiction` given the right proof pattern; replacement doctrine appears; QA already renders all 9 — extend to assert contradiction transitions for ≥3 representative claims.
**QA**: `testClaimContradiction` (time, disciplined, know-my-limits).
**Risk**: keep prototype-honest (label as deterministic logic, not real analytics).

## A4 — Mission assignment engine  [Wave 2, effort S–M]
**Refs**: PRD §5.3 (domain priority: weakest_domain, active_claim, recent_failures, readiness, qualification needs).
**Touch**: `choosePracticeAssignment` (~2481), `targetedPracticeForFriction` (~2554), `setPracticeForDay`.
**Work**: post-Foundation daily mission selection by weakest domain + active claim + recent failures + readiness command; keep the fixed 7-day Foundation sequence intact, layer the engine for Day 8+.
**Acceptance**: weakest domain gets prioritized; claim drives ≥1 mission; readiness RECOVER ⇒ recovery-safe assignment.
**QA**: `testMissionPrioritizesWeakestDomain`, `testRecoverAssignsSafe`.

## A5 — Step-by-step AAR  [Wave 3, effort S]
**Refs**: Design §19.5 + §12.14 ("consider one question per step").
**Touch**: `renderDebriefForm` (~1067), `updateDebriefInput` (~1813), `submitDebrief`.
**Work**: convert single form to a stepper (Result → Friction → Negotiation → Decision → Lesson → Correction) with `Step X of 6` progress (Zeigarnik). Preserve scoring; keep focus across the per-render `innerHTML` replace.
**Acceptance**: each step advances; back/next; submit only after required steps; scoring identical to current.
**QA**: `testStepAarFlow` (walk all steps → Accepted).
**Risk**: focus loss on re-render — store step index in state; only render current step's input.

## A6 — Re-entry & reminders (client-sim)  [Wave 3, effort S]
**Refs**: PRD Epic 16, §4.x re-entry.
**Touch**: add `state.lastActiveAt`; Today/`render` startup check; `safetyMessage`-style copy.
**Work**: on load, if `lastActiveAt` older than 1 day ⇒ show re-entry debrief prompt (Spartan tone, no "we miss you"); AAR-due indicator when reflection pending past deadline.
**Acceptance**: simulated absence shows re-entry; pending reflection shows due state.
**QA**: `testReentryAfterAbsence` (seed old `lastActiveAt`).
**Risk**: time non-determinism — inject/seed timestamps via state for QA, never `Date.now()` in asserted logic.

## A7 — Polish  [Wave 3, effort XS]
- Two-statement consent (PRD §4.9): split the merged checkbox into the two required statements in `renderAccountCreation`; update `canContinueProfile` + QA `setupToToday`.
- Proof "stamps" (Design §12.17/§13.5): style proof status as subtle stamps, not badges (`styles.css`).
- Use "Operator" sparingly per Design §14.3 — audit user-facing strings.
**QA**: update `setupToToday` for the two consent checkboxes.

---

## Cross-cutting
- **QA target**: 22 → ~35 tests, all green headless before each commit.
- **State version**: bump to 2 in A1 (breaking `standards` shape); update `qa.js` `loadStateForToday` base to version 2 + new shapes.
- **Determinism**: no `Date.now()`/`Math.random()` in any rule that QA asserts; seed dates/timestamps via state.
- **A11y/Design §19**: maintain 44px targets, reduced-motion, color-independent labels for all new UI.

## Failure modes
1. **`standards` shape change breaks read sites** → grep every `state.standards` use; migrate all + QA base; bump STATE_VERSION (else old localStorage crashes a render).
2. **Qualification computed from clicks not proof** → compute purely from `proofLedger`/counters; add a no-shortcut QA test.
3. **Active-days / re-entry flakiness** → seed all timestamps in tests; never assert on wall-clock.
4. **Module-proof regression** → keep `source` gating; re-run `testStandardRequiresReflection`.
5. **Naming drift** (Operator/military terms leaking) → grep forbidden terms before each commit.
6. **Focus loss in step AAR** → store step in state, render single input.

## Approval checklist (sign off before build)
- [ ] Confirm `standards[domain]` may change to an object (STATE_VERSION → 2; old local data resets).
- [ ] Confirm V1 modules (Circle/Connection/Pressure) should be **locked** until Recruit Qualified (PRD §1.10/§3) — this changes current always-open module access.
- [ ] Confirm Phase A stays client-side (no backend) — production items remain Phase B.
- [ ] Confirm wave order: A1→A2, then A3/A4, then A5/A6/A7.

## Out of scope (Phase B — production)
PRD §6 PostgreSQL schema, API, real auth/hashing/reset, persistence/sync, payments, real wearable/AI/
expert/team integrations, region-verified crisis directory, production privacy/export/delete.
