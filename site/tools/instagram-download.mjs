#!/usr/bin/env node
// Download the photos listed by instagram-grid-list.js / instagram-photo-list.js.
// Skips reels and video posts; keeps Instagram's alt text and post code next to each file.
//
//   node site/tools/instagram-download.mjs <adrisabelx-grid.json> <outDir>
//
// Then: node site/tools/photo-intake.mjs <outDir> <catalogDir>
import fs from 'node:fs';
import path from 'node:path';

const [list, outDir] = process.argv.slice(2);
if (!list || !outDir) { console.error('usage: instagram-download.mjs <list.json> <outDir>'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const items = JSON.parse(fs.readFileSync(list, 'utf8'));
const isVideo = (p) => p.kind === 'reel' || (p.icons || []).some((i) => /clip|video|reel/i.test(i));
const keep = items.filter((p) => p.url && !isVideo(p));
console.log(`${items.length} entries · ${items.length - keep.length} videos/reels skipped · ${keep.length} to download`);

const meta = [];
let ok = 0, fail = 0;
for (const p of keep) {
  const name = `${String(p.n ?? meta.length + 1).padStart(3, '0')}-${p.code}${p.i ? `-${p.i}` : ''}.jpg`;
  const dest = path.join(outDir, name);
  if (!fs.existsSync(dest)) {
    try {
      const res = await fetch(p.url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.instagram.com/' } });
      if (!res.ok) throw new Error(`${res.status}`);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      ok++;
    } catch (e) { fail++; console.warn(`  ✗ ${p.code}: ${e.message}`); continue; }
    await new Promise((r) => setTimeout(r, 300));
  }
  meta.push({ file: name, code: p.code, i: p.i ?? 0, w: p.w, alt: p.alt || '', caption: p.caption || '', taken: p.taken || null, icons: p.icons || [] });
}
fs.writeFileSync(path.join(outDir, 'instagram-meta.json'), JSON.stringify(meta, null, 1));
console.log(`downloaded ${ok}, failed ${fail}, total on disk ${meta.length} → ${outDir}`);
