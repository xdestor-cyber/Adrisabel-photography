// Page building blocks. Every function returns an HTML string.
import { BUSINESS, NAV, BOOK_URL } from '../data/business.mjs';
import { PACKAGES, ADDONS, HOW } from '../data/packages.mjs';
import { REVIEWS } from '../data/reviews.mjs';
import { CITIES } from '../data/cities.mjs';
import { ART } from './art.generated.mjs';
import { html, esc, attrs, icon, art, spark, ui, googleG, stars, when } from './html.mjs';
import { img } from './media.mjs';

const B = BUSINESS;
export const bookHref = (id) => (id ? `${BOOK_URL}?session=${id}` : BOOK_URL);

/* ---------------- header / footer ---------------- */
export function header(ctx, { current = '', minimal = false } = {}) {
  const logo = ctx.media.logo();
  const isCur = (href) => (href === current ? ' aria-current="page"' : '');
  const brand = html`<a class="brand" href="/" aria-label="${esc(B.name)} — home"><img src="${logo.src}" width="38" height="38" alt="" decoding="async" loading="eager"><span class="brand-text"><span class="brand-name">Adrisabel</span><span class="brand-sub">Photography</span></span></a>`;
  if (minimal) {
    return html`<header class="adr adr-header minimal-header"><a class="skip-link" href="#adr-main">Skip to content</a><div class="wrap bar">${brand}<div class="header-actions"><a class="btn btn--ghost btn--sm" href="${B.phoneHref}" aria-label="Call or text ${B.phone}">${ui.phone}<span class="show-sm">Call</span><span class="hide-sm">${B.phone}</span></a></div></div></header>`;
  }
  const sessions = NAV[0].children;
  const navLinks = NAV.slice(1).filter((n) => n.href !== '/reviews/');
  return html`<header class="adr adr-header">
<a class="skip-link" href="#adr-main">Skip to content</a>
<div class="wrap bar">
${brand}
<nav class="nav" aria-label="Main">
<div class="nav-drop"><button type="button" aria-expanded="false" aria-controls="drop-sessions">Sessions ${ui.chevron}</button>
<div class="drop" id="drop-sessions">${sessions.map((s) => html`<a href="${s.href}"${isCur(s.href)}><span class="di">${icon(s.icon)}</span><b>${esc(s.label)}</b><small>${esc(s.note)}</small></a>`)}</div></div>
${navLinks.map((n) => html`<a href="${n.href}"${isCur(n.href)}>${esc(n.label)}</a>`)}
</nav>
<div class="header-actions">
<a class="header-phone" href="${B.phoneHref}">${ui.phone}${B.phone}</a>
<a class="btn header-cta" href="${BOOK_URL}">Book Now</a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span class="bars"><span></span><span></span><span></span></span></button>
</div>
</div>
<div class="mobile-menu" id="mobile-menu">
<div class="mm-group"><p class="mm-label">Sessions</p>${sessions.map((s) => html`<a class="mm-link" href="${s.href}">${esc(s.label)} <small>${esc(s.note.split(' · ').pop())}</small></a>`)}</div>
<div class="mm-group">${NAV.slice(1).map((n) => html`<a class="mm-link" href="${n.href}">${esc(n.label)}</a>`)}</div>
<div class="mm-cta"><a class="btn btn--block" href="${BOOK_URL}">Book your session</a><a class="btn btn--ghost btn--block" href="${B.phoneHref}">${ui.phone} Call or text ${B.phone}</a></div>
<p class="mm-contact"><a href="${B.instagram.url}" rel="noopener" target="_blank">Instagram ${B.instagram.handle}</a><a href="mailto:${B.email}">Email us</a></p>
</div>
</header>`;
}

