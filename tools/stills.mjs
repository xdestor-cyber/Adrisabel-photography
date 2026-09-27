// Render still frames at given times: node tools/stills.mjs 12.5 30 61.2 [--out dir]
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const args = process.argv.slice(2);
let out = 'output/stills';
const oi = args.indexOf('--out');
if (oi >= 0) { out = args[oi + 1]; args.splice(oi, 2); }
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.resolve('video/index.html');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error('console:', m.text()); });
await page.goto(url);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
for (const a of args) {
  const t = parseFloat(a);
  await page.evaluate((t) => window.renderAt(t), t);
  const f = path.join(out, `t_${t.toFixed(2).padStart(6, '0')}.jpg`);
  await page.screenshot({ path: f, type: 'jpeg', quality: 88 });
  console.log(f);
}
await browser.close();
