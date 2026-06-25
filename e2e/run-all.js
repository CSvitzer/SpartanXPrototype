// D1: single CI entrypoint. Starts the static server, runs every test layer against it, tears the
// server down, and exits non-zero if any layer fails. Used locally (`npm run all`) and in CI.
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 4173;
const BASE = `http://127.0.0.1:${PORT}/`;

// Each layer is one script + the env it needs. Order: cheapest/broadest first.
const LAYERS = [
  { name: "qa (browser unit suite)", script: "qa-headless.js" },
  { name: "deep-playthrough", script: "deep-playthrough.js" },
  { name: "full-coverage", script: "full-coverage.js" },
  { name: "oracle", script: "oracle.js" },
  { name: "storage-chaos", script: "storage-chaos.js" },
  { name: "fuzz (fresh)", script: "fuzz.js" },
  { name: "fuzz (qualified)", script: "fuzz.js", env: { QUALIFIED: "1" } },
  { name: "clock-fuzz", script: "clock-fuzz.js" },
  { name: "a11y (axe + keyboard)", script: "a11y.js" },
  { name: "visual (layout sanity)", script: "visual.js" },
  { name: "pwa (install + offline)", script: "pwa.js" },
  { name: "sync-readiness (mock round-trip)", script: "sync-readiness.js" },
  { name: "phaseb (mock cloud sync)", script: "phaseb.js" },
  { name: "progression", script: "progression.js" },
  { name: "cross-engine (firefox+webkit)", script: "cross-engine.js" },
];

function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(BASE, res => { res.resume(); resolve(); });
      req.on("error", () => {
        if (Date.now() > deadline) reject(new Error("server did not start"));
        else setTimeout(tryOnce, 200);
      });
    };
    tryOnce();
  });
}

function runLayer(layer) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [path.join(__dirname, layer.script)], {
      cwd: __dirname,
      env: { ...process.env, SX_URL: BASE, ...(layer.env || {}) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let tail = "";
    const capture = d => { tail = (tail + d.toString()).split("\n").slice(-6).join("\n"); };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    child.on("close", code => resolve({ name: layer.name, code, tail }));
  });
}

(async () => {
  const server = spawn(process.execPath, [path.join(ROOT, "serve.js")], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });
  const shutdown = () => { try { server.kill(); } catch {} };
  process.on("exit", shutdown);
  process.on("SIGINT", () => { shutdown(); process.exit(130); });

  try {
    await waitForServer(10000);
  } catch (e) {
    console.error("FATAL:", e.message);
    shutdown();
    process.exit(2);
  }

  const results = [];
  for (const layer of LAYERS) {
    process.stdout.write(`\n=== ${layer.name} ===\n`);
    const r = await runLayer(layer);
    console.log(r.tail.trim());
    console.log(`${r.code === 0 ? "OK" : "FAIL"} (${layer.name})`);
    results.push(r);
  }

  shutdown();
  const failed = results.filter(r => r.code !== 0);
  console.log("\n──────── SUMMARY ────────");
  results.forEach(r => console.log(`${r.code === 0 ? "PASS" : "FAIL"}  ${r.name}`));
  console.log(`\n${results.length - failed.length}/${results.length} layers passed`);
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error("RUNNER ERROR:", e.message); process.exit(2); });