export function footer(ctx, { sticky = true, stickyLabel = 'Book your session', stickyHref = BOOK_URL } = {}) {
  const logo = ctx.media.logo();
  const year = new Date().getFullYear();
  return html`<footer class="adr adr-footer">
<div class="wrap">
<div class="f-grid">
<div class="f-about">
<a class="brand" href="/"><img src="${logo.src}" width="44" height="44" alt="" loading="lazy" decoding="async"><span class="brand-text"><span class="brand-name">Adrisabel</span><span class="brand-sub">Photography</span></span></a>
<p>Soft, timeless newborn, baby and family portraits from a warm private studio in the Rio Grande Valley — 15+ years of experience and hundreds of babies photographed with patience, safety and love.</p>
<div class="f-social"><a href="${B.instagram.url}" target="_blank" rel="noopener" aria-label="Instagram ${B.instagram.handle}">${ui.instagram}</a><a href="${B.google.url}" target="_blank" rel="noopener" aria-label="Google reviews">${googleG}</a><a href="${B.phoneHref}" aria-label="Call ${B.phone}">${ui.phone}</a></div>
</div>
<div><h2>Sessions</h2><ul>${NAV[0].children.map((s) => html`<li><a href="${s.href}">${esc(s.label)}</a></li>`)}<li><a href="/pricing/">All sessions &amp; packages</a></li></ul></div>
<div><h2>Studio</h2><ul><li><a href="/about/">About Adrisabel</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/contact/">Contact</a></li><li><a href="${BOOK_URL}">Book online</a></li></ul></div>
<div><h2>Contact</h2><ul class="f-contact">
<li>${ui.phone}<a href="${B.phoneHref}">${B.phone}</a> · <a href="${B.sms}">text</a></li>
<li>${ui.mail}<a href="mailto:${B.email}">${B.email}</a></li>
<li>${ui.instagram}<a href="${B.instagram.url}" target="_blank" rel="noopener">${B.instagram.handle}</a></li>
<li>${ui.pin}<span>Serving McAllen &amp; the whole Rio Grande Valley, TX</span></li>
<li>${ui.clock}<span>${B.hours}</span></li>
</ul></div>
</div>
<div class="f-near">
<div><h2>Newborn photographer</h2><p class="f-areas">${CITIES.map((c) => html`<a href="/newborn-photographer-${c.slug}-tx/">${c.name}</a>`)}</p></div>
<div><h2>Baby photographer</h2><p class="f-areas">${CITIES.map((c) => html`<a href="/baby-photographer-${c.slug}-tx/">${c.name}</a>`)}</p></div>
<div><h2>Family beach sessions</h2><p class="f-areas"><a href="/south-padre-island-family-photography/">South Padre Island</a></p></div>
</div>
<div class="f-bottom"><span>© ${year} ${B.name} · Newborn, baby &amp; family photographer in McAllen, TX</span><span><a href="/privacy-policy/">Privacy policy</a></span></div>
</div>
${when(sticky, html`<div class="sticky-cta" aria-label="Quick actions"><a class="call" href="${B.phoneHref}">${ui.phone}Call</a><a class="btn" href="${stickyHref}">${stickyLabel}</a></div>`)}
</footer>`;
}

/* ---------------- small pieces ---------------- */
export const eyebrow = (t, cls = '') => `<p class="eyebrow ${cls}">${t}</p>`;
export const secHead = ({ eyebrow: e, title, lede, center = true, id }) => html`<div class="sec-head${center ? ' center' : ''} reveal">${when(e, eyebrow(e))}<h2 class="h-sec"${id ? ` id="${id}"` : ''}>${title}</h2>${when(lede, `<p class="lede">${lede}</p>`)}</div>`;
export const orn = () => `<div class="orn" aria-hidden="true">${spark()}</div>`;
export const trustLine = (items) => html`<p class="trust-line">${items.map((t, i) => (i ? `<span class="dot" aria-hidden="true"></span>` : '') + `<span>${t}</span>`)}</p>`;
export const googleTrust = () => `${stars()} <b>${B.google.rating}</b>&nbsp;on Google`;
export const crumbs = (items) => html`<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${items.map((it) => html`<span class="sep" aria-hidden="true">/</span>${it.href ? html`<a href="${it.href}">${esc(it.label)}</a>` : html`<span aria-current="page">${esc(it.label)}</span>`}`)}</nav>`;

