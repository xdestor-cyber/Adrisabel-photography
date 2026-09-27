// Tiny HTML templating helpers (no dependencies).
import { ART, ICONS } from './art.generated.mjs';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// Tagged template: arrays are joined, null/undefined/false are dropped.
export function html(strings, ...vals) {
  let out = strings[0];
  for (let i = 0; i < vals.length; i++) {
    const v = vals[i];
    out += (Array.isArray(v) ? v.flat(Infinity).filter((x) => x != null && x !== false).join('') : (v == null || v === false ? '' : v)) + strings[i + 1];
  }
  return out;
}
export const when = (cond, fn) => (cond ? (typeof fn === 'function' ? fn() : fn) : '');
export const attrs = (o) => Object.entries(o).filter(([, v]) => v != null && v !== false)
  .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

// Line icons from the storybook art (gold by default, styled via .icon).
export const icon = (name, extra = '') => {
  const s = ICONS[name];
  if (!s) throw new Error(`unknown icon ${name}`);
  return s.replace('<svg class="icon"', `<svg class="icon" aria-hidden="true" focusable="false"${extra ? ' ' + extra : ''}`);
};

let uid = 0;
// Illustrations: make internal ids unique so several can share one page.
export const art = (name, label) => {
  const s = ART[name];
  if (!s) throw new Error(`unknown art ${name}`);
  const n = ++uid;
  const ids = [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  let out = s;
  for (const id of ids) out = out.split(`"${id}"`).join(`"${id}-${n}"`).split(`url(#${id})`).join(`url(#${id}-${n})`);
  return out.replace('<svg ', label ? `<svg role="img" aria-label="${esc(label)}" ` : '<svg aria-hidden="true" focusable="false" ');
};

const SPARK = ART.sparkPath;
export const spark = (cls = '') => `<svg class="${cls}" viewBox="0 0 46 46" aria-hidden="true" focusable="false"><path d="${SPARK}"/></svg>`;

// UI glyphs (stroke icons in currentColor).
const G = (d, vb = '0 0 24 24', extra = '') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;
export const ui = {
  phone: G('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  mail: G('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  instagram: G('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>'),
  arrow: G('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chevron: G('<path d="m6 9 6 6 6-6"/>'),
  pin: G('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  check: G('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  clock: G('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  calendar: G('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  heart: G('<path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 3.9 4 7.2 4c2 0 3.4 1.1 4.8 2.8C13.4 5.1 14.8 4 16.8 4c3.3 0 5.6 3.3 4.4 6.7C19.5 15.4 12 20 12 20z"/>'),
  shield: G('<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  sms: G('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.7A8 8 0 1 1 21 12z"/>'),
  lock: G('<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
};

// Google "G" mark for review badges.
export const googleG = '<svg class="g" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

export const stars = (n = 5) => `<span class="stars" aria-hidden="true">${'★'.repeat(n)}</span>`;
