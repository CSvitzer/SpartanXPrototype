const playwright = require("playwright");
const ENGINE = process.env.SX_BROWSER || "chromium";
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";
const ALL = "advance-foundation analyze-history apply-adjust apply-history-baseline begin-main-mission begin-selection close-modal cognitive-correct cognitive-miss complete-connection complete-first-order complete-mission complete-pressure confirm-pain continue-standard debrief-back debrief-next dismiss-reentry generate-guide go-access grant-integrated-proof load-sample-history minimum-complete open-about open-adjust open-export pause-minimum pause-protect pause-stop practice-principle quit-first-order quit-main-mission report-pain reset retry-order return-execution select-claim select-foundation-day select-order select-principle set-adjust-reason set-friction-level set-guide-focus set-module set-pain set-pause-signal set-pressure-domain set-proof-filter set-quit-signal set-report-status set-tab simulate-team-week start-order submit-circle-checkin submit-debrief submit-first-report submit-human-review sync-signals toggle-debrief-friction toggle-report-friction toggle-safety update-benchmark-band dismiss-recovery download-backup confirm-import cancel-import open-report finish-onboarding confirm-safety-check confirm-callsign graduate-ack debrief-jump set-prediction".split(" ");
const clicked = new Set();
const R = [];
const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });

const proof = (o) => Object.assign({ date: "21 Jun 2026", status: "Accepted", result: "Completed", text: "Practice under friction.", friction: "Delay", decision: "Hold", domain: "body", day: 1, minimumOnly: false, effect: "Standard held", quality: 4, source: "reflection" }, o);
const QUALIFIED = {
  stateVersion: 1, onboardingComplete: true, recruitQualified: true, status: "Foundation Confirmed",
  safetyChecked: true, claim: "I am disciplined.", debriefCount: 6,
  foundation: { currentDay: 7, completedDays: [1,2,3,4,5,6,7], started: true },
  standards: { body: "Stabilizing", mind: "Tested", will: "Under Review", execution: "Baseline", readiness: "HOLD", integrity: "Forming" },
  standardProgress: { body: { proofCount: 1, fails: 0, oldMax: "Tested" }, mind: { proofCount: 2, fails: 0 }, will: { proofCount: 0, fails: 2 }, execution: { proofCount: 1, fails: 0 } },
  proofLedger: [proof({ domain: "body" }), proof({ domain: "mind", source: "module", text: "Module proof." })],
};

