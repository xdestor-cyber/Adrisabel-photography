#!/usr/bin/env node
// Measures, for every photo, the part that stays visible in every crop the site shows it in
// (object-fit: cover boxes at phone and desktop widths), so the watermark can sit inside it.
// Needs the preview server (node site/build.mjs, then serve site/dist/preview on :8090).
//   node site/tools/crop-zones.mjs [baseUrl]   -> site/assets/img/crop-zones.json
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from '../src/pages/index.mjs';
import { IMG_MANIFEST } from '../src/lib/media.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.argv[2] || 'http://127.0.0.1:8090').replace(/\/$/, '');
const byFile = Object.fromEntries(Object.entries(IMG_MANIFEST).filter(([k, m]) => !m.art && k !== 'logo').map(([k, m]) => [m.file.replace(/\.webp$/, ''), k]));
const zones = {};
const browser = await chromium.launch();
for (const vp of [{ w: 390, h: 844, m: true }, { w: 1440, h: 900, m: false }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com|googletagmanager|google\.com\/maps/, (r) => r.abort());
  for (const page of PAGES) {
    const p = await ctx.newPage();
    await p.goto(base + page.path, { waitUntil: 'load' });
    const uses = await p.evaluate(() => [...document.querySelectorAll('img')].map((img) => {
      const r = img.getBoundingClientRect(), cs = getComputedStyle(img);
      const [px, py] = cs.objectPosition.split(' ').map((v) => parseFloat(v) / 100);
      return { src: img.currentSrc || img.src, w: r.width, h: r.height, fit: cs.objectFit, px, py, nw: +img.getAttribute('width'), nh: +img.getAttribute('height') };
    }));
    for (const u of uses) {
      const stem = decodeURIComponent(new URL(u.src).pathname.split('/').pop()).replace(/(-\d+)?\.webp$/, '');
      const key = byFile[stem];
      if (!key || !u.w || !u.h) continue;
      const z = (zones[key] ||= { x0: 0, y0: 0, x1: 1, y1: 1, crops: 0 });
      if (u.fit !== 'cover') continue;
      const nat = u.nw / u.nh, box = u.w / u.h;
      if (Math.abs(box / nat - 1) < 0.01) continue;
      let r;
      if (box < nat) { const vw = box / nat, off = (1 - vw) * (Number.isFinite(u.px) ? u.px : 0.5); r = { x0: off, x1: off + vw, y0: 0, y1: 1 }; }
      else { const vh = nat / box, off = (1 - vh) * (Number.isFinite(u.py) ? u.py : 0.5); r = { x0: 0, x1: 1, y0: off, y1: off + vh }; }
      z.x0 = Math.max(z.x0, r.x0); z.y0 = Math.max(z.y0, r.y0); z.x1 = Math.min(z.x1, r.x1); z.y1 = Math.min(z.y1, r.y1);
      z.crops++;
    }
    await p.close();
  }
  await ctx.close();
}
await browser.close();
const round = (v) => Math.round(v * 1000) / 1000;
const out = Object.fromEntries(Object.entries(zones).sort().map(([k, z]) => [k, { x0: round(z.x0), y0: round(z.y0), x1: round(z.x1), y1: round(z.y1), crops: z.crops }]));
fs.writeFileSync(path.join(ROOT, 'assets/img/crop-zones.json'), JSON.stringify(out, null, 1) + '\n');
const tight = Object.entries(out).filter(([, z]) => (z.x1 - z.x0) * (z.y1 - z.y0) < 0.35);
console.log(`crop zones for ${Object.keys(out).length} photos${tight.length ? `; tight (<35% visible everywhere): ${tight.map(([k]) => k).join(', ')}` : ''}`);
