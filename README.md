# EMS Team Hub

Internal site for East Medical Supplies employees: tools and links, training videos and call recordings, org chart, and house rules.

It is a plain static site (HTML, CSS, JavaScript). There is no build step and nothing to install, so it deploys to Vercel in about two minutes.

## What's in the folder

```
public/                     Everything the website serves
  index.html                The hub (all five pages live here)
  404.html                  Branded "page not found"
  assets/
    js/data.js              ← YOUR CONTENT. The only file you normally edit.
    js/app.js               Site behavior. Leave alone.
    css/styles.css          Design. Leave alone unless changing the look.
    img/                    Logos (light and dark versions)
    audio/                  Put the sample call MP3s here
    team/                   Put employee photos here
    docs/                   Put the house rules PDF here
vercel.json                 Vercel settings and security headers
middleware.example.js       Optional password gate (see "Keeping it private")
scripts/check.mjs           Pre-deploy checker (npm run check)
```

## Deploy to Vercel

**Option A: GitHub (recommended, so every change redeploys automatically)**

1. Create a **private** repository on GitHub and upload this whole folder.
2. Go to <https://vercel.com/new>, import the repository.
3. Leave **Framework Preset** as "Other". Don't change any build settings; `vercel.json` already sets them.
4. Click **Deploy**. You get an address like `ems-team-hub.vercel.app`.

**Option B: Vercel CLI**

```bash
npm i -g vercel
vercel          # first deploy, answer the prompts
vercel --prod   # publish to production
```

**Custom address:** Vercel project → Settings → Domains → add something like `hub.yourcompany.com` and follow the DNS instructions shown.

> Vercel's free Hobby plan is for personal, non-commercial use. A company internal tool should be on a paid plan. Check Vercel's current terms when you set up.

## Update the content

Open `public/assets/js/data.js`. Every list in it has comments explaining the fields.

| To add | Do this |
|---|---|
| A Google Sheet, Canva or app link | Paste the full `https://…` address into that tool's `url:` |
| Another tool | Copy an existing block, give it a new unique `id`, pick a `group` |
| The cold calling video | Paste the YouTube link into `youtube:` |
| Sample call recordings | Save the MP3 into `public/assets/audio/`, then set `src:"/assets/audio/your-file.mp3"` |
| Employee photos | Save into `public/assets/team/`, set `photo:"/assets/team/name.jpg"` (square, at least 200 px) |
| House rules PDF | Save into `public/assets/docs/`, set `url:"/assets/docs/house-rules.pdf"` |
| Org chart people | Edit `ORG`. Each person has `children:[ … ]` for who reports to them |

Anything you leave as `""` shows "Link not added yet" instead of a broken button, so you can publish before everything is ready.

**Before every deploy, run the checker** (needs Node.js installed):

```bash
npm run check
```

It lists what is still empty and fails if a file path is wrong or a link doesn't start with `https://`.

**Recordings:** keep MP3s small. A 5-minute call saved as mono at 64 kbps is about 2.5 MB. Use the MP3 files themselves rather than Google Drive links, because Drive links can't be played inside the page.

**Preview locally:** `npm run dev`, then open <http://localhost:3000>.

## Keeping it private

This is an employees-only site, but a website address is not a lock. Anyone who has the link can open it unless you add a gate. Pick one:

1. **Vercel Authentication or Password Protection** (Project → Settings → Deployment Protection). No code. Availability depends on your Vercel plan.
2. **The included password gate.** Rename `middleware.example.js` to `middleware.js`, add `HUB_USER` and `HUB_PASSWORD` under Settings → Environment Variables, redeploy. It is one shared password, so change it when someone leaves. Read the comments at the top of the file.
3. **Cloudflare Access or Google sign-in** in front of the site, if you need per-person accounts and the ability to remove individual people.

Whichever you choose, **also lock down the Google Sheets themselves**: set sharing to "Restricted" (or your company's Google accounts only), never "Anyone with the link". The hub only links to those sheets. Their own sharing settings are what protect the data inside them.

The site also sets `noindex` (meta tag, header and `robots.txt`) so search engines skip it.

## Security headers

`vercel.json` sends a strict Content-Security-Policy and other standard headers. If you later add something from another website, the browser will block it until you allow it there:

- Audio hosted somewhere other than this project → add the host to `media-src`
- Employee photos hosted elsewhere → add the host to `img-src`
- Videos from somewhere other than YouTube → add the host to `frame-src`

## Good to know

- **Checklists are per device.** The "New here?" steps, "Listened" boxes, starred tools and "I've read the house rules" box save in the browser only. They don't sync between devices and you can't see who ticked what. If you need a record of who acknowledged the rules, link a Google Form instead.
- **Logo:** the current file is small. Replace `public/assets/img/logo-light.png` and `logo-dark.png` with larger versions (or ask for an SVG) and it will look sharper on high-resolution screens. Keep the same file names.
- **Search shortcut:** `Ctrl K` (or `⌘ K` on Mac) opens search from any page.
- **Browsers:** current Chrome, Edge, Safari and Firefox. Dark mode follows the device setting.
