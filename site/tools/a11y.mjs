#!/usr/bin/env node
// Accessibility scan (axe-core, WCAG 2 A/AA) of the built preview.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const base = (process.argv[2] || 'http://127.0.0.1:8090').replace(/\/$/, '');
const paths = ['/', '/pricing/', '/newborn-photography/', '/fast-online-booking/', '/contact/', '/newborn-photographer-mcallen-tx/', '/faq/', '/about/'];
const browser = await chromium.launch();
let total = 0;
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route(/googletagmanager/, (r) => r.abort());
  for (const p of paths) {
    const page = await ctx.newPage();
    await page.goto(base + p, { waitUntil: 'load' });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
    await page.waitForTimeout(900);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    for (const v of r.violations) {
      total++;
      console.log(`${w} ${p} [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      for (const n of v.nodes.slice(0, 3)) console.log('     ', n.target.join(' '), '|', (n.failureSummary || '').split('\n').slice(1, 2).join(' ').slice(0, 160));
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(total ? `${total} violation group(s)` : 'no axe violations');
