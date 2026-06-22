// A6: accessibility automation. Runs axe-core (WCAG 2.0/2.1 A + AA) across every key screen and a
// modal, plus a keyboard reachability + focus-retention check. Fails on serious/critical violations.
const playwright = require("playwright");
const ENGINE = process.env.SX_BROWSER || "chromium";
const AxeBuilder = require("@axe-core/playwright").default;
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";

const QUALIFIED = {
  stateVersion: 1, onboardingComplete: true, recruitQualified: true, status: "Foundation Confirmed",
  claim: "I am disciplined.", debriefCount: 6,
  foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true },
  standards: { body: "Stabilizing", mind: "Tested", will: "Under Review", execution: "Baseline", readiness: "HOLD", integrity: "Forming" },
  proofLedger: [{ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Practice.", friction: "Delay", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "Standard held", quality: 4, source: "reflection" }],
};

const SCREENS = [
  { name: "access (fresh)", seed: null },
  { name: "account", seed: { onboardingComplete: false, view: "account", profile: { email: "", password: "", displayName: "", callsign: "", ageConfirmed: false, consentConfirmed: false, consentChallenge: false } } },
  { name: "today", seed: Object.assign({ tab: "today" }, QUALIFIED) },
  { name: "standard", seed: Object.assign({ tab: "standard" }, QUALIFIED) },
  { name: "proof", seed: Object.assign({ tab: "proof" }, QUALIFIED) },
  { name: "modules", seed: Object.assign({ tab: "modules" }, QUALIFIED) },
  { name: "system", seed: Object.assign({ tab: "system" }, QUALIFIED) },
  { name: "data modal", seed: Object.assign({ tab: "system", modal: "export" }, QUALIFIED) },
  { name: "report modal", seed: Object.assign({ tab: "system", modal: "report" }, QUALIFIED) },
];

(async () => {
  const browser = await playwright[ENGINE].launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const R = [];
  const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });
  await page.goto(BASE, { waitUntil: "load" });

  for (const s of SCREENS) {
    await page.evaluate(({ k, v }) => { if (v) localStorage.setItem(k, JSON.stringify(v)); else localStorage.removeItem(k); }, { k: KEY, v: s.seed });
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(s.seed ? 350 : 1600); // fresh: wait out the splash transition
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter(v => v.impact === "serious" || v.impact === "critical");
    const minor = results.violations.filter(v => v.impact !== "serious" && v.impact !== "critical");
    ok(`[${s.name}] no serious/critical a11y violations`, serious.length === 0,
      serious.map(v => `${v.id}(${v.impact}) x${v.nodes.length}`).join(", "));
    if (minor.length) console.log(`  note [${s.name}] minor/moderate: ${minor.map(v => v.id).join(", ")}`);
  }

  // Keyboard reachability + focus retention across the full-innerHTML re-render.
  await page.evaluate(({ k, v }) => localStorage.setItem(k, JSON.stringify(v)), { k: KEY, v: Object.assign({ tab: "today" }, QUALIFIED) });
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(350);
  let reached = 0;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
    if (["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(tag)) reached++;
  }
  ok("keyboard reaches interactive controls", reached >= 5, "reached=" + reached);

  // Activate a tab via keyboard, then assert focus is not lost to <body> after the re-render.
  await page.focus('[data-action="set-tab"][data-tab="standard"]').catch(() => {});
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  const afterTag = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  ok("focus retained after re-render (not dumped to body)", afterTag && afterTag !== "BODY", "active=" + afterTag);

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
