# Spartan X — Usage / Integration Audit (2026-06-21)

Focus: not "do features exist" (Phase A built them) but "are they actually **used** end-to-end
by a user clicking through the UI?" Done on Opus with direct code tracing. All findings were
evidenced at `file:line`; all fixes are QA-locked (suite 39 → **46 tests, all headless green**).

## Findings (and resolution)

| # | Usage gap found | Evidence | Fixed in |
|---|-----------------|----------|----------|
| 1 | **No wired post-Foundation continuation loop.** Day-7 `advanceFoundation` set "Foundation Confirmed" with no new mission; proof CTA "Close Foundation" dead-ended to the Standard tab. A4's weakest-domain assignment was only reachable via an unintuitive day-chip re-click → continued Moving-Standard movement and Candidate→Spartan progression were practically unreachable. | `advanceFoundation` 2961-2965; proof CTA 1249 | **U1** |
| 2 | **Elevation progress invisible.** `standardProgress.proofCount/fails` written but never read by any render → the standard moved "magically". | written 3380-3403, no render read | **U2** |
| 3 | **Qualification ladder showed static targets**, not live progress (unlike the deconstruction panel). | `computeQualification` labels | **U3** |
| 4 | **Stale readiness on Standard tab** — sliders updated `state.readiness` but not `state.standards.readiness` (only refreshed on proof). | readiness handler 1863-1866 | **U4** |
| 5 | **`activeDays` never surfaced** despite feeding the Candidate requirement. | tracked 3536-3539 | **U5** |
| 6 | **Proof Ledger had no filter-by-domain** (PRD §7.9) and didn't show proof source. | `renderProofTab` flat list | **U6** |
| 7 | **`oldMax`/baseline not implemented** (PRD §5.9 "old limits become baseline"). | — | **U7** |

Verified clean: **no dead buttons** — every rendered `data-action` has a handler (the only two
"orphans" are template-interpolated `pause-protect`/`pause-minimum`, a grep artifact).

## Wave U — shipped
- **U1** `continueStandard()` + "Continue Standard" CTA (Today + proof-logged once qualified) → assigns the weakest-domain practice and begins it. The ongoing loop is now reachable with one clear action.
- **U2** Standard domain cards show `N/3 reflected proofs to elevate` + fail streak.
- **U3** Qualification ladder shows live counts (reflections, domains, adherence %, active days, avg quality).
- **U4** Readiness changes update the standard live (no stale card).
- **U5** Active-days metric on Today.
- **U6** Proof Ledger domain filter + Module/Reflection source tag.
- **U7** `oldMax` recorded on elevation; "Old max X is now baseline" surfaced.

## End-to-end usage verdict
The full arc is now reachable and legible through normal clicking: onboarding → Foundation →
**continued daily practice (weakest-domain) → visible elevation → qualification tiers with live
progress**. The previously orphaned long-term loop (the PRD's core long-term value) is wired.

Remaining work is **Phase B only** (real backend/auth/persistence/payments/integrations, PRD §6) —
out of scope for the client-side prototype. Commits `38ebfe4`..`HEAD`.