export const ctaButtons = ({ label = 'Book your session', href = BOOK_URL, call = true, center = false, stack = false } = {}) =>
  html`<div class="${stack ? 'btn-stack' : 'btn-row'}${center ? ' center' : ''}"><a class="btn" href="${href}">${label} ${ui.arrow}</a>${when(call, html`<a class="btn btn--ghost" href="${B.phoneHref}">${ui.phone} Call or text</a>`)}</div>`;

/* ---------------- heroes ---------------- */
const REEL = ['roses', 'closeup', 'heartBasket', 'moonStars', 'swingGirl', 'twins', 'family', 'bear', 'moonPink', 'crown'];
export function reel(ctx, keys = REEL, { eager = 0, sizes = '170px' } = {}) {
  const half = Math.ceil(keys.length / 2);
  const track = (list, alt) => html`<div class="reel-track${alt ? ' alt' : ''}"${alt ? ' aria-hidden="true"' : ''}>${[...list, ...list].map((k, i) => html`<div class="reel-item"${!alt && i >= list.length ? ' aria-hidden="true"' : ''}>${img(ctx.media, k, { sizes, eager: !alt && i < eager, priority: !alt && eager > 0 && i === 0, alt: alt || i >= list.length ? '' : null })}</div>`)}</div>`;
  return html`<div class="reel" role="group" aria-label="Recent sessions"><div class="reel-mask">${track(keys, false)}${track([...keys.slice(half), ...keys.slice(0, half)], true)}</div></div>`;
}

export function homeHero(ctx) {
  return html`<section class="hero" aria-labelledby="hero-title">
<div class="hero-grid">
<div class="hero-copy">
<p class="hero-badge">${spark()}<span><strong>5.0 ★ on Google</strong> · 15+ years</span></p>
<div class="hero-reel-mobile">${reel(ctx, ['roses', 'closeup', 'heartBasket', 'moonStars', 'swingGirl', 'twins', 'family', 'bear'], { eager: 2 })}</div>
<h1 class="h-hero" id="hero-title"><span class="kw">Newborn &amp; Baby Photographer in McAllen, TX</span>Soft, timeless portraits of your <em>tiny miracle</em></h1>
<p class="lede">15+ years and hundreds of babies photographed with patience, safety and love. Newborn, baby and family sessions across the whole Rio Grande Valley — especially McAllen, Mission, Pharr and Brownsville.</p>
<div class="btn-stack"><a class="btn" href="${BOOK_URL}">Book your session ${ui.arrow}</a><a class="btn btn--ghost" href="${B.phoneHref}">${ui.phone} Call or text</a></div>
${trustLine(['Safe newborn posing', 'Props &amp; wardrobe included', 'Photos in 1 week'])}
</div>
<div class="hero-reel-desktop">${reel(ctx, REEL, { sizes: '(min-width:1080px) 280px, 1px' })}</div>
</div>
</section>`;
}

export function pageHero(ctx, { crumbs: cr, eyebrow: e, title, lede, photo, photo2, chip, cta = true, ctaLabel, ctaHref, center = false, trust }) {
  const media = photo ? html`<div class="page-hero-media reveal">
<div class="ph-main">${img(ctx.media, photo, { sizes: '(min-width:960px) 520px, 92vw', priority: true })}</div>
${when(photo2, () => html`<div class="ph-float">${img(ctx.media, photo2, { sizes: '(min-width:960px) 200px, 36vw' })}</div>`)}
${when(chip, `<p class="ph-chip">${chip}</p>`)}
</div>` : '';
  return html`<section class="page-hero${center ? ' page-hero--center' : ''}">
<div class="wrap${center ? ' wrap--narrow' : ''}">
<div class="${photo ? 'page-hero-grid' : ''}">
<div>
${when(cr, () => crumbs(cr))}
${when(e, eyebrow(e, center ? '' : 'eyebrow--left'))}
<h1 class="h-page">${title}</h1>
${when(lede, `<p class="lede">${lede}</p>`)}
${when(cta, () => ctaButtons({ label: ctaLabel || 'Book your session', href: ctaHref || BOOK_URL, center }))}
${when(trust !== false, () => trustLine(trust || [`<a href="${B.google.url}" target="_blank" rel="noopener">${googleTrust()}</a>`, '15+ years experience', 'Delivered in 1 week']))}
</div>
${media}
</div>
</div>
</section>`;
}

