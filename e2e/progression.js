const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";
const R = [];
const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.clock.install({ time: new Date("2026-06-01T08:00:00.000Z") });
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));

  const ca = async (a, o = {}) => {
    const sel = o.value !== undefined ? `[data-action="${a}"][${o.attr}="${o.value}"]` : `[data-action="${a}"]`;
    await page.waitForSelector(sel, { timeout: 9000 });
    await page.click(sel);
    await page.waitForTimeout(60);
  };
  const gs = () => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, KEY);
  const qual = () => page.evaluate(() => window.computeQualification());
  const navTab = (t) => ca("set-tab", { attr: "data-tab", value: t });
  const advanceDay = async () => { await page.clock.fastForward("24:00:00"); await page.reload({ waitUntil: "load" }); await page.waitForTimeout(150); };

  const reflect = async ({ noMood = false, recover = false } = {}) => {
    await ca("debrief-next"); // result -> friction
    const want = noMood ? "Fatigue" : "Delay"; // Fatigue/Boredom = a "no-mood" practice
    const pressed = await page.$(`[data-action="toggle-debrief-friction"][data-friction="${want}"][aria-pressed="true"]`);
    if (!pressed) await ca("toggle-debrief-friction", { attr: "data-friction", value: want });
    await ca("debrief-next"); // -> negotiation
    await page.fill("#negotiation", "Friction appeared and I started before comfort.");
    await ca("debrief-next"); // -> decision
    if (recover) await page.selectOption("#decision", "Recover").catch(() => {});
    await ca("debrief-next"); // -> lesson
    await page.fill("#lesson", "I start faster when I name the friction first.");
    await ca("debrief-next"); // -> correction
    await page.fill("#correction", "I will begin before the phone every session.");
    await ca("submit-debrief");
  };

  // --- Onboarding (fresh), claim = time (easy to deconstruct via Delay friction) ---
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(k => localStorage.removeItem(k), KEY);
  await page.reload({ waitUntil: "load" });
  await page.clock.fastForward(2000); // fire splash -> access
  await page.waitForSelector('[data-action="begin-selection"]', { timeout: 6000 });
  await ca("begin-selection");
  await ca("select-order", { attr: "data-order", value: "mind" });
  await ca("start-order");
  await ca("complete-first-order");
  await ca("submit-first-report");
  await ca("finish-onboarding");                 // first proof -> into the app
  await ca("confirm-safety-check");              // one-time deferred safety check on Today
  await ca("select-claim", { attr: "data-claim", value: "I do not have enough time." });

  // --- 7-day Foundation, one distinct day each ---
  for (let d = 1; d <= 7; d++) {
    await navTab("today");
    await ca("begin-main-mission");
    await ca("complete-mission");
    await reflect({ noMood: d === 5, recover: d === 6 }); // Day 5 No-Mood, Day 6 Recovery (per Foundation design)
    await ca("advance-foundation");
    await advanceDay();
  }
  let s = await gs();
  ok("Foundation Confirmed reached via play", s.status === "Foundation Confirmed" && s.recruitQualified === true);

  // --- Grant an integrated proof (Operator requirement) ---
  await navTab("modules");
  await ca("set-module", { attr: "data-module", value: "advanced" });
  await ca("grant-integrated-proof");

  // --- Continue Standard for many more distinct days (cycles weakest domain) ---
  for (let i = 0; i < 18; i++) {
    await advanceDay();
    await navTab("today");
    await ca("continue-standard");
    await ca("complete-mission");
    await reflect();
  }

  s = await gs();
  const tiers = await qual();
  const byName = Object.fromEntries(tiers.map(t => [t.name, t.status]));
  ok("active days >= 21 via play", (s.activeDays || []).length >= 21, "activeDays=" + (s.activeDays || []).length);
  ok("reflections >= 15", s.debriefCount >= 15, "debriefCount=" + s.debriefCount);
  ok("Foundation Confirmed = qualified", byName["Foundation Confirmed"] === "qualified");
  ok("Candidate reached = qualified", byName["Candidate"] === "qualified", JSON.stringify(byName));
  ok("Operator reached = qualified", byName["Operator"] === "qualified", JSON.stringify(byName));
  ok("Spartan Standard reached = qualified", byName["Spartan Standard"] === "qualified", JSON.stringify(byName));

  console.log("Final tiers: " + JSON.stringify(byName));
  console.log("Domains: " + JSON.stringify(s.standards));
  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  if (errs.length) console.log("\n-- page errors --\n" + errs.slice(0, 6).join("\n"));
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
