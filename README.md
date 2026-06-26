# fullkitmarketing.com

Static marketing site for **Full Kit Marketing** — a lean marketing consultancy for growing
service businesses. Built as a fast, dependency-light static site (Eleventy passthrough), modeled
on the structure of benbetson.us.

## Stack

- **Eleventy** (v3) — but every page is plain static HTML copied verbatim via passthrough.
  There is no templating to learn; edit the `.html` files directly.
- **Self-hosted fonts** — EB Garamond (display) + Nunito Sans (body, an Avenir substitute) in
  `fonts/`, so no third-party font requests.
- **No build-time JS framework.** `script.js` is ~100 lines of progressive enhancement
  (mobile nav, scroll-reveal, contact form).

## Structure

```
index.html              Home (hero, positioning, what we are, problem, how we work,
                        services, engagement models, who it's for, approach, FAQ, contact)
about/index.html        Rachel Beck — founder bio
services/index.html     Six core service areas + engagement models + entry points
privacy/index.html      Privacy & cookies policy
404.html                Not-found page
styles.css              All styles (brand palette + components)
script.js               Progressive enhancement
fonts/                  Self-hosted woff2 + fonts.css
favicon.svg / .png, apple-touch-icon.png, og-image.png
robots.txt, sitemap.xml, site.webmanifest, llms.txt, _headers
BRAND.md                Brand guide (voice, color, type, logo)
```

## Develop

```bash
npm install
npm run serve     # local dev server with live reload
npm run build     # outputs _site/
```

You can also just open `index.html` in a browser — the site works without a build step
(use a static server for clean `/about/` style routes).

## Deploy

Connected to **Cloudflare Pages** via GitHub — every push to `main` triggers a build
(`npm run build`) and deploys the `_site/` output. No manual upload needed.

## Before going live (TODO)

1. **Contact form** — create a free [Web3Forms](https://web3forms.com) access key for
   `rachel@fullkitmarketing.com` and replace `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html`.
   Until then, the form falls back to prompting an email to Rachel.
2. **Spam protection (optional)** — set a real Cloudflare Turnstile site key in `script.js`
   (`YOUR_TURNSTILE_SITEKEY`).
3. **Confirm the legal entity name** — pages use "Full Kit Marketing LLC"; adjust if the
   registered name differs.
4. **Founder photo** — swap the `RB` monogram placeholder in `about/index.html` for a real
   headshot (`<img class="headshot" …>`), if desired.

## Content source

Copy and positioning are drawn from the founder's source documents in `source/`
(business plan, vision, brand kit). See `BRAND.md` for the brand system.