/* ---------------- ribbons & badges ---------------- */
export const ribbon = () => html`<section class="ribbon" aria-label="Adrisabel at a glance"><div class="wrap ribbon-grid">
<div><p class="num">15+</p><p class="lbl">Years of experience</p></div>
<div><p class="num">100s</p><p class="lbl">Of babies photographed</p></div>
<div><p class="num">5.0<span class="stars" aria-hidden="true">★★★★★</span></p><p class="lbl">Google rating</p></div>
<div><p class="num">1 week</p><p class="lbl">Photo delivery</p></div>
</div></section>`;

export const trustBadges = () => html`<div class="badges">
${[['heart', 'Trained in safe newborn posing'], ['sparkle', 'Warm, baby-safe private studio'], ['calendar', 'Unhurried sessions at baby’s pace'], ['gift', 'Wardrobe, wraps &amp; props included']]
  .map(([ic, t], i) => html`<div class="badge-item reveal${i ? ' d' + Math.min(i, 3) : ''}"><span class="bi">${icon(ic)}</span><p>${t}</p></div>`)}
</div>`;

/* ---------------- session packages (photo cards, no prices) ---------------- */
export function packageCard(ctx, p, { more = true, reveal = true, headingTag = 'h3' } = {}) {
  const showMore = more && p.page && p.page !== currentPath;
  return html`<article class="pcard${reveal ? ' reveal' : ''}" id="pkg-${p.id}">
<a class="pcard-media" href="${bookHref(p.id)}" tabindex="-1" aria-hidden="true">${img(ctx.media, p.cardPhoto, { sizes: '(min-width:1080px) 370px, (min-width:760px) 45vw, 84vw' })}<span class="pcard-badge">${icon(p.badge.icon)}${p.badge.text}</span></a>
<div class="pcard-body">
<p class="pcard-kicker">${p.kicker}</p>
<${headingTag} class="pcard-name">${p.name}</${headingTag}>
<p class="pcard-desc">${p.desc}</p>
<ul class="pcard-inc">${p.includes.map((t) => html`<li>${t}</li>`)}</ul>
<div class="spacer"></div>
<a class="btn btn--block" href="${bookHref(p.id)}">Book now ${ui.arrow}</a>
${when(showMore, html`<a class="pcard-more" href="${p.page}">Learn more about ${p.id === 'seaside-beach' ? 'beach sessions' : p.id === 'cake-smash' ? 'cake smash' : p.page.includes('newborn') ? 'newborn sessions' : 'baby sessions'}</a>`)}
</div>
</article>`;
}

export function packages(ctx, ids, { scroll = false, more = true, cls = '' } = {}) {
  const list = ids ? ids.map((id) => PACKAGES.find((p) => p.id === id)) : PACKAGES;
  const layout = scroll ? 'pkgs--scroll' : list.length === 2 ? 'pkgs--2' : list.length === 1 ? 'pkgs--1' : 'pkgs--grid';
  return html`<div class="pkgs ${layout} ${cls}">${list.map((p) => packageCard(ctx, p, { more, reveal: !scroll }))}</div>`;
}
// Older names kept so every page renders the new cards.
export const chapterCard = (ctx, p, opts = {}) => packageCard(ctx, p, opts);
export const pixieCard = (ctx, p, opts = {}) => packageCard(ctx, p, opts);
export const chapters = (ctx, ids, opts = {}) => packages(ctx, ids, opts);

// Pixie Dust schedules as simple text (no prices).
export function schedules() {
  return html`<div class="schedules">
<div class="schedule"><div class="schedule-top"><span>Option A</span></div><p class="months-list">1 · 3 · 5 · 7 · 9 <small>months</small></p></div>
<p class="or">or</p>
<div class="schedule"><div class="schedule-top"><span>Option B</span></div><p class="months-list">2 · 4 · 6 · 8 · 10 <small>months</small></p></div>
</div>`;
}

