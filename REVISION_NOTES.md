# MIL CITY revision notes (Oct 2026)

Branch `revamp/mil-city`. The stack is unchanged: a static HTML, CSS and JavaScript site deployed from `public/` on Vercel.

## What changed

**Brand**
- EMS / East Medical Supplies is now **MIL CITY Medical** in every title, meta tag, the manifest, the 404 page, the README, the password-gate text and the page copy.
- The new logo sheet is saved in `brand-source/` and cropped into three lockups, each in a light and a dark version (`public/assets/brand/`). New favicon, app icons, Apple touch icon and a 1200×630 share image (`og-image.png`).
- Colours re-tuned to the new logo (navy `#0B2A5B`, pulse red `#C8102E`). See `DESIGN.md`.

**Links** (all in `public/assets/js/data.js`)

| Group | Link | Note |
|---|---|---|
| Daily work | Main Sheet | **Label is a guess.** The link came without a name and the sheet is private |
| Daily work | Leads Sheet | |
| Daily work | Order Form | Navy "main action" card |
| Daily work | Order Sheet | |
| Reference | Bible | |
| Reference | OTC List | Shows "To be updated" |
| Reference | GLP-1 List | Shows "To be updated" |
| Team | Contact Information | |

Removed because they weren't in the new list: GoHighLevel, Order Form Responses: James, Payment Tracker, and the Bible's Canva and PDF versions. Each one can be put back by adding a block in `data.js`.

Starred tools now use a new saved key (`pins-v2`), so everyone starts with the four Daily work links pinned.

**Org chart**
- Robert James (Owner) and Fredrick James (Co-Owner) are kept exactly as they were.
- Arvin Jay Q. Romero, Operations Manager (OM), with "Team Leader" shown as his designation.
- Four Sales Representatives report to Arvin: Shermalyn Salih, John Saqlain Dela Cruz, Krystal Mae Cordovilla, Victor Faustin G. Munar.
- All previous staff were removed, and so was the separate "Sales team" section. The reps now sit in the chart.
- Cards show a "New" label for 30 days after someone's start date. The drawer adds phone (tap to call), Email and Call buttons.

**Privacy**
- Home addresses are not stored anywhere in the site. They stay in the Contact Information sheet.
- New entries store birthdays as month and day only. The page shows month and day for everyone.

**Design** (taste-skill audit, before and after in `docs/screenshots/`)
- Removed: the italic oversized title, the backdrop blur, resting shadows, 1px outlined boxes, tinted icon squares, and the gradient on the video placeholder.
- Fixed: an invisible overlay sat on top of the page title, so it was hidden from assistive tools. App-sized titles. Equal-height cards in the quick-access panel and the org chart. Org cards now fill the width on phones.
- Added: a footer, accessible "opens in a new tab" text on external links, and `rel="noopener noreferrer"`.

## Checks run

- `npm run check`: no broken links or missing files.
- taste-skill `lint.mjs`: 0 FAIL. The one warning is the audio player's `m:ss` clock, which is correct.
- Playwright CLI: all 8 links match exactly. 7 people, each email and phone link correct. No address or birth-year text in the page or the data file. No old brand text. No sideways scrolling at 375, 768 or 1024px. One `h1` per page. The only console errors are Google Fonts and a YouTube thumbnail being blocked by the test machine's network.

## Left as is, on purpose

- localStorage keys still start with `ems-hub:`. Renaming them would wipe everyone's checklist, starred tools and theme choice. Nobody sees them.
- `public/assets/docs/house-rules.pdf` is the existing file. If it still says EMS, replace it.
- The sample-call recordings and the house-rules summaries are still placeholders, as before.

## Open questions

1. What is the real name of the "Main Sheet"? Change `name:` for `id:"main"` in `data.js`.
2. Should GoHighLevel or the Payment Tracker come back?
3. Photos for the team: save them in `public/assets/team/` and set `photo:`.

## Modernization

### Phase 0: tools and CLAUDE.md
- Installed the design-taste-frontend, image-to-code, web-design-guidelines and playwright-cli skills. Saved `docs/web-interface-guidelines.md` and `docs/MODERNIZE_PLAN.md`. Added `CLAUDE.md`.
- `full-output-enforcement` did not install; nothing later depends on it.

### Phase 1: automated tests
- Added Playwright and axe (`npm test`, `tests/hub.spec.js`, `playwright.config.js`). 16 tests cover links, org chart, privacy, brand, layout, keyboard, dark mode and accessibility in both themes.
- First run found one real accessibility issue: the search button's `aria-label` did not match its visible text. Removed the label so the visible text names the button.
- First run of Chromium needs `npx playwright install chromium`.

### Phase 2: modern JavaScript, and a new top nav
- Removed the sidebar. The five links are now a rounded pill nav in the top bar (current page filled navy). On phones it is a native `popover` opened from the menu button. The "employees only" notice moved to the footer.
- `app.js` is gone. Behaviour is split into ES modules in `public/assets/js/`: `main.js` (entry), `router.js`, `home.js`, `tools.js`, `training.js`, `org.js`, `rules.js`, `search.js`, `nav.js`, plus `store.js` (reads `window.MILCITY_DATA`, saved state) and `util.js` (shared helpers; not in the plan's list). `data.js` and `theme.js` are unchanged.
- The search palette and person drawer are native `<dialog>` elements (`showModal()`): focus trap, Escape and inert background are built in, and the hand-written scrim/inert/focus-return code is deleted. The slide-in uses `@starting-style` and `transition-behavior: allow-discrete`.
- Page changes use `document.startViewTransition`, with an instant switch when it is unsupported or reduced motion is on.
- Click wiring uses one delegated listener per section (`data-action`). `esc()` still wraps every value from `data.js`.
- Tests updated for the new markup (dialog `open` attribute, popover menu). 16/16 pass, console clean.

### Org chart redesign
- Replaced the connector-line tree with a scrolling page of photo cards, grouped by `dept` (Leadership, Operations, Sales) in the order they appear in `data.js`. Hover or focus shows a summary over the picture; click or tap opens the drawer.
- Cards without a photo show a silhouette. Add pictures in `/assets/team/` and set the `photo` field.
- Added Roy Marc Caringal (Director) between the owners and the Operations Manager: email, phone and birthday (month and day only). His home address and birth year were left out on purpose (privacy rule); the address stays in the Contact Information sheet.
- Now 8 people: 2 owners, 1 director, 1 operations manager, 4 sales representatives. Tests updated.

### Leadership team page
- Removed Fredrick James. Robert James is now "Josh", Owner (birthday and origin cleared; add his full name and details in `data.js`).
- The Org chart page is now titled "Our Leadership Team" (centered heading with a small "The team" label). The nav link and search say "Leadership". Now 7 people; tests updated.

### App icon and name
- App icon (favicon, home screen, installed app, Apple touch icon) is now the round skyline badge on a white rounded square, generated by `scripts/make-logo-assets.py`.
- Name: "MIL CITY Team Hub" everywhere; the short label under the icon is "MIL CITY Hub" (`short_name` in `site.webmanifest`, `apple-mobile-web-app-title`).
