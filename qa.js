const STORAGE_KEY = "spartan-x-prototype-state";
const BACKUP_KEY = "spartan-x-prototype-state-backup";
const LASTGOOD_KEY = "spartan-x-prototype-state-lastgood";

const frame = document.querySelector("#appFrame");
const results = document.querySelector("#results");
const runAll = document.querySelector("#runAll");
const resetOnly = document.querySelector("#resetOnly");

const tests = [
  ["Happy path", testHappyPath],
  ["First Practice failure twice pauses assessment", testFirstPracticeFailureTwice],
  ["Seven-day Foundation completion", testFoundationCompletion],
  ["All claim deconstruction models render", testAllClaimModels],
  ["Repeated friction creates targeted practice", testTargetedPractice],
  ["Adjust Practice and pain path", testAdjustPainPath],
  ["Pause / Recenter path", testPauseRecenterPath],
  ["Weak reflection becomes incomplete", testWeakReflection],
  ["Abandoned reflection is rejected", testRejectedReflection],
  ["Safety language forces protected state", testSafetyLanguage],
  ["Readiness severe pain forces RECOVER", testReadinessRecover],
  ["System export and reset", testSystemExportReset],
  ["Full prototype module suite", testFullPrototypeModules],
  ["Module proof is gated by a safety flag", testModuleProofSafetyGate],
  ["Standard tier requires reflected proof", testStandardRequiresReflection],
  ["High stress holds back PRESS", testReadinessStressHolds],
  ["deepMerge ignores prototype keys", testDeepMergeProtoGuard],
  ["Targeted friction tie-break is deterministic", testTieBreakDeterminism],
  ["Incompatible stored state resets", testStateVersionReset],
  ["Pain downgrade asks for confirmation", testPainDowngradeConfirm],
  ["Crisis flag shows support resources", testCrisisResources],
  ["Reduced-motion preference applies class", testReducedMotionClass],
  ["Moving Standard elevates after three proofs", testMovingStandardElevates],
  ["Moving Standard regresses after failures", testMovingStandardRegresses],
  ["Safety flag blocks standard elevation", testSafetyBlocksElevation],
  ["Qualification ladder computes from state", testQualificationLadder],
  ["Locked module blocks access before qualified", testModuleLockedBeforeQualified],
  ["Module unlocks when qualified", testModuleUnlocksWhenQualified],
  ["Replacement doctrine assigns on contradiction", testReplacementDoctrineAssigned],
  ["Weakest domain identified from standards", testWeakestDomain],
  ["RECOVER readiness assigns recovery practice", testRecoverAssignsRecovery],
  ["Post-Foundation targets weakest domain", testWeakestDomainPostFoundation],
  ["Reflection stepper gates submit to last step", testDebriefStepper],
  ["Re-entry banner after absence", testReentryAfterAbsence],
  ["No re-entry when recently active", testNoReentryWhenRecent],
  ["Reflection-due reminder on Today", testReflectionDueReminder],
  ["Just-in-time onboarding: proof in, safety+claim deferred", testJustInTimeOnboarding],
  ["Callsign sets identity and tags check-ins", testCallsign],
  ["Continue Standard assigns next practice", testContinueStandardLoop],
  ["Proof-logged offers Continue Standard when qualified", testProofLoggedContinueCta],
  ["Elevation progress shown on Standard", testElevationProgressShown],
  ["Qualification shows live counts", testQualificationCountsShown],
  ["Active days counter visible", testActiveDaysShown],
  ["Readiness updates standard live", testReadinessUpdatesStandard],
  ["Proof ledger filters by domain", testProofFilter],
  ["Proof ledger shows source tag", testProofSourceTag],
  ["Old max recorded on elevation", testOldMaxRecorded],
  ["Invariant guard self-heals corrupt state", testInvariantSelfHeal],
  ["Corrupt safety flags self-heal to an array", testSafetyFlagsSelfHeal],
  ["Crisis flag does not downgrade earned history", testHistoryPreservedDuringCrisis],
  ["Corrupt main state recovers from last-good backup", testLastGoodRecovery],
  ["Recovery banner shows and dismisses", testRecoveryBannerDismiss],
  ["App-created proofs are signed and verify", testLedgerSignedOnCreate],
  ["Valid proof chain verifies", testLedgerChainValid],
  ["Edited proof fails integrity check", testLedgerTamperDetected],
  ["Legacy unsigned proofs are not flagged", testLedgerLegacyNotFlagged],
  ["Severe pain downgrade warns + safe-defaults", testSeverePainGuard],
  ["Injury flag forces RECOVER (activity-restricting)", testInjuryFlagForcesRecover],
  ["Safety flags editable + clearable in System", testSafetyPanelManage],
  ["Today shows elevation + qualification progress", testTodayProgressShown],
  ["Safety scan catches broadened phrasings", testSafetyScanBroadened],
  ["Multi-tab storage sync adopts external state", testMultiTabSync],
  ["Local report computes from own data", testLocalReport],
  ["Entry screen states data is local-only", testEntryLocalOnlyNotice],
  ["Data modal shows local-only notice", testLocalOnlyNotice],
  ["Valid backup imports after confirm", testImportValidBackup],
  ["Invalid backup is rejected", testImportInvalidRejected],
  ["Wrong-version backup is rejected", testImportWrongVersionRejected],
  ["Import can be cancelled", testImportCancel],
];

runAll.addEventListener("click", runAllTests);
resetOnly.addEventListener("click", async () => {
  localStorage.removeItem(STORAGE_KEY);
  await loadFresh();
  writeResult("Reset app state", true, "State cleared and app reloaded.");
});

loadFresh();

async function runAllTests() {
  results.innerHTML = "";
  runAll.disabled = true;
  try {
    for (const [name, fn] of tests) {
      try {
        await fn();
        writeResult(name, true, "Passed");
      } catch (error) {
        writeResult(name, false, error.message || String(error));
        break;
      }
    }
  } finally {
    runAll.disabled = false;
  }
}

async function testHappyPath() {
  await setupToToday();
  await clickAction("begin-main-mission");
  assertText("Practice active");
  await clickAction("complete-mission");
  await submitStrongReflection("Delay appeared and I wanted to wait.");
  assertText("Proof Logged");
  const state = getState();
  assert(state.proofLedger.length === 1, "Expected one proof entry.");
  assert(state.lastProof.status === "Accepted", "Expected accepted proof.");
  await clickAction("advance-foundation");
  assert(getState().foundation.currentDay === 2, "Expected Foundation Day 2.");
}