export function extrasCard(ctx) {
  return html`<article class="pcard reveal" id="pkg-extras">
<div class="pcard-media">${img(ctx.media, 'twins', { sizes: '(min-width:1080px) 370px, (min-width:760px) 45vw, 84vw' })}<span class="pcard-badge">${icon('heart')}Twins &amp; extras</span></div>
<div class="pcard-body">
<p class="pcard-kicker">Little extras</p>
<h3 class="pcard-name">Twins &amp; extra photos</h3>
<p class="pcard-desc">Twins? Double the love — twin sessions can be added to any package and include 4 extra photos. Can’t choose just a few? Extra edited photos can be added to any session.</p>
<div class="spacer"></div>
<a class="btn btn--block" href="${BOOK_URL}">Book now ${ui.arrow}</a>
</div>
</article>`;
}

export function addons(ctx) {
  return html`<div class="split">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, 'twins', { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow('Little extras', 'eyebrow--left')}
<h2 class="h-sec">Twins &amp; <em>extra photos</em></h2>
<div class="prose"><p><b>Twins?</b> Double the love! Twin sessions can be added to any package and include 4 extra photos.</p><p><b>Can’t choose just a few?</b> Extra edited photos can be added to any session — just tell us when you pick your favorites.</p></div>
<div class="mt">${ctaButtons({ label: 'Book now' })}</div>
</div>
</div>`;
}

/* ---------------- how it works ---------------- */
export function steps(list = HOW) {
  return html`<ol class="steps">${list.map((s, i) => html`<li class="step reveal${i ? ' d' + Math.min(i, 3) : ''}"><span class="si">${icon(s.icon)}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></li>`)}</ol>`;
}

/* ---------------- galleries ---------------- */
export function gallery(ctx, keys, { cls = '', sizes = '(min-width:900px) 25vw, 50vw', wideFirst = false } = {}) {
  return html`<div class="gallery ${cls}">${keys.map((k, i) => html`<figure class="reveal${i % 4 ? ' d' + (i % 4) : ''}${wideFirst && i === 0 ? '' : ''}">${img(ctx.media, k, { sizes: i === 0 && cls.includes('home') ? '(min-width:900px) 50vw, 50vw' : sizes })}</figure>`)}</div>`;
}
export function masonry(ctx, items) {
  return html`<div class="masonry">${items.map(([k, cap]) => html`<figure>${img(ctx.media, k, { sizes: '(min-width:1180px) 25vw, (min-width:760px) 33vw, 50vw' })}${when(cap, `<figcaption>${cap}</figcaption>`)}</figure>`)}</div>`;
}
export function filmstrip(ctx, keys) {
  return html`<div class="filmstrip" aria-hidden="true"><div class="reel-track">${[...keys, ...keys].map((k) => html`<div class="reel-item">${img(ctx.media, k, { sizes: '260px', alt: '' })}</div>`)}</div></div>`;
}

/* ---------------- about split ---------------- */
export function aboutSplit(ctx, { photo = 'crown', title = 'I don’t just photograph babies — <em>I adore them</em>', more = true, reverse = false } = {}) {
  return html`<div class="split${reverse ? ' split--rev' : ''}">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, photo, { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow('Meet Adrisabel', 'eyebrow--left')}
<h2 class="h-sec">${title}</h2>
<div class="prose">
<p>Hi, I’m Adrisabel. For more than 15 years I’ve had the honor of photographing hundreds of newborns and babies across the Rio Grande Valley, and I’ve built my whole approach around patience, safety and a calm, comfortable experience for baby and parents.</p>
<p>Every session in my studio is warm, unhurried and guided by your baby’s pace. No forced poses, no rushing — just soft, beautiful images of your baby exactly as they are right now, because this season is fleeting and it deserves to be honored.</p>
</div>
<ul class="checks">${['Trained in safe newborn posing and handling', 'Wraps, outfits, props and backdrops provided', 'You choose your favorites before you leave', 'Hand-edited images delivered within one week'].map((t) => html`<li>${icon('heart')}<span>${t}</span></li>`)}</ul>
<p class="signature">Adrisabel</p>
<p class="signature-sub">Owner &amp; lead photographer</p>
${when(more, html`<p class="mt"><a class="arrow-link" href="/about/">Get to know me ${ui.arrow}</a></p>`)}
</div>
</div>`;
}

