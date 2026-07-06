const STORAGE_KEY = "spartan-x-prototype-state";
const BACKUP_KEY = "spartan-x-prototype-state-backup";
const LASTGOOD_KEY = "spartan-x-prototype-state-lastgood";
const STATE_VERSION = 1;
// Optional, non-coercive support link. Empty = nothing renders (the honest default — no nag, nothing
// gated). Set to your Ko-fi / GitHub Sponsors / Patreon URL to show a quiet "back the standard" link.
const SUPPORT_URL = "";

const ORDER_COPY = {
  body: {
    label: "Body Practice",
    minutes: 2,
    domain: "body",
    brief: "2 minutes controlled movement. No equipment. No intensity required.",
    active: "Move with control. Do not chase intensity. Return and report.",
  },
  mind: {
    label: "Mind Practice",
    minutes: 3,
    domain: "mind",
    brief: "3 minutes no-distraction focus. Single target. Phone down.",
    active: "Single target. No switching. No checking. Return and report.",
  },
  will: {
    label: "Will Practice",
    minutes: 3,
    domain: "will",
    brief: "Write the excuse you use most. No editing. No explanation.",
    active: "Write the excuse you use most. No editing. No explanation. Return and report.",
  },
};

const CLAIMS = [
  "I do not have enough time.",
  "I know my limits.",
  "I am disciplined.",
  "I train hard.",
  "I work well under pressure.",
  "I recover well.",
  "I do not need accountability.",
  "I am mentally strong.",
  "I am independent.",
];

const FRICTION_TYPES = [
  "Delay",
  "Time",
  "Boredom",
  "Fatigue",
  "Ego",
  "Distraction",
  "Avoidance",
  "Pain",
  "Embarrassment",
  "Negotiation",
];

const TABS = ["today", "mission", "debrief", "proof", "standard"];
const STANDARD_LEVELS = ["Untested", "Tested", "Stabilizing", "Baseline", "Elevated"];
const TRAINABLE_DOMAINS = ["body", "mind", "will", "execution"];
// Shared by the one-time safety card AND the System safety panel so the two never drift.
const SAFETY_OPTIONS = [
  ["injury", "Currently injured"],
  ["pain", "Pain worsens with movement"],
  ["medical", "Told not to exercise"],
  ["crisis", "Currently in crisis"],
  ["self-punishment", "Training as punishment"],
  ["restriction", "Extreme food restriction"],
];
const TAB_LABELS = {
  today: "Today",
  mission: "Practice",
  debrief: "Reflection",
  proof: "Proof",
  standard: "Standard",
};

const FOUNDATION_DAYS = [
  {
    day: 1,
    name: "Obedience",
    domain: "body",
    objective: "Complete one 10-minute movement practice before 18:00.",
    knownThreat: "Delay",
    standard: "Start before comfort.",
    minimum: "2 minutes controlled movement.",
    deadline: "21:30",
  },
  {
    day: 2,
    name: "Time Reality",
    domain: "execution",
    objective: "Run a 15-minute time audit and identify one protected practice window.",
    knownThreat: "Self-story",
    standard: "Evidence before claim.",
    minimum: "List 3 time leaks and one usable window.",
    deadline: "21:30",
  },
  {
    day: 3,
    name: "Body Baseline",
    domain: "body",
    objective: "Complete 10 minutes movement with controlled pacing.",
    knownThreat: "Intensity chasing",
    standard: "Control before output.",
    minimum: "2 minutes controlled movement.",
    deadline: "21:30",
  },
  {
    day: 4,
    name: "Focus Baseline",
    domain: "mind",
    objective: "Complete 10 minutes single-target focus with phone out of reach.",
    knownThreat: "Switching",
    standard: "Attention returns without drama.",
    minimum: "3 minutes single-target focus.",
    deadline: "21:30",
  },
  {
    day: 5,
    name: "No-Mood Execution",
    domain: "will",
    objective: "Start one avoided task before mood improves.",
    knownThreat: "Negotiation",
    standard: "Action before readiness feeling.",
    minimum: "Start for 5 minutes and reflect honestly.",
    deadline: "21:30",
  },
  {
    day: 6,
    name: "Recovery Obedience",
    domain: "readiness",
    objective: "Complete a downregulation practice and set a sleep window.",
    knownThreat: "Ego override",
    standard: "Recovery counts when recovery is the standard.",
    minimum: "2 minutes breathing and a written sleep window.",
    deadline: "21:30",
  },
  {
    day: 7,
    name: "Full Reflection",
    domain: "integrity",
    objective: "Review the week and identify the claim evidence that changed.",
    knownThreat: "Selective memory",
    standard: "No false progress without evidence.",
    minimum: "One honest claim update and one correction.",
    deadline: "21:30",
  },
];

const ADJUST_REASONS = [
  "Time constraint",
  "Fatigue",
  "Pain warning",
  "Environment issue",
  "Emotional overload",
  "Other",
];

const MODULES = [
  { id: "guide", label: "Guide", source: "Rule-based support" },
  { id: "circle", label: "Circle", source: "Private accountability", locked: true },
  { id: "connection", label: "Connection", source: "Duty and support", locked: true },
  { id: "principles", label: "Principles", source: "Stoic practice library" },
  { id: "pressure", label: "Pressure Practice", source: "Controlled integrated load", locked: true },
  { id: "advanced", label: "Advanced Standards", source: "Higher standard gates", locked: true },
  { id: "signals", label: "Device Signals", source: "Readiness inputs", simulated: true },
  { id: "review", label: "Human Review", source: "External proof review", simulated: true },
  { id: "benchmarks", label: "Benchmarks", source: "Private standard comparison", locked: true, simulated: true },
  { id: "history", label: "History Import", source: "CSV baseline" },
  { id: "cognitive", label: "Cognitive Load", source: "Attention under load" },
];

const PRINCIPLES = [
  {
    id: "ownership",
    title: "Extreme Ownership — Of Your Part.",
    body: "Own your response, your friction, your correction. No excuses, no blame. But not outcomes or others outside your control — that is not strength, it is self-punishment. What you build, you owe forward: the strongest carry the most.",
  },
  {
    id: "emotion",
    title: "Emotion Reports. Doctrine Commands.",
    body: "Emotion is treated as signal, not authority. The practice is to hear it, name it, and choose cleanly.",
  },
  {
    id: "proof",
    title: "Claims Do Not Qualify. Proof Does.",
    body: "Identity claims stay provisional until action under friction creates evidence.",
  },
  {
    id: "recovery",
    title: "Recovery Is Part Of The Standard.",
    body: "Hard is precise. Reckless is weak. Scaling and recovery are obedience when risk is present — you recover so you can be counted on tomorrow.",
  },
  {
    id: "duty",
    title: "Capability Exists For Duty.",
    body: "The standard points outward: family, team, responsibility, future self, and service.",
  },
];

const DEFAULT_STATE = {
  stateVersion: STATE_VERSION,
  view: "splash",
  tab: "today",
  selectedOrder: "body",
  firstOrderStatus: null,
  assessmentFailures: 0,
  profile: {
    email: "",
    password: "",
    displayName: "",
    callsign: "",
    ageConfirmed: false,
    consentConfirmed: false,
    consentChallenge: false,
  },
  report: {
    completed: "completed",
    frictionLevel: "medium",
    resisted: ["Delay"],
  },
  claim: "",
  safetyFlags: [],
  safetyChecked: false,
  callsignPromptDismissed: false,
  foundationGraduated: true,
  // Phase-B cloud (opt-in, local-first). url empty == pure offline/local (default, unchanged behavior).
  cloud: { url: "", handle: "", token: "", lastSync: "", status: "", leaderboard: [], challenges: [] },
  status: "Visitor",
  onboardingComplete: false,
  recruitQualified: false,
  lastActiveAt: null,
  reentry: false,
  activeDays: [],
  modal: "",
  adjustReason: "Fatigue",
  pauseSignal: "Avoidance",
  lastProof: null,
  restoredFromBackup: false,
  importStatus: "",
  importMessage: "",
  pendingPain: null,
  debriefStep: 0,
  proofFilter: "all",
  foundation: {
    currentDay: 1,
    completedDays: [],
    started: false,
  },
  engine: {
    assignmentReason: "Foundation sequence active.",
    targetedPractice: null,
  },
  modules: {
    active: "guide",
    guide: {
      focus: "Friction",
      answer: "Name the friction, choose the next clean action, then reflect.",
    },
    circle: {
      reliabilityTarget: 80,
      checkins: [
        { name: "Ari", status: "Practice closed", blocker: "Delay", next: "Start before phone" },
        { name: "Mika", status: "Reflection due", blocker: "Fatigue", next: "Minimum practice" },
      ],
      latestCheckin: "",
    },
    connection: {
      duty: "Be more reliable for family and future self.",
      contactWindow: "19:00",
      commitments: ["Send one honest check-in", "Protect sleep window"],
      completed: [],
    },
    principles: {
      selected: "emotion",
      practiced: [],
    },
    pressure: {
      domain: "mind",
      load: 3,
      result: "Not tested",
      completions: 0,
    },
    advanced: {
      tier: "Foundation Confirmed",
      integratedProofs: 0,
      correctionRate: 70,
      readinessAdherence: 80,
      minimumRescueRate: 60,
    },
    signals: {
      connected: false,
      sleepScore: 78,
      strain: 42,
      restingPulse: 58,
      syncs: 0,
    },
    review: {
      submitted: false,
      note: "",
      feedback: "No review submitted.",
    },
    benchmarks: {
      standard: "Composure",
      privateScore: 72,
      band: "Developing",
    },
    history: {
      status: "No import",
      csvText: "",
      fileName: "",
      importedAt: "",
      lastError: "",
      applied: false,
      rows: 0,
      workouts: [],
      summary: {
        sessions: 0,
        weeks: 0,
        avgPerWeek: 0,
        recentSessions: 0,
        trainingAge: "Unknown",
        consistency: "Unknown",
        loadRisk: "Unknown",
        recommendedStart: "Foundation Day 1",
        confidence: 0,
        activityMix: [],
        longestGapDays: 0,
      },
    },
    cognitive: {
      task: "Color-word interference",
      load: 2,
      correct: 0,
      attempts: 0,
    },
  },
  readiness: {
    sleep: 3,
    energy: 3,
    soreness: 2,
    pain: "none",
    stress: 3,
    emotional: 2,
    motivation: 2,
  },
  mission: {
    day: 1,
    name: "Obedience",
    domain: "body",
    objective: "Complete one 10-minute movement practice before 18:00.",
    knownThreat: "Delay",
    standard: "Start before comfort.",
    minimum: "2 minutes controlled movement.",
    deadline: "21:30",
    status: "assigned",
    result: "",
    scaled: false,
    minimumOnly: false,
    painReported: false,
    prediction: null, // pre-practice "call it": "Clean" | "Scaled" | "Miss" | null (optional)
  },
  debrief: {
    result: "Completed",
    friction: ["Delay"],
    frictionLevel: "medium",
    negotiation: "",
    decision: "Hold",
    lesson: "",
    correction: "",
  },
  // Quick close (default close path): ~15s honest log. Full reflection is optional per practice and
  // is the ONLY path that moves the standard (enforced in updateStandardsFromProof).
  debriefMode: "quick",
  quick: { result: "", friction: "", note: "", logged: "" },
  domainLast: {}, // last self-logged number per domain ("beat your last" floor) — non-hashed
  lastBackupNudge: 0,
  proofLedger: [],
  standards: {
    body: "Untested",
    mind: "Untested",
    will: "Untested", // cold start is "Untested", not "Under Review" — the latter is an EARNED hold, not a default
    execution: "Forming",
    readiness: "Unknown",
    integrity: "Forming",
  },
  standardProgress: {
    body: { proofCount: 0, fails: 0 },
    mind: { proofCount: 0, fails: 0 },
    will: { proofCount: 0, fails: 0 },
    execution: { proofCount: 0, fails: 0 },
  },
  readinessHistory: [],
  settings: {
    reminderWindow: "18:00-21:30",
    privacyMode: true,
    motionReduced: false,
    injuryNotes: "",
  },
  debriefCount: 0,
  noMoodMission: false,
  recoveryObeyed: false,
  failuresDebriefed: 0,
};

let state = loadState();
let tickHandle = null;
let executionStartedAt = null;
let executionSeconds = 120;

const app = document.querySelector("#app");

// B5/B4 runtime signals (not persisted): surfaced by the integrity banner, never block usage.
let persistFailed = false;
let lastGoodPayload = null;
let ledgerTampered = false;
let pendingImport = null; // parsed, validated backup awaiting the user's confirm to replace state
let pendingFlagClear = null; // a mental-health flag awaiting the user's "I am safe now" confirm to clear
let lastRenderedModal = ""; // tracks modal open-transitions so focus moves into a dialog only on open
let readinessExpanded = false; // session-only: user chose "Adjust" over one-tap readiness confirm
const MENTAL_HEALTH_FLAGS = ["crisis", "self-punishment", "restriction"];

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.stateVersion !== STATE_VERSION) {
      quarantineState(raw, "missing or incompatible version");
      return recoverLastGood() || structuredClone(DEFAULT_STATE);
    }
    return deepMerge(structuredClone(DEFAULT_STATE), parsed);
  } catch (error) {
    quarantineState(raw, "unreadable (" + error + ")");
    return recoverLastGood() || structuredClone(DEFAULT_STATE);
  }
}

// Never discard data silently: keep the unreadable blob in a backup key before starting fresh.
function quarantineState(raw, reason) {
  console.warn("Spartan X: stored state " + reason + "; a backup was kept for recovery.");
  try { if (raw) localStorage.setItem(BACKUP_KEY, raw); } catch {}
}

// B5: when the main key is corrupt, roll back to the last known-good snapshot instead of wiping.
// The snapshot is only ever written from invariant-clean state (see saveState), so it is trusted.
function recoverLastGood() {
  try {
    const raw = localStorage.getItem(LASTGOOD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.stateVersion !== STATE_VERSION) return null;
    const restored = deepMerge(structuredClone(DEFAULT_STATE), parsed);
    if (checkInvariants(restored).length) return null;
    restored.restoredFromBackup = true;
    console.warn("Spartan X: main state was unreadable; restored last known-good snapshot.");
    return restored;
  } catch {
    return null;
  }
}

// B5: write with a quota fallback. On a full store, drop recoverable keys (quarantine blob, then the
// last-good snapshot) and retry once before giving up. Returns whether the value was persisted.
function writeKey(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    try {
      localStorage.removeItem(BACKUP_KEY);
      if (key !== LASTGOOD_KEY) localStorage.removeItem(LASTGOOD_KEY);
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      return false;
    }
  }
}

// P1 #10: when another tab writes the shared state, adopt it before this tab can clobber it with a
// stale copy. The equality guard makes this converge (no render/save ping-pong between tabs).
function syncFromStorage() {
  const incoming = loadState();
  if (JSON.stringify(incoming) === JSON.stringify(state)) return false;
  state = incoming;
  render();
  return true;
}

function saveState() {
  const payload = JSON.stringify(state);
  if (writeKey(STORAGE_KEY, payload)) {
    persistFailed = false;
    // Rolling backup: snapshot only invariant-clean state, and only when it changed, so a future
    // corruption rolls back to good data rather than wiping. Skipped writes keep storage churn low.
    if (payload !== lastGoodPayload && !checkInvariants(state).length) {
      if (writeKey(LASTGOOD_KEY, payload)) lastGoodPayload = payload;
    }
  } else {
    persistFailed = true;
    console.warn("Spartan X: unable to persist state (storage full).");
  }
}

// Pure structural/safety invariants. Single definition consumed by enforceInvariants + tests.
function checkInvariants(s) {
  const violations = [];
  if (!s || typeof s !== "object") return ["state is not an object"];
  if (s.stateVersion !== STATE_VERSION) violations.push("stateVersion " + s.stateVersion);
  if (!Array.isArray(s.proofLedger)) violations.push("proofLedger not an array");
  else {
    if (s.proofLedger.length > 200) violations.push("proofLedger over cap (" + s.proofLedger.length + ")");
    const allowed = ["Accepted", "Incomplete", "Under Review", "Rejected"];
    if (s.proofLedger.some(p => p && p.status && !allowed.includes(p.status))) violations.push("proof with unknown status");
  }
  const day = s.foundation && s.foundation.currentDay;
  if (!Number.isInteger(day) || day < 1 || day > FOUNDATION_DAYS.length) violations.push("foundation.currentDay out of range (" + day + ")");
  if (!Number.isInteger(s.debriefCount) || s.debriefCount < 0) violations.push("debriefCount invalid (" + s.debriefCount + ")");
  // B6: the crisis interlock reads safetyFlags; a non-array would crash the read site, so require it.
  if (!Array.isArray(s.safetyFlags)) violations.push("safetyFlags not an array");
  return violations;
}

// Runtime guard: dev (window.SX_STRICT) throws loudly; production self-heals so a user never crashes.
function enforceInvariants() {
  const violations = checkInvariants(state);
  if (!violations.length) return;
  if (typeof window !== "undefined" && window.SX_STRICT) {
    throw new Error("Invariant violation: " + violations.join("; "));
  }
  console.warn("Spartan X: self-healing state —", violations.join("; "));
  if (!Array.isArray(state.proofLedger)) state.proofLedger = [];
  if (state.proofLedger.length > 200) state.proofLedger = state.proofLedger.slice(0, 200);
  if (!state.foundation || typeof state.foundation !== "object") state.foundation = structuredClone(DEFAULT_STATE.foundation);
  state.foundation.currentDay = Math.min(Math.max(Math.floor(Number(state.foundation.currentDay) || 1), 1), FOUNDATION_DAYS.length);
  if (!Number.isInteger(state.debriefCount) || state.debriefCount < 0) state.debriefCount = Math.max(0, Math.floor(Number(state.debriefCount) || 0));
  if (!Array.isArray(state.safetyFlags)) state.safetyFlags = [];
  if (state.stateVersion !== STATE_VERSION) state.stateVersion = STATE_VERSION;
}