async function testFirstPracticeFailureTwice() {
  await loadFresh();
  await clickAction("begin-selection");
  await clickAction("start-order");
  await clickAction("complete-first-order");
  await clickAction("set-report-status", { value: "not completed", attr: "data-status" });
  await clickAction("submit-first-report");
  assertText("Retry Practice");
  await clickAction("retry-order");
  await clickAction("start-order");
  await clickAction("complete-first-order");
  await clickAction("set-report-status", { value: "not completed", attr: "data-status" });
  await clickAction("submit-first-report");
  assertText("Assessment paused");
  assertText("Re-entry is available anytime");
  assert(getState().assessmentFailures === 2, "Expected two assessment failures.");
}

async function testFoundationCompletion() {
  await setupToToday();
  for (let day = 1; day <= 7; day += 1) {
    await clickAction("begin-main-mission");
    await clickAction("complete-mission");
    await submitStrongReflection(`Day ${day} friction named honestly.`);
    assertText("Proof Logged");
    await clickAction("advance-foundation");
  }
  const state = getState();
  assert(state.foundation.completedDays.length === 7, "Expected all seven days closed.");
  assert(state.status === "Foundation Confirmed", "Expected Foundation Confirmed status.");
  assertText("Foundation confirmed");
}

async function testAllClaimModels() {
  const claims = [
    ["I do not have enough time.", "protect the practice window"],
    ["I know my limits.", "first stop signal"],
    ["I am disciplined.", "repeatable behavior"],
    ["I train hard.", "intensity is not the same"],
    ["I work well under pressure.", "pressure capacity"],
    ["I recover well.", "recovery is a standard"],
    ["I do not need accountability.", "clean self-reporting"],
    ["I am mentally strong.", "attention returning"],
    ["I am independent.", "self-command"],
  ];

  for (const [claim, expected] of claims) {
    await loadStateForToday({
      claim,
      foundation: { currentDay: 4, completedDays: [1, 2, 3], started: true },
      debriefCount: 5,
      proofLedger: sampleProofLedger(),
      status: "Foundation Candidate",
      onboardingComplete: true,
      tab: "today",
    });
    openDisclosures();
    assertText(expected);
  }
}

async function testTargetedPractice() {
  await loadStateForToday({
    foundation: { currentDay: 3, completedDays: [1, 2], started: true },
    proofLedger: [
      proof({ friction: "Boredom", domain: "will" }),
      proof({ friction: "Boredom", domain: "mind" }),
      proof({ friction: "Boredom", domain: "execution" }),
    ],
    status: "Foundation Candidate",
    onboardingComplete: true,
    tab: "today",
  });
  await clickAction("select-foundation-day", { value: "3", attr: "data-day" });
  openDisclosures();
  assertText("Monotony Tolerance");
  assertText("Boredom appeared 3 times");
}

async function testAdjustPainPath() {
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("open-adjust");
  assertText("Adjust Practice");
  await clickAction("set-adjust-reason", { value: "Pain warning", attr: "data-reason" });
  await clickAction("apply-adjust");
  const state = getState();
  assert(state.tab === "debrief", "Expected Reflection tab after pain adjustment.");
  assert(state.mission.painReported === true, "Expected pain reported.");
  assert(state.debrief.decision === "Recover", "Expected recovery decision.");
  assert(state.debrief.friction.includes("Pain"), "Expected Pain friction.");
}

async function testPauseRecenterPath() {
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("quit-main-mission");
  assertText("Pause / Recenter");
  await clickAction("set-pause-signal", { value: "Avoidance", attr: "data-signal" });
  await clickAction("pause-minimum");
  let state = getState();
  assert(state.mission.scaled === true, "Expected minimum continuation to scale practice.");
  assert(state.tab === "mission", "Expected return to Practice after minimum continuation.");
  await clickAction("quit-main-mission");
  await clickAction("pause-stop");
  state = getState();
  assert(state.tab === "debrief", "Expected Reflection after stop.");
  assert(state.debrief.decision === "Stop", "Expected Stop decision.");
}

async function testWeakReflection() {
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("complete-mission");
  await clickAction("debrief-next");      // Result -> Friction
  await toggleFrictionOff("Delay");       // clear the default-named friction
  for (let i = 0; i < 4; i++) await clickAction("debrief-next"); // -> last step
  await clickAction("submit-debrief");
  const state = getState();
  assert(state.lastProof.status === "Incomplete", "Expected weak reflection to be incomplete.");
  assert(state.lastProof.effect === "No elevation", "Expected no standard elevation.");
}

async function testRejectedReflection() {
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("complete-mission");
  setSelect("result", "Abandoned");          // Step 1: Result
  await clickAction("debrief-next");          // -> Friction
  await clickAction("debrief-next");          // -> Negotiation
  await fillByPlaceholder("What excuse appeared?", "I left the practice and did not correct it.");
  await clickAction("debrief-next");          // -> Decision
  await clickAction("debrief-next");          // -> Lesson
  await fillByPlaceholder("What did this reveal?", "Avoidance appeared.");
  await clickAction("debrief-next");          // -> Correction (left empty)
  await clickAction("submit-debrief");
  const state = getState();
  assert(state.lastProof.status === "Rejected", "Expected abandoned practice without correction to be rejected.");
}

async function testSafetyLanguage() {
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("complete-mission");
  await clickAction("debrief-next");          // Result -> Friction
  await clickFriction("Avoidance");
  await clickAction("debrief-next");          // -> Negotiation
  await fillByPlaceholder("What excuse appeared?", "I should punish myself.");
  await clickAction("debrief-next");          // -> Decision
  await clickAction("debrief-next");          // -> Lesson
  await fillByPlaceholder("What did this reveal?", "Unsafe language appeared.");
  await clickAction("debrief-next");          // -> Correction
  await fillByPlaceholder("What changes next?", "I will stop escalation and seek human support.");
  await clickAction("submit-debrief");
  const state = getState();
  // "punish myself" is the self-punishment category (also critical) — both pause acceptance.
  assert(state.safetyFlags.includes("self-punishment"), "Expected self-punishment safety flag.");
  assert(state.lastProof.status === "Under Review", "Expected proof under review.");
}

async function testReadinessRecover() {
  await setupToToday();
  await clickAction("set-pain", { value: "severe", attr: "data-pain" });
  assertText("RECOVER");
  assert(getState().readiness.pain === "severe", "Expected severe pain in state.");
}

async function testSystemExportReset() {
  await setupToToday();
  await clickAction("set-tab", { value: "system", attr: "data-tab" });
  assertText("Safety, privacy");
  await clickAction("open-export");
  assertText("Your data stays on this device");
  await clickAction("close-modal");
  await clickAction("reset");
  await wait(1300);
  assertText("Begin Assessment");
  assert(getState().status === "Visitor", "Expected reset visitor state.");
}

