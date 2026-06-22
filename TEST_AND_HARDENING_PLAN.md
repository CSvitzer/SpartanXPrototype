# Spartan X — Out-of-the-Box Testing, Guards & Info Plan

Compiled 2026-06-22. The app already has 4 conventional layers (qa.html 46 · e2e deep 37 ·
coverage 31/68 actions · progression to Spartan). This plan goes **beyond scripted tests** into
fuzzing, invariants, runtime self-guards, tamper-evidence, observability, and process — chosen for
a client-side, localStorage-only, safety-critical, offline PWA with **no backend**.

Priority tags map to BACKLOG.md (P0/P1/P2). Effort: XS/S/M/L.

---

## A. Testing innovations (find what scripted tests can't imagine)

A1. **Invariant "monkey" fuzzer (P1, M).** A headless run that clicks *random* `data-action`s in
random order for thousands of steps, asserting CORE INVARIANTS hold after every step:
- standard tier never rises without a reflected Accepted proof;
- a critical safety flag always forces Under Review / blocks escalation;
- `recruitQualified` never flips true→false; proofLedger only grows (capped 200);
- no uncaught JS error; `localStorage` always parses to valid state; no `NaN`/`undefined` in numeric state.
Finds illegal states no scripted path visits. Seeded RNG → reproducible failures.

A2. **Exhaustive differential oracle (P1, M).** Re-implement the pure rules
(`computeReadiness`, `scoreDebrief`, `standardEffect`, qualification, level ladder) as a tiny
independent reference in the test, then sweep the **entire input grid** (e.g. all 5×5×5×4×5×5 ≈ 75k
readiness combos) and assert app == reference. Catches logic drift exhaustively, not by sampling.

A3. **Storage-chaos fuzzer (P0/P1, S).** Boot the app against dozens of corrupt `localStorage`
payloads (truncated JSON, wrong types, `__proto__` pollution, 50k-entry ledger, missing nested
objects, wrong stateVersion) and assert it ALWAYS reaches a safe usable screen — never white-screens.

A4. **Clock/calendar fuzzer (P1, S).** ✅ DONE (commit pending). `e2e/clock-fuzz.js` drives session
init under year boundary, new-year rollover, far future, a clock moved *backwards* (device skew), a
corrupt/null stored timestamp, and 70 consecutive days; asserts `reentry` stays boolean, `activeDays`
are valid unique `YYYY-MM-DD` capped at 60, no NaN, no crash. 27/27. No app bug found — the date
logic was already robust; this locks it in. Wired into `run-all` + `npm run clockfuzz`.

A5. **Cross-engine matrix (P1, S).** ✅ DONE (commit pending). DOM scripts honor `SX_BROWSER`;
`e2e/cross-engine.js` re-runs deep + coverage + chaos + a11y on **Firefox** and **WebKit** (8 runs),
wired into run-all + `npm run cross`; CI installs all three engines. **Found and fixed a real test
hang:** `navigator.serviceWorker.ready` never resolves under Playwright-WebKit (no SW support), which
hung deep-playthrough forever → guarded with a timeout race and engine-gated the offline assertion
(skipped + logged on WebKit; real iOS Safari supports SW). App logic itself runs clean on all three
engines (Firefox 37/40/45/11, WebKit 36/40/45/11). Pure-logic layers not matrixed (engine-agnostic).

A6. **Accessibility automation (P1, M).** ✅ DONE (commit pending). `e2e/a11y.js` runs axe-core
(WCAG 2.0/2.1 A + AA) across 9 screens + 2 modals and a keyboard reachability + focus-retention
check. **Found and fixed two real bugs:** (1) tab buttons used `aria-selected` (invalid on a plain
`<button>`, critical ×5) → switched to `aria-current="page"` (+ CSS); (2) the full-innerHTML
re-render dropped keyboard focus to `<body>` → added `captureFocusKey`/`restoreFocus` in `render()`
so the focused control is restored after every re-render. 11/11. Wired into run-all + `npm run a11y`.
(200% zoom / forced-colors not yet automated — minor follow-up.)

A7. **Visual regression, multi-condition (P1, M).** Screenshot-diff key screens at viewports
{320, 390, 768, 1024, 1440}, plus reduced-motion and high-contrast. Golden images in `e2e/`.

A8. **Performance & scale (P2, S).** Seed 10k proofs → measure render time + storage size; assert
the 200-cap holds and there's no O(n²) on Today/Standard. Lighthouse CI for PWA/perf budget.

A9. **Mutation testing (P2, M).** Run Stryker on `app.js`: it flips conditions/constants and checks
whether our 100+ tests CATCH the mutation. Measures *test quality*, not code — tells us if the
assertions are real or decorative.

A10. **Adversarial "gaming" test (P1, S).** Simulate a user trying to cheat to Spartan: spam
modules, garbage reflections, rapid double-clicks. Confirms the integrity guards can't be gamed
(validates source-gating + the central gate in B1).

A11. **Golden state/HTML snapshots (P2, S).** Serialize full state JSON + rendered HTML per scripted
step into committed goldens; diff on change to catch unintended state/UI drift.

