# Spartan X Prototype

Dependency-free browser prototype built from the Spartan X PRD and design document. This is a full product prototype, not only an MVP slice.

Open `index.html` directly in a browser, or run the local static server:

```powershell
node D:\SpartanXPrototype\serve.js
```

Then open `http://127.0.0.1:4173`.

## What is included

- Access Granted and First Practice onboarding flow
- Claim capture and safety gate
- Today, Practice, Reflection, Proof, and Standard tabs
- Deterministic readiness guidance: PRESS, HOLD, SCALE, RECOVER
- Reflection quality scoring and proof status handling
- Full Modules area covering Guide, Circle, Connection, Principles, Pressure Practice, Advanced Standards, Device Signals, History Import, Human Review, Benchmarks, Team Standards, and Cognitive Load
- Stateful module actions that affect proof, readiness, standards, or module metrics where relevant
- Local storage persistence with reset

## Product direction

See `PRODUCT_DIRECTION.md` for the naming and tone rules. The prototype keeps the PRD mechanics, but the user-facing language should stay stoic, private, and evidence-led rather than military, sci-fi, or tactical.

## Test plan

See `PROTOTYPE_TEST_PLAN.md` for the full click path and edge cases.

## Automated QA

Run the server, then open:

```text
http://127.0.0.1:4173/qa.html
```

Click `Run all tests`. The browser QA runner verifies the main flows, edge cases, claim models, targeted practice assignment, safety/proof status rules, and the full module suite.

## Coverage

See `FULL_PROTOTYPE_COVERAGE.md` for the complete prototype coverage matrix. `MVP_COVERAGE.md` remains only as a historical baseline.

## Source documents used

- `Spartan X Master PRD v3.0.docx`
- `Spartan X Design Document.docx`
