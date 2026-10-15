// Blog posts. The articles live in src/content/blog/<slug>.json; this file sets the order, the
// cover photo and the publish time of each one — three a month. deploy.mjs schedules future posts
// in WordPress (status "future"), so they go live on their date without another deploy; until then
// the static site only links to posts that are already live.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/blog');

// [slug, cover photo, publish time (UTC)] — 9 AM Central on publish days
const SCHEDULE = [
  ['when-to-do-newborn-photos', 'heartBowl', '2026-10-14T15:02:00Z'],
  ['what-is-a-smash-cake', 'cake', '2026-10-14T15:01:00Z'],
  ['when-to-take-maternity-photos', 'momKissTeal', '2026-10-14T15:00:00Z'],
  ['what-to-wear-for-newborn-photos', 'parentsStanding', '2026-11-04T15:00:00Z'],
  ['first-birthday-photoshoot-ideas', 'cakeBlue', '2026-11-11T15:00:00Z'],
  ['baby-milestone-photos-first-year', 'knitRomper', '2026-11-18T15:00:00Z'],
  ['what-to-wear-for-maternity-photos', 'momFloral', '2026-12-02T15:00:00Z'],
  ['south-padre-island-family-photos-guide', 'beachLift', '2026-12-09T15:00:00Z'],
  ['how-to-prepare-for-newborn-photos', 'woodBowlLace', '2026-12-16T15:00:00Z'],
];

// What "now" means for this build (override with ADR_NOW=2026-11-05T00:00:00Z to preview a later month).
export const BUILD_NOW = process.env.ADR_NOW ? new Date(process.env.ADR_NOW) : new Date();

const words = (h) => h.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

export const POSTS = SCHEDULE.filter(([slug]) => fs.existsSync(path.join(DIR, `${slug}.json`))).map(([slug, hero, publishAt], order) => {
  const p = JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), 'utf8'));
  if (p.slug !== slug) throw new Error(`post ${slug}: slug mismatch (${p.slug})`);
  const body = p.intro + p.sections.map((s) => s.html).join('');
  return { ...p, hero, publishAt, order, words: words(body), minutes: Math.max(3, Math.round(words(body) / 225)) };
});

export const postHref = (p) => `/blog/${p.slug}/`;
export const isLive = (p, at = BUILD_NOW) => new Date(p.publishAt) <= at;
// newest first; "at" = the moment that matters (now, or a post's own publish time)
export const livePosts = (at = BUILD_NOW) => POSTS.filter((p) => isLive(p, at)).sort((a, b) => b.publishAt.localeCompare(a.publishAt) || b.order - a.order);

export const CATEGORY = {
  newborn: { label: 'Newborn', service: '/newborn-photography/', serviceLabel: 'Newborn photography', packages: ['sunshine', 'wonderland'], book: 'sunshine', cta: 'Reserve your newborn session', ask: 'Planning your newborn session?', kind: 'newborn' },
  baby: { label: 'Baby & milestones', service: '/baby-milestone-photography/', serviceLabel: 'Baby & milestone photography', packages: ['fairytale', 'pixie-dust'], book: 'pixie-dust', cta: 'Plan your milestone sessions', ask: 'Planning baby’s first year?', kind: 'baby' },
  cake: { label: 'Cake smash', service: '/cake-smash-photography/', serviceLabel: 'Cake smash photography', packages: ['cake-smash', 'fairytale'], book: 'cake-smash', cta: 'Reserve your cake smash', ask: 'Planning the big ONE?', kind: 'baby' },
  maternity: { label: 'Maternity', service: '/maternity-photography/', serviceLabel: 'Maternity photography', packages: ['sunshine', 'wonderland'], book: 'not-sure', cta: 'Ask about maternity', ask: 'Expecting?', kind: 'newborn' },
  beach: { label: 'Family beach', service: '/south-padre-island-family-photography/', serviceLabel: 'Family beach sessions', packages: ['seaside-beach'], book: 'seaside-beach', cta: 'Book your beach session', ask: 'Planning a beach session?', kind: 'newborn' },
};

const FMT = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', month: 'long', day: 'numeric', year: 'numeric' });
export const postDate = (p) => FMT.format(new Date(p.publishAt));
