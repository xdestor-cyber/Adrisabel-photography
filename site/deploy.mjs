#!/usr/bin/env node
// Deploys the site to WordPress through the REST API (Application Password).
//
//   WP_URL=https://adrisabel.com WP_USER=... WP_APP_PASSWORD='xxxx xxxx ...' node site/deploy.mjs [options]
//   node site/deploy.mjs --creds path/to/credentials.json [options]      ({"url","user","appPassword"})
//
// Options
//   --dry-run        show what would change, write nothing
//   --only a,b       only these page slugs (media/patterns still synced)
//   --skip-media     don't upload/check media
//   --no-flush       don't flush the GoDaddy cache at the end
//   --no-backup      skip the backup of current page content
//   --force          re-save pages even when nothing changed (bumps their sitemap lastmod)
//
// Steps: backup pages -> upload/update media (alt text, titles) -> build with
// real media URLs -> upsert synced patterns (CSS/JS) -> Rank Math modules
// (sitemap, llms.txt, IndexNow) -> upsert changed pages (content, Kadence
// layout meta, featured image) -> Rank Math SEO meta -> site settings ->
// XML sitemap + llms.txt settings (this also clears Rank Math's sitemap cache)
// -> flush cache -> verify live pages, sitemap, llms.txt and robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { IMG_MANIFEST } from './src/lib/media.mjs';
import { PHOTOS, LOGO } from './src/data/images.mjs';
import { BUSINESS } from './src/data/business.mjs';
import { PAGES } from './src/pages/index.mjs';
import { llmsContent } from './src/lib/llms.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const opt = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const DRY = flag('--dry-run');
const ONLY = opt('--only') ? opt('--only').split(',') : null;

let creds = { url: process.env.WP_URL, user: process.env.WP_USER, appPassword: process.env.WP_APP_PASSWORD };
if (opt('--creds')) creds = JSON.parse(fs.readFileSync(opt('--creds'), 'utf8'));
if (!creds.url || !creds.user || !creds.appPassword) {
  console.error('Missing credentials: set WP_URL, WP_USER, WP_APP_PASSWORD or pass --creds file.json');
  process.exit(1);
}
const BASE = creds.url.replace(/\/$/, '');
const HOST = new URL(BASE).host.replace(/[:]/g, '_');
const AUTH = 'Basic ' + Buffer.from(`${creds.user}:${creds.appPassword.replace(/\s+/g, ' ')}`).toString('base64');
const STATE_FILE = path.join(ROOT, 'deploy', `state.${HOST}.json`);
fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : { media: {}, patterns: {}, pages: {} };
const saveState = () => { if (!DRY) fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 1) + '\n'); };
const log = (...a) => console.log(...a);

async function wp(method, route, body, { raw = false, headers = {}, ok = [200, 201] } = {}) {
  const url = route.startsWith('http') ? route : `${BASE}/wp-json${route}`;
  const init = { method, headers: { Authorization: AUTH, Accept: 'application/json', ...headers } };
  if (body !== undefined) {
    if (raw) init.body = body;
    else { init.body = JSON.stringify(body); init.headers['Content-Type'] = 'application/json'; }
  }
  for (let attempt = 1; ; attempt++) {
    let res;
    try { res = await fetch(url, init); } catch (e) {
      if (attempt < 4) { await new Promise((r) => setTimeout(r, 2000 * attempt)); continue; }
      throw e;
    }
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    if (!ok.includes(res.status)) {
      if (res.status >= 500 && attempt < 4) { await new Promise((r) => setTimeout(r, 2000 * attempt)); continue; }
      const msg = typeof data === 'object' ? `${data.code || ''} ${data.message || ''}` : String(data).slice(0, 300);
      throw new Error(`${method} ${route} -> ${res.status} ${msg}`);
    }
    return { data, res };
  }
}

// ------------------------------------------------------------------ auth check
const me = (await wp('GET', '/wp/v2/users/me?context=edit')).data;
log(`✓ authenticated as ${me.slug} (${(me.roles || []).join(', ')}) on ${BASE}`);
if (!(me.capabilities?.unfiltered_html || (me.roles || []).includes('administrator'))) {
  console.warn('! this user may lack unfiltered_html — <style>/<script> in content could be stripped');
}

