# Spartan X — Action Backlog (P0 / P1 / P2)

Compiled 2026-06-22 from the full audit, usage audit, persona review (UX/UI designer, tester,
end user), and the PRD §6 production boundary. Status of the prototype: feature-complete and
test-covered (qa.html 46 · e2e deep 37 · coverage 31/68 actions · progression to Spartan).
This backlog is what remains to make it safely shippable and then a real product.

Priority key: **P0** = blocker before real users touch it · **P1** = important quality/robustness
near alpha · **P2** = later / polish / production (Phase B).

---

## 8-gate feature review (2026-06-26) — outcomes

Ran 8 expert gates (UI, Stoic, Spartan, Trainer, Top-1%, Fitness-product, Security, Performance) over
every feature; verified each finding in code before acting (most gates ran on haiku — several misreads
discarded). **Shipped this round** (all verified, tested, pipeline-green):
- ✅ **Vulnerable-user protection** — `renderCloudPanel` hides the leaderboard + challenges while a
  critical safety flag is active (sync still works). 5 gates converged on this.
- ✅ **Safety over competition** — `cloudCompleteChallenge` blocked during RECOVER / activity-restricting
  flag (can't grind the board through recovery).
- ✅ **Leaderboard = honesty-weighted + non-verdict framing** — mock `provenScore` = activeDays × (avgQuality/5);
  copy reframed to "company, not your verdict" (resolves the Stoic dichotomy-of-control tension while
  keeping the competition the owner asked for).
- ✅ **Simulated-module honesty** — signals/review/benchmarks/teams carry a "simulated" chip + header note.
- ✅ **Slider render-storm fix** — `scheduleRender()` rAF-coalesces drag bursts (the 0–100 benchmarks
  slider was the real storm); state + live value update synchronously so tests are unaffected.

**Discarded after verification:** XSS (all sinks escaped — clean); "harden the mock backend"
(predictable token is an *intentional* test affordance; weak fnv1a / CORS\* / rate-limit belong to the
real Phase-B backend, below); caret-loss (text inputs use `saveState`, not `render`).

## Engine fix (2026-06-26) — progressive overload (Moving Standard now moves the WORK)

The post-Foundation "Continued Standard" used a FIXED generic prescription ("Minimum practice in
{domain}") regardless of the domain's level — so the Moving Standard moved only the *label*, not the
work. **Fixed:** `OVERLOAD_LADDER` (5 rungs) + `overloadFor(domain)` scale standard/minimum/objective
with `levelIndex(state.standards[domain])`; each rung resolves to a **concrete base practice**
(`DOMAIN_BASE_PRACTICE`) so it's executable (e.g. "2 min controlled movement — 1.5× (more reps/minutes)").
Also: DEFAULT `standards.will` "Under Review" → "Untested" ("Under Review" is an EARNED hold, not a
cold-start default — was faint shaming).
**Oracle-safe** (choosePracticeAssignment isn't oracle-swept; tests assert name/domain, not the
prescription text → 12,596/0 preserved). Approved by **3 opus gates** (safety / top-1% / ethos):
overload is the last branch so it can't override recovery; high rungs are earned + auto-demote on
failure (Regressed → base rung); language earned/internal-locus. qa 87. Remaining follow-up: per-domain
base-rep *numbers* (the base is now concrete text; a numeric table would let "1.5×" compute exactly).

## OPUS gate rerun (2026-06-26) — gates are validators → run sonnet/opus, never haiku

Reran the 7 experience gates + security on **opus** (the prior pass was haiku-forced and noisy). Opus
closed every haiku false alarm with computed evidence (e.g. --ash = 7.10:1, passes AA) and found real,
code-grounded issues. **Shipped (verified + tested):**
- ✅ **Overtraining detector starvation [P0 safety]** — `recordReadinessSnapshot()` ran only in
  `submitDebrief`, so daily readiness check-ins never fed `hasOvertrainingRisk` (needs ≥3 history). Now
  the readiness slider `change` records an **upsert-by-day** snapshot; PRESS-stability now compares prior
  DAYS. Oracle-safe (clean-state sweep has empty history).
- ✅ **Client verifies server ledger [security]** — `cloudSync` filtered server entries through
  `proofSignatureValid` (mirror of server anti-cheat) + fills only remaining room → a hostile `?backend=`
  can't inject forged proofs or evict local ones.
- ✅ **`:focus-visible` everywhere [a11y]** — dark-theme had no visible keyboard focus (axe can't detect
  its absence; WCAG 2.4.7). One CSS rule, --amber 8:1.
- ✅ **Stoic: "proof #3 is mastery" → "a pattern; the standard never finishes moving"** (kills the
  arrival/identity claim that contradicted the app's no-verdict spine).
- ✅ **Export strips `cloud.token`** (a shared backup must not leak the sync credential).
- ✅ **Notifications panel made honest** ("does not send push reminders yet — Phase B"); retitled
  "Reflection Window" (it implied a working push feature).
**Discarded:** all haiku false alarms (--ash contrast, slider labels, pain-modal buttons). Tests: qa 82→86.

## Visual gate pass (2026-06-26) — screenshots + verified spec

Built `e2e/shots.js` (60 screenshots, phone+desktop, every feature/state → `e2e/shots/`, gitignored)
and `FEATURES.md` (verified per-feature behavior spec). Did an eyes-on review myself, then re-ran 7
experience gates with the **screenshots + spec** as input (real visual+behavior review, not code-only).
**Shipped (verified, tested):**
- ✅ Desktop pain-row clip — `.pain-options` now 2×2 everywhere ("SEVERE" was clipping in the narrow
  desktop sidebar; 3 gates + my own eyes confirmed).
- ✅ Honesty reinforced — modules note adds "Your readiness uses only your manual check-ins."
- ✅ Challenges hidden during RECOVER (consistency with the existing submit-block).
- ✅ RECOVER copy sharpened to "recovery is the standard … discipline, not retreat."
**Discarded after verification:** `--ash` contrast "fail" (computes ~7:1, axe passes — haiku hallucinated
3.1:1); slider value labels "missing" (they're shown); pain-modal buttons "identical" (primary vs ghost
are visually distinct — confirmed in `65-modal-pain-downgrade`); **"Powered by" reframe of simulated
modules — REJECTED (would be deceptive; violates the app's honesty principle).**
Tests: qa 81→82 (+challenges-hidden-during-recovery). Regenerate shots with `cd e2e && npm run shots`.

**Deferred — engine refinements (need oracle-safe implementation, not yet done):**
- Beginner pressure-load default + escalation ladder (Trainer).
- Readiness gate on Continued-Standard domain escalation (Trainer).
- Chronic single-marker (sleep-debt) overtraining detection (Trainer).
- Debrief-quality depth (length ≠ depth) + friction-type-gated qualification (Top-1%).
- Calibration-plateau nudge; friction-resilience leading indicator (Top-1%).
- Friction-pattern-gated standard elevation — hold elevation if the same friction repeats ≥2× in the
  last 3 domain proofs (Top-1%, highest-leverage of the batch).
- Readiness-completeness gate before "Continue Standard" unlocks the full standard (Trainer).
- RECOVER "practice blueprint" (3 zero-intensity recovery targets) instead of a lockout (Top-1%).
- Qualification velocity badges (on-pace / behind) on Today progress (Top-1%).
- Graduation 1-sentence commitment input before ack (Top-1%).
- ✅ **DONE — Progressive overload on the minimum** (2026-06-26): floor now rises with the level via
  `OVERLOAD_LADDER`/`overloadFor` + concrete `DOMAIN_BASE_PRACTICE`. Follow-up: numeric base-rep table.
- **Pre-practice prediction → calibration loop** — call your result before practice, compare at debrief,
  surface a calibration score; upgrades `scoreDebrief` from presence-check to honest self-assessment
  (Top-1%, opus — net-new, touches the oracle-swept scoreDebrief, needs care).
- Report-Pain mid-practice floor: a dedicated in-session pain report from "none" only reaches moderate
  (SCALE), not RECOVER — consider routing it through the injury scan (Trainer, opus — judgment call).
- Default `standards.will` is "Under Review" (a status that elsewhere means a safety/integrity hold) at
  cold start — consider "Untested"/"Forming" so it's only ever earned (Spartan, opus — verify no oracle/
  test ripple from the DEFAULT_STATE change).
- Debrief stepper: on mobile the 6 full-width jump-chips push the input below the fold — consider a
  compact "step N of 6" progress bar + jump disclosure (UI, opus).
- Share a verified proof / graduation via `navigator.share` (text-only, honest; the B4 hash makes a
  shared proof defensible) — the only organic-acquisition surface (Fitness, opus).
- Real opt-in local reminders (Notification API + SW); full push is Phase B (Fitness, opus).

**Phase-B security hardening checklist (for the REAL backend, not the mock):** cryptographically random
tokens + expiry/refresh; replace fnv1a tamper-evidence with HMAC-SHA256 per-user signatures; rate-limit
`/api/auth` + `/api/sync`; restrict CORS to the production origin; depth-cap `deepMerge`.

---

## P0 — Blockers before giving it to a real user

1. ✅ **DONE — Data-loss safeguard (highest end-user risk).** Data & Backup modal now offers (a) a
   clear "your data stays on this device" notice (in the modal + System tab), (b) real **export to
   file** (`download-backup` → timestamped `.json` blob), (c) **import/restore** from file with
   validate→confirm (`applyImportText` + `confirm-import`/`cancel-import`). Layered on B5 last-good
   rollback. Tests: 6 in qa.js + full-coverage S13b.
2. ✅ **DONE — "Local-only" clarity at signup.** `renderAccountCreation` now shows a plain notice:
   "This is a local prototype — nothing is sent anywhere… don't enter a real password." Test:
   `testSignupLocalOnlyNotice`.
3. **Crisis-path integrity (safety domain).** Ensure a crisis-flagged user always sees unmissable,
   accurate emergency guidance and can never be pushed toward escalation. Current resources are a
   static placeholder (112/999/911 + findahelpline + 988) — acceptable for prototype only if it is
   prominent and honest; verify it shows on every relevant surface. (Region-verified directory = P2.)
4. ✅ **DONE — Deploy on HTTPS + real icons.** Added PNG icons `icon-192/512/180.png` (rasterized
   from `icon.svg` via `e2e/gen-icons.js`), wired into `manifest.webmanifest` (192 + 512 any +
   512 maskable) and `apple-touch-icon` (180). serve.js now sends `image/png`; `sw.js` precaches the
   PNGs (cache bumped v2→v3). Wrote `DEPLOY.md` (GitHub Pages / Netlify / Cloudflare; HTTPS rationale;
   per-deploy cache bump; verification + honest limits). Verified: icons serve `image/png 200`,
   manifest valid (4 icons), chromium offline install 37/37.

## P1 — Important quality & robustness (near alpha)

5. ✅ **DONE — Today progressive disclosure.** Foundation Path / Active Claim / Friction Map collapsed
   behind `<details class="disclosure">`; primary CTA moved above the fold; mobile metric-grid made
   compact 2-col (was 1-col tall cards). Verified at 390px. Tests use `openDisclosures()`.
6. ✅ **DONE — Access-rail logic fix.** `renderRail` shows Status/Readiness/Active Claim meta only
   after `onboardingComplete` — no premature placeholder claim.
7. ✅ **DONE — Harden safety-language scan.** Broadened crisis/restriction/injury patterns, added a
   `self-punishment` category, and (gap fix) Today now shows support resources for ANY critical flag.
8. ✅ **DONE (A6) — Accessibility audit (axe-core).** `e2e/a11y.js` WCAG2A/AA across 9 screens +
   keyboard/focus-retention; fixed `aria-selected`→`aria-current` and focus-restore on re-render.
9. ✅ **DONE (stable variant) — Visual layout-sanity layer** (`e2e/visual.js`, `npm run visual`): 4
   widths × 8 screens assert no horizontal overflow / rendered / tab bar in viewport. Chose this over
   flaky golden-image pixel-diffs. 96 checks. (Golden-image diffing still intentionally avoided.)
10. ✅ **DONE — Multi-tab / storage concurrency.** `syncFromStorage()` + top-level `storage` listener
    adopts another tab's state (equality-guarded to converge), preventing last-write-wins clobber.
11. ✅ **DONE — Dampen the desktop hero-rail** after onboarding (compact rail, hero removed).
12. **Real-device smoke test.** Manually verify install + offline on iOS Safari and Android Chrome
    (only headless Chromium tested so far).

## Expert sanity-check (2026-06-23) — 6 lenses (UI, Stoic, Spartan mentality, trainer, top-1%, fitness-product)
**Verdicts:** UI PASS · Stoic PASS · Spartan PASS · Trainer CONCERNS · Top-1% CONCERNS · Product PASS(alpha).
**Fixed same day (verified in code + tests):**
- ✅ Injury/medical/pain safety flags were INERT (gated nothing) → now `hasActivityRestrictingFlag()`
  forces RECOVER for any flag. (`computeReadiness`)
- ✅ Safety flags couldn't be changed after the one-time card (permanent lock, no injury reporting) →
  added a **System → Safety** panel (set/clear anytime) + shared `SAFETY_OPTIONS`.
- ✅ Crisis resources were US-centric (988) → locale-honest copy (local emergency number + global
  findahelpline; 988 marked US-only).
- ✅ Progress invisible (Standard tab only) → **renderTodayProgress** shows weakest-domain elevation +
  next qualification tier met/total on Today.
**Owner decisions — RESOLVED (went with recommendations, gate-verified):**
- ✅ Brand: kept the Spartan rank ladder; reframed only the external-validation drift — tagline
  "Prove that you belong" → "Prove it to yourself" (internal locus). Stoic gate: concern CLOSED;
  Spartan gate: ethos INTACT (judge shifts system→self).
- ✅ Pain severe→down: kept SOFT (no hard latch, per prior decision) but added an explicit
  injury-masking warning + made "Keep severe" the primary/default button. Trainer gate: addressed;
  residual is honest-report misuse by design. (Supersedes P2 #13.)
**Deferred enhancements from review (added to P2 below):** recovery-as-skill credit + recovery
modules; Foundation graduation moment; pre-mission friction prompt; broaden overtraining detection
(volume/frequency, `activeDays` unused); PRESS stability (require 2 good polls before RECOVER→PRESS);
375px tab-label sizing; off-device push (retention).

## P2 — Later / polish / product decisions / production (Phase B)

### Product / UX polish
13. ✅ **RESOLVED — RECOVER/pain latch decision.** Kept soft (no hard latch); strengthened severe
    downgrade with an injury warning + safe-default button. See the expert sanity-check section above.
14. ✅ **DONE — Reflection stepper chips are tappable** (debrief-jump, any direction). "Quick
    reflection" mode still optional/open.
15. ✅ **DONE — Collapse locked qualification tiers** behind a "Locked tiers (N)" disclosure on Standard.
16. ✅ **DONE — Continue Standard copy** — now names the weakest domain + next-step progress note.
17. ✅ **DONE — Input robustness** — `maxlength` on all free-text inputs (reflection 1000, notes
    600, check-in 500, callsign 24) + a 2MB guard in `applyImportText`. Escaping + quota already verified.
18. **Timezone/DST correctness** for `activeDays` — *largely handled* (UTC ISO-date keying via
    `toISOString().slice(0,10)`, validated by clock-fuzz). Local-vs-UTC day boundary is the only nuance.
19. ✅ **DONE — Moving Standard depth** — Regressed→rebuild guidance surfaced via `standardProgressNote`;
    real per-proof **friction intensity** now captured (`debrief.frictionLevel` → `proof.frictionLevel`,
    shown in the ledger) instead of the AAR-quality proxy.

### Expert-review enhancements — shipped (P2 + engine batch, 2026-06-24)
- ✅ **Pre-mission friction prime** (`renderFrictionPrime`) — names a repeating friction on the brief.
- ✅ **Foundation graduation moment** (`renderGraduationCard`) — one-time identity card at Confirmed.
- ✅ **Broadened overtraining detection** (`hasOvertrainingRisk`) — sustained multi-marker load.
- ✅ **375px tab-label sizing** (0.56rem → 0.7rem, padded).
- ✅ **PRESS stability** (`readinessRecoverLevel` + history gate in `computeReadiness`) — a strong
  check straight out of recovery holds at HOLD; a second confirms PRESS. **Oracle-safe** (history-gated,
  clean-state sweep unchanged → 12,596/0 preserved).
- ✅ **Recovery-as-skill credit** — Recover decisions counted + shown as a skill in the report
  (`computeReport.recoveryProofs`); they were already Accepted proofs, now visibly credited.
- **All engine changes kept the oracle-swept pure functions' clean-state behaviour identical** (new
  behaviour layered on history/new fields), so the differential-oracle determinism guarantee survives.

### Production infrastructure (PRD §6 — turns prototype into product)
20. Backend + PostgreSQL (the §6 16-table schema); API.
21. Real auth: password hashing, login, reset, email verification, account recovery.
22. Cross-device persistence / sync (removes the P0 data-loss risk structurally).
23. Payments.
24. Real integrations: wearables, AI personalization, expert review, team/enterprise, social graph.
25. **Region-verified crisis-resource directory** (productionizes P0 #3).
26. Production privacy/consent, data export & deletion guarantees; push notifications.

### Phase B — ARCHITECTURE BUILT + PROVEN against a real mock backend (2026-06-25)
A real, opt-in, local-first cloud layer now exists and is tested end-to-end (`npm run phaseb`, 13/13)
against a running **mock backend** (`mock-backend/server.js`). What's PROVEN:
- ✅ **Lossless cross-device sync** — `mergeLedgers` does a CRDT-style **set-union by hash** of the
  append-only, content-addressed proof ledger → no last-write-wins data loss (fixes the FP-TW-SYNC-UNION
  class of bug by design). Proofs carry a sortable `at` timestamp for ordering.
- ✅ **Server-side anti-cheat** — the mock backend re-verifies the SAME B4 hash per proof and rejects
  forged entries. (`verifyLedger` relaxed to per-entry, content-addressed — CRDT-merge-safe.)
- ✅ **Opt-in + local-first** — off by default (`state.cloud.url` empty); enable via `?backend=<url>` or
  System → Cloud. Cloud failure NEVER blocks the offline app (verified).
- ✅ **Leaderboard + challenges** — honest-metric leaderboard; challenges evaluated by the same rule.
**Still real Phase B (NOT done — needs production infra, not fakeable client-side):** hosting,
real auth/persistence (#21), payments (#23), real third-party integrations (#24). The mock proves the
contract; production is a deploy + a real server implementing the same API.

Vision: compete with others, run challenges. Identity groundwork is already in place — the optional
**callsign** (local now) becomes the seed for a real account at signup.
27. **Real account = upgrade the local callsign.** At first sync, claim the callsign as a handle and
    bind it to a real auth account (#21). The local-only prototype deliberately has NO email/password
    (that would be fake) — the account screen returns only when there is a server to authenticate
    against. Migrate existing local data up via the existing export/import bridge.
28. **Sync the proof model (#22).** The proof ledger, standards, Moving-Standard levels, and
    qualification ladder are already structured, deterministic, and tamper-evident (B4 hash chain) —
    ship them to the server as the canonical record. The hash chain doubles as anti-cheat for
    submitted proofs (server re-verifies; client-only is evident-not-secure, server makes it real).
29. **Leaderboards.** Rank by the existing honest metrics (active days, reflection quality, tier
    reached, under-review rate) — NOT vanity. Per-domain and per-cohort boards. Privacy-first opt-in.
30. **Challenges.** Server-defined, time-boxed challenges (e.g. "7-day no-mood streak", "RECOVER
    obeyed 3×") evaluated against the same rule engine the prototype already runs, so scoring is
    consistent client/server. Local solo challenges (#below) are the offline subset.
31. **Anti-gaming for competition.** Server-side proof verification, rate limits, readiness/ safety
    interlocks preserved (a flagged user is never pushed to compete), and the safety gate stays
    non-bypassable. Reuse `checkInvariants` + `verifyLedger` server-side.

> Local subset doable without backend (if wanted before Phase B): personal/time-boxed solo
> challenges + shareable challenge *definitions* via export/import codes. "Compare against others"
> is the part that strictly needs the server.

---

## Suggested execution order
P0 (1→4) makes it safe and distributable as an alpha. P1 (5→12) makes it solid and trustworthy.
P2 #13–19 is product polish you can do anytime; #20–26 is the separate Phase-B build where this
prototype becomes the spec.
