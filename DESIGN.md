# DESIGN.md: MIL CITY Team Hub

The source of truth for how the hub looks. Tokens live at the top of `public/assets/css/styles.css`, written once each as `light-dark(light, dark)`. Styles are in cascade layers, in this order: `tokens, base, layout, components, utilities`. A later layer wins, so nothing needs `!important` or a heavier selector. Component rules are nested, and tool cards, quick tiles, recordings and team cards respond to the width of their container, not the window.

## 1. Visual theme

A calm, trustworthy internal tool for a medical sales team. Navy carries the brand, pulse red is a signal, and silver stays in the logo. The pages are flat, quiet and dense enough to work from all day. The one brand moment is the logo and the ECG pulse line on the home page, which echoes the pulse in the logo.

## 2. Colour palette and roles

| Role | Light | Dark | Use |
|---|---|---|---|
| `--bg` ground | `#EEF2F7` | `#08101F` | Page background |
| `--surface` | `#FFFFFF` | `#0F1A30` | Panels, cards, the nav pill. Separated from the ground by tone, not lines |
| `--soft` | `#E8EDF5` | `#16233F` | Hover on nav pills, chips |
| `--ink` | `#0B1A33` | `#E8EDF6` | All running text |
| `--muted` | `#4A5672` | `#A3AFC7` | Secondary text only |
| `--accent` (logo navy) | `#0B2A5B` | `#9DBBF0` | Primary buttons, links, the Order Form tile |
| `--pulse` (logo red) | `#C8102E` | `#F2606B` | Focus ring, ECG line, "New" label |
| `--warn` | `#B7791F` | `#F0B44C` | "To be updated" dot |
| `--silver` | `#8C96A8` | | Reserved for the logo |

Contrast (WCAG): ink on ground 15.4:1, muted on ground 6.5:1, white on navy 14.0:1, red on white 5.9:1, dark ink on dark ground 16.2:1, dark muted 7.9:1, dark accent button 9.3:1. All pass AA.

## 3. Typography

One family: **Archivo**, self-hosted (`assets/fonts/archivo-latin.woff2`, variable weight and width, Latin subset, `display=swap`, preloaded). No outside font requests.

| Level | Size | Weight |
|---|---|---|
| Page title (`h1`, one per page) | 26–32px | 760, tracking -0.02em |
| Section title (`h2`) | 20px | 700 |
| Card title (`h3`) | 17px | 680 |
| Body | 16px, line height 1.55 | 400 |
| Caption | 13–14px | 560 |

Phone numbers and dates use tabular figures (`.num`). No italics in headings, no tracked uppercase labels.

## 4. Components

- **Buttons:** fully round. Primary = navy fill. Ghost = 1.5px outline. On a navy card, the light button (`.btn-light`). Hover darkens or tints; `:active` scales to 0.97; disabled is 50% opacity.
- **Tool cards:** two across on desktop, one on phones (reference: Kombai "Rimevane" grid list). Each card is a hairline-bordered surface with an icon tile, the tool name and a one-line description, a divider, then a type chip (plus "To be updated" when set) on the left and the Open and copy-link buttons on the right. The star pins it to Quick access. The Order Form card is filled navy (`primary:true` in data.js). Every external link opens in a new tab, says so to screen readers, and shows the external-link icon.
- **Home bento grid:** rounded tiles in a four-column grid (two on tablets and phones), from the Loomline reference but in brand colours. One oversized navy tile shows the start-here progress as a big numeral next to the greeting and the ECG line; beside it sit Quick access, a skyline band, the steps checklist and three link tiles (Training, Leadership, House rules) that stack to the height of the checklist. The reference's emerald glow and gradients were not used: tiles are flat, in line with section 7.
- **Quick-access tiles:** tone step inside the panel, two columns. Real links, so middle-click and copy link work.
- **Status labels:** a coloured dot plus text, never colour alone. "To be updated" (amber dot) and "New" (red, automatic for 30 days after a start date).
- **Leadership team cards:** a scrolling page of photo cards grouped by department (Leadership, Operations, Sales), four across on desktop and two on phones. No photo yet shows a neutral silhouette. Hover or keyboard focus shows a summary panel (email, phone, birthday, start date) over the picture; click or tap opens the drawer with Email and Call buttons.
- **Inputs:** 1.5px outline, navy focus ring.
- **Nav:** a top bar with the wordmark left, a rounded pill track in the middle (five links, the current page filled navy) and Search and theme buttons right. There is no sidebar. On phones the pill becomes a menu popover opened from the menu button.

## 5. Layout and spacing

Content max-width 1200px . Side padding 20–48px. Spacing steps 4 / 8 / 12 / 16 / 24 / 32 / 40px. Radii: 8px small, 14px cards, 22px panels.

## 6. Depth

No shadows on anything at rest. Only real overlays (person drawer, search dialog, mobile menu) cast a shadow. Surfaces separate by tone.

## 7. Do and don't

Do: navy for actions, red only as a signal, flat colour, full-ink body text, labels with words.
Don't: gradients, glass or blur, emoji, icon chips in tinted squares, 1px outlined boxes, more than one typeface, em-dash heavy copy.

## 8. Responsive

Breakpoints 1060 (home goes to one column), 900 (sidebar becomes a drawer), 760 (leadership cards stay two across), 560 (tool cards go single column). Touch targets 44px minimum. Checked at 375, 390, 768, 1024 and 1440 with no sideways scrolling.

## 9. Logo usage

| File (`public/assets/brand/`) | Where |
|---|---|
| `milcity-stack-*.png` (MC monogram over the wordmark) | Sidebar |
| `milcity-word-*.png` (MIL + CITY wordmark) | Phone top bar, OG image |
| `milcity-badge-*.png` (circular skyline badge) | 404 page |
| Cross mark | Favicon and app icons |

Each has a `-light` (navy, for light backgrounds) and `-dark` (white, for dark mode) version.