/* ---------------- reviews ---------------- */
export const googleBadge = () => html`<a class="g-badge" href="${B.google.url}" target="_blank" rel="noopener">${googleG}<span>${B.google.rating}</span>${stars()}<span>${B.google.count} Google reviews</span></a>`;

// Which page is being rendered — lets review blocks rotate so neighbouring
// pages (e.g. the 14 city pages) don't all quote the same three reviews.
let currentPath = '/';
export const setCurrentPage = (page) => { currentPath = page.path; };
function pickReviews(n = 3) {
  if (currentPath === '/') return REVIEWS.slice(0, n);
  let h = 0;
  for (const ch of currentPath) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const start = h % REVIEWS.length;
  return Array.from({ length: n }, (_, i) => REVIEWS[(start + i) % REVIEWS.length]);
}
const reviewCard = (r, i) => html`<figure class="review reveal${i % 3 ? ' d' + (i % 3) : ''}">${stars()}<blockquote><p>${esc(r.text)}</p></blockquote><footer><span class="avatar" aria-hidden="true">${esc(r.name[0])}</span><div><cite>${esc(r.name)}</cite><span class="rv-meta">${googleG} Google review${r.translated ? ' · translated from Spanish' : ''}</span></div></footer></figure>`;

export function reviews({ all = false, cta = true } = {}) {
  const list = all ? REVIEWS : pickReviews(3);
  return html`<div class="center reveal" style="margin:-10px 0 26px">${googleBadge()}</div>
<div class="reviews${all ? ' reviews--all' : ''}">${list.map(reviewCard)}</div>
${when(cta, html`<p class="center mt"><a class="arrow-link" href="${B.google.url}" target="_blank" rel="noopener">Read all reviews on Google ${ui.arrow}</a></p>`)}`;
}

/* ---------------- areas ---------------- */
export function areas({ kind = 'newborn' } = {}) {
  return html`<div class="areas reveal">${CITIES.map((c) => html`<a href="/${kind === 'baby' ? 'baby' : 'newborn'}-photographer-${c.slug}-tx/">${ui.pin}${c.name}</a>`)}<a href="/south-padre-island-family-photography/">${ui.pin}South Padre Island</a><span>${ui.pin}San Juan</span><span>${ui.pin}Alamo</span><span>${ui.pin}Donna</span><span>${ui.pin}Mercedes</span></div>`;
}
export function cityGrid(exclude = null) {
  return html`<div class="city-grid">${CITIES.filter((c) => c.slug !== exclude).map((c) => html`<div class="city-card"><h3>${c.name}</h3><p>${c.county} · ${c.drive}</p><p class="links"><a href="/newborn-photographer-${c.slug}-tx/">Newborn photographer</a><a href="/baby-photographer-${c.slug}-tx/">Baby photographer</a></p></div>`)}</div>`;
}

/* ---------------- FAQ ---------------- */
export function faq(list, { openFirst = false } = {}) {
  return html`<div class="faq">${list.map((f, i) => html`<details${openFirst && i === 0 ? ' open' : ''}><summary>${f.q}<span class="pm" aria-hidden="true"></span></summary><div class="ans"><p>${f.a}</p></div></details>`)}</div>`;
}

