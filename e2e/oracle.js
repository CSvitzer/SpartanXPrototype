// Differential oracle: an INDEPENDENT reference of the rule engine (from PRD §5 + documented
// amendments) swept across full input grids and compared to the app's actual pure functions.
// A mismatch = real logic drift. No app changes; runs against the app's window globals.
const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const KEY = "spartan-x-prototype-state";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(k => localStorage.removeItem(k), KEY); // clean state: no safety/overtraining flags
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(700);

  const res = await page.evaluate(() => {
    const cat = () => ({ n: 0, mismatch: 0, samples: [] });
    const out = { readiness: cat(), score: cat(), effect: cat(), label: cat(), level: cat() };
    const cmp = (o, got, exp, ctx) => { o.n++; if (got !== exp) { o.mismatch++; if (o.samples.length < 6) o.samples.push({ ...ctx, got, exp }); } };

    // PRD §5.2 readiness (+ #9: PRESS also requires no stress flag). Clean state => no safety/overtraining.
    const refReadiness = (r) => {
      const stressFlag = r.stress >= 4 || r.emotional >= 4, sleepDebt = r.sleep <= 2, sorenessFlag = r.soreness >= 4, lowEnergy = r.energy <= 2;
      if (r.pain === "severe" || (r.sleep === 1 && r.energy === 1 && r.soreness >= 4)) return "RECOVER";
      if (r.pain === "moderate" || (sleepDebt && sorenessFlag) || (sleepDebt && lowEnergy) || (stressFlag && lowEnergy)) return "SCALE";
      if (r.energy >= 4 && r.sleep >= 4 && r.soreness <= 2 && r.pain === "none" && !stressFlag) return "PRESS";
      return "HOLD";
    };
    const pains = ["none", "mild", "moderate", "severe"];
    for (let sleep = 1; sleep <= 5; sleep++) for (let energy = 1; energy <= 5; energy++) for (let soreness = 1; soreness <= 5; soreness++)
      for (const pain of pains) for (let stress = 1; stress <= 5; stress++) for (let emotional = 1; emotional <= 5; emotional++) {
        const r = { sleep, energy, soreness, pain, stress, emotional, motivation: 3 };
        cmp(out.readiness, window.computeReadiness(r).command, refReadiness(r), { r });
      }

    // PRD §5.6 AAR score
    const refScore = (d) => (d.friction.length ? 1 : 0) + (d.negotiation.trim().length >= 4 ? 1 : 0) + (d.decision ? 1 : 0) + (d.lesson.trim().length >= 8 ? 1 : 0) + (d.correction.trim().length >= 8 ? 1 : 0);
    for (const f of [[], ["Delay"]]) for (const n of ["", "xxxx"]) for (const de of ["", "Hold"]) for (const l of ["", "12345678"]) for (const c of ["", "12345678"]) {
      const d = { friction: f, negotiation: n, decision: de, lesson: l, correction: c };
      cmp(out.score, window.scoreDebrief(d), refScore(d), { d });
    }

    // §5.6 quality labels
    const refLabel = (s) => s <= 0 ? "Missing" : s === 1 ? "Weak" : s <= 3 ? "Acceptable" : s === 4 ? "Strong" : "Operational";
    for (let s = -1; s <= 6; s++) cmp(out.label, window.qualityLabel(s), refLabel(s), { s });

    // §5.5/5.9 standard effect
    const refEffect = (st, q, m) => st === "Accepted" && m ? "Minimum logged; no elevation" : st === "Accepted" && q >= 4 ? "Standard stabilized" : st === "Accepted" ? "Standard held" : st === "Incomplete" ? "No elevation" : st === "Under Review" ? "Safety review" : "Proof rejected";
    for (const st of ["Accepted", "Incomplete", "Under Review", "Rejected"]) for (let q = 0; q <= 5; q++) for (const m of [false, true]) cmp(out.effect, window.standardEffect(st, q, m), refEffect(st, q, m), { st, q, m });

    // §5.9 ladder
    const LV = ["Untested", "Tested", "Stabilizing", "Baseline", "Elevated"];
    const refNext = (lv) => { const i = LV.indexOf(lv); return i < 0 ? "Tested" : LV[Math.min(i + 1, LV.length - 1)]; };
    for (const lv of LV.concat(["Forming", "Regressed", "Under Review"])) cmp(out.level, window.nextStandardLevel(lv), refNext(lv), { lv });

    return out;
  });

  let total = 0, swept = 0;
  for (const [k, v] of Object.entries(res)) {
    swept += v.n; total += v.mismatch;
    console.log(`${k}: swept ${v.n}, mismatches ${v.mismatch}`);
    v.samples.forEach(s => console.log("   " + JSON.stringify(s)));
  }
  console.log(`\nORACLE: ${swept} cases swept, ${total} mismatches`);
  await browser.close();
  process.exit(total ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
