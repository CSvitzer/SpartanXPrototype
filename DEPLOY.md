# Deploying Spartan X

Spartan X is a **dependency-free static app** (`index.html`, `app.js`, `styles.css`, `sw.js`,
`manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-180.png`). No build step,
no backend, no environment variables. All user data lives in the browser's `localStorage` only.

## Why HTTPS is required
The service worker (offline support) and "Add to Home Screen" / install only work over **HTTPS** or
on **`localhost`**. Opening `index.html` from `file://` will run the app but **will not** register
the service worker or offer install. Host it on any static HTTPS surface.

## What to upload
Everything in the **repo root** except the development-only folders/files:
- Ship: `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `icon.svg`,
  `icon-192.png`, `icon-512.png`, `icon-180.png`.
- Do **not** need to ship: `e2e/` (tests), `serve.js` (local dev server only), the `*.md` docs,
  `.github/`, and the `spartanx-*.png` screenshots.

`start_url` and `scope` in the manifest are relative (`./`), so the app works correctly whether it is
served from a domain root or a subpath (e.g. a GitHub Pages project site at `/SpartanXPrototype/`).

## Option A — GitHub Pages (simplest)
1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment**: Source = "Deploy from a branch", Branch =
   `main`, folder = `/ (root)`. Save.
3. Wait for the green check; the site appears at
   `https://<user>.github.io/<repo>/index.html`.
4. Open it on a phone → browser menu → **Add to Home Screen**. Launch from the icon; it runs
   standalone and works offline after the first online load.

> The app root must stay dependency-free for root-folder Pages to serve it as-is. The test deps live
> in `e2e/` and are never deployed.

## Option B — Netlify / Cloudflare Pages / any static host
Point the host at the repo root (no build command, publish directory = `.`). Both give HTTPS by
default. Drag-and-drop deploy also works: zip the "Ship" files above and upload.

## Local preview (HTTPS-equivalent via localhost)
```bash
node serve.js          # http://127.0.0.1:4173  (localhost counts as a secure context)
```
Install + offline work here because `localhost` is treated as secure.

## After each deploy: bump the service-worker cache
`sw.js` is **network-first**, so online users always get fresh files. The precache is versioned by
`const CACHE = "spartanx-vN"`. When you change shipped assets, **increment that number** (e.g.
`v3 → v4`). On next load the old cache is deleted in the SW `activate` step, so offline users pick up
the new assets instead of a stale precache.

## Verify the deploy
- Load over HTTPS; DevTools → Application → **Manifest** shows the icons (192/512 + maskable) with no
  errors, and **Service Workers** shows an activated worker.
- Toggle DevTools → Network → **Offline** and reload: the app still renders (served from cache).
- On iOS Safari, **Add to Home Screen** shows the bronze-X icon (from `icon-180.png`).
- Regenerate icons after editing `icon.svg` with `cd e2e && node gen-icons.js`.

## Honest limitations
- Data is local-only: a browser-data clear, device switch, or private window loses it. The in-app
  **Data & Backup** screen (export/import) is the user's safeguard — call it out in any onboarding.
- Playwright's WebKit build lacks service-worker support, so the e2e offline assertion is skipped on
  WebKit (real iOS Safari supports service workers).