## B. Runtime guards (the app watches itself)

B1. **Single safety+evidence chokepoint (P0, M).** Route *every* proof/standard mutation through one
`canEarnProof()` / `applyProof()` so the safety gate + evidence rule live in ONE place — a future
edit can't accidentally bypass them (today the gate is duplicated in `recordModuleProof` and
`submitDebrief`). Structural fix for the core integrity invariant.

B2. **In-app invariant assertions (P1, S).** A dev-mode `invariant()` run after each render checking
the same rules as A1. In dev → throw + log; in prod → silently self-correct (re-clamp). The app
self-detects illegal states in the wild.

B3. **Self-healing, non-destructive loader (P0, M).** On load, validate state against a JSON Schema.
If a field is corrupt, repair *just that field*; before any reset, copy the bad blob to
`spartan-x-backup` so nothing is silently lost and it can be inspected/restored.

B4. **Tamper-evident proof ledger / hash chain (P1, M).** ✅ DONE (commit pending). `applyProof`
signs each entry: `entry.prevHash = head.hash || "genesis"`, `entry.hash = hashEntry(entry, prevHash)`
(double FNV-1a). `verifyLedger` walks newest→older, re-hashing each signed entry and checking links;
`render` recomputes `ledgerTampered` and C3 surfaces a "Proof ledger integrity check failed" warning.
Tolerant of the 200-cap (no genesis tail requirement) and of legacy pre-B4 entries (no hash →
skipped). **Honest limit:** EVIDENT not cryptographic — the algorithm is client-visible, so a
determined user could recompute the whole forward chain; it catches casual devtools edits, which is
the realistic threat for a local-only app. Tests: 4 in qa.js (signed-on-create, valid chain, tamper
detected, legacy tolerated).

B5. **Quota guard + rolling backup (P0, S).** ✅ DONE (commit pending). `saveState` writes through
`writeKey`, which on a `QuotaExceededError` drops recoverable keys (quarantine blob, then last-good)
and retries once; persistent failure sets a runtime `persistFailed` signal instead of throwing. A
rolling last-good snapshot (`spartan-x-prototype-state-lastgood`) is written only from invariant-clean
state and only when it changed; `loadState` rolls back to it (`recoverLastGood`) when the main key is
corrupt, instead of wiping to defaults, and flags `restoredFromBackup`. `resetState` clears all three
keys so a wipe leaves nothing recoverable. Tests: `testLastGoodRecovery` (qa.js) + the existing
storage-chaos suite exercises the recovery path.

B6. **Crisis hard-interlock (P0, S).** ✅ DONE (commit pending). The interlock is enforced at the
single proof chokepoint (B1 `applyProof`) and at status computation (`submitDebrief`), where the
safety-language scan provably runs *before* status is decided. B6 makes the interlock **non-crashable
and always evaluable**: `hasCriticalSafetyFlag` guards `Array.isArray`, and a new invariant requires
`safetyFlags` to be an array (self-healed to `[]`), so a tampered non-array payload can never
white-screen the read site and thereby bypass the interlock. Tests: `testSafetyFlagsSelfHeal`,
`testHistoryPreservedDuringCrisis` (qa.js).

> **Rejected design (documented on purpose):** a whole-ledger invariant "no `Accepted` proof may
> exist while a critical flag is active" was considered and **rejected** — it would retroactively
> downgrade proofs *legitimately earned before* a later crisis flag, corrupting real history. The
> interlock is a *transition* rule (block new acceptance), not a *state* rule over the whole ledger;
> `testHistoryPreservedDuringCrisis` locks in that history is preserved.

B7. **Double-click / idempotency debounce (P1, XS).** Guard rapid repeats (e.g. advance-foundation
twice) so a jittery tap can't double-advance or duplicate a proof.

## C. Info / observability (no backend required)

C1. **Privacy-first local metrics (P1, M).** ✅ DONE (commit pending). `computeReport()` derives the
user's own numbers from local state only (no fabrication, no telemetry): active days, reflections,
proof outcomes by status + under-review rate, avg + recent reflection quality, top friction, highest
qualified tier (recomputed from real requirements, not the status label). Shown via `open-report`
modal from the System tab. Test: `testLocalReport` + full-coverage. (Opt-in aggregate export for the
maker remains out of scope — local-only by design.)

C2. **In-app diagnostics panel (P1, S).** Hidden dev gesture → live state, invariant status, storage
size, SW status, build/state version. One tap copies a diagnostic blob for bug reports.

C3. **Honest integrity/version banner (P0, XS).** ✅ DONE (commit 4ae0862). `renderIntegrityBanner()`
shows a red "Changes are not being saved" alert when `persistFailed` (quota/blocked writes) and a
"Recovered from backup" status (with Dismiss) when `restoredFromBackup`. Injected at the top of the
phone section every render. Tests: `testRecoveryBannerDismiss` (qa.js) + the storage-chaos quota
section asserts the degraded notice shows and clears.