async function testFullPrototypeModules() {
  await loadStateForToday({ recruitQualified: true, tab: "modules" });
  await clickAction("set-tab", { value: "modules", attr: "data-tab" });
  assertText("All product ideas are available");

  await clickAction("set-guide-focus", { value: "Readiness", attr: "data-focus" });
  await clickAction("generate-guide");
  assert(getState().modules.guide.answer.includes("HOLD"), "Expected readiness guidance from Guide.");

  await clickAction("set-module", { value: "circle", attr: "data-module" });
  await fillByPlaceholder("Status, blocker, next action", "Practice closed. Delay. Start before phone.");
  await clickAction("submit-circle-checkin");
  let state = getState();
  assert(state.modules.circle.checkins[0].name === "Tester", "Expected Circle check-in tagged with callsign.");
  assert(state.modules.circle.latestCheckin === "", "Expected Circle check-in input to clear.");

  await clickAction("set-module", { value: "connection", attr: "data-module" });
  await clickAction("complete-connection");
  state = getState();
  assert(state.modules.connection.completed.length === state.modules.connection.commitments.length, "Expected Connection commitments complete.");

  await clickAction("set-module", { value: "principles", attr: "data-module" });
  await clickAction("select-principle", { value: "proof", attr: "data-principle" });
  await clickAction("practice-principle");
  assert(getState().modules.principles.practiced.includes("proof"), "Expected principle practice logged.");

  await clickAction("set-module", { value: "pressure", attr: "data-module" });
  await clickAction("set-pressure-domain", { value: "execution", attr: "data-domain" });
  await setModuleNumber("pressure", "load", 4);
  await clickAction("complete-pressure");
  state = getState();
  assert(state.modules.pressure.completions === 1, "Expected pressure completion.");
  assert(state.modules.pressure.result.includes("Completed"), "Expected pressure result.");

  const proofsBeforeGrant = state.modules.advanced.integratedProofs;
  await clickAction("set-module", { value: "advanced", attr: "data-module" });
  await clickAction("grant-integrated-proof");
  state = getState();
  assert(state.modules.advanced.integratedProofs === proofsBeforeGrant + 1, "Expected integrated proof grant.");
  assertText("Integrated standard");

  await clickAction("set-module", { value: "signals", attr: "data-module" });
  await clickAction("sync-signals");
  state = getState();
  assert(state.modules.signals.connected === true, "Expected signals connected.");
  assert(state.modules.signals.syncs === 1, "Expected one signal sync.");

  await clickAction("set-module", { value: "review", attr: "data-module" });
  await fillByPlaceholder("What should be reviewed?", "Review my repeated pressure proof and correction pattern.");
  await clickAction("submit-human-review");
  state = getState();
  assert(state.modules.review.submitted === true, "Expected human review submitted.");
  assert(state.modules.review.feedback.includes("Submitted"), "Expected human review feedback.");

  await clickAction("set-module", { value: "benchmarks", attr: "data-module" });
  await setModuleNumber("benchmarks", "privateScore", 92);
  await clickAction("update-benchmark-band");
  assert(getState().modules.benchmarks.band === "Advanced", "Expected Advanced benchmark band.");

  await clickAction("set-module", { value: "history", attr: "data-module" });
  await clickAction("load-sample-history");
  state = getState();
  assert(state.modules.history.summary.sessions === 16, "Expected sample CSV sessions.");
  assert(state.modules.history.summary.recommendedStart === "Foundation Day 2", "Expected calibrated history start.");
  assert(state.modules.history.summary.confidence >= 90, "Expected high CSV confidence.");
  await clickAction("apply-history-baseline");
  state = getState();
  assert(state.modules.history.applied === true, "Expected history baseline applied.");
  assert(state.engine.assignmentReason.includes("CSV history calibrated Foundation Day 2"), "Expected history calibration reason.");

  await clickAction("set-module", { value: "teams", attr: "data-module" });
  await clickAction("simulate-team-week");
  state = getState();
  assert(state.modules.teams.reflectionRate === 70, "Expected team reflection rate to change.");
  assert(state.modules.teams.unresolvedRisk === 0, "Expected team unresolved risk to reduce.");

  await clickAction("set-module", { value: "cognitive", attr: "data-module" });
  await clickAction("cognitive-correct");
  await clickAction("cognitive-miss");
  state = getState();
  assert(state.modules.cognitive.attempts === 2, "Expected cognitive attempts.");
  assert(state.modules.cognitive.correct === 1, "Expected one correct cognitive response.");
  assert(state.proofLedger.length >= 6, "Expected module actions to produce proof ledger entries.");
}

async function testModuleProofSafetyGate() {
  await loadStateForToday({
    recruitQualified: true,
    safetyFlags: ["crisis"],
    tab: "modules",
    modules: { active: "circle", circle: { latestCheckin: "Practice closed. Delay. Start before phone." } },
  });
  await clickAction("set-tab", { value: "modules", attr: "data-tab" });
  await clickAction("set-module", { value: "circle", attr: "data-module" });
  await clickAction("submit-circle-checkin");
  const state = getState();
  assert(state.lastProof && state.lastProof.source === "module", "Expected a module-sourced proof.");
  assert(state.lastProof.status === "Under Review", "Module proof must be held under review while a safety flag is active.");
}

async function testStandardRequiresReflection() {
  await loadStateForToday({
    recruitQualified: true,
    tab: "modules",
    modules: { active: "pressure", pressure: { domain: "execution", load: 4, completions: 0, result: "Not tested" } },
  });
  await clickAction("set-tab", { value: "modules", attr: "data-tab" });
  await clickAction("set-module", { value: "pressure", attr: "data-module" });
  await clickAction("complete-pressure");
  const state = getState();
  assert(state.lastProof.source === "module", "Expected pressure proof tagged as module.");
  assert(state.lastProof.status === "Accepted", "Expected pressure proof accepted without a safety flag.");
  assert(state.standards.execution === "Forming", "Module activity must not move the trainable domain standard.");
  const reflected = state.proofLedger.filter(p => p.status === "Accepted" && p.source !== "module").length;
  assert(reflected === 0, "Module proof must not count as reflected evidence.");
  assert(win().standardStageIndex() === 0, "Headline standard tier must not move without reflected proof.");
}

