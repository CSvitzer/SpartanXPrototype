# Spartan X — Action Backlog (P0 / P1 / P2)

Compiled 2026-06-22 from the full audit, usage audit, persona review (UX/UI designer, tester,
end user), and the PRD §6 production boundary. Status of the prototype: feature-complete and
test-covered (qa.html 46 · e2e deep 37 · coverage 31/68 actions · progression to Spartan).
This backlog is what remains to make it safely shippable and then a real product.

Priority key: **P0** = blocker before real users touch it · **P1** = important quality/robustness
near alpha · **P2** = later / polish / production (Phase B).

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

### Phase B — Community, challenges & leaderboards (requires a backend; cannot be done client-only)
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
