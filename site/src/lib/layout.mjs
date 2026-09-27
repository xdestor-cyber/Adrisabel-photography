// Assembles a page: header + <main> + footer + JSON-LD, plus the <head> used
// for the standalone preview (on WordPress, Rank Math prints the head).
import { SITE_URL, BUSINESS } from '../data/business.mjs';
import { header, footer, setCurrentPage } from './components.mjs';
import { jsonLd, businessNode, pageNodes } from './schema.mjs';
import { esc } from './html.mjs';

export const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300..700&family=Great+Vibes&display=swap';

export const fontLinks = () =>
  `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
  `<link rel="stylesheet" href="${esc(FONTS_URL)}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${esc(FONTS_URL)}"></noscript>`;

export function renderParts(ctx, page) {
  setCurrentPage(page);
  const body = page.body(ctx);
  const nodes = [page.schemaBusiness === false ? null : businessNode(ctx), ...pageNodes(page), ...(page.schema ? page.schema(ctx) : [])];
  return [
    // mark JS early so scroll-reveal styles apply before first paint
    `<script>document.documentElement.classList.add('js')</script>`,
    header(ctx, { current: page.path, minimal: page.minimalHeader }),
    // Kadence already wraps content in <main id="main">; use a plain div there
    ctx.wp ? `<div class="adr adr-main" id="adr-main">${body}</div>` : `<main class="adr adr-main" id="adr-main">${body}</main>`,
    footer(ctx, { sticky: page.sticky !== false, stickyLabel: page.stickyLabel, stickyHref: page.stickyHref }),
    jsonLd(nodes),
  ].join('\n');
}

export function previewHead(ctx, page, css) {
  const s = page.seo;
  const url = SITE_URL + page.path;
  const ogImg = s.image ? ctx.media.photo(s.image) : null;
  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(s.title)}</title>`,
    `<meta name="description" content="${esc(s.description)}">`,
    `<meta name="robots" content="${s.robots === 'noindex' ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(BUSINESS.name)}">`,
    `<meta property="og:title" content="${esc(s.ogTitle || s.title)}"><meta property="og:description" content="${esc(s.description)}"><meta property="og:url" content="${url}">`,
    ogImg ? `<meta property="og:image" content="${ogImg.src}"><meta name="twitter:card" content="summary_large_image">` : '',
    '<link rel="icon" href="/img/adrisabel-photography-logo.png">',
    fontLinks(),
    `<style>${css}</style>`,
  ].join('\n');
}
