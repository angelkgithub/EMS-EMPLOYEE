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

### House rules
- Replaced `public/assets/docs/house-rules.pdf` with the new MIL CITY VA House Rules & Standards of Conduct. Rewrote the "At a glance" summaries in `data.js` from it (the old ones were placeholders) and set the updated date to Oct 2026.
- PDF links and the embedded viewer now add `?v=<updated>` so browsers load a replaced PDF; PDFs in `/assets/docs/` are revalidated on every load (`vercel.json`). Change `updated` in `data.js` when you replace the PDF.

### Leadership page: Campaign Advisor
- Roy Marc Caringal's title is now "Campaign Advisor" and he sits in the Operations group beside Arvin. Leadership now shows only Josh.

### Phase 3: modern CSS
- Cascade layers (`tokens, base, layout, components, utilities`); every rule lives in a layer. The Order Form card no longer needs a heavier selector, and the `!important` hacks are gone (only `[hidden]` and reduced motion keep it).
- One token set with `light-dark()` and `color-scheme` (`light dark`, overridden by `data-theme`). The three duplicated dark-mode blocks are deleted. Logo swap still hides one of two files with a small `data-theme` / `prefers-color-scheme` rule, because `<img>` sources can't use `light-dark()`.
- Native CSS nesting, container queries (tool groups, quick tiles, recordings, team cards), logical properties, `100dvh`, `text-wrap: balance` on headings and `pretty` on paragraphs.
- Removed unused rules (`.placeholder`, `.spacer`, the old `--shadow` and `--side` tokens).
- Checked: all 16 tests pass; taste-skill lint 0 FAIL (the "The team" label is a marked exception, requested by the client); screenshots of all five routes at 1440 and 390, light and dark, are pixel-identical to before the change.

### Phase 4: performance and assets
- Archivo is self-hosted as one variable woff2 (Latin subset, 90 KB, preloaded, `font-display: swap`). Google Fonts links and their `vercel.json` CSP entries are gone, so the hub no longer breaks on networks that block Google. Italics were dropped (the design doesn't use them).
- Logos are served with `<picture>`: WebP at 1x and 2x with a PNG fallback and exact `width`/`height`. `scripts/make-logo-assets.py` now writes `milcity-word-*` (142 px, top bar) and `milcity-badge-*` (180 px, 404 page). The unused stack-logo preload and the old 640/480 px PNGs were removed.
- Fixed two things Lighthouse found on phones: the search button lost its name when only the icon shows (the word is now visually hidden, not removed), and the footer jumped as the scripts filled the page (it now appears once the page is drawn, via a `ready` class on `<html>`).
- YouTube thumbnails and photos are `loading="lazy"`; the video is still a click-to-load facade.
- Lighthouse (local, headless): mobile 99 performance / 100 accessibility / 100 best practices; desktop 100 / 100 / 100; layout shift 0. No requests leave the site. 16/16 tests pass, lint 0 FAIL.

### Phase 5: design polish and the Home bento grid
- **Home is now a bento grid** (reference: Kombai "Loomline"). Layout and the oversized-numeral idea are kept; colours stay brand navy and red, and the glow and gradients were dropped because the design rules and the taste-skill check forbid them. The big tile shows real data: how many of the 5 start-here steps are done. Other tiles show real counts (4 videos and sample calls, 7 people) and the PDF update date.
- **Skyline picture:** the city scene cropped from the round badge, pale sky removed, light and dark versions, edges faded; generated by `scripts/make-logo-assets.py` (`milcity-skyline-*`). It sits in its own band tile under the greeting, never over the headline.
- **States:** hover, active, focus-visible and disabled styles added to the controls that lacked them. Fixed a bug where the focus rule rounded every focused button to 6px. Empty states for the leadership page (no people) and a missing house rules PDF; search and tool filters already had them.
- **Motion:** only transform and opacity. The progress bar now scales instead of resizing, and the accordion no longer animates its height (the text fades in). Tiles fade up with a short stagger; reduced motion switches all of it off.
- **Guidelines review** (`docs/web-interface-guidelines.md`), checked by hand against `public/`: added `touch-action: manipulation`, a tap highlight colour, `overscroll-behavior: contain` on overlays, `scroll-margin` on headings, curly quotes, `…` in placeholders, no-break spaces in "Ctrl K" and `translate="no"` on the brand name. Not applied, with reasons: keeping filters and search text in the URL and restoring scroll on Back (small internal hub, hash routes); layered shadows (the design is flat on purpose); the preconnect hint (the only outside host, the YouTube thumbnail, is used on one page).
- **Phone pass** (375 and 390): chips and audio buttons are 44px high, tiles stack to two columns where they fit, long names wrap.
- **Checks:** taste-skill inspector 0 FAIL, 1 WARN (20% of the first screen is brand navy; that is the single stat tile, kept on purpose). Lint 0 FAIL. 16/16 tests. Lighthouse mobile 99 / 100 / 100 and desktop 100 / 100 / 100, layout shift 0. Before and after screenshots: `docs/screenshots/modernize/`.

### Tools and links page
- Tool cards now follow the Kombai "Rimevane" grid-list reference: two columns (one on phones), hairline card, icon tile, name and description, a divider, then a type chip and the Open, copy and star controls. The Order Form card stays filled navy. Colours stay brand; the reference's mint palette, shadows and gradients were not used. The 1px card outline is a deliberate exception to the no-outlined-boxes rule (marked for the lint).
- Content, links and `data.js` fields are unchanged; all 8 links still match exactly.
