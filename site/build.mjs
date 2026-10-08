#!/usr/bin/env node
// Builds the site.
//   node site/build.mjs            -> dist/preview/**/index.html (standalone, for local review)
//   node site/build.mjs --wp       -> dist/wp/{pages,patterns}.json (content for deploy.mjs;
//                                     needs deploy/state.json with uploaded media URLs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import sharp from 'sharp';
import { createMedia, IMG_MANIFEST, PREVIEW_WIDTHS } from './src/lib/media.mjs';
import { renderParts, previewHead, fontLinks } from './src/lib/layout.mjs';
import { PAGES } from './src/pages/index.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const WP = process.argv.includes('--wp');
const DIST = path.join(ROOT, 'dist', WP ? 'wp' : 'preview');
const si = process.argv.indexOf('--state');
const STATE = si > 0 ? path.resolve(process.argv[si + 1]) : path.join(ROOT, 'deploy', 'state.json');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const css = (await esbuild.transform(read('src/styles/site.css'), { loader: 'css', minify: true, target: ['chrome100', 'safari15', 'firefox100'] })).code.trim();
const siteJs = (await esbuild.transform(read('src/scripts/site.js'), { loader: 'js', minify: true, target: 'es2018' })).code.trim();
const bookingJs = (await esbuild.transform(read('src/scripts/booking.js'), { loader: 'js', minify: true, target: 'es2018' })).code.trim();

const deploy = WP ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : null;
// WordPress' content filters misread "<" inside inline <script> (turning "&&" into "&#038;&"),
// so on WordPress the scripts are shipped as base64 data: URIs, which contain neither "<" nor "&".
const scriptTag = (code, id) => `<script${id ? ` id="${id}"` : ''} src="data:text/javascript;base64,${Buffer.from(code).toString('base64')}"></script>`;
const media = createMedia(WP ? 'wp' : 'preview', deploy);
const ctx = { media, wp: WP };

// sanity: unique paths/slugs, and unique SEO titles/descriptions on indexable pages
const seen = new Set();
const seo = { title: new Map(), description: new Map() };
for (const p of PAGES) {
  if (seen.has(p.path)) throw new Error(`duplicate path ${p.path}`);
  seen.add(p.path);
  if (p.seo.robots === 'noindex') continue;
  for (const k of ['title', 'description']) {
    const other = seo[k].get(p.seo[k]);
    if (other) throw new Error(`duplicate SEO ${k} on ${other} and ${p.path}: ${p.seo[k]}`);
    seo[k].set(p.seo[k], p.path);
  }
}

fs.mkdirSync(DIST, { recursive: true });

if (!WP) {
  // images: masters + responsive widths
  const imgDir = path.join(DIST, 'img');
  const artDir = path.join(DIST, 'art');
  fs.mkdirSync(imgDir, { recursive: true });
  fs.mkdirSync(artDir, { recursive: true });
  for (const [key, m] of Object.entries(IMG_MANIFEST)) {
    const src = path.join(ROOT, m.art ? 'assets/art' : 'assets/img', m.file);
    fs.copyFileSync(src, path.join(m.art ? artDir : imgDir, m.file));
    if (m.png) fs.copyFileSync(path.join(ROOT, 'assets/img', m.png), path.join(imgDir, m.png));
    if (m.art || key === 'logo') continue;
    for (const w of PREVIEW_WIDTHS) {
      if (w >= m.width) continue;
      const out = path.join(imgDir, m.file.replace(/\.webp$/, `-${w}.webp`));
      if (!fs.existsSync(out)) await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(out);
    }
  }
  for (const page of PAGES) {
    const parts = renderParts(ctx, page);
    const doc = `<!doctype html>\n<html lang="en-US">\n<head>\n${previewHead(ctx, page, css)}\n</head>\n<body>\n${parts}\n<script>${siteJs}</script>${page.booking ? `\n<script>${bookingJs}</script>` : ''}\n</body>\n</html>\n`;
    const dir = path.join(DIST, page.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), doc);
  }
  console.log(`preview: ${PAGES.length} pages -> ${path.relative(process.cwd(), DIST)}`);
} else {
  // Rank Math's image sitemap lists every <img> in a page. Keep each photo once (the featured
  // image is listed first by Rank Math itself) and leave the logo out; repeats are marked
  // with Rank Math's data-sitemapexclude attribute.
  const logo = media.logo();
  const sitemapImages = (markup, featured) => {
    const seen = new Set([logo.src, logo.png, featured].filter(Boolean));
    return markup.replace(/<img\b[^>]*?\bsrc="([^"]+)"/g, (tag, src) => {
      if (seen.has(src)) return tag.replace('<img', '<img data-sitemapexclude');
      seen.add(src);
      return tag;
    });
  };
  const pages = PAGES.map((page) => {
    const parts = sitemapImages(renderParts(ctx, page), page.seo.image ? media.photo(page.seo.image).src : null);
    return {
      path: page.path,
      slug: page.wpSlug,
      title: page.wpTitle,
      parent: 0,
      front: page.path === '/',
      // wp:html blocks are output as-is (no wpautop); the shared CSS/JS live in synced patterns
      content: [
        '<!-- wp:block {"ref":__STYLES__} /-->',
        `<!-- wp:html -->\n${parts}${page.booking ? `\n${scriptTag(bookingJs, 'adr-booking-js')}` : ''}\n<!-- /wp:html -->`,
        '<!-- wp:block {"ref":__SCRIPTS__} /-->',
      ].join('\n\n'),
      excerpt: page.seo.description,
      featuredImage: page.seo.image ? IMG_MANIFEST[page.seo.image].file : null,
      seo: page.seo,
    };
  });
  const patterns = {
    styles: { title: 'Adrisabel · Site styles', content: `<!-- wp:html -->\n${fontLinks()}<style id="adr-css">${css}</style>\n<!-- /wp:html -->` },
    scripts: { title: 'Adrisabel · Site scripts', content: `<!-- wp:html -->\n${scriptTag(siteJs, 'adr-js')}\n<!-- /wp:html -->` },
  };
  fs.writeFileSync(path.join(DIST, 'pages.json'), JSON.stringify(pages, null, 1));
  fs.writeFileSync(path.join(DIST, 'patterns.json'), JSON.stringify(patterns, null, 1));
  console.log(`wp: ${pages.length} pages -> ${path.relative(process.cwd(), DIST)}/pages.json (+ patterns.json)`);
}
console.log(`css ${(css.length / 1024).toFixed(1)} KB · site.js ${(siteJs.length / 1024).toFixed(1)} KB · booking.js ${(bookingJs.length / 1024).toFixed(1)} KB`);
