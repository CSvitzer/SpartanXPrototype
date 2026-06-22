# Spartan X Prototype Test Plan

Use this plan when testing and tweaking the prototype.

## Open

```powershell
node D:\SpartanXPrototype\serve.js
```

Then open `http://127.0.0.1:4173`.

For automated coverage, open `http://127.0.0.1:4173/qa.html` and click `Run all tests`.

## Full Happy Path

1. Wait for Splash to transition to Access Granted.
2. Begin Assessment.
3. Select a First Practice.
4. Complete it and submit the first report.
5. Select a claim to test.
6. Create a mock profile with email, callsign, age confirmation, and consent.
7. Pass the safety check.
8. Review 7-Day Foundation and start Day 1.
9. Open Practice, begin it, complete it.
10. Submit Reflection with friction, negotiation, decision, lesson, and correction.
11. Review Proof Logged.
12. Advance Foundation.
13. Repeat a few days and inspect Today, Proof, Standard, and System.
14. Open Modules and exercise each module action at least once.

## Edge Cases To Test

- First Practice stopped through Pause / Recenter.
- Practice adjusted for fatigue.
- Practice adjusted for pain warning.
- Readiness set to severe pain.
- Reflection with weak quality.
- Reflection with strong quality.
- Claim deconstruction after multiple proofs.
- Claim deconstruction for every claim option.
- Targeted practice after repeated friction appears.
- Foundation advancement through all seven days.
- System data export preview.
- Delete local data.

## Full Module Suite

- Guide: switch focus and generate guidance.
- Circle: submit a private check-in and verify proof is logged.
- Connection: complete duty commitments.
- Principles: select and practice a principle.
- Pressure Practice: change domain/load and complete a pressure practice.
- Advanced Standards: add integrated proof and verify tier movement.
- Device Signals: connect/sync and verify readiness inputs change.
- History Import: load CSV, analyze training history, and apply baseline.
- Human Review: submit a review note and verify feedback state.
- Benchmarks: change private score and update band.
- Team Standards: simulate a team week and inspect aggregate metrics.
- Cognitive Load: record correct and missed responses.

## Product Checks

- User-facing language should stay stoic, private, and evidence-led.
- Avoid military, sci-fi, tactical, rank, and game language.
- Old PRD reference names can be used in internal mapping only; they must not appear as product UI labels or module descriptions.
- Recovery, scaling, and honest reporting must count as part of the standard.