/* ---------------- CTAs ---------------- */
export function ctaBand({ title = 'Ready to capture the <em>magic?</em>', text = 'Newborn days, first smiles, the big first birthday — reach out today and let’s plan the perfect session for your little one.', label = 'Save my spot', href = BOOK_URL } = {}) {
  return html`<section class="cta-band"><div class="wrap wrap--narrow reveal"><h2>${title}</h2><p>${text}</p><div class="btn-row"><a class="btn btn--light" href="${href}">${label} ${ui.arrow}</a><a class="btn btn--ghost" href="${B.phoneHref}">${ui.phone} ${B.phone}</a></div></div></section>`;
}
export function finalCta({ title = 'These moments won’t <em>last forever</em>', text = 'But your photos will. Reach out today to check availability and reserve your date — we’d love to capture this chapter with you.' } = {}) {
  return html`<section class="sec sec--blush final-cta"><div class="wrap wrap--narrow reveal">
<div class="heart">${icon('heart')}</div>
<h2 class="h-sec">${title}</h2>
<p class="lede center mt-s">${text}</p>
<div class="mt">${ctaButtons({ label: 'Book my session', center: true })}</div>
<p class="contact-line"><a href="${B.phoneHref}">${ui.phone}${B.phone}</a><a href="mailto:${B.email}">${ui.mail}${B.email}</a><a href="${B.instagram.url}" target="_blank" rel="noopener">${ui.instagram}${B.instagram.handle}</a></p>
</div></section>`;
}

/* ---------------- booking widget ---------------- */
const OFFERS = [
  ...PACKAGES.map((p) => ({
    id: p.id, name: p.name,
    desc: { sunshine: 'Newborn · baby only · 8 photos', wonderland: 'Newborn + siblings & parents · 15 photos', fairytale: 'Babies 2–11 months · 8 photos', 'pixie-dust': '5 milestone sessions in year one', 'cake-smash': 'First birthday · cake included', 'seaside-beach': 'Family beach session · South Padre Island' }[p.id],
    label: `${p.name} — ${p.type}`,
    newborn: p.id === 'sunshine' || p.id === 'wonderland', icon: { sunshine: 'heart', wonderland: 'family', fairytale: 'star', 'pixie-dust': 'sparkle', 'cake-smash': 'cake', 'seaside-beach': 'pin' }[p.id],
  })),
  { id: 'maternity', name: 'Maternity', desc: 'Bump portraits before baby arrives', label: 'Maternity Session', newborn: true, icon: 'heart' },
  { id: 'not-sure', name: 'Not sure yet', desc: 'Help me choose the right session', label: 'Not sure yet — help me choose', newborn: false, icon: 'sparkle' },
];

