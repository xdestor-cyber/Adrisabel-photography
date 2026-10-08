// /sitemap/ — a designed, human-friendly map of the whole site. Built from the
// page list, so the build fails if an indexable page is ever left off it.
import { html, ui, icon, esc } from '../lib/html.mjs';
import { img } from '../lib/media.mjs';
import { pageHero, secHead, finalCta } from '../lib/components.mjs';
import { PACKAGES } from '../data/packages.mjs';
import { CITIES } from '../data/cities.mjs';
import { AREAS } from '../data/areas.mjs';
import { BUSINESS as B, BOOK_URL } from '../data/business.mjs';

const SESSIONS = [
  { path: '/newborn-photography/', name: 'Newborn Photography', photo: 'roses', note: 'Sleepy, curled-up portraits in the first 5–14 days, posed safely and gently.' },
  { path: '/baby-milestone-photography/', name: 'Baby & Milestones', photo: 'moonStars', note: 'First smiles, sitting up and crawling — playful sessions through the first year.' },
  { path: '/cake-smash-photography/', name: 'Cake Smash', photo: 'cake', note: 'A first-birthday celebration, with the cake already taken care of.' },
  { path: '/south-padre-island-family-photography/', name: 'Family Beach Session', photo: 'beachLift', note: 'The whole family barefoot on the sand at South Padre Island.' },
  { path: '/maternity-photography/', name: 'Maternity', photo: 'momWhite', note: 'Glowing bump portraits to remember the months of waiting.' },
  { path: '/pricing/', name: 'All Sessions & Packages', photo: 'swingGirl', note: 'Every session side by side, so you can choose the right one.' },
];

const STUDIO = [
  { path: '/about/', name: 'About Adrisabel', icon: 'heart', note: 'Meet the photographer — 15+ years and hundreds of babies photographed.' },
  { path: '/portfolio/', name: 'Portfolio', icon: 'photos', note: 'Newborn, milestone, cake smash and family portraits.' },
  { path: '/reviews/', name: 'Reviews', icon: 'star', note: 'What Rio Grande Valley parents say — 5.0 on Google.' },
  { path: '/faq/', name: 'FAQ', icon: 'sparkle', note: 'Safety, timing, what to bring, outfits and photo delivery.' },
  { path: '/contact/', name: 'Contact', icon: 'pin', note: `Call or text ${B.phone}, email, or send a message.` },
  { path: BOOK_URL, name: 'Book online', icon: 'calendar', note: 'Request your date in three quick steps — no payment today.' },
];

const pkgLinks = (path) => PACKAGES.filter((p) => p.page === path);

const tile = (ctx, s) => {
  const pk = s.path === '/pricing/' ? PACKAGES : pkgLinks(s.path);
  return html`<article class="smap-tile reveal">
<a class="smap-media" href="${s.path}" tabindex="-1" aria-hidden="true">${img(ctx.media, s.photo, { sizes: '(min-width:1080px) 360px, (min-width:700px) 45vw, 92vw' })}</a>
<div class="smap-body">
<h3><a href="${s.path}">${esc(s.name)}</a></h3>
<p>${s.note}</p>
${pk.length ? html`<p class="smap-sub"><span>${pk.length > 1 ? 'Packages' : 'Package'}</span>${pk.map((p) => html`<a href="/pricing/#pkg-${p.id}">${esc(p.name)}</a>`)}</p>` : ''}
</div>
</article>`;
};

const cityList = (kind) => {
  const nb = kind === 'newborn';
  return html`<div class="smap-col reveal">
<h3>${icon(nb ? 'heart' : 'star')}${nb ? 'Newborn photographer' : 'Baby photographer'}</h3>
<ul>${CITIES.map((c) => html`<li><a href="/${kind}-photographer-${c.slug}-tx/"><span class="smap-l">${nb ? 'Newborn' : 'Baby'} photographer in <b>${c.name}, TX</b><small>${c.county} · ${c.drive}</small></span>${ui.arrow}</a></li>`)}</ul>
</div>`;
};