// ------------------------------------------------------------------ backup
async function allPages() {
  const out = [];
  for (let page = 1; ; page++) {
    const { data, res } = await wp('GET', `/wp/v2/pages?context=edit&per_page=100&page=${page}&status=publish,draft,private,pending,future`);
    out.push(...data);
    if (page >= +(res.headers.get('x-wp-totalpages') || 1)) break;
  }
  return out;
}
const existing = await allPages();
const bySlug = Object.fromEntries(existing.map((p) => [p.slug, p]));
if (!flag('--no-backup')) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dir = path.join(ROOT, 'deploy', 'backups', `${HOST}-${stamp}`);
  if (!DRY) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'pages.json'), JSON.stringify(existing.map((p) => ({
      id: p.id, slug: p.slug, status: p.status, title: p.title.raw, content: p.content.raw, excerpt: p.excerpt.raw,
      meta: p.meta, featured_media: p.featured_media, template: p.template, parent: p.parent, menu_order: p.menu_order,
    })), null, 1));
    try {
      const rm = {};
      for (const p of existing) rm[p.id] = await rankMathGet(p.id);
      fs.writeFileSync(path.join(dir, 'rankmath.json'), JSON.stringify(rm, null, 1));
    } catch { /* optional */ }
    // Rank Math's own settings (sitemap, llms.txt…) — kept locally, not committed (see .gitignore)
    try {
      const { data } = await wp('POST', '/rankmath/v1/status/exportSettings', { panels: ['general', 'titles', 'sitemap'] });
      fs.writeFileSync(path.join(dir, 'rankmath-settings.json'), typeof data === 'string' ? data : JSON.stringify(data));
    } catch { /* optional */ }
  }
  log(`✓ backup of ${existing.length} pages -> ${path.relative(process.cwd(), dir)}`);
}

