# Spartan X — Action Backlog (P0 / P1 / P2)

Compiled 2026-06-22 from the full audit, usage audit, persona review (UX/UI designer, tester,
end user), and the PRD §6 production boundary. Status of the prototype: feature-complete and
test-covered (qa.html 46 · e2e deep 37 · coverage 31/68 actions · progression to Spartan).
This backlog is what remains to make it safely shippable and then a real product.

Priority key: **P0** = blocker before real users touch it · **P1** = important quality/robustness
near alpha · **P2** = later / polish / production (Phase B).

---

## P0 — Blockers before giving it to a real user

1. ✅ **DONE — Data-loss safeguard (highest end-user risk).** Data & Backup modal now offers (a) a
   clear "your data stays on this device" notice (in the modal + System tab), (b) real **export to
   file** (`download-backup` → timestamped `.json` blob), (c) **import/restore** from file with
   validate→confirm (`applyImportText` + `confirm-import`/`cancel-import`). Layered on B5 last-good
   rollback. Tests: 6 in qa.js + full-coverage S13b.
2. ✅ **DONE — "Local-only" clarity at signup.** `renderAccountCreation` now shows a plain notice:
   "This is a local prototype — nothing is sent anywhere… don't enter a real password." Test:
   `testSignupLocalOnlyNotice`.
3. **Crisis-path integrity (safety domain).** Ensure a crisis-flagged user always sees unmissable,
   accurate emergency guidance and can never be pushed toward escalation. Current resources are a
   static placeholder (112/999/911 + findahelpline + 988) — acceptable for prototype only if it is
   prominent and honest; verify it shows on every relevant surface. (Region-verified directory = P2.)
4. ✅ **DONE — Deploy on HTTPS + real icons.** Added PNG icons `icon-192/512/180.png` (rasterized
   from `icon.svg` via `e2e/gen-icons.js`), wired into `manifest.webmanifest` (192 + 512 any +
   512 maskable) and `apple-touch-icon` (180). serve.js now sends `image/png`; `sw.js` precaches the
   PNGs (cache bumped v2→v3). Wrote `DEPLOY.md` (GitHub Pages / Netlify / Cloudflare; HTTPS rationale;
   per-deploy cache bump; verification + honest limits). Verified: icons serve `image/png 200`,
   manifest valid (4 icons), chromium offline install 37/37.

## P1 — Important quality & robustness (near alpha)

5. **Today progressive disclosure.** Today is dense (status + 7-day path + 6 sliders + pain +
   deconstruction + friction map) — violates the Design Doc's "no analytics overload". Collapse
   Readiness Check / Friction Map / Deconstruction behind `<details>`. Files: `renderTodayTab`.
6. **Access-rail logic fix.** The rail shows "Active Claim / Readiness" before the user has chosen
   them. Hide rail meta until onboarding/claim is set. Files: `renderRail`.
7. **Harden safety-language scan.** Still a keyword backstop; expand patterns and treat as one of
   several safeguards, never the only one. Files: `applySafetyLanguageScan`.
8. **Accessibility audit (axe-core).** Add an automated a11y scan as a test layer; fix contrast,
   labels, focus order, and focus retention across the full-`innerHTML` re-render. (44px targets +
   reduced-motion already done.)
9. **Visual regression tests.** Screenshot-diff key screens (desktop + mobile) so a CSS change
   can't silently break layout. Add to `e2e/`.
10. **Multi-tab / storage concurrency.** Two open tabs both write the same `localStorage`
    (last-write-wins can clobber progress). Add a `storage` event handler or write-merge guard.
11. **Dampen the desktop hero-rail** after onboarding (redundant "PROVE THAT YOU BELONG" beside
    the app). Files: `renderRail` / `styles.css`.
12. **Real-device smoke test.** Manually verify install + offline on iOS Safari and Android Chrome
    (only headless Chromium tested so far).

## P2 — Later / polish / product decisions / production (Phase B)

### Product / UX polish
13. **RECOVER latch decision (deferred #2).** Decide: keep soft pain-downgrade confirmation, or add
    a hard latch requiring a logged recovery before leaving a protected state.
14. **Reflection ergonomics.** Make stepper chips tappable to jump/review; consider a "quick
    reflection" for low-friction days (daily 6-step flow may fatigue).
15. **Collapse locked qualification tiers** in the Standard ladder (long on mobile).
16. **Continue Standard copy** — more specific guidance than "practice in your weakest domain".
17. **Input robustness/perf** — huge CSV import, emoji, very long text; quota fuzzing (escaping is
    already verified).
18. **Timezone/DST correctness** for `activeDays` (ISO-date keying).
19. **Moving Standard depth** — explicit Regressed→rebuild flow; capture real friction level per
    proof instead of the AAR-quality proxy.

### Production infrastructure (PRD §6 — turns prototype into product)
20. Backend + PostgreSQL (the §6 16-table schema); API.
21. Real auth: password hashing, login, reset, email verification, account recovery.
22. Cross-device persistence / sync (removes the P0 data-loss risk structurally).
23. Payments.
24. Real integrations: wearables, AI personalization, expert review, team/enterprise, social graph.
25. **Region-verified crisis-resource directory** (productionizes P0 #3).
26. Production privacy/consent, data export & deletion guarantees; push notifications.

---

## Suggested execution order
P0 (1→4) makes it safe and distributable as an alpha. P1 (5→12) makes it solid and trustworthy.
P2 #13–19 is product polish you can do anytime; #20–26 is the separate Phase-B build where this
prototype becomes the spec.