const moreCities = () => html`<div class="smap-col smap-col--wide reveal">
<h3>${icon('family')}Newborn &amp; baby photographer in more RGV cities</h3>
<ul>${AREAS.map((a) => html`<li><a href="/newborn-photographer-${a.slug}-tx/"><span class="smap-l">Newborn &amp; baby photographer in <b>${a.name}, TX</b><small>${a.county} · ${a.drive}</small></span>${ui.arrow}</a></li>`)}</ul>
</div>`;

export function sitemapPage(PAGES) {
  const page = {
    path: '/sitemap/',
    wpSlug: 'sitemap',
    wpTitle: 'Site Map',
    seo: {
      title: 'Site Map | Adrisabel Newborn & Baby Photography, McAllen TX',
      description: 'Every page on adrisabel.com: newborn, baby milestone, cake smash, maternity and beach sessions, local pages for 7 Rio Grande Valley cities, and booking.',
      focus: 'adrisabel photography site map',
      image: 'roses',
    },
    body: (ctx) => {
      const out = html`
${pageHero(ctx, {
  crumbs: [{ label: 'Site map' }],
  eyebrow: 'Site map',
  title: 'Everything, <em>in one place</em>',
  lede: 'Every page on adrisabel.com — our sessions, local pages for each Rio Grande Valley city, and everything you need to plan and book.',
  center: true,
  trust: false,
})}
<nav class="sec sec--tight smap-jump" aria-label="Site map sections" style="padding-top:0"><div class="wrap"><div class="areas">
<a href="#sm-sessions">${icon('camera')}Sessions</a><a href="#sm-local">${ui.pin}Local pages</a><a href="#sm-studio">${icon('heart')}The studio</a><a href="${BOOK_URL}">${icon('calendar')}Book</a>
</div></div></nav>

<section class="sec sec--blush" id="sm-sessions" aria-labelledby="sm-sessions-title">
<div class="wrap">
${secHead({ eyebrow: 'Photography sessions', title: 'Our <em>sessions</em>', lede: 'Newborn days, first smiles, the big first birthday and family time by the sea.', id: 'sm-sessions-title' })}
<div class="smap-tiles">${SESSIONS.map((s) => tile(ctx, s))}</div>
</div>
</section>

<section class="sec" id="sm-local" aria-labelledby="sm-local-title">
<div class="wrap">
${secHead({ eyebrow: 'Across the Rio Grande Valley', title: 'Find us near <em>you</em>', lede: `${B.studioLine} ${B.addressNote}`, id: 'sm-local-title' })}
<div class="smap-cols">${cityList('newborn')}${cityList('baby')}</div>
${moreCities()}
<p class="center mt"><a class="arrow-link" href="/areas-we-serve/">All areas we serve, by county ${ui.arrow}</a></p>
<p class="center mt"><a class="arrow-link" href="/south-padre-island-family-photography/">Family beach sessions on South Padre Island ${ui.arrow}</a></p>
</div>
</section>

<section class="sec sec--paper" id="sm-studio" aria-labelledby="sm-studio-title">
<div class="wrap">
${secHead({ eyebrow: 'Good to know', title: 'The <em>studio</em>', id: 'sm-studio-title' })}
<ul class="smap-info">${STUDIO.map((s, i) => html`<li class="reveal${i % 3 ? ' d' + (i % 3) : ''}"><a href="${s.path}"><span class="smap-ic">${icon(s.icon)}</span><span><b>${esc(s.name)}</b><small>${s.note}</small></span></a></li>`)}</ul>
<p class="smap-tech"><a href="/privacy-policy/">Privacy policy</a> · For search engines: <a href="/sitemap_index.xml">XML sitemap</a></p>
</div>
</section>

${finalCta()}
`;
      // every indexable page must be reachable from here
      const missing = PAGES.filter((p) => p.seo.robots !== 'noindex' && p.path !== page.path && p.path !== '/' && !out.includes(`href="${p.path}"`));
      if (missing.length) throw new Error(`/sitemap/ is missing: ${missing.map((p) => p.path).join(', ')}`);
      return out;
    },
  };
  return page;
}
