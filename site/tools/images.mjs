#!/usr/bin/env node
// Builds the optimized photo masters in site/assets/img from the originals
// (WordPress media library + the higher-resolution Google Business Profile
// copies). Originals are cached in site/.cache/src. Run: node site/tools/images.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PHOTOS, LOGO } from '../src/data/images.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache/src');
const OUT = path.join(ROOT, 'assets/img');
const ART = path.join(ROOT, 'assets/art');
const MAX = 1600;
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(ART, { recursive: true });

function download(url, dst) {
  if (fs.existsSync(dst) && fs.statSync(dst).size > 1000) return dst;
  execFileSync('curl', ['-sSfL', '--retry', '3', '-o', dst, url], { stdio: 'inherit' });
  return dst;
}

function fetchOriginal(key, p) {
  const ext = /\.(jpe?g|png|webp)$/i.exec(p.src)?.[0] || '.jpg';
  const dst = path.join(CACHE, `${key}${ext}`);
  try {
    return download(p.src, dst);
  } catch (e) {
    if (!p.fallback) throw e;
    console.warn(`! ${key}: primary source failed, using fallback`);
    return download(p.fallback, path.join(CACHE, `${key}-fallback${path.extname(p.fallback)}`));
  }
}

async function dominant(buf) {
  const { dominant: d } = await sharp(buf).stats();
  const hex = (n) => n.toString(16).padStart(2, '0');
  // lighten toward cream so placeholders stay soft
  const mix = (c) => Math.round(c * 0.55 + 250 * 0.45);
  return `#${hex(mix(d.r))}${hex(mix(d.g))}${hex(mix(d.b))}`;
}

const manifest = {};
for (const [key, p] of Object.entries(PHOTOS)) {
  const src = fetchOriginal(key, p);
  let img = sharp(src).rotate();
  const meta = await img.metadata();
  if (p.crop) {
    const [l, t, w, h] = p.crop;
    img = img.extract({
      left: Math.round(l * meta.width), top: Math.round(t * meta.height),
      width: Math.round(w * meta.width), height: Math.round(h * meta.height),
    });
  }
  const buf = await img
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .toColorspace('srgb')
    .webp({ quality: 80, effort: 6, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
  const out = path.join(OUT, `${p.file}.webp`);
  fs.writeFileSync(out, buf.data);
  manifest[key] = {
    file: `${p.file}.webp`, width: buf.info.width, height: buf.info.height,
    bytes: buf.data.length, color: await dominant(buf.data),
  };
  console.log(`${key.padEnd(12)} ${buf.info.width}x${buf.info.height} ${(buf.data.length / 1024).toFixed(0)} KB  ${p.file}.webp`);
}

// Logo: transparent heart isotype, small WebP for the header plus a PNG for schema.
{
  const src = download(LOGO.src, path.join(CACHE, 'logo.png'));
  const trimmed = await sharp(src).trim().toBuffer();
  await sharp(trimmed).resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, `${LOGO.file}.webp`));
  await sharp(trimmed).resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${LOGO.file}.png`));
  manifest.logo = { file: `${LOGO.file}.webp`, width: 256, height: 256, png: `${LOGO.file}.png` };
  console.log('logo        256x256 + 512 png');
}

// Watercolor washes from the promo video, shrunk for the storybook package cards.
const WASHES = ['butter', 'lavender', 'sky', 'strawberry', 'aqua', 'blush', 'sand', 'gold', 'peach'];
const VIDEO_TEX = path.resolve(ROOT, '../video/assets/textures');
for (const w of WASHES) {
  const src = path.join(VIDEO_TEX, `wash-${w}.png`);
  if (!fs.existsSync(src)) continue;
  const out = path.join(ART, `wash-${w}.webp`);
  await sharp(src).resize(420, 420).webp({ quality: 72, alphaQuality: 80, effort: 6 }).toFile(out);
  manifest[`wash-${w}`] = { file: `wash-${w}.webp`, width: 420, height: 420, bytes: fs.statSync(out).size, art: true };
}
console.log('washes      ', WASHES.length);

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log('manifest written');
