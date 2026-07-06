// Screenshot harness — drives EVERY feature/state and captures it at phone + desktop widths, so the
// UI can be reviewed with real eyes (mine + the gates'), not just layout-sanity asserts. Output goes
// to e2e/shots/ (gitignored, regenerable: `npm run shots`). Prints a manifest of what it captured.
const playwright = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";
const OUT = path.join(__dirname, "shots");
const WIDTHS = [{ w: 390, tag: "phone" }, { w: 1280, tag: "desktop" }];

// A fully-qualified, onboarded operator with a small honest ledger.
const Q = {
  stateVersion: 1, onboardingComplete: true, safetyChecked: true, recruitQualified: true,
  status: "Foundation Confirmed", claim: "I am disciplined.", debriefCount: 6, foundationGraduated: true,
  profile: { callsign: "Leonidas" },
  foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true },
  standards: { body: "Stabilizing", mind: "Tested", will: "Under Review", execution: "Baseline", readiness: "HOLD", integrity: "Forming" },
  readiness: { sleep: 4, energy: 4, soreness: 2, pain: "none", stress: 2, emotional: 2, motivation: 3 },
  proofLedger: [
    { date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Held the line.", friction: "Avoidance", frictionLevel: "high", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "Standard held", quality: 4, source: "reflection" },
    { date: "20 Jun 2026", status: "Accepted", result: "Completed", text: "Pushed through.", friction: "Avoidance", frictionLevel: "high", decision: "Hold", domain: "mind", day: 1, minimumOnly: false, effect: "Standard held", quality: 5, source: "reflection" },
    { date: "19 Jun 2026", status: "Accepted", result: "Completed", text: "Recovered.", friction: "Fatigue", frictionLevel: "medium", decision: "Recover", domain: "body", day: 1, minimumOnly: true, effect: "Recovery obeyed", quality: 3, source: "reflection" },
  ],
};
const merge = (...o) => Object.assign({}, ...o.map(x => JSON.parse(JSON.stringify(x))));
const CLOUD = { url: "http://mock.local", handle: "Leonidas", token: "tok_Leonidas", lastSync: "2026-06-26T08:30:00Z", status: "Synced as Leonidas.", leaderboard: [{ handle: "Leonidas", metric: 18 }, { handle: "Tegea", metric: 14 }, { handle: "Sparta", metric: 9 }], challenges: [{ id: "active-7", title: "7 active days" }, { id: "reflect-15", title: "15 reflections" }] };