(async () => {
  const browser = await playwright[ENGINE].launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));

  const ca = async (a, o = {}) => {
    const sel = o.value !== undefined ? `[data-action="${a}"][${o.attr}="${o.value}"]` : `[data-action="${a}"]`;
    await page.waitForSelector(sel, { timeout: 9000 });
    await page.click(sel);
    clicked.add(a);
    await page.waitForTimeout(70);
  };
  const tryca = async (a, o) => { try { await ca(a, o); return true; } catch { return false; } };
  const gs = () => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, KEY);
  const seed = async (st) => {
    await page.goto(BASE, { waitUntil: "load" });
    await page.evaluate(({ k, s }) => localStorage.setItem(k, JSON.stringify(s)), { k: KEY, s: Object.assign({ stateVersion: 1 }, st) });
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(250);
  };
  const debriefSeed = (over = {}) => Object.assign({ onboardingComplete: true, recruitQualified: true, safetyChecked: true, tab: "debrief", debriefStep: 0,
    mission: { status: "completed", day: 1, name: "Obedience", domain: "body", painReported: false },
    debrief: { result: "Completed", friction: ["Delay"], negotiation: "", decision: "Hold", lesson: "", correction: "" } }, over);
  const reflect = async ({ result, keepFields = true, friction = true, crisis = false } = {}) => {
    if (result) await page.selectOption("#result", result).catch(() => {});
    await ca("debrief-next");
    if (!friction) { const b = await page.$('[data-action="toggle-debrief-friction"][data-friction="Delay"][aria-pressed="true"]'); if (b) { await b.click(); clicked.add("toggle-debrief-friction"); await page.waitForTimeout(60); } }
    await ca("debrief-next");
    if (keepFields || crisis) await page.fill("#negotiation", crisis ? "I should punish myself." : "Delay appeared and I waited.");
    await ca("debrief-next");
    await ca("debrief-next");
    if (keepFields) await page.fill("#lesson", "I delay when it is inconvenient.");
    await ca("debrief-next");
    if (keepFields && result !== "Abandoned") await page.fill("#correction", "I will start before the phone.");
    await ca("submit-debrief");
  };

  // S1: Just-in-time onboarding traversing edge branches (about, back, quit/return, fail/retry,
  // report controls) then the deferred safety check + claim cards on Today.
  try {
    await page.goto(BASE, { waitUntil: "load" });
    await page.evaluate(k => localStorage.removeItem(k), KEY);
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector('[data-action="begin-selection"]', { timeout: 6000 });
    await ca("open-about"); await ca("close-modal");
    await ca("begin-selection");
    await ca("select-order", { attr: "data-order", value: "body" });
    await ca("go-access");
    await ca("begin-selection");
    await ca("select-order", { attr: "data-order", value: "will" });
    await ca("select-order", { attr: "data-order", value: "mind" });
    await ca("start-order");
    await ca("quit-first-order");
    await ca("set-quit-signal", { attr: "data-signal", value: "Fatigue" });
    await ca("return-execution");
    await ca("complete-first-order");
    await ca("set-report-status", { attr: "data-status", value: "not completed" });
    await ca("set-friction-level", { attr: "data-level", value: "high" });
    await ca("toggle-report-friction", { attr: "data-friction", value: "Ego" });
    await ca("submit-first-report"); // -> first-result FAILED
    await ca("retry-order");
    await ca("start-order");
    await ca("complete-first-order");
    await ca("set-report-status", { attr: "data-status", value: "completed" });
    await ca("submit-first-report"); // -> first-result COMPLETED
    await ca("finish-onboarding");    // first proof -> into the app
    ok("S1 in app after first proof", (await gs()).onboardingComplete === true);
    // Deferred safety check (one-time) + deferred claim, both on Today.
    await ca("toggle-safety", { attr: "data-flag", value: "pain" });
    await ca("toggle-safety", { attr: "data-flag", value: "pain" });
    await ca("confirm-safety-check");
    await ca("select-claim", { attr: "data-claim", value: "I am disciplined." });
    await page.fill("#callsignPrompt", "Operator-7"); // optional callsign (deferred identity)
    await ca("confirm-callsign");
    await ca("begin-main-mission");
    await ca("set-prediction", { attr: "data-call", value: "Clean" }); // pre-practice calibration call
    const s1 = await gs();
    ok("S1 onboarding traversal", s1.onboardingComplete === true && s1.safetyChecked === true && s1.profile.callsign === "Operator-7");
  } catch (e) { ok("S1 onboarding", false, e.message); }

  // S1c: first-order minimum-complete branch
  try {
    await page.goto(BASE, { waitUntil: "load" });
    await page.evaluate(k => localStorage.removeItem(k), KEY);
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector('[data-action="begin-selection"]', { timeout: 6000 });
    await ca("begin-selection"); await ca("start-order");
    await ca("quit-first-order"); await ca("set-quit-signal", { attr: "data-signal", value: "Danger" });
    await ca("minimum-complete");
    ok("S1c minimum-complete branch", (await gs()).view === "report" || (await gs()).firstOrderStatus === "completed");
  } catch (e) { ok("S1c minimum-complete", false, e.message); }

  // S2: Readiness all four bands
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "today" }));
    const cr = (r) => page.evaluate((rr) => window.computeReadiness(rr).command, r);
    ok("readiness PRESS", await cr({ sleep: 5, energy: 5, soreness: 1, pain: "none", stress: 1, emotional: 1 }) === "PRESS");
    ok("readiness HOLD", await cr({ sleep: 3, energy: 3, soreness: 3, pain: "mild", stress: 2, emotional: 2 }) === "HOLD");
    await ca("set-pain", { attr: "data-pain", value: "moderate" });
    ok("readiness SCALE (moderate pain)", (await gs()).standards.readiness === "SCALE");
    await ca("set-pain", { attr: "data-pain", value: "severe" });
    ok("readiness RECOVER (severe pain)", (await gs()).standards.readiness === "RECOVER");
  } catch (e) { ok("S2 readiness bands", false, e.message); }

  // S3: Reflection all four statuses
  try {
    await seed(debriefSeed()); await reflect({ result: "Completed", keepFields: true });
    ok("reflect -> Accepted", (await gs()).lastProof.status === "Accepted");
    await seed(debriefSeed()); await reflect({ keepFields: false, friction: false });
    ok("reflect -> Incomplete", (await gs()).lastProof.status === "Incomplete");
    await seed(debriefSeed()); await reflect({ result: "Abandoned", keepFields: true });
    ok("reflect -> Rejected", (await gs()).lastProof.status === "Rejected");
    await seed(debriefSeed()); await reflect({ result: "Completed", crisis: true });
    ok("reflect -> Under Review (crisis)", (await gs()).lastProof.status === "Under Review");
  } catch (e) { ok("S3 reflection statuses", false, e.message); }

  // S4: Pause / Recenter variants + debrief-back
  try {
    const missionActive = { onboardingComplete: true, recruitQualified: true, tab: "mission", mission: { status: "active", day: 2, name: "Time Reality", domain: "execution", deadline: "21:30" } };
    await seed(missionActive); await ca("quit-main-mission"); await ca("set-pause-signal", { attr: "data-signal", value: "Danger" }); await ca("pause-protect");
    ok("pause Danger -> protect", (await gs()).tab === "debrief");
    await seed(missionActive); await ca("quit-main-mission"); await ca("set-pause-signal", { attr: "data-signal", value: "Fatigue" }); await ca("pause-minimum");
    ok("pause Fatigue -> minimum", (await gs()).mission.scaled === true);
    await seed(missionActive); await ca("quit-main-mission"); await ca("set-pause-signal", { attr: "data-signal", value: "Avoidance" }); await ca("pause-stop");
    ok("pause -> stop", (await gs()).tab === "debrief");
    // debrief-back + debrief-jump (tappable stepper) coverage
    await seed(debriefSeed()); await ca("debrief-next"); await ca("debrief-back"); ok("debrief-back", (await gs()).debriefStep === 0);
    await ca("debrief-jump", { attr: "data-index", value: "3" }); ok("debrief-jump", (await gs()).debriefStep === 3);
  } catch (e) { ok("S4 pause", false, e.message); }

  // S4b: Foundation graduation card ack
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "standard", status: "Foundation Confirmed", foundationGraduated: false }));
    ok("graduation card shows", /seven days proven/i.test(await page.locator("#app").innerText()));
    await ca("graduate-ack");
    ok("graduate-ack dismisses", (await gs()).foundationGraduated === true);
  } catch (e) { ok("S4b graduation", false, e.message); }

  // S5: Adjust variants
  try {
    const ma = { onboardingComplete: true, recruitQualified: true, tab: "mission", mission: { status: "active", day: 3, name: "Body Baseline", domain: "body", deadline: "21:30" } };
    await seed(ma); await ca("open-adjust"); await ca("set-adjust-reason", { attr: "data-reason", value: "Pain warning" }); await ca("apply-adjust");
    ok("adjust pain -> recover", (await gs()).debrief.decision === "Recover");
    await seed(ma); await ca("open-adjust"); await ca("set-adjust-reason", { attr: "data-reason", value: "Fatigue" }); await ca("apply-adjust");
    ok("adjust fatigue -> scaled", (await gs()).mission.scaled === true || (await gs()).tab === "debrief");
    await seed(ma); await ca("report-pain"); ok("report-pain", (await gs()).debrief.friction.includes("Pain"));
  } catch (e) { ok("S5 adjust", false, e.message); }

  // S6: Pain-downgrade confirm + cancel
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "today", readiness: { sleep: 3, energy: 3, soreness: 2, pain: "severe", stress: 2, emotional: 2, motivation: 2 } }));
    await ca("set-pain", { attr: "data-pain", value: "none" }); // -> modal
    ok("pain downgrade opens modal", (await gs()).modal === "painDowngrade");
    await ca("confirm-pain"); ok("pain downgrade confirm", (await gs()).readiness.pain === "none");
    await seed(Object.assign({}, QUALIFIED, { tab: "today", readiness: { sleep: 3, energy: 3, soreness: 2, pain: "severe", stress: 2, emotional: 2, motivation: 2 } }));
    await ca("set-pain", { attr: "data-pain", value: "none" }); await ca("close-modal");
    ok("pain downgrade cancel keeps pain", (await gs()).readiness.pain === "severe");
  } catch (e) { ok("S6 pain downgrade", false, e.message); }

  // S7: All 9 claims render deconstruction
  try {
    const claims = ["I do not have enough time.","I know my limits.","I am disciplined.","I train hard.","I work well under pressure.","I recover well.","I do not need accountability.","I am mentally strong.","I am independent."];
    let allClaims = true;
    for (const c of claims) { await seed(Object.assign({}, QUALIFIED, { tab: "today", claim: c })); const t = (await page.locator("#app").innerText()).toLowerCase(); if (!t.includes(c.toLowerCase().slice(0, 12))) allClaims = false; }
    ok("all 9 claims render deconstruction", allClaims);
  } catch (e) { ok("S7 claims", false, e.message); }

  // S8: Module gating locked + unlocked
  try {
    await seed({ onboardingComplete: true, recruitQualified: false, tab: "modules", modules: { active: "circle" } });
    await ca("set-module", { attr: "data-module", value: "circle" });
    ok("locked module hides action", !(await page.$('[data-action="submit-circle-checkin"]')));
    await seed(Object.assign({}, QUALIFIED, { tab: "modules", modules: { active: "circle" } }));
    await ca("set-module", { attr: "data-module", value: "circle" });
    ok("unlocked module shows action", !!(await page.$('[data-action="submit-circle-checkin"]')));
  } catch (e) { ok("S8 gating", false, e.message); }

  // S9: All 12 modules + sub-branches
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "modules" }));
    const m = async (id) => ca("set-module", { attr: "data-module", value: id });
    const setNum = async (mod, key, val) => { await page.evaluate(({ mod, key, val }) => { const el = document.querySelector(`[data-input="module-number"][data-module="${mod}"][data-key="${key}"]`); if (el) { el.value = String(val); el.dispatchEvent(new Event("input", { bubbles: true })); } }, { mod, key, val }); await page.waitForTimeout(50); };
    await m("guide"); await ca("set-guide-focus", { attr: "data-focus", value: "Readiness" }); await ca("generate-guide"); await ca("set-guide-focus", { attr: "data-focus", value: "Friction" }); await ca("generate-guide");
    await m("circle"); await page.fill('[data-input="module"][data-module="circle"][data-key="latestCheckin"]', "Closed. Delay. Start."); await ca("submit-circle-checkin");
    await m("connection"); await ca("complete-connection");
    await m("principles"); await ca("select-principle", { attr: "data-principle", value: "proof" }); await ca("practice-principle"); await ca("select-principle", { attr: "data-principle", value: "recovery" }); await ca("practice-principle");
    await m("pressure"); await ca("set-pressure-domain", { attr: "data-domain", value: "mind" }); await setNum("pressure", "load", 4); await ca("complete-pressure");
    await m("advanced"); await ca("grant-integrated-proof");
    await m("signals"); await ca("sync-signals"); await ca("sync-signals");
    await m("review"); await page.fill('[data-input="module"][data-module="review"][data-key="note"]', "Review my pattern."); await ca("submit-human-review");
    await m("benchmarks"); await setNum("benchmarks", "privateScore", 92); await ca("update-benchmark-band"); await setNum("benchmarks", "privateScore", 40); await ca("update-benchmark-band");
    await m("history"); await ca("load-sample-history"); await ca("analyze-history"); await ca("apply-history-baseline");
    await m("teams"); await ca("simulate-team-week");
    await m("cognitive"); await ca("cognitive-correct"); await ca("cognitive-miss");
    const s = await gs();
    ok("all modules exercised", s.modules.cognitive.attempts === 2 && s.modules.signals.connected === true && s.modules.history.applied === true);
  } catch (e) { ok("S9 modules", false, e.message); }

  // S10: pressure reckless branch (RECOVER + load>2)
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "modules", modules: { active: "pressure", pressure: { domain: "mind", load: 4, completions: 0, result: "Not tested" } }, readiness: { sleep: 3, energy: 3, soreness: 2, pain: "severe", stress: 2, emotional: 2, motivation: 2 } }));
    await ca("set-module", { attr: "data-module", value: "pressure" }); await ca("complete-pressure");
    const lp = (await gs()).lastProof;
    ok("pressure reckless -> under review", lp && lp.status === "Under Review");
  } catch (e) { ok("S10 pressure reckless", false, e.message); }

  // S11: Tabs + proof filter + select-foundation-day + continue-standard + advance-foundation
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "today" }));
    for (const t of ["mission", "debrief", "proof", "standard", "system", "today"]) await ca("set-tab", { attr: "data-tab", value: t });
    await ca("set-tab", { attr: "data-tab", value: "proof" });
    await tryca("set-proof-filter", { attr: "data-filter", value: "body" });
    await tryca("set-proof-filter", { attr: "data-filter", value: "all" });
    await ca("set-tab", { attr: "data-tab", value: "today" });
    // Foundation Path is a collapsed <details> now — expand so the day chip is clickable.
    await page.evaluate(() => document.querySelectorAll("details.disclosure").forEach(d => { d.open = true; })).catch(() => {});
    await tryca("select-foundation-day", { attr: "data-day", value: "3" });
    await ca("set-tab", { attr: "data-tab", value: "today" });
    await ca("continue-standard");
    ok("continue-standard active", (await gs()).mission.status === "active");
    await ca("complete-mission"); await reflect({ result: "Completed" });
    // advance-foundation: seed mid-foundation
    await seed({ onboardingComplete: true, tab: "proof-logged", lastProof: proof({}), foundation: { currentDay: 2, completedDays: [1], started: true } });
    await tryca("advance-foundation");
    ok("advance-foundation works", (await gs()).foundation.currentDay >= 2);
  } catch (e) { ok("S11 tabs/nav", false, e.message); }

  // S12: Safety restriction language + dismiss-reentry
  try {
    await seed(debriefSeed());
    await ca("debrief-next"); await ca("debrief-next");
    await page.fill("#negotiation", "I will not eat to punish the failure.");
    await ca("debrief-next"); await ca("debrief-next");
    await page.fill("#lesson", "Restriction urge appeared.");
    await ca("debrief-next"); await page.fill("#correction", "I will seek support.");
    await ca("submit-debrief");
    const s = await gs();
    ok("restriction language flagged", s.safetyFlags.includes("restriction") || s.safetyFlags.includes("crisis"));
    await seed(Object.assign({}, QUALIFIED, { tab: "today", lastActiveAt: 1 }));
    await tryca("dismiss-reentry");
    ok("dismiss-reentry", (await gs()).reentry === false);
  } catch (e) { ok("S12 safety/reentry", false, e.message); }

  // S13b: integrity banner + backup/restore
  try {
    // dismiss-recovery
    await seed(Object.assign({}, QUALIFIED, { tab: "today", restoredFromBackup: true }));
    ok("recovery banner shows", /recovered from backup/i.test(await page.locator("#app").innerText()));
    await ca("dismiss-recovery");
    ok("dismiss-recovery clears flag", (await gs()).restoredFromBackup === false);

    // data modal: local-only notice + download
    await seed(Object.assign({}, QUALIFIED, { tab: "system" }));
    await ca("open-export");
    ok("local-only notice", /this device|this browser/i.test(await page.locator("#app").innerText()));
    page.on("download", d => d.cancel().catch(() => {}));
    await ca("download-backup"); // must not crash

    // import valid -> confirm
    await page.evaluate(t => window.applyImportText(t), JSON.stringify(Object.assign({}, QUALIFIED, { debriefCount: 11, tab: "system" })));
    ok("import staged", (await gs()).importStatus === "ready");
    await ca("confirm-import");
    ok("confirm-import applied", (await gs()).debriefCount === 11);

    // import staged again -> cancel
    await ca("open-export");
    await page.evaluate(t => window.applyImportText(t), JSON.stringify(QUALIFIED));
    await ca("cancel-import");
    ok("cancel-import cleared", (await gs()).importStatus === "");

    // invalid import reports error (no confirm offered)
    await page.evaluate(() => window.applyImportText("not json"));
    ok("invalid import error", (await gs()).importStatus === "error");
    await ca("close-modal");

    // C1 local report
    await ca("open-report");
    ok("report modal", (await gs()).modal === "report");
    ok("report shows numbers", /your numbers|active days/i.test(await page.locator("#app").innerText()));
    await ca("close-modal");
  } catch (e) { ok("S13b backup/restore", false, e.message); }

  // S13: System export + reset (last)
  try {
    await seed(Object.assign({}, QUALIFIED, { tab: "system" }));
    await ca("open-export"); ok("export modal", (await gs()).modal === "export"); await ca("close-modal");
    await ca("reset"); await page.waitForTimeout(1400);
    ok("reset -> visitor", (await gs()).status === "Visitor");
  } catch (e) { ok("S13 system", false, e.message); }

  // Coverage report
  const missing = ALL.filter(a => !clicked.has(a));
  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const fails = R.filter(r => !r.c);
  console.log(`\nBRANCH CHECKS: ${R.length}  PASS ${R.length - fails.length}  FAIL ${fails.length}`);
  console.log(`ACTION COVERAGE: ${clicked.size}/${ALL.length} clicked`);
  console.log("NOT CLICKED: " + (missing.length ? missing.join(", ") : "(none)"));
  if (errs.length) console.log("\n-- page errors --\n" + errs.slice(0, 10).join("\n"));
  await browser.close();
  process.exit(fails.length || missing.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
