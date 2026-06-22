# Spartan X Prototype — Audit & Source-Document Conformance

Audit date: 2026-06-21. Scope: full review of the dependency-free browser prototype
(`app.js`, `serve.js`, `qa.js`, `styles.css`) against its own coverage docs **and** the
two Word source documents (`Spartan X Master PRD v3.0.docx`, `Spartan X Design Document.docx`).

All findings below were verified directly in source. Behavioural changes are locked by the
browser QA suite (`qa.html`), which passes **22/22 headless**.

---

## 1. Verdict

A coherent, internally-consistent, honestly-scoped prototype that now backs its own claims
with passing tests. It proves the product **mentality and mechanics**. It is **not** a product:
no backend, no real auth, persistence is `localStorage`, and Guide/Review/Teams/Wearables/
Benchmarks are deterministic simulations (the docs say so).

The biggest pre-audit risk — that the "stoic *proof* system" thesis was a façade (standard
advanceable by clicking module buttons, bypassing reflection and safety) — is **closed in code
and locked by tests**.

---

## 2. Findings & fixes

Severity is calibrated for a **local, single-user prototype**.

| # | Finding | Sev | Status | Location |
|---|---------|-----|--------|----------|
| 1 | Module proofs auto-Accepted, bypassing safety + reflection; standard advanceable by clicking | HIGH | **Fixed** | `recordModuleProof`, `updateStandardsFromProof`, `standardStageIndex` |
| 3 | Safety language scan brittle (8 literal phrases) | MED | **Fixed** (word-boundary patterns; sets crisis/restriction/injury) | `applySafetyLanguageScan` |
| 5 | Prototype pollution via `deepMerge` (`__proto__`) | MED | **Fixed** | `deepMerge` |
| 6 | Unbounded `proofLedger`; `saveState` no quota guard | LOW | **Fixed** (cap 200 + try/catch) | `recordModuleProof`, `submitDebrief`, `saveState` |
| 7 | Non-deterministic targeted-practice tie-break | LOW | **Fixed** (secondary sort) | `dominantHighFriction` |
| 8 | Foundation day index silently resets to Day 1 on bad state | LOW | **Fixed** (clamp) | `setPracticeForDay` |
| 9 | PRESS ignored stress/emotional load | LOW | **Fixed** (PRESS gated by `!stressFlag`) | `computeReadiness` |
| 10 | `serve.js` path guard missing trailing separator | LOW | **Fixed** | `serve.js` |
| 2 | Protected pain state escapable in one tap | MED | **Soft fix** — confirmation modal on downgrade (not a hard lock) | `setPain`, `renderPainDowngradeModal` |
| #3 | No state schema version → risky migration | — | **Fixed** (`STATE_VERSION`, reset on mismatch) | `loadState` |
| #4 | `motionReduced` toggle unwired; touch targets 38–40px | — | **Fixed** (class wired; 44px) | `render`, `styles.css` |
| #5 | Crisis flag showed only static copy, no real resources | — | **Fixed** (`renderCrisisResources`: emergency numbers + findahelpline.com/988) | safety gate + Today |

### Corrected during audit (do not re-report)
- **"Critical CSV XSS"** (an automated agent) — **false positive**. `item.type` is escaped at the
  sink (`escapeHtml(mix)`, and `escapeHtml(item.type)` in preview). XSS surface is clean throughout.
