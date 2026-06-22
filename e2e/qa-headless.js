// Headless runner for the dependency-free browser QA suite (qa.html). Loads the page, clicks
// "Run all tests", waits for the run to finish, and reports each result. Lets the in-browser
// unit suite run in CI alongside the Playwright e2e scripts. Exit 0 = all passed.
const { chromium } = require("playwright");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  await page.goto(BASE + "qa.html", { waitUntil: "load" });
  await page.click("#runAll");
  // The runner disables #runAll for the duration and re-enables it in a finally block.
  await page.waitForSelector("#runAll:not([disabled])", { timeout: 180000 });
  await page.waitForTimeout(200);

  const results = await page.$$eval("#results li", items => items.map(li => ({
    pass: li.classList.contains("pass"),
    name: (li.querySelector("strong") || {}).textContent || li.textContent,
    detail: (li.querySelector("span") || {}).textContent || "",
  })));

  // r.name already begins with "PASS - " / "FAIL - " from the in-page renderer.
  results.forEach(r => console.log(`${r.name}${r.pass ? "" : " :: " + r.detail}`));
  const failed = results.filter(r => !r.pass);
  console.log(`\nTOTAL ${results.length}  PASS ${results.length - failed.length}  FAIL ${failed.length}`);
  if (errs.length) console.log("PAGE ERRORS:\n" + errs.join("\n"));

  await browser.close();
  // The browser runner stops at the first failure, so an early stop also means fewer than expected.
  process.exit(failed.length || results.length < 50 ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