async function testReadinessStressHolds() {
  await loadStateForToday({});
  const press = win().computeReadiness({ sleep: 5, energy: 5, soreness: 1, pain: "none", stress: 1, emotional: 1 });
  assert(press.command === "PRESS", "Low stress with strong markers should PRESS.");
  const held = win().computeReadiness({ sleep: 5, energy: 5, soreness: 1, pain: "none", stress: 5, emotional: 2 });
  assert(held.command === "HOLD", "High stress must hold back PRESS even with strong physical markers.");
}

async function testDeepMergeProtoGuard() {
  await loadStateForToday({});
  win().deepMerge({}, JSON.parse('{"__proto__":{"polluted":true},"constructor":{"polluted":true}}'));
  assert(win().Object.prototype.polluted === undefined, "deepMerge must not pollute Object.prototype.");
}

async function testTieBreakDeterminism() {
  await loadStateForToday({
    proofLedger: [proof({ friction: "Ego" }), proof({ friction: "Avoidance" })],
  });
  const first = win().dominantHighFriction();
  const second = win().dominantHighFriction();
  assert(first && first.name === "Avoidance", "Tied friction must resolve alphabetically (Avoidance before Ego).");
  assert(first.name === second.name, "Tie-break must be deterministic across calls.");
}

async function testStateVersionReset() {
  await loadFresh();
  win().localStorage.setItem(STORAGE_KEY, JSON.stringify({ stateVersion: 999, status: "Foundation Candidate", onboardingComplete: true }));
  frame.src = `/index.html?qa=${Date.now()}`;
  await waitForFrame();
  await wait(1400);
  const state = getState();
  assert(state.stateVersion === 1, "Expected fresh state version after incompatible load.");
  assert(state.status === "Visitor", "Expected reset to Visitor state on version mismatch.");
}

async function testPainDowngradeConfirm() {
  await loadStateForToday({
    readiness: { sleep: 3, energy: 3, soreness: 2, pain: "severe", stress: 3, emotional: 2, motivation: 2 },
  });
  await clickAction("set-pain", { value: "none", attr: "data-pain" });
  let state = getState();
  assert(state.modal === "painDowngrade", "Expected confirmation modal when lowering severe pain.");
  assert(state.readiness.pain === "severe", "Pain must not change until confirmed.");
  await clickAction("confirm-pain");
  state = getState();
  assert(state.readiness.pain === "none", "Expected pain updated after confirmation.");
  assert(state.modal === "", "Expected modal cleared after confirmation.");
}

async function testCrisisResources() {
  await loadStateForToday({ safetyFlags: ["crisis"] });
  assertText("findahelpline.com");
}

async function testReducedMotionClass() {
  await loadStateForToday({ settings: { motionReduced: true } });
  assert(doc().querySelector(".prototype-shell.reduced-motion"), "Expected reduced-motion class on shell when preference set.");
}

async function testMovingStandardElevates() {
  await loadStateForToday({});
  const w = win();
  for (let i = 0; i < 3; i++) {
    w.updateStandardsFromProof({ status: "Accepted", source: "reflection", domain: "body", quality: 3, friction: "Delay", result: "Completed" });
  }
  w.render();
  const state = getState();
  assert(state.standards.body === "Stabilizing", "Expected body to reach Stabilizing after three reflected proofs.");
  assert(w.standardStageIndex() === 2, "Expected headline stage to reach Stabilizing (index 2).");
}

async function testMovingStandardRegresses() {
  await loadStateForToday({});
  const w = win();
  for (let i = 0; i < 3; i++) {
    w.updateStandardsFromProof({ status: "Rejected", source: "reflection", domain: "will", quality: 0, friction: "Avoidance", result: "Failed" });
  }
  w.render();
  assert(getState().standards.will === "Regressed", "Expected will to regress after three uncorrected failures.");
}

async function testSafetyBlocksElevation() {
  await loadStateForToday({ safetyFlags: ["crisis"] });
  const w = win();
  for (let i = 0; i < 3; i++) {
    w.updateStandardsFromProof({ status: "Accepted", source: "reflection", domain: "body", quality: 3, friction: "Delay", result: "Completed" });
  }
  w.render();
  assert(getState().standards.body !== "Stabilizing", "Safety flag must block standard elevation.");
}

async function testQualificationLadder() {
  await loadStateForToday({
    foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true },
    debriefCount: 6,
    noMoodMission: true,
    recoveryObeyed: true,
  });
  const tiers = win().computeQualification();
  assert(tiers[0].name === "Foundation Confirmed" && tiers[0].status === "qualified", "Foundation Confirmed should qualify when all requirements are met.");
  assert(tiers[1].status !== "qualified", "Candidate must not auto-qualify.");
}

async function testModuleLockedBeforeQualified() {
  await loadStateForToday({ recruitQualified: false, tab: "modules", modules: { active: "circle" } });
  await clickAction("set-tab", { value: "modules", attr: "data-tab" });
  await clickAction("set-module", { value: "circle", attr: "data-module" });
  assert(!doc().querySelector('[data-action="submit-circle-checkin"]'), "Locked module must not expose its action.");
  assertText("unlocks at Foundation Confirmed");
}

async function testModuleUnlocksWhenQualified() {
  await loadStateForToday({ recruitQualified: true, tab: "modules", modules: { active: "circle" } });
  await clickAction("set-tab", { value: "modules", attr: "data-tab" });
  await clickAction("set-module", { value: "circle", attr: "data-module" });
  assert(doc().querySelector('[data-action="submit-circle-checkin"]'), "Qualified user must be able to access the module.");
}

async function testReplacementDoctrineAssigned() {
  await loadStateForToday({
    claim: "I recover well.",
    proofLedger: [proof({ decision: "Recover", domain: "readiness" })],
    readiness: { sleep: 3, energy: 3, soreness: 2, pain: "none", stress: 3, emotional: 2, motivation: 2 },
  });
  const c = win().buildClaimCase();
  assert(c.status === "Contradiction formed", "Expected contradiction formed when all evidence is met.");
  assert(c.doctrineAssigned === true, "Expected replacement doctrine assigned on contradiction.");
  openDisclosures();
  assertText("Replacement doctrine assigned");
}

async function testWeakestDomain() {
  await loadStateForToday({ standards: { body: "Stabilizing", mind: "Stabilizing", will: "Stabilizing", execution: "Untested", readiness: "HOLD", integrity: "Forming" } });
  assert(win().weakestDomain() === "execution", "Expected execution as the weakest domain.");
}

async function testRecoverAssignsRecovery() {
  await loadStateForToday({ readiness: { sleep: 3, energy: 3, soreness: 2, pain: "severe", stress: 3, emotional: 2, motivation: 2 } });
  const assignment = win().choosePracticeAssignment({ day: 1, deadline: "21:30" });
  assert(assignment.domain === "readiness" && assignment.name === "Recovery Practice", "RECOVER readiness must assign a recovery-safe practice.");
}

