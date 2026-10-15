// Resolves photos/art to URLs for the two build targets:
//  - preview: local files under dist/preview/img (+ generated widths)
//  - wp:      WordPress media library URLs recorded by deploy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHOTOS } from '../data/images.mjs';
import { VIDEOS } from '../data/videos.mjs';
import { attrs } from './html.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const IMG_MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));
export const PREVIEW_WIDTHS = [480, 800, 1200]; // responsive widths, for the preview and for WordPress

// WordPress strips the copyright metadata from the smaller copies it makes of an upload, so every
// photo goes up in these widths, uploaded without WordPress sizes, and srcset uses those files.
// The uploaded names credit her too.
export const wpName = (file, w = null) => file.replace(/^adrisabel-/, '').replace(/(\.\w+)$/, `-by-adrisabel${w ? `-${w}` : ''}$1`);

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
      const full = need(wpName(m.file));
      src = full.url;
      srcset = PREVIEW_WIDTHS.filter((w) => w < m.width).map((w) => `${need(wpName(m.file, w)).url} ${w}w`).concat(`${full.url} ${m.width}w`).join(', ');
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
    if (mode === 'wp') return need(m.art ? m.file : wpName(m.file)).url;
    return m.art ? `/art/${m.file}` : `/img/${m.file}`;
  };
  const logo = () => {
    const m = IMG_MANIFEST.logo;
    return { src: mode === 'wp' ? need(wpName(m.file)).url : `/img/${m.file}`, png: mode === 'wp' ? need(wpName(m.png)).url : `/img/${m.png}`, width: 256, height: 256 };
  };
  const video = (key) => {
    const v = VIDEOS[key];
    if (!v) throw new Error(`unknown video ${key}`);
    const url = (f) => (mode === 'wp' ? need(wpName(f)).url : `/video/${f}`);
    return { ...v, webm: url(v.files.webm), mp4: url(v.files.mp4), poster: url(v.files.poster) };
  };
  return { mode, photo, file, logo, video };
}

// Silent looping <video>: no file is fetched until site.js sees it near the viewport
// (sources carry data-src), and reduced-motion / data-saver visitors keep the poster.
export function video(media, key, { cls = null } = {}) {
  const v = media.video(key);
  return `<video${attrs({
    class: cls, poster: v.poster, width: v.width, height: v.height, 'aria-label': v.label,
    muted: true, loop: true, playsinline: true, preload: 'none', 'data-lazy-video': true,
  })}><source data-src="${v.webm}" type="video/webm"><source data-src="${v.mp4}" type="video/mp4"></video>`;
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
