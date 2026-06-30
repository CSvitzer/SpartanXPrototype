# Spartan X — Review Remediation Plan (2026-06-30)

Scope: the **verified-real** findings from the 38-reviewer panel (REVIEW.md). False positives and
by-design items are explicitly excluded (see §Excluded). Every change is **oracle-safe** (the 5 swept
pure fns stay byte-identical; new entry fields stay off the B4 hash canon), tested, screenshot-verified,
multi-gate (sonnet/opus) approved, then committed + deployed — the standing pattern.

## 1. Research notes (prior lessons, prepended)
- **Oracle determinism** is the hard constraint: never touch `computeReadiness / scoreDebrief /
  qualityLabel / standardEffect / nextStandardLevel` clean-state behavior → keep 12,596/0. Layer new
  behavior on history/new fields; new entry fields must NOT enter `hashEntry`'s 13-field canon.
- **Gates run sonnet/opus, never haiku** (pass `model` explicitly) — haiku misreads code+pixels.
- **Screenshot-verify** every UI change (regenerate shots, eyes-on) before reporting.
- **Idempotency**: grep the target state before editing; skip if already satisfied.
- **EO spine guardrail** (don't regress): own your part, never outcomes/others = self-punishment.
- **Harness reality**: shots.js seeds bleed prior localStorage → the panel's #1 "P0" (fresh-install
  backup banner) was a *screenshot artifact*, not an app bug. Fix the harness FIRST so onboarding is
  re-reviewable on true pixels.
- Pipeline gotchas: WebKit SW hang (guarded), cross-engine 1-retry flake, `begin-main-mission` is a
  Today CTA (full-coverage ordering).

## 2. Tasks  ([S]=sequential, [P]=parallel-authorable; all edits in app.js so serialize the writes)

### Phase A — Harness + verification (do first; unblocks onboarding re-review)  · risk L1
- **A1 [S]** `e2e/shots.js`: `localStorage.clear()` before each seed; regenerate shots; eyeball 01–05
  show real onboarding (Access/Select/Execute/Report), not the backup banner. *Artifact:* corrected PNGs.
- **A2 [S]** qa: add `testFreshInstallNoBanner` (empty localStorage → load → no "Recovered from backup").
  Proves the banner can't fire on a genuine first run. *Artifact:* qa green.

### Phase B — Verified app fixes  · risk noted per item
- **B1 [S]** RECOVER CTA (renderTodayTab, app.js:~1229): when `computeReadiness()==="RECOVER"`, relabel
  the primary CTA to **"Begin Recovery Practice"** and restyle `primary`→`steel` (break the gold=go
  association). Behavior already routes to a recovery-safe practice; this fixes the affordance/label
  contradiction. L1.
- **B2 [S]** Timer (renderMissionTab, app.js:1449): replace the static `10:00` with the **existing real
  timer** — render `<strong id="timerValue">` + call `startTimer()` on mission-active (reuse
  `formatTime`/`startTimer`/`tickHandle`; updates the node directly, no full re-render). L1.