// ------------------------------------------------------------------ media
function mediaJobs() {
  const jobs = [];
  for (const [key, m] of Object.entries(IMG_MANIFEST)) {
    if (key === 'logo') {
      jobs.push({ file: m.file, src: path.join(ROOT, 'assets/img', m.file), alt: LOGO.alt, title: 'Adrisabel Photography logo' });
      jobs.push({ file: m.png, src: path.join(ROOT, 'assets/img', m.png), alt: LOGO.alt, title: 'Adrisabel Photography logo' });
    } else if (m.art) {
      jobs.push({ file: m.file, src: path.join(ROOT, 'assets/art', m.file), alt: '', title: `Watercolor wash (${key.replace('wash-', '')})` });
    } else {
      const p = PHOTOS[key];
      jobs.push({ file: m.file, src: path.join(ROOT, 'assets/img', m.file), alt: p.alt, title: p.alt.split(/[,—]/)[0].trim(), caption: '', description: `${p.alt}. Photographed by ${BUSINESS.name}, newborn & baby photographer in McAllen, TX.` });
    }
  }
  return jobs;
}
const mime = (f) => (f.endsWith('.png') ? 'image/png' : f.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
function record(file, d) {
  const sizes = Object.entries(d.media_details?.sizes || {}).filter(([k]) => k !== 'full')
    .map(([name, s]) => ({ name, w: s.width, h: s.height, url: s.source_url }));
  state.media[file] = { id: d.id, url: d.source_url, width: d.media_details?.width, height: d.media_details?.height, sizes };
}
if (!flag('--skip-media')) {
  let up = 0, kept = 0;
  for (const j of mediaJobs()) {
    const cached = state.media[j.file];
    if (cached) {
      // still there?
      try { const { data } = await wp('GET', `/wp/v2/media/${cached.id}?context=edit`); record(j.file, data); kept++; continue; } catch { delete state.media[j.file]; }
    }
    const stem = j.file.replace(/\.[a-z]+$/, '');
    const found = (await wp('GET', `/wp/v2/media?search=${encodeURIComponent(stem)}&per_page=20&context=edit`)).data
      .find((d) => d.source_url.split('/').pop() === j.file);
    if (found) { record(j.file, found); kept++; continue; }
    if (DRY) { log(`  would upload ${j.file}`); continue; }
    const { data } = await wp('POST', '/wp/v2/media', fs.readFileSync(j.src), {
      raw: true, headers: { 'Content-Type': mime(j.file), 'Content-Disposition': `attachment; filename="${j.file}"` },
    });
    const { data: upd } = await wp('POST', `/wp/v2/media/${data.id}`, { alt_text: j.alt, title: j.title, caption: j.caption || '', description: j.description || '' });
    record(j.file, upd);
    up++;
    log(`  ↑ ${j.file} (#${data.id}, ${state.media[j.file].sizes.length} sizes)`);
  }
  saveState();
  log(`✓ media: ${up} uploaded, ${kept} already present`);
}

// ------------------------------------------------------------------ build with real URLs
const stateForBuild = DRY ? path.join(ROOT, 'dist', `state.${HOST}.dry.json`) : STATE_FILE;
if (DRY) { fs.mkdirSync(path.dirname(stateForBuild), { recursive: true }); fs.writeFileSync(stateForBuild, JSON.stringify(state)); }
execFileSync(process.execPath, [path.join(ROOT, 'build.mjs'), '--wp', '--state', stateForBuild], { stdio: 'inherit' });
const built = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/wp/pages.json'), 'utf8'));
const patterns = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/wp/patterns.json'), 'utf8'));

// ------------------------------------------------------------------ synced patterns (shared CSS / JS)
for (const [key, pat] of Object.entries(patterns)) {
  let id = state.patterns[key];
  if (id) { try { await wp('GET', `/wp/v2/blocks/${id}?context=edit`); } catch { id = null; } }
  if (!id) {
    const hit = (await wp('GET', `/wp/v2/blocks?search=${encodeURIComponent(pat.title)}&context=edit&per_page=20`)).data.find((b) => b.title.raw === pat.title);
    id = hit?.id || null;
  }
  if (DRY) { log(`  would ${id ? 'update' : 'create'} pattern ${pat.title}`); state.patterns[key] = id || 0; continue; }
  const body = { title: pat.title, content: pat.content, status: 'publish' };
  const { data } = id ? await wp('POST', `/wp/v2/blocks/${id}`, body) : await wp('POST', '/wp/v2/blocks', body);
  state.patterns[key] = data.id;
  log(`✓ pattern "${pat.title}" #${data.id} (${(pat.content.length / 1024).toFixed(1)} KB)`);
}
saveState();

// ------------------------------------------------------------------ Rank Math
async function rankMathGet(id) {
  // Rank Math stores its fields as post meta; read what REST exposes (may be empty)
  const { data } = await wp('GET', `/wp/v2/pages/${id}?context=edit&_fields=id,meta`);
  return data.meta || {};
}
async function rankMathSet(id, seo, imageFile) {
  const meta = {
    rank_math_title: seo.title,
    rank_math_description: seo.description,
    rank_math_focus_keyword: seo.focus,
    rank_math_robots: seo.robots === 'noindex' ? ['noindex'] : ['index'],
    rank_math_facebook_title: seo.title.replace(/ \| .*$/, ''),
    rank_math_facebook_description: seo.description,
    rank_math_twitter_use_facebook: 'on',
    // pages aren't blog posts: drop Rank Math's default Article schema (our JSON-LD describes the business)
    rank_math_rich_snippet: 'off',
  };
  const img = imageFile && state.media[imageFile];
  if (img) { meta.rank_math_facebook_image = img.url; meta.rank_math_facebook_image_id = img.id; }
  if (DRY) return;
  await wp('POST', '/rankmath/v1/updateMeta', { objectType: 'post', objectID: id, meta });
}
// Rank Math's settings screen endpoint. Every save fires `rank_math/settings/after_save`,
// which is the only hook that clears its XML sitemap cache outside wp-admin: REST page
// updates don't (its cache watcher only loads in admin/cron), so the sitemap went stale.
async function rankMathSettings(type, settings, fieldTypes = {}) {
  const { data } = await wp('POST', '/rankmath/v1/updateSettings', { type, settings, fieldTypes, updated: [], isReset: false });
  if (typeof data === 'string') throw new Error(`Rank Math ${type} settings: ${data}`);
  return data;
}
async function rankMathExport(panel) {
  const { data } = await wp('POST', '/rankmath/v1/status/exportSettings', { panels: [panel] });
  return (typeof data === 'string' ? JSON.parse(data) : data)[panel] || {};
}
const fetchText = async (url) => {
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, redirect: 'manual' });
  return { status: res.status, type: res.headers.get('content-type') || '', text: await res.text() };
};

// ------------------------------------------------------------------ Rank Math modules
// XML sitemap, llms.txt (a site map for AI assistants) and Instant Indexing (IndexNow:
// tells Bing, Yandex & co. right away when a page is published or changed).
if (!DRY && !ONLY) {
  // ask WordPress directly (?llms_txt=1): a request for /llms.txt itself can leave a 301/404
  // in the host's CDN cache for a month
  const llmsOn = (await fetchText(`${BASE}/?llms_txt=1&v=${Date.now()}`)).type.startsWith('text/plain');
  let indexNowOn = true;
  try { await wp('POST', '/rankmath/v1/in/getLog', { filter: 'all' }); } catch { indexNowOn = false; }
  for (const [module, on] of [['sitemap', true], ['llms-txt', llmsOn], ['instant-indexing', indexNowOn]]) {
    if (module === 'sitemap' || !on) await wp('POST', '/rankmath/v1/saveModule', { module, state: 'on' });
    if (!on) log(`✓ Rank Math module "${module}" switched on`);
  }
  // submit pages (and future posts) automatically whenever they are published or updated
  await wp('POST', '/rankmath/v1/updateSettings', { type: 'instant-indexing', settings: { bing_post_types: ['post', 'page'] }, isReset: false });
  log('✓ Rank Math modules: sitemap, llms.txt, instant indexing (IndexNow on publish/update)');
}

