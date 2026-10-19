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
