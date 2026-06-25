// MOCK Phase-B backend — a real, running reference server (dependency-free, in-memory) that implements
// the Phase-B API contract so the client's cloud layer can be built + tested end-to-end. NOT a
// production backend: no persistence, no real auth, no scale. It exists to prove the contract and the
// server-side anti-cheat (it re-verifies the SAME B4 hash chain the client signs).
const http = require("http");

const PORT = Number(process.env.MOCK_PORT || 4317);

// --- Mirror of the client's B4 hash so the server can independently re-verify submitted proofs. ---
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, "0");
}
function hashEntry(entry, prevHash) {
  const canon = [prevHash, entry.date, entry.status, entry.result, entry.text, entry.friction,
    entry.decision, entry.domain, entry.day, entry.minimumOnly, entry.effect, entry.quality, entry.source].join("␟");
  return fnv1a(canon) + fnv1a(canon + "::salt");
}
// A proof is accepted only if it is unsigned-legacy OR its signature matches its content (anti-cheat).
function proofValid(e) { return !e || typeof e.hash !== "string" || hashEntry(e, e.prevHash) === e.hash; }

function mergeLedgers(a, b) {
  const seen = new Map();
  const keyOf = e => e && (e.hash || [e.date, e.text, e.domain, e.quality, e.decision].join("|"));
  for (const e of [...(a || []), ...(b || [])]) { if (e) { const k = keyOf(e); if (!seen.has(k)) seen.set(k, e); } }
  return [...seen.values()].sort((x, y) => String(y.at || "").localeCompare(String(x.at || ""))).slice(0, 200);
}

const users = new Map(); // token -> { handle, ledger, metrics, completed:Set }
const CHALLENGES = [
  { id: "active-7", title: "7 active days", rule: { metric: "activeDays", gte: 7 } },
  { id: "reflect-15", title: "15 reflections", rule: { metric: "reflections", gte: 15 } },
  { id: "recover-2", title: "Obey recovery 2×", rule: { metric: "recoveryProofs", gte: 2 } },
];

function send(res, code, body) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(body));
}

function rankOf(token) {
  const arr = [...users.values()].sort((a, b) => (b.metrics.activeDays || 0) - (a.metrics.activeDays || 0));
  return arr.findIndex(u => u === users.get(token)) + 1;
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let raw = "";
  req.on("data", c => { raw += c; if (raw.length > 4_000_000) req.destroy(); });
  req.on("end", () => {
    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { return send(res, 400, { error: "bad json" }); }

    if (req.method === "POST" && url.pathname === "/api/auth") {
      const handle = String(body.callsign || "Operator").slice(0, 24).replace(/[^\w-]/g, "") || "Operator";
      const token = "tok_" + handle; // deterministic so the same handle = same account across devices
      if (!users.has(token)) users.set(token, { handle, ledger: [], metrics: {}, completed: new Set() });
      return send(res, 200, { handle, token });
    }

    if (req.method === "POST" && url.pathname === "/api/sync") {
      const u = users.get(body.token);
      if (!u) return send(res, 401, { error: "unknown token" });
      const incoming = (body.snapshot && body.snapshot.proofLedger) || [];
      const accepted = incoming.filter(proofValid);        // server-side anti-cheat: drop forged proofs
      const rejected = incoming.length - accepted.length;
      u.ledger = mergeLedgers(u.ledger, accepted);          // lossless union across the user's devices
      u.metrics = Object.assign({}, body.metrics, (body.snapshot && body.snapshot.metrics) || {});
      u.metrics.totalProofs = u.ledger.length;
      return send(res, 200, { ledger: u.ledger, rejected, rank: rankOf(body.token) });
    }

    if (req.method === "GET" && url.pathname === "/api/leaderboard") {
      const leaderboard = [...users.values()]
        .map(u => ({ handle: u.handle, metric: u.metrics.activeDays || 0 }))
        .sort((a, b) => b.metric - a.metric).slice(0, 50);
      return send(res, 200, { leaderboard });
    }

    if (req.method === "GET" && url.pathname === "/api/challenges") {
      return send(res, 200, { challenges: CHALLENGES.map(c => ({ id: c.id, title: c.title })) });
    }

    const m = url.pathname.match(/^\/api\/challenges\/([^/]+)\/complete$/);
    if (req.method === "POST" && m) {
      const u = users.get(body.token);
      if (!u) return send(res, 401, { error: "unknown token" });
      const ch = CHALLENGES.find(c => c.id === decodeURIComponent(m[1]));
      if (!ch) return send(res, 404, { error: "no such challenge" });
      const metrics = (body.snapshot && body.snapshot.metrics) || {};
      const met = (metrics[ch.rule.metric] || 0) >= ch.rule.gte; // SAME rule-based eval the client uses
      if (met) u.completed.add(ch.id);
      return send(res, 200, { met, completed: [...u.completed] });
    }

    if (url.pathname === "/api/health") return send(res, 200, { ok: true, users: users.size });
    send(res, 404, { error: "not found" });
  });
});

server.listen(PORT, "127.0.0.1", () => console.log(`Mock Phase-B backend on http://127.0.0.1:${PORT}`));