function deepMerge(base, patch) {
  for (const [key, value] of Object.entries(patch || {})) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      base[key] = deepMerge(base[key] || {}, value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

function resetState() {
  // A full reset must not leave recoverable copies behind (privacy + no surprise resurrection
  // of pre-reset data through the last-good rollback path).
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_KEY);
  localStorage.removeItem(LASTGOOD_KEY);
  lastGoodPayload = null;
  state = structuredClone(DEFAULT_STATE);
  stopTimer();
  render();
}

// A6: the whole #app is re-rendered every action, which drops keyboard focus to <body>. Capture the
// focused control before the wipe and restore the equivalent control afterwards so keyboard users
// keep their place. Matched by id, or by data-action + identical data-* set (action values are simple).
function captureFocusKey() {
  const a = document.activeElement;
  if (!a || a === document.body || !app.contains(a)) return null;
  if (a.id) return { id: a.id };
  if (a.dataset && a.dataset.action) return { action: a.dataset.action, data: { ...a.dataset } };
  return null;
}

function restoreFocus(key) {
  if (!key) return;
  if (key.id) { const el = app.querySelector("#" + CSS.escape(key.id)); if (el) el.focus(); return; }
  for (const el of app.querySelectorAll(`[data-action="${key.action}"]`)) {
    if (Object.keys(key.data).every(k => el.dataset[k] === key.data[k])) { el.focus(); return; }
  }
}

// Coalesce render bursts (e.g. a slider drag firing many input events) into one render per frame.
// State is updated synchronously by the caller; only the expensive DOM rebuild is deferred + deduped.
let _renderQueued = false;
function scheduleRender() {
  if (_renderQueued) return;
  _renderQueued = true;
  const raf = (typeof requestAnimationFrame === "function") ? requestAnimationFrame : (cb => setTimeout(cb, 16));
  raf(() => { _renderQueued = false; render(); });
}

function render() {
  enforceInvariants();
  ledgerTampered = !verifyLedger(state.proofLedger); // B4: recompute from current ledger truth
  saveState();
  const focusKey = captureFocusKey();
  const rail = renderRail();
  const phoneClass = state.onboardingComplete ? "phone wide" : "phone";
  app.innerHTML = `
    <div class="prototype-shell${state.settings.motionReduced ? " reduced-motion" : ""}"${state.modal ? ' inert aria-hidden="true"' : ""}>
      ${rail}
      <main class="stage">
        <section class="${phoneClass}">
          ${renderIntegrityBanner()}
          ${state.onboardingComplete ? renderMainApp() : renderOnboarding()}
        </section>
      </main>
    </div>
    ${renderModal()}
  `;
  bindDynamicInputs();
  restoreFocus(focusKey);
  // Close the open-side of the modal focus trap: on the open transition, move focus into the dialog
  // (its first control = the safe-default action) so keyboard/SR users land in it and it's announced.
  if (state.modal && state.modal !== lastRenderedModal) {
    const first = app.querySelector(".modal-panel button, .modal-panel a[href], .modal-panel input, .modal-panel textarea, .modal-panel select");
    if (first) first.focus();
  }
  lastRenderedModal = state.modal;
  scheduleSplashTransition();
}

// C3: honest integrity surface. Tells the user the truth when persistence is degraded (B5 quota)
// or when data was rolled back from a backup (B5 recovery) — instead of failing or losing silently.
function renderIntegrityBanner() {
  const parts = [];
  if (persistFailed) {
    parts.push(`
      <div class="integrity-banner warn" role="alert">
        <strong>Changes are not being saved.</strong>
        <span>Browser storage is full or blocked. Free up space, or your progress may be lost when you reload.</span>
      </div>`);
  }
  if (state.restoredFromBackup) {
    parts.push(`
      <div class="integrity-banner" role="status">
        <strong>Recovered from backup.</strong>
        <span>Stored data was unreadable, so the last known-good snapshot was restored. Some recent changes may be missing.</span>
        <button type="button" class="integrity-dismiss" data-action="dismiss-recovery">Dismiss</button>
      </div>`);
  }
  if (ledgerTampered) {
    parts.push(`
      <div class="integrity-banner warn" role="alert">
        <strong>Proof ledger integrity check failed.</strong>
        <span>One or more stored proofs do not match their integrity signature — they may have been edited outside the app. Treat recent proofs with caution.</span>
      </div>`);
  }
  return parts.join("");
}

function scheduleSplashTransition() {
  if (state.view !== "splash" || state.onboardingComplete) return;
  window.clearTimeout(scheduleSplashTransition.handle);
  scheduleSplashTransition.handle = window.setTimeout(() => {
    if (state.view === "splash") {
      state.view = "access";
      render();
    }
  }, 1200);
}

function renderRail() {
  const command = computeReadiness(state.readiness);
  const onboarded = state.onboardingComplete;
  // #11: dampen the hero once onboarded (it's redundant beside the running app).
  // #6: only show rail meta once onboarded, so we never display a claim/status the user
  // hasn't actually set yet.
  return `
    <aside class="brand-rail${onboarded ? " compact" : ""}">
      <div class="wordmark">
        <span class="mark" aria-hidden="true"></span>
        <strong>Spartan X</strong>
      </div>
      ${onboarded ? `
        <div class="rail-meta">
          <div class="meta-row"><span>Status</span><strong>${escapeHtml(state.status)}</strong></div>
          <div class="meta-row"><span>Readiness</span><strong>${command.command}</strong></div>
          <div class="meta-row"><span>Active Claim</span><strong>${escapeHtml(state.claim)}</strong></div>
        </div>
      ` : `
        <div class="rail-copy">
          <p class="kicker">Stoic Extreme Ownership</p>
          <h1>Prove it to yourself.</h1>
          <p>Claims do not qualify. Proof does. You own your response, your friction, your correction — never the outcome or anyone else; that's not strength, it's self-punishment. What you build, you carry forward: the strongest carry the most.</p>
        </div>
      `}
    </aside>
  `;
}

function renderOnboarding() {
  switch (state.view) {
    case "splash":
      return renderSplash();
    case "order-select":
      return renderOrderSelect();
    case "order-execute":
      return renderOrderExecute();
    case "hold-line":
      return renderHoldLine();
    case "report":
      return renderFirstReport();
    case "result":
      return renderFirstResult();
    case "claim":
      return renderClaimCapture();
    case "account":
      return renderAccountCreation();
    case "safety":
      return renderSafetyGate();
    case "foundation":
      return renderFoundationHome();
    default:
      return renderAccess();
  }
}

function renderSplash() {
  return `
    <section class="view splash-view">
      <div class="splash-lockup">
        <div class="wordmark large">
          <span class="mark" aria-hidden="true"></span>
          <strong>Spartan X</strong>
        </div>
        <p class="kicker">Prove it to yourself.</p>
        <p class="muted small">Own your part. The strongest carry the most.</p>
      </div>
    </section>
  `;
}

function renderAccess() {
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Access Granted</p>
          <h1>This is not membership.</h1>
        </div>
        <span class="status-chip bronze">Assessment</span>
      </div>
      <div class="command-copy">
        <p>This is assessment.</p>
        <p>You will not be judged by intention.</p>
        <p>You will be measured by action.</p>
        <p>Comfort does not qualify. Motivation does not qualify. Claims do not qualify. Proof does.</p>
      </div>
      <div class="panel steel">
        <p><strong>First practice:</strong> choose one proof and complete it now. No account. No planning ritual. Response first.</p>
        <p class="muted small">Everything stays on this device — nothing is sent anywhere.</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="begin-selection">Begin Assessment</button>
        <button class="btn ghost" data-action="open-about">What is Spartan X?</button>
        <button class="btn ghost" data-action="open-export">Restore a backup</button>
      </div>
    </section>
  `;
}

function renderOrderSelect() {
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">First Practice</p>
          <h1>Choose one proof.</h1>
        </div>
        <span class="status-chip amber">No Skip</span>
      </div>
      <div class="choice-grid">
        ${Object.entries(ORDER_COPY).map(([key, order]) => `
          <button class="choice-card" data-action="select-order" data-order="${key}" aria-pressed="${state.selectedOrder === key}">
            <strong>${order.label}</strong>
            <span>${order.brief}</span>
          </button>
        `).join("")}
      </div>
      <div class="actions">
        <button class="btn primary" data-action="start-order">Start Practice</button>
        <button class="btn ghost" data-action="go-access">Back</button>
      </div>
    </section>
  `;
}

function renderOrderExecute() {
  const order = ORDER_COPY[state.selectedOrder];
  const seconds = getRemainingSeconds();
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">${order.label} Active</p>
          <h1>Return and report.</h1>
        </div>
        <span class="status-chip steel">${order.domain}</span>
      </div>
      <div class="timer">
        <div>
          <strong id="timerValue">${formatTime(seconds)}</strong>
          <span>${escapeHtml(order.active)}</span>
        </div>
      </div>
      <div class="panel">
        <p>Minimum standard remains available. Scaling is allowed. Disappearing without report is not.</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="complete-first-order">Complete</button>
        <button class="btn danger" data-action="quit-first-order">I Want To Stop</button>
      </div>
    </section>
  `;
}

function renderHoldLine() {
  const selected = state.quitSignal || "Avoidance";
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Pause / Recenter</p>
          <h1>Classify the signal.</h1>
        </div>
        <span class="status-chip amber">Friction</span>
      </div>
      <div class="panel warning">
        <p>Danger or injury changes the practice. Fatigue scales the practice. Avoidance, boredom, ego, and negotiation require the next possible action.</p>
      </div>
      <div class="tag-grid">
        ${["Danger", "Injury", "Fatigue", "Fear", "Boredom", "Ego", "Avoidance", "Negotiation"].map(signal => `
          <button data-action="set-quit-signal" data-signal="${signal}" aria-pressed="${selected === signal}">${signal}</button>
        `).join("")}
      </div>
      <div class="panel ${["Danger", "Injury"].includes(selected) ? "danger" : "steel"}">
        <p>${holdLineResponse(selected)}</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="minimum-complete">Minimum Complete</button>
        <button class="btn ghost" data-action="return-execution">Return</button>
      </div>
    </section>
  `;
}

function renderFirstReport() {
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">First Report</p>
          <h1>Capture signal.</h1>
        </div>
        <span class="status-chip bronze">Signal 01</span>
      </div>
      <div class="form-grid">
        <div class="field">
          <span class="label">Practice Status</span>
          <div class="segmented">
            ${["completed", "not completed"].map(status => `
              <button data-action="set-report-status" data-status="${status}" aria-pressed="${state.report.completed === status}">${status}</button>
            `).join("")}
          </div>
        </div>
        <div class="field">
          <span class="label">Friction</span>
          <div class="segmented">
            ${["low", "medium", "high"].map(level => `
              <button data-action="set-friction-level" data-level="${level}" aria-pressed="${state.report.frictionLevel === level}">${level}</button>
            `).join("")}
          </div>
        </div>
        <div class="field">
          <span class="label">What resisted?</span>
          <div class="tag-grid">
            ${FRICTION_TYPES.slice(0, 8).map(type => `
              <button data-action="toggle-report-friction" data-friction="${type}" aria-pressed="${state.report.resisted.includes(type)}">${type}</button>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="submit-first-report">Submit Report</button>
      </div>
    </section>
  `;
}

function renderFirstResult() {
  const completed = state.firstOrderStatus === "completed";
  const paused = !completed && state.assessmentFailures >= 2;
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">${completed ? "Response Confirmed" : "First Practice Failed"}</p>
          <h1>${completed ? "Status: Provisional Candidate" : paused ? "Assessment paused." : "This is data."}</h1>
        </div>
        <span class="status-chip ${completed ? "bronze" : "amber"}">${completed ? "Candidate" : "Paused"}</span>
      </div>
      <div class="panel ${completed ? "steel" : "warning"}">
        <p>${completed ? "You responded to the standard. You have not proven discipline. Foundation available." : paused ? "Two failed first practices recorded. Re-entry is available anytime. No punishment. No false progress." : "This is not rejection. Retry now or exit assessment."}</p>
      </div>
      <div class="actions">
        ${completed ? `<button class="btn primary" data-action="finish-onboarding">Enter Spartan X</button>` : paused ? `<button class="btn primary" data-action="retry-order">Re-enter Assessment</button>` : `<button class="btn primary" data-action="retry-order">Retry Practice</button>`}
        <button class="btn ghost" data-action="reset">Exit Assessment</button>
      </div>
    </section>
  `;
}

function renderClaimCapture() {
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Claim Capture</p>
          <h1>Select a claim to test.</h1>
        </div>
        <span class="status-chip amber">Testing Begins</span>
      </div>
      <div class="choice-grid">
        ${CLAIMS.map(claim => `
          <button class="choice-card" data-action="select-claim" data-claim="${escapeAttr(claim)}" aria-pressed="${state.claim === claim}">
            <strong>${escapeHtml(claim)}</strong>
            <span>Foundation will collect evidence against this claim.</span>
          </button>
        `).join("")}
      </div>
      <div class="actions">
        <button class="btn primary" data-action="log-claim">Log Claim</button>
      </div>
    </section>
  `;
}

function renderAccountCreation() {
  const profile = state.profile;
  const canContinue = canContinueProfile();
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Create Profile</p>
          <h1>Your first signal has been created.</h1>
        </div>
        <span class="status-chip steel">Mock Account</span>
      </div>
      <div class="panel steel">
        <p class="muted small"><strong>This is a local prototype — nothing is sent anywhere.</strong> There is no server and no real account. What you type stays in this browser on this device only. Don't enter a real password; use anything.</p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" data-input="profile" data-key="email" value="${escapeAttr(profile.email)}" placeholder="you@example.com">
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" type="password" data-input="profile" data-key="password" value="${escapeAttr(profile.password)}" placeholder="Prototype only">
        </div>
        <div class="field">
          <label for="displayName">Name</label>
          <input id="displayName" data-input="profile" data-key="displayName" value="${escapeAttr(profile.displayName)}" placeholder="Your name">
        </div>
        <div class="field">
          <label for="callsign">Name / Callsign</label>
          <input id="callsign" data-input="profile" data-key="callsign" value="${escapeAttr(profile.callsign)}" placeholder="What should the system call you?">
        </div>
        <label class="check-row">
          <input type="checkbox" data-input="profile-check" data-key="ageConfirmed" ${profile.ageConfirmed ? "checked" : ""}>
          <span>I confirm I meet the age requirement for this prototype.</span>
        </label>
        <label class="check-row">
          <input type="checkbox" data-input="profile-check" data-key="consentConfirmed" ${profile.consentConfirmed ? "checked" : ""}>
          <span>I understand Spartan X is not medical care, therapy, or emergency support.</span>
        </label>
        <label class="check-row">
          <input type="checkbox" data-input="profile-check" data-key="consentChallenge" ${profile.consentChallenge ? "checked" : ""}>
          <span>I understand the system may challenge my self-image and require honest reflection.</span>
        </label>
      </div>
      ${canContinue ? "" : `<div class="panel warning"><p>Email, password, name, callsign, age confirmation, and consent are required to continue.</p></div>`}
      <div class="actions">
        <button class="btn primary" data-action="continue-account">Continue</button>
      </div>
    </section>
  `;
}

function renderSafetyGate() {
  const flags = state.safetyFlags;
  const hasCrisis = flags.includes("crisis") || flags.includes("self-punishment") || flags.includes("restriction");
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">System Safety Check</p>
          <h1>Answer honestly.</h1>
        </div>
        <span class="status-chip steel">Calibration</span>
      </div>
      <div class="risk-grid">
        ${[
          ["injury", "Currently injured"],
          ["pain", "Pain worsens with movement"],
          ["medical", "Told not to exercise"],
          ["crisis", "Currently in crisis"],
          ["self-punishment", "Training as punishment"],
          ["restriction", "Extreme food restriction"],
        ].map(([flag, label]) => `
          <button data-action="toggle-safety" data-flag="${flag}" aria-pressed="${flags.includes(flag)}">${label}</button>
        `).join("")}
      </div>
      <div class="panel ${hasCrisis ? "danger" : flags.length ? "warning" : "steel"}">
        <p>${safetyMessage(flags)}</p>
      </div>
      ${flags.includes("crisis") ? renderCrisisResources() : ""}
      <div class="actions">
        <button class="btn primary" data-action="enter-foundation">${hasCrisis ? "Enter Protected Foundation" : "Review Foundation"}</button>
      </div>
    </section>
  `;
}

function renderFoundationHome() {
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">7-Day Foundation</p>
          <h1>Seven practices. Evidence first.</h1>
        </div>
        <span class="status-chip bronze">${state.foundation.completedDays.length}/7 Closed</span>
      </div>
      <div class="timeline">
        ${FOUNDATION_DAYS.map(day => renderFoundationDay(day)).join("")}
      </div>
      <div class="panel steel">
        <p>The prototype starts at Day ${state.foundation.currentDay}. Each day can be practiced, reflected on, logged as proof, and advanced for testing.</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="start-foundation">Start Day ${state.foundation.currentDay}</button>
        <button class="btn ghost" data-action="back-safety">Back</button>
      </div>
    </section>
  `;
}

function renderFoundationDay(day) {
  const completed = state.foundation.completedDays.includes(day.day);
  const active = state.foundation.currentDay === day.day;
  return `
    <article class="day-row ${active ? "active" : ""} ${completed ? "complete" : ""}">
      <div>
        <span class="tag">Day ${day.day}</span>
        <strong>${escapeHtml(day.name)}</strong>
        <p class="muted">${escapeHtml(day.objective)}</p>
      </div>
      <span class="status-chip ${completed ? "bronze" : active ? "steel" : ""}">${completed ? "Closed" : active ? "Current" : "Locked"}</span>
    </article>
  `;
}

function renderMainApp() {
  return `
    <section class="main-shell">
      <header class="topbar">
        <div class="wordmark">
          <span class="mark" aria-hidden="true"></span>
          <strong>Spartan X</strong>
        </div>
        <div class="top-actions">
          <span class="status-chip bronze">${escapeHtml(state.status)}</span>
          <button class="btn ghost" data-action="set-tab" data-tab="modules">Modules</button>
          <button class="btn ghost" data-action="set-tab" data-tab="system">System</button>
          <button class="btn ghost" data-action="reset">Reset</button>
        </div>
      </header>
      <div class="content">
        ${renderActiveTab()}
      </div>
      <nav class="tabbar" aria-label="Primary">
        ${TABS.map(tab => `<button data-action="set-tab" data-tab="${tab}"${state.tab === tab ? ' aria-current="page"' : ""}>${TAB_LABELS[tab]}</button>`).join("")}
      </nav>
    </section>
  `;
}

function renderActiveTab() {
  switch (state.tab) {
    case "mission":
      return renderMissionTab();
    case "debrief":
      return renderDebriefTab();
    case "proof":
      return renderProofTab();
    case "standard":
      return renderStandardTab();
    case "proof-logged":
      return renderProofLoggedTab();
    case "modules":
      return renderModulesTab();
    case "system":
      return renderSystemTab();
    default:
      return renderTodayTab();
  }
}

// Progressive disclosure (frontend.md): collapse secondary/reference panels so the primary daily
// action sits above the fold on a phone. Body content stays in the DOM; raw clicks still work.
function disclosure(summary, body, open = false) {
  return `<details class="disclosure"${open ? " open" : ""}><summary>${escapeHtml(summary)}</summary>${body}</details>`;
}

// Deferred onboarding step 1 (just-in-time): one-time safety calibration, shown on Today before the
// first practice can start. Sets the same safetyFlags the engine + proof gate already understand.
function renderSafetyCard() {
  const flags = state.safetyFlags;
  const critical = hasCriticalSafetyFlag();
  return `
    <div class="panel ${critical ? "danger" : flags.length ? "warning" : "steel"}">
      <p class="kicker">Quick safety check</p>
      <h2>Before your first practice.</h2>
      <p class="muted small">Tap anything true for you right now — or none. This keeps the practice safe. Spartan X is not medical care, therapy, or emergency support. You can update these anytime in System.</p>
      <div class="risk-grid">
        ${SAFETY_OPTIONS.map(([flag, label]) => `<button data-action="toggle-safety" data-flag="${flag}" aria-pressed="${flags.includes(flag)}">${label}</button>`).join("")}
      </div>
      ${flags.length ? `<p class="muted small">${escapeHtml(safetyMessage(flags))}</p>` : ""}
      ${critical ? renderCrisisResources() : ""}
      <div class="actions"><button class="btn primary" data-action="confirm-safety-check">Save &amp; continue</button></div>
    </div>
  `;
}

// Deferred onboarding step 2 (just-in-time): optional claim to test, shown on Today after the safety
// check until one is chosen. Not a gate — the user can practice without it.
function renderClaimCard() {
  return `
    <div class="panel steel">
      <p class="kicker">Optional — sharpen your proof</p>
      <h2>Pick a claim to test.</h2>
      <p class="muted small">Foundation collects evidence for or against one belief about yourself. Choose one to make the proof sharper — or skip and pick later.</p>
      <div class="choice-grid">
        ${CLAIMS.map(claim => `<button class="choice-card" data-action="select-claim" data-claim="${escapeAttr(claim)}" aria-pressed="${state.claim === claim}"><strong>${escapeHtml(claim)}</strong></button>`).join("")}
      </div>
    </div>
  `;
}

// Deferred onboarding step 3 (optional): a callsign for identity now and for future community
// challenges (Phase B). One-time prompt; also always editable in System. Not a gate.
function renderCallsignCard() {
  return `
    <div class="panel steel">
      <p class="kicker">Optional — for future challenges</p>
      <h2>Choose a callsign.</h2>
      <p class="muted small">A name to mark your proof. Used now for your check-ins, and reserved for community challenges &amp; leaderboards when they arrive. You can change or set it later in System.</p>
      <div class="field">
        <input id="callsignPrompt" data-input="profile" data-key="callsign" value="${escapeAttr(state.profile.callsign)}" placeholder="e.g. Operator-7" maxlength="24">
      </div>
      <div class="actions"><button class="btn primary" data-action="confirm-callsign">Done</button></div>
    </div>
  `;
}

// Surface progress on Today (not only the Standard tab): weakest-domain elevation + the next
// qualification tier's met/total. Makes the loop visible so users know they're close.
// Leading indicator: warn when recent reflection depth is trending DOWN vs the overall average — the
// slope predicts disengagement before the lagging totals do. Loss-framed but kind; only with enough data.
function trendNudge() {
  const r = computeReport();
  if (r.avgQuality == null || r.recentAvgQuality == null || r.totalProofs < 4) return "";
  if (r.recentAvgQuality < r.avgQuality - 0.5) {
    return `<div class="panel"><p class="muted small">Your recent reflection depth is slipping (${r.recentAvgQuality.toFixed(1)} vs ${r.avgQuality.toFixed(1)} overall). One clean, honest proof resets the trend.</p></div>`;
  }
  return "";
}

// Gap fix A4: full reflection is prompted when it MATTERS (a run of quick closes, a miss, or pain) —
// one quiet line, never a guilt loop, never repeated per state.
function reflectionNudge() {
  const ledger = Array.isArray(state.proofLedger) ? state.proofLedger : [];
  if (!ledger.length) return "";
  const recent = ledger.slice(0, 5);
  const noRecentReflection = recent.length >= 3 && recent.every(e => e && e.source !== "reflection");
  const lastWasMiss = recent[0] && (recent[0].result === "Failed" || recent[0].result === "Abandoned");
  if (!noRecentReflection && !lastWasMiss) return "";
  return `<div class="panel"><p class="muted small">${lastWasMiss
    ? "That miss is worth a full reflection — that's where the standard moves."
    : "Several quick closes in a row. The standard only moves through full reflection — give the next one the six steps."}</p></div>`;
}

// Gap fix D1: the archive promise can't rest on luck. Every 10th proof, one quiet line + one-tap
// backup. Never nags twice for the same milestone; dismiss also silences it.
function renderBackupNudge() {
  const count = Array.isArray(state.proofLedger) ? state.proofLedger.length : 0;
  const lastNudge = Number(state.lastBackupNudge) || 0;
  if (count < 10 || count < lastNudge + 10) return "";
  return `
    <div class="panel">
      <p class="muted small">${count} proofs in your archive — it lives only in this browser. Save a backup.</p>
      <div class="actions">
        <button class="btn steel" data-action="backup-nudge-save">Download backup</button>
        <button class="btn ghost" data-action="backup-nudge-dismiss">Later</button>
      </div>
    </div>`;
}

function renderTodayProgress() {
  const domain = weakestDomain();
  const tiers = computeQualification();
  const current = tiers.find(t => t.status === "in_progress") || tiers.find(t => t.status === "available");
  const met = current ? current.requirements.filter(([, done]) => done).length : 0;
  const total = current ? current.requirements.length : 0;
  const left = total - met;
  return `
    <div class="panel">
      <h2>Progress</h2>
      <p class="muted small">${escapeHtml(domain)}: ${escapeHtml(standardProgressNote(domain))}</p>
      ${current
        ? `<p class="muted small">${escapeHtml(current.name)}: ${met}/${total} criteria${left > 0 ? ` — ${left} to go` : " — ready"}.</p>`
        : `<p class="muted small">All qualification tiers reached.</p>`}
    </div>
  `;
}

function renderTodayTab() {
  const readiness = computeReadiness(state.readiness);
  const reflectionPending = ["completed", "scaled", "failed", "pain"].includes(state.mission.status);
  return `
    <section class="view">
      ${hasCriticalSafetyFlag() ? renderCrisisResources() : ""}
      ${state.reentry ? renderReentryBanner() : ""}
      ${reflectionPending ? `
        <div class="panel warning">
          <h2>Reflection due</h2>
          <p>A practice is open. No reflection, no standard. Close it to keep your proof honest.</p>
          <div class="actions"><button class="btn primary" data-action="set-tab" data-tab="debrief">Complete Reflection</button></div>
        </div>
      ` : ""}
      ${!state.safetyChecked ? renderSafetyCard() : ""}
      ${state.safetyChecked && !state.claim ? renderClaimCard() : ""}
      ${state.safetyChecked && !state.profile.callsign && !state.callsignPromptDismissed ? renderCallsignCard() : ""}
      <div class="dashboard">
        <div class="stack">
          <div class="view-header">
            <div class="view-title">
              <p class="kicker">Today</p>
              <h1>Readiness is ${readiness.command}.</h1>
            </div>
            <span class="status-chip ${chipTone(readiness.command)}">${readiness.command}</span>
          </div>
          <div class="metric-grid">
            <div class="metric"><span>Status</span><strong>${escapeHtml(state.status)}</strong></div>
            <div class="metric"><span>Today Standard</span><strong>Day ${state.mission.day}: ${escapeHtml(state.mission.name)}</strong></div>
            <div class="metric"><span>Active Claim</span><strong>${state.claim ? escapeHtml(state.claim) : "Not set"}</strong></div>
          <div class="metric"><span>Reflection Due</span><strong>${escapeHtml(state.mission.deadline)}</strong></div>
            <div class="metric"><span>Active Days</span><strong>${(state.activeDays || []).length}</strong></div>
          </div>
          <div class="panel steel">
            <h2>Rule Engine Assignment</h2>
            <p>${escapeHtml(state.engine.assignmentReason)}</p>
          </div>
          <div class="readiness-banner ${readiness.command.toLowerCase()}">
            <span class="label">Readiness Guidance</span>
            <strong>${readiness.command}</strong>
            <p>${escapeHtml(readiness.reason)}</p>
            <p class="muted small">Computed from your own check-in — it reads you, not sensors.</p>
          </div>
          <div class="actions">
            ${state.safetyChecked
              ? (() => {
                  // On RECOVER, break the learned gold=press association: relabel + restyle the CTA so
                  // the affordance matches the "intensity disabled" guidance (the assigned practice is
                  // already recovery-safe). data-action values are unchanged.
                  const recover = readiness.command === "RECOVER";
                  const cls = recover ? "btn steel" : "btn primary";
                  if (state.recruitQualified && state.mission.status === "active")
                    return `<button class="${cls}" data-action="set-tab" data-tab="mission">${recover ? "Open Recovery Practice" : "Open Practice"}</button>`;
                  if (state.recruitQualified)
                    return `<button class="${cls}" data-action="continue-standard">${recover ? "Begin Recovery Practice" : "Continue Standard"}</button>`;
                  return `<button class="${cls}" data-action="begin-main-mission">${recover ? "Begin Recovery Practice" : "Begin Practice"}</button>`;
                })()
              : `<span class="muted small">Complete the safety check above to begin your first practice.</span>`}
            <button class="btn steel" data-action="set-tab" data-tab="standard">View Standard</button>
          </div>
          <div class="panel">
            <h2>Next Required Action</h2>
            <p>${readiness.command === "RECOVER" ? "Recovery is the standard now — complete a recovery-safe practice. Obeying it is discipline, not retreat. Physical intensity is disabled." : "Start practice before 18:00. Minimum practice remains available."}</p>
            <p class="muted small">Own your part today — that's what makes you someone others can count on.</p>
          </div>
          ${state.safetyChecked ? reflectionNudge() : ""}
          ${state.safetyChecked ? trendNudge() : ""}
          ${state.safetyChecked ? renderTodayProgress() : ""}
          ${renderBackupNudge()}
          ${disclosure("Foundation Path", renderFoundationProgressPanel())}
        </div>
        <aside class="stack">
          ${renderReadinessControls()}
          ${state.claim ? disclosure("Active Claim", renderDeconstructionPanel()) : ""}
          ${disclosure("Friction Map", renderFrictionMap())}
        </aside>
      </div>
    </section>
  `;
}

function renderReadinessControls() {
  const r = state.readiness;
  // One-tap readiness (gap fix): once a prior day's check exists, today is a single confirm — the
  // sliders only expand on "Adjust". computeReadiness is untouched; this is pure presentation.
  const today = new Date().toISOString().slice(0, 10);
  const last = Array.isArray(state.readinessHistory) ? state.readinessHistory[state.readinessHistory.length - 1] : null;
  const doneToday = !!(last && last.day === today);
  if (last && !doneToday && !readinessExpanded) {
    return `
      <div class="panel">
        <h2>Readiness Check</h2>
        <p class="muted small">Yesterday's check-in gives <strong>${computeReadiness(r).command}</strong> today. Still true?</p>
        <div class="actions">
          <button class="btn steel" data-action="confirm-readiness">Same as yesterday</button>
          <button class="btn ghost" data-action="adjust-readiness">Adjust</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="panel">
      <h2>Readiness Check</h2>
      <div class="form-grid">
        ${slider("sleep", "Sleep Quality", r.sleep)}
        ${slider("energy", "Energy", r.energy)}
        ${slider("soreness", "Soreness", r.soreness)}
        ${slider("stress", "Stress", r.stress)}
        ${slider("emotional", "Emotional Load", r.emotional)}
        ${slider("motivation", "Motivation", r.motivation)}
        <div class="field">
          <span class="label">Pain</span>
          <div class="pain-options">
            ${["none", "mild", "moderate", "severe"].map(pain => `
              <button data-action="set-pain" data-pain="${pain}" aria-pressed="${r.pain === pain}">${pain}</button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function slider(key, label, value) {
  return `
    <label class="slider-field">
      <span class="slider-row"><span class="label">${label}</span><strong data-slider-value>${value}</strong></span>
      <input type="range" min="1" max="5" value="${value}" data-input="readiness" data-key="${key}">
    </label>
  `;
}

function renderDeconstructionPanel() {
  const claimCase = buildClaimCase();
  return `
    <div class="panel">
      <p class="muted">${escapeHtml(state.claim)}</p>
      <div class="line">
        <span class="tag">Evidence: ${claimCase.evidenceCount}</span>
        <span class="tag">Status: ${escapeHtml(claimCase.status)}</span>
      </div>
      <ul class="requirement-list compact">
        ${claimCase.evidence.map(item => `<li class="${item.done ? "done" : ""}">${escapeHtml(item.label)}</li>`).join("")}
      </ul>
      ${acceptedProofs().length >= 3 ? `<p class="muted small">${acceptedProofs().length} reflected proofs now stand behind this — your claim moves with the evidence, not your mood.</p>` : ""}
      <p class="muted small">${escapeHtml(claimCase.replacement)}</p>
    </div>
  `;
}

function renderFrictionMap() {
  const counts = countFriction();
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const rows = top.length ? top : [["Delay", 1], ["Phone distraction", 1], ["Boredom", 1], ["Fatigue", 1], ["Ego", 1]];
  return `
    <div class="panel">
      <div class="stack">
        ${rows.map(([name, count], index) => `
          <div class="line"><span class="tag">${index + 1}</span><span>${escapeHtml(name)}</span><span class="muted small">${count} signal${count === 1 ? "" : "s"}</span></div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderFoundationProgressPanel() {
  return `
    <div class="panel">
      <div class="timeline compact">
        ${FOUNDATION_DAYS.map(day => {
          const completed = state.foundation.completedDays.includes(day.day);
          const active = state.foundation.currentDay === day.day;
          return `
            <button class="day-chip ${active ? "active" : ""} ${completed ? "complete" : ""}" data-action="select-foundation-day" data-day="${day.day}" aria-pressed="${active}">
              <span>Day ${day.day}</span>
              <strong>${escapeHtml(day.name)}</strong>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

const FRICTION_RESPONSES = {
  Delay: "Start the 2-minute minimum before you decide anything else.",
  Time: "Shrink the practice to its minimum and protect that window first.",
  Boredom: "Stay on the single target — boredom is the rep, not a stop signal.",
  Fatigue: "Scale, don't skip: do the recovery-safe minimum, then reflect.",
  Ego: "Drop the intensity you're chasing — the standard is clean execution, not a PR.",
  Distraction: "Remove the trigger (phone away), then restart the single target.",
  Avoidance: "Name what you're avoiding out loud, then do the smallest next action.",
  Pain: "Stop physical load. Report pain honestly and switch to recovery.",
  Embarrassment: "It's data, not judgment — log it plainly and continue.",
  Negotiation: "No renegotiation mid-rep. Do the minimum as written, debrief after.",
};

function frictionResponse(name) {
  return FRICTION_RESPONSES[name] || "Name it, do the minimum cleanly, reflect after.";
}

// Recurring "talked-myself-out" cues mined from past negotiation text — the most predictive
// disengagement signal, captured but otherwise unused. Surfaced so the user pre-decides their answer.
const NEGOTIATION_CUES = ["tired", "busy", "later", "tomorrow", "no time", "too much", "can't", "cant", "skip", "rest", "not now", "don't feel"];
// Word-boundary match so a cue isn't mislabeled inside another word ("rest" in "restless") — surfacing a
// wrong "recurring story" would break trust, which matters more than catching every phrasing.
const NEGOTIATION_RX = NEGOTIATION_CUES.map(c => new RegExp("\\b" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"));
function negotiationPattern() {
  const texts = (Array.isArray(state.proofLedger) ? state.proofLedger : [])
    .map(e => String((e && e.negotiation) || "").toLowerCase()).filter(Boolean);
  if (texts.length < 2) return null;
  const counts = {};
  for (const t of texts) NEGOTIATION_CUES.forEach((cue, i) => { if (NEGOTIATION_RX[i].test(t)) counts[cue] = (counts[cue] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] >= 2 ? { cue: top[0], count: top[1] } : null;
}

// Pre-mission friction prime (top-1% lens: close the gap between diagnosis and decision). If a
// friction (or a recurring excuse) repeats, name it AND coach the response before the practice.
function renderFrictionPrime() {
  const dominant = dominantHighFriction();
  const neg = negotiationPattern();
  if (!dominant && !neg) return "";
  return `
    <div class="panel warning">
      <p class="kicker">Friction prime</p>
      ${dominant ? `<p><strong>${escapeHtml(dominant.name)}</strong> showed up ${dominant.count}× recently. Decide now how you'll meet it before you start — not after.</p>
      <p class="muted small">Try this: ${escapeHtml(frictionResponse(dominant.name))}</p>` : ""}
      ${neg ? `<p class="muted small">Recurring story: “${escapeHtml(neg.cue)}” appeared ${neg.count}× in how you talk yourself out. Pre-decide your answer to it now.</p>` : ""}
    </div>
  `;
}

// Pre-practice prediction ("call it"): honest self-assessment is the rep. Optional; scored vs the real
// outcome at debrief, then surfaced as a calibration rate — the deliberate-practice feedback loop.
function renderPredictionControl() {
  const current = state.mission.prediction;
  const calls = ["Clean", "Scaled", "Miss"];
  const locked = state.mission.status === "active"; // call is locked once practice starts — no hindsight edits
  if (locked) {
    return `
      <div class="panel">
        <p class="kicker">Call it</p>
        <p class="muted small">${current ? `Locked in: <strong>${escapeHtml(current)}</strong>. Honor it — you'll see how it matched reality at reflection.` : "No call made before you started. Make one next time — predicting is the rep."}</p>
      </div>`;
  }
  return `
    <div class="panel">
      <p class="kicker">Call it</p>
      <p class="muted small">Before you start, predict your outcome. Naming it honestly — and seeing how the call matched reality — is how you learn to trust your own read. (Locks when you begin.)</p>
      <div class="call-options">
        ${calls.map(c => `<button data-action="set-prediction" data-call="${c}" aria-pressed="${current === c}">${c}</button>`).join("")}
      </div>
    </div>`;
}

function renderMissionTab() {
  const readiness = computeReadiness(state.readiness);
  const mission = readiness.command === "RECOVER"
    ? {
        ...state.mission,
        objective: "Complete 10 minutes downregulation and set a sleep window.",
        knownThreat: "Ego override",
        standard: "Recovery is the standard.",
        minimum: "2 minutes breathing. No intensity.",
      }
    : state.mission;

  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Practice Brief</p>
          <h1>Day ${mission.day}: ${escapeHtml(mission.name)}</h1>
        </div>
        <span class="status-chip ${chipTone(readiness.command)}">${readiness.command}</span>
      </div>
      <div class="panel">
        <div class="form-grid">
          <div><span class="label">Objective</span><p>${escapeHtml(mission.objective)}</p></div>
          <div><span class="label">Known Threat</span><p>${escapeHtml(mission.knownThreat)}</p></div>
          <div><span class="label">Standard</span><p>${escapeHtml(mission.standard)}</p></div>
          <div><span class="label">Minimum Practice</span><p>${escapeHtml(mission.minimum)}</p></div>
          <div><span class="label">Reflection Due</span><p>${escapeHtml(mission.deadline)}</p></div>
          <div><span class="label">Assignment Reason</span><p>${escapeHtml(state.engine.assignmentReason)}</p></div>
        </div>
      </div>
      ${renderFrictionPrime()}
      ${renderPredictionControl()}
      <div class="timer">
        <div>
          <strong${state.mission.status === "active" ? ' id="timerValue"' : ""}>${state.mission.status === "active" ? formatTime(getRemainingSeconds()) : "--:--"}</strong>
          <span>${state.mission.status === "active" ? "Practice active" : "Practice assigned"}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="complete-mission">${state.mission.status === "active" ? "Complete" : "Begin Practice"}</button>
        <button class="btn steel" data-action="open-adjust">Adjust</button>
        <button class="btn danger" data-action="quit-main-mission">I Want To Stop</button>
        <button class="btn ghost" data-action="report-pain">Report Pain</button>
      </div>
    </section>
  `;
}

function renderDebriefTab() {
  const needsDebrief = ["completed", "scaled", "failed", "pain"].includes(state.mission.status);
  const full = state.debriefMode === "full";
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">${needsDebrief ? (full ? "Full Reflection" : "Close The Practice") : "Reflection"}</p>
          <h1>${needsDebrief ? (full ? "No reflection. No standard." : "Close it honestly.") : "Practice not closed."}</h1>
        </div>
        <span class="status-chip ${needsDebrief ? (full ? "amber" : "bronze") : "steel"}">${needsDebrief ? (full ? "Reflecting" : "Quick close") : "Waiting"}</span>
      </div>
      ${needsDebrief ? (full ? renderDebriefForm() : renderQuickClose()) : `
        <div class="empty-state">
          <p>Begin a practice, then close it through reflection.</p>
        </div>
        <div class="actions">
          <button class="btn primary" data-action="set-tab" data-tab="mission">Open Practice</button>
        </div>
      `}
    </section>
  `;
}

// Quick close — the default, ~15-second honest close (gap fix: the ceremony must never outweigh the
// action). Result + one friction tap + optional note/number. The standard still moves ONLY through
// full reflection; this keeps the chain alive without a daily 6-step toll.
function renderQuickClose() {
  const q = state.quick;
  const frictions = ["Delay", "Avoidance", "Fatigue", "Boredom", "Negotiation", "Fear"];
  return `
    <div class="panel">
      <p class="kicker">Result</p>
      <div class="call-options">
        ${["Clean", "Scaled", "Miss"].map(r => `<button data-action="quick-result" data-result="${r}" aria-pressed="${q.result === r}">${r}</button>`).join("")}
      </div>
    </div>
    <div class="panel">
      <p class="kicker">Friction (one tap)</p>
      <div class="tag-grid">
        ${frictions.map(f => `<button data-action="quick-friction" data-friction="${f}" aria-pressed="${q.friction === f}">${f}</button>`).join("")}
      </div>
    </div>
    <div class="panel">
      <div class="field">
        <label for="quickLogged">What did you do? (optional — minutes or reps, your number is your word)</label>
        <input id="quickLogged" type="number" min="0" max="10000" inputmode="numeric" data-input="quick" data-key="logged" value="${escapeAttr(String(q.logged || ""))}">
      </div>
      <div class="field">
        <label for="quickNote">One line (optional)</label>
        <input id="quickNote" maxlength="200" data-input="quick" data-key="note" value="${escapeAttr(q.note)}" placeholder="What actually happened?">
      </div>
    </div>
    <div class="actions">
      <button class="btn primary" data-action="submit-quick-close" ${q.result ? "" : "disabled"}>Close practice</button>
      <button class="btn ghost" data-action="open-full-reflection">Full reflection instead</button>
    </div>
    <p class="muted small">Quick close keeps the record honest. The standard only moves through full reflection — do one when it matters.</p>
  `;
}

const DEBRIEF_STEPS = ["result", "friction", "negotiation", "decision", "lesson", "correction"];
const DEBRIEF_STEP_LABELS = {
  result: "Result",
  friction: "Friction",
  negotiation: "Negotiation",
  decision: "Decision",
  lesson: "Lesson",
  correction: "Correction",
};

// Design 19.5 / 12.14: one question per step with visible progress (Zeigarnik).
function renderDebriefForm() {
  const d = state.debrief;
  const index = Math.min(Math.max(state.debriefStep || 0, 0), DEBRIEF_STEPS.length - 1);
  const key = DEBRIEF_STEPS[index];
  const isLast = index === DEBRIEF_STEPS.length - 1;
  return `
    <p class="kicker">Step ${index + 1} of ${DEBRIEF_STEPS.length}</p>
    <div class="progress-line">
      ${DEBRIEF_STEPS.map((step, i) => `<button type="button" class="${i === index ? "active" : ""} ${i < index ? "done" : ""}" data-action="debrief-jump" data-index="${i}" aria-current="${i === index}">${DEBRIEF_STEP_LABELS[step]}</button>`).join("")}
    </div>
    <div class="form-grid">
      ${renderDebriefField(key, d)}
    </div>
    <div class="actions">
      ${index > 0 ? `<button class="btn ghost" data-action="debrief-back">Back</button>` : ""}
      ${isLast
        ? `<button class="btn primary" data-action="submit-debrief">Submit Reflection</button>`
        : `<button class="btn primary" data-action="debrief-next">Next</button>`}
    </div>
  `;
}

function renderDebriefField(key, d) {
  if (key === "result") {
    return `
      <div class="field">
        <label for="result">Result</label>
        <select id="result" data-input="debrief" data-key="result">
          ${["Completed", "Scaled", "Failed", "Abandoned", "Corrected"].map(item => `<option ${d.result === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>`;
  }
  if (key === "friction") {
    return `
      <div class="field">
        <span class="label">Friction</span>
        <div class="tag-grid">
          ${FRICTION_TYPES.map(type => `
            <button data-action="toggle-debrief-friction" data-friction="${type}" aria-pressed="${d.friction.includes(type)}">${type}</button>
          `).join("")}
        </div>
        <label for="frictionLevel" class="label">Intensity</label>
        <select id="frictionLevel" data-input="debrief" data-key="frictionLevel">
          ${["low", "medium", "high"].map(l => `<option ${(d.frictionLevel || "medium") === l ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>`;
  }
  if (key === "negotiation") {
    return `
      <div class="field">
        <label for="negotiation">Negotiation</label>
        <textarea id="negotiation" maxlength="1000" data-input="debrief" data-key="negotiation" placeholder="What excuse appeared?">${escapeHtml(d.negotiation)}</textarea>
      </div>`;
  }
  if (key === "decision") {
    return `
      <div class="field">
        <label for="decision">Decision</label>
        <select id="decision" data-input="debrief" data-key="decision">
          ${["Press", "Hold", "Scale", "Recover", "Stop", "Abandon"].map(item => `<option ${d.decision === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>`;
  }
  if (key === "lesson") {
    return `
      <div class="field">
        <label for="lesson">Lesson</label>
        <textarea id="lesson" maxlength="1000" data-input="debrief" data-key="lesson" placeholder="What did this reveal?">${escapeHtml(d.lesson)}</textarea>
      </div>`;
  }
  return `
      <div class="field">
        <label for="correction">Correction</label>
        <textarea id="correction" maxlength="1000" data-input="debrief" data-key="correction" placeholder="What changes next?">${escapeHtml(d.correction)}</textarea>
      </div>`;
}

// Share a verified proof — text only, no fabricated stats; the B4 hash makes a shared proof defensible.
// The only organic-acquisition surface, and honest by construction.
function proofShareText(p) {
  if (!p) return "";
  const short = String(p.hash || "").slice(0, 8);
  return `Spartan X proof: ${p.text} — verified locally${short ? " (#" + short + ")" : ""}.`;
}
function shareProof() {
  const p = state.proofLedger.find(e => e && e.status === "Accepted") || state.proofLedger[0];
  if (!p) return;
  const text = proofShareText(p);
  try {
    if (typeof navigator !== "undefined" && navigator.share) { navigator.share({ text }).catch(() => {}); state.shareStatus = "Shared."; }
    else if (typeof navigator !== "undefined" && navigator.clipboard) { navigator.clipboard.writeText(text).catch(() => {}); state.shareStatus = "Copied to clipboard."; }
    else state.shareStatus = "Sharing isn't available here.";
  } catch (error) { state.shareStatus = "Could not share."; }
  render();
}

function renderProofTab() {
  const filter = state.proofFilter || "all";
  const domains = Array.from(new Set(state.proofLedger.map(entry => entry.domain).filter(Boolean)));
  const entries = filter === "all" ? state.proofLedger : state.proofLedger.filter(entry => entry.domain === filter);
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Proof Ledger</p>
          <h1>Private evidence bank.</h1>
        </div>
        <span class="status-chip bronze">${entries.length} Signals</span>
      </div>
      ${state.proofLedger.length ? `
        <div class="tag-grid">
          <button data-action="set-proof-filter" data-filter="all" aria-pressed="${filter === "all"}">All</button>
          ${domains.map(domain => `<button data-action="set-proof-filter" data-filter="${escapeAttr(domain)}" aria-pressed="${filter === domain}">${escapeHtml(domain)}</button>`).join("")}
        </div>
      ` : ""}
      ${state.proofLedger.some(e => e && e.status === "Accepted") ? `<div class="actions"><button class="btn ghost" data-action="share-proof">Share latest proof</button>${state.shareStatus ? `<span class="muted small">${escapeHtml(state.shareStatus)}</span>` : ""}</div>` : ""}
      ${entries.length ? `
        <div class="stack">
          ${entries.map(entry => `
            <article class="proof-entry">
              <div class="line">
                <span class="stamp ${statusClass(entry.status)}">${escapeHtml(entry.status)}</span>
                <span class="tag">${entry.source === "module" ? "Module" : "Reflection"}</span>
                <span>${escapeHtml(entry.date)}</span>
              </div>
              <strong>${escapeHtml(entry.text)}</strong>
              <p class="muted">Friction: ${escapeHtml(entry.friction)}${entry.frictionLevel ? ` (${escapeHtml(entry.frictionLevel)})` : ""}. Decision: ${escapeHtml(entry.decision)}. Standard effect: ${escapeHtml(entry.effect)}. Domain: ${escapeHtml(entry.domain || "—")}.</p>
            </article>
          `).join("")}
        </div>
      ` : `
        <div class="empty-state"><p>No proof in this view yet. Complete practice and reflection.</p></div>
      `}
    </section>
  `;
}

function renderProofLoggedTab() {
  const proof = state.lastProof;
  if (!proof) {
    state.tab = "proof";
    return renderProofTab();
  }

  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Proof Logged</p>
          <h1>${escapeHtml(proof.effect)}.</h1>
        </div>
        <span class="status-chip ${proof.status === "Accepted" ? "bronze" : proof.status === "Rejected" ? "red" : "amber"}">${escapeHtml(proof.status)}</span>
      </div>
      <div class="panel ${proof.status === "Accepted" ? "steel" : "warning"}">
        <p>${escapeHtml(proof.text)}</p>
      </div>
      <div class="metric-grid">
        <div class="metric"><span>Reflection Quality</span><strong>${qualityLabel(proof.quality)}</strong></div>
        <div class="metric"><span>Friction</span><strong>${escapeHtml(proof.friction)}</strong></div>
        <div class="metric"><span>Decision</span><strong>${escapeHtml(proof.decision)}</strong></div>
        <div class="metric"><span>Domain</span><strong>${escapeHtml(proof.domain)}</strong></div>
        ${proof.prediction ? `<div class="metric"><span>Your call vs reality</span><strong>${escapeHtml(proof.prediction)} — ${proof.predictionHit ? "matched ✓" : "missed"}</strong></div>` : ""}
      </div>
      <div class="actions">
        ${state.recruitQualified
          ? `<button class="btn primary" data-action="continue-standard">Continue Standard</button>`
          : `<button class="btn primary" data-action="advance-foundation">${state.foundation.currentDay < 7 ? "Advance Foundation" : "Close Foundation"}</button>`}
        <button class="btn steel" data-action="set-tab" data-tab="proof">View Proof</button>
        <button class="btn ghost" data-action="set-tab" data-tab="today">Return Today</button>
      </div>
    </section>
  `;
}

// One-time graduation moment at Foundation Confirmed (top-1% lens: mark the identity shift from
// "training my foundation" to "holding a moving standard"). Non-blocking card, not a modal.
function renderGraduationCard() {
  const domain = weakestDomain();
  const dominant = dominantHighFriction();
  const claimLine = state.claim ? `Your claim — “${escapeHtml(state.claim)}” — now has early evidence.` : "";
  return `
    <div class="panel bronze">
      <p class="kicker">Foundation Confirmed</p>
      <h2>Seven days proven. The standard now moves.</h2>
      <p class="muted small">Weakest signal: <strong>${escapeHtml(domain)}</strong>.${dominant ? ` Top friction: <strong>${escapeHtml(dominant.name)}</strong> (${dominant.count}×).` : ""} ${claimLine}</p>
      <p class="muted small">From here the standard rises only through reflected proof and reflection quality. Proof #1 is evidence; proof #3 is a pattern. The standard never finishes moving.</p>
      <p class="muted small">What you've proven, you now owe forward — the strongest carry the most.</p>
      <div class="actions"><button class="btn primary" data-action="graduate-ack">Hold the standard</button><button class="btn ghost" data-action="share-proof">Share a proof</button></div>
    </div>
  `;
}

function renderQualTier(tier) {
  return `
    <article class="qual-tier ${tier.status}">
      <div class="line"><strong>${escapeHtml(tier.name)}</strong><span class="status-chip ${qualTone(tier.status)}">${qualLabel(tier.status)}</span></div>
      <ul class="requirement-list">
        ${tier.requirements.map(([label, done]) => `<li class="${done ? "done" : ""}">${escapeHtml(label)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderStandardTab() {
  const standardSummary = buildStandardSummary();
  const qualification = computeQualification();
  return `
    <section class="view">
      ${state.status === "Foundation Confirmed" && !state.foundationGraduated ? renderGraduationCard() : ""}
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Standard Profile</p>
          <h1>${standardSummary.status === "Under Review" ? "Standard under review" : "Standard: " + (STANDARD_LEVELS[standardStageIndex()] || "Untested")}.</h1>
        </div>
        <span class="status-chip ${standardSummary.tone}">${escapeHtml(standardSummary.status)}</span>
      </div>
      <div class="progress-line">
        ${["Untested", "Tested", "Stabilizing", "Baseline", "Elevated"].map((stage, index) => `
          <span class="${index <= standardStageIndex() ? "active" : ""}">${stage}</span>
        `).join("")}
      </div>
      <div class="dashboard">
        <div class="stack">
          <div class="metric-grid">
            ${Object.entries(state.standards).map(([domain, status]) => `
              <article class="domain-card">
                <span>${domain}</span>
                <strong>${escapeHtml(status)}</strong>
                <p class="muted">${domainNote(domain, status)}</p>
                ${TRAINABLE_DOMAINS.includes(domain) ? `<p class="muted small">${escapeHtml(standardProgressNote(domain))}</p>` : ""}
              </article>
            `).join("")}
          </div>
        </div>
        <aside class="panel">
          <h2>Qualification Ladder</h2>
          <div class="stack">
            ${qualification.filter(tier => tier.status !== "locked").map(renderQualTier).join("")}
            ${(() => {
              const locked = qualification.filter(tier => tier.status === "locked");
              return locked.length
                ? disclosure(`Locked tiers (${locked.length})`, `<div class="stack">${locked.map(renderQualTier).join("")}</div>`)
                : "";
            })()}
          </div>
        </aside>
      </div>
      <div class="panel steel">
        <h2>Moving Standard</h2>
        <p>${escapeHtml(standardSummary.reason)}</p>
      </div>
    </section>
  `;
}

// Phase-B cloud panel (System). Off by default — Spartan X is local-first; this connects the
// opt-in sync/leaderboard/challenges when a backend is configured (?backend=<url>).
function renderCloudPanel() {
  const c = state.cloud || {};
  if (!c.url) {
    return `
      <div class="panel">
        <h2>Cloud (beta)</h2>
        <p class="muted small">Cloud sync is <strong>off</strong> — Spartan X is local-only by default. Phase B (verified cross-device sync, leaderboards &amp; challenges) connects here. Your proof ledger merges losslessly across devices and is re-verified server-side. Enable with <code>?backend=&lt;url&gt;</code>.</p>
        <p class="muted small"><strong>Before you enable it:</strong> turning cloud on uploads your full proof ledger — <strong>including your written reflections</strong> (your negotiations, lessons, and corrections) — to the server. Keep it off to stay 100% on this device.</p>
      </div>`;
  }
  // Protected mode: while a critical safety flag is active, sync stays on (your data) but the
  // competitive surface (leaderboard + challenges) is hidden — no comparison loop when vulnerable.
  const protectedMode = hasCriticalSafetyFlag();
  const recovering = hasActivityRestrictingFlag() || computeReadiness(state.readiness).command === "RECOVER";
  const board = (c.leaderboard || []).slice(0, 10);
  const challenges = c.challenges || [];
  const community = protectedMode
    ? `<p class="muted small">Community comparison is paused while a safety flag is active — your sync still works. The only standard that matters right now is taking care of yourself.</p>`
    : `${board.length ? `<p class="label">Community — honest, consistent practice (not a verdict)</p><div class="report-rows">${board.map((u, i) => `<p><span>${i + 1}. ${escapeHtml(u.handle)}</span><span>${escapeHtml(String(u.metric))} proven</span></p>`).join("")}</div><p class="muted small">Ranked by consistency × honest reflection — not raw volume. It's company, not your verdict.</p>` : ""}
       ${recovering
          ? `<p class="muted small">Challenges are paused while you're in recovery — hold the standard first.</p>`
          : (challenges.length ? `<p class="label">Challenges</p><div class="stack">${challenges.map(ch => `<div class="line"><span>${escapeHtml(ch.title)}</span><button class="btn ghost" data-action="cloud-complete-challenge" data-id="${escapeAttr(ch.id)}">Submit</button></div>`).join("")}</div>` : "")}`;
  return `
    <div class="panel">
      <h2>Cloud (beta)</h2>
      <p class="muted small">${c.status ? escapeHtml(c.status) : "Verified cross-device sync. Opt-in. Your data stays local-first."}</p>
      <p class="muted small">Cloud is on: your full proof ledger, <strong>including your written reflections</strong>, syncs to the server. Disconnect to keep everything on this device.</p>
      <div class="actions"><button class="btn steel" data-action="cloud-sync">Sync now</button></div>
      ${c.handle ? `<p class="muted small">Handle: <strong>${escapeHtml(c.handle)}</strong>${c.lastSync ? " · last sync " + escapeHtml(c.lastSync.slice(0, 16).replace("T", " ")) : ""}</p>` : ""}
      ${community}
    </div>`;
}

// Quiet, optional support. Renders ONLY if SUPPORT_URL is set — never pushed, nothing gated, the app is
// identical whether you back it or not. Honesty over pressure.
function renderSupportPanel() {
  if (!SUPPORT_URL) return "";
  return `
    <div class="panel">
      <h2>Back the standard</h2>
      <p class="muted small">Spartan X is free and yours — it stays on this device, no ads, no account, nothing sold. If it holds your standard, you can support it. Entirely optional; nothing changes if you don't.</p>
      <div class="actions"><a class="btn ghost" href="${escapeAttr(SUPPORT_URL)}" target="_blank" rel="noopener noreferrer">Support Spartan X</a></div>
    </div>`;
}

function renderSystemTab() {
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">System</p>
          <h1>Safety, privacy, and prototype controls.</h1>
        </div>
        <span class="status-chip steel">Private</span>
      </div>
      <div class="dashboard">
        <div class="stack">
          <div class="panel">
            <h2>Profile</h2>
            <div class="field">
              <label for="callsignSetting">Callsign</label>
              <input id="callsignSetting" data-input="profile" data-key="callsign" value="${escapeAttr(state.profile.callsign)}" placeholder="e.g. Operator-7" maxlength="24">
            </div>
            <p class="muted small">Local to this device. Reserved for community challenges &amp; leaderboards when they arrive.</p>
          </div>
          <div class="panel ${hasCriticalSafetyFlag() ? "danger" : state.safetyFlags.length ? "warning" : ""}">
            <h2>Safety</h2>
            <p class="muted small">Update these whenever your situation changes — flag a new injury, or clear a flag once you've recovered. While any is active, practice stays in recovery-safe mode.</p>
            <div class="risk-grid">
              ${SAFETY_OPTIONS.map(([flag, label]) => `<button data-action="toggle-safety" data-flag="${flag}" aria-pressed="${state.safetyFlags.includes(flag)}">${label}</button>`).join("")}
            </div>
            ${state.safetyFlags.length ? `<p class="muted small">${escapeHtml(safetyMessage(state.safetyFlags))}</p>` : ""}
            ${hasCriticalSafetyFlag() ? renderCrisisResources() : ""}
          </div>
          ${renderCloudPanel()}
          <div class="panel">
            <h2>Privacy</h2>
            <label class="check-row">
              <input type="checkbox" data-input="settings-check" data-key="privacyMode" ${state.settings.privacyMode ? "checked" : ""}>
              <span>Private proof ledger by default</span>
            </label>
            <label class="check-row">
              <input type="checkbox" data-input="settings-check" data-key="motionReduced" ${state.settings.motionReduced ? "checked" : ""}>
              <span>Reduce motion</span>
            </label>
          </div>
          <div class="panel">
            <h2>Reflection Window</h2>
            <div class="field">
              <label for="reminderWindow">Your intended window</label>
              <input id="reminderWindow" data-input="settings" data-key="reminderWindow" value="${escapeAttr(state.settings.reminderWindow)}">
            </div>
            <p class="muted small">This records the window you hold yourself to. Spartan X sends no push — put the window in your own calendar instead: your OS reminds you, and nothing leaves this device.</p>
            <div class="actions"><button class="btn ghost" data-action="download-ics">Add to my calendar</button></div>
          </div>
          <div class="panel">
            <h2>Safety Notes</h2>
            <div class="field">
              <label for="injuryNotes">Training limitations</label>
              <textarea id="injuryNotes" maxlength="600" data-input="settings" data-key="injuryNotes" placeholder="Injury notes or movements to avoid">${escapeHtml(state.settings.injuryNotes)}</textarea>
            </div>
          </div>
        </div>
        <aside class="stack">
          <div class="panel danger">
            <h2>Safety Resources</h2>
            <p>Spartan X is not crisis care. If there is immediate danger, use local emergency services or trusted human support.</p>
          </div>
          <div class="panel">
            <h2>Your Report</h2>
            <p class="muted small">A private summary of your own proof, computed on this device. Nothing is sent anywhere.</p>
            <div class="actions">
              <button class="btn steel" data-action="open-report">View Your Report</button>
            </div>
          </div>
          <div class="panel">
            <h2>Data &amp; Backup</h2>
            <p class="muted small">Your data is stored only in this browser — never sent anywhere. Clearing your browser or switching device erases it, so export a backup to keep it.</p>
            <div class="actions">
              <button class="btn steel" data-action="open-export">Backup &amp; Restore</button>
              <button class="btn danger" data-action="reset">Delete Local Data</button>
            </div>
          </div>
          ${renderSupportPanel()}
        </aside>
      </div>
    </section>
  `;
}

function renderModulesTab() {
  const active = state.modules.active || "guide";
  return `
    <section class="view">
      <div class="view-header">
        <div class="view-title">
          <p class="kicker">Full Prototype Modules</p>
          <h1>All product ideas are available.</h1>
          <p class="muted small">Modules marked “preview” show how a Phase-B feature will work, using sample data — nothing real is connected yet, and your readiness uses only your manual check-ins. Each preview states the value it will add so you can see where it earns its place.</p>
        </div>
        <span class="status-chip bronze">${MODULES.length} Modules</span>
      </div>
      <div class="dashboard">
        <aside class="panel module-nav">
          <h2>Modules</h2>
          <div class="module-list">
            ${MODULES.map(item => {
              const locked = item.locked && !state.recruitQualified;
              return `
              <button data-action="set-module" data-module="${item.id}" aria-pressed="${active === item.id}">
                <strong>${escapeHtml(item.label)}${item.simulated ? ` <span class="status-chip">preview</span>` : ""}</strong>
                <span>${locked ? "Locked — Foundation Confirmed required" : escapeHtml(item.source)}</span>
              </button>`;
            }).join("")}
          </div>
        </aside>
        <div class="stack">
          ${renderActiveModule(active)}
        </div>
      </div>
    </section>
  `;
}

function renderActiveModule(active) {
  const moduleDef = MODULES.find(item => item.id === active);
  if (moduleDef && moduleDef.locked && !state.recruitQualified) return renderModuleLockCard(moduleDef);
  if (active === "circle") return renderCircleModule();
  if (active === "connection") return renderConnectionModule();
  if (active === "principles") return renderPrinciplesModule();
  if (active === "pressure") return renderPressureModule();
  if (active === "advanced") return renderAdvancedStandardsModule();
  if (active === "signals") return renderSignalsModule();
  if (active === "review") return renderHumanReviewModule();
  if (active === "benchmarks") return renderBenchmarksModule();
  if (active === "history") return renderHistoryModule();
  if (active === "cognitive") return renderCognitiveModule();
  return renderGuideModule();
}

function renderModuleLockCard(moduleDef) {
  const foundation = computeQualification()[0];
  return `
    <div class="panel">
      <p class="kicker">Locked</p>
      <h2>${escapeHtml(moduleDef.label)} unlocks at Foundation Confirmed.</h2>
      <p class="muted">Deeper access opens once self-command is proven. Complete the requirements below.</p>
      <ul class="requirement-list">
        ${foundation.requirements.map(([label, done]) => `<li class="${done ? "done" : ""}">${escapeHtml(label)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderGuideModule() {
  const guide = state.modules.guide;
  return `
    <div class="panel">
      <p class="kicker">Standard Guide</p>
      <h2>Rule-based guidance, not personality theater.</h2>
      <div class="segmented">
        ${["Friction", "Readiness", "Claim", "Recovery"].map(item => `
          <button data-action="set-guide-focus" data-focus="${item}" aria-pressed="${guide.focus === item}">${item}</button>
        `).join("")}
      </div>
      <div class="readiness-banner ${computeReadiness(state.readiness).command.toLowerCase()}">
        <span class="label">Guidance</span>
        <strong>${escapeHtml(guide.focus)}</strong>
        <p>${escapeHtml(guide.answer)}</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="generate-guide">Generate Guidance</button>
      </div>
    </div>
  `;
}

function renderCircleModule() {
  const circle = state.modules.circle;
  return `
    <div class="panel">
      <p class="kicker">Circle</p>
      <h2>Private accountability without performance theater.</h2>
      <div class="metric-grid">
        <div class="metric"><span>Reliability Target</span><strong>${circle.reliabilityTarget}%</strong></div>
        <div class="metric"><span>Check-ins</span><strong>${circle.checkins.length}</strong></div>
      </div>
      <div class="stack">
        ${circle.checkins.map(item => `
          <article class="proof-entry">
            <span>${escapeHtml(item.name)}</span>
            <strong>${escapeHtml(item.status)}</strong>
            <p class="muted">Blocker: ${escapeHtml(item.blocker)}. Next: ${escapeHtml(item.next)}.</p>
          </article>
        `).join("")}
      </div>
      <div class="field">
        <label for="circleCheckin">Your check-in</label>
        <textarea id="circleCheckin" maxlength="500" data-input="module" data-module="circle" data-key="latestCheckin" placeholder="Status, blocker, next action">${escapeHtml(circle.latestCheckin)}</textarea>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="submit-circle-checkin">Submit Check-In</button>
      </div>
    </div>
  `;
}

function renderConnectionModule() {
  const connection = state.modules.connection;
  return `
    <div class="panel">
      <p class="kicker">Connection Standard</p>
      <h2>Capability points toward duty.</h2>
      <div class="field">
        <label for="duty">What are you becoming capable for?</label>
        <textarea id="duty" data-input="module" data-module="connection" data-key="duty">${escapeHtml(connection.duty)}</textarea>
      </div>
      <div class="field">
        <label for="contactWindow">Support contact window</label>
        <input id="contactWindow" data-input="module" data-module="connection" data-key="contactWindow" value="${escapeAttr(connection.contactWindow)}">
      </div>
      <ul class="requirement-list">
        ${connection.commitments.map(item => `<li class="${connection.completed.includes(item) ? "done" : ""}">${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="actions">
        <button class="btn primary" data-action="complete-connection">Complete Connection Practice</button>
      </div>
    </div>
  `;
}

function renderPrinciplesModule() {
  const selected = PRINCIPLES.find(item => item.id === state.modules.principles.selected) || PRINCIPLES[0];
  return `
    <div class="panel">
      <p class="kicker">Principles Library</p>
      <h2>Practice principles, not content consumption.</h2>
      <div class="choice-grid">
        ${PRINCIPLES.map(item => `
          <button class="choice-card" data-action="select-principle" data-principle="${item.id}" aria-pressed="${selected.id === item.id}">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.body)}</span>
          </button>
        `).join("")}
      </div>
      <div class="panel steel">
        <p>${escapeHtml(selected.body)}</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="practice-principle">Mark Practiced</button>
      </div>
    </div>
  `;
}

function renderPressureModule() {
  const pressure = state.modules.pressure;
  return `
    <div class="panel">
      <p class="kicker">Pressure Practice</p>
      <h2>Integrated pressure without recklessness.</h2>
      <div class="metric-grid">
        <div class="metric"><span>Domain</span><strong>${escapeHtml(pressure.domain)}</strong></div>
        <div class="metric"><span>Load</span><strong>${pressure.load}/5</strong></div>
        <div class="metric"><span>Result</span><strong>${escapeHtml(pressure.result)}</strong></div>
        <div class="metric"><span>Completions</span><strong>${pressure.completions}</strong></div>
      </div>
      <div class="segmented">
        ${["body", "mind", "will", "execution"].map(item => `
          <button data-action="set-pressure-domain" data-domain="${item}" aria-pressed="${pressure.domain === item}">${item}</button>
        `).join("")}
      </div>
      <label class="slider-field">
        <span class="slider-row"><span class="label">Load</span><strong data-slider-value>${pressure.load}</strong></span>
        <input type="range" min="1" max="5" value="${pressure.load}" data-input="module-number" data-module="pressure" data-key="load">
      </label>
      <div class="actions">
        <button class="btn primary" data-action="complete-pressure">Complete Pressure Practice</button>
      </div>
    </div>
  `;
}

function renderAdvancedStandardsModule() {
  const advanced = state.modules.advanced;
  const ready = advanced.integratedProofs >= 1 && advanced.correctionRate >= 70 && advanced.readinessAdherence >= 80 && advanced.minimumRescueRate >= 60;
  return `
    <div class="panel">
      <p class="kicker">Advanced Standards</p>
      <h2>${ready ? "Integrated standard available." : "Integrated standard pending."}</h2>
      <div class="metric-grid">
        <div class="metric"><span>Tier</span><strong>${escapeHtml(advanced.tier)}</strong></div>
        <div class="metric"><span>Integrated Proofs</span><strong>${advanced.integratedProofs}</strong></div>
        <div class="metric"><span>Correction Rate</span><strong>${advanced.correctionRate}%</strong></div>
        <div class="metric"><span>Readiness Adherence</span><strong>${advanced.readinessAdherence}%</strong></div>
        <div class="metric"><span>Minimum Rescue Rate</span><strong>${advanced.minimumRescueRate}%</strong></div>
      </div>
      <ul class="requirement-list">
        <li class="${advanced.integratedProofs >= 1 ? "done" : ""}">1 integrated pressure proof</li>
        <li class="${advanced.correctionRate >= 70 ? "done" : ""}">Correction rate >= 70%</li>
        <li class="${advanced.readinessAdherence >= 80 ? "done" : ""}">Readiness adherence >= 80%</li>
        <li class="${advanced.minimumRescueRate >= 60 ? "done" : ""}">Minimum rescue rate >= 60%</li>
      </ul>
      <div class="actions">
        <button class="btn primary" data-action="grant-integrated-proof">Add Integrated Proof</button>
      </div>
    </div>
  `;
}

function renderSignalsModule() {
  const signals = state.modules.signals;
  return `
    <div class="panel">
      <p class="kicker">Device Signals · preview</p>
      <h2>Readiness from your wearable.</h2>
      <p class="muted small">Preview · sample data. Connect a watch and your real sleep &amp; strain auto-fill the daily readiness check — so the command (press / recover) reflects actual recovery, not just how you feel. Until then, your manual check-in is what counts.</p>
      <div class="metric-grid">
        <div class="metric"><span>Status</span><strong>${signals.connected ? "Connected" : "Not connected"}</strong></div>
        <div class="metric"><span>Sleep Score</span><strong>${signals.sleepScore}</strong></div>
        <div class="metric"><span>Strain</span><strong>${signals.strain}</strong></div>
        <div class="metric"><span>Resting Pulse</span><strong>${signals.restingPulse}</strong></div>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="sync-signals">${signals.connected ? "Sync Signals" : "Connect Signals"}</button>
      </div>
    </div>
  `;
}

function renderHumanReviewModule() {
  const review = state.modules.review;
  return `
    <div class="panel">
      <p class="kicker">Human Review · preview</p>
      <h2>Outside eyes on your proof.</h2>
      <p class="muted small">Preview · sample data. A coach or trusted peer reviews your proof patterns and challenges your reflections — the outside accountability you can't give yourself. The feedback below is a sample of what a reviewer would return.</p>
      <div class="field">
        <label for="reviewNote">Review note</label>
        <textarea id="reviewNote" data-input="module" data-module="review" data-key="note" placeholder="What should be reviewed?">${escapeHtml(review.note)}</textarea>
      </div>
      <div class="panel steel">
        <p>${escapeHtml(review.feedback)}</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="submit-human-review">Submit Review</button>
      </div>
    </div>
  `;
}

function renderBenchmarksModule() {
  const benchmarks = state.modules.benchmarks;
  return `
    <div class="panel">
      <p class="kicker">Benchmarks · preview</p>
      <h2>Measure against the standard, not other people.</h2>
      <p class="muted small">Preview · sample data. Your band will be computed from your own accumulated proof — an honest read on whether you're actually at the standard, never a social ranking. The slider below is a placeholder for that real, earned score.</p>
      <div class="metric-grid">
        <div class="metric"><span>Standard</span><strong>${escapeHtml(benchmarks.standard)}</strong></div>
        <div class="metric"><span>Private Score</span><strong>${benchmarks.privateScore}</strong></div>
        <div class="metric"><span>Band</span><strong>${escapeHtml(benchmarks.band)}</strong></div>
      </div>
      <label class="slider-field">
        <span class="slider-row"><span class="label">Private benchmark score</span><strong data-slider-value>${benchmarks.privateScore}</strong></span>
        <input type="range" min="0" max="100" value="${benchmarks.privateScore}" data-input="module-number" data-module="benchmarks" data-key="privateScore">
      </label>
      <div class="actions">
        <button class="btn primary" data-action="update-benchmark-band">Update Band</button>
      </div>
    </div>
  `;
}

function renderHistoryModule() {
  const history = state.modules.history;
  const summary = history.summary;
  const mix = summary.activityMix.length
    ? summary.activityMix.map(item => `${item.type}: ${item.count}`).join(", ")
    : "None";
  const preview = history.workouts.slice(0, 5);
  return `
    <div class="panel">
      <p class="kicker">History Import</p>
      <h2>Continue from training history.</h2>
      <div class="metric-grid">
        <div class="metric"><span>Status</span><strong>${escapeHtml(history.status)}</strong></div>
        <div class="metric"><span>Sessions</span><strong>${summary.sessions}</strong></div>
        <div class="metric"><span>Weeks</span><strong>${summary.weeks}</strong></div>
        <div class="metric"><span>Average</span><strong>${summary.avgPerWeek}/week</strong></div>
        <div class="metric"><span>Training Age</span><strong>${escapeHtml(summary.trainingAge)}</strong></div>
        <div class="metric"><span>Consistency</span><strong>${escapeHtml(summary.consistency)}</strong></div>
        <div class="metric"><span>Load Risk</span><strong>${escapeHtml(summary.loadRisk)}</strong></div>
        <div class="metric"><span>Start</span><strong>${escapeHtml(summary.recommendedStart)}</strong></div>
      </div>
      <div class="panel steel">
        <p>Historical context calibrates the start. Proof still starts inside Spartan X.</p>
      </div>
      ${history.lastError ? `<div class="panel danger"><p>${escapeHtml(history.lastError)}</p></div>` : ""}
      <div class="field">
        <label for="historyFile">CSV file</label>
        <input id="historyFile" type="file" accept=".csv,text/csv" data-input="history-file">
      </div>
      <div class="field">
        <label for="historyCsv">CSV data</label>
        <textarea id="historyCsv" data-input="module" data-module="history" data-key="csvText" placeholder="date,type,duration_minutes,distance_km">${escapeHtml(history.csvText)}</textarea>
      </div>
      <div class="actions">
        <button class="btn steel" data-action="load-sample-history">Load Sample CSV</button>
        <button class="btn primary" data-action="analyze-history">Analyze CSV</button>
        <button class="btn steel" data-action="apply-history-baseline" ${summary.sessions ? "" : "disabled"}>Apply Baseline</button>
      </div>
      <div class="panel">
        <h2>Import Signal</h2>
        <div class="line"><span class="tag">Confidence ${summary.confidence}%</span><span class="tag">${escapeHtml(mix)}</span><span class="tag">Longest gap ${summary.longestGapDays} days</span></div>
      </div>
      ${preview.length ? `
        <div class="stack">
          ${preview.map(item => `
            <article class="proof-entry">
              <span>${escapeHtml(item.date)}</span>
              <strong>${escapeHtml(item.type)} - ${item.durationMinutes} min</strong>
              <p class="muted">Distance ${item.distanceKm ? `${item.distanceKm} km` : "unknown"}. Source: ${escapeHtml(history.fileName || "pasted CSV")}.</p>
            </article>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderCognitiveModule() {
  const cognitive = state.modules.cognitive;
  const accuracy = cognitive.attempts ? Math.round(cognitive.correct / cognitive.attempts * 100) : 0;
  return `
    <div class="panel">
      <p class="kicker">Cognitive Load</p>
      <h2>Attention under controlled load.</h2>
      <div class="metric-grid">
        <div class="metric"><span>Task</span><strong>${escapeHtml(cognitive.task)}</strong></div>
        <div class="metric"><span>Load</span><strong>${cognitive.load}/5</strong></div>
        <div class="metric"><span>Attempts</span><strong>${cognitive.attempts}</strong></div>
        <div class="metric"><span>Accuracy</span><strong>${accuracy}%</strong></div>
      </div>
      <div class="actions">
        <button class="btn primary" data-action="cognitive-correct">Correct Response</button>
        <button class="btn steel" data-action="cognitive-miss">Missed Response</button>
      </div>
    </div>
  `;
}

function renderConfirmResetModal() {
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <div class="modal-panel">
        <p class="kicker">Delete local data</p>
        <h2 id="reset-title">Erase everything on this device?</h2>
        <p class="muted">This permanently deletes all proofs, standards, reflections, and the recovery backup. It cannot be undone, and there is no cloud copy unless you enabled sync.</p>
        <div class="actions">
          <button class="btn primary" data-action="close-modal">Keep my data</button>
          <button class="btn danger" data-action="confirm-reset">Delete everything</button>
        </div>
      </div>
    </div>
  `;
}

function renderConfirmFlagClearModal() {
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="flagclear-title">
      <div class="modal-panel">
        <p class="kicker">Clear a safety flag</p>
        <h2 id="flagclear-title">Are you safe now?</h2>
        <p class="muted">Clearing this removes your crisis protections and re-enables comparison features. Only do it if it's genuinely true now. If there's any doubt, keep it on — that's the standard, not a failure.</p>
        <div class="actions">
          <button class="btn primary" data-action="close-modal">Keep it on</button>
          <button class="btn steel" data-action="confirm-flag-clear">I am safe now</button>
        </div>
      </div>
    </div>
  `;
}

function renderAboutModal() {
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="about-title">
      <div class="modal-panel">
        <p class="kicker">What is Spartan X?</p>
        <h2 id="about-title">A discipline system.</h2>
        <p class="muted">You choose the work. Spartan X holds the standard: practice, friction, reflection, proof. It prescribes no exercises and measures only what you log yourself — it is not a coach, not a game, not therapy, and not for comfort.</p>
        <div class="actions">
          <button class="btn primary" data-action="close-modal">Close</button>
        </div>
      </div>
    </div>
  `;
}

function renderModal() {
  if (state.modal === "about") return renderAboutModal();
  if (state.modal === "adjust") return renderAdjustModal();
  if (state.modal === "pause") return renderPauseModal();
  if (state.modal === "export") return renderExportModal();
  if (state.modal === "report") return renderReportModal();
  if (state.modal === "painDowngrade") return renderPainDowngradeModal();
  if (state.modal === "confirmReset") return renderConfirmResetModal();
  if (state.modal === "confirmFlagClear") return renderConfirmFlagClearModal();
  return "";
}

function renderPainDowngradeModal() {
  const current = state.readiness.pain;
  const next = state.pendingPain;
  // Soft (no hard latch, per owner decision). For SEVERE specifically, add an explicit injury
  // warning and make the SAFE option the primary button, so a reflexive tap protects, not downgrades.
  const severe = current === "severe";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pain-title">
      <div class="modal-panel">
        <p class="kicker">Confirm Pain Change</p>
        <h2 id="pain-title">Lowering a protected signal.</h2>
        <p class="muted">You are changing reported pain from ${escapeHtml(current)} to ${escapeHtml(next || "")}. Recovery is part of the standard, not weakness. Confirm only if the pain has truly eased.</p>
        ${severe ? `<p class="muted small">Under-reporting pain can hide an injury. If there is any doubt, keep it higher and take a recovery-safe practice.</p>` : ""}
        <div class="actions">
          ${severe
            ? `<button class="btn primary" data-action="close-modal">Keep severe</button>
               <button class="btn ghost" data-action="confirm-pain">Lower it anyway</button>`
            : `<button class="btn primary" data-action="confirm-pain">Confirm Change</button>
               <button class="btn ghost" data-action="close-modal">Keep ${escapeHtml(current)}</button>`}
        </div>
      </div>
    </div>
  `;
}

function renderCrisisResources() {
  return `
    <div class="panel danger">
      <h2>Immediate support</h2>
      <p>Spartan X is not crisis care. If you are in immediate danger, call your local emergency number now — for example 112 (EU / Sweden), 999 (UK), or 911 (US).</p>
      <p class="muted">For free, confidential support, find a crisis line in your own country at findahelpline.com. (US only: call or text 988.) Reaching out is part of the standard, not a failure of it.</p>
    </div>
  `;
}

function renderAdjustModal() {
  const reason = state.adjustReason || "Fatigue";
  const risk = reason === "Pain warning";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="adjust-title">
      <div class="modal-panel">
        <p class="kicker">Adjust Practice</p>
        <h2 id="adjust-title">Scaling is allowed. Disappearing is not.</h2>
        <div class="tag-grid">
          ${ADJUST_REASONS.map(item => `
            <button data-action="set-adjust-reason" data-reason="${item}" aria-pressed="${reason === item}">${item}</button>
          `).join("")}
        </div>
        <div class="panel ${risk ? "danger" : "steel"}">
          <p>${risk ? "Risk detected. Recovery-safe practice becomes active." : "Practice adjusted. Minimum standard remains."}</p>
        </div>
        <div class="actions">
          <button class="btn primary" data-action="apply-adjust">Apply Adjustment</button>
          <button class="btn ghost" data-action="close-modal">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderPauseModal() {
  const signal = state.pauseSignal || "Avoidance";
  const danger = ["Danger", "Injury"].includes(signal);
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div class="modal-panel">
        <p class="kicker">Pause / Recenter</p>
        <h2 id="pause-title">Name the signal before choosing.</h2>
        <div class="tag-grid">
          ${["Danger", "Injury", "Fatigue", "Fear", "Boredom", "Ego", "Avoidance", "Negotiation"].map(item => `
            <button data-action="set-pause-signal" data-signal="${item}" aria-pressed="${signal === item}">${item}</button>
          `).join("")}
        </div>
        <div class="panel ${danger ? "danger" : "warning"}">
          <p>${holdLineResponse(signal)}</p>
        </div>
        <div class="actions">
          <button class="btn primary" data-action="${danger ? "pause-protect" : "pause-minimum"}">${danger ? "Protect And Reflect" : "Continue Minimum"}</button>
          <button class="btn danger" data-action="pause-stop">Stop And Reflect</button>
          <button class="btn ghost" data-action="close-modal">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderExportModal() {
  const status = state.importStatus || "";
  const msg = state.importMessage || "";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="export-title">
      <div class="modal-panel">
        <p class="kicker">Data &amp; Backup</p>
        <h2 id="export-title">Your data stays on this device.</h2>
        <p class="muted small">Spartan X stores everything in this browser only — nothing is sent anywhere, and there is no account in the cloud. Clearing your browser data, switching device, or private browsing will not carry it over. Export a backup file to keep or move your proof.</p>
        <div class="actions">
          <button class="btn primary" data-action="download-backup">Download backup (.json)</button>
        </div>
        <div class="field">
          <label for="importFile">Restore from a backup file</label>
          <input id="importFile" type="file" accept="application/json,.json" data-input="import-file">
        </div>
        ${status === "error" ? `<p class="import-msg error">${escapeHtml(msg)}</p>` : ""}
        ${status === "ready" ? `
          <p class="import-msg ok">${escapeHtml(msg)}</p>
          <div class="actions">
            <button class="btn danger" data-action="confirm-import">Replace my data with this backup</button>
            <button class="btn ghost" data-action="cancel-import">Cancel</button>
          </div>` : ""}
        <details class="export-details">
          <summary>Show raw data</summary>
          <textarea readonly class="export-box">${escapeHtml(exportPayload())}</textarea>
        </details>
        <div class="actions">
          <button class="btn ghost" data-action="close-modal">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Serialize state for export with the cloud credential stripped — a shared backup must not leak the
// sync token (the rest is the user's own local data).
function exportPayload() {
  const safe = JSON.parse(JSON.stringify(state));
  if (safe.cloud) safe.cloud.token = "";
  return JSON.stringify(safe, null, 2);
}

// Gap fix C1: honest, serverless reminders. Spartan X sends no push — instead the user puts the
// practice window in their OWN calendar (recurring daily event + alarm). The OS reminds; we see nothing.
function buildReminderIcs() {
  const start = (String(state.settings.reminderWindow || "18:00").split("-")[0] || "18:00").trim();
  const [h, m] = start.split(":").map(s => String(s).padStart(2, "0"));
  const hh = /^\d{2}$/.test(h) ? h : "18";
  const mm = /^\d{2}$/.test(m) ? m : "00";
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Spartan X//Reminder//EN",
    "BEGIN:VEVENT",
    `UID:spartanx-standard-${d}@local`,
    `DTSTART:${d}T${hh}${mm}00`,
    "RRULE:FREQ=DAILY",
    "SUMMARY:Spartan X — the standard waits.",
    "DESCRIPTION:Open the practice window. Own your part today.",
    "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Spartan X — the standard waits.", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

function downloadReminderIcs() {
  try {
    const blob = new Blob([buildReminderIcs()], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "spartan-x-standard.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  } catch (error) { /* download blocked: nothing to clean up, user can retry */ }
}

// Download the current state as a timestamped JSON backup the user controls (local-only data export).
function downloadBackup() {
  try {
    const blob = new Blob([exportPayload()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `spartan-x-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.warn("Spartan X: backup download failed", error);
  }
}

// Validate a pasted/loaded backup before offering to restore it. Never overwrites data here — it only
// stages a candidate; the user must confirm. Exposed on window so it is testable headlessly.
function applyImportText(text) {
  try {
    if (typeof text !== "string" || text.length > 2_000_000) throw new Error("file too large or unreadable");
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || parsed.stateVersion !== STATE_VERSION) {
      throw new Error("not a Spartan X backup");
    }
    const candidate = deepMerge(structuredClone(DEFAULT_STATE), parsed);
    const violations = checkInvariants(candidate);
    if (violations.length) throw new Error("invalid: " + violations.join("; "));
    pendingImport = candidate;
    const proofs = candidate.proofLedger.length;
    state.importStatus = "ready";
    state.importMessage = `Backup looks valid: ${proofs} proof${proofs === 1 ? "" : "s"}, status “${candidate.status}”. Restoring replaces your current data on this device.`;
  } catch (error) {
    pendingImport = null;
    state.importStatus = "error";
    state.importMessage = "This file is not a valid Spartan X backup.";
  }
  render();
}

function clearImport() {
  pendingImport = null;
  state.importStatus = "";
  state.importMessage = "";
}

// C1: privacy-first local report. Derives the user's OWN numbers from local state only — no
// fabrication, no backend, no telemetry. Every figure is a real count from the proof ledger/state.
// Deliberate-practice calibration: bucket a proof's real outcome so a pre-practice prediction can be
// scored against it. Layered ENTIRELY outside the oracle-swept pure functions (scoreDebrief etc. are
// untouched); the prediction/predictionHit fields are NOT in the B4 hash canon, so determinism holds.
function outcomeBucket(result, minimumOnly) {
  if (["Failed", "Abandoned"].includes(result)) return "Miss";
  if (minimumOnly || result === "Scaled") return "Scaled";
  return "Clean"; // Completed / Corrected at full standard
}

function computeCalibration() {
  const withPred = (Array.isArray(state.proofLedger) ? state.proofLedger : []).filter(e => e && e.prediction);
  const hits = withPred.filter(e => e.predictionHit).length;
  const rate = withPred.length ? Math.round((hits / withPred.length) * 100) : null;
  // Per-bucket breakdown reveals a directional bias a single blended rate would hide.
  const buckets = {};
  for (const b of ["Clean", "Scaled", "Miss"]) {
    const called = withPred.filter(e => e.prediction === b);
    buckets[b] = { called: called.length, hit: called.filter(e => e.predictionHit).length };
  }
  let bias = null;
  if (withPred.length >= 4) {
    const c = buckets.Clean;
    if (c.called >= 3 && c.hit / Math.max(1, c.called) < 0.5) bias = "Optimistic — you call “Clean” more than you land it.";
    else if (rate >= 80) bias = "Well-calibrated — your read matches reality.";
    else if (rate <= 40) bias = "Noisy read — name the outcome more carefully before you start.";
  }
  return { total: withPred.length, hits, rate, buckets, bias };
}

function computeReport() {
  const ledger = Array.isArray(state.proofLedger) ? state.proofLedger : [];
  const reflections = ledger.filter(p => p && p.source === "reflection");
  const byStatus = { Accepted: 0, Incomplete: 0, "Under Review": 0, Rejected: 0 };
  ledger.forEach(p => { if (p && byStatus[p.status] !== undefined) byStatus[p.status]++; });
  const quals = reflections.filter(p => typeof p.quality === "number");
  const avg = arr => arr.length ? arr.reduce((a, p) => a + p.quality, 0) / arr.length : null;
  const fric = {};
  ledger.forEach(p => String((p && p.friction) || "").split(",").map(s => s.trim()).filter(Boolean)
    .forEach(f => { fric[f] = (fric[f] || 0) + 1; }));
  const topFriction = Object.entries(fric).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const tiers = computeQualification();
  const highest = tiers.filter(t => t.status === "qualified").map(t => t.name).slice(-1)[0] || "None yet";
  // Recovery-as-skill: a Recover decision is a competence (choosing recovery under pressure), not a
  // failure — credit it explicitly. These are already Accepted proofs; here we make them visible.
  const recoveryProofs = ledger.filter(p => p && p.decision === "Recover").length;
  return {
    activeDays: (state.activeDays || []).length,
    reflections: state.debriefCount || 0,
    totalProofs: ledger.length,
    byStatus,
    avgQuality: avg(quals),
    recentAvgQuality: avg(quals.slice(0, 5)), // ledger is newest-first
    topFriction,
    underReviewRate: ledger.length ? Math.round((byStatus["Under Review"] / ledger.length) * 100) : 0,
    highestTier: highest,
    recoveryProofs,
    calibration: computeCalibration(),
  };
}

function renderReportModal() {
  const r = computeReport();
  const q = v => v === null ? "—" : v.toFixed(1) + "/5";
  const fric = r.topFriction.length
    ? r.topFriction.map(([name, n]) => `${escapeHtml(name)} (${n})`).join(", ")
    : "Not enough data yet";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div class="modal-panel">
        <p class="kicker">Your Report</p>
        <h2 id="report-title">Your numbers, computed on this device.</h2>
        <p class="muted small">Derived only from your own proof ledger — nothing is sent anywhere.</p>
        <div class="report-grid">
          <div class="metric"><span>Active days</span><strong>${r.activeDays}</strong></div>
          <div class="metric"><span>Reflections</span><strong>${r.reflections}</strong></div>
          <div class="metric"><span>Total proofs</span><strong>${r.totalProofs}</strong></div>
          <div class="metric"><span>Highest tier</span><strong>${escapeHtml(r.highestTier)}</strong></div>
          <div class="metric"><span>Avg reflection quality</span><strong>${q(r.avgQuality)}</strong></div>
          <div class="metric"><span>Recent quality (last 5)</span><strong>${q(r.recentAvgQuality)}</strong></div>
        </div>
        <div class="report-rows">
          <p><span>Accepted</span><span>${r.byStatus.Accepted}</span></p>
          <p><span>Incomplete</span><span>${r.byStatus.Incomplete}</span></p>
          <p><span>Under review</span><span>${r.byStatus["Under Review"]} (${r.underReviewRate}%)</span></p>
          <p><span>Rejected</span><span>${r.byStatus.Rejected}</span></p>
          <p><span>Recovery obeyed (a skill)</span><span>${r.recoveryProofs}</span></p>
          <p><span>Self-read accuracy (honesty, not outcome)</span><span>${r.calibration.rate === null ? "—" : r.calibration.rate + "% (" + r.calibration.hits + "/" + r.calibration.total + ")"}</span></p>
          ${r.calibration.bias ? `<p class="muted small">${escapeHtml(r.calibration.bias)}</p>` : ""}
          <p><span>Most common friction</span><span>${fric}</span></p>
        </div>
        <div class="actions">
          <button class="btn ghost" data-action="close-modal">Close</button>
        </div>
      </div>
    </div>
  `;
}

function bindDynamicInputs() {
  document.querySelectorAll("[data-input='readiness']").forEach(input => {
    input.addEventListener("input", event => {
      state.readiness[event.target.dataset.key] = Number(event.target.value);
      updateStandardsFromReadiness();
      const lbl = event.target.closest(".slider-field")?.querySelector("[data-slider-value]");
      if (lbl) lbl.textContent = event.target.value; // live value without a full rebuild
      scheduleRender();                              // coalesce drag bursts into one render/frame
    });
    // On commit (release), record today's readiness so overtraining detection sees daily check-ins,
    // not only post-debrief snapshots. Upsert-by-day keeps it to one entry per day.
    input.addEventListener("change", () => { recordReadinessSnapshot(); render(); });
  });

  document.querySelectorAll("[data-input='debrief']").forEach(input => {
    input.addEventListener("change", updateDebriefInput);
    input.addEventListener("input", updateDebriefInput);
  });

  document.querySelectorAll("[data-input='profile']").forEach(input => {
    input.addEventListener("input", event => {
      state.profile[event.target.dataset.key] = event.target.value;
      saveState();
    });
  });

  document.querySelectorAll("[data-input='profile-check']").forEach(input => {
    input.addEventListener("change", event => {
      state.profile[event.target.dataset.key] = event.target.checked;
      render();
    });
  });

  document.querySelectorAll("[data-input='settings']").forEach(input => {
    input.addEventListener("input", event => {
      state.settings[event.target.dataset.key] = event.target.value;
      saveState();
    });
  });

  document.querySelectorAll("[data-input='quick']").forEach(input => {
    input.addEventListener("input", event => {
      state.quick[event.target.dataset.key] = event.target.value;
      saveState();
    });
  });

  document.querySelectorAll("[data-input='import-file']").forEach(input => {
    input.addEventListener("change", event => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => applyImportText(String(reader.result));
      reader.onerror = () => { state.importStatus = "error"; state.importMessage = "Could not read that file."; render(); };
      reader.readAsText(file);
    });
  });

  document.querySelectorAll("[data-input='settings-check']").forEach(input => {
    input.addEventListener("change", event => {
      state.settings[event.target.dataset.key] = event.target.checked;
      render();
    });
  });

  document.querySelectorAll("[data-input='module']").forEach(input => {
    input.addEventListener("input", event => {
      const module = state.modules[event.target.dataset.module];
      if (!module) return;
      module[event.target.dataset.key] = event.target.value;
      saveState();
    });
  });

  document.querySelectorAll("[data-input='module-number']").forEach(input => {
    input.addEventListener("input", event => {
      const module = state.modules[event.target.dataset.module];
      if (!module) return;
      module[event.target.dataset.key] = Number(event.target.value);
      const lbl = event.target.closest(".slider-field")?.querySelector("[data-slider-value]");
      if (lbl) lbl.textContent = event.target.value; // live value; render coalesced (0–100 slider)
      scheduleRender();
    });
  });

  document.querySelectorAll("[data-input='history-file']").forEach(input => {
    input.addEventListener("change", event => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        state.modules.history.fileName = file.name;
        state.modules.history.csvText = String(reader.result || "");
        analyzeHistoryCsv();
        render();
      });
      reader.addEventListener("error", () => {
        state.modules.history.lastError = "CSV file could not be read.";
        render();
      });
      reader.readAsText(file);
    });
  });
}

function updateDebriefInput(event) {
  state.debrief[event.target.dataset.key] = event.target.value;
  saveState();
}

document.addEventListener("click", event => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const action = control.dataset.action;

  if (action === "begin-selection") state.view = "order-select";
  if (action === "go-access") state.view = "access";
  if (action === "open-about") state.modal = "about";
  if (action === "close-modal") { state.modal = ""; state.pendingPain = null; pendingFlagClear = null; clearImport(); }
  if (action === "select-order") state.selectedOrder = control.dataset.order;
  if (action === "start-order") startFirstOrder();
  if (action === "complete-first-order") completeFirstOrder("completed");
  if (action === "quit-first-order") state.view = "hold-line";
  if (action === "set-quit-signal") state.quitSignal = control.dataset.signal;
  if (action === "minimum-complete") completeFirstOrder("completed");
  if (action === "return-execution") state.view = "order-execute";
  if (action === "set-report-status") state.report.completed = control.dataset.status;
  if (action === "set-friction-level") state.report.frictionLevel = control.dataset.level;
  if (action === "toggle-report-friction") toggleArray(state.report.resisted, control.dataset.friction);
  if (action === "submit-first-report") submitFirstReport();
  if (action === "retry-order") state.view = "order-select";
  if (action === "select-claim") state.claim = control.dataset.claim;
  if (action === "toggle-safety") {
    const flag = control.dataset.flag;
    // Setting a flag is one tap. CLEARING a mental-health flag needs an explicit "I am safe now"
    // confirm, so a reflex/panic tap can't silently strip crisis protections. Physical flags toggle freely.
    if (state.safetyFlags.includes(flag) && MENTAL_HEALTH_FLAGS.includes(flag)) {
      pendingFlagClear = flag;
      state.modal = "confirmFlagClear";
    } else {
      toggleArray(state.safetyFlags, flag);
    }
  }
  if (action === "confirm-flag-clear") {
    if (pendingFlagClear) toggleArray(state.safetyFlags, pendingFlagClear);
    pendingFlagClear = null;
    state.modal = "";
  }
  if (action === "finish-onboarding") finishOnboarding();
  if (action === "confirm-safety-check") confirmSafetyCheck();
  if (action === "confirm-callsign") state.callsignPromptDismissed = true;
  if (action === "graduate-ack") state.foundationGraduated = true;
  if (action === "set-tab") state.tab = control.dataset.tab;
  if (action === "set-module") state.modules.active = control.dataset.module;
  if (action === "set-guide-focus") {
    state.modules.guide.focus = control.dataset.focus;
    state.modules.guide.answer = guideAnswer(control.dataset.focus);
  }
  if (action === "generate-guide") state.modules.guide.answer = guideAnswer(state.modules.guide.focus);
  if (action === "submit-circle-checkin") submitCircleCheckin();
  if (action === "complete-connection") completeConnectionPractice();
  if (action === "select-principle") state.modules.principles.selected = control.dataset.principle;
  if (action === "practice-principle") practicePrinciple();
  if (action === "set-pressure-domain") state.modules.pressure.domain = control.dataset.domain;
  if (action === "complete-pressure") completePressurePractice();
  if (action === "grant-integrated-proof") grantIntegratedProof();
  if (action === "sync-signals") syncSignals();
  if (action === "submit-human-review") submitHumanReview();
  if (action === "update-benchmark-band") updateBenchmarkBand();
  if (action === "load-sample-history") loadSampleHistoryCsv();
  if (action === "analyze-history") analyzeHistoryCsv();
  if (action === "apply-history-baseline") applyHistoryBaseline();
  if (action === "cognitive-correct") recordCognitiveResponse(true);
  if (action === "cognitive-miss") recordCognitiveResponse(false);
  if (action === "select-foundation-day") selectFoundationDay(Number(control.dataset.day));
  if (action === "cloud-sync") { cloudSync(); return; }            // async; renders itself
  if (action === "cloud-complete-challenge") { cloudCompleteChallenge(control.dataset.id); return; }
  if (action === "begin-main-mission") beginMission();
  if (action === "continue-standard") continueStandard();
  if (action === "complete-mission") completeMission();
  if (action === "set-prediction" && state.mission.status !== "active") state.mission.prediction = control.dataset.call;
  if (action === "share-proof") { shareProof(); return; }
  if (action === "quick-result") state.quick.result = control.dataset.result;
  if (action === "confirm-readiness") { recordReadinessSnapshot(); readinessExpanded = false; }
  if (action === "adjust-readiness") readinessExpanded = true;
  if (action === "download-ics") { downloadReminderIcs(); return; }
  if (action === "backup-nudge-save") { downloadBackup(); state.lastBackupNudge = state.proofLedger.length; }
  if (action === "backup-nudge-dismiss") state.lastBackupNudge = state.proofLedger.length;
  if (action === "quick-friction") state.quick.friction = state.quick.friction === control.dataset.friction ? "" : control.dataset.friction;
  if (action === "open-full-reflection") state.debriefMode = "full";
  if (action === "submit-quick-close") submitQuickClose();
  if (action === "open-adjust") state.modal = "adjust";
  if (action === "set-adjust-reason") state.adjustReason = control.dataset.reason;
  if (action === "apply-adjust") applyAdjustPractice();
  if (action === "quit-main-mission") state.modal = "pause";
  if (action === "set-pause-signal") state.pauseSignal = control.dataset.signal;
  if (action === "pause-minimum") continueMinimumPractice();
  if (action === "pause-protect") protectAndReflect();
  if (action === "pause-stop") stopAndReflect();
  if (action === "report-pain") reportPain();
  if (action === "set-pain") setPain(control.dataset.pain);
  if (action === "confirm-pain") confirmPainChange();
  if (action === "toggle-debrief-friction") toggleArray(state.debrief.friction, control.dataset.friction);
  if (action === "debrief-next") state.debriefStep = Math.min((state.debriefStep || 0) + 1, DEBRIEF_STEPS.length - 1);
  if (action === "debrief-back") state.debriefStep = Math.max((state.debriefStep || 0) - 1, 0);
  if (action === "debrief-jump") state.debriefStep = Math.min(Math.max(Number(control.dataset.index) || 0, 0), DEBRIEF_STEPS.length - 1);
  if (action === "submit-debrief") submitDebrief();
  if (action === "advance-foundation") advanceFoundation();
  if (action === "open-export") { state.modal = "export"; clearImport(); }
  if (action === "open-report") state.modal = "report";
  if (action === "download-backup") downloadBackup();
  if (action === "confirm-import" && pendingImport) {
    state = pendingImport;
    pendingImport = null;
    lastGoodPayload = null; // force a fresh last-good snapshot for the restored data
    state.modal = "";
    state.importStatus = "";
    state.importMessage = "";
  }
  if (action === "cancel-import") clearImport();
  if (action === "dismiss-reentry") state.reentry = false;
  if (action === "dismiss-recovery") state.restoredFromBackup = false;
  if (action === "set-proof-filter") state.proofFilter = control.dataset.filter;
  if (action === "reset") state.modal = "confirmReset";
  if (action === "confirm-reset") { state.modal = ""; resetState(); }

  render();
});

function startFirstOrder() {
  const order = ORDER_COPY[state.selectedOrder];
  executionSeconds = order.minutes * 60;
  executionStartedAt = Date.now();
  state.view = "order-execute";
  startTimer();
}

function startTimer() {
  stopTimer();
  tickHandle = window.setInterval(() => {
    const node = document.querySelector("#timerValue");
    if (node) node.textContent = formatTime(getRemainingSeconds());
    if (getRemainingSeconds() <= 0) stopTimer();
  }, 250);
}

function stopTimer() {
  if (tickHandle) window.clearInterval(tickHandle);
  tickHandle = null;
}

// Mission practice timer: a real 10-minute countdown (reuses the order-execute timer infra) so the
// brief shows a live clock instead of a frozen "10:00". Session-scoped (resets on reload, restarted
// on boot if the mission is still active).
function startMissionTimer() {
  executionSeconds = 600;
  executionStartedAt = Date.now();
  startTimer();
}

function getRemainingSeconds() {
  if (!executionStartedAt) return executionSeconds;
  const elapsed = Math.floor((Date.now() - executionStartedAt) / 1000);
  return Math.max(executionSeconds - elapsed, 0);
}

function completeFirstOrder(status) {
  state.firstOrderStatus = status;
  state.report.completed = status === "completed" ? "completed" : "not completed";
  if (state.quitSignal && !state.report.resisted.includes(state.quitSignal)) {
    state.report.resisted.push(state.quitSignal);
  }
  stopTimer();
  state.view = "report";
}

function submitFirstReport() {
  state.firstOrderStatus = state.report.completed === "completed" ? "completed" : "failed";
  if (state.firstOrderStatus === "failed") {
    state.assessmentFailures += 1;
  }
  state.status = state.firstOrderStatus === "completed" ? "Provisional Candidate" : "Assessment Paused";
  state.view = "result";
}

// Just-in-time onboarding: the first proof drops the user straight into the app. The safety check
// and claim selection are deferred to one-time Today cards (see renderSafetyCard/renderClaimCard),
// so nothing blocks getting in. The account screen is dropped entirely (data is local-only).
function finishOnboarding() {
  state.onboardingComplete = true;
  state.status = "Foundation Candidate";
  state.foundation.started = true;
  state.foundation.currentDay = Math.max(1, state.foundation.currentDay || 1);
  state.tab = "today";
  setPracticeForDay(state.foundation.currentDay);
  updateStandardsFromReadiness();
}

// Confirms the deferred safety calibration (one-time). Keeps protected status if a critical flag
// was set. Does not auto-start a practice — the user taps Begin Practice when ready.
function confirmSafetyCheck() {
  state.safetyChecked = true;
  if (hasCriticalSafetyFlag()) state.status = "Protected Candidate";
}

function setPracticeForDay(dayNumber) {
  const firstDay = FOUNDATION_DAYS[0].day;
  const lastDay = FOUNDATION_DAYS[FOUNDATION_DAYS.length - 1].day;
  const clamped = Math.min(Math.max(Number(dayNumber) || firstDay, firstDay), lastDay);
  const day = FOUNDATION_DAYS.find(item => item.day === clamped) || FOUNDATION_DAYS[0];
  const assignment = choosePracticeAssignment(day);
  state.foundation.currentDay = day.day;
  state.mission = {
    ...state.mission,
    day: day.day,
    name: assignment.name,
    domain: assignment.domain,
    objective: assignment.objective,
    knownThreat: assignment.knownThreat,
    standard: assignment.standard,
    minimum: assignment.minimum,
    deadline: day.deadline,
    status: "assigned",
    result: "",
    scaled: false,
    painReported: false,
    minimumOnly: false,
    prediction: null,
  };
  state.debriefMode = "quick";
  state.quick = { result: "", friction: "", note: "", logged: "" };
  state.engine.assignmentReason = assignment.reason;
  state.engine.targetedPractice = assignment.targeted ? assignment.name : null;
}

function selectFoundationDay(dayNumber) {
  const allowed = dayNumber <= state.foundation.currentDay || state.foundation.completedDays.includes(dayNumber);
  if (!allowed) return;
  setPracticeForDay(dayNumber);
  state.tab = "mission";
}

function guideAnswer(focus) {
  const readiness = computeReadiness(state.readiness);
  const dominant = dominantHighFriction();
  const claimCase = buildClaimCase();
  const answers = {
    Friction: dominant
      ? `${dominant.name} is repeating. Do the minimum standard first, then reflect on the trigger before changing the plan.`
      : "No repeated friction dominates yet. Start the assigned practice before negotiating with it.",
    Readiness: `${readiness.command}: ${readiness.reason}`,
    Claim: `${state.claim} is ${claimCase.status.toLowerCase()}. ${claimCase.replacement}`,
    Recovery: readiness.command === "RECOVER"
      ? "Recovery is the active standard. No physical escalation counts as proof today."
      : "Recovery is still tracked. Preserve sleep, report pain honestly, and scale before reckless output.",
  };
  return answers[focus] || answers.Friction;
}

function submitCircleCheckin() {
  const circle = state.modules.circle;
  const text = circle.latestCheckin.trim();
  if (!text) return;
  const parts = text.split(/[.;\n]/).map(part => part.trim()).filter(Boolean);
  circle.checkins.unshift({
    name: (state.profile.callsign || "").trim() || (state.profile.displayName || "").trim() || "You",
    status: "Check-in logged",
    blocker: parts[1] || "Named",
    next: parts[2] || parts[0] || "Next clean action",
  });
  circle.checkins = circle.checkins.slice(0, 5);
  circle.latestCheckin = "";
  recordModuleProof({
    domain: "integrity",
    text: `Circle check-in logged: ${text}`,
    friction: "Accountability",
    decision: "Hold",
    quality: 3,
  });
}

function completeConnectionPractice() {
  const connection = state.modules.connection;
  connection.completed = Array.from(new Set([...connection.completed, ...connection.commitments]));
  recordModuleProof({
    domain: "integrity",
    text: `Connection practice completed for duty: ${connection.duty}`,
    friction: "Isolation",
    decision: "Hold",
    quality: 4,
  });
}

function practicePrinciple() {
  const principles = state.modules.principles;
  const selected = PRINCIPLES.find(item => item.id === principles.selected) || PRINCIPLES[0];
  if (!principles.practiced.includes(selected.id)) principles.practiced.push(selected.id);
  recordModuleProof({
    domain: selected.id === "recovery" ? "readiness" : "mind",
    text: `Principle practiced: ${selected.title}`,
    friction: "Doctrine",
    decision: selected.id === "recovery" ? "Recover" : "Hold",
    quality: 3,
    minimumOnly: false,
  });
}

function completePressurePractice() {
  const pressure = state.modules.pressure;
  const readiness = computeReadiness(state.readiness);
  const reckless = readiness.command === "RECOVER" && pressure.load > 2;
  pressure.completions += 1;
  pressure.result = reckless ? "Rejected: load exceeded readiness" : `Completed at load ${pressure.load}`;
  if (!reckless) {
    state.modules.advanced.integratedProofs += pressure.load >= 4 ? 1 : 0;
    recordModuleProof({
      domain: pressure.domain,
      text: `Pressure practice completed in ${pressure.domain} at load ${pressure.load}.`,
      friction: "Pressure",
      decision: readiness.command === "SCALE" ? "Scale" : "Hold",
      quality: pressure.load >= 4 ? 4 : 3,
    });
  } else {
    recordModuleProof({
      status: "Under Review",
      domain: "readiness",
      text: `Pressure practice attempted at load ${pressure.load} during recovery state.`,
      friction: "Reckless escalation",
      decision: "Press",
      quality: 2,
    });
  }
  updateAdvancedTier();
}

function grantIntegratedProof() {
  state.modules.advanced.integratedProofs += 1;
  updateAdvancedTier();
  recordModuleProof({
    domain: "execution",
    text: "Integrated proof manually granted for prototype testing.",
    friction: "Pressure",
    decision: "Hold",
    quality: 4,
  });
}

function syncSignals() {
  const signals = state.modules.signals;
  signals.connected = true;
  signals.syncs += 1;
  signals.sleepScore = Math.max(55, Math.min(96, signals.sleepScore + (signals.syncs % 2 ? 4 : -2)));
  signals.strain = Math.max(18, Math.min(88, signals.strain + (signals.syncs % 2 ? 9 : -6)));
  signals.restingPulse = Math.max(48, Math.min(82, signals.restingPulse + (signals.syncs % 2 ? 1 : -1)));
  state.readiness.sleep = signals.sleepScore >= 82 ? 4 : signals.sleepScore >= 65 ? 3 : 2;
  state.readiness.energy = signals.strain >= 75 ? 2 : signals.strain >= 55 ? 3 : 4;
  state.readiness.soreness = signals.strain >= 75 ? 4 : signals.strain >= 55 ? 3 : 2;
  updateStandardsFromReadiness();
}

function submitHumanReview() {
  const review = state.modules.review;
  review.submitted = true;
  if (review.note.trim().length < 12) {
    review.feedback = "Review needs a specific proof pattern before a human can judge it.";
    return;
  }
  review.feedback = "Submitted. Prototype reviewer flags the pattern as coherent and asks for one repeated proof.";
  recordModuleProof({
    status: "Under Review",
    domain: "integrity",
    text: `Human review submitted: ${review.note}`,
    friction: "External review",
    decision: "Hold",
    quality: 3,
  });
}

function updateBenchmarkBand() {
  const benchmarks = state.modules.benchmarks;
  if (benchmarks.privateScore >= 90) benchmarks.band = "Advanced";
  else if (benchmarks.privateScore >= 75) benchmarks.band = "Stable";
  else if (benchmarks.privateScore >= 50) benchmarks.band = "Developing";
  else benchmarks.band = "Base";
}

function loadSampleHistoryCsv() {
  state.modules.history.fileName = "sample-training-history.csv";
  state.modules.history.csvText = [
    "date,type,duration_minutes,distance_km,avg_hr,rpe",
    "2026-05-04,Run,34,6.1,142,6",
    "2026-05-06,Strength,48,,128,7",
    "2026-05-09,Run,42,7.4,148,7",
    "2026-05-13,Cycling,55,21.2,136,6",
    "2026-05-16,Strength,51,,132,7",
    "2026-05-20,Run,38,6.8,144,6",
    "2026-05-23,Mobility,22,,101,3",
    "2026-05-27,Strength,53,,134,7",
    "2026-05-30,Run,46,8.2,151,8",
    "2026-06-03,Cycling,61,24.6,139,6",
    "2026-06-07,Run,44,7.9,149,7",
    "2026-06-11,Strength,49,,131,7",
    "2026-06-15,Run,52,9.3,153,8",
    "2026-06-18,Mobility,25,,98,3",
    "2026-06-19,Strength,50,,133,7",
    "2026-06-20,Run,40,7.1,146,6",
  ].join("\n");
  analyzeHistoryCsv();
}

function analyzeHistoryCsv() {
  const history = state.modules.history;
  const text = history.csvText.trim();
  history.lastError = "";
  history.applied = false;
  if (!text) {
    clearHistoryImport("CSV is empty.");
    return;
  }

  const rows = parseCsvRows(text);
  if (rows.length < 2) {
    clearHistoryImport("CSV needs a header row and at least one activity row.");
    return;
  }

  const objects = csvObjects(rows);
  const workouts = objects.map(mapHistoryWorkout).filter(Boolean);
  if (!workouts.length) {
    clearHistoryImport("No valid dated sessions were found.");
    history.rows = Math.max(0, rows.length - 1);
    return;
  }

  const summary = summarizeHistoryWorkouts(workouts);
  history.rows = objects.length;
  history.workouts = workouts
    .slice()
    .sort((a, b) => b.dateObj - a.dateObj)
    .slice(0, 20)
    .map(({ dateObj, ...item }) => item);
  history.summary = summary;
  history.status = `Imported ${summary.sessions} sessions`;
  history.importedAt = new Date().toISOString();
}

function clearHistoryImport(message) {
  const history = state.modules.history;
  history.status = "Import blocked";
  history.lastError = message;
  history.rows = 0;
  history.workouts = [];
  history.summary = structuredClone(DEFAULT_STATE.modules.history.summary);
}

function applyHistoryBaseline() {
  const history = state.modules.history;
  const summary = history.summary;
  if (!summary.sessions) return;

  history.applied = true;
  history.status = "Baseline applied";
  const day = Number((summary.recommendedStart.match(/Day (\d)/) || [])[1] || 1);
  const nextDay = Math.max(1, Math.min(FOUNDATION_DAYS.length, day));
  state.foundation.currentDay = Math.max(state.foundation.currentDay || 1, nextDay);
  if (state.onboardingComplete || state.foundation.started) {
    setPracticeForDay(state.foundation.currentDay);
  }

  const elevatedRisk = summary.loadRisk !== "No obvious spike";
  if (elevatedRisk) {
    state.readiness.energy = Math.min(state.readiness.energy, 3);
    state.readiness.soreness = Math.max(state.readiness.soreness, 3);
    state.modules.signals.strain = Math.max(state.modules.signals.strain, 65);
    updateStandardsFromReadiness();
  }

  state.engine.assignmentReason = `CSV history calibrated ${summary.recommendedStart}. Proof still starts inside Spartan X.`;
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(value => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(value => value !== "")) rows.push(row);
  return rows;
}

function csvObjects(rows) {
  const headers = rows[0].map(normalizeCsvHeader);
  return rows.slice(1).map(row => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index] || "";
    });
    return item;
  });
}

function normalizeCsvHeader(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function mapHistoryWorkout(row) {
  const dateValue = findCsvValue(row, ["date", "day", "start", "startdate", "starttime", "timestamp", "time"]);
  const dateObj = parseHistoryDate(dateValue.value);
  if (!dateObj) return null;

  const duration = findCsvValue(row, ["durationminutes", "durationmin", "minutes", "duration", "movingtime", "elapsedtime", "timeinseconds"]);
  const distance = findCsvValue(row, ["distancekm", "distance", "distancemeters", "distancemi", "miles"]);
  const type = findCsvValue(row, ["type", "activity", "activitytype", "sport", "workout", "name"]);
  const heartRate = findCsvValue(row, ["avghr", "averagehr", "heartrate", "avgheartrate", "averageheartrate"]);
  const load = findCsvValue(row, ["rpe", "strain", "load", "trainingload", "effort"]);

  return {
    date: dateObj.toISOString().slice(0, 10),
    dateObj,
    type: cleanHistoryType(type.value),
    durationMinutes: parseHistoryDuration(duration.value, duration.key),
    distanceKm: parseHistoryDistance(distance.value, distance.key),
    averageHeartRate: parseOptionalNumber(heartRate.value),
    load: parseOptionalNumber(load.value),
  };
}

function findCsvValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== "") return { key, value: row[key] };
  }
  return { key: "", value: "" };
}

function parseHistoryDate(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const parts = trimmed.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})$/);
  if (!parts) return null;
  const year = parts[3].length === 2 ? `20${parts[3]}` : parts[3];
  const retry = new Date(`${year}-${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}`);
  return Number.isNaN(retry.getTime()) ? null : retry;
}

function cleanHistoryType(value) {
  const cleaned = String(value || "Training").trim();
  return cleaned ? cleaned.slice(0, 32) : "Training";
}

function parseHistoryDuration(value, key) {
  const text = String(value || "").trim();
  if (!text) return 0;
  if (text.includes(":")) {
    const parts = text.split(":").map(Number).filter(part => !Number.isNaN(part));
    if (parts.length === 3) return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
    if (parts.length === 2) return Math.round(parts[0] + parts[1] / 60);
  }
  const number = parseOptionalNumber(text);
  if (!number) return 0;
  if ((key.includes("elapsed") || key.includes("moving") || key.includes("seconds")) && number > 180) {
    return Math.round(number / 60);
  }
  return Math.round(number);
}

function parseHistoryDistance(value, key) {
  const number = parseOptionalNumber(value);
  if (!number) return 0;
  if (key.includes("meter") || number > 100) return round1(number / 1000);
  if (key.includes("mile")) return round1(number * 1.60934);
  return round1(number);
}

function parseOptionalNumber(value) {
  const normalized = String(value || "").replace(",", ".").replace(/[^0-9.-]/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function summarizeHistoryWorkouts(workouts) {
  const ordered = workouts.slice().sort((a, b) => a.dateObj - b.dateObj);
  const first = ordered[0].dateObj;
  const last = ordered[ordered.length - 1].dateObj;
  const dayMs = 24 * 60 * 60 * 1000;
  const weeks = Math.max(1, Math.ceil((last - first) / (7 * dayMs)) + 1);
  const sessions = ordered.length;
  const avgPerWeek = round1(sessions / weeks);
  const recentCutoff = new Date(last.getTime() - 27 * dayMs);
  const recent = ordered.filter(item => item.dateObj >= recentCutoff);
  const recentPerWeek = round1(recent.length / 4);
  const totalMinutes = ordered.reduce((sum, item) => sum + item.durationMinutes, 0);
  const recentMinutes = recent.reduce((sum, item) => sum + item.durationMinutes, 0);
  const minutesPerWeek = totalMinutes / weeks;
  const recentMinutesPerWeek = recentMinutes / 4;
  const longestGapDays = longestHistoryGapDays(ordered);
  const activityMix = activityMixSummary(ordered);

  const trainingAge = weeks >= 52 ? "Long-term" : weeks >= 12 ? "Established" : weeks >= 4 ? "Forming" : "New";
  const consistency = avgPerWeek >= 4 ? "High" : avgPerWeek >= 2 ? "Stable" : avgPerWeek >= 1 ? "Intermittent" : "Sparse";
  let loadRisk = "No obvious spike";
  if (recentPerWeek >= avgPerWeek * 1.5 && recent.length >= 8) loadRisk = "Rising load";
  if (longestGapDays >= 21 && recent.length >= 6) loadRisk = "Return spike";
  if (avgPerWeek >= 5 || recentMinutesPerWeek > minutesPerWeek * 1.65 && recent.length >= 6) loadRisk = "High frequency";

  let recommendedStart = "Foundation Day 1";
  if (loadRisk !== "No obvious spike") recommendedStart = "Foundation Day 1 + SCALE bias";
  else if (sessions >= 48 && avgPerWeek >= 3) recommendedStart = "Foundation Day 3";
  else if (sessions >= 16 && avgPerWeek >= 2) recommendedStart = "Foundation Day 2";

  let confidence = 45;
  if (sessions >= 8) confidence += 15;
  if (sessions >= 16) confidence += 10;
  if (sessions >= 24) confidence += 15;
  if (ordered.some(item => item.durationMinutes > 0)) confidence += 10;
  if (activityMix.length) confidence += 5;
  if (ordered.some(item => item.distanceKm || item.averageHeartRate || item.load)) confidence += 5;

  return {
    sessions,
    weeks,
    avgPerWeek,
    recentSessions: recent.length,
    trainingAge,
    consistency,
    loadRisk,
    recommendedStart,
    confidence: Math.min(95, confidence),
    activityMix,
    longestGapDays,
  };
}

function longestHistoryGapDays(ordered) {
  let longest = 0;
  const dayMs = 24 * 60 * 60 * 1000;
  for (let index = 1; index < ordered.length; index += 1) {
    const gap = Math.round((ordered[index].dateObj - ordered[index - 1].dateObj) / dayMs);
    longest = Math.max(longest, gap);
  }
  return longest;
}

function activityMixSummary(workouts) {
  const counts = {};
  workouts.forEach(item => {
    counts[item.type] = (counts[item.type] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type, count }));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function recordCognitiveResponse(correct) {
  const cognitive = state.modules.cognitive;
  cognitive.attempts += 1;
  if (correct) cognitive.correct += 1;
  cognitive.load = Math.max(1, Math.min(5, cognitive.load + (correct && cognitive.attempts % 3 === 0 ? 1 : 0)));
}

function updateAdvancedTier() {
  const advanced = state.modules.advanced;
  if (advanced.integratedProofs >= 3 && advanced.correctionRate >= 80 && advanced.readinessAdherence >= 85) {
    advanced.tier = "Advanced Standard";
  } else if (advanced.integratedProofs >= 1 && advanced.correctionRate >= 70 && advanced.readinessAdherence >= 80 && advanced.minimumRescueRate >= 60) {
    advanced.tier = "Integrated Standard";
  } else {
    advanced.tier = "Foundation Confirmed";
  }
}

// B4 tamper-evident proof chain. EVIDENT, not cryptographic: it detects casual hand-edits of stored
// proofs (e.g. flipping a status in devtools). The algorithm is client-visible, so a determined user
// could recompute the whole forward chain — an inherent limit of any client-only integrity check.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function hashEntry(entry, prevHash) {
  const canon = [
    prevHash, entry.date, entry.status, entry.result, entry.text, entry.friction,
    entry.decision, entry.domain, entry.day, entry.minimumOnly, entry.effect,
    entry.quality, entry.source,
  ].join("␟");
  return fnv1a(canon) + fnv1a(canon + "::salt"); // two passes widen the digest to cut collisions
}

// Per-entry, content-addressed tamper-evidence: every hash-bearing entry must hash-match its own
// content (+ its recorded prevHash). This is the CRDT-safe form — it survives a cross-device union
// merge (where adjacent entries come from different device chains), while still catching the real
// threat: a proof's content edited after signing. Legacy entries (no hash) are skipped, not flagged.
function verifyLedger(ledger) {
  if (!Array.isArray(ledger)) return false;
  for (let i = 0; i < ledger.length; i++) {
    const e = ledger[i];
    if (!e || typeof e.hash !== "string") continue;
    if (hashEntry(e, e.prevHash) !== e.hash) return false;        // content edited after signing
  }
  return true;
}

// Single chokepoint for ALL proof + standard mutation. The safety gate lives here so no proof
// path (reflection or module) can bypass it, now or after future edits.
function applyProof(entry) {
  // Safety override: a critical safety flag forces any accepted proof to Under Review.
  if (entry.status === "Accepted" && hasCriticalSafetyFlag()) {
    entry.status = "Under Review";
    entry.effect = standardEffect(entry.status, entry.quality, entry.minimumOnly);
  }
  // Chain the entry to the current head AFTER its final status/effect are set.
  entry.prevHash = (state.proofLedger[0] && state.proofLedger[0].hash) || "genesis";
  entry.hash = hashEntry(entry, entry.prevHash);
  entry.at = new Date().toISOString(); // sortable timestamp for lossless cross-device merge (not hashed)
  state.proofLedger.unshift(entry);
  state.proofLedger = state.proofLedger.slice(0, 200);
  state.lastProof = entry;
  state.debriefCount += 1;
  updateStandardsFromProof(entry);
  return entry;
}

// Phase-B sync primitive (local-first, CRDT-style): the proof ledger is an append-only,
// content-addressed (B4 hash) log, so merging two devices is a lossless SET UNION by hash — no
// last-write-wins data loss (cf. FP-TW-SYNC-UNION). Newest-first by timestamp; capped like applyProof.
function ledgerKey(e) {
  return e && (e.hash || [e.date, e.text, e.domain, e.quality, e.decision].join("|"));
}

// A server-returned proof is trusted only if its B4 signature matches its content (mirror of the
// server's own anti-cheat) — so a hostile/compromised/MITM backend can't inject forged entries on sync.
function proofSignatureValid(e) {
  return !!e && typeof e.hash === "string" && hashEntry(e, e.prevHash) === e.hash;
}

function mergeLedgers(a, b) {
  const seen = new Map();
  for (const e of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!e) continue;
    const k = ledgerKey(e);
    if (!seen.has(k)) seen.set(k, e);
  }
  return [...seen.values()]
    .sort((x, y) => String(y.at || "").localeCompare(String(x.at || "")))
    .slice(0, 200);
}

// ---- Phase-B cloud client (opt-in, local-first). Every call is wrapped so a cloud failure NEVER
// blocks the offline app. Configure via ?backend=<url> or System → Cloud. ----
function cloudConfigured() { return !!(state.cloud && state.cloud.url); }

function cloudSnapshot() {
  const r = computeReport();
  return {
    handle: state.cloud.handle || state.profile.callsign || "Operator",
    metrics: { activeDays: r.activeDays, reflections: r.reflections, totalProofs: r.totalProofs, avgQuality: r.avgQuality, highestTier: r.highestTier, recoveryProofs: r.recoveryProofs },
    proofLedger: state.proofLedger,
  };
}

async function cloudCall(path, opts) {
  const base = state.cloud.url.replace(/\/$/, "");
  const res = await fetch(base + path, Object.assign({ headers: { "content-type": "application/json" } }, opts || {}));
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function cloudSync() {
  if (!cloudConfigured()) { state.cloud.status = "Cloud is off — this app is local-only."; render(); return; }
  try {
    state.cloud.status = "Syncing…"; render();
    if (!state.cloud.token) {
      const a = await cloudCall("/api/auth", { method: "POST", body: JSON.stringify({ callsign: state.profile.callsign || "Operator" }) });
      state.cloud.handle = a.handle; state.cloud.token = a.token;
    }
    // Server union-merges + re-verifies the hash chain (anti-cheat); merge its result back losslessly.
    const s = await cloudCall("/api/sync", { method: "POST", body: JSON.stringify({ token: state.cloud.token, snapshot: cloudSnapshot() }) });
    if (Array.isArray(s.ledger)) {
      // Don't trust the backend's response: accept only signature-valid entries the client doesn't
      // already hold, and only fill the remaining room — server data can never evict local proofs.
      const localKeys = new Set(state.proofLedger.map(ledgerKey));
      const additions = s.ledger
        .filter(proofSignatureValid)
        .filter(e => !localKeys.has(ledgerKey(e)))
        .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
      const room = Math.max(0, 200 - state.proofLedger.length);
      state.proofLedger = mergeLedgers(state.proofLedger, additions.slice(0, room));
    }
    const lb = await cloudCall("/api/leaderboard");
    const ch = await cloudCall("/api/challenges");
    state.cloud.leaderboard = lb.leaderboard || [];
    state.cloud.challenges = ch.challenges || [];
    state.cloud.lastSync = new Date().toISOString();
    state.cloud.status = `Synced as ${state.cloud.handle}.` + (s.rejected ? ` ${s.rejected} proof(s) rejected by server verification.` : "");
  } catch (error) {
    state.cloud.status = "Cloud unavailable — your data is safe locally."; // local-first: never blocks
  }
  render();
}

async function cloudCompleteChallenge(id) {
  if (!cloudConfigured() || !state.cloud.token) return;
  // Safety over competition: never let chasing a challenge override recovery or a safety restriction.
  if (hasActivityRestrictingFlag() || computeReadiness(state.readiness).command === "RECOVER") {
    state.cloud.status = "Challenges pause during recovery or a safety flag — hold the standard first.";
    render();
    return;
  }
  try {
    const r = await cloudCall("/api/challenges/" + encodeURIComponent(id) + "/complete", { method: "POST", body: JSON.stringify({ token: state.cloud.token, snapshot: cloudSnapshot() }) });
    state.cloud.status = r.met ? "Challenge completed ✓" : "Not met yet — keep going.";
    await cloudSync();
  } catch (error) { state.cloud.status = "Could not submit challenge."; render(); }
}

function recordModuleProof({
  status = "Accepted",
  result = "Completed",
  text,
  friction,
  decision,
  domain,
  quality = 3,
  minimumOnly = false,
}) {
  // Module activity is logged evidence; applyProof enforces the safety gate.
  applyProof({
    date: new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }),
    status,
    result,
    text,
    friction,
    decision,
    domain,
    day: state.mission.day,
    minimumOnly,
    effect: standardEffect(status, quality, minimumOnly),
    quality,
    source: "module",
  });
}

// Progressive overload: the prescribed floor RISES with the domain's level, so the Moving Standard
// moves the actual work — not just the label. Clamped; Forming/Regressed/Under Review → the base rung.
const OVERLOAD_LADDER = [
  { tag: "Establish the rep", standard: "Establish the rep — form over volume.", mult: 1, mode: "once, clean." },
  { tag: "Hold the standard", standard: "Hold the standard — no scaling.", mult: 1, mode: "the full amount, no scaling." },
  { tag: "Raise the floor", standard: "Raise the floor — beat last time.", mult: 1.5, mode: "" },
  { tag: "Sustain under fatigue", standard: "Sustain the higher floor under fatigue.", mult: 2, mode: "back-to-back, quality held." },
  { tag: "Compress", standard: "Compress — same standard, harder conditions.", mult: 2, mode: "in less time or at higher difficulty." },
];
// Numeric base per domain so overload resolves to an EXACT target (e.g. "3 min controlled movement —
// 1.5× base"), not an abstract "base minimum". The rung multiplier scales the base count.
const DOMAIN_BASE = {
  body: { n: 2, label: "min controlled movement" },
  mind: { n: 3, label: "min single-target focus" },
  will: { n: 5, label: "min started before the feeling" },
  execution: { n: 1, label: "protected practice window", plural: "protected practice windows" },
};
function overloadFor(domain) {
  const lvl = Math.max(0, Math.min(levelIndex(state.standards[domain]), OVERLOAD_LADDER.length - 1));
  const rung = OVERLOAD_LADDER[lvl];
  const b = DOMAIN_BASE[domain] || { n: 1, label: "rep of the base practice", plural: "reps of the base practice" };
  const n = Math.ceil(b.n * rung.mult);
  const label = n === 1 ? b.label : (b.plural || b.label);
  const mode = rung.mode ? ` — ${rung.mode}` : (rung.mult > 1 ? ` — ${rung.mult}× base` : "");
  return { ...rung, minimum: `${n} ${label}${mode}` };
}

function choosePracticeAssignment(day) {
  if (["completed", "scaled", "failed", "pain"].includes(state.mission.status)) {
    return {
      ...day,
      name: "Reflection Closure",
      domain: "integrity",
      objective: "Close the open practice through reflection before taking new proof.",
      knownThreat: "False progress",
      standard: "No reflection. No standard.",
      minimum: "Submit a complete reflection with one correction.",
      reason: "Previous practice is not closed. Reflection closure takes priority.",
      targeted: true,
    };
  }

  if (computeReadiness(state.readiness).command === "RECOVER") {
    return {
      ...day,
      name: "Recovery Practice",
      domain: "readiness",
      objective: "Complete a recovery-safe practice. Physical intensity is disabled.",
      knownThreat: "Overreach",
      standard: "Recovery is the standard.",
      minimum: "10 minutes downregulation and a sleep-window note.",
      reason: "Readiness command is RECOVER. Intensity is disabled.",
      targeted: true,
    };
  }

  const dominant = dominantHighFriction();
  if (dominant && dominant.count >= 3) {
    const targeted = targetedPracticeForFriction(dominant.name, day);
    return {
      ...targeted,
      reason: `${dominant.name} appeared ${dominant.count} times. Targeted practice overrides default sequence.`,
      targeted: true,
    };
  }

  if (state.claim === "I do not have enough time." && day.day === 2) {
    return {
      ...day,
      name: "Time Reality",
      domain: "execution",
      objective: "Audit the last 24 hours and protect one practice window before comfort.",
      knownThreat: "No-time story",
      standard: "Evidence before claim.",
      minimum: "Find one low-value window equal to the minimum practice.",
      reason: "Active claim is time scarcity. Day 2 collects direct evidence.",
      targeted: true,
    };
  }

  if (state.proofLedger.some(entry => entry.status === "Rejected")) {
    return {
      ...day,
      name: "Correction Practice",
      domain: "integrity",
      objective: "Correct the last rejected proof with one honest action and one reflection.",
      knownThreat: "Identity collapse",
      standard: "Failure corrected beats failure hidden.",
      minimum: "Name the breach and complete one corrective action.",
      reason: "Rejected proof exists. Correction takes priority before standard movement.",
      targeted: true,
    };
  }

  if (state.foundation.completedDays.length >= FOUNDATION_DAYS.length) {
    const domain = weakestDomain();
    const o = overloadFor(domain);
    const level = state.standards[domain];
    // Gap fix B1 (the trainer's fix): if the user logs a real number, the floor becomes THEIR number.
    // "Beat your last" is literal overload on a measured thing — self-reported, and said to be.
    const best = state.domainLast && Number(state.domainLast[domain]) > 0 ? Number(state.domainLast[domain]) : null;
    return {
      ...day,
      name: "Continued Standard",
      domain,
      objective: `Train your weakest domain (${domain}) — now at ${level}. ${o.tag}.`,
      knownThreat: "Avoiding the weak domain",
      standard: best ? "Beat your last — your number, your word." : o.standard,
      minimum: best ? `Beat your last logged: ${best} (minutes or reps — whatever you logged).` : o.minimum,
      reason: `Foundation complete. ${domain} is at ${level} — the floor rises with ${best ? "your own logged number" : "the level"}, not just the label.`,
      targeted: true,
    };
  }

  return {
    ...day,
    reason: `Foundation Day ${day.day} sequence active.`,
    targeted: false,
  };
}

function dominantHighFriction() {
  const counts = {};
  state.proofLedger.slice(0, 7).forEach(entry => {
    const high = /High|Avoidance|Boredom|Fatigue|Ego|Negotiation|Pain/.test(entry.friction);
    if (!high) return;
    entry.friction.split(",").map(item => item.trim()).filter(Boolean).forEach(name => {
      counts[name] = (counts[name] || 0) + 1;
    });
  });
  const [name, count] = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] || [];
  return name ? { name, count } : null;
}

// PRD 5.3: domain priority by weakest trainable domain (lowest standard level, then fewest reflected proofs).
function weakestDomain() {
  const accepted = acceptedProofs().filter(p => p.source !== "module");
  return TRAINABLE_DOMAINS
    .map(domain => ({
      domain,
      level: Math.max(0, levelIndex(state.standards[domain])),
      proofs: accepted.filter(p => p.domain === domain).length,
    }))
    .sort((a, b) => a.level - b.level || a.proofs - b.proofs || TRAINABLE_DOMAINS.indexOf(a.domain) - TRAINABLE_DOMAINS.indexOf(b.domain))[0].domain;
}

function targetedPracticeForFriction(name, fallbackDay) {
  const base = {
    day: fallbackDay.day,
    deadline: fallbackDay.deadline,
  };
  const map = {
    Boredom: {
      ...base,
      name: "Monotony Tolerance",
      domain: "will",
      objective: "Complete a simple practice without novelty, stimulation, or switching.",
      knownThreat: "Boredom",
      standard: "Stay with the simple thing.",
      minimum: "3 minutes single-task repetition.",
    },
    Fatigue: {
      ...base,
      name: "Minimum Under Fatigue",
      domain: "will",
      objective: "Complete the minimum practice while fatigue is present.",
      knownThreat: "Fatigue",
      standard: "Scale without disappearing.",
      minimum: "2 minutes controlled practice and reflection.",
    },
    Avoidance: {
      ...base,
      name: "Avoidance Contact",
      domain: "execution",
      objective: "Start the avoided action before explaining it.",
      knownThreat: "Avoidance",
      standard: "Contact before analysis.",
      minimum: "Open the task and work for 5 minutes.",
    },
    Negotiation: {
      ...base,
      name: "Negotiation Cutoff",
      domain: "mind",
      objective: "Name the negotiation and begin before a second argument appears.",
      knownThreat: "Negotiation",
      standard: "One signal. One action.",
      minimum: "Write the excuse and complete 2 minutes.",
    },
    Pain: {
      ...base,
      name: "Recovery Literacy",
      domain: "readiness",
      objective: "Stop escalation and complete a recovery-safe practice.",
      knownThreat: "Pain override",
      standard: "Pain changes the practice.",
      minimum: "2 minutes downregulation and safety note.",
    },
  };
  return map[name] || {
    ...base,
    name: `${name} Practice`,
    domain: "execution",
    objective: `Complete a minimum practice while ${name.toLowerCase()} is present.`,
    knownThreat: name,
    standard: "Name the friction. Continue cleanly.",
    minimum: "2 minutes minimum practice and reflection.",
  };
}

function beginMission() {
  // Safety check is a one-time gate before the first real practice (deferred from onboarding).
  if (!state.safetyChecked) { state.tab = "today"; return; }
  state.mission.status = "active";
  startMissionTimer();
  state.tab = "mission";
}

// Post-Foundation continuation: assign the next practice (weakest-domain Continued Standard) and begin it.
function continueStandard() {
  setPracticeForDay(FOUNDATION_DAYS.length);
  const domain = weakestDomain();
  state.engine.assignmentReason = `Continued Standard → ${domain} (your weakest domain). ${standardProgressNote(domain)}`;
  beginMission();
}

function completeMission() {
  if (state.mission.status !== "active") {
    state.mission.status = "active";
    startMissionTimer();
    return;
  }
  stopTimer();
  state.mission.status = "completed";
  state.mission.result = "Completed";
  state.debrief.result = "Completed";
  state.debriefMode = "quick"; // every fresh close starts at the 15-second path; depth is a choice
  state.tab = "debrief";
}

function scaleMission() {
  state.mission.status = "scaled";
  state.mission.scaled = true;
  state.mission.minimumOnly = true;
  state.mission.result = "Scaled";
  state.debrief.result = "Scaled";
  state.debrief.decision = "Scale";
  if (!state.debrief.friction.includes("Fatigue")) state.debrief.friction.push("Fatigue");
  state.tab = "debrief";
}

function applyAdjustPractice() {
  const reason = state.adjustReason || "Other";
  state.modal = "";
  if (reason === "Pain warning") {
    reportPain();
    return;
  }
  state.mission.status = "scaled";
  state.mission.scaled = true;
  state.mission.minimumOnly = true;
  state.mission.result = "Scaled";
  state.debrief.result = "Scaled";
  state.debrief.decision = "Scale";
  addFrictionFromReason(reason);
  state.tab = "debrief";
}

function continueMinimumPractice() {
  const signal = state.pauseSignal || "Avoidance";
  state.modal = "";
  state.mission.status = "scaled";
  state.mission.scaled = true;
  state.mission.minimumOnly = true;
  state.debrief.result = "Scaled";
  state.debrief.decision = signal === "Fatigue" ? "Scale" : "Hold";
  if (!state.debrief.friction.includes(signal)) state.debrief.friction.push(signal);
  state.tab = "mission";
}

function protectAndReflect() {
  const signal = state.pauseSignal || "Danger";
  state.modal = "";
  state.mission.status = "pain";
  state.mission.painReported = true;
  state.mission.minimumOnly = true;
  state.readiness.pain = "severe";
  state.debrief.result = "Scaled";
  state.debrief.decision = "Recover";
  if (!state.debrief.friction.includes(signal)) state.debrief.friction.push(signal);
  state.tab = "debrief";
}

function stopAndReflect() {
  const signal = state.pauseSignal || "Avoidance";
  state.modal = "";
  state.mission.status = "failed";
  state.mission.result = "Failed";
  state.debrief.result = "Failed";
  state.debrief.decision = "Stop";
  if (!state.debrief.friction.includes(signal)) state.debrief.friction.push(signal);
  state.tab = "debrief";
}

function quitMainMission() {
  state.mission.status = "failed";
  state.mission.result = "Failed";
  state.debrief.result = "Failed";
  state.debrief.decision = "Stop";
  if (!state.debrief.friction.includes("Avoidance")) state.debrief.friction.push("Avoidance");
  state.tab = "debrief";
}

function reportPain() {
  state.mission.status = "pain";
  state.mission.painReported = true;
  state.readiness.pain = state.readiness.pain === "none" ? "moderate" : state.readiness.pain;
  state.debrief.result = "Scaled";
  state.debrief.decision = "Recover";
  if (!state.debrief.friction.includes("Pain")) state.debrief.friction.push("Pain");
  state.tab = "debrief";
}

// Quick close: the honest 15-second close. Same safety spine as the full debrief (pain override,
// crisis flag override, free-text scan on the note), quality fixed at 1 and source "quick" so it can
// NEVER count toward elevation — the standard moves only through full reflection.
function submitQuickClose() {
  const q = state.quick;
  if (!q.result) return;
  applySafetyLanguageScan(q.note);
  recordReadinessSnapshot();
  const result = { Clean: "Completed", Scaled: "Scaled", Miss: "Failed" }[q.result] || "Completed";
  const minimumOnly = Boolean(state.mission.minimumOnly) || q.result === "Scaled";
  const decision = q.result === "Scaled" ? "Scale" : "Hold";
  const unsafe = state.mission.painReported && !["Recover", "Scale"].includes(decision);
  let status = q.result === "Miss" ? "Incomplete" : "Accepted";
  if (unsafe || hasCriticalSafetyFlag()) status = "Under Review";
  const quality = 1;
  const entry = {
    date: new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }),
    status,
    result,
    text: `${result} ${state.mission.name} — quick close.${q.note.trim() ? " " + q.note.trim() : ""}`,
    friction: q.friction || "Unspecified",
    frictionLevel: "medium",
    decision,
    domain: state.mission.domain || "execution",
    day: state.mission.day,
    minimumOnly,
    effect: standardEffect(status, quality, minimumOnly),
    quality,
    source: "quick",
  };
  const prediction = state.mission.prediction || null;
  entry.prediction = prediction;
  entry.predictionHit = prediction ? prediction === outcomeBucket(result, minimumOnly) : null;
  const logged = Number(q.logged);
  if (Number.isFinite(logged) && logged > 0) {
    entry.logged = logged; // non-hashed: your own number, your word
    if (!state.domainLast || typeof state.domainLast !== "object") state.domainLast = {};
    state.domainLast[entry.domain] = logged;
  }
  state.mission.status = "closed";
  state.mission.result = "";
  state.mission.painReported = false;
  state.mission.scaled = false;
  state.mission.minimumOnly = false;
  state.mission.prediction = null;
  state.quick = { result: "", friction: "", note: "", logged: "" };
  state.debriefMode = "quick";
  applyProof(entry);
  state.tab = "proof-logged";
}

function submitDebrief() {
  applySafetyLanguageScan();
  recordReadinessSnapshot();
  const quality = scoreDebrief(state.debrief);
  const readiness = computeReadiness(state.readiness);
  const unsafe = state.mission.painReported && !["Recover", "Scale"].includes(state.debrief.decision);
  const minimumOnly = Boolean(state.mission.minimumOnly);
  let status = "Accepted";
  if (quality < 2) status = "Incomplete";
  if (unsafe || hasCriticalSafetyFlag() || readiness.command === "RECOVER" && state.debrief.decision === "Press") status = "Under Review";
  if (state.debrief.result === "Abandoned" && !state.debrief.correction.trim()) status = "Rejected";

  const effect = standardEffect(status, quality, minimumOnly);
  const entry = {
    date: new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }),
    status,
    result: state.debrief.result,
    text: `${state.debrief.result} ${state.mission.name} under ${state.debrief.friction.join(", ") || "named"} friction.`,
    friction: state.debrief.friction.join(", ") || "Unspecified",
    frictionLevel: state.debrief.frictionLevel || "medium",
    decision: state.debrief.decision,
    domain: state.mission.domain || "execution",
    day: state.mission.day,
    minimumOnly,
    effect,
    quality,
    source: "reflection",
  };

  // Calibration: score the pre-practice prediction against the real outcome (non-hashed fields).
  const prediction = state.mission.prediction || null;
  entry.prediction = prediction;
  entry.predictionHit = prediction ? prediction === outcomeBucket(entry.result, minimumOnly) : null;
  entry.negotiation = state.debrief.negotiation || ""; // kept (non-hashed) so recurring excuses can be mined

  if (state.debrief.decision === "Recover") state.recoveryObeyed = true;
  if (state.debrief.friction.includes("Boredom") || state.debrief.friction.includes("Fatigue")) state.noMoodMission = true;
  if (["Failed", "Abandoned", "Corrected"].includes(state.debrief.result)) state.failuresDebriefed += 1;

  state.mission.status = "closed";
  state.mission.result = "";
  state.mission.painReported = false;
  state.mission.scaled = false;
  state.mission.minimumOnly = false;
  state.mission.prediction = null;
  state.debrief = {
    result: "Completed",
    friction: [],
    frictionLevel: "medium",
    negotiation: "",
    decision: "Hold",
    lesson: "",
    correction: "",
  };
  state.debriefStep = 0;
  state.debriefMode = "quick";

  applyProof(entry);
  state.tab = "proof-logged";
}

function advanceFoundation() {
  const current = state.foundation.currentDay;
  if (!state.foundation.completedDays.includes(current)) {
    state.foundation.completedDays.push(current);
  }
  if (current < FOUNDATION_DAYS.length) {
    setPracticeForDay(current + 1);
    state.tab = "today";
    state.lastProof = null;
  } else {
    state.status = "Foundation Confirmed";
    state.recruitQualified = true;
    state.foundationGraduated = false; // triggers the one-time graduation card on Standard
    state.tab = "standard";
  }
}

function setPain(next) {
  const order = ["none", "mild", "moderate", "severe"];
  const current = state.readiness.pain;
  const isDowngrade = order.indexOf(next) < order.indexOf(current);
  // Soft acknowledgment (not a lock): lowering a high pain signal asks for one confirmation
  // so a protected state is not left by accident. Honest self-report is still allowed.
  if (isDowngrade && (current === "severe" || current === "moderate")) {
    state.pendingPain = next;
    state.modal = "painDowngrade";
    return;
  }
  state.readiness.pain = next;
  updateStandardsFromReadiness();
}

function confirmPainChange() {
  if (state.pendingPain !== null && state.pendingPain !== undefined) {
    state.readiness.pain = state.pendingPain;
  }
  state.pendingPain = null;
  state.modal = "";
  updateStandardsFromReadiness();
}

// Pure (no state, no flags): does a readiness snapshot read as recovery-level load? Used only by the
// PRESS-stability gate to look at the PREVIOUS snapshot — kept pure to avoid recursion into computeReadiness.
function readinessRecoverLevel(r) {
  if (!r) return false;
  const stressFlag = r.stress >= 4 || r.emotional >= 4;
  const markers = (r.sleep <= 2 ? 1 : 0) + (r.soreness >= 4 ? 1 : 0) + (r.energy <= 2 ? 1 : 0)
    + (["moderate", "severe"].includes(r.pain) ? 1 : 0) + (stressFlag ? 1 : 0);
  return r.pain === "severe" || markers >= 3;
}

function computeReadiness(r) {
  const stressFlag = r.stress >= 4 || r.emotional >= 4;
  const sleepDebt = r.sleep <= 2;
  const sorenessFlag = r.soreness >= 4;
  const lowEnergy = r.energy <= 2;
  const critical = hasCriticalSafetyFlag();
  const restricting = hasActivityRestrictingFlag();
  const overtraining = hasOvertrainingRisk();

  if (r.pain === "severe" || critical || restricting || overtraining || (r.sleep === 1 && r.energy === 1 && r.soreness >= 4)) {
    return {
      command: "RECOVER",
      reason: critical
        ? "Safety flag active. Hard challenge prompts are disabled."
        : restricting
          ? "You flagged injury, pain, or a medical restriction. Only recovery-safe practice is available."
          : overtraining
            ? "Overtraining risk detected across recent readiness checks. Recovery is the standard."
            : "Severe load risk detected. Physical intensity disabled.",
    };
  }

  if (r.pain === "moderate" || (sleepDebt && sorenessFlag) || (sleepDebt && lowEnergy) || (stressFlag && lowEnergy)) {
    return {
      command: "SCALE",
      reason: "Risk markers are elevated. Minimum practice remains; load must be reduced.",
    };
  }

  if (r.energy >= 4 && r.sleep >= 4 && r.soreness <= 2 && r.pain === "none" && !stressFlag) {
    // PRESS stability: straight out of a recovery-level check, hold the first strong check at HOLD and
    // require a second to confirm — prevents the one-good-day ego-press / bounce-back injury. Gated on
    // history, so the oracle's clean-state sweep (no readinessHistory) is unaffected.
    const prev = state.readinessHistory[state.readinessHistory.length - 1];
    if (prev && readinessRecoverLevel(prev)) {
      return {
        command: "HOLD",
        reason: "Readiness is recovering. Full standard unlocks after a second strong check.",
      };
    }
    return {
      command: "PRESS",
      reason: "Readiness supports full standard. No safety flag is active.",
    };
  }

  return {
    command: "HOLD",
    reason: "No major risk detected. Execute the assigned standard without escalation.",
  };
}

function canContinueProfile() {
  return Boolean(
    state.profile.email.trim()
    && state.profile.password.trim()
    && state.profile.displayName.trim()
    && state.profile.callsign.trim()
    && state.profile.ageConfirmed
    && state.profile.consentConfirmed
    && state.profile.consentChallenge
  );
}

function addFrictionFromReason(reason) {
  const map = {
    "Time constraint": "Time",
    Fatigue: "Fatigue",
    "Pain warning": "Pain",
    "Environment issue": "Uncertainty",
    "Emotional overload": "Fear",
    Other: "Uncertainty",
  };
  const friction = map[reason] || "Uncertainty";
  if (!state.debrief.friction.includes(friction)) state.debrief.friction.push(friction);
}

function applySafetyLanguageScan(extraText = "") {
  const text = [
    state.debrief.negotiation,
    state.debrief.lesson,
    state.debrief.correction,
    state.settings.injuryNotes,
    extraText,
  ].join(" ").toLowerCase();

  // Free-text backstop for the explicit Safety Gate. Word-boundary patterns
  // reduce trivial misses; this is a backstop, not the only safeguard. Sets the
  // same flag keys the Safety Gate and safetyMessage already understand.
  const patterns = {
    crisis: [
      /\bwant to die\b/, /\bkill myself\b/, /\bhurt myself\b/, /\bharm myself\b/,
      /\bself[\s-]?harm\b/, /\bcut(?:ting)? myself\b/, /\bsuicide\b/, /\bsuicidal\b/,
      /\boverdose\b/, /\bend (?:it all|my life|it)\b/, /\bno reason to (?:live|go on)\b/,
      /\bbetter off dead\b/, /\bdon'?t want to (?:live|be here|wake up|exist)\b/,
      /\bcan'?t go on\b/, /\bgive up on life\b/, /\bnothing to live for\b/,
    ],
    "self-punishment": [
      /\bpunish myself\b/, /\bself[\s-]?punish/, /\bdeserve (?:the )?pain\b/,
      /\bdeserve to suffer\b/, /\bmake myself suffer\b/, /\bhurt myself as punishment\b/,
      /\bi deserve (?:this|the) pain\b/, /\bbeat myself up\b/,
    ],
    restriction: [
      /\bnot eat\b/, /\bwon'?t eat\b/, /\bstop eating\b/, /\bstarve\b/,
      /\bfood is weakness\b/, /\bextreme restriction\b/, /\bskip(?:ping)? meals\b/,
      /\bpurge\b/, /\brestrict(?:ing)? (?:food|eating|calories|myself)\b/,
      /\bnot deserve to eat\b/, /\bpunish.*with food\b/,
    ],
    injury: [
      /\bsharp pain\b/, /\btorn\b/, /\bsprain(?:ed)?\b/, /\bfractur/, /\bswollen\b/,
      /\bcan'?t move\b/, /\bsomething (?:popped|snapped)\b/, /\bdislocat/,
      /\bshooting pain\b/, /\bgo(?:ing)? numb\b/,
    ],
  };

  for (const [flag, list] of Object.entries(patterns)) {
    if (list.some(re => re.test(text)) && !state.safetyFlags.includes(flag)) {
      state.safetyFlags.push(flag);
    }
  }
}

function buildClaimCase() {
  const frictionCounts = countFriction();
  const delayCount = (frictionCounts.Delay || 0) + (frictionCounts.Time || 0);
  const noMoodCount = state.proofLedger.filter(entry => /Boredom|Fatigue|Avoidance|Negotiation/.test(entry.friction)).length;
  const recoveryCount = state.proofLedger.filter(entry => entry.decision === "Recover").length;
  const accepted = acceptedProofs();
  const strong = state.proofLedger.filter(entry => entry.quality >= 4 && entry.status === "Accepted").length;
  const body = accepted.filter(entry => entry.domain === "body").length;
  const mind = accepted.filter(entry => entry.domain === "mind").length;
  const will = accepted.filter(entry => entry.domain === "will").length;
  const execution = accepted.filter(entry => entry.domain === "execution").length;
  const pressure = state.proofLedger.filter(entry => /Fear|Stress|Negotiation|Avoidance/.test(entry.friction)).length;
  const corrected = state.proofLedger.filter(entry => entry.result === "Corrected" || /correct/i.test(entry.text)).length;

  if (state.claim === "I do not have enough time.") {
    const evidence = [
      { label: `${Math.min(3, state.foundation.completedDays.length)} / 3 time audit days`, done: state.foundation.completedDays.length >= 3 },
      { label: `${delayCount} delayed starts or time leaks observed`, done: delayCount >= 2 },
      { label: `${Math.max(0, state.proofLedger.length + state.foundation.completedDays.length - 1)} unused windows identified`, done: state.proofLedger.length + state.foundation.completedDays.length >= 3 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: protect the practice window before comfort.");
  }

  if (state.claim === "I know my limits.") {
    const stopSignals = state.proofLedger.filter(entry => /Stop|Avoidance|Fatigue|Negotiation/.test(`${entry.decision} ${entry.friction}`)).length;
    const evidence = [
      { label: `${stopSignals} quit or limit signals captured`, done: stopSignals >= 1 },
      { label: `${state.proofLedger.filter(entry => entry.minimumOnly).length} safe minimum continuations`, done: state.proofLedger.filter(entry => entry.minimumOnly).length >= 1 },
      { label: `${state.debriefCount} reflections after limit signal`, done: state.debriefCount >= 2 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: first stop signal is data, not always the true limit.");
  }

  if (state.claim === "I am disciplined.") {
    const evidence = [
      { label: `${noMoodCount} no-mood practices logged`, done: noMoodCount >= 3 },
      { label: `${state.debriefCount} reflections submitted`, done: state.debriefCount >= 5 },
      { label: `${accepted.length} accepted proofs`, done: accepted.length >= 3 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: discipline is repeatable behavior under friction.");
  }

  if (state.claim === "I train hard.") {
    const evidence = [
      { label: `${body} body proofs accepted`, done: body >= 2 },
      { label: `${recoveryCount} recovery practices obeyed`, done: recoveryCount >= 1 },
      { label: `${accepted.length} accepted proofs across the week`, done: accepted.length >= 4 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: intensity is not the same as standard capacity.");
  }

  if (state.claim === "I work well under pressure.") {
    const evidence = [
      { label: `${pressure} pressure signals captured`, done: pressure >= 2 },
      { label: `${strong} strong or operational reflections`, done: strong >= 2 },
      { label: `${corrected} corrected failures`, done: corrected >= 1 || state.failuresDebriefed === 0 && accepted.length >= 3 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: pressure capacity requires clean decisions after friction appears.");
  }

  if (state.claim === "I recover well.") {
    const evidence = [
      { label: `${recoveryCount} recovery decisions logged`, done: recoveryCount >= 1 },
      { label: "Safety flags clear", done: !hasCriticalSafetyFlag() },
      { label: `${state.readiness.pain} pain currently reported`, done: state.readiness.pain === "none" || state.readiness.pain === "mild" },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: recovery is a standard, not a retreat.");
  }

  if (state.claim === "I do not need accountability.") {
    const evidence = [
      { label: `${state.debriefCount} reflections submitted without external prompt`, done: state.debriefCount >= 5 },
      { label: `${accepted.length} accepted proofs logged privately`, done: accepted.length >= 3 },
      { label: `${state.proofLedger.filter(entry => entry.status === "Rejected" || entry.status === "Under Review").length} unresolved integrity issues`, done: state.proofLedger.every(entry => entry.status !== "Rejected" && entry.status !== "Under Review") && accepted.length >= 3 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: independence requires clean self-reporting, not isolation.");
  }

  if (state.claim === "I am mentally strong.") {
    const evidence = [
      { label: `${mind} mind proofs accepted`, done: mind >= 2 },
      { label: `${noMoodCount} no-mood or friction practices`, done: noMoodCount >= 2 },
      { label: `${strong} strong or operational reflections`, done: strong >= 2 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: mental strength is attention returning under friction.");
  }

  if (state.claim === "I am independent.") {
    const evidence = [
      { label: `${execution} execution proofs accepted`, done: execution >= 2 },
      { label: `${state.debriefCount} self-closed reflections`, done: state.debriefCount >= 5 },
      { label: `${will} will proofs accepted`, done: will >= 1 },
    ];
    return claimCaseFromEvidence(evidence, "Replacement doctrine pending: independence is self-command with evidence.");
  }

  return claimCaseFromEvidence([
    { label: `${state.proofLedger.length} proof entries logged`, done: state.proofLedger.length >= 3 },
    { label: `${state.debriefCount} reflections submitted`, done: state.debriefCount >= 3 },
    { label: `${state.foundation.completedDays.length} Foundation practices closed`, done: state.foundation.completedDays.length >= 3 },
  ], "Replacement doctrine pending: claims move only when evidence changes.");
}

function acceptedProofs() {
  return state.proofLedger.filter(entry => entry.status === "Accepted");
}

function claimCaseFromEvidence(evidence, replacement) {
  const passed = evidence.filter(item => item.done).length;
  const formed = passed >= evidence.length;
  // PRD 4.20 / 5.8: the replacement doctrine is "pending" until the claim is contradicted, then assigned.
  const doctrine = replacement.replace(/^Replacement doctrine pending:\s*/i, "");
  return {
    evidence,
    evidenceCount: passed,
    status: formed ? "Contradiction formed" : passed >= 2 ? "Contradiction forming" : "Testing",
    doctrineAssigned: formed,
    replacement: `${formed ? "Replacement doctrine assigned" : "Replacement doctrine pending"}: ${doctrine}`,
  };
}

// PRD 5.10 Qualification ladder. Tiers are computed from real state, not from clicks.
function computeQualification() {
  const reflectedAccepted = acceptedProofs().filter(p => p.source !== "module");
  const domainsProven = TRAINABLE_DOMAINS.filter(d => reflectedAccepted.some(p => p.domain === d)).length;
  const movingDomains = TRAINABLE_DOMAINS.filter(d => levelIndex(state.standards[d]) >= levelIndex("Stabilizing")).length;
  const avgQuality = reflectedAccepted.length
    ? reflectedAccepted.reduce((sum, p) => sum + p.quality, 0) / reflectedAccepted.length
    : 0;
  const adv = state.modules.advanced;
  const safetyClear = !hasCriticalSafetyFlag();
  const activeDays = (state.activeDays || []).length;
  const noRecordedFailure = state.failuresDebriefed > 0 || state.proofLedger.every(p => !/Failed|Abandoned/.test(p.text || ""));

  const tiers = [
    {
      name: "Foundation Confirmed",
      requirements: [
        ["First Practice completed", state.firstOrderStatus === "completed"],
        ["First Report completed", Boolean(state.report.completed)],
        ["Claim selected", Boolean(state.claim)],
        [`7-Day Foundation: ${Math.min(state.foundation.completedDays.length, 7)}/7`, state.foundation.completedDays.length >= 7],
        [`Reflections: ${state.debriefCount}/5`, state.debriefCount >= 5],
        ["No-mood practice logged", state.noMoodMission],
        ["Recovery practice obeyed", state.recoveryObeyed],
        ["Failure reflected on or none recorded", noRecordedFailure],
        ["Safety flags clear", safetyClear],
      ],
    },
    {
      name: "Candidate",
      requirements: [
        [`Active days: ${activeDays}/21`, activeDays >= 21],
        [`Reflections: ${state.debriefCount}/15`, state.debriefCount >= 15],
        ["Claim deconstructed", buildClaimCase().status.indexOf("Contradiction") === 0],
        [`Domains tested: ${domainsProven}/4`, domainsProven >= 4],
        ["No unresolved safety flags", safetyClear],
      ],
    },
    {
      name: "Operator",
      requirements: [
        [`Integrated pressure proofs: ${adv.integratedProofs}/1`, adv.integratedProofs >= 1],
        [`Correction rate: ${adv.correctionRate}% (>=70)`, adv.correctionRate >= 70],
        [`Readiness adherence: ${adv.readinessAdherence}% (>=80)`, adv.readinessAdherence >= 80],
        [`Minimum-rescue rate: ${adv.minimumRescueRate}% (>=60)`, adv.minimumRescueRate >= 60],
        [`Proof in domains: ${domainsProven}/4`, domainsProven >= 4],
      ],
    },
    {
      name: "Spartan Standard",
      requirements: [
        [`Moving standard in ${movingDomains}/3 domains`, movingDomains >= 3],
        [`Average reflection quality: ${avgQuality.toFixed(1)} (>=4)`, avgQuality >= 4],
        ["Integrity stable", state.standards.integrity !== "Under Review"],
        ["Safety flags clear", safetyClear],
      ],
    },
  ];

  let priorQualified = true;
  return tiers.map(tier => {
    const met = tier.requirements.every(([, done]) => done);
    let status;
    if (!priorQualified) status = "locked";
    else if (met) status = "qualified";
    else status = tier.requirements.some(([, done]) => done) ? "in_progress" : "available";
    if (!met) priorQualified = false;
    return { name: tier.name, status, requirements: tier.requirements };
  });
}

function qualLabel(status) {
  if (status === "qualified") return "Qualified";
  if (status === "in_progress") return "In Progress";
  if (status === "available") return "Available";
  return "Locked";
}

function qualTone(status) {
  if (status === "qualified") return "bronze";
  if (status === "in_progress") return "amber";
  return "steel";
}

function buildStandardSummary() {
  const accepted = state.proofLedger.filter(entry => entry.status === "Accepted");
  const underReview = state.proofLedger.some(entry => entry.status === "Under Review") || hasCriticalSafetyFlag();
  const averageQuality = accepted.length
    ? accepted.reduce((sum, entry) => sum + entry.quality, 0) / accepted.length
    : 0;

  if (underReview) {
    return {
      title: "Standard under review",
      status: "Under Review",
      tone: "amber",
      reason: "Safety flags or proof conflicts prevent elevation. Recovery, scaling, and honest reporting remain part of the standard.",
    };
  }

  if (state.foundation.completedDays.length >= 7 && state.debriefCount >= 5 && accepted.length >= 5) {
    return {
      title: "Foundation confirmed",
      status: "Confirmed",
      tone: "bronze",
      reason: "Foundation requirements are met. The next prototype layer can test longer-term standard movement.",
    };
  }

  if (accepted.length >= 3 && averageQuality >= 2) {
    return {
      title: "Standard stabilizing",
      status: "Stabilizing",
      tone: "steel",
      reason: "Accepted proof exists across repeated friction. The standard is not elevated until it repeats without safety flags.",
    };
  }

  return {
    title: "Qualification pending",
    status: "Pending",
    tone: "amber",
    reason: "More accepted proof and reflection quality are required before the standard moves.",
  };
}

function qualityLabel(score) {
  if (score <= 0) return "Missing";
  if (score === 1) return "Weak";
  if (score <= 3) return "Acceptable";
  if (score === 4) return "Strong";
  return "Operational";
}

function scoreDebrief(debrief) {
  let score = 0;
  if (debrief.friction.length) score += 1;
  if (debrief.negotiation.trim().length >= 4) score += 1;
  if (debrief.decision) score += 1;
  if (debrief.lesson.trim().length >= 8) score += 1;
  if (debrief.correction.trim().length >= 8) score += 1;
  return score;
}

function standardEffect(status, quality, minimumOnly = false) {
  if (status === "Accepted" && minimumOnly) return "Minimum logged; no elevation";
  if (status === "Accepted" && quality >= 4) return "Standard stabilized";
  if (status === "Accepted") return "Standard held";
  if (status === "Incomplete") return "No elevation";
  if (status === "Under Review") return "Safety review";
  return "Proof rejected";
}

function levelIndex(level) {
  return STANDARD_LEVELS.indexOf(level);
}

function nextStandardLevel(level) {
  const i = levelIndex(level);
  if (i < 0) return "Tested"; // re-enter ladder from Forming / Regressed / Under Review
  return STANDARD_LEVELS[Math.min(i + 1, STANDARD_LEVELS.length - 1)];
}

// PRD 5.9 Moving Standard. Only reflected proof moves a trainable domain; module activity does not.
function updateStandardsFromProof(entry) {
  const domain = entry.domain || ORDER_COPY[state.selectedOrder]?.domain || "body";
  // Gap-close A2: the standard moves ONLY through full reflection. Quick closes (source "quick") and
  // module grants (source "module") keep the record but never advance or count toward elevation.
  const reflected = entry.source === "reflection";

  if (reflected && TRAINABLE_DOMAINS.includes(domain)) {
    const progress = state.standardProgress[domain] || (state.standardProgress[domain] = { proofCount: 0, fails: 0 });
    const current = state.standards[domain];

    if (entry.status === "Accepted") {
      if (entry.result === "Corrected") progress.fails = 0;
      // Friction level is not captured per proof; low AAR quality is the proxy for high friction.
      const highFriction = entry.quality <= 1;
      const safetyOk = !hasCriticalSafetyFlag();
      const qualityOk = entry.quality >= 2;
      progress.proofCount += 1;

      if (progress.proofCount >= 3 && qualityOk && !highFriction && safetyOk) {
        progress.oldMax = current; // PRD 5.9: old limit becomes the baseline
        state.standards[domain] = nextStandardLevel(current);
        progress.proofCount = 0;
      } else if (levelIndex(current) < 0 || levelIndex(current) < levelIndex("Tested")) {
        state.standards[domain] = highFriction ? "Stabilizing" : "Tested";
      } else if (highFriction && levelIndex(current) < levelIndex("Stabilizing")) {
        state.standards[domain] = "Stabilizing";
      }
    } else if (entry.status === "Rejected" || entry.result === "Failed" || entry.result === "Abandoned") {
      progress.fails += 1;
      if (progress.fails >= 3) {
        state.standards[domain] = "Regressed";
        progress.proofCount = 0;
      }
    }
  }

  if (entry.status === "Accepted") state.standards.integrity = "Forming";
  if (entry.status === "Under Review") state.standards.integrity = "Under Review";
  updateStandardsFromReadiness();
}

function updateStandardsFromReadiness() {
  const command = computeReadiness(state.readiness).command;
  state.standards.readiness = command;
}

function standardStageIndex() {
  // Headline stage = highest trainable-domain level reached (domain levels move on reflected proof only).
  const levels = TRAINABLE_DOMAINS.map(domain => levelIndex(state.standards[domain])).filter(index => index >= 0);
  return levels.length ? Math.max(...levels) : 0;
}

function countFriction() {
  return state.proofLedger.reduce((acc, entry) => {
    entry.friction.split(",").map(x => x.trim()).filter(Boolean).forEach(name => {
      acc[name] = (acc[name] || 0) + 1;
    });
    return acc;
  }, {});
}

// B6 crisis interlock must ALWAYS be evaluable: corrupt safetyFlags (e.g. a string from a tampered
// payload) must never throw here, or the interlock would be bypassed by a white screen before
// enforceInvariants heals it. Guard the type at the read site as well as in the invariant.
function hasCriticalSafetyFlag() {
  return Array.isArray(state.safetyFlags)
    && state.safetyFlags.some(flag => ["crisis", "self-punishment", "restriction"].includes(flag));
}

// Any safety flag (injury/pain/medical too — not just the critical mental-health ones) must restrict
// activity to recovery-safe practice. Previously injury/medical/pain were collected but gated nothing.
function hasActivityRestrictingFlag() {
  return Array.isArray(state.safetyFlags)
    && state.safetyFlags.some(flag => ["injury", "pain", "medical", "crisis", "self-punishment", "restriction"].includes(flag));
}

function recordReadinessSnapshot() {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const snapshot = {
    sleep: state.readiness.sleep,
    energy: state.readiness.energy,
    soreness: state.readiness.soreness,
    pain: state.readiness.pain,
    stress: state.readiness.stress,
    emotional: state.readiness.emotional,
    at: now.toISOString(),
    day,
  };
  // Upsert one snapshot per calendar day: a same-day re-check (or a daily slider commit) replaces
  // today's entry instead of stacking. This lets the daily check-in feed overtraining detection
  // without a drag-burst polluting history, and makes the PRESS-stability guard compare prior DAYS.
  if (!Array.isArray(state.readinessHistory)) state.readinessHistory = [];
  const last = state.readinessHistory[state.readinessHistory.length - 1];
  if (last && last.day === day) state.readinessHistory[state.readinessHistory.length - 1] = snapshot;
  else state.readinessHistory.push(snapshot);
  state.readinessHistory = state.readinessHistory.slice(-7);
}

function hasOvertrainingRisk() {
  const recent = state.readinessHistory.slice(-5);
  if (recent.length < 3) return false;
  const last3 = recent.slice(-3);
  // Original strict rules (kept).
  if (last3.length === 3 && last3.every(item => item.sleep <= 2 && item.soreness >= 4)) return true;
  if (last3.length === 3 && last3.every(item => item.pain === "moderate" || item.pain === "severe")) return true;
  // Broader: sustained multi-marker load across recent checks — catches accumulation/volume, not
  // just the all-or-nothing patterns above (trainer-lens fix: single metrics summed, not isolated).
  const markers = item => (item.sleep <= 2 ? 1 : 0) + (item.soreness >= 4 ? 1 : 0)
    + (item.energy <= 2 ? 1 : 0) + (["moderate", "severe"].includes(item.pain) ? 1 : 0) + (item.stress >= 4 ? 1 : 0);
  const loaded = recent.filter(item => markers(item) >= 2).length;
  return loaded >= Math.ceil(recent.length * 0.6);
}

function safetyMessage(flags) {
  if (flags.includes("crisis")) {
    return "Spartan X is not crisis care. Immediate human support is required. Practices are paused into protected mode.";
  }
  if (flags.includes("restriction") || flags.includes("self-punishment")) {
    return "Risk language detected. Hard challenge prompts are disabled. The system will not reward punishment or restriction.";
  }
  if (flags.includes("injury") || flags.includes("pain") || flags.includes("medical")) {
    return "Physical risk detected. Spartan X will reduce physical load and prefer recovery-safe practices.";
  }
  return "No obvious risk detected. Continue with honest reporting.";
}

function holdLineResponse(signal) {
  if (["Danger", "Injury"].includes(signal)) {
    return "System protection active. Stop current load. Switch to safe alternative. Log signal.";
  }
  if (signal === "Fatigue") {
    return "Fatigue acknowledged. Practice adjusted. Minimum standard remains.";
  }
  return "Breathe for 60 seconds. Name the excuse. Complete the next possible action. Return and report.";
}

function standardProgressNote(domain) {
  const progress = state.standardProgress[domain] || { proofCount: 0, fails: 0 };
  const level = state.standards[domain];
  const baseNote = progress.oldMax ? `Old max ${progress.oldMax} is now baseline. ` : "";
  if (level === "Elevated") return `${baseNote}Top standard reached.`;
  if (level === "Regressed") return `${progress.fails}/3 failures. Rebuild with a corrected proof.`;
  const failNote = progress.fails ? ` · ${progress.fails}/3 fails toward review` : "";
  return `${baseNote}${progress.proofCount}/3 reflected proofs to elevate${failNote}`;
}

function domainNote(domain, status) {
  if (status === "Untested") return "No accepted proof yet.";
  if (status === "Forming") return "No accepted proof yet.";
  if (status === "Tested") return "Proof has started. More reflected evidence required.";
  if (status === "Stabilizing") return "Repeated proof is forming a baseline.";
  if (status === "Baseline") return "Standard held as a repeatable baseline.";
  if (status === "Elevated") return "Old maximum is now the baseline. Standard elevated.";
  if (status === "Regressed") return "Repeated failure without correction. Rebuild required.";
  if (status === "Under Review") return "Evidence exists, but the standard cannot move yet.";
  if (status === "PRESS" || status === "HOLD" || status === "SCALE" || status === "RECOVER") return "Current daily calibration.";
  return "Proof has started. More evidence required.";
}

function chipTone(command) {
  if (command === "PRESS") return "bronze";
  if (command === "SCALE") return "amber";
  if (command === "RECOVER") return "red";
  return "steel";
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function toggleArray(array, value) {
  const index = array.indexOf(value);
  if (index >= 0) array.splice(index, 1);
  else array.push(value);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

// PRD Epic 16: re-entry after absence + active-day tracking. Runs once at session start.
function initSession() {
  const previousActive = state.lastActiveAt;
  const now = Date.now();
  state.reentry = Boolean(previousActive) && (now - previousActive) > 24 * 60 * 60 * 1000;
  state.lastActiveAt = now;
  if (!Array.isArray(state.activeDays)) state.activeDays = [];
  const today = new Date(now).toISOString().slice(0, 10);
  if (!state.activeDays.includes(today)) state.activeDays.push(today);
  state.activeDays = state.activeDays.slice(-60);
  // Opt-in cloud: ?backend=<url> wires the Phase-B server (default off = pure local).
  try {
    if (!state.cloud) state.cloud = structuredClone(DEFAULT_STATE.cloud);
    const backend = new URLSearchParams(location.search).get("backend");
    if (backend) state.cloud.url = backend;
  } catch {}
}

function renderReentryBanner() {
  return `
    <div class="panel steel">
      <p class="kicker">Re-entry</p>
      <h2>You returned. Re-entry is not restart.</h2>
      <p class="muted">Name what happened, then take one practice. The standard waited.</p>
      <div class="actions"><button class="btn ghost" data-action="dismiss-reentry">Acknowledged</button></div>
    </div>
  `;
}

// Multi-tab sync only makes sense between real top-level tabs; skip inside the QA iframe.
if (typeof window !== "undefined" && window.top === window.self) {
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) syncFromStorage();
  });
}

initSession();
if (state.onboardingComplete && state.mission && state.mission.status === "active") startMissionTimer();
render();
