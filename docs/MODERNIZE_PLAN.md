# MIL CITY Team Hub: Modernization Plan

> **How to use this file (saves a lot of usage):**
> 1. Run **one phase per Claude Code session**. Start each session with:
>    `Read CLAUDE.md and docs/MODERNIZE_PLAN.md. Do Phase N only, then commit and stop.`
> 2. Between phases type `/clear`. Everything important lives in the repo and in git.
> 3. Use `/model sonnet` for Phases 0, 1, 6 and 7. Use your strongest model for Phases 2, 3 and 5.

---

## Context

- The project is the **MIL CITY Team Hub**: a static internal site (HTML, CSS, vanilla JS) deployed from `public/` on Vercel. No build step.
- Rebranded from EMS to MIL CITY on branch `revamp/mil-city`. Read `REVISION_NOTES.md` and `DESIGN.md` before changing anything.
- Pages are hash routes in `public/index.html`: `#home`, `#tools`, `#training`, `#org`, `#rules`.
- **All content lives in `public/assets/js/data.js`.** Non-developers edit that file. Keep it simple and keep its format working.
- Behaviour is in `public/assets/js/app.js` and `theme.js`. Styles are in `public/assets/css/styles.css`. `scripts/check.mjs` validates the content.

## Ground rules (every phase)

1. **No framework migration and no required build step.** Vercel serves `public/` as-is. Dev-only tooling (tests, lint) is fine as `devDependencies`.
2. `data.js` stays the single content file with the same field names. If you change its shape, update `scripts/check.mjs` and the README table in the same commit.
3. Keep the `ems-hub:` localStorage key prefix. Renaming it would wipe everyone's saved progress.
4. **Privacy:** never add home addresses or birth years. Birthdays are month and day only.
5. Keep `vercel.json` security headers working. If you add or remove an outside source (fonts, images, scripts), update the Content-Security-Policy in the same commit.
6. Every phase ends with: `npm run check` passing, Phase 1's tests passing (once they exist), a commit named `modernize phase N: …`, and a short note added to `REVISION_NOTES.md` under a "Modernization" heading.
7. Do not read whole skill files. `grep` their headings and read only the sections you need.
8. Screenshots: only `#home` and `#org`, at 1440 and 390 wide, unless a phase says otherwise.

---

## Phase 0: Install the tools and set up project memory

```bash
# 1. taste-skill
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend --skill image-to-code --skill full-output-enforcement -y -a claude-code

# 2. Vercel web interface guidelines
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines -y -a claude-code
curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md -o docs/web-interface-guidelines.md

# 3. Playwright CLI + its skill
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Notes:
- `vercel-labs/web-interface-guidelines` on its own is not an installable skill. Use the two commands above.
- Use taste-skill's `image-to-code` skill. Skip the standalone image-to-code repos.
- `DESIGN.md` already follows the awesome-design-md format. Keep it current.
- If `playwright-cli open` can't find a browser, run `npx playwright install chromium` once.
- The taste-skill inspector needs Chrome. If "No Chrome found", set `CHROME_PATH`.

Then create **`CLAUDE.md`** at the project root (under 40 lines): condensed Context and Ground rules; commands `npm run dev` (:3000), `npm run check`, `npm test` (after Phase 1), `npm run lint` (after Phase 7); and "Design rules: `DESIGN.md`. UI rules: `docs/web-interface-guidelines.md`. Plan: `docs/MODERNIZE_PLAN.md`."

Verify: `/skills` shows the new skills. `playwright-cli --version` prints a version.
Commit: `modernize phase 0: tools and CLAUDE.md`.

---

## Phase 1: Safety net first (automated tests)

Add `@playwright/test` as a devDependency and `tests/hub.spec.js`. Add npm script `"test": "playwright test"` with a `webServer` running `npm run dev`. Tests:

- **Links:** every tool card's href exactly matches `data.js`, opens with `target="_blank"` and `rel="noopener noreferrer"`. OTC List and GLP-1 List show "To be updated".
- **Org chart:** exactly 7 people (2 owners, 1 OM, 4 sales reps). Each drawer's `mailto:` and `tel:` links match `data.js`.
- **Privacy:** page HTML and `data.js` contain no birth years or address words (Novaliches, Marikina, Cabatuan, Cainta, Apolonio).
- **Brand:** no visible "EMS" or "East Med" text.
- **Layout:** no horizontal scroll at 375, 768 and 1024 on every route. One `h1` per active page.
- **Keyboard:** Ctrl+K opens search, Escape closes it, focus returns. Mobile menu opens and closes by keyboard.
- **Accessibility:** `@axe-core/playwright`. Zero serious or critical violations on every route, in light and dark.
- **Dark mode:** setting `ems-hub:theme=dark` applies `data-theme="dark"`.

Done when `npm test` passes on the current site before any modernization.

---

## Phase 2: Modern JavaScript (no build step)

1. **ES modules.** Split `app.js` into `store.js`, `router.js`, `tools.js`, `training.js`, `org.js`, `rules.js`, `search.js`, `main.js`. Load with `<script type="module" src="/assets/js/main.js">`. `data.js` keeps setting `window.MILCITY_DATA`; `main.js` reads from it.
2. **Native `<dialog>`** for the search palette and person drawer (`showModal()`). Delete the hand-written inert/scrim/focus-return code. Keep the slide-in animation with `@starting-style` and `transition-behavior: allow-discrete`.
3. **Mobile menu:** `popover` or `<dialog>`. Keep `aria-expanded` in sync.
4. **View Transitions** for page changes, falling back to instant switch. Off under `prefers-reduced-motion`.
5. Replace string-built `onclick` with **one delegated listener** per section (`data-action`).
6. Keep `esc` on every value from `data.js` that goes into HTML.

Done when `npm test` passes, console is clean, and `app.js` is gone or under 40 lines.

---

## Phase 3: Modern CSS

1. **Cascade layers:** `@layer tokens, base, layout, components, utilities;` and move every rule into a layer.
2. **One token set for both themes** with `light-dark()`. `:root{color-scheme:light dark}`, `[data-theme=light]{color-scheme:light}`, `[data-theme=dark]{color-scheme:dark}`. Delete the three duplicated dark-mode blocks. Logo swaps use the same mechanism.
3. **Native CSS nesting** for component rules.
4. **Container queries** for tool cards, quick tiles and person cards.
5. Logical properties, `100dvh`, `text-wrap: balance` on headings, `pretty` on paragraphs.
6. Keep `DESIGN.md` accurate.

Done when tests pass, `node .claude/skills/design-taste-frontend/scripts/lint.mjs public` reports 0 FAIL, and screenshots match the pre-phase look in both themes.

---

## Phase 4: Performance and assets

1. **Self-host Archivo** (variable woff2, Latin subset) in `public/assets/fonts/`, `@font-face` with `font-display: swap`, preload. Remove Google Fonts links and their CSP entries in `vercel.json`.
2. **Logos:** WebP plus 1x/2x in `public/assets/brand/`, served with `<picture>`/`srcset`, PNG fallback, exact `width`/`height`. Extend `scripts/make-logo-assets.py`.
3. `loading="lazy"` on YouTube thumbnails and below-the-fold images. Video stays a click-to-load facade.
4. Lighthouse (`npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices --quiet --chrome-flags="--headless"`). Target **95+** on all three, mobile and desktop.

---

## Phase 5: Design polish

1. Run the inspector on `#home` (`node .claude/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:3000/ --app --out .taste-skill/before`). Follow its "Redesign, restyle or review" route with `--keep palette,type`.
2. Run the `web-design-guidelines` skill as a review of `public/`. Fix every issue or note in `REVISION_NOTES.md` why it doesn't apply.
3. **One real brand picture on Home.** Use `image-to-code` on `brand-source/milcity-logo-sheet.png`: crop the skyline scene from the badge into a wide header band, light and dark, generated by `scripts/make-logo-assets.py`. Beside or under the greeting; nothing on top of the headline.
4. **States:** hover, active, focus-visible, disabled on every link, button, card. Empty states for search, org chart, missing PDFs.
5. **Motion:** subtle (MOTION 3), transform and opacity only, respect reduced motion.
6. Phone pass at 375 and 390: touch targets 44px+, nothing cut off, long names wrap.
7. Re-run the inspector into `.taste-skill/after`. Fix every FAIL. Look at the screenshots.