async function testWeakestDomainPostFoundation() {
  await loadStateForToday({
    foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true },
    standards: { body: "Stabilizing", mind: "Stabilizing", will: "Stabilizing", execution: "Untested", readiness: "HOLD", integrity: "Forming" },
  });
  const assignment = win().choosePracticeAssignment({ day: 8, deadline: "21:30" });
  assert(assignment.name === "Continued Standard" && assignment.domain === "execution", "Post-Foundation assignment must target the weakest domain.");
}

async function testDebriefStepper() {
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("complete-mission");
  assertText("Step 1 of 6");
  assert(!doc().querySelector('[data-action="submit-debrief"]'), "Submit must not appear before the last step.");
  for (let i = 0; i < 5; i++) await clickAction("debrief-next");
  assertText("Step 6 of 6");
  assert(doc().querySelector('[data-action="submit-debrief"]'), "Submit must appear on the last step.");
}

async function testReentryAfterAbsence() {
  await loadStateForToday({ lastActiveAt: 1 });
  const state = getState();
  assert(state.reentry === true, "Expected re-entry after a long absence.");
  assert(state.activeDays.length >= 1, "Expected an active day to be recorded.");
  assertText("Re-entry is not restart");
}

async function testNoReentryWhenRecent() {
  await loadStateForToday({ lastActiveAt: Date.now() });
  assert(getState().reentry === false, "Recent activity must not trigger re-entry.");
}

async function testReflectionDueReminder() {
  await loadStateForToday({ mission: { status: "completed" } });
  assertText("Reflection due");
}

async function testContinueStandardLoop() {
  await loadStateForToday({
    recruitQualified: true,
    foundation: { currentDay: 7, completedDays: [1, 2, 3, 4, 5, 6, 7], started: true },
    standards: { body: "Stabilizing", mind: "Stabilizing", will: "Stabilizing", execution: "Untested", readiness: "HOLD", integrity: "Forming" },
    mission: { status: "closed" },
  });
  await clickAction("continue-standard");
  const state = getState();
  assert(state.mission.name === "Continued Standard", "Continue Standard must assign a continued practice.");
  assert(state.mission.domain === "execution", "Continued practice must target the weakest domain.");
  assert(state.mission.status === "active" && state.tab === "mission", "Continue Standard must begin the practice.");
}

async function testProofLoggedContinueCta() {
  await loadStateForToday({ recruitQualified: true, lastProof: proof({ domain: "execution" }), tab: "proof-logged" });
  assert(doc().querySelector('[data-action="continue-standard"]'), "Proof-logged must offer Continue Standard when qualified.");
  assert(!doc().querySelector('[data-action="advance-foundation"]'), "Foundation advance must not show post-qualification.");
}

async function testElevationProgressShown() {
  await loadStateForToday({
    standardProgress: { body: { proofCount: 2, fails: 0 }, mind: { proofCount: 0, fails: 0 }, will: { proofCount: 0, fails: 0 }, execution: { proofCount: 0, fails: 0 } },
    tab: "standard",
  });
  assertText("2/3 reflected proofs to elevate");
}

async function testQualificationCountsShown() {
  await loadStateForToday({ debriefCount: 3, tab: "standard" });
  assertText("Reflections: 3/5");
}

async function testActiveDaysShown() {
  await loadStateForToday({ tab: "today" });
  assertText("Active Days");
}

async function testReadinessUpdatesStandard() {
  await loadStateForToday({ tab: "today" });
  await clickAction("set-pain", { value: "severe", attr: "data-pain" });
  assert(getState().standards.readiness === "RECOVER", "Standard readiness must update live when readiness changes.");
}

async function testProofFilter() {
  await loadStateForToday({
    tab: "proof",
    proofLedger: [proof({ domain: "body", text: "Body proof entry." }), proof({ domain: "mind", text: "Mind proof entry." })],
  });
  await clickAction("set-proof-filter", { value: "body", attr: "data-filter" });
  assert(doc().body.innerText.includes("Body proof entry."), "Body proof should show under the body filter.");
  assert(!doc().body.innerText.includes("Mind proof entry."), "Mind proof must be filtered out.");
}

async function testProofSourceTag() {
  await loadStateForToday({ tab: "proof", proofLedger: [proof({ source: "module", domain: "body" })] });
  assertText("Module");
}

async function testInvariantSelfHeal() {
  await loadStateForToday({
    foundation: { currentDay: 99, completedDays: [1, 2, 3], started: true },
    proofLedger: Array.from({ length: 250 }, () => proof({})),
  });
  const s = getState();
  assert(s.foundation.currentDay >= 1 && s.foundation.currentDay <= 7, "currentDay must be healed into range.");
  assert(s.proofLedger.length <= 200, "proofLedger must be capped by the guard.");
}

async function testSafetyFlagsSelfHeal() {
  // B6: a tampered payload could store safetyFlags as a string. The crisis interlock reads it with
  // .some(), so a non-array would white-screen the app instead of healing. It must coerce to [].
  await loadStateForToday({ safetyFlags: "crisis" });
  const s = getState();
  assert(Array.isArray(s.safetyFlags), "safetyFlags must be healed into an array.");
  assert(s.safetyFlags.length === 0, "A corrupt string must heal to empty, not a list of characters.");
  assert(doc().body.innerText.length > 50, "App must still render after healing corrupt safety flags.");
}

async function testHistoryPreservedDuringCrisis() {
  // B6 no-false-positive: a crisis flag pauses NEW acceptance (gated at applyProof) but must NOT
  // retroactively downgrade proofs earned before the flag. Guards against an over-strong ledger
  // invariant that would corrupt legitimate history.
  await loadStateForToday({
    safetyFlags: ["crisis"],
    proofLedger: [proof({ status: "Accepted" }), proof({ status: "Accepted" })],
  });
  const accepted = getState().proofLedger.filter(p => p.status === "Accepted").length;
  assert(accepted === 2, "Historical accepted proofs must survive a later crisis flag.");
}

async function testLastGoodRecovery() {
  // B5: seed a recognizable clean state (a last-good snapshot is written on render), then corrupt
  // the main key and reload. The app must roll back to the snapshot, not wipe to defaults, and flag
  // the recovery and quarantine the corrupt blob.
  await loadStateForToday({ debriefCount: 4 });
  win().localStorage.setItem(STORAGE_KEY, "{ broken json");
  frame.src = `/index.html?qa=${Date.now()}`;
  await waitForFrame();
  await wait(1400);
  const s = getState();
  assert(s.debriefCount === 4, "Recovered state must come from the last-good snapshot, not defaults.");
  assert(s.restoredFromBackup === true, "Recovery must be flagged for the integrity banner.");
  assert(!!win().localStorage.getItem(BACKUP_KEY), "Corrupt blob must be quarantined to the backup key.");
}