const SHOTS = [
  // ── Onboarding (just-in-time flow) ──
  { name: "01-splash", seed: { onboardingComplete: false, view: "splash" }, wait: 300 },
  { name: "02-access", seed: { onboardingComplete: false, view: "access" } },
  { name: "03-order-select", seed: { onboardingComplete: false, view: "order-select" } },
  { name: "04-order-execute", seed: { onboardingComplete: false, view: "order-execute", selectedOrder: "body" } },
  { name: "05-first-report", seed: { onboardingComplete: false, view: "report", selectedOrder: "body" } },
  // ── Today (core loop home) ──
  { name: "10-today", seed: merge(Q, { tab: "today" }) },
  { name: "11-today-deferred-cards", seed: merge(Q, { tab: "today", safetyChecked: false, claim: "", profile: { callsign: "" }, callsignPromptDismissed: false }) },
  { name: "12-today-readiness-PRESS", seed: merge(Q, { tab: "today", readiness: { sleep: 5, energy: 5, soreness: 1, pain: "none", stress: 1, emotional: 1, motivation: 4 }, standards: merge(Q.standards, { readiness: "PRESS" }) }) },
  { name: "13-today-readiness-RECOVER", seed: merge(Q, { tab: "today", readiness: { sleep: 2, energy: 2, soreness: 4, pain: "severe", stress: 4, emotional: 3, motivation: 2 }, standards: merge(Q.standards, { readiness: "RECOVER" }) }) },
  // ── Practice / Reflection ──
  { name: "20-mission", seed: merge(Q, { tab: "mission", mission: { status: "assigned", day: 1, name: "Obedience", domain: "body", objective: "Complete one 10-minute movement practice before 18:00.", knownThreat: "Avoidance", standard: "Start before comfort.", minimum: "2 minutes controlled movement.", deadline: "21:30" } }) },
  { name: "21-debrief", seed: merge(Q, { tab: "debrief", mission: { status: "completed", day: 1, name: "Obedience", domain: "body" } }) },
  { name: "22-debrief-full", seed: merge(Q, { tab: "debrief", debriefMode: "full", mission: { status: "completed", day: 1, name: "Obedience", domain: "body" } }) },
  // ── Proof / Standard ──
  { name: "30-proof-ledger", seed: merge(Q, { tab: "proof" }) },
  { name: "31-standard", seed: merge(Q, { tab: "standard" }) },
  { name: "32-standard-graduation", seed: merge(Q, { tab: "standard", foundationGraduated: false }) },
  // ── Modules (incl. simulated labels) ──
  { name: "40-modules-guide", seed: merge(Q, { tab: "modules", modules: { active: "guide" } }) },
  { name: "41-modules-signals-simulated", seed: merge(Q, { tab: "modules", modules: { active: "signals" } }) },
  { name: "43-modules-benchmarks-simulated", seed: merge(Q, { tab: "modules", modules: { active: "benchmarks" } }) },
  // ── System + Cloud (the 3 states) ──
  { name: "50-system", seed: merge(Q, { tab: "system" }) },
  { name: "51-cloud-off", seed: merge(Q, { tab: "system", cloud: { url: "" } }) },
  { name: "52-cloud-synced", seed: merge(Q, { tab: "system", cloud: CLOUD }) },
  { name: "53-cloud-protected", seed: merge(Q, { tab: "system", cloud: CLOUD, safetyFlags: ["crisis"] }) },
  // ── Modals ──
  { name: "60-modal-about", seed: merge(Q, { tab: "today", modal: "about" }) },
  { name: "61-modal-adjust", seed: merge(Q, { tab: "mission", modal: "adjust", mission: { status: "assigned", day: 1, name: "Obedience", domain: "body", objective: "x", knownThreat: "Delay", standard: "y", minimum: "z", deadline: "21:30" } }) },
  { name: "62-modal-pause", seed: merge(Q, { tab: "mission", modal: "pause", mission: { status: "active", day: 1, name: "Obedience", domain: "body" } }) },
  { name: "63-modal-export", seed: merge(Q, { tab: "system", modal: "export" }) },
  { name: "64-modal-report", seed: merge(Q, { tab: "system", modal: "report" }) },
  { name: "65-modal-pain-downgrade", seed: merge(Q, { tab: "today", modal: "painDowngrade", readiness: merge(Q.readiness, { pain: "severe" }), pendingPain: "none" }) },
  // ── Integrity + crisis ──
  { name: "70-integrity-banner", seed: merge(Q, { tab: "proof", proofLedger: [{ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "TAMPERED", friction: "Delay", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "x", quality: 4, source: "reflection", prevHash: "genesis", hash: "deadbeefdeadbeef" }] }) },
  { name: "71-crisis-resources", seed: merge(Q, { tab: "today", safetyFlags: ["crisis"] }) },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await playwright.chromium.launch();
  const manifest = [];
  for (const { w, tag } of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: w < 768 });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "load" });
    for (const s of SHOTS) {
      // Clear ALL keys (main + last-good + quarantine) so no prior shot's snapshot bleeds in, and stamp
      // stateVersion so a partial onboarding seed isn't read as "incompatible" → recovery banner.
      await page.evaluate(({ k, v }) => { localStorage.clear(); if (v) localStorage.setItem(k, JSON.stringify({ stateVersion: 1, ...v })); }, { k: KEY, v: s.seed });
      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(s.wait || 350);
      const file = `${s.name}.${tag}.png`;
      await page.screenshot({ path: path.join(OUT, file), fullPage: true });
      const appLen = await page.evaluate(() => (document.querySelector("#app")?.innerText || "").length);
      manifest.push({ file, ok: appLen > 40, appLen });
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  const thin = manifest.filter(m => !m.ok);
  console.log(`captured ${manifest.length} screenshots to e2e/shots/`);
  if (thin.length) console.log("WARNING — thin/empty renders:\n" + thin.map(m => " - " + m.file + " (len=" + m.appLen + ")").join("\n"));
  else console.log("all screens rendered (appLen > 40).");
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