export function bookingWidget({ title = 'Choose your session' } = {}) {
  const times = [['9:00 AM – 11:00 AM', 'Morning', '9–11 AM'], ['11:00 AM – 1:00 PM', 'Midday', '11 AM–1 PM'], ['1:00 PM – 3:00 PM', 'Afternoon', '1–3 PM']];
  return html`<div class="booking" data-booking>
<div class="bk-progress" aria-label="Booking progress"><span class="bk-node is-active" data-n="1" aria-current="step">1</span><span class="bk-line" data-l="1"></span><span class="bk-node" data-n="2">2</span><span class="bk-line" data-l="2"></span><span class="bk-node" data-n="3">3</span></div>
<div class="bk-card">
<div class="bk-panel is-on" data-panel="1">
<h2 class="bk-title">${title}</h2>
<p class="bk-sub">Pick the session that fits your little one.</p>
<div class="bk-offers" role="radiogroup" aria-label="Session type">
${OFFERS.map((o, i) => html`<button type="button" class="bk-offer" role="radio" aria-checked="false" tabindex="${i ? -1 : 0}"${attrs({ 'data-id': o.id, 'data-offer': o.name, 'data-label': o.label, 'data-newborn': o.newborn ? '1' : '0' })}><span class="oi">${icon(o.icon)}</span><span><span class="on">${esc(o.name)}</span><span class="od">${esc(o.desc)}</span></span><span class="op" aria-hidden="true">${ui.arrow}</span></button>`)}
</div>
<div class="bk-actions"><button class="btn" id="bk-next1" type="button" disabled>Continue ${ui.arrow}</button></div>
</div>
<div class="bk-panel" data-panel="2">
<h2 class="bk-title">When would you like to come in?</h2>
<p class="bk-sub">Pick a preferred day and time — we’ll confirm availability with you personally.</p>
<span class="bk-label" id="bk-days-l">Preferred date</span>
<div class="bk-days" id="bk-days" role="group" aria-labelledby="bk-days-l"></div>
<span class="bk-label" id="bk-times-l">Preferred time</span>
<div class="bk-times" role="group" aria-labelledby="bk-times-l">${times.map(([v, a, b]) => html`<button type="button" class="bk-time" data-time="${v}" aria-pressed="false">${a} · ${b}</button>`)}</div>
<div class="bk-field" id="bk-due" hidden><label for="bk-due-input">Baby’s due date or birthday <small>(optional — helps us plan newborn timing)</small></label><input type="date" id="bk-due-input" name="due_date"></div>
<div class="bk-actions"><button class="btn btn--ghost" type="button" data-back="1">Back</button><button class="btn" id="bk-next2" type="button" disabled>Continue ${ui.arrow}</button></div>
</div>
<div class="bk-panel" data-panel="loading"><div class="bk-loading" role="status"><div class="sparks">${spark()}${spark()}${spark()}${spark()}${spark()}</div><p>Your baby’s story is loading…</p><div class="bk-bar"><i id="bk-fill"></i></div></div></div>
<div class="bk-panel" data-panel="3">
<h2 class="bk-title">Where can we reach you?</h2>
<p class="bk-sub">For your free consultation — every baby-session question answered.</p>
<div class="bk-field"><label for="bk-name">Full name</label><input type="text" id="bk-name" name="name" autocomplete="name" placeholder="Your name" required><p class="bk-msg" aria-live="polite"></p></div>
<div class="bk-field"><label for="bk-phone">Phone</label><input type="tel" id="bk-phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="(956) 555-0123" required><p class="bk-msg" aria-live="polite"></p></div>
<div class="bk-field"><label for="bk-email">Email</label><input type="email" id="bk-email" name="email" autocomplete="email" inputmode="email" placeholder="you@email.com" required><p class="bk-msg" aria-live="polite"></p></div>
<div class="bk-field"><label for="bk-notes">Anything we should know? <small>(optional)</small></label><textarea id="bk-notes" name="notes" rows="3" placeholder="Twins, siblings joining, a theme you love…"></textarea></div>
<div class="bk-hp" aria-hidden="true"><label for="bk-hp">Leave this empty</label><input type="text" id="bk-hp" name="_gotcha" tabindex="-1" autocomplete="off"></div>
<p class="note mt-s" id="bk-error" role="alert" hidden>Sorry — your request didn’t go through. Please try again, or call/text <a class="text-link" href="${B.phoneHref}">${B.phone}</a>.</p>
<div class="bk-actions"><button class="btn btn--ghost" type="button" data-back="2">Back</button><button class="btn" id="bk-submit" type="button" disabled>Send request</button></div>
<p class="small muted mt-s">No payment today. Your date is confirmed once we agree on the day and time and receive the 50% deposit via Zelle.</p>
</div>
<div class="bk-panel" data-panel="done"><div class="bk-done" role="status">
<div class="heart">${icon('heart')}</div>
<h2 class="bk-title">Thank you — request received!</h2>
<p>We’ll review it and contact you shortly to confirm everything.</p>
<p class="note mt-s">All bookings are confirmed once we agree on the exact date and time and receive your 50% deposit via Zelle 🤍</p>
<div class="bk-summary" id="bk-summary"></div>
<p class="mt"><a class="arrow-link" href="/pricing/">Browse the packages again ${ui.arrow}</a></p>
</div></div>
</div>
<div class="bk-trust"><span>${googleG} ${B.google.rating} on Google</span><span>${ui.heart} Hundreds of RGV babies</span><span>${ui.clock} Reply within 24 hours</span><span>${ui.lock} Your info stays private</span></div>
</div>`;
}

/* ---------------- info cards ---------------- */
export const infoCards = (cards, cls = '') => html`<div class="info-grid ${cls}">${cards.map((c, i) => html`<div class="info-card reveal${i ? ' d' + Math.min(i, 3) : ''}"><h3>${c.icon ? icon(c.icon) : ''}${c.title}</h3>${c.html ?? `<p>${c.text}</p>`}</div>`)}</div>`;

export const facts = (list) => html`<div class="facts">${list.map(([b, s]) => html`<div class="fact"><b>${b}</b><span>${s}</span></div>`)}</div>`;
