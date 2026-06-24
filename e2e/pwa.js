// Mock-and-test the PWA install + offline contract that a real device relies on (the machine-testable
// core of "real-device test #12"). Chromium only — it supports service workers (Playwright WebKit
// does not; real iOS Safari does, but that genuinely needs a device).
const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const R = [];
  const ok = (n, c, d) => R.push({ n, c: !!c, d: d || "" });
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  await page.goto(BASE, { waitUntil: "load" });

  // 1. Manifest is valid + has the installability fields.
  const manifest = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return null;
    const res = await fetch(link.href);
    return res.ok ? res.json() : null;
  });
  ok("manifest linked + fetchable", !!manifest);
  if (manifest) {
    ok("manifest name", !!manifest.name);
    ok("manifest display=standalone", manifest.display === "standalone");
    ok("manifest start_url", !!manifest.start_url);
    ok("manifest theme_color", !!manifest.theme_color);
    const sizes = (manifest.icons || []).map(i => i.sizes);
    ok("manifest has 192 + 512 icons", sizes.includes("192x192") && sizes.includes("512x512"), sizes.join(","));
    ok("manifest has a maskable icon", (manifest.icons || []).some(i => /maskable/.test(i.purpose || "")));
  }

  // 2. apple-touch-icon present (iOS home-screen icon) and is a PNG.
  const apple = await page.evaluate(() => { const l = document.querySelector('link[rel="apple-touch-icon"]'); return l ? l.getAttribute("href") : null; });
  ok("apple-touch-icon present", !!apple && /\.png$/.test(apple), apple || "");

  // 3. Icons actually resolve as image/png.
  for (const p of ["icon-192.png", "icon-512.png", "icon-180.png"]) {
    const r = await page.evaluate(async u => { const res = await fetch(u); return { ok: res.ok, type: res.headers.get("content-type") }; }, BASE + p);
    ok(`icon ${p} serves image/png`, r.ok && /image\/png/.test(r.type || ""), r.type || "");
  }

  // 4. Service worker registers AND activates (with a timeout guard so it can't hang).
  const swActive = await page.evaluate(() => Promise.race([
    navigator.serviceWorker.ready.then(reg => !!(reg && reg.active)),
    new Promise(res => setTimeout(() => res(false), 8000)),
  ]));
  ok("service worker registered + active", swActive);

  // 5. Offline: with the SW active, going offline and reloading still renders the app (installed PWA).
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: "load" }); // second load so the SW controls the page
  await ctx.setOffline(true);
  await page.reload({ waitUntil: "load" });
  const offlineText = await page.locator("#app").innerText().catch(() => "");
  ok("renders offline (served from SW cache)", offlineText.length > 40, "len=" + offlineText.length);
  await ctx.setOffline(false);

  ok("no uncaught errors", errs.length === 0, errs[0] || "");

  console.log(R.map(r => `${r.c ? "PASS" : "FAIL"} - ${r.n}${r.d ? " :: " + r.d : ""}`).join("\n"));
  const f = R.filter(r => !r.c);
  console.log(`\nTOTAL ${R.length}  PASS ${R.length - f.length}  FAIL ${f.length}`);
  console.log("note: real iOS/Android home-screen install behaviour still needs a physical device.");
  await browser.close();
  process.exit(f.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