C4. **Decision-log transparency (P2, S).** Per proof, show exactly why the standard moved or didn't
("held: friction high") — extends the deterministic, explainable engine the PRD wants; builds trust.

C5. **Stoic beta-feedback bundle (P1, S).** A restrained "report" action that bundles diagnostics +
a note into a clipboard/file blob (no backend); plus an always-available "get help" affordance.

C6. **Session recorder/replay (P2, M).** Record anonymized local click-streams; replay them as
regression tests and to inspect how real beta testers actually move (test + product insight).

## D. Process / monitoring

D1. **CI pipeline (P1, M).** ✅ DONE (commit pending). `e2e/run-all.js` (`npm run all`) starts
`serve.js`, runs every layer (qa headless + deep + coverage + oracle + chaos + fuzz fresh/qualified +
progression) against it, tears the server down, and exits non-zero on any failure.
`.github/workflows/ci.yml` runs it on push/PR. Still open: webkit/firefox matrix (A5) and a11y/visual
layers (A6) — those scripts don't exist yet, so they're added to run-all when A5/A6 land.

D2. **Synthetic canary (P2, S).** A scheduled job loads the *deployed* PWA and runs the e2e smoke;
alerts if the live site breaks (uptime + functional canary).

D3. **Demo mode `?demo=1` (P1, XS).** Expose the seeded qualified state behind a URL param so
testers/stakeholders see the whole app (incl. late-game tiers) instantly — no 26-day grind. Reuses
the screenshot seed.

D4. **Feature flags (P2, S).** Tiny localStorage flag system to A/B experimental UX (e.g.
quick-reflection) with beta testers.

---

## Suggested phasing
- **Wave G (guards+info, P0-heavy):** B1, B3, B5, B6, C3 + BACKLOG P0 #1/#2 → makes it *safe & trustworthy*.
- **Wave T (test innovations):** A1, A2, A3, A4, A5, A6 + D1 → makes correctness *provable at scale*.
- **Wave X (extras):** B4, C1, C2, C5, D3 → integrity theatre done right + observability.
- **Wave L (later):** A7–A11, B7, C4/C6, D2/D4.

## Failure modes
- **Over-engineering a prototype:** these are powerful but easy to gold-plate. Gate by ROI; B1/B3/B5/B6
  and A1/A2/A3 are the high-value core — the rest is opt-in.
- **Invariant/guard false positives** could block legitimate states → ship guards in dev-throw /
  prod-heal mode first, tune against the fuzzer before hard-enforcing.
- **Hash-chain (B4) friction:** must survive legitimate edits (reset, import) → version the chain and
  re-seal on import.
- **Local metrics ≠ consent to send:** keep strictly local + explicit opt-in (safety/privacy domain).
- **Test flakiness at scale** (fuzz/visual) → seeded RNG, fixed clock, tolerance thresholds.

## Correct execution method (the "how")
Order and method matter more than the item list:
1. **Measure before modifying.** Build `checkInvariants()` + the A1 fuzzer FIRST and run against the
   *current* app. Real violations = real bugs to fix before any guard. No violations = guards are
   confirmation, not correction. (Adding hard guards first risks blocking legitimate states.)
2. **One source of truth for invariants** — `checkInvariants(state)` defined once, consumed by the
   fuzzer (A1), the runtime guard (B2), and unit tests. DRY.
3. **Oracle from spec, not code (A2).** Reference rules written independently from PRD §5 text, so a
   divergence is a real bug, not a mirrored one.
4. **Refactor under green (B1).** Behaviour-preserving: full suite green before AND after; no new
   test should be needed to make it pass.
5. **Guard + two tests together:** one proving it fires on the bad path, one proving it does NOT
   false-positive on every legitimate path (validated by the fuzzer).
6. **Determinism:** seeded PRNG (print seed on failure), mocked clock, pixel tolerance.
7. **Dev-throw / prod-heal:** guards throw under a `strict` flag in tests, self-heal silently + log
   in prod. Flip to hard enforcement only after the fuzzer is clean for N runs.
8. **Quarantine before destroy:** any heal/reset copies the bad blob to a backup key first.
9. **Isolation:** app stays dependency-free/build-free (guards are vanilla JS); tooling lives in `e2e/`.
10. **Evidence gate + commit per item.**

Correct sequence: A1 fuzzer (evidence) → fix any real bugs → B1 central gate (under green) →
`checkInvariants` as prod-heal guard → A2 oracle → A3 storage-chaos + B3 self-healing loader →
B5/B6 guards → A4/A5/A6 layers → C3/demo info → D1 CI. Flip guards to strict only after fuzzer is clean.

## Approval checklist (sign off before building)
- [ ] Confirm scope/appetite: full plan vs Wave G + Wave T only (recommended).
- [ ] OK to centralize proof mutation (B1) — touches core; covered by existing tests + A1/A2.
- [ ] OK to add a `dev/test` toolchain (Stryker/axe/Lighthouse) under `e2e/` (app root stays dep-free).
- [ ] Confirm metrics (C1) stay local + opt-in only.
- [ ] Confirm hash-chain (B4) is wanted (adds integrity but complexity).
