const playwright = require("playwright");
const ENGINE = process.env.SX_BROWSER || "chromium";
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const R = [];
function ok(n, c, d) { R.push({ n, c: !!c, d: d || "" }); }

(async () => {
  const browser = await playwright[ENGINE].launch();
  const page = await browser.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));

  const ca = async (a, o = {}) => {
    const sel = o.value !== undefined ? `[data-action="${a}"][${o.attr}="${o.value}"]` : `[data-action="${a}"]`;
    await page.waitForSelector(sel, { timeout: 9000 });
    await page.click(sel);
    await page.waitForTimeout(90);
  };
  const fill = async (sel, v) => { await page.waitForSelector(sel, { timeout: 9000 }); await page.fill(sel, v); };
  const setRange = async (group, key, val, moduleId) => {
    await page.evaluate(({ group, key, val, moduleId }) => {
      const sel = moduleId
        ? `[data-input="module-number"][data-module="${moduleId}"][data-key="${key}"]`
        : `[data-input="${group}"][data-key="${key}"]`;
      const el = document.querySelector(sel);
      if (el) { el.value = String(val); el.dispatchEvent(new Event("input", { bubbles: true })); }
    }, { group, key, val, moduleId });
    await page.waitForTimeout(60);
  };
  const gs = () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem("spartan-x-prototype-state")); } catch { return null; } });
  const submitReflection = async (crisisText) => {
    await ca("debrief-next");
    await ca("debrief-next");
    await fill("#negotiation", crisisText || "Delay appeared and I negotiated the start.");
    await ca("debrief-next");
    await ca("debrief-next");
    await fill("#lesson", "I delay when the practice is simple but inconvenient.");
    await ca("debrief-next");
    await fill("#correction", "I will start before checking my phone.");
    await ca("submit-debrief");
  };

  // PHASE 1: Onboarding
  try {
    await page.goto(BASE, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector('[data-action="begin-selection"]', { timeout: 6000 });
    await ca("begin-selection");
    await ca("select-order", { attr: "data-order", value: "mind" });
    await ca("start-order");
    await ca("complete-first-order");
    await ca("submit-first-report");
    await ca("finish-onboarding"); // first proof -> straight into the app
    const inApp = await gs();
    ok("onboarding complete after first proof", inApp && inApp.onboardingComplete === true && inApp.status === "Foundation Candidate");
    ok("claim deferred (not set during onboarding)", inApp && inApp.claim === "");
    ok("safety check deferred", inApp && inApp.safetyChecked === false);
    // Just-in-time: one-time safety check on Today, then deferred claim card.
    await ca("toggle-safety", { attr: "data-flag", value: "injury" });
    await ca("toggle-safety", { attr: "data-flag", value: "injury" });
    await ca("confirm-safety-check");
    await ca("select-claim", { attr: "data-claim", value: "I am disciplined." });
    const s = await gs();
    ok("safety check confirmed", s && s.safetyChecked === true);
    ok("claim captured on Today", s && s.claim === "I am disciplined.");
  } catch (e) { ok("PHASE1 onboarding", false, e.message); }

  // PHASE 2: 7-day Foundation with edge flows
  try {
    await ca("begin-main-mission");
    await ca("open-adjust");
    await ca("set-adjust-reason", { attr: "data-reason", value: "Pain warning" });
    await ca("apply-adjust");
    let s = await gs();
    ok("adjust pain -> recover decision", s && s.debrief.decision === "Recover" && s.tab === "debrief");
    await submitReflection();
    ok("day1 proof logged", (await gs()).lastProof != null);
    await ca("advance-foundation");

    await ca("begin-main-mission");
    await ca("quit-main-mission");
    await ca("set-pause-signal", { attr: "data-signal", value: "Danger" });
    await ca("pause-protect");
    ok("pause danger -> reflection", (await gs()).tab === "debrief");
    await submitReflection();
    await ca("advance-foundation");

    await ca("begin-main-mission");
    await ca("report-pain");
    s = await gs();
    ok("report pain -> pain friction + reflection", s && s.tab === "debrief" && s.debrief.friction.includes("Pain"));
    await submitReflection();
    await ca("advance-foundation");

    s = await gs();
    if (s.readiness.pain !== "none") {
      await ca("set-pain", { attr: "data-pain", value: "none" });
      const mid = await gs();
      ok("pain downgrade asks confirm", mid.modal === "painDowngrade" && mid.readiness.pain !== "none");
      await ca("confirm-pain");
      ok("pain downgrade confirmed", (await gs()).readiness.pain === "none");
    } else { ok("pain downgrade asks confirm", true, "skipped: pain none"); ok("pain downgrade confirmed", true, "skipped"); }

    for (let d = 4; d <= 7; d++) {
      await ca("begin-main-mission");
      await ca("complete-mission");
      await submitReflection();
      await ca("advance-foundation");
    }
    s = await gs();
    ok("foundation completed (7 days)", s && s.foundation.completedDays.length === 7);
    ok("foundation confirmed + qualified", s && s.status === "Foundation Confirmed" && s.recruitQualified === true);
  } catch (e) { ok("PHASE2 foundation", false, e.message); }

  // PHASE 3: Continue Standard loop
  try {
    await ca("set-tab", { attr: "data-tab", value: "today" });
    await ca("continue-standard");
    let s = await gs();
    ok("continue standard assigns weakest-domain", s && s.mission.name === "Continued Standard" && s.mission.status === "active");
    await ca("complete-mission");
    await submitReflection();
    ok("continued proof logged", (await gs()).lastProof != null);
    await ca("continue-standard");
    ok("continue loop repeatable", (await gs()).mission.status === "active");
    await ca("complete-mission");
    await submitReflection();
  } catch (e) { ok("PHASE3 continue", false, e.message); }

  // PHASE 4: Readiness
  try {
    await ca("set-tab", { attr: "data-tab", value: "today" });
    await ca("set-pain", { attr: "data-pain", value: "severe" });
    ok("severe pain -> RECOVER (live)", (await gs()).standards.readiness === "RECOVER");
    await ca("set-pain", { attr: "data-pain", value: "none" });
    await ca("confirm-pain");
    await setRange("readiness", "sleep", 5);
    ok("readiness slider updates state", (await gs()).readiness.sleep === 5);
  } catch (e) { ok("PHASE4 readiness", false, e.message); }

  // PHASE 5: All 12 modules
  const m = {};
  try {
    await ca("set-tab", { attr: "data-tab", value: "modules" });
    const mod = async (id) => ca("set-module", { attr: "data-module", value: id });

    await mod("guide"); await ca("set-guide-focus", { attr: "data-focus", value: "Readiness" }); await ca("generate-guide");
    m.guide = (await gs()).modules.guide.answer.length > 0;
    await mod("circle");
    await fill('[data-input="module"][data-module="circle"][data-key="latestCheckin"]', "Practice closed. Delay. Start before phone.");
    await ca("submit-circle-checkin");
    m.circle = (await gs()).modules.circle.checkins[0].name === "You"; // name defaults to "You" (account step dropped)
    await mod("connection"); await ca("complete-connection");
    m.connection = (await gs()).modules.connection.completed.length > 0;
    await mod("principles"); await ca("select-principle", { attr: "data-principle", value: "proof" }); await ca("practice-principle");
    m.principles = (await gs()).modules.principles.practiced.includes("proof");
    await mod("pressure"); await ca("set-pressure-domain", { attr: "data-domain", value: "mind" }); await setRange(null, "load", 4, "pressure"); await ca("complete-pressure");
    m.pressure = (await gs()).modules.pressure.completions > 0;
    await mod("advanced"); const bAdv = (await gs()).modules.advanced.integratedProofs; await ca("grant-integrated-proof");
    m.advanced = (await gs()).modules.advanced.integratedProofs === bAdv + 1;
    await mod("signals"); await ca("sync-signals");
    m.signals = (await gs()).modules.signals.connected === true;
    await mod("review");
    await fill('[data-input="module"][data-module="review"][data-key="note"]', "Review my repeated pressure pattern.");
    await ca("submit-human-review");
    m.review = (await gs()).modules.review.submitted === true;
    await mod("benchmarks"); await setRange(null, "privateScore", 92, "benchmarks"); await ca("update-benchmark-band");
    m.benchmarks = (await gs()).modules.benchmarks.band === "Advanced";
    await mod("history"); await ca("load-sample-history"); await ca("analyze-history"); await ca("apply-history-baseline");
    m.history = (await gs()).modules.history.applied === true;
    await mod("cognitive"); await ca("cognitive-correct"); await ca("cognitive-miss");
    m.cognitive = (await gs()).modules.cognitive.attempts === 2;
    for (const [k, v] of Object.entries(m)) ok("module: " + k, v);
  } catch (e) { ok("PHASE5 modules", false, e.message + " | done=" + JSON.stringify(m)); }

  // PHASE 6: Standard / Proof / Deconstruction / System
  try {
    await ca("set-tab", { attr: "data-tab", value: "standard" });
    const txt = (await page.locator("#app").innerText()).toLowerCase();
    ok("standard qualification ladder", txt.includes("qualification ladder") || txt.includes("foundation confirmed"));
    ok("standard elevation progress", txt.includes("to elevate") || txt.includes("baseline") || txt.includes("top standard"));
    await ca("set-tab", { attr: "data-tab", value: "proof" });
    const domains = await page.$$eval('[data-action="set-proof-filter"]', els => els.map(e => e.getAttribute("data-filter")));
    ok("proof domain filters", domains.length > 1, "filters=" + domains.join(","));
    const ptxt = (await page.locator("#app").innerText()).toLowerCase();
    ok("proof source tag", ptxt.includes("reflection") || ptxt.includes("module"));
    await ca("set-tab", { attr: "data-tab", value: "today" });
    const ttxt = (await page.locator("#app").innerText()).toLowerCase();
    ok("deconstruction visible", ttxt.includes("active claim") || ttxt.includes("evidence") || ttxt.includes("contradiction") || ttxt.includes("doctrine"));
    await ca("set-tab", { attr: "data-tab", value: "system" });
    await ca("open-export");
    ok("export modal opens", (await gs()).modal === "export");
    await ca("close-modal");
  } catch (e) { ok("PHASE6 tabs", false, e.message); }

  // PHASE 7: Safety language -> crisis
  try {
    await ca("set-tab", { attr: "data-tab", value: "today" });
    await ca("continue-standard");
    await ca("complete-mission");
    await submitReflection("I should punish myself for failing.");
    const s = await gs();
    ok("safety language -> self-punishment flag", s.safetyFlags.includes("self-punishment"));
    ok("safety proof under review", s.lastProof.status === "Under Review");
    await ca("set-tab", { attr: "data-tab", value: "today" });
    ok("support resources shown for critical flag", (await page.locator("#app").innerText()).toLowerCase().includes("findahelpline"));
  } catch (e) { ok("PHASE7 safety", false, e.message); }

  // PHASE 8: Offline (service-worker backed). Playwright's WebKit build does not support service
  // workers, so navigator.serviceWorker.ready never resolves there — skip with a logged note (real
  // iOS Safari does support SW; this is a test-harness limit, not an app limit). Guard ready() with
  // a timeout regardless so it can never hang the run.
  if (ENGINE === "webkit") {
    console.log("  note: offline/service-worker test skipped on webkit (Playwright WebKit lacks SW support)");
  } else {
    try {
      await Promise.race([
        page.evaluate(async () => { if (navigator.serviceWorker) await navigator.serviceWorker.ready; }),
        page.waitForTimeout(5000),
      ]);
      await page.reload({ waitUntil: "load" });
      await page.context().setOffline(true);
      await page.reload({ waitUntil: "load" });
      const offTxt = await page.locator("#app").innerText().catch(() => "");
      ok("works offline", offTxt.length > 60, "len=" + offTxt.length);
      await page.context().setOffline(false);
    } catch (e) { ok("PHASE8 offline", false, e.message); }
  }

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  if (errs.length) console.log("\n-- page errors --\n" + errs.slice(0, 8).join("\n"));
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
