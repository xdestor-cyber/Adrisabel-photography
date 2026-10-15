#!/usr/bin/env node
// Writes author, copyright and usage rights into the site's image and video files, without
// re-encoding them: EXIF Artist/Copyright plus the XMP/IPTC fields Google Images shows (Creator,
// Credit Line, Copyright Notice, Web Statement of Rights) and the creator's contact details.
// Images need exiftool (apt-get install libimage-exiftool-perl); videos need ffmpeg.
//   node site/tools/copyright.mjs           stamp every photo master, the logo, the reel and its poster
//   node site/tools/copyright.mjs --check   list files that are missing the stamp
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHOTOS, LOGO } from '../src/data/images.mjs';
import { VIDEOS } from '../src/data/videos.mjs';
import { RIGHTS } from '../src/data/rights.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// every image the site shows that is her work (the watercolor washes are only textures)
export function imageFiles() {
  const out = [];
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));
  for (const [key, m] of Object.entries(manifest)) {
    if (m.art) continue;
    if (key === 'logo') {
      for (const f of [m.file, m.png]) out.push({ path: path.join(ROOT, 'assets/img', f), title: LOGO.alt, description: LOGO.alt });
      continue;
    }
    const alt = PHOTOS[key].alt;
    out.push({ path: path.join(ROOT, 'assets/img', m.file), title: alt.split(/[,—]/)[0].trim(), description: alt });
  }
  for (const v of Object.values(VIDEOS)) out.push({ path: path.join(ROOT, 'assets/video', v.files.poster), title: v.title, description: v.label });
  return out;
}
export const videoFiles = () => Object.values(VIDEOS).flatMap((v) => [v.files.mp4, v.files.webm].map((f) => path.join(ROOT, 'assets/video', f)));

// cheap, dependency-free check: the copyright notice is in the file's XMP packet
const NOTICE = Buffer.from(RIGHTS.notice);
export const isStamped = (file) => fs.readFileSync(file).includes(NOTICE);

const C = RIGHTS.contact;
const tagArgs = ({ title, description }) => [
  `-EXIF:Artist=${RIGHTS.creator}`, `-EXIF:Copyright=${RIGHTS.exifNotice}`,
  `-XMP-dc:Creator=${RIGHTS.creator}`, `-XMP-dc:Rights=${RIGHTS.notice}`,
  `-XMP-dc:Title=${title}`, `-XMP-dc:Description=${description}`,
  `-XMP-photoshop:Credit=${RIGHTS.owner}`, '-XMP-photoshop:AuthorsPosition=Photographer',
  '-XMP-xmpRights:Marked=True', `-XMP-xmpRights:WebStatement=${RIGHTS.url}`, `-XMP-xmpRights:UsageTerms=${RIGHTS.terms}`,
  `-XMP-iptcCore:CreatorWorkURL=${C.url}`, `-XMP-iptcCore:CreatorWorkEmail=${C.email}`, `-XMP-iptcCore:CreatorWorkTelephone=${C.phone}`,
  `-XMP-iptcCore:CreatorCity=${C.city}`, `-XMP-iptcCore:CreatorRegion=${C.region}`, `-XMP-iptcCore:CreatorCountry=${C.country}`,
  `-XMP-plus:CopyrightOwnerName=${RIGHTS.owner}`, `-XMP-plus:ImageCreatorName=${RIGHTS.creator}`,
];

// files: [{ path, title, description }] — one exiftool process for the whole batch
export function stamp(files) {
  if (!files.length) return;
  const lines = [];
  for (const f of files) lines.push('-overwrite_original', '-m', '-q', '-api', 'Compact=NoPadding,Shorthand,OneDesc', ...tagArgs(f), f.path, '-execute');
  const argfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'adr-rights-')), 'args.txt');
  fs.writeFileSync(argfile, lines.join('\n') + '\n');
  execFileSync('exiftool', ['-@', argfile], { stdio: ['ignore', 'inherit', 'inherit'] });
  fs.rmSync(path.dirname(argfile), { recursive: true });
}

// videos: same notice in the container tags (artist / copyright / comment), streams copied as-is
const videoTags = (file) => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format_tags', '-of', 'json', file], { encoding: 'utf8' })).format?.tags || {};
export const videoStamped = (file) => Object.entries(videoTags(file)).some(([k, v]) => k.toLowerCase() === 'copyright' && v === RIGHTS.notice);
export function stampVideo(file) {
  const tmp = file.replace(/(\.\w+)$/, '.tmp$1');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-map', '0', '-c', 'copy',
    '-metadata', `artist=${RIGHTS.creator}`, '-metadata', `copyright=${RIGHTS.notice}`,
    '-metadata', `comment=${RIGHTS.terms} ${RIGHTS.url}`, ...(file.endsWith('.mp4') ? ['-movflags', '+faststart'] : []), tmp]);
  fs.renameSync(tmp, file);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const images = imageFiles(), videos = videoFiles();
  if (process.argv.includes('--check')) {
    const missing = [...images.filter((f) => !isStamped(f.path)).map((f) => f.path), ...videos.filter((f) => !videoStamped(f))];
    for (const f of missing) console.log('missing:', path.relative(ROOT, f));
    console.log(missing.length ? `${missing.length} file(s) without the copyright stamp` : `all ${images.length + videos.length} files carry the copyright stamp`);
    process.exit(missing.length ? 1 : 0);
  }
  stamp(images);
  const todo = videos.filter((v) => !videoStamped(v));
  for (const v of todo) stampVideo(v);
  console.log(`stamped ${images.length} images and ${todo.length} videos (${videos.length - todo.length} already stamped)`);
}