// ------------------------------------------------------------------ pages
const KADENCE = {
  _kad_post_transparent: 'disable', _kad_post_title: 'hide', _kad_post_layout: 'fullwidth',
  _kad_post_content_style: 'unboxed', _kad_post_vertical_padding: 'hide', _kad_post_feature: 'hide',
  _kad_post_header: true, _kad_post_footer: true,
};
const results = [];
for (const p of built) {
  if (ONLY && !ONLY.includes(p.slug)) continue;
  const content = p.content.replace('__STYLES__', state.patterns.styles).replace('__SCRIPTS__', state.patterns.scripts);
  const cur = bySlug[p.slug];
  const body = {
    title: p.title, slug: p.slug, status: 'publish', content, excerpt: p.excerpt,
    meta: KADENCE, featured_media: p.featuredImage && state.media[p.featuredImage] ? state.media[p.featuredImage].id : 0,
    comment_status: 'closed', ping_status: 'closed',
  };
  // Untouched pages aren't re-saved, so their "last modified" (the sitemap <lastmod>) stays
  // honest and IndexNow is only pinged for pages that really changed.
  const unchanged = cur && !flag('--force') && cur.status === 'publish' && cur.content.raw === content && cur.title.raw === body.title
    && cur.featured_media === body.featured_media && Object.entries(KADENCE).every(([k, v]) => cur.meta?.[k] === v);
  if (DRY) { log(`  would ${unchanged ? 'keep' : cur ? 'update' : 'create'} ${p.path} (${(content.length / 1024).toFixed(0)} KB)`); continue; }
  const data = unchanged ? cur : (cur ? await wp('POST', `/wp/v2/pages/${cur.id}`, body) : await wp('POST', '/wp/v2/pages', body)).data;
  state.pages[p.path] = data.id;
  await rankMathSet(data.id, p.seo, p.featuredImage);
  results.push({ path: p.path, id: data.id, link: data.link, created: !cur, changed: !unchanged, index: p.seo.robots !== 'noindex' });
  log(`  ${unchanged ? '=' : cur ? '↻' : '+'} ${p.path} #${data.id}`);
}
saveState();
log(`✓ pages: ${results.filter((r) => r.changed).length} updated, ${results.filter((r) => !r.changed).length} unchanged`);

// ------------------------------------------------------------------ settings
if (!DRY && !ONLY) {
  const home = state.pages['/'];
  const settings = { title: BUSINESS.name, description: 'Newborn, Baby & Family Photographer in McAllen, TX', show_on_front: 'page' };
  if (home) settings.page_on_front = home;
  await wp('POST', '/wp/v2/settings', settings);
  log('✓ settings (title, tagline, front page)');
}

// ------------------------------------------------------------------ XML sitemap + llms.txt
const noindexIds = built.filter((p) => p.seo.robots === 'noindex').map((p) => state.pages[p.path]).filter(Boolean);
if (!DRY && !ONLY) {
  // pages with their photos (image sitemap); noindex landing/privacy pages left out
  await rankMathSettings('sitemap', {
    include_images: 'on', include_featured_image: 'on', pt_page_sitemap: 'on', pt_attachment_sitemap: 'off',
    exclude_posts: noindexIds.join(','),
  });
  // llms.txt: a curated list instead of Rank Math's auto-generated page excerpts
  const llms = llmsContent(PAGES, BASE);
  const general = await rankMathExport('general');
  const settings = { llms_post_types: [], llms_taxonomies: [], llms_summary: llms.summary, llms_extra_content: llms.extra };
  const fieldTypes = { llms_post_types: 'checkbox', llms_taxonomies: 'checkbox', llms_summary: 'textarea', llms_extra_content: 'textarea' };
  // echo the analytics e-mail report options so Rank Math doesn't reschedule those reports
  if ('console_email_reports' in general) { settings.console_email_reports = general.console_email_reports === 'on' || general.console_email_reports === true; fieldTypes.console_email_reports = 'toggle'; }
  if ('console_email_frequency' in general) { settings.console_email_frequency = general.console_email_frequency; fieldTypes.console_email_frequency = 'select'; }
  await rankMathSettings('general', settings, fieldTypes);
  log(`✓ Rank Math: image sitemap for pages (${noindexIds.length} noindex pages excluded), llms.txt (${(llms.extra.length / 1024).toFixed(1)} KB), sitemap cache cleared`);
}

