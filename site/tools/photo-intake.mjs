#!/usr/bin/env node
// Photo intake: scan a folder of new photos (e.g. an Instagram "Download your information"
// export), skip videos, find near-duplicates of each other and of the photos already on the
// site, and write numbered contact sheets for visual cataloguing.
//
//   node site/tools/photo-intake.mjs <folder> <outDir>
//
// Writes <outDir>/intake.json  — one entry per image: { n, file, width, height,
//        dupOf (existing site photo key or earlier n), takenAt (from the export JSON if present) }
//        <outDir>/sheet-01.jpg … — 5×4 grids of thumbnails labelled with their number
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [inDir, outDir] = process.argv.slice(2);
if (!inDir || !outDir) { console.error('usage: photo-intake.mjs <folder> <outDir>'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const IMG = /\.(jpe?g|png|webp|heic|heif)$/i;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : IMG.test(e.name) ? [p] : [];
});

// Signature: 16×16 blurred greyscale thumbnail, normalised for brightness/contrast. Copies of a
// photo (resized, recompressed by Instagram) score < 0.05; different photos > 0.4.
async function sig(file) {
  const px = [...await sharp(file).rotate().greyscale().blur(1).resize(16, 16, { fit: 'fill' }).raw().toBuffer()];
  const mean = px.reduce((s, v) => s + v, 0) / px.length;
  const sd = Math.sqrt(px.reduce((s, v) => s + (v - mean) ** 2, 0) / px.length) || 1;
  return px.map((v) => +((v - mean) / sd).toFixed(3));
}
const dist = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;
const SAME = 0.2;

// timestamps from the Instagram export (posts_1.json: [{ media: [{ uri, creation_timestamp }] }])
const taken = {};
for (const f of walk(inDir).length ? fs.readdirSync(inDir, { recursive: true }).filter((p) => /posts_\d+\.json$/.test(p)) : []) {
  try {
    for (const post of JSON.parse(fs.readFileSync(path.join(inDir, f), 'utf8'))) {
      for (const m of post.media || []) taken[path.basename(m.uri)] = new Date((m.creation_timestamp || post.creation_timestamp) * 1000).toISOString().slice(0, 10);
    }
  } catch { /* not an export file */ }
}

const existing = [];
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));
for (const [key, m] of Object.entries(manifest)) {
  if (m.art || key === 'logo') continue;
  existing.push({ key, sig: await sig(path.join(ROOT, 'assets/img', m.file)) });
}

const files = walk(inDir).sort();
const out = [];
for (const file of files) {
  let meta;
  try { meta = await sharp(file).metadata(); } catch { continue; }
  const s = await sig(file);
  const ex = existing.find((e) => dist(e.sig, s) < SAME);
  const prev = out.find((o) => dist(o.sig, s) < SAME);
  out.push({ n: out.length + 1, file: path.relative(inDir, file), width: meta.width, height: meta.height, sig: s, dupOf: ex ? `site:${ex.key}` : prev ? `#${prev.n}` : null, takenAt: taken[path.basename(file)] || null });
}
fs.writeFileSync(path.join(outDir, 'intake.json'), JSON.stringify(out.map(({ sig: _, ...o }) => o), null, 1));

// contact sheets of the non-duplicates
const uniq = out.filter((o) => !o.dupOf);
const W = 300, H = 300, COLS = 5, ROWS = 4, PER = COLS * ROWS;
for (let s = 0; s * PER < uniq.length; s++) {
  const tiles = await Promise.all(uniq.slice(s * PER, (s + 1) * PER).map(async (o, i) => {
    const thumb = await sharp(path.join(inDir, o.file)).rotate().resize(W, H - 28, { fit: 'contain', background: '#fff' }).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="28"><rect width="100%" height="100%" fill="#222"/><text x="8" y="20" font-family="sans-serif" font-size="18" fill="#fff">#${o.n}  ${o.width}×${o.height}</text></svg>`);
    return [{ input: thumb, left: (i % COLS) * W, top: Math.floor(i / COLS) * H }, { input: label, left: (i % COLS) * W, top: Math.floor(i / COLS) * H + H - 28 }];
  }));
  await sharp({ create: { width: W * COLS, height: H * ROWS, channels: 3, background: '#fff' } })
    .composite(tiles.flat()).jpeg({ quality: 80 }).toFile(path.join(outDir, `sheet-${String(s + 1).padStart(2, '0')}.jpg`));
}
console.log(`${files.length} images · ${uniq.length} unique · ${out.filter((o) => o.dupOf?.startsWith('site:')).length} already on the site · ${Math.ceil(uniq.length / PER)} contact sheets → ${outDir}`);
