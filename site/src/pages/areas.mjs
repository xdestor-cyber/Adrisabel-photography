// "Areas we serve" hub + one newborn & baby page for each extra Rio Grande Valley city.
// Every place name on these pages comes from researched, independently verified facts.
import { html, ui, icon, esc } from '../lib/html.mjs';
import { img } from '../lib/media.mjs';
import {
  pageHero, secHead, packages, gallery, reviews, faq, finalCta, infoCards, cityGrid, eyebrow, ctaButtons, bookHref, hoods, moreAreas, areaHref,
} from '../lib/components.mjs';
import { CITIES } from '../data/cities.mjs';
import { AREAS, COUNTIES } from '../data/areas.mjs';
import { BUSINESS as B } from '../data/business.mjs';
import { faqsFor } from '../data/faqs.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';

const googleChip = '<span class="stars" aria-hidden="true">★★★★★</span> 5.0 on Google';
const GALLERY_FILL = ['moonPink', 'dino', 'lavender', 'handsFeet', 'family', 'sister', 'swingBoy', 'bear'];

function areaFaq(a) {
  const general = [...faqsFor('city-newborn'), ...faqsFor('city-baby')]
    .filter((f, i, all) => all.indexOf(f) === i && !/cost|much|where are sessions/i.test(f.q))
    .filter((f) => /safe|early or late|pixie dust|best age|receive my photos/i.test(f.q));
  return [
    { q: `How far is the studio from ${a.name}?`, a: `${a.route} ${B.addressNote}` },
    ...a.faq,
    ...general,
  ];
}

function areaPage(a) {
  const path = areaHref(a);
  const FAQ = areaFaq(a);
  const [p0, p1, p2, p3] = a.photos;
  return {
    path,
    wpSlug: path.replace(/\//g, ''),
    wpTitle: `Newborn & Baby Photographer ${a.name} TX`,
    seo: { title: a.title, description: a.description, focus: a.focus, image: p0 },
    body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Areas we serve', href: '/areas-we-serve/' }, { label: `${a.name}, TX` }],
  eyebrow: `Newborn &amp; baby photographer · ${a.name}, TX`,
  title: `Newborn &amp; baby photographer in <em>${a.name}, TX</em>`,
  lede: a.intro,
  photo: p0, photo2: p1, chip: googleChip,
  ctaHref: bookHref('sunshine'),
  trust: [`<a href="${B.google.url}" target="_blank" rel="noopener"><span class="stars" aria-hidden="true">★★★★★</span> <b>5.0</b>&nbsp;on Google</a>`, '15+ years', `${a.drive} from ${a.name}`],
})}

<section class="sec" aria-labelledby="nb-title">
<div class="wrap">
<div class="split">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, p2, { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow(`Newborn photos · ${a.name}`, 'eyebrow--left')}
<h2 class="h-sec" id="nb-title">The first two weeks, <em>held forever</em></h2>
<div class="prose"><p>${a.newborn}</p><p>${a.why}</p></div>
<ul class="checks">${['Trained in safe newborn posing and handling', 'Wraps, outfits, props and backdrops provided', 'Choose your favorite images before you leave', 'Edited photos delivered within one week'].map((t) => html`<li>${icon('heart')}<span>${t}</span></li>`)}</ul>
</div>
</div>
</div>
</section>

<section class="sec sec--blush" aria-labelledby="pk-title">
<div class="wrap">
${secHead({ eyebrow: `Sessions for ${a.name} families`, title: 'Choose your <em>chapter</em>', id: 'pk-title' })}
${packages(ctx, ['sunshine', 'wonderland', 'fairytale', 'pixie-dust', 'cake-smash'])}
<p class="center mt"><span class="note" style="display:inline-block"><b>Twins?</b> Twin sessions can be added to any newborn package — includes 4 extra photos.</span></p>
</div>
</section>