async function testRecoveryBannerDismiss() {
  // C3: a recovered state must honestly tell the user, and the notice must be dismissable.
  await loadStateForToday({ restoredFromBackup: true });
  assertText("Recovered from backup");
  await clickAction("dismiss-recovery");
  const s = getState();
  assert(s.restoredFromBackup === false, "Dismiss must clear the recovery flag.");
  assert(!doc().body.innerText.toLowerCase().includes("recovered from backup"), "Banner must disappear after dismiss.");
}

async function testLedgerSignedOnCreate() {
  // B4: applyProof must sign every new proof, and the resulting chain must verify.
  await setupToToday();
  await clickAction("begin-main-mission");
  await clickAction("complete-mission");
  await submitStrongReflection("Delay appeared and I waited.");
  const s = getState();
  assert(typeof s.proofLedger[0].hash === "string" && s.proofLedger[0].hash.length >= 8, "Logged proof must carry a signature.");
  assert(win().verifyLedger(s.proofLedger) === true, "An app-created ledger must verify.");
}

async function testLedgerChainValid() {
  // A correctly signed entry verifies and shows no tamper banner.
  await loadStateForToday({});
  const signed = proof({ status: "Accepted", text: "honest proof" });
  signed.prevHash = "genesis";
  signed.hash = win().hashEntry(signed, "genesis");
  await loadStateForToday({ proofLedger: [signed] });
  assert(win().verifyLedger(getState().proofLedger) === true, "A correctly signed ledger must verify.");
  assert(!doc().body.innerText.toLowerCase().includes("integrity check failed"), "No tamper banner for a valid chain.");
}

async function testLedgerTamperDetected() {
  // B4: a proof edited AFTER signing (status upgraded in storage) must fail verification + warn.
  await loadStateForToday({});
  const forged = proof({ status: "Incomplete", text: "weak attempt" });
  forged.prevHash = "genesis";
  forged.hash = win().hashEntry(forged, "genesis"); // signed as Incomplete
  forged.status = "Accepted";                        // forged upgrade after signing
  await loadStateForToday({ proofLedger: [forged] });
  assert(win().verifyLedger(getState().proofLedger) === false, "Editing a signed proof must fail verification.");
  assertText("integrity check failed");
}

async function testLedgerLegacyNotFlagged() {
  // Tolerance: ledgers written before B4 (no hash field) must not be falsely flagged as tampered.
  await loadStateForToday({ proofLedger: [proof({}), proof({ domain: "mind" })] });
  assert(win().verifyLedger(getState().proofLedger) === true, "Legacy unsigned proofs must not be flagged.");
  assert(!doc().body.innerText.toLowerCase().includes("integrity check failed"), "No tamper banner for a legacy ledger.");
}

async function testSeverePainGuard() {
  // Soft guard (no hard latch): severe->lower must warn about injury masking and make the SAFE
  // option (keep severe) the primary button so a reflexive tap protects.
  await loadStateForToday({ readiness: { sleep: 3, energy: 3, soreness: 2, pain: "severe", stress: 3, emotional: 2, motivation: 2 } });
  await clickAction("set-pain", { value: "none", attr: "data-pain" });
  assert(getState().modal === "painDowngrade", "Severe downgrade must ask for confirmation.");
  assertText("hide an injury");
  assert(doc().querySelector('.modal-panel .btn.primary[data-action="close-modal"]'), "Keep-severe must be the emphasized (primary) option.");
  assert(doc().querySelector('.btn.ghost[data-action="confirm-pain"]'), "Lowering severe must be the secondary action.");
  assert(getState().readiness.pain === "severe", "Pain must not change before confirmation.");
}

async function testInjuryFlagForcesRecover() {
  // Verified gap fix: injury/medical/pain flags must restrict activity to RECOVER (were inert before).
  const fit = { sleep: 5, energy: 5, soreness: 1, pain: "none", stress: 1, emotional: 1, motivation: 3 };
  await loadStateForToday({ readiness: fit, safetyFlags: [] });
  assert(win().computeReadiness(getState().readiness).command === "PRESS", "Control: fit + no flag should be PRESS.");
  await loadStateForToday({ readiness: fit, safetyFlags: ["injury"] });
  assert(win().computeReadiness(getState().readiness).command === "RECOVER", "Injury flag must force RECOVER even when fit.");
  await loadStateForToday({ readiness: fit, safetyFlags: ["medical"] });
  assert(win().computeReadiness(getState().readiness).command === "RECOVER", "Medical flag must force RECOVER.");
}

async function testSafetyPanelManage() {
  // Verified gap fix: flags must be settable AND clearable after onboarding (no permanent lock).
  await loadStateForToday({ tab: "system", safetyFlags: [] });
  await clickAction("toggle-safety", { value: "injury", attr: "data-flag" });
  assert(getState().safetyFlags.includes("injury"), "System must let a user set a flag later.");
  await clickAction("toggle-safety", { value: "injury", attr: "data-flag" });
  assert(!getState().safetyFlags.includes("injury"), "System must let a user clear a recovered flag.");
}

async function testTodayProgressShown() {
  // High-leverage: elevation + qualification progress visible on Today, not only the Standard tab.
  await loadStateForToday({ tab: "today" });
  assertText("Progress");
  assertText("reflected proofs to elevate");
  assertText("criteria");
}

async function testSafetyScanBroadened() {
  // P1 #7: newer phrasings must still be caught, including the self-punishment category.
  const cases = [
    ["I honestly feel better off dead lately.", "crisis"],
    ["I want to make myself suffer for failing.", "self-punishment"],
    ["I will be restricting calories to compensate.", "restriction"],
  ];
  for (const [text, flag] of cases) {
    await loadStateForToday({
      debrief: { result: "Completed", friction: ["Delay"], negotiation: text, decision: "Hold", lesson: "x", correction: "y" },
    });
    win().applySafetyLanguageScan();
    win().render();
    assert(getState().safetyFlags.includes(flag), `Expected "${flag}" flag for: ${text}`);
  }
}

