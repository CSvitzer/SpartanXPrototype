// Storage-chaos: boot the app against many corrupt localStorage payloads and assert it ALWAYS
// reaches a usable screen, never white-screens, never crashes, and quarantines unreadable data.
const playwright = require("playwright");
const ENGINE = process.env.SX_BROWSER || "chromium";
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";
const BACKUP = "spartan-x-prototype-state-backup";

const CASES = [
  { name: "truncated JSON", raw: "{", corrupt: true },
  { name: "incompatible version", raw: JSON.stringify({ stateVersion: 999, status: "Foundation Confirmed", onboardingComplete: true }), corrupt: true },
  { name: "null", raw: "null", corrupt: true },
  { name: "array not object", raw: "[1,2,3]", corrupt: true },
  { name: "garbage string", raw: "not json at all !!", corrupt: true },
  { name: "valid version, empty", raw: JSON.stringify({ stateVersion: 1 }), corrupt: false },
  { name: "wrong types", raw: JSON.stringify({ stateVersion: 1, proofLedger: "nope", foundation: { currentDay: 99 }, debriefCount: "x", onboardingComplete: true }), corrupt: false },
  { name: "proto pollution", raw: '{"__proto__":{"polluted":true},"constructor":{"x":1},"stateVersion":1}', corrupt: false },
  { name: "5000 proofs", raw: JSON.stringify({ stateVersion: 1, onboardingComplete: true, proofLedger: Array.from({ length: 5000 }, () => ({ status: "Accepted", domain: "body", source: "reflection", friction: "Delay", decision: "Hold", effect: "Standard held", quality: 4, text: "x" })) }), corrupt: false },
];

(async () => {
  const browser = await playwright[ENGINE].launch();
  const page = await browser.newPage();
  let errs = [];
  page.on("pageerror", e => errs.push(e.message));
  const R = [];
  const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });

  await page.goto(BASE, { waitUntil: "load" });
  for (const tc of CASES) {
    errs = [];
    await page.evaluate(({ k, b, raw }) => { localStorage.removeItem(b); localStorage.setItem(k, raw); }, { k: KEY, b: BACKUP, raw: tc.raw });
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(900);
    const text = await page.locator("#app").innerText().catch(() => "");
    const s = await page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, KEY);
    const backup = await page.evaluate(b => localStorage.getItem(b), BACKUP);
    const proto = await page.evaluate(() => ({}).polluted === undefined);
    ok(`[${tc.name}] renders a usable screen`, text.length > 40, "len=" + text.length);
    ok(`[${tc.name}] no uncaught error`, errs.length === 0, errs[0] || "");
    ok(`[${tc.name}] healthy state (v1, ledger<=200, day in range)`, s && s.stateVersion === 1 && Array.isArray(s.proofLedger) && s.proofLedger.length <= 200 && s.foundation.currentDay >= 1 && s.foundation.currentDay <= 7);
    if (tc.corrupt) ok(`[${tc.name}] corrupt blob quarantined to backup`, !!backup);
    ok(`[${tc.name}] no prototype pollution`, proto);
  }

  // Quota path (B5/C3): if the store rejects writes, the app must not crash, must keep the screen
  // usable, and must honestly tell the user persistence is degraded — then recover when space frees.
  await page.evaluate(k => localStorage.setItem(k, JSON.stringify({ stateVersion: 1, onboardingComplete: true })), KEY);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(500);
  errs = [];
  await page.evaluate(() => {
    window.__origSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function () { throw new Error("QuotaExceededError"); };
    window.render();
  });
  const degradedText = await page.locator("#app").innerText().catch(() => "");
  ok("[quota] app still renders under write failure", degradedText.length > 40, "len=" + degradedText.length);
  ok("[quota] honest 'not being saved' notice shown", /not being saved/i.test(degradedText));
  ok("[quota] no uncaught error under write failure", errs.length === 0, errs[0] || "");
  await page.evaluate(() => { Storage.prototype.setItem = window.__origSet; window.render(); });
  const recoveredText = await page.locator("#app").innerText().catch(() => "");
  ok("[quota] notice clears once writes succeed", !/not being saved/i.test(recoveredText));

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