// ------------------------------------------------------------------ cache flush + verify
if (!DRY && !flag('--no-flush')) {
  try { await wp('POST', '/wpaas/v1/flush-cache', {}); log('✓ host cache flushed (wpaas)'); }
  catch (e) { log(`  (no host cache flush: ${e.message.split(' -> ')[1] || e.message})`); }
}
if (!DRY) {
  let bad = 0;
  for (const r of results) {
    const url = `${r.link}${r.link.includes('?') ? '&' : '?'}v=${Date.now()}`;
    const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
    const html = await res.text();
    const okCss = html.includes('id="adr-css"');
    const okMain = html.includes('id="adr-main"');
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (res.status !== 200 || !okCss || !okMain || h1 !== 1) { bad++; log(`  ✗ ${r.path} status=${res.status} css=${okCss} main=${okMain} h1=${h1}`); }
  }
  log(bad ? `! ${bad} page(s) need attention` : `✓ verified ${results.length} live pages`);
}

// ------------------------------------------------------------------ verify sitemap, llms.txt, robots.txt
if (!DRY && !ONLY) {
  const problems = [];
  const index = await fetchText(`${BASE}/sitemap_index.xml`);
  const maps = [...index.text.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (index.status !== 200 || !maps.length) problems.push(`sitemap_index.xml -> ${index.status}, ${maps.length} sitemaps`);
  const urls = new Map();
  let images = 0;
  for (const m of maps) {
    const { text } = await fetchText(m);
    for (const u of text.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = u[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
      urls.set(loc, u[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '');
      images += (u[1].match(/<image:image>/g) || []).length;
    }
  }
  const expected = built.filter((p) => p.seo.robots !== 'noindex').map((p) => BASE + p.path);
  const missing = expected.filter((u) => !urls.has(u));
  const extra = [...urls.keys()].filter((u) => !expected.includes(u));
  if (missing.length) problems.push(`missing from sitemap: ${missing.join(', ')}`);
  if (extra.length) problems.push(`unexpected in sitemap: ${extra.join(', ')}`);
  const newest = [...urls.values()].sort().pop();
  log(`✓ XML sitemap: ${maps.length} sitemap(s), ${urls.size} URLs, ${images} images, newest lastmod ${newest}`);

  // Rank Math's llms.txt. On GoDaddy the /llms.txt address itself belongs to the host's own
  // llms.txt feature (wpaas "toggle-llms"), so read Rank Math's copy through its query var.
  const llms = await fetchText(`${BASE}/?llms_txt=1&v=${Date.now()}`);
  if (!llms.text.includes('## Sessions')) problems.push(`llms.txt content missing (?llms_txt=1 -> ${llms.status})`);
  else {
    const root = await fetchText(`${BASE}/llms.txt?v=${Date.now()}`);
    log(`✓ llms.txt: ${(llms.text.match(/^- \[/gm) || []).length} links${root.text.includes('## Sessions') ? '' : ` (at /?llms_txt=1 — /llms.txt answers ${root.status}: GoDaddy's own llms.txt feature owns that address)`}`);
  }

  const robots = await fetchText(`${BASE}/robots.txt`);
  if (!robots.text.includes(`Sitemap: ${BASE}/sitemap_index.xml`)) problems.push('robots.txt does not point to sitemap_index.xml');

  try {
    const { data } = await wp('POST', '/rankmath/v1/in/getLog', { filter: 'all' });
    // newest first; one entry per changed, indexable page saved above
    const recent = (data?.data || []).slice(0, results.filter((r) => r.changed && r.index).length);
    const by = recent.reduce((o, e) => ({ ...o, [e.status]: (o[e.status] || 0) + 1 }), {});
    const okAll = recent.every((e) => e.status === 200 || e.status === 202);
    if (recent.length) log(`${okAll ? '✓' : '!'} IndexNow: ${recent.length} recent submission(s), HTTP status ${Object.entries(by).map(([s, n]) => `${s}×${n}`).join(', ')}`);
  } catch { /* module off */ }

  log(problems.length ? `! sitemap/llms checks:\n  - ${problems.join('\n  - ')}` : '✓ sitemap, llms.txt and robots.txt verified');
}
