# adrisabel.com — website source

The complete adrisabel.com website: 31 pages generated from one set of data files and deployed to WordPress (Kadence theme + Rank Math) over the REST API. The design follows the mobile-first `baby-photography-book` landing page and the storybook look of the "Once Upon a Tiny Time" promo video (same package names and illustrations; prices are not shown on the site).

```
site/
  src/data/        business facts, packages, reviews, FAQs, cities, photo registry   ← edit content here
  src/pages/       page templates (home, pricing, services, general pages, 14 city pages, /sitemap/)
  src/lib/         components, layout, JSON-LD schema, llms.txt content, image resolver, generated SVG art
  src/styles/      site.css (design system, everything scoped under .adr)
  src/scripts/     site.js (menu, reveal, FAQ) · booking.js (booking request → Formspree + GTM)
  assets/img/      optimized WebP photo masters + manifest.json   (made by tools/images.mjs)
  assets/art/      watercolor washes from the video
  tools/           images.mjs · extract-art.mjs · qa.mjs · a11y.mjs · test-booking.mjs · local-wp.sh
  deploy/          state.<host>.json (uploaded media/page IDs) · backups/ (page content before each deploy)
  build.mjs        → dist/preview (standalone pages) or dist/wp (WordPress payloads)
  deploy.mjs       → pushes media, CSS/JS patterns, pages, SEO meta, sitemap + llms.txt settings; verifies
```

## Everyday commands

```bash
npm install
node site/build.mjs                                   # build the local preview
python3 -m http.server 8090 --directory site/dist/preview   # open http://127.0.0.1:8090
node site/tools/qa.mjs                                # 1×H1, links, images, overflow, console errors (390 + 1440 px)
node site/tools/a11y.mjs                              # axe-core WCAG AA scan
node site/tools/test-booking.mjs                      # walks the booking form (submission intercepted)

# deploy (Application Password from wp-admin → Users → Profile)
WP_URL=https://adrisabel.com WP_USER=<user> WP_APP_PASSWORD='xxxx xxxx xxxx xxxx xxxx xxxx' node site/deploy.mjs --dry-run
WP_URL=https://adrisabel.com WP_USER=<user> WP_APP_PASSWORD='…' node site/deploy.mjs
```

`deploy.mjs` backs up every page first (`site/deploy/backups/…/pages.json`), uploads only new images, updates pages by slug (pages whose content didn't change are left alone, so their sitemap `lastmod` stays true), sets Kadence layout meta (theme header/footer/title off, full width), writes Rank Math title/description/focus keyword/robots/OG image, sets the site title/tagline, applies the sitemap/llms.txt settings below, flushes the GoDaddy cache and checks every live page, the XML sitemap, `llms.txt` and `robots.txt`. `--force` re-saves every page.

## Editing content

| Change | File |
|---|---|
| Package contents, add-ons, booking policy | `src/data/packages.mjs` |
| Phone, email, Instagram, hours, Google profile | `src/data/business.mjs` |
| Reviews (quoted from Google) | `src/data/reviews.mjs` |
| FAQs (and which pages show them) | `src/data/faqs.mjs` |
| City pages copy | `src/data/cities.mjs` |
| Photos: add to `src/data/images.mjs`, then `node site/tools/images.mjs` | |
| SEO titles/descriptions | the `seo` block at the top of each page in `src/pages/` |

## How it sits in WordPress

- Each page's content is: synced pattern **"Adrisabel · Site styles"** (fonts + CSS) → one Custom HTML block (header, page, footer, JSON-LD) → synced pattern **"Adrisabel · Site scripts"**. Updating CSS/JS updates every page at once.
- Kadence's own header, footer and page title are switched off per page, so the site header/footer come from this code.
- Rank Math still prints `<title>`, meta description, canonical, Open Graph, the sitemap and its WebPage/Breadcrumb schema; the pages add LocalBusiness, Service/Offer (no prices) and FAQPage JSON-LD.
- The booking form posts to Formspree (`formspree.io/f/mqewajoa`) and pushes `form_submit_success` / `booking_request` to the GTM dataLayer, same as before, for Google Ads conversions. Call, email and Instagram clicks also push `contact_click`.
- Ad landing pages `/baby-photography-book/` and `/baby-photography-sessions/` keep their URLs and are `noindex` so they don't compete with the home page.

## Sitemaps

- **XML sitemap** — `https://adrisabel.com/sitemap_index.xml` (Rank Math, listed in `robots.txt`). Every indexable page with its photos (image sitemap); the noindex pages (`/baby-photography-book/`, `/baby-photography-sessions/`, `/privacy-policy/`) are left out. The build marks repeated photos and the logo with `data-sitemapexclude`, so each page lists each photo once, with its featured image first.
- **Why it used to go stale:** Rank Math caches the sitemap and only clears that cache from wp-admin/cron, never on REST API saves. `deploy.mjs` saves Rank Math's sitemap settings on every run (`/rankmath/v1/updateSettings`), and that save clears the cache. To refresh it by hand: Rank Math → Sitemap Settings → Save Changes.
- **HTML site map** — `/sitemap/` (`src/pages/sitemap.mjs`), linked from the footer. The build fails if an indexable page is missing from it.
- **llms.txt** — Rank Math's "LLMS Txt" module with curated content from `src/lib/llms.mjs` (business facts, sessions, packages, city pages, top FAQs) for AI assistants. On GoDaddy the `/llms.txt` address is claimed by the host's own llms.txt feature (currently off, so it answers 404); Rank Math's version is served at `https://adrisabel.com/?llms_txt=1`.
- **IndexNow** — Rank Math's Instant Indexing module notifies Bing, Yandex and others whenever a page is published or updated. Google reads the XML sitemap; submit it once in Google Search Console (Sitemaps → `sitemap_index.xml`).