async function testMultiTabSync() {
  // P1 #10: another tab writes the shared state; this tab must adopt it (not clobber with stale data).
  await loadStateForToday({ debriefCount: 2 });
  const external = { ...getState(), debriefCount: 42 };
  win().localStorage.setItem(STORAGE_KEY, JSON.stringify(external)); // simulate the other tab's write
  const changed = win().syncFromStorage();
  assert(changed === true, "syncFromStorage must report it adopted external state.");
  assert(getState().debriefCount === 42, "This tab must adopt the other tab's state.");
  assert(win().syncFromStorage() === false, "A second sync with no change must be a no-op (converges).");
}

async function testLocalReport() {
  // C1: the report must reflect the user's real local numbers (no fabrication).
  await loadStateForToday({
    tab: "system",
    debriefCount: 4,
    activeDays: ["2026-06-01", "2026-06-02", "2026-06-03"],
    proofLedger: [proof({ status: "Accepted", quality: 5 }), proof({ status: "Under Review", quality: 2 })],
  });
  const r = win().computeReport();
  const s = getState();
  // initSession legitimately appends today, so compare to actual state rather than the seed count.
  assert(r.activeDays === s.activeDays.length && r.activeDays >= 3, "Report must count active days from state.");
  assert(r.reflections === 4, "Report must reflect debriefCount.");
  assert(r.totalProofs === 2 && r.byStatus["Under Review"] === 1, "Report must count proof statuses.");
  await clickAction("open-report");
  assertText("Your numbers");
  assert(getState().modal === "report", "Report modal must open.");
}

async function testEntryLocalOnlyNotice() {
  // P0 #2: with the account screen dropped, the first (Access) screen must state data is local-only.
  await loadFresh();
  assertText("Begin Assessment");
  assertText("stays on this device");
}

async function testLocalOnlyNotice() {
  // P0: the data modal must clearly state data is local-only before any export/import.
  await loadStateForToday({ tab: "system" });
  await clickAction("open-export");
  assertText("stays on this device");
  assert(!!doc().querySelector('[data-action="download-backup"]'), "Download backup action must be offered.");
}

async function testImportValidBackup() {
  await loadStateForToday({ tab: "system", debriefCount: 2 });
  await clickAction("open-export");
  const backup = JSON.stringify({ ...getState(), debriefCount: 9 });
  win().applyImportText(backup);
  assert(getState().importStatus === "ready", "A valid backup must be stageable.");
  await clickAction("confirm-import");
  assert(getState().debriefCount === 9, "Confirmed import must replace data.");
  assert(getState().modal === "", "Import must close the modal.");
}

async function testImportInvalidRejected() {
  await loadStateForToday({ tab: "system", debriefCount: 3 });
  await clickAction("open-export");
  win().applyImportText("this is not json");
  assert(getState().importStatus === "error", "An unreadable file must report an error.");
  assertText("not a valid Spartan X backup");
  assert(!doc().querySelector('[data-action="confirm-import"]'), "No confirm offered for an invalid backup.");
  assert(getState().debriefCount === 3, "Invalid import must not change data.");
}

async function testImportWrongVersionRejected() {
  await loadStateForToday({ tab: "system" });
  await clickAction("open-export");
  win().applyImportText(JSON.stringify({ stateVersion: 2, status: "Spartan Standard" }));
  assert(getState().importStatus === "error", "A wrong-version backup must be rejected.");
  assert(!doc().querySelector('[data-action="confirm-import"]'), "No confirm offered for a wrong-version backup.");
}

async function testImportCancel() {
  await loadStateForToday({ tab: "system", debriefCount: 5 });
  await clickAction("open-export");
  win().applyImportText(JSON.stringify({ ...getState(), debriefCount: 12 }));
  assert(getState().importStatus === "ready", "Backup staged for confirm.");
  await clickAction("cancel-import");
  assert(getState().importStatus === "", "Cancel must clear staging.");
  assert(getState().debriefCount === 5, "Cancel must not change data.");
}

async function testOldMaxRecorded() {
  await loadStateForToday({});
  const w = win();
  for (let i = 0; i < 3; i++) {
    w.updateStandardsFromProof({ status: "Accepted", source: "reflection", domain: "body", quality: 3, friction: "Delay", result: "Completed" });
  }
  w.render();
  const state = getState();
  assert(state.standards.body === "Stabilizing", "Body should elevate to Stabilizing.");
  assert(state.standardProgress.body.oldMax === "Tested", "oldMax must record the pre-elevation level.");
}

async function testCallsign() {
  // Optional identity (for future community challenges): editable in System, used to tag check-ins.
  await loadStateForToday({ tab: "system", profile: { callsign: "" }, recruitQualified: true });
  assert(doc().querySelector("#callsignSetting"), "System must offer a callsign field.");
  setInput("callsignSetting", "Operator-7");
  assert(getState().profile.callsign === "Operator-7", "Callsign must persist from System.");
  await loadStateForToday({
    recruitQualified: true, tab: "modules", profile: { callsign: "Operator-7" },
    modules: { active: "circle", circle: { latestCheckin: "Practice closed. Delay. Start before phone." } },
  });
  await clickAction("set-tab", { value: "modules", attr: "data-tab" });
  await clickAction("set-module", { value: "circle", attr: "data-module" });
  await clickAction("submit-circle-checkin");
  assert(getState().modules.circle.checkins[0].name === "Operator-7", "Check-in must be tagged with the callsign.");
}

async function testJustInTimeOnboarding() {
  // The first proof drops the user into the app; safety check gates the first practice; claim deferred.
  await loadFresh();
  await clickAction("begin-selection");
  await clickAction("start-order");
  await clickAction("complete-first-order");
  await clickAction("submit-first-report");
  await clickAction("finish-onboarding");
  let s = getState();
  assert(s.onboardingComplete === true, "First proof should complete onboarding.");
  assert(s.claim === "", "Claim must be deferred, not set during onboarding.");
  assert(s.safetyChecked === false, "Safety check is deferred to Today.");
  assert(!doc().querySelector('[data-action="begin-main-mission"]'), "Begin Practice must be gated until the safety check.");
  assertText("Before your first practice");
  await clickAction("confirm-safety-check");
  s = getState();
  assert(s.safetyChecked === true, "Safety check confirmed.");
  assert(!!doc().querySelector('[data-action="begin-main-mission"]'), "Begin Practice available after the safety check.");
  assertText("Pick a claim to test");
  await clickAction("select-claim", { value: "I am disciplined.", attr: "data-claim" });
  assert(getState().claim === "I am disciplined.", "Deferred claim can be chosen on Today.");
}

