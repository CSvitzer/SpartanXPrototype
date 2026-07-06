# Gap-Close Plan — turning the fresh-eyes criticism into the app's favor (2026-07-05)

Source: FRESH_EYES_REVIEW.md (4 unprimed opus gates + Fable). Scope: close every gap that is
closable client-side WITHOUT betraying the soul (no streaks, no dark patterns, no backend, Spartan
voice kept). Everything oracle-safe: the 5 swept pure fns stay byte-identical; new entry fields stay
off the B4 hash canon.

## 1. Research notes (verified before planning)
- `updateStandardsFromProof` counts any `source !== "module"` proof toward elevation → a quick-log
  would leak into elevation. Fix requires `reflected = (source === "reflection")`. The function is
  NOT oracle-swept (only computeReadiness/scoreDebrief/qualityLabel/standardEffect/nextStandardLevel
  are) → safe to tighten, and behaviorally identical for all existing sources.
- `submitDebrief`: quality<2 → "Incomplete". Quick close must NOT route through scoreDebrief — it is
  its own honest path (status "Accepted", quality 1, source "quick") so standardEffect (called, not
  changed) yields "Standard held" and elevation never counts it.
- Scheduled push without a server is NOT reliably possible in a PWA (Notification Triggers API is
  dead; SW push needs a server). The honest client-side "day-2 pull" = a downloadable recurring
  **calendar event (ICS)** built from `settings.reminderWindow` ("18:00-21:30" format verified) — the
  OS reminds, we stay serverless. No fake "reminders" UI.
- `choosePracticeAssignment`/`overloadFor` are not swept → the floor can be driven by a user-logged
  number safely. New state (`domainBest`) is outside the hash canon.
- Readiness sliders persist in `state.readiness` → a "Same as yesterday — confirm" one-tap is pure
  UI; `computeReadiness` untouched.

## 2. Tasks  (all app.js edits [S]; docs/tests follow each)

### GAP A — Ceremony inversion (all 4 gates) → "Quick close" + one-tap readiness
- **A1 [S] Quick close.** After completing a practice: choice "Quick close" (default) vs "Full
  reflection". Quick close = ONE screen: result (Clean/Scaled/Miss — same buckets as the prediction,
  which auto-scores calibration) + one friction tap + optional one-line note. Creates an honest proof:
  `status:"Accepted", quality:1, source:"quick"` → "Standard held", chain alive, activity counted,
  prediction scored. ~15 seconds.
- **A2 [S] Elevation stays reflection-only (mechanical doctrine).** `reflected = source==="reflection"`
  in updateStandardsFromProof. Copy on the quick-close screen: "Logged. The standard only moves
  through full reflection — do one when it matters."
