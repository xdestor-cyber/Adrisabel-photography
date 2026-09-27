// Dump the animation's timing + sound-design cues to music/cues.json
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
await page.goto('file://' + path.resolve('video/index.html'));
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
const data = await page.evaluate(() => ({ timing: window.TIMING, cues: [...window.CUES].sort((a, b) => a.t - b.t) }));
fs.mkdirSync('music', { recursive: true });
fs.writeFileSync('music/cues.json', JSON.stringify(data, null, 1));
console.log(`cues: ${data.cues.length}, duration: ${data.timing.DURATION.toFixed(3)}s, bpm: ${data.timing.BPM}`);
await browser.close();