- **B3 [S]** Cloud free-text privacy (cloudSnapshot, app.js): strip raw free-text (`negotiation`, and any
  user-typed `lesson`/`correction` if present on the entry) from the **synced** ledger snapshot; keep the
  hashable canon fields (so verifyLedger/anti-cheat unaffected — those fields aren't in the canon). Add
  one explicit line to the cloud copy: "Your written reflections stay on this device; only proof
  metadata syncs." L2 (verify phaseb 13/13 still lossless on canon fields).
- **B4 [S]** Delete-data confirm (reset): gate `reset` behind a confirm modal that names what is lost
  ("This erases all proofs, standards, and the recovery backup. Cannot be undone."). L2 (destructive).
- **B5 [S]** Modal focus-trap + a11y: set `inert` on `#app` (and `aria-hidden`) whenever `state.modal`
  is open; add `aria-valuemin/max/now` to readiness sliders; raise the inactive-tab label to ≥4.6:1. L1.
- **B6 [S]** Status vocabulary: map the 6 domain labels to the 5-rung ladder (display-only); drive the
  Standard `h1` from one source (`standardStageIndex`/`levelIndex`) so headline and progress bar agree.
  **Display/label only — must NOT change `nextStandardLevel`/`standardEffect` logic.** L2 (oracle-adjacent
  by proximity, not by edit).
- **B7 [S]** Crisis-flag clear-confirm: for the 3 mental-health flags (crisis/self-punishment/
  restriction), require a confirm ("I am safe now") to REMOVE; setting stays one-tap; physical flags
  (injury/pain/medical) stay freely toggleable. L2 (safety; update toggle tests).
- **B8 [S]** Close the calibration loop visibly: at the debrief result/first step, show the locked
  prediction and (after submit) the prediction-vs-outcome, not only in the report. L1.

### Phase C — Verify + gate + ship  · risk L1→L2
- **C1 [S]** Add/extend qa tests per B1–B8; run full 15-layer pipeline — **oracle must stay 12,596/0**,
  full-coverage all-actions, cross-engine.
- **C2 [S]** Regenerate shots; eyes-on the changed surfaces (RECOVER CTA, timer, delete-confirm, cloud
  copy, modal focus, standard headline).
- **C3 [S]** Multi-gate **opus** approval: Stoic+Spartan-safety (B1/B7), determinism (B3/B6), a11y (B5),
  UX (batch). Verify findings before acting on them.
- **C4 [S]** Commit + deploy (SW bump) + confirm live; update BACKLOG/FEATURES/REVIEW.

## 3. Failure modes (realistic)
- **B3 breaks phaseb.js** (lossless-union test) if I strip a *canon* field. Mitigation: strip only
  NON-canon free-text (`negotiation` etc.) → hash unchanged → union/anti-cheat intact; re-run phaseb 13/13.
  Side effect: cross-device negotiation-mining weakens — acceptable (privacy > cross-device excuse stats).
- **B6 touches a swept fn by accident** → oracle breaks. Mitigation: edits are render/label only; grep-diff
  the 5 fns to confirm byte-identical before C1.
- **B2 timer churn / leak**: `startTimer` uses one `tickHandle` + direct node update; ensure it's cleared
  on leaving mission (existing `clearTimer`?) so no dangling interval. Verify no double-interval.
- **B7 breaks safety tests** (full-coverage/qa toggle safety freely). Mitigation: keep ADD one-tap; only
  REMOVE of the 3 mental-health flags gets the confirm; update the specific tests.
- **B4 confirm vs full-coverage** (which clicks `reset`). Mitigation: route reset→modal; coverage clicks
  confirm-reset; add to ALL list.
- **A1 regen** could shift `visual.js` baselines — it won't (visual.js seeds its own state, doesn't read
  shots). Confirm.
- **General oracle regression** — mitigated by the additive rule + C1 pipeline gate.

## 4. Approval checklist (your sign-off)
1. **Scope** = the 8 verified-real items (A1–A2, B1–B8). Excluded: the false positives + retention/
   monetization (by-design for a personal app). ✅/✏️?
2. **B2 timer**: make it the *real* countdown (infra exists) — OK? (alt: remove the time display.) ✅/✏️?
3. **B3 cloud**: *strip* free-text from sync (privacy-first, recommended) — OK? (alt: keep + explicit
   consent only.) ✅/✏️?
4. **B7**: add friction to *clearing* a mental-health flag (not setting) — OK? ✅/✏️?
5. **Process**: each item oracle-safe + tested + opus-gate-verified + auto commit/deploy — confirm.

## 5. Excluded (verified false / by-design — will NOT touch)
- Fresh-install backup banner as an *app* bug (false — harness only; A1 fixes the harness).
- "locale-honest emergency numbers are fake" (false — already honest).
- "No reflection. No standard. not enforced" (false — Incomplete = no elevation).
- "Cloud says metrics only" (false — copy already states the ledger syncs).
- No monetization/retention (by-design: personal, local-only, anti-vanity). Separate strategy track only
  if you change the goal.
- Deterministic mock token (intentional test affordance; real-backend hardening already in BACKLOG).

## 6. Feedback compliance (self-check)
- Planning discipline: research notes ✓ · [S]/[P] ✓ · failure modes ✓ · approval checklist ✓ · risk
  levels L0–L3 ✓ · evidence/artifact per phase ✓ · idempotency (grep-first) ✓.
- Project feedback: gates sonnet/opus ✓ · screenshot-verify ✓ · oracle untouched ✓ · no unverified claims
  (verified every item; corrected 4 panel false-positives) ✓ · commit+deploy auto ✓ · EO guardrail intact ✓.
- Panel coverage: every **verified-real** finding maps to a task (A1↔harness, B1↔RECOVER CTA, B2↔timer,
  B3↔cloud free-text, B4↔delete, B5↔focus-trap/a11y, B6↔vocabulary, B7↔crisis-clear, B8↔calibration loop).