- **A3 [S] One-tap readiness.** If a readiness check exists from a previous day: show the computed
  command + "Same as yesterday" (one tap, records today's snapshot) / "Adjust" (expands sliders).
  computeReadiness byte-identical; recordReadinessSnapshot reused.
- **A4 [S] Debrief prompt cadence.** Today nudges a FULL reflection when it matters (first practice,
  a Miss, pain reported, ~weekly since last full) — one quiet line, never a guilt loop.

### GAP B — Language outruns substance (honesty bug) → measure one real thing + trim overclaims
- **B1 [S] Logged result (the trainer's fix).** Optional numeric field at close ("What did you do —
  minutes/reps?") stored on the proof (non-hashed) + per-domain `state.domainBest`. The Continued-
  Standard floor becomes `max(ladder floor, your last logged number)` with copy "Beat your last: 7 min".
  Overload becomes literal: beat YOUR number, not a text multiplier. (Self-reported, and SAID to be —
  "your own logged number", no false objectivity.)
- **B2 [S] Honesty pass on copy.** "Progressive overload" → "Rising floor" where unmeasured; About
  "human capability forge" → matches reality ("a discipline system: you choose the work, it holds the
  standard"); one line under the readiness command: "computed from your own check-in." Spartan VOICE
  stays — only claims that outrun the code are trimmed.

### GAP C — No day-2 pull → honest, serverless reminder
- **C1 [S] "Add to calendar" (ICS).** One button in Reflection Window panel: downloads a recurring
  daily VEVENT at the window start with a 0-min alarm ("Spartan X — the standard waits"). OS does the
  reminding; zero backend, zero tracking, fully honest. Panel copy updated (no longer "no reminders
  yet" — now: "reminders via your calendar, on your terms").

### GAP D — Permanence vs localStorage → backup nudge
- **D1 [S] Auto-backup prompt.** At every 10th proof (and before reset), one quiet line on Today:
  "20 proofs in your archive — save a backup" → one-tap download (existing exportPayload). Dismissable,
  never nags twice for the same milestone (`lastBackupNudgeAt` count in state, non-hashed).

### GAP E — Zero humans → test protocol (doc, not code)
- **E1 [P] HUMAN_TEST_PROTOCOL.md.** 5 users × 2 weeks: who to recruit (2 from the discipline niche,
  2 ordinary "want to be better", 1 skeptic), what to measure (day-9 survival, quick-vs-full ratio,
  which screen they quit on, unprompted words they use), and the 6 questions to ask at day 14. The
  recruiting/running is the owner's — the protocol makes it executable.

### Verify + gate + ship  [S]
- qa tests per change (quick-close proof shape; elevation excludes quick; one-tap readiness snapshot;
  domainBest floor; ICS blob; backup nudge; copy assertions). Full 15-layer pipeline — oracle MUST
  stay 12,596/0. Regenerate shots; eyes-on the new close screen + Today. 3 opus gates: trainer
  re-gate (does B1 earn the respect-raiser?), ethos/safety (A2 copy, D nudge non-naggy), determinism.
  Commit + deploy per batch.

## 3. Failure modes
- **Quick close becomes the everything-path → reflection dies.** Mitigation: A2 (no elevation without
  reflection) makes depth *pay*; A4 nudges at meaningful moments; watch the quick:full ratio in the
  human test (E1) — if >90% quick, the cadence needs tuning, not coercion.
- **A2 tightening breaks existing tests** that create proofs with other sources and expect elevation.
  Mitigation: grep tests for source values before editing; adjust seeds to source:"reflection".
- **B1 invites junk numbers** (self-report inflation). Mitigation: copy frames it as self-honesty
  ("your number, your word"); it only raises the user's OWN floor — inflating it punishes only them.
- **ICS timezone/format quirks** (Outlook vs Google vs Apple). Mitigation: minimal RFC5545 VEVENT,
  floating local time, RRULE:FREQ=DAILY; test import in at least two clients manually.
- **Oracle regression** via accidental touch of swept fns. Mitigation: no edits inside the 5; pipeline
  gate; determinism re-gate.
- **Voice erosion in B2** — trimming overclaims must not flatten the brand. Mitigation: ethos gate
  reviews the copy diff specifically.

## 4. Approval checklist (owner)
1. **A: Quick close as DEFAULT** (full reflection optional, elevation reflection-only) — ok?
2. **B: Measured floor (log a number, beat your number) + trim only overclaiming copy, voice kept** — ok?
3. **C: Calendar-based reminders (ICS)** instead of fake in-app reminders — ok?
4. D (backup nudge every 10 proofs) + E (human test protocol doc) — assumed yes unless objected.

## 5. Explicitly NOT doing (with reason)
- Gutting the Spartan voice (cold-user "LARP" complaint) — it's the brand the owner chose; B2 fixes
  the *dishonest* part (overclaims), not the flavor. Revisit only after human-test data (E1).
- Streaks/stakes/social to "solve" day-2 — evidence says streaks harm long retention; stakes (the
  Stake/Beeminder path) is a separate, regulated venture decision.
- The investor's ledger-as-credential pivot — a business decision, parked in FRESH_EYES_REVIEW.md.
- Real push notifications — requires a server; ICS is the honest ceiling client-side.
