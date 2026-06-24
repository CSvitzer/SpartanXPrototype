// Mock-and-test the Phase-B "the proof model can sync" claim WITHOUT a backend. Simulates a
// cross-device round-trip — device A serializes its state, a mock transport carries the bytes, device
// B imports them — and asserts the round-trip is lossless, invariant-clean, and the tamper-evident
// hash chain still verifies. This proves sync-readiness; the real server is still Phase B.
const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const R = [];
  const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });
  await page.goto(BASE, { waitUntil: "load" });

  // --- Device A: build a rich, real state by logging app-signed proofs through the real chokepoint. ---
  await page.evaluate(() => {
    localStorage.clear();
    window.location.reload();
  });
  await page.waitForTimeout(400);
  await page.goto(BASE, { waitUntil: "load" });
  // Seed an onboarded, safety-checked state, then sign several proofs via applyProof (real hash chain).
  await page.evaluate((k) => {
    const seed = { stateVersion: 1, onboardingComplete: true, safetyChecked: true, status: "Foundation Confirmed", recruitQualified: true, claim: "I am disciplined.", debriefCount: 4, profile: { callsign: "Operator-7" }, foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true } };
    localStorage.setItem(k, JSON.stringify(seed));
  }, KEY);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    // Sign 5 proofs through the real chokepoint so the hash chain is genuine.
    for (let i = 0; i < 5; i++) {
      window.applyProof({ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Proof " + i, friction: "Delay", frictionLevel: "medium", decision: i === 2 ? "Recover" : "Hold", domain: ["body", "mind", "will", "execution"][i % 4], day: 1, minimumOnly: false, quality: 4, source: "reflection" });
    }
    window.render();
  });
  const uploaded = await page.evaluate(k => localStorage.getItem(k), KEY); // device A "uploads" this blob
  const aState = JSON.parse(uploaded);
  ok("device A has a signed ledger", Array.isArray(aState.proofLedger) && aState.proofLedger.length >= 5);
  const aVerifies = await page.evaluate(s => window.verifyLedger(JSON.parse(s).proofLedger), uploaded);
  ok("device A ledger verifies", aVerifies);

  // --- Mock transport: JSON over the wire (identity). Then device B (a fresh install) restores it
  // from the entry screen (the new "Restore a backup" affordance), simulating sync to a new device. ---
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(1700); // splash -> access
  const beforeImport = await page.evaluate(k => { const s = localStorage.getItem(k); return s ? JSON.parse(s).onboardingComplete : false; }, KEY);
  ok("device B started fresh", beforeImport === false);
  await page.click('[data-action="open-export"]'); // entry-screen "Restore a backup"
  await page.waitForTimeout(150);
  await page.evaluate(t => window.applyImportText(t), uploaded); // mock "download + apply"
  await page.waitForTimeout(150);
  await page.click('[data-action="confirm-import"]');
  await page.waitForTimeout(250);
  const bState = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);

  // --- Assert the round-trip is lossless + safe. ---
  ok("device B adopted the ledger losslessly", bState.proofLedger.length === aState.proofLedger.length);
  ok("device B claim/callsign/status preserved", bState.claim === aState.claim && bState.profile.callsign === aState.profile.callsign && bState.status === aState.status);
  ok("device B debriefCount preserved", bState.debriefCount === aState.debriefCount);
  const bVerifies = await page.evaluate(k => window.verifyLedger(JSON.parse(localStorage.getItem(k)).proofLedger), KEY);
  ok("hash chain still verifies after sync (tamper-evident across transport)", bVerifies);
  const bInvariants = await page.evaluate(k => window.checkInvariants(JSON.parse(localStorage.getItem(k))).length, KEY);
  ok("device B state is invariant-clean", bInvariants === 0);

  // --- Tamper-in-transit detection: flip a proof on the wire; the chain must catch it on arrival. ---
  const tampered = JSON.parse(uploaded);
  tampered.proofLedger[0].status = "Accepted";
  tampered.proofLedger[0].quality = 5; // edited after signing (hash unchanged)
  const tamperVerifies = await page.evaluate(s => window.verifyLedger(JSON.parse(s).proofLedger), JSON.stringify(tampered));
  ok("tampered-in-transit ledger fails verification", tamperVerifies === false);

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  console.log("note: proves the model is sync-ready over a mock transport; the real backend is Phase B.");
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
