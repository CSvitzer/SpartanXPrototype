// A5: cross-engine matrix. Re-runs the DOM-interaction layers on WebKit (≈ iOS/macOS Safari) and
// Firefox to catch engine-specific breakage without a device. The pure-logic layers (oracle, fuzz,
// progression) are engine-agnostic, so only the interaction layers are matrixed here. Chromium is
// already covered by run-all. Assumes a server is reachable at SX_URL.
const { spawn } = require("child_process");
const path = require("path");
const BASE = process.env.SX_URL || "http://127.0.0.1:4173/";
const ENGINES = (process.env.SX_ENGINES || "firefox,webkit").split(",");
const SCRIPTS = ["deep-playthrough.js", "full-coverage.js", "storage-chaos.js", "a11y.js"];

function run(script, engine) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [path.join(__dirname, script)], {
      cwd: __dirname,
      env: { ...process.env, SX_URL: BASE, SX_BROWSER: engine },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let tail = "";
    const cap = d => { tail = (tail + d.toString()).split("\n").slice(-4).join("\n"); };
    child.stdout.on("data", cap);
    child.stderr.on("data", cap);
    child.on("close", code => resolve({ script, engine, code, tail }));
  });
}

(async () => {
  const results = [];
  for (const engine of ENGINES) {
    for (const script of SCRIPTS) {
      process.stdout.write(`\n--- ${engine} : ${script} ---\n`);
      let r = await run(script, engine);
      if (r.code !== 0) {
        // Retry once: WebKit/Firefox launches under the heavy matrix occasionally race transiently.
        console.log(`(retry ${engine}:${script} after non-zero exit)`);
        r = await run(script, engine);
      }
      console.log(r.tail.trim());
      console.log(`${r.code === 0 ? "OK" : "FAIL"} (${engine}:${script})`);
      results.push(r);
    }
  }
  const failed = results.filter(r => r.code !== 0);
  console.log("\n──── CROSS-ENGINE SUMMARY ────");
  results.forEach(r => console.log(`${r.code === 0 ? "PASS" : "FAIL"}  ${r.engine}:${r.script}`));
  console.log(`\n${results.length - failed.length}/${results.length} cross-engine runs passed`);
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
