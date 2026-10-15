// A small, toned-down "adrisabel.com" for every photo: DM Sans in soft white with a faint black
// shadow, sized to the photo. It goes in the calmest corner of the part of the photo that every
// crop on the site keeps visible (assets/img/crop-zones.json, from tools/crop-zones.mjs), away
// from the subject (the photo's focal point). A photo can pin a corner with `watermark: 'bl'`.
// Used by tools/images.mjs while it builds the masters, so each photo is encoded only once.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONT = path.join(ROOT, 'assets/fonts/DMSans-Medium.ttf');
const ZONES_FILE = path.join(ROOT, 'assets/img/crop-zones.json');
export const TEXT = 'adrisabel.com';

// look (fractions of the photo's size, sqrt(width × height))
export const STYLE = { size: 0.021, margin: 0.028, tracking: 0.06, text: 0.72, shadow: 0.36, glow: 0.16 };
const PREFER = { br: 0, bl: 0.04, bc: 0.12, tr: 0.3, tl: 0.34 };

const span = (color, alpha, size) => `<span foreground="${color}" alpha="${Math.round(alpha * 100)}%" letter_spacing="${Math.round(STYLE.tracking * size * 1024)}">${TEXT}</span>`;
const textImage = (color, alpha, size) => sharp({ text: { text: span(color, alpha, size), font: `DM Sans Medium ${size}`, fontfile: FONT, rgba: true, dpi: 72 } }).png().toBuffer({ resolveWithObject: true });

const tiles = new Map();
async function tile(size) {
  if (tiles.has(size)) return tiles.get(size);
  const text = await textImage('white', STYLE.text, size);
  const { width: tw, height: th } = text.info;
  const s1 = Math.max(0.8, size * 0.06), s2 = Math.max(2, size * 0.22), dy = Math.max(1, Math.round(size * 0.05));
  const pad = Math.ceil(s2 * 3) + 2;
  const W = tw + pad * 2, H = th + pad * 2;
  const layer = async (sigma, opacity, y) => sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: (await textImage('black', opacity, size)).data, left: pad, top: pad + y }]).png().toBuffer()
    .then((b) => sharp(b).blur(sigma).png().toBuffer());
  const glow = await layer(s2, STYLE.glow, 0), shadow = await layer(s1, STYLE.shadow, dy);
  const data = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: glow }, { input: shadow }, { input: text.data, left: pad, top: pad }]).png().toBuffer();
  const t = { data, pad, tw, th };
  tiles.set(size, t);
  return t;
}

// gradient energy (Sobel) and luminance on a small greyscale copy, for scoring regions
async function maps(raw) {
  const w = 320, h = Math.max(1, Math.round((raw.info.height / raw.info.width) * w));
  const g = await sharp(raw.data, { raw: raw.info }).greyscale().resize(w, h).raw().toBuffer();
  const e = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x, p = (dx, dy) => g[i + dy * w + dx];
    const gx = p(1, -1) + 2 * p(1, 0) + p(1, 1) - p(-1, -1) - 2 * p(-1, 0) - p(-1, 1);
    const gy = p(-1, 1) + 2 * p(0, 1) + p(1, 1) - p(-1, -1) - 2 * p(0, -1) - p(1, -1);
    e[i] = Math.hypot(gx, gy);
  }
  return { w, h, g, e };
}
const mean = (m, arr, x0, y0, x1, y1) => {
  const sx = m.w, k = m.w;
  let s = 0, n = 0;
  for (let y = Math.max(0, Math.floor(y0 * m.h)); y < Math.min(m.h, Math.ceil(y1 * m.h)); y++)
    for (let x = Math.max(0, Math.floor(x0 * sx)); x < Math.min(m.w, Math.ceil(x1 * sx)); x++) { s += arr[y * k + x]; n++; }
  return n ? s / n : 0;
};

let ZONES = null;
const zoneFor = (key) => ((ZONES ||= fs.existsSync(ZONES_FILE) ? JSON.parse(fs.readFileSync(ZONES_FILE, 'utf8')) : {})[key]) || { x0: 0, y0: 0, x1: 1, y1: 1 };

// raw: { data, info } of the resized photo. Returns the watermarked raw image and where it went.
export async function watermark(raw, { key, focal = '50% 50%', pin = null }) {
  const { width: W, height: H } = raw.info;
  const unit = Math.sqrt(W * H);
  const size = Math.max(14, Math.round(unit * STYLE.size)), m = Math.round(unit * STYLE.margin);
  const t = await tile(size);
  const z = zoneFor(key);
  const zx0 = z.x0 * W, zx1 = z.x1 * W, zy0 = z.y0 * H, zy1 = z.y1 * H;
  const [fx, fy] = focal.split(/\s+/).map((v) => parseFloat(v) / 100);
  const spots = {
    br: [zx1 - m - t.tw, zy1 - m - t.th], bl: [zx0 + m, zy1 - m - t.th], bc: [(zx0 + zx1 - t.tw) / 2, zy1 - m - t.th],
    tr: [zx1 - m - t.tw, zy0 + m], tl: [zx0 + m, zy0 + m],
  };
  const mp = await maps(raw);
  const busyAll = mean(mp, mp.e, z.x0, z.y0, z.x1, z.y1) || 1;
  const scored = Object.entries(spots).map(([name, [x, y]]) => {
    const r = [x / W, y / H, (x + t.tw) / W, (y + t.th) / H];
    const busy = mean(mp, mp.e, ...r) / busyAll;
    const lum = mean(mp, mp.g, ...r) / 255;
    const d = Math.hypot((x + t.tw / 2) / W - fx, ((y + t.th / 2) / H - fy) * (H / W)) * (W / unit);
    const subject = Math.max(0, 1 - d / 0.32) * 1.5;
    const score = busy * 0.6 + subject + PREFER[name] + (lum > 0.88 ? 0.08 : 0);
    return { name, x: Math.round(x), y: Math.round(y), score, busy, lum, subject };
  }).sort((a, b) => a.score - b.score);
  const spot = (pin && scored.find((s) => s.name === pin)) || scored[0];
  // compositing adds an alpha channel; drop it so the photo keeps its own channel layout
  const out = await sharp(raw.data, { raw: raw.info })
    .composite([{ input: t.data, left: Math.max(0, spot.x - t.pad), top: Math.max(0, spot.y - t.pad) }])
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { raw: { data: out.data, info: { width: out.info.width, height: out.info.height, channels: out.info.channels } }, spot, size };
}
