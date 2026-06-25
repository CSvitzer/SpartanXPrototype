// End-to-end Phase-B test against a REAL running mock backend. Proves the cloud architecture works:
// opt-in auth, lossless CRDT-style cross-device sync (set-union by hash), server-side anti-cheat
// (hash re-verification), leaderboard, and challenge evaluation. Local-first: cloud failure never
// breaks the app. The backend is a mock (in-memory) — production hosting is still real Phase B.
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

const APP = process.env.SX_URL || "http://127.0.0.1:4173/";
const MOCK_PORT = Number(process.env.MOCK_PORT || 4319);
const MOCK = `http://127.0.0.1:${MOCK_PORT}`;
const KEY = "spartan-x-prototype-state";
const R = [];
const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });

function waitHttp(url, ms) {
  const deadline = Date.now() + ms;
  return new Promise((resolve, reject) => {
    const tick = () => http.get(url, r => { r.resume(); resolve(); }).on("error", () => Date.now() > deadline ? reject(new Error("mock backend never came up")) : setTimeout(tick, 200));
    tick();
  });
}

// Open the app on a fresh "device", wire the backend, seed onboarded state, sign `n` distinct proofs.
async function device(browser, callsign, n, startIndex) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(APP, { waitUntil: "load" });
  await page.evaluate(({ k, cs }) => localStorage.setItem(k, JSON.stringify({ stateVersion: 1, onboardingComplete: true, safetyChecked: true, status: "Foundation Confirmed", recruitQualified: true, profile: { callsign: cs }, debriefCount: 4, activeDays: ["2026-06-0" + (cs.length % 9 + 1)], foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true } })), { k: KEY, cs: callsign });
  await page.goto(`${APP}?backend=${encodeURIComponent(MOCK)}`, { waitUntil: "load" });
  await page.waitForTimeout(300);
  await page.evaluate(({ n, startIndex }) => {
    for (let i = 0; i < n; i++) window.applyProof({ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Proof " + (startIndex + i), friction: "Delay", frictionLevel: "medium", decision: i === 0 ? "Recover" : "Hold", domain: ["body", "mind", "will", "execution"][i % 4], day: 1, minimumOnly: false, quality: 4, source: "reflection" });
    window.render();
  }, { n, startIndex });
  return { ctx, page };
}

const getLedgerLen = page => page.evaluate(k => (JSON.parse(localStorage.getItem(k)).proofLedger || []).length, KEY);
const cloudSync = page => page.evaluate(() => window.cloudSync());

(async () => {
  const mock = spawn(process.execPath, [path.join(__dirname, "..", "mock-backend", "server.js")], { env: { ...process.env, MOCK_PORT: String(MOCK_PORT) }, stdio: "ignore" });
  const shutdown = () => { try { mock.kill(); } catch {} };
  process.on("exit", shutdown);
  try { await waitHttp(`${MOCK}/api/health`, 8000); } catch (e) { console.error("FATAL:", e.message); shutdown(); process.exit(2); }
  ok("mock backend up", true);

  const browser = await chromium.launch();

  // Device A1 (handle "Echo"): 3 proofs, sync.
  const a1 = await device(browser, "Echo", 3, 0);
  await cloudSync(a1.page);
  const a1state = await a1.page.evaluate(k => JSON.parse(localStorage.getItem(k)).cloud, KEY);
  ok("device A1 authed (handle Echo)", a1state.handle === "Echo" && !!a1state.token, JSON.stringify(a1state.handle));
  ok("device A1 synced 3 proofs", (await getLedgerLen(a1.page)) === 3);

  // Device A2 (SAME handle "Echo", different device): 2 DIFFERENT proofs, sync -> lossless union.
  const a2 = await device(browser, "Echo", 2, 100);
  ok("device A2 starts with only its own 2 proofs", (await getLedgerLen(a2.page)) === 2);
  await cloudSync(a2.page);
  const a2len = await getLedgerLen(a2.page);
  ok("device A2 union-merged to 5 (lossless cross-device)", a2len === 5, "len=" + a2len);
  const a2verifies = await a2.page.evaluate(k => window.verifyLedger(JSON.parse(localStorage.getItem(k)).proofLedger), KEY);
  ok("merged ledger still verifies (per-entry tamper-evidence survives merge)", a2verifies);

  // Device A1 re-syncs -> also converges to the union (5).
  await cloudSync(a1.page);
  ok("device A1 re-sync converges to 5", (await getLedgerLen(a1.page)) === 5, "len=" + (await getLedgerLen(a1.page)));

  // Device B (handle "Foxtrot"): independent account -> leaderboard shows both.
  const b = await device(browser, "Foxtrot", 4, 200);
  await cloudSync(b.page);
  const board = await b.page.evaluate(k => JSON.parse(localStorage.getItem(k)).cloud.leaderboard, KEY);
  const handles = (board || []).map(u => u.handle);
  ok("leaderboard lists both accounts", handles.includes("Echo") && handles.includes("Foxtrot"), handles.join(","));

  // Anti-cheat: forge a proof on the wire (edit content, keep signature) -> server rejects it.
  const forged = await b.page.evaluate(async (mock) => {
    const auth = await (await fetch(mock + "/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ callsign: "Cheater" }) })).json();
    const good = { date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "real", friction: "Delay", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "Standard held", quality: 4, source: "reflection", prevHash: "genesis" };
    // compute a valid hash via the page's own hashEntry, then tamper the content AFTER signing
    good.hash = window.hashEntry(good, "genesis");
    good.quality = 5; good.text = "FORGED";
    const r = await (await fetch(mock + "/api/sync", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: auth.token, snapshot: { metrics: {}, proofLedger: [good] } }) })).json();
    return r;
  }, MOCK);
  ok("server rejects a forged proof (anti-cheat)", forged.rejected === 1 && forged.ledger.length === 0, JSON.stringify({ rejected: forged.rejected, len: forged.ledger.length }));

  // Challenge eval: Foxtrot has recoveryProofs >=2? It has 1 (decision Recover on i===0). Use a met one.
  const chal = await b.page.evaluate(async (mock) => {
    const auth = await (await fetch(mock + "/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ callsign: "Foxtrot" }) })).json();
    const r = await (await fetch(mock + "/api/challenges/reflect-15/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: auth.token, snapshot: { metrics: { reflections: 20 } } }) })).json();
    const r2 = await (await fetch(mock + "/api/challenges/reflect-15/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: auth.token, snapshot: { metrics: { reflections: 3 } } }) })).json();
    return { met: r.met, notMet: r2.met };
  }, MOCK);
  ok("challenge met when metric satisfies rule", chal.met === true);
  ok("challenge NOT met when metric falls short", chal.notMet === false);

  // Local-first resilience: kill the backend, sync again -> app does not crash, data intact.
  shutdown();
  await new Promise(r => setTimeout(r, 600));
  const beforeLen = await getLedgerLen(a1.page);
  const errs = [];
  a1.page.on("pageerror", e => errs.push(e.message));
  await cloudSync(a1.page);
  const status = await a1.page.evaluate(k => JSON.parse(localStorage.getItem(k)).cloud.status, KEY);
  ok("cloud down: app survives, data intact", (await getLedgerLen(a1.page)) === beforeLen && errs.length === 0, "errs=" + errs.length);
  ok("cloud down: honest status shown", /unavailable|safe locally/i.test(status || ""), status || "");

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  console.log("note: real, running MOCK backend (in-memory). Production hosting/auth/persistence is Phase B.");
  await browser.close();
  shutdown();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