- **"Dead safety flags `self-punishment`/`injury`/`pain`/`medical`"** — **false positive**. The
  Safety Gate (`renderSafetyGate` / `toggle-safety`) sets all six flags; `hasCriticalSafetyFlag`
  and `safetyMessage` are fully reachable. Only the *free-text scan* was narrow (addressed in #3).

### Verified solid (no change needed)
XSS escaping consistent at all sinks; zero forbidden naming terms (grep-verified); all 12 modules
real & stateful (QA-verified); timer has no interval leak; readiness bands are total & non-overlapping.

---

## 3. Conformance to the Word source documents

Two sources, with a deliberate relationship: the **PRD** specifies a military-toned system; the
**Design Document ("Stoic Standard Minimalism")** explicitly reinterprets that tone for the UI
(§10.1 nav, §14.3 renames). The prototype follows the **Design Document** — this is a documented
pivot, not drift.

### 3.1 PRD — Rule Engine (§5) fidelity

| PRD rule | Prototype | Verdict |
|----------|-----------|---------|
| §5.2 Readiness RECOVER/SCALE/HOLD/PRESS conditions | `computeReadiness` | **Exact** (PRESS is *stricter*: also blocks on high stress — intentional, finding #9) |
| §5.5 Proof: Accepted/Incomplete/Under Review/Rejected | `standardEffect`, `submitDebrief` | **Exact** |
| §5.6 AAR quality 0–5 (+1 each), labels, `<2 ⇒ no elevation` | `scoreDebrief`/`qualityLabel` | **Exact** |
| §5.7 Dominant friction over 7 days, 3+ ⇒ targeted | `dominantHighFriction`/`targetedPracticeForFriction` | **Match** |
| §5.9 Moving Standard states + elevation ladder | `standards` | **Partial** — has Untested/Tested/Stabilizing/Forming/Under Review; **missing Baseline/Elevated/Regressed** and the "completed 3× ⇒ elevate" ladder |
| §5.10 Qualification (Recruit→Candidate→Operator→Spartan) | Foundation Confirmed + Advanced module | **Partial / simulated** — full multi-tier gating (21 days, 15 AARs, adherence %) not implemented |
| §5.11 Safety Sentinel (self-harm + ED phrase lists, overtraining) | scan + `hasOvertrainingRisk` | **Match+** on language (extended); overtraining detection **partial** |
| §6 Database schema v1 (16 PostgreSQL tables, UUIDs) | `localStorage` | **Not implemented** — explicit production boundary |
| §3.1 Function map (MVP 1–16, V1 17–22, V2 23–27) | All present (V1/V2 as simulations) | **Exceeds MVP breadth** |
| §4.9 Account consent (two statements) | One combined checkbox | **Minor deviation** (covers both intents) |

### 3.2 Design Document fidelity

| Design spec | Prototype | Verdict |
|-------------|-----------|---------|
| §10.1 Nav: TODAY/MISSION/DEBRIEF/PROOF/STANDARD | `TABS` + `TAB_LABELS` | **Exact** |
| §14.3 Stoic renames (Today/Debrief/Proof Ledger/Standard/Readiness) | matches | **Exact** |
| §7 Color system (obsidian #08090A, bronze accents) | theme + palette | **Aligned** |
| §20 Anti-cringe (no military cosplay/XP/badges/ranks) | grep-clean | **Compliant** |
| §19 Accessibility: contrast / 44px / color-independent / reduced motion / step AAR | fixed 44px + wired reduced-motion + label-based; **step-by-step AAR not done** (Design says "consider") | **Mostly compliant** |
| §5.4 One action per screen | mostly (Today has 2 CTAs) | **Acceptable** |

### 3.3 Net deviations from the documents
1. **Naming** PRD-military → stoic — *deliberate* (Design Doc + PRODUCT_DIRECTION).
2. **Moving Standard** simplified (no Baseline/Elevated/Regressed; no 3× elevation ladder).
3. **Qualification ladder** simplified/simulated (no Candidate/Operator/Spartan gating).
4. **Persistence** `localStorage` vs PRD's PostgreSQL schema — production boundary.
5. **Consent** two statements merged to one.
6. **AAR** single form vs Design's optional step-by-step.
7. **PRESS** stricter than PRD (stress gate) — intentional safety lean.

**Conformance verdict:** HIGH on the core loop, rule engine, safety model, and design language;
PARTIAL on progression/qualification depth; production infrastructure intentionally absent.

---

## 4. QA

Browser suite `qa.html` (run headless via Playwright): **22/22 pass**, no console/page errors.
Includes 9 new tests added during this audit covering: module-proof safety gating, evidence-only
standard movement, PRESS-under-stress, deepMerge proto guard, tie-break determinism, state-version
reset, pain-downgrade confirmation, crisis resources, and reduced-motion class.

---

## 5. Next steps

**Product-direction decisions (owner):**
- Whether to escalate #2 from soft acknowledgment to a hard latch.
- Validate the loop with 5–10 real users (the open question is behavioural, not technical).

**Prototype hardening (cheap):**
- Implement full Moving Standard states + qualification ladder to reach PRD §5.9–5.10 parity.
- Optional step-by-step AAR (Design §19.5 / §12.14).

**Before any "production" claim (PRD §6 + coverage doc):**
- Backend + auth + password hashing; payments; real wearable/AI/review integrations.
- **Region-verified crisis-resource directory first** — the safety domain demands real help, not
  static copy (the current panel is a prototype-level placeholder pointing at findahelpline.com/988).

---

## 6. Phase A build — COMPLETED (2026-06-21)

All seven Phase A waves shipped and QA-locked. Suite grew 18 → **37 tests, all passing headless**.
The previously "Partial" conformance items are now closed:

| Wave | What shipped | Closes |
|------|-------------|--------|
| A1 | Moving Standard ladder Untested→Tested→Stabilizing→Baseline→Elevated + Regressed; elevate-after-3 rule; reflected-proof only | PRD §5.9 (was Partial) |
| A2 | Qualification ladder (Recruit/Candidate/Operator/Spartan) computed from real state; V1 module gating with lock cards | PRD §5.10, §1.10 (was Partial/simulated) |
| A3 | Replacement doctrine activates on contradiction | PRD §4.20/§5.8 |
| A4 | Mission assignment: RECOVER + weakest-domain priority | PRD §5.3 |
| A5 | Step-by-step reflection with progress | Design §19.5/§12.14 (was single form) |
| A6 | Re-entry after absence, active-day tracking, reflection-due reminder | PRD Epic 16 |
| A7 | Two-statement consent (§4.9); naming/stamps verified compliant | PRD §4.9 |

**Updated conformance verdict:** HIGH across the core loop, rule engine, safety model, progression,
qualification, and design language. Remaining gap is **Phase B only** (real backend/auth/persistence/
payments/integrations per PRD §6) — out of scope for the prototype. Commits `717e46a`..`HEAD`.
