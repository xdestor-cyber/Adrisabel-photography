// Render every frame of the animation with headless Chromium.
//   node tools/render_frames.mjs [--workers 4] [--from 0] [--to <frames>] [--out build/frames]
// Each worker seeks the deterministic GSAP timeline to exact frame times
// (t = i / FPS) and saves a JPEG; build.sh then encodes them with ffmpeg.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const FPS = 30;
const out = arg('out', 'build/frames');
const workers = +arg('workers', Math.max(1, Math.min(6, os.cpus().length)));
const url = 'file://' + path.resolve('video/index.html');
fs.mkdirSync(out, { recursive: true });

async function openPage() {
  const browser = await chromium.launch({ args: ['--disable-gpu', '--font-render-hinting=none', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  return { browser, page };
}

const probe = await openPage();
const duration = await probe.page.evaluate(() => window.DURATION);
await probe.browser.close();
const total = Math.ceil(duration * FPS);
const from = +arg('from', 0), to = Math.min(total, +arg('to', total));
const count = to - from;
console.log(`rendering frames ${from}..${to - 1} of ${total} (${duration.toFixed(3)}s @ ${FPS}fps) with ${workers} workers`);

let done = 0;
const t0 = Date.now();
async function work(w) {
  const a = from + Math.floor((count * w) / workers), b = from + Math.floor((count * (w + 1)) / workers);
  if (a >= b) return;
  const { browser, page } = await openPage();
  // warm-up: walk the timeline up to the chunk start so every tween initialises in order
  await page.evaluate((tEnd) => { for (let t = 0; t < tEnd; t += 0.5) window.renderAt(t); }, a / FPS);
  for (let i = a; i < b; i++) {
    const f = path.join(out, `f_${String(i).padStart(5, '0')}.jpg`);
    await page.evaluate((t) => window.renderAt(t), i / FPS);
    await page.screenshot({ path: f, type: 'jpeg', quality: 94 });
    done++;
    if (done % 100 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`${done}/${count} frames  ${(done / el).toFixed(1)} fps  eta ${((count - done) / (done / el)).toFixed(0)}s`);
    }
  }
  await browser.close();
}
await Promise.all(Array.from({ length: workers }, (_, w) => work(w)));
console.log(`done: ${count} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
