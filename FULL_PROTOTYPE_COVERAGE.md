# Spartan X Full Prototype Coverage

This is the working bar for the prototype. The prototype is not treated as complete because a screen exists; it is complete when every major product idea from the PRD/design direction is visible, interactive, stateful, and covered by QA or the manual test plan.

## Product Spine

`Claim -> Practice -> Friction -> Reflection -> Proof -> Standard`

Status: Covered and automated.

Verified by:

- QA: Happy path
- QA: Seven-day Foundation completion
- QA: Weak reflection becomes incomplete
- QA: Abandoned reflection is rejected
- QA: Safety language forces protected state
- QA: All claim deconstruction models render
- QA: Repeated friction creates targeted practice

## Core Experience

| Requirement | Prototype implementation | Verification |
| --- | --- | --- |
| Splash / Launch | Auto-transition splash screen | QA: Happy path |
| Assessment entry | Access screen and First Practice start | QA: Happy path |
| First Practice Selection | Body, Mind, Will practice cards | QA: Happy path |
| First Practice Execution | Timed active practice screen | QA: Happy path |
| First Practice pause path | Minimum completion and re-entry after stopping | QA: First Practice failure twice pauses assessment |
| First Report | Status, friction level, resistance capture | QA: Happy path |
| Failed assessment handling | Two failed reports pause assessment without lockout | QA: First Practice failure twice pauses assessment |
| Claim Capture | Claim selection from PRD list | QA: Happy path |
| Mock Account Creation | Email, password, name, callsign, age, consent | QA: Happy path |
| Safety Gate | Injury, pain, medical, crisis, punishment, restriction checks | QA: Happy path |
| 7-Day Foundation | Seven-day path with current/closed state | QA: Seven-day Foundation completion |
| Daily Practice Brief | Day-specific objective, threat, standard, minimum, due time | QA: Seven-day Foundation completion |
| Practice Active | Start/complete active practice state | QA: Happy path |
| Adjust Practice | Adjustment modal with reasons and pain path | QA: Adjust Practice and pain path |
| Pause / Recenter | Signal modal with minimum/protect/stop outcomes | QA: Pause / Recenter path |
| Reflection Required | Blocks standard movement until reflection | QA: Happy path |
| Reflection Engine | Result, friction, negotiation, decision, lesson, correction | QA: Happy path |
| Proof Logged | Dedicated proof result screen | QA: Happy path |
| Today | Status, readiness, claim, Foundation path, next action | QA: Happy path |
| Readiness Check | Sleep, energy, soreness, pain, stress, emotional load, motivation | QA: Readiness severe pain forces RECOVER |
| Claim Deconstruction | Claim-specific evidence and contradiction state for every claim | QA: All claim deconstruction models render |
| Proof Ledger | Private proof history with status/effect | QA: Happy path |
| Standard Profile | Moving standard, requirements, domain states | QA: Seven-day Foundation completion |
| Friction Map | Ranked friction from proof history | QA: Seven-day Foundation completion |
| System / Settings | Privacy, reminders, safety notes, export, delete | QA: System export and reset |

## Full Product Modules

The PRD/design references are implemented with stoic naming. Old military, sci-fi, and roleplay names are not user-facing.

| Product idea | Prototype module | What is testable | Verification |
| --- | --- | --- | --- |
| AI guidance | Guide | Focus switching, readiness/claim/friction/recovery guidance | QA: Full prototype module suite |
| Accountability group | Circle | Check-in input, private accountability entries, proof logging | QA: Full prototype module suite |
| Bond/duty layer | Connection | Duty statement, support window, commitments, proof logging | QA: Full prototype module suite |
| Education/doctrine | Principles | Stoic principle selection and practice logging | QA: Full prototype module suite |
| Integrated pressure trials | Pressure Practice | Domain selection, load slider, readiness-aware result, proof logging | QA: Full prototype module suite |
| Qualification standards v2 | Advanced Standards | Integrated proof gates and tier movement | QA: Full prototype module suite |
| Wearable integrations | Device Signals | Simulated connection/sync and readiness inputs | QA: Full prototype module suite |
| Training history import | History Import | CSV upload/paste, sample CSV, history analysis, baseline calibration | QA: Full prototype module suite |
| Expert review | Human Review | Review note submission, feedback state, under-review proof | QA: Full prototype module suite |
| Competition/comparison | Benchmarks | Private score and standard band without social status framing | QA: Full prototype module suite |
| Enterprise/team view | Team Standards | Aggregate team reliability metrics without private proof exposure | QA: Full prototype module suite |
| Cognitive load | Cognitive Load | Attention task attempts, accuracy, load progression | QA: Full prototype module suite |

## Rule Coverage

| Rule family | Status | Verification |
| --- | --- | --- |
| Readiness PRESS/HOLD/SCALE/RECOVER | Covered | QA: Readiness severe pain forces RECOVER; manual sliders |
| Minimum practice | Covered | QA: Pause / Recenter path |
| Proof Accepted / Incomplete / Under Review / Rejected | Covered | QA: Happy path, Weak reflection, Safety language, Abandoned reflection |
| Reflection quality scoring | Covered | QA: Happy path, Weak reflection |
| Friction classification | Covered | QA: Happy path, Foundation completion |
| Claim deconstruction | Covered as prototype logic | QA: All claim deconstruction models render |
| Targeted practice assignment | Covered | QA: Repeated friction creates targeted practice |
| Moving standard | Covered as prototype logic | QA: Foundation completion |
| Safety language scan | Covered | QA: Safety language forces protected state |
| Overtraining readiness risk | Covered as rule logic | Manual plan |
| Module-generated proof | Covered | QA: Full prototype module suite |
| Advanced standard progression | Covered as simulated standard gate | QA: Full prototype module suite |
| Simulated external inputs | Covered as explicit prototype simulation | QA: Full prototype module suite |
| CSV history calibration | Covered as context, not proof | QA: Full prototype module suite |

## Truthful Simulation Boundary

These are represented truthfully as prototype simulations:

- Device Signals simulate wearable input and update readiness state.
- CSV History Import parses user-provided training data and calibrates baseline context; it does not create proof or confirm identity.
- Guide uses deterministic rule logic, not a real LLM.
- Human Review simulates review submission and feedback state, not a real expert.
- Benchmarks are private standard bands, not public competition.
- Team Standards use aggregate metrics, not real organization data.

These are production infrastructure concerns, not missing prototype ideas:

- Real backend / PostgreSQL persistence
- Real authentication, password hashing, email verification, and account recovery
- Payments
- Real wearable vendor imports
- Real notifications
- Real AI personalization
- Real social graph/accountability invitations
- Real expert marketplace/review operations
- Real enterprise admin and organization provisioning
- Region-verified emergency resource directory
- Production privacy, consent, data export, and deletion guarantees

The prototype should prove the private stoic standard system, all major product mechanics, and the mentality before production infrastructure is introduced.
