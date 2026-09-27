// Resolves photos/art to URLs for the two build targets:
//  - preview: local files under dist/preview/img (+ generated widths)
//  - wp:      WordPress media library URLs recorded by deploy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHOTOS } from '../data/images.mjs';
import { attrs } from './html.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const IMG_MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));
export const PREVIEW_WIDTHS = [480, 800, 1200];

export function createMedia(mode, deploy = null) {
  const wpMedia = deploy?.media || {};
  const need = (file) => {
    const m = wpMedia[file];
    if (!m) throw new Error(`media not uploaded yet: ${file} (run deploy.mjs --media first)`);
    return m;
  };
  const photo = (key) => {
    const p = PHOTOS[key];
    const m = IMG_MANIFEST[key];
    if (!p || !m) throw new Error(`unknown photo ${key}`);
    let src, srcset;
    if (mode === 'wp') {
      const w = need(m.file);
      src = w.url;
      const list = [...(w.sizes || []), { w: w.width, url: w.url }]
        .filter((s, i, a) => s.w >= 300 && a.findIndex((x) => x.w === s.w) === i)
        .sort((a, b) => a.w - b.w);
      srcset = list.map((s) => `${s.url} ${s.w}w`).join(', ');
    } else {
      const base = m.file.replace(/\.webp$/, '');
      src = `/img/${m.file}`;
      srcset = PREVIEW_WIDTHS.filter((w) => w < m.width).map((w) => `/img/${base}-${w}.webp ${w}w`).concat(`/img/${m.file} ${m.width}w`).join(', ');
    }
    return { key, src, srcset, width: m.width, height: m.height, alt: p.alt, color: m.color, focal: p.focal || '50% 50%', file: m.file };
  };
  const file = (name) => {
    const m = IMG_MANIFEST[name];
    if (!m) throw new Error(`unknown asset ${name}`);
    if (mode === 'wp') return need(m.file).url;
    return m.art ? `/art/${m.file}` : `/img/${m.file}`;
  };
  const logo = () => {
    const m = IMG_MANIFEST.logo;
    return { src: mode === 'wp' ? need(m.file).url : `/img/${m.file}`, png: mode === 'wp' ? need(m.png).url : `/img/${m.png}`, width: 256, height: 256 };
  };
  return { mode, photo, file, logo };
}

// <img> with srcset, intrinsic size (no layout shift), soft placeholder color.
export function img(media, key, { sizes = '100vw', eager = false, priority = false, cls = null, alt = null, focal = null } = {}) {
  const p = media.photo(key);
  return `<img${attrs({
    src: p.src, srcset: p.srcset, sizes, width: p.width, height: p.height,
    alt: alt ?? p.alt, class: cls, loading: eager || priority ? 'eager' : 'lazy', decoding: priority ? 'sync' : 'async',
    fetchpriority: priority ? 'high' : null,
    style: `object-position:${focal || p.focal};background-color:${p.color}`,
  })}>`;
}