async function setupToToday() {
  // Just-in-time onboarding: first proof → straight into the app, then the one-time safety check.
  await loadFresh();
  assertText("Begin Assessment");
  await clickAction("begin-selection");
  assertText("First Practice");
  await clickAction("start-order");
  assertText("Return and report");
  await clickAction("complete-first-order");
  assertText("First Report");
  await clickAction("submit-first-report");
  assertText("Provisional Candidate");
  await clickAction("finish-onboarding");
  // Now on Today with the one-time safety check card; confirm it so practice can start.
  assertText("Before your first practice");
  await clickAction("confirm-safety-check");
  assertText("Begin Practice");
}

async function submitStrongReflection(note) {
  await clickAction("debrief-next"); // Result -> Friction
  await clickFriction("Delay");
  await clickAction("debrief-next"); // Friction -> Negotiation
  await fillByPlaceholder("What excuse appeared?", note);
  await clickAction("debrief-next"); // Negotiation -> Decision
  await clickAction("debrief-next"); // Decision -> Lesson
  await fillByPlaceholder("What did this reveal?", "I delay when the practice is simple but inconvenient.");
  await clickAction("debrief-next"); // Lesson -> Correction
  await fillByPlaceholder("What changes next?", "I will start before checking my phone.");
  await clickAction("submit-debrief");
}

async function loadFresh() {
  // A truly fresh visitor has no main state AND no backups, or the last-good rollback could
  // resurrect a prior test's state during a fresh-load assertion.
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_KEY);
  localStorage.removeItem(LASTGOOD_KEY);
  frame.src = `/index.html?qa=${Date.now()}`;
  await waitForFrame();
  await wait(1400);
}

async function loadStateForToday(patch) {
  const base = {
    stateVersion: 1,
    view: "splash",
    tab: "today",
    selectedOrder: "body",
    firstOrderStatus: "completed",
    assessmentFailures: 0,
    profile: {
      email: "test@example.com",
      password: "prototype-pass",
      displayName: "Test User",
      callsign: "Tester",
      ageConfirmed: true,
      consentConfirmed: true,
      consentChallenge: true,
    },
    report: {
      completed: "completed",
      frictionLevel: "medium",
      resisted: ["Delay"],
    },
    claim: "I do not have enough time.",
    safetyFlags: [],
    safetyChecked: true,
    status: "Foundation Candidate",
    onboardingComplete: true,
    recruitQualified: false,
    modal: "",
    adjustReason: "Fatigue",
    pauseSignal: "Avoidance",
    lastProof: null,
    foundation: {
      currentDay: 1,
      completedDays: [],
      started: true,
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
      teams: {
        members: 8,
        reflectionRate: 63,
        recoveryAdherence: 71,
        unresolvedRisk: 1,
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
    },
    debrief: {
      result: "Completed",
      friction: ["Delay"],
      negotiation: "",
      decision: "Hold",
      lesson: "",
      correction: "",
    },
    proofLedger: [],
    standards: {
      body: "Untested",
      mind: "Untested",
      will: "Under Review",
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
  const state = deepMerge(base, patch);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  frame.src = `/index.html?qa=${Date.now()}`;
  await waitForFrame();
  await wait(250);
}

function sampleProofLedger() {
  return [
    proof({ friction: "Delay, Time", domain: "execution", quality: 5 }),
    proof({ friction: "Boredom, Negotiation", domain: "mind", quality: 4 }),
    proof({ friction: "Fatigue, Avoidance", domain: "will", quality: 4, minimumOnly: true }),
    proof({ friction: "Pain", domain: "readiness", decision: "Recover", quality: 3 }),
    proof({ friction: "Delay", domain: "body", quality: 4 }),
  ];
}

function proof(overrides = {}) {
  return {
    date: "20 Jun 2026",
    status: "Accepted",
    result: "Completed",
    text: "Completed prototype practice under named friction.",
    friction: "Delay",
    decision: "Hold",
    domain: "execution",
    day: 1,
    minimumOnly: false,
    effect: "Standard held",
    quality: 4,
    ...overrides,
  };
}

function openDisclosures() {
  // Today's reference panels are collapsed <details> by default; expand them so assertText (which
  // ignores hidden content) can see the deconstruction/foundation/friction text.
  doc().querySelectorAll("details.disclosure").forEach(d => { d.open = true; });
}

function waitForFrame() {
  return new Promise(resolve => {
    frame.addEventListener("load", () => resolve(), { once: true });
  });
}

function doc() {
  return frame.contentDocument;
}

function win() {
  return frame.contentWindow;
}

function getState() {
  return JSON.parse(win().localStorage.getItem(STORAGE_KEY));
}

async function clickAction(action, options = {}) {
  const selector = options.value
    ? `[data-action="${action}"][${options.attr || "data-value"}="${cssEscape(options.value)}"]`
    : `[data-action="${action}"]`;
  const element = doc().querySelector(selector);
  assert(element, `Missing action: ${action}${options.value ? ` (${options.value})` : ""}`);
  element.click();
  await wait(80);
}

async function clickFriction(name) {
  await clickAction("toggle-debrief-friction", { value: name, attr: "data-friction" });
}

async function toggleFrictionOff(name) {
  const element = doc().querySelector(`[data-action="toggle-debrief-friction"][data-friction="${cssEscape(name)}"][aria-pressed="true"]`);
  if (element) {
    element.click();
    await wait(80);
  }
}

function setInput(id, value) {
  const input = doc().querySelector(`#${id}`);
  assert(input, `Missing input: ${id}`);
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function setChecked(key, value) {
  const input = doc().querySelector(`[data-key="${key}"]`);
  assert(input, `Missing checkbox: ${key}`);
  input.checked = value;
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function setSelect(id, value) {
  const select = doc().querySelector(`#${id}`);
  assert(select, `Missing select: ${id}`);
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

async function setModuleNumber(module, key, value) {
  const input = doc().querySelector(`[data-input="module-number"][data-module="${cssEscape(module)}"][data-key="${cssEscape(key)}"]`);
  assert(input, `Missing module number input: ${module}.${key}`);
  input.value = String(value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(80);
}

async function fillByPlaceholder(placeholder, value) {
  const input = [...doc().querySelectorAll("textarea, input")].find(item => item.placeholder === placeholder);
  assert(input, `Missing placeholder: ${placeholder}`);
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(40);
}

function assertText(expected) {
  const text = doc().body.innerText.toLowerCase();
  assert(text.includes(expected.toLowerCase()), `Expected text: ${expected}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function deepMerge(base, patch) {
  for (const [key, value] of Object.entries(patch || {})) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      base[key] = deepMerge(base[key] || {}, value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function writeResult(name, pass, detail) {
  const item = document.createElement("li");
  item.className = pass ? "pass" : "fail";
  item.innerHTML = `<strong>${pass ? "PASS" : "FAIL"} - ${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span>`;
  results.appendChild(item);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cssEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
