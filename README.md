# Bloom

A cycle tracker built with care. Personalized, adaptive, and EBM-backed — not a generic questionnaire.

## What it does

Bloom tracks menstrual cycles with real clinical logic running underneath:

- **CycleEngine** — rolling 6-cycle predictions (ACOG), FIGO 2018 regularity classification, Bayesian confidence bands that widen when cycles are irregular
- **SymptomEngine** — builds a personal PMS signature by phase, DSM-5 prospective PMDD screening
- **RedFlagEngine** — 10 evidence-based checks (menorrhagia, HMB, oligo/polymenorrhea, secondary amenorrhea, sudden cycle shift, refractory dysmenorrhea, intermenstrual bleeding / PALM-COEIN, PMDD pattern, anemia risk)
- **InsightEngine** — phase-aware daily tips (NSAID timing, iron + Vit C window, magnesium for luteal PMS)
- **LoveEngine** — contextual notes, rotates by phase and cycle day

All data stays on the device (localStorage). Nothing is synced, nothing is sent anywhere.

## Files

```
bloom/
├── index.html       # the whole app (single file)
├── manifest.json    # PWA manifest
├── sw.js            # service worker (offline cache)
├── icon-192.png     # ADD THIS — 192×192 app icon
├── icon-512.png     # ADD THIS — 512×512 app icon
└── README.md
```

You need to add two icon PNGs (`icon-192.png`, `icon-512.png`) before deploying. Any rose/pink artwork works — a simple flower, a gradient bloom, a letter "B". Keep them square with ~10% safe padding so they mask well on iOS/Android.

Quick ways to generate them:
- [realfavicongenerator.net](https://realfavicongenerator.net/) — upload any square image, download the PWA set
- Figma / Canva — export 192×192 and 512×512 PNGs directly

## Deploy to GitHub Pages

```bash
# 1. Create a new repo (e.g., bloom)
git init
git add .
git commit -m "Initial Bloom deploy"
git branch -M main
git remote add origin https://github.com/<your-username>/bloom.git
git push -u origin main

# 2. On GitHub: Settings → Pages → Source: "Deploy from branch" → main / (root) → Save
# 3. Wait ~1 min, site goes live at https://<your-username>.github.io/bloom/
```

HTTPS is required for service worker + PWA install. GitHub Pages gives you HTTPS by default.

## How Vaishnavi installs it

**iPhone (Safari):**
1. Open the GitHub Pages URL in Safari
2. Tap the share icon → "Add to Home Screen"
3. Confirm → Bloom icon appears on the home screen
4. Launches fullscreen like a native app, works offline after first load

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the menu (⋮) → "Install app" or "Add to Home screen"
3. Confirm → icon appears in app drawer and home screen

## First-run flow

On first open, Bloom runs a 5-step onboarding:
1. Welcome
2. Last period start date
3. Typical cycle length (default 28)
4. Known conditions (PCOS, endometriosis, etc.) — optional, used for risk weighting
5. Ready

After that it's one-tap logging. Home screen shows the current cycle day, phase, days to next period, and a love note.

## Updating the app

Push changes to the repo. The service worker bumps on `CACHE_NAME` change in `sw.js` — if you make major changes, change `'bloom-v1'` → `'bloom-v2'` to force a cache refresh.

## Backup and restore

Profile → Export Data → downloads a JSON file with everything (periods, logs, profile). Import restores from that file. Export Report → downloads a plain text summary for a doctor visit.

---

Built April 2026.