<section class="sec" aria-labelledby="bb-title">
<div class="wrap">
<div class="split split--rev">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, p3, { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow(`Baby &amp; milestones · ${a.name}`, 'eyebrow--left')}
<h2 class="h-sec" id="bb-title">Smiles, sitting up <em>&amp; the big ONE</em></h2>
<div class="prose"><p>${a.baby}</p></div>
<p class="mt"><a class="arrow-link" href="/baby-milestone-photography/">Baby &amp; milestone sessions ${ui.arrow}</a></p>
<p class="mt"><a class="arrow-link" href="/cake-smash-photography/">Cake smash sessions ${ui.arrow}</a></p>
</div>
</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="hood-title">
<div class="wrap">
${secHead({ eyebrow: 'Neighborhoods we serve', title: `Around <em>${a.name}</em>`, lede: a.areas, id: 'hood-title' })}
${hoods(a.neighborhoods)}
<div class="mt">
${infoCards([
  { icon: 'pin', title: 'The drive', text: `${a.route} ${a.local}` },
  { icon: 'heart', title: 'Service area', text: `${B.studioLine} ${B.addressNote}` },
  { icon: 'calendar', title: 'Scheduling', text: `${B.hours}. Book in your second or third trimester — newborn sessions happen 5–14 days after birth.` },
  { icon: 'gift', title: 'Your photos', text: 'We help you choose your favorites at the end of the session. Every image is hand-edited and delivered within one week.' },
], 'info-grid--4')}
</div>
</div>
</section>

<section class="sec" aria-labelledby="gal-title">
<div class="wrap">
${secHead({ eyebrow: 'Recent sessions', title: 'So tiny, so <em>fleeting</em>', id: 'gal-title' })}
${gallery(ctx, [...a.photos, ...GALLERY_FILL.filter((k) => !a.photos.includes(k))].slice(0, 8))}
</div>
</section>

<section class="sec sec--blush" aria-labelledby="rv-title"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'rv-title' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="faq-title"><div class="wrap">
${secHead({ eyebrow: `${a.name} newborn &amp; baby photography`, title: 'Frequently <em>asked</em>', id: 'faq-title' })}
${faq(FAQ)}
</div></section>

<section class="sec sec--paper" aria-labelledby="near-title"><div class="wrap">
${secHead({ eyebrow: 'Also serving', title: 'Across the <em>Rio Grande Valley</em>', id: 'near-title' })}
${cityGrid()}
${moreAreas(a.slug)}
<div class="center mt">${ctaButtons({ label: 'Reserve your session', href: bookHref('sunshine'), center: true })}</div>
</div></section>

${finalCta()}
`,
    schema: () => [
      serviceNode({ path, name: `Newborn & baby photographer in ${a.name}, TX`, serviceType: 'Newborn photography', description: a.intro, packages: ['sunshine', 'wonderland', 'fairytale', 'pixie-dust', 'cake-smash'], area: `${a.name}, TX` }),
      faqNode(path, FAQ),
    ],
  };
}

export const AREA_PAGES = AREAS.map(areaPage);

/* ------------------------------------------------------------------ hub */
const HUB_FAQ = [
  { q: 'Where are sessions held?', a: `In our private studio in the McAllen area — ${B.addressNote.charAt(0).toLowerCase() + B.addressNote.slice(1)} Seaside Beach family sessions take place on <a href="/south-padre-island-family-photography/">South Padre Island</a>.` },
  { q: 'My town isn’t listed — can I still book?', a: `Of course. Adrisabel photographs families from all over the Rio Grande Valley. <a href="/fast-online-booking/">Send a booking request</a> or call/text <a href="${B.phoneHref}">${B.phone}</a> and we’ll help you plan your session.` },
  { q: 'How do I plan the drive with a newborn?', a: 'We schedule newborn sessions around your baby’s feeds, so you can feed right before you leave and again when you arrive. There’s no rush — the session moves at your baby’s pace.' },
  { q: 'When should I book?', a: 'Reach out during your second or third trimester so we can save a spot around your due date. Newborn portraits are best 5–14 days after birth.' },
];

const cityCard = (c) => html`<article class="area-card reveal">
<h3>${esc(c.name)}</h3>
<p class="area-meta">${c.slug === 'mcallen' ? 'Just minutes away' : `${esc(c.drive.charAt(0).toUpperCase() + c.drive.slice(1))} from McAllen`}</p>
${c.neighborhoods?.length ? html`<p class="area-hoods">${c.neighborhoods.map((n) => esc(n)).join(' · ')}</p>` : ''}
<p class="links">${c.page
  ? html`<a href="${c.page}">Newborn &amp; baby photographer in ${esc(c.name)}</a>`
  : html`<a href="/newborn-photographer-${c.slug}-tx/">Newborn photographer in ${esc(c.name)}</a><a href="/baby-photographer-${c.slug}-tx/">Baby photographer in ${esc(c.name)}</a>`}</p>
