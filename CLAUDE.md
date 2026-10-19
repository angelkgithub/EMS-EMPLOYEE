# MIL CITY Team Hub

Static internal site (HTML, CSS, vanilla JS) served from `public/` on Vercel. No build step.
Branch: `revamp/mil-city`. Read `REVISION_NOTES.md` and `DESIGN.md` before changing anything.

## Layout
- Hash routes in `public/index.html`: `#home`, `#tools`, `#training`, `#org`, `#rules`.
- **All content** is in `public/assets/js/data.js` (edited by non-developers; keep it simple).
- Behaviour: `assets/js/app.js`, `theme.js`. Styles: `assets/css/styles.css`. Validator: `scripts/check.mjs`.

## Ground rules
1. No framework, no required build step. Dev-only tooling goes in `devDependencies`.
2. `data.js` stays the single content file with the same field names. If its shape changes, update `scripts/check.mjs` and the README table in the same commit.
3. Keep the `ems-hub:` localStorage key prefix (renaming wipes saved progress).
4. Privacy: no home addresses or birth years. Birthdays are month and day only.
5. Keep `vercel.json` security headers working. Changing an outside source (fonts, images, scripts) means updating the CSP in the same commit.
6. Each phase ends with: `npm run check` passing, tests passing (once they exist), a commit `modernize phase N: ...`, and a note in `REVISION_NOTES.md` under "Modernization".
7. Don't read whole skill files; grep headings and read only what you need.
8. Screenshots: only `#home` and `#org`, at 1440 and 390 wide, unless a phase says otherwise.

## Commands
- `npm run dev` serve on :3000
- `npm run check` validate content
- `npm test` Playwright (after Phase 1)
- `npm run lint` Biome (after Phase 7)

Design rules: `DESIGN.md`. UI rules: `docs/web-interface-guidelines.md`. Plan: `docs/MODERNIZE_PLAN.md`.
