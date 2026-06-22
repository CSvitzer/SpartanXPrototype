# Spartan X MVP Coverage Baseline

This file is retained as a historical MVP baseline. The current prototype completion bar is `FULL_PROTOTYPE_COVERAGE.md`.

This file defines the original MVP bar only. The full prototype bar is stricter: a feature is not considered covered unless it exists in the app and is included in QA or the manual test plan. If a document feature cannot be represented truthfully without backend, real identity, integrations, or external services, it is listed as a production boundary instead of being faked.

## Core Product Loop

`Claim -> Practice -> Friction -> Reflection -> Proof -> Standard`

Status: Covered.

Verified by:

- QA: Happy path
- QA: Seven-day Foundation completion
- QA: Weak reflection becomes incomplete
- QA: Abandoned reflection is rejected
- QA: Safety language forces protected state
- QA: All claim deconstruction models render
- QA: Repeated friction creates targeted practice

## MVP Screens / Areas

| Requirement | Prototype implementation | Verification |
| --- | --- | --- |
| Splash / Launch | Auto-transition splash screen | QA: Happy path |
| Access Granted | Assessment entry screen | QA: Happy path |
| First Practice Selection | Body, Mind, Will practice cards | QA: Happy path |
| First Practice Execution | Timed active practice screen | QA: Happy path |
| Pause / Recenter during First Practice | Signal classification and minimum completion | Manual plan |
| First Report | Status, friction level, resistance capture | QA: Happy path |
| First Practice Result | Provisional Candidate / paused result | QA: Happy path |
| First Practice failed twice | Assessment pause and re-entry available | QA: First Practice failure twice pauses assessment |
| Claim Capture | Claim selection from PRD list | QA: Happy path |
| Mock Account Creation | Email, password, name, callsign, age, consent | QA: Happy path |
| Safety Gate | Injury, pain, medical, crisis, punishment, restriction checks | QA: Happy path |
| 7-Day Foundation Home | Seven-day path with current/closed state | QA: Seven-day Foundation completion |
| Daily Practice Brief | Day-specific objective, threat, standard, minimum, due time | QA: Seven-day Foundation completion |
| Practice Active | Start/complete active practice state | QA: Happy path |
| Adjust Practice | Adjustment modal with reasons and pain path | QA: Adjust Practice and pain path |
| Pause / Recenter | Signal modal with minimum/protect/stop outcomes | QA: Pause / Recenter path |
| Reflection Required | Blocks standard confirmation until reflection | QA: Happy path |
| Reflection Engine | Result, friction, negotiation, decision, lesson, correction | QA: Happy path |
| Proof Logged | Dedicated proof result screen | QA: Happy path |
| Today | Status, readiness, claim, Foundation path, next action | QA: Happy path |
| Readiness Check | Sleep, energy, soreness, pain, stress, emotional load, motivation | QA: Readiness severe pain forces RECOVER |
| Deconstruction | Claim-specific evidence and contradiction state for every MVP claim | QA: All claim deconstruction models render |
| Proof Ledger | Private proof history with status/effect | QA: Happy path |
| Standard Profile | Moving standard, requirements, domain states | QA: Seven-day Foundation completion |
| Friction Map | Ranked friction from proof history | QA: Seven-day Foundation completion |
| System / Settings | Privacy, reminders, safety notes, export, delete | QA: System export and reset |

## Rule Coverage

| Rule family | Status | Verification |
| --- | --- | --- |
| Readiness PRESS/HOLD/SCALE/RECOVER | Covered | QA: Readiness severe pain forces RECOVER; manual sliders |
| Minimum practice | Covered | QA: Pause / Recenter path |
| Proof Accepted / Incomplete / Under Review / Rejected | Covered | QA: Happy path, Weak reflection, Safety language, Abandoned reflection |
| Reflection quality scoring | Covered | QA: Happy path, Weak reflection |
| Friction classification | Covered | QA: Happy path, Foundation completion |
| Claim deconstruction | Covered as prototype logic | QA: Foundation completion |
| Targeted practice assignment | Covered | QA: Repeated friction creates targeted practice |
| Moving standard | Covered as prototype logic | QA: Foundation completion |
| Safety language scan | Covered | QA: Safety language forces protected state |
| Overtraining readiness risk | Covered as rule logic | Manual plan |

## Explicitly Out Of Scope For This Prototype

These remain intentionally out of scope unless product direction changes:

- Real backend / PostgreSQL persistence
- Real authentication, password hashing, email verification, and account recovery
- Payments
- Wearables
- Real notifications
- AI guide / personalization
- Social/accountability features
- Expert review
- Competition
- Region-verified emergency resource directory
- Wearable data imports
- Production privacy, consent, data export, and deletion guarantees

The prototype should prove the private stoic standard system first.
