# Spartan X — End-to-End Regression Test

A single **continuous** Playwright playthrough of the **live** prototype: it follows the user
thread from a fresh state all the way through and asserts against real app state (not text).

It complements the dependency-free browser suite (`qa.html`, 46 unit-style tests in an iframe).
This drives the real top-level app, including PWA install + offline. Kept in its own folder so
the app root stays dependency-free.

Scripts:
- `npm test` — `deep-playthrough.js`: one continuous user thread (37 checks).
- `npm run qa` — `qa-headless.js`: runs the dependency-free browser unit suite (`qa.html`, 50 tests)
  headlessly so it can run in CI alongside the Playwright scripts. Exit 0 only if all 50 pass.
- `npm run chaos` — `storage-chaos.js`: boots against corrupt localStorage payloads (truncated JSON,
  wrong version, null, garbage, wrong types, proto-pollution, 5000 proofs) and asserts the app
  always renders, never crashes, quarantines corrupt blobs to a backup key, caps the ledger, and is
  never prototype-polluted. Also drives the quota path: when the store rejects writes the app keeps
  rendering, shows an honest "changes are not being saved" notice, and clears it once writes
  succeed. 45 checks.
- `npm run oracle` — `oracle.js`: differential oracle. An independent reference of the rule engine
  (from PRD §5) swept across full input grids (≈12.5k readiness combos + score/effect/label/ladder)
  vs the app's actual functions; any mismatch = logic drift. 12,596 cases, 0 mismatches.
- `npm run fuzz` — `fuzz.js`: seeded random "monkey" that clicks random actions for N steps and
  asserts core invariants after every step (valid storage, stateVersion, ledger ≤ 200, foundation
  day ∈ [1,7], no NaN, qualification never regresses except via reset, no uncaught errors). Env:
  `SEED`, `STEPS`, `QUALIFIED=1` (start from a qualified state to fuzz the deep region). ~2600
  steps across fresh+qualified entry: 0 violations.
- `npm run clockfuzz` — `clock-fuzz.js`: drives session init under hostile wall-clocks (year
  boundary, new-year rollover, far future, a clock that jumped backwards, a corrupt/null stored
  timestamp, and 70 consecutive days) and asserts the date-dependent state stays sane: boolean
  `reentry`, valid unique `YYYY-MM-DD` `activeDays` capped at 60, no NaN, no crash. 27 checks.
- `npm run cross` — `cross-engine.js`: re-runs the DOM-interaction layers (deep, coverage, chaos,
  a11y) on **Firefox** and **WebKit** (≈ Safari) via the `SX_BROWSER` env, to catch engine-specific
  breakage without a device. The pure-logic layers (oracle/fuzz/progression) are engine-agnostic and
  not matrixed. Note: Playwright's WebKit build lacks service-worker support, so deep-playthrough
  skips its offline assertion on WebKit (logged, not silent; real iOS Safari supports SW). 8 runs.
- `npm run visual` — `visual.js`: **layout-sanity** across 4 widths (320/360/390/768) × 8 screens —
  asserts no horizontal overflow, screen rendered, and tab bar within the viewport. A stable,
  maintenance-free alternative to flaky golden-image diffs. 96 checks.
- `npm run a11y` — `a11y.js`: runs **axe-core** (WCAG 2.0/2.1 A + AA) across every key screen + the
  data and report modals, plus a keyboard reachability and **focus-retention** check (focus must not
  drop to `<body>` after the full-innerHTML re-render). Fails on any serious/critical violation.
  11 checks. Requires `@axe-core/playwright` (in devDependencies).
- `npm run progression` — `progression.js`: clock-mocked multi-week playthrough (26 simulated
  days) that drives real daily usage all the way to **Spartan Standard**, proving every
  qualification tier (Foundation Confirmed → Candidate → Operator → Spartan) is actually
  reachable through play, not just computed.
- `npm run coverage` — `full-coverage.js`: exhaustive branch + **action-coverage** pass. Clicks
  across every direction (all readiness bands, all proof statuses, pause protect/minimum/stop,
  adjust pain/fatigue, pain-downgrade confirm+cancel, first-order success/fail/retry/quit/minimum,
  all 9 claims, locked+unlocked modules, all 12 modules incl. reckless-pressure branch, safety
  crisis+restriction, integrity banner dismiss, data backup/restore export+import, local report,
  system reset) and asserts that **all 73 of the app's `data-action` handlers were exercised** (fails
  if any is left unclicked). 40 branch checks, 73/73 actions.

## Coverage (37 checks)
Onboarding (order, claim, two consents, safety gate) → full 7-day Foundation with edge flows
(Adjust Practice, Pause/Recenter, Report Pain, pain-downgrade confirm) → Foundation Confirmed →
Continue Standard loop (weakest-domain, repeatable) → readiness RECOVER + live sliders →
all 12 modules (state-verified) → Standard (qualification ladder + elevation progress) →
Proof Ledger (domain filter + source tag) → Deconstruction → System export →
safety-language crisis flow (flag + Under Review + resources) → offline reload.

- `npm run all` — `run-all.js`: CI entrypoint. Starts `serve.js`, runs **every** layer above against
  it (qa, deep, coverage, oracle, chaos, fuzz fresh + qualified, progression), tears the server down,
  and exits non-zero if any layer fails. This is what `.github/workflows/ci.yml` runs.

## Run
```bash
# 1. Install the test dependency (isolated from the dependency-free app root)
cd e2e && npm install && npx playwright install chromium

# 2a. Run the whole suite (starts + stops the server for you)
npm run all

# 2b. ...or run a single layer against an already-running server
node ../serve.js &                 # http://127.0.0.1:4173 (repo root)
npm test                           # or: npm run qa | coverage | oracle | chaos | fuzz | progression
SX_URL=https://your-host/ node deep-playthrough.js   # target another origin
```
Exit code `0` = all checks passed; non-zero prints the failing check(s).
