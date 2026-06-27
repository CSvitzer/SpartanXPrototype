# Spartan X — Verified Feature Spec (observed behavior)

Written 2026-06-26 by **running every feature** (screenshot harness `e2e/shots.js` → `e2e/shots/`,
60 captures phone+desktop) and reading the code. This is the ground-truth "what each feature does"
reference handed to review gates so they critique *real behavior + pixels*, not assumptions.
Screenshot refs are `e2e/shots/<name>.<phone|desktop>.png`.

Core loop: **Claim → Practice → Friction → Reflection → Proof → Standard.** Dependency-free vanilla-JS
PWA, localStorage-only, optional opt-in cloud. Single render model: every action rebuilds `#app`.

## Onboarding (just-in-time)  — shots 01–05
- **Splash** (`01`): wordmark + "Prove it to yourself."; auto-advances to Access.
- **Access** (`02`): "This is not membership / assessment." Primary **Begin Assessment**; ghost "What is
  Spartan X?" and **Restore a backup** (fresh-device import). "Everything stays on this device" notice.
- **Order select → execute → first report** (`03–05`): pick one proof → do it → quick report. On finish,
  `finishOnboarding()` drops the user INTO the app with a first proof (~4 taps). No account wall.
- Deferred one-time **Today cards** (see `11`): safety check (gates first practice), optional claim,
  optional callsign. Default `claim:""`, `safetyChecked:false`.

## Today (home of the loop)  — shots 10–13
- Headline = the **readiness command** ("READINESS IS PRESS"). Metrics grid: Status, Today Standard,
  Active Claim, Reflection Due, Active Days.
- **Rule Engine Assignment** + **Readiness Guidance** (PRESS/HOLD/SCALE/RECOVER with reason).
- Primary **Continue Standard** (gated on `safetyChecked`) + secondary **View Standard**.
- **Next Required Action**, **Progress** (proofs-to-elevate + qualification criteria), collapsible
  Foundation Path / Active Claim / Friction Map (`disclosure()`).
- **Readiness check**: 6 sliders (sleep/energy/soreness/stress/emotional/motivation) + Pain
  none/mild/moderate/severe. Live recompute of the command. Bands verified: PRESS (`12`), RECOVER (`13`,
  severe pain → "Physical intensity disabled").
- Deferred cards state (`11`): safety/claim/callsign prompts shown until handled.

## Practice / Mission  — shot 20
- Practice brief: objective, known threat, standard, minimum, reflection-due, assignment reason.
- **Friction prime** (verified `20`): "<Friction> showed up N× recently. Decide now…" **+ "Try this:"
  response coaching** (per-friction directive). Actions: Begin Practice, Adjust, I Want To Stop, Report
  Pain. Adjust/pause are modals (`61`,`62`).

## Reflection / Debrief  — shot 21
- "NO REFLECTION. NO STANDARD." **6-step stepper** (Result, Friction, Negotiation, Decision, Lesson,
  Correction) shown as full-width tappable jump chips; "Step N of 6". Captures friction intensity.
  Submitting runs the safety language scan + `applyProof` (signs the entry).

## Proof ledger  — shot 30
- Newest-first list with status/result/friction/decision/domain/source + per-entry friction level.
  Domain filter. Hash-chain signed (B4). Empty state prompts how to create proof.

## Standard  — shots 31–32
- **Standard Profile** with the ladder (Untested→Tested→Stabilizing→Baseline→Elevated) and per-domain
  cards (body/mind/will/execution/readiness/integrity) + proofs-to-elevate.
- **Qualification ladder** (Foundation Confirmed → …) with criteria checklist + locked tiers (collapsed).
- **Moving Standard** note. **Graduation card** (`32`): one-time "SEVEN DAYS PROVEN. THE STANDARD NOW
  MOVES." with weakest signal + top friction + claim evidence; **Hold the Standard** ack.

## Modules (11)  — shots 40–43
- Nav list + active module panel. **Phase-B modules are honest "preview"s** (`41–43`): Device Signals,
  Human Review, Benchmarks carry a **"preview" chip**; each module body opens with "Preview · sample
  data" AND a one-line statement of the value it adds toward becoming your best (e.g. Signals → "real
  sleep/strain auto-fills readiness"). Header note explains the preview convention. Locked modules show
  "Foundation Confirmed required". Guide is rule-based real support.
- **Team Standards was CUT (2026-06-27)** — it managed a *group's* aggregate, which has no place in a
  personal app. Removed cleanly (module + function + action + state + tests); fixed a latent bug where
  the Circle module was reading `teams.reflectionRate` (now shows its own check-in count).

## System  — shots 50–53
- **Profile** (callsign), **Safety** (toggle flags any time; crisis/self-punishment/restriction force
  protections; crisis shows **Immediate Support** resources, locale-honest), **Privacy**, **Notifications**,
  **Safety notes**, **Your Report** (local metrics incl. recovery-as-skill), **Data & Backup** (export/
  import/restore + last-good rollback; delete).
- **Cloud (beta)** — opt-in, local-first, off by default:
  - **Off** (`51`): "Cloud sync is off — local-only by default… enable with ?backend=<url>."
  - **Synced** (`52`): Sync now, handle/last-sync, **honest leaderboard** "Community — honest, consistent
    practice (not a verdict)", rows show "<n> proven" (server `provenScore` = activeDays × avgQuality/5),
    subline "Ranked by consistency × honest reflection — not raw volume. It's company, not your verdict.",
    Challenges with Submit.
  - **Protected** (`53`): while a critical safety flag is active, leaderboard + challenges are **hidden**
    ("Community comparison is paused… take care of yourself") — sync still works. Challenge submission is
    also blocked during RECOVER / activity-restriction.

## Modals  — shots 60–65
- About (`60`), Adjust practice (`61`), Pause/stop (`62`), Data & Backup/export (`63`), Report (`64`),
  **Pain-downgrade guard** (`65`): lowering severe→none warns "Under-reporting pain can hide an injury";
  **Keep Severe is the primary button**, "Lower it anyway" secondary.

## Integrity & safety systems  — shots 70–71
- **Integrity banner** (`70`): a tampered/edited ledger entry (hash mismatch) surfaces an honest
  "integrity check failed" banner (`verifyLedger`, per-entry content-addressed).
- **Crisis resources** (`71`): a crisis flag forces protected status + shows Immediate Support.

## Cloud architecture (Phase-B, mock-proven)
- Lossless CRDT cross-device sync (`mergeLedgers`, set-union by hash); server re-verifies the B4 hash
  (anti-cheat); cloud failure never blocks the offline app. Tested e2e (`phaseb.js`, 13 checks) against a
  real mock backend (`mock-backend/server.js`). Production hosting/auth/persistence = real Phase B.

## Known visual nit (found this pass)
- Desktop sidebar: the Pain button row can clip "SEVERE" in the narrow column (phone is a clean 2×2). Low
  priority (mobile-first PWA) — flagged for the UI gate to confirm via `10-today.desktop.png`.
