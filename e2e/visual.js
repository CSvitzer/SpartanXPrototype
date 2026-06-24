// #9 (stable variant): layout-sanity checks instead of flaky golden-image diffs. For key screens
// across phone→tablet widths, assert no horizontal overflow, the tab bar sits within the viewport,
// and the screen actually rendered. Catches real mobile layout breaks without pixel maintenance.
const playwright = require("playwright");
const ENGINE = process.env.SX_BROWSER || "chromium";
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";

const QUALIFIED = {
  stateVersion: 1, onboardingComplete: true, safetyChecked: true, recruitQualified: true,
  status: "Foundation Confirmed", claim: "I am disciplined.", debriefCount: 6,
  foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true },
  standards: { body: "Stabilizing", mind: "Tested", will: "Under Review", execution: "Baseline", readiness: "HOLD", integrity: "Forming" },
  proofLedger: [{ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Practice.", friction: "Delay", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "Standard held", quality: 4, source: "reflection" }],
};

const WIDTHS = [320, 360, 390, 768];
const SCREENS = [
  { name: "access (fresh)", seed: null },
  { name: "today", seed: Object.assign({ tab: "today" }, QUALIFIED) },
  { name: "mission", seed: Object.assign({ tab: "mission" }, QUALIFIED, { mission: { status: "assigned", day: 1, name: "Obedience", domain: "body", objective: "x", knownThreat: "Delay", standard: "y", minimum: "z", deadline: "21:30" } }) },
  { name: "debrief", seed: Object.assign({ tab: "debrief" }, QUALIFIED, { mission: { status: "completed" } }) },
  { name: "proof", seed: Object.assign({ tab: "proof" }, QUALIFIED) },
  { name: "standard", seed: Object.assign({ tab: "standard" }, QUALIFIED) },
  { name: "modules", seed: Object.assign({ tab: "modules" }, QUALIFIED) },
  { name: "system", seed: Object.assign({ tab: "system" }, QUALIFIED) },
];

(async () => {
  const browser = await playwright[ENGINE].launch();
  const R = [];
  const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });

  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: w < 768 });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", e => errs.push(e.message));
    await page.goto(BASE, { waitUntil: "load" });
    for (const s of SCREENS) {
      await page.evaluate(({ k, v }) => { if (v) localStorage.setItem(k, JSON.stringify(v)); else localStorage.removeItem(k); }, { k: KEY, v: s.seed });
      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(s.seed ? 250 : 1500);
      const m = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        appLen: (document.querySelector("#app") || {}).innerText ? document.querySelector("#app").innerText.length : 0,
        tabbar: (() => { const t = document.querySelector(".tabbar"); if (!t) return null; const r = t.getBoundingClientRect(); return { right: Math.round(r.right), left: Math.round(r.left) }; })(),
      }));
      // ≤2px tolerance for sub-pixel rounding.
      ok(`[${w}px ${s.name}] no horizontal overflow`, m.scrollW <= m.innerW + 2, `scrollW=${m.scrollW} innerW=${m.innerW}`);
      ok(`[${w}px ${s.name}] rendered`, m.appLen > 40, "len=" + m.appLen);
      if (m.tabbar) ok(`[${w}px ${s.name}] tab bar within viewport`, m.tabbar.left >= -2 && m.tabbar.right <= m.innerW + 2, JSON.stringify(m.tabbar) + " innerW=" + m.innerW);
    }
    ok(`[${w}px] no uncaught errors`, errs.length === 0, errs[0] || "");
    await ctx.close();
  }

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
