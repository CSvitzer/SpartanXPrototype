// Maintenance helper: rasterize icon.svg into the PNG sizes PWAs/iOS need (192, 512, 180) using the
// already-installed Playwright Chromium — no image-tooling dependency. Re-run after editing icon.svg.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const svg = fs.readFileSync(path.join(ROOT, "icon.svg"), "utf8");
const SIZES = [192, 512, 180];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const n of SIZES) {
    const sized = svg.replace(/width="\d+"/, `width="${n}"`).replace(/height="\d+"/, `height="${n}"`);
    await page.setViewportSize({ width: n, height: n });
    await page.setContent(`<!doctype html><html><body style="margin:0">${sized}</body></html>`, { waitUntil: "load" });
    const buf = await page.locator("svg").screenshot({ omitBackground: false });
    const out = path.join(ROOT, `icon-${n}.png`);
    fs.writeFileSync(out, buf);
    console.log(`wrote ${out} (${buf.length} bytes)`);
  }
  await browser.close();
})().catch(e => { console.error("ICON GEN ERROR:", e.message); process.exit(1); });
