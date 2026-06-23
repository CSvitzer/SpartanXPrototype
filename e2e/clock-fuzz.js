// A4: clock/calendar fuzz. Drives session init under hostile wall-clocks — year boundary, far
// future, a clock that jumps backwards, a corrupt stored timestamp, and 70 consecutive days — and
// asserts the date-dependent state (reentry, activeDays) stays sane: boolean reentry, valid
// YYYY-MM-DD entries, no duplicates, capped at 60, no NaN, no crash.
const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";

const R = [];
const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });
const DAY = 86400000;
const base = (lastActiveAt) => ({ stateVersion: 1, onboardingComplete: true, safetyChecked: true, status: "Foundation Confirmed", recruitQualified: true, lastActiveAt, foundation: { currentDay: 1, completedDays: [], started: true } });

function badState(s) {
  const v = [];
  if (!s || typeof s !== "object") return ["state not an object"];
  if (s.stateVersion !== 1) v.push("stateVersion " + s.stateVersion);
  if (!Array.isArray(s.proofLedger) || s.proofLedger.length > 200) v.push("ledger");
  const day = s.foundation && s.foundation.currentDay;
  if (!Number.isInteger(day) || day < 1 || day > 7) v.push("day " + day);
  if (typeof s.reentry !== "boolean") v.push("reentry not boolean: " + s.reentry);
  if (!Array.isArray(s.activeDays)) v.push("activeDays not array");
  else {
    if (s.activeDays.length > 60) v.push("activeDays > 60: " + s.activeDays.length);
    if (s.activeDays.some(d => !/^\d{4}-\d{2}-\d{2}$/.test(d))) v.push("activeDays bad format: " + JSON.stringify(s.activeDays.slice(0, 3)));
    if (new Set(s.activeDays).size !== s.activeDays.length) v.push("activeDays has duplicates");
  }
  const nan = [];
  (function scan(o, p) { if (typeof o === "number") { if (Number.isNaN(o)) nan.push(p); } else if (o && typeof o === "object") for (const k of Object.keys(o)) scan(o[k], p + "." + k); })(s, "s");
  if (nan.length) v.push("NaN: " + nan.join(","));
  return v;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.clock.install({ time: new Date("2026-06-01T08:00:00.000Z") });
  let errs = [];
  page.on("pageerror", e => errs.push(e.message));
  await page.goto(BASE, { waitUntil: "load" });

  const gs = () => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, KEY);
  const seed = (s) => page.evaluate(({ k, v }) => localStorage.setItem(k, JSON.stringify(v)), { k: KEY, v: s });

  // Each scenario: set the mocked clock, seed a state, reload (initSession runs), assert sane.
  const scenarios = [
    { name: "year boundary", at: "2026-12-31T23:30:00.000Z", last: t => t - 2 * DAY, wantReentry: true },
    { name: "new-year rollover", at: "2027-01-01T00:30:00.000Z", last: t => t - 12 * 3600000, wantReentry: false },
    { name: "far future", at: "2099-06-15T10:00:00.000Z", last: t => t - 5 * DAY, wantReentry: true },
    { name: "clock jumped backwards", at: "2026-02-01T09:00:00.000Z", last: t => t + 5 * DAY, wantReentry: false }, // future lastActive
    { name: "corrupt timestamp", at: "2026-06-10T09:00:00.000Z", last: () => "not-a-date", wantReentry: false },
    { name: "null timestamp (first run)", at: "2026-06-10T09:00:00.000Z", last: () => null, wantReentry: false },
  ];

  for (const sc of scenarios) {
    errs = [];
    const t = Date.parse(sc.at);
    await page.clock.setFixedTime(new Date(t));
    await seed(base(sc.last(t)));
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(250);
    const s = await gs();
    const v = badState(s);
    ok(`[${sc.name}] state sane`, v.length === 0, v.join("; "));
    ok(`[${sc.name}] reentry = ${sc.wantReentry}`, s && s.reentry === sc.wantReentry, "got " + (s && s.reentry));
    ok(`[${sc.name}] today recorded`, s && s.activeDays.includes(new Date(t).toISOString().slice(0, 10)));
    ok(`[${sc.name}] no uncaught error`, errs.length === 0, errs[0] || "");
  }

  // 70 consecutive days: activeDays must accumulate distinct days and cap at 60.
  // setSystemTime (not setFixedTime) so fastForward actually advances the wall-clock each reload.
  errs = [];
  await page.clock.setSystemTime(new Date("2026-01-01T09:00:00.000Z"));
  await seed(base(null));
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(150);
  for (let i = 0; i < 70; i++) {
    await page.clock.fastForward("24:00:00");
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(40);
  }
  const s = await gs();
  ok("[70-day run] activeDays capped at 60", s && s.activeDays.length === 60, "len=" + (s && s.activeDays.length));
  ok("[70-day run] all entries valid + unique", s && badState(s).length === 0, badState(s).join("; "));
  ok("[70-day run] no uncaught error", errs.length === 0, errs[0] || "");

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
