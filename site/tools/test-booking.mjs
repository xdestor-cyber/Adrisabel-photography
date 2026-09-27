#!/usr/bin/env node
// Walks through the booking widget and checks the Formspree payload + GTM event.
// The Formspree request is intercepted — nothing is actually sent.
import { chromium } from 'playwright';
import { routeViaNode } from './proxy-route.mjs';
const base = (process.argv[2] || 'http://127.0.0.1:8090').replace(/\/$/, '');
const path = process.argv[3] || '/fast-online-booking/?session=wonderland';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
let payload = null;
if (process.env.QA_VIA_NODE) await routeViaNode(page.context(), { block: /fonts\.(googleapis|gstatic)\.com|googletagmanager|formspree/ });
await page.route('https://formspree.io/**', async (route) => {
  payload = JSON.parse(route.request().postData());
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
});
await page.route(/fonts\.(googleapis|gstatic)\.com|googletagmanager/, (r) => r.abort());
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(base + path, { waitUntil: 'load' });
const checked = await page.getAttribute('.bk-offer[aria-checked="true"]', 'data-id');
const next1Enabled = await page.isEnabled('#bk-next1');
await page.click('#bk-next1');
const dueVisible = await page.isVisible('#bk-due');
await page.click('.bk-day >> nth=2');
await page.click('.bk-time >> nth=1');
await page.fill('#bk-due-input', '2026-11-20');
await page.click('#bk-next2');
await page.waitForSelector('[data-panel="3"].is-on', { timeout: 6000 });
await page.fill('#bk-name', 'Test Parent');
await page.type('#bk-phone', '9565550123');
await page.fill('#bk-email', 'parent@gmail.com');
await page.fill('#bk-notes', 'Big sister joining');
const submitEnabled = await page.isEnabled('#bk-submit');
await page.click('#bk-submit');
await page.waitForSelector('[data-panel="done"].is-on', { timeout: 6000 });
const dl = await page.evaluate(() => (window.dataLayer || []).find((e) => e.event === 'form_submit_success'));
const summary = await page.textContent('#bk-summary');
console.log(JSON.stringify({ preselected: checked, next1Enabled, dueVisible, submitEnabled, payload, dataLayer: dl, summary, errors }, null, 1));
await browser.close();
const want = new URL(base + path).searchParams.get('session') || 'wonderland';
const ok = checked === want && dueVisible && submitEnabled && payload?.session_type?.toLowerCase().startsWith(want.split('-')[0]) &&
  payload.phone === '(956) 555-0123' && payload.due_date === '2026-11-20' && dl?.form_name === 'booking_request' && dl.user_data.phone === '+19565550123' && !errors.length;
console.log(ok ? 'BOOKING FLOW OK' : 'BOOKING FLOW FAILED');
process.exit(ok ? 0 : 1);