Done when inspector has 0 FAIL, guidelines review is clean, before/after screenshots saved in `docs/screenshots/modernize/`.

---

## Phase 6: Installable app and offline shell (optional)

1. `public/sw.js`: cache-first for fonts, logos, icons; network-first for `index.html`, `data.js`, CSS, JS; version constant clears old caches.
2. Register from `main.js` only on HTTPS or localhost.
3. "Update available. Reload" toast when a new version is waiting.
4. Complete `site.webmanifest`: `id`, maskable icons (192, 512), `shortcuts` for Order Form and Org chart, `screenshots`.
5. `Cache-Control: no-cache` and `Service-Worker-Allowed` for `sw.js` in `vercel.json`.

---

## Phase 7: Tooling and CI

1. **Biome** (devDependency, `biome.json`). Scripts `"lint": "biome check ."`, `"format": "biome format --write ."`. Exclude `.claude/`, `brand-source/`, `docs/screenshots/`.
2. `.github/workflows/ci.yml` on push and PR: `npm ci`, `npm run check`, `npm run lint`, `npx playwright install --with-deps chromium`, `npm test`. Upload Playwright report on failure.
3. `vercel.json`: `"buildCommand": null`, `"installCommand": ""`, `"outputDirectory": "public"`.
4. `README.md`: short "For developers" section. Keep the non-developer "Update the content" section first and unchanged in tone.

---

## Phase 8: Final QA and report

With `playwright-cli open http://localhost:3000`:
1. Click every Quick Access and Tools link and confirm URLs.
2. Open every org person; check email and phone.
3. Keyboard-only pass on every route, both themes.
4. Screenshots of all routes at 1440 and 390, light and dark, into `docs/screenshots/modernize/after/`.
5. `npm run check`, `npm run lint`, `npm test` pass. Lighthouse still 95+.
6. Update `REVISION_NOTES.md` and `DESIGN.md`.
7. Open a PR with summary and before/after screenshots.

---

## Acceptance checklist

- [ ] Tools installed: design-taste-frontend, image-to-code, web-design-guidelines (+ `docs/web-interface-guidelines.md`), Playwright CLI
- [ ] `CLAUDE.md` exists and stays short
- [ ] Playwright + axe suite passes. CI runs it on every push.
- [ ] JS split into ES modules. Native `<dialog>`, View Transitions with reduced-motion fallback.
- [ ] CSS uses layers, `light-dark()` tokens, nesting, container queries. Duplicated dark-mode blocks removed.
- [ ] Font self-hosted. CSP no longer lists Google Fonts. Logos in WebP with srcset.
- [ ] Lighthouse 95+ (performance, accessibility, best practices)
- [ ] taste-skill inspector 0 FAIL. Vercel guidelines review clean.
- [ ] `data.js` still the only content file, same format. `npm run check` passes.
- [ ] No addresses or birth years. All 8 links exact. 7 people correct.
- [ ] README, DESIGN.md and REVISION_NOTES.md updated