</article>`;

export const areasHub = {
  path: '/areas-we-serve/',
  wpSlug: 'areas-we-serve',
  wpTitle: 'Areas We Serve',
  seo: {
    title: 'Areas We Serve · Newborn & Baby Photographer RGV | Adrisabel',
    description: 'Newborn and baby photography for families in McAllen, Mission, Pharr, Edinburg, Brownsville and every corner of the Rio Grande Valley — find your city.',
    focus: 'newborn photographer rio grande valley',
    image: 'family',
  },
  body: (ctx) => {
    const all = [...CITIES, ...AREAS.map((a) => ({ ...a, page: areaHref(a) }))];
    return html`
${pageHero(ctx, {
  crumbs: [{ label: 'Areas we serve' }],
  eyebrow: 'Service area',
  title: 'Across the whole <em>Rio Grande Valley</em>',
  lede: `${B.studioLine} Find your city below — each page has the drive, nearby neighborhoods and everything you need to plan your session.`,
  center: true,
})}
<nav class="sec sec--tight" aria-label="Counties" style="padding-top:0"><div class="wrap"><div class="areas">
${COUNTIES.map((k) => html`<a href="#${k.id}">${ui.pin}${k.name}</a>`)}
<a href="/south-padre-island-family-photography/">${ui.pin}South Padre Island</a>
</div></div></nav>
${COUNTIES.map((k, i) => {
  const list = all.filter((c) => c.county === k.name);
  return html`<section class="sec${i % 2 ? '' : ' sec--blush'}" id="${k.id}" aria-labelledby="${k.id}-title">
<div class="wrap">
${secHead({ eyebrow: k.eyebrow, title: k.title, lede: k.lede, id: `${k.id}-title` })}
${list.length ? html`<div class="area-grid">${list.map(cityCard)}</div>` : ''}
${k.towns?.length ? html`<p class="area-also"><b>Also serving:</b> ${k.towns.join(' · ')}</p>` : ''}
</div>
</section>`;
})}
<section class="sec sec--paper" aria-labelledby="spi-title"><div class="wrap">
<div class="split">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, 'family', { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow('Family beach sessions', 'eyebrow--left')}
<h2 class="h-sec" id="spi-title">Sandy toes on <em>South Padre Island</em></h2>
<div class="prose"><p>Our Seaside Beach session brings the whole family to the sand on South Padre Island — 15 edited photos of sandy toes, salty kisses and ocean breeze.</p></div>
<p class="mt"><a class="arrow-link" href="/south-padre-island-family-photography/">Family beach sessions ${ui.arrow}</a></p>
</div>
</div>
</div></section>
<section class="sec" aria-labelledby="hub-faq"><div class="wrap">
${secHead({ eyebrow: 'Planning your session', title: 'Good to <em>know</em>', id: 'hub-faq' })}
${faq(HUB_FAQ)}
</div></section>
${finalCta()}
`;
  },
  schema: () => [
    serviceNode({
      path: '/areas-we-serve/', name: 'Newborn & baby photography across the Rio Grande Valley', serviceType: 'Newborn photography',
      description: 'Newborn, baby milestone, cake smash, maternity and family photography for families across the Rio Grande Valley, Texas.',
      packages: ['sunshine', 'wonderland', 'fairytale', 'pixie-dust', 'cake-smash', 'seaside-beach'],
    }),
    faqNode('/areas-we-serve/', HUB_FAQ),
  ],
};
