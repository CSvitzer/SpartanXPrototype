const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";
const SEED = Number(process.env.SEED || 0x5eed1);
const STEPS = Number(process.env.STEPS || 700);

// seeded PRNG (mulberry32) so any failure reproduces with the same seed
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

const STATUSES = ["Accepted", "Incomplete", "Under Review", "Rejected"];
function hasNaN(v, path, out) {
  if (typeof v === "number") { if (Number.isNaN(v)) out.push("NaN at " + path); return; }
  if (v && typeof v === "object") for (const k of Object.keys(v)) hasNaN(v[k], path + "." + k, out);
}
function checkInvariants(s) {
  const v = [];
  if (!s || typeof s !== "object") return ["state not an object"];
  if (s.stateVersion !== 1) v.push("stateVersion != 1: " + s.stateVersion);
  if (!Array.isArray(s.proofLedger)) v.push("proofLedger not array");
  else if (s.proofLedger.length > 200) v.push("proofLedger > 200: " + s.proofLedger.length);
  else s.proofLedger.forEach((p, i) => { if (p && p.status && !STATUSES.includes(p.status)) v.push(`proof[${i}] bad status ${p.status}`); });
  const day = s.foundation && s.foundation.currentDay;
  if (!Number.isInteger(day) || day < 1 || day > 7) v.push("foundation.currentDay out of [1,7]: " + day);
  if (!Number.isInteger(s.debriefCount) || s.debriefCount < 0) v.push("debriefCount invalid: " + s.debriefCount);
  if (typeof s.recruitQualified !== "boolean") v.push("recruitQualified not boolean");
  hasNaN(s, "state", v);
  return v;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", e => pageErrors.push(e.message));
  const gs = () => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return { __parseError: String(e) }; } }, KEY);

  const QUALIFIED = { stateVersion: 1, onboardingComplete: true, recruitQualified: true, safetyChecked: true, status: "Foundation Confirmed", claim: "I am disciplined.", debriefCount: 6, tab: "modules", foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true }, standards: { body: "Stabilizing", mind: "Tested", will: "Under Review", execution: "Baseline", readiness: "HOLD", integrity: "Forming" }, standardProgress: { body: { proofCount: 1, fails: 0 }, mind: { proofCount: 2, fails: 0 }, will: { proofCount: 0, fails: 2 }, execution: { proofCount: 1, fails: 0 } }, proofLedger: [{ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Seed.", friction: "Delay", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "Standard held", quality: 4, source: "reflection" }] };
  await page.goto(BASE, { waitUntil: "load" });
  if (process.env.QUALIFIED) await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), { k: KEY, s: QUALIFIED });
  else await page.evaluate(k => localStorage.removeItem(k), KEY);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(1400);

  const violations = [];
  const seq = [];
  const clickedActions = new Set();
  let prevQualified = false, qualRegressed = false;

  for (let step = 0; step < STEPS; step++) {
    // Fill any empty text inputs / selects / checkboxes so onboarding can progress
    try {
      await page.evaluate(() => {
        document.querySelectorAll('#app input[type="email"], #app input[type="password"], #app input:not([type]), #app textarea').forEach(el => { if (!el.value) { el.value = el.type === "email" ? "a@b.co" : "sample input text"; el.dispatchEvent(new Event("input", { bubbles: true })); } });
        document.querySelectorAll('#app input[type="checkbox"]').forEach(el => { if (!el.checked) { el.checked = true; el.dispatchEvent(new Event("change", { bubbles: true })); } });
      });
    } catch {}

    const handles = await page.$$('#app [data-action]');
    if (!handles.length) { await page.reload({ waitUntil: "load" }); await page.waitForTimeout(300); continue; }
    const h = pick(handles);
    let action = "?";
    try {
      action = await h.getAttribute("data-action");
      if (action === "reset" && rnd() < 0.97) continue; // down-weight destructive reset to keep exploring
      await h.click({ timeout: 1500 }); clickedActions.add(action); seq.push(action); await page.waitForTimeout(25);
    } catch { continue; }

    const s = await gs();
    const vs = checkInvariants(s);
    if (action === "reset") { prevQualified = false; } // reset legitimately clears qualification
    else {
      if (s && s.recruitQualified === true) prevQualified = true;
      if (prevQualified && s && s.recruitQualified === false) vs.push("recruitQualified regressed true->false");
    }
    if (vs.length) violations.push({ step, action, vs, tail: seq.slice(-8) });
  }

  console.log(`FUZZ seed=${SEED} steps=${STEPS}`);
  console.log(`distinct actions exercised: ${clickedActions.size}`);
  console.log(`invariant violations: ${violations.length}`);
  violations.slice(0, 12).forEach(x => console.log(`  step ${x.step} after "${x.action}": ${x.vs.join("; ")} | tail: ${x.tail.join(">")}`));
  console.log(`uncaught page errors: ${pageErrors.length}`);
  pageErrors.slice(0, 8).forEach(e => console.log("  " + e));
  await browser.close();
  process.exit(violations.length || pageErrors.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
