// Service pages: newborn, baby & milestones, cake smash, maternity, beach.
import { html, ui, icon, art } from '../lib/html.mjs';
import { img } from '../lib/media.mjs';
import {
  pageHero, secHead, chapters, chapterCard, pixieCard, gallery, reviews, areas, faq, finalCta, ctaBand,
  trustBadges, infoCards, facts, bookHref, ctaButtons, eyebrow, schedules,
} from '../lib/components.mjs';
import { faqsFor, FAQS } from '../data/faqs.mjs';
import { byId, ADDONS } from '../data/packages.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';

const googleChip = '<span class="stars" aria-hidden="true">★★★★★</span> 5.0 on Google';

/* ------------------------------------------------------------------ */
const NEWBORN_FAQ = faqsFor('newborn');
export const newborn = {
  path: '/newborn-photography/',
  wpSlug: 'newborn-photography',
  wpTitle: 'Newborn Photography',
  seo: {
    title: 'Newborn Photography in McAllen, TX | Adrisabel Photography',
    description: 'Gentle, safe newborn photography in a warm McAllen-area studio. Sunshine ($230) & Wonderland ($300) sessions, props included, photos in 1 week.',
    focus: 'newborn photography mcallen',
    image: 'crown',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Newborn Photography' }],
  eyebrow: 'Newborn photography · McAllen, TX',
  title: 'Gentle newborn photography in <em>McAllen, TX</em>',
  lede: 'Soft wraps, dreamy little setups and safe, supported posing for babies in their first weeks — in a warm private studio minutes from McAllen, Pharr, Edinburg and Mission.',
  photo: 'crown', photo2: 'closeup', chip: googleChip,
  trust: false,
})}
<section class="sec sec--tight" aria-label="Newborn session at a glance"><div class="wrap">${facts([['5–14 days', 'the ideal newborn age'], ['2–3 hours', 'unhurried &amp; baby-led'], ['From $230', 'wraps &amp; props included'], ['1 week', 'edited photo delivery']])}</div></section>

<section class="sec sec--blush" aria-labelledby="nb-packages">
<div class="wrap">
${secHead({ eyebrow: 'Newborn packages', title: 'Two newborn <em>chapters</em>', lede: 'Choose baby-only portraits with Sunshine, or bring the whole family into the story with Wonderland.', id: 'nb-packages' })}
<div class="chapters chapters--grid" style="max-width:820px;margin:0 auto">${['sunshine', 'wonderland'].map((id) => chapterCard(ctx, byId[id], { more: false }))}</div>
<p class="center mt"><span class="note" style="display:inline-block">${icon('heart', 'style="width:18px;height:18px;display:inline-block;vertical-align:-3px"')} <b>Twins?</b> Add $100 to any package — includes 4 extra photos.</span></p>
</div>
</section>

<section class="sec" aria-labelledby="nb-expect">
<div class="wrap">
<div class="split">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, 'heartBasket', { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow('What to expect', 'eyebrow--left')}
<h2 class="h-sec" id="nb-expect">A calm, cozy session <em>at baby’s pace</em></h2>
<div class="prose">
<p><b>Before:</b> reach out during your second or third trimester and we’ll save a spot around your due date. When your little one arrives, just send us a message and we’ll set the session for those sleepy first 5–14 days.</p>
<p><b>During:</b> the studio is warm and quiet, and everything is ready before you walk in — wraps, bonnets, headbands, little beds, baskets and backdrops. We pause for feeding, cuddles and diaper changes whenever your baby needs, and every pose is gently supported.</p>
<p><b>After:</b> before you leave, we help you choose your favorite images. There’s no proof gallery to sort through at home — every photo is hand-selected, curated and edited, and delivered within one week.</p>
</div>
<div class="mt">${ctaButtons({ label: 'Reserve your newborn session', href: bookHref('sunshine'), call: false })}</div>
</div>
</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="nb-safety">
<div class="wrap">
${secHead({ eyebrow: 'Safety first', title: 'Your baby is in the <em>gentlest hands</em>', lede: 'With 15+ years of experience and hundreds of babies photographed, safety and comfort come before any photo. Every pose is supported, the studio is kept warm and clean, and a parent is always close by.', id: 'nb-safety' })}
${trustBadges()}
</div>
</section>

<section class="sec" aria-labelledby="nb-gallery">
<div class="wrap">
${secHead({ eyebrow: 'Newborn portfolio', title: 'So tiny, so <em>fleeting</em>', id: 'nb-gallery' })}
${gallery(ctx, ['roses', 'closeup', 'lavender', 'bear', 'dino', 'moonPink', 'twins', 'handsFeet'])}
<p class="center mt"><a class="arrow-link" href="/portfolio/">See the full portfolio ${ui.arrow}</a></p>
</div>
</section>

<section class="sec sec--blush" aria-labelledby="nb-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What newborn parents <em>say</em>', id: 'nb-reviews' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="nb-areas"><div class="wrap center">
${secHead({ eyebrow: 'Newborn photographer near you', title: 'Serving families across <em>the RGV</em>', id: 'nb-areas' })}
${areas({ kind: 'newborn' })}
</div></section>

<section class="sec sec--paper" aria-labelledby="nb-faq"><div class="wrap">
${secHead({ eyebrow: 'Newborn questions', title: 'Frequently <em>asked</em>', id: 'nb-faq' })}
${faq(NEWBORN_FAQ)}
</div></section>

${finalCta()}
`,
  schema: () => [
    serviceNode({ path: '/newborn-photography/', name: 'Newborn photography in McAllen, TX', serviceType: 'Newborn photography', description: 'Newborn portrait sessions for babies 5–14 days old with safe, supported posing, wraps and props included, in a private Rio Grande Valley studio.', packages: ['sunshine', 'wonderland'] }),
    faqNode('/newborn-photography/', NEWBORN_FAQ),
  ],
};

/* ------------------------------------------------------------------ */
const BABY_FAQ = faqsFor('baby');
const MILESTONES = [
  ['1–2 months', 'Sleepy snuggles, tiny hands and those very first smiles.'],
  ['3–4 months', 'Head up, giggles and big, curious eyes.'],
  ['5–6 months', 'Rolling, reaching and sitting with a little help.'],
  ['7–8 months', 'Sitting up on their own and so much personality.'],
  ['9–10 months', 'Crawling, pulling up and busy, happy explorers.'],
];
export const baby = {
  path: '/baby-milestone-photography/',
  wpSlug: 'baby-milestone-photography',
  wpTitle: 'Baby & Milestone Photography',
  seo: {
    title: 'Baby & Milestone Photography McAllen, TX | Adrisabel',
    description: 'Baby photos for 2–11 months with Fairytale ($230), or the Pixie Dust plan: 5 milestone sessions in baby’s first year for $1,000. McAllen & the RGV.',
    focus: 'baby photographer mcallen',
    image: 'moonStars',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Baby & Milestone Photography' }],
  eyebrow: 'Baby &amp; milestone photography',
  title: 'Baby &amp; milestone photos in <em>McAllen, TX</em>',
  lede: 'First smiles, sitting up, crawling, standing — babies change every month. Capture a chapter with a Fairytale session, or follow the whole first year with our Pixie Dust milestone plan.',
  photo: 'moonStars', photo2: 'swingGirl', chip: googleChip,
  trust: false,
})}
<section class="sec sec--tight" aria-label="Baby sessions at a glance"><div class="wrap">${facts([['2–11 months', 'Fairytale session ages'], ['$230', 'Fairytale · 8 photos'], ['5 sessions', 'Pixie Dust · $1,000 total'], ['1 week', 'edited photo delivery']])}</div></section>

<section class="sec sec--blush" aria-labelledby="bb-packages">
<div class="wrap">
${secHead({ eyebrow: 'Baby packages', title: 'Pick a moment — or <em>the whole year</em>', id: 'bb-packages' })}
<div class="chapters chapters--grid chapters--pair">${chapterCard(ctx, byId.fairytale, { more: false })}${pixieCard(ctx, byId['pixie-dust'], { compact: true, more: false })}</div>
</div>
</section>

<section class="sec sec--night" aria-labelledby="bb-milestones">
<div class="wrap">
${secHead({ eyebrow: 'Pixie Dust schedules', title: 'Five little moons, <em>five milestones</em>', lede: 'Choose Option A (1, 3, 5, 7 and 9 months) or Option B (2, 4, 6, 8 and 10 months). Each session brings a new look, a new backdrop and lots of love — and siblings and parents are included.', id: 'bb-milestones' })}
${schedules()}
<ol class="steps steps--5">${MILESTONES.map(([m, t], i) => html`<li class="step reveal${i ? ' d' + Math.min(i, 3) : ''}" style="background:rgba(255,255,255,.05);border-color:rgba(235,203,139,.3)"><span class="si" style="background:rgba(235,203,139,.14)">${icon('star')}</span><div><h3 style="color:#FFF8EC">${m}</h3><p style="color:rgba(244,238,230,.8)">${t}</p></div></li>`)}</ol>
<p class="center mt" style="color:rgba(244,238,230,.8)">The 1-year Cake Smash is a separate session — <a class="text-link" style="color:#F3DEAA" href="/cake-smash-photography/">see Cake Smash</a>.</p>
</div>
</section>

<section class="sec" aria-labelledby="bb-expect">
<div class="wrap">
<div class="split split--rev">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, 'swingBoy', { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow('Your baby session', 'eyebrow--left')}
<h2 class="h-sec" id="bb-expect">Real smiles, <em>zero pressure</em></h2>
<div class="prose">
<p>Babies don’t smile on command — and they don’t have to. Sessions are built around your baby’s mood, with play breaks, snacks and silly songs, so real expressions happen naturally.</p>
<p>Two wardrobe changes and two backdrops are included with Fairytale, and the studio has outfits, props and sweet little sets for every stage. At the end of the session we help you choose your favorites, and your edited photos arrive within one week.</p>
</div>
<div class="mt">${ctaButtons({ label: 'Reserve a baby session', href: bookHref('fairytale'), call: false })}</div>
</div>
</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="bb-gallery"><div class="wrap">
${secHead({ eyebrow: 'Baby portfolio', title: 'Look who’s <em>smiling now</em>', id: 'bb-gallery' })}
${gallery(ctx, ['moonStars', 'swingGirl', 'swingBoy', 'holiday', 'cake', 'family', 'sister', 'santa'])}
</div></section>

<section class="sec sec--blush" aria-labelledby="bb-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'Loved by <em>RGV families</em>', id: 'bb-reviews' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="bb-areas"><div class="wrap center">
${secHead({ eyebrow: 'Baby photographer near you', title: 'Serving families across <em>the RGV</em>', id: 'bb-areas' })}
${areas({ kind: 'baby' })}
</div></section>

<section class="sec sec--paper" aria-labelledby="bb-faq"><div class="wrap">
${secHead({ eyebrow: 'Baby session questions', title: 'Frequently <em>asked</em>', id: 'bb-faq' })}
${faq(BABY_FAQ)}
</div></section>

${finalCta()}
`,
  schema: () => [
    serviceNode({ path: '/baby-milestone-photography/', name: 'Baby & milestone photography in McAllen, TX', serviceType: 'Baby photography', description: 'Fairytale baby sessions for 2–11 months and the Pixie Dust package of five milestone sessions during baby’s first year.', packages: ['fairytale', 'pixie-dust'] }),
    faqNode('/baby-milestone-photography/', BABY_FAQ),
  ],
};

/* ------------------------------------------------------------------ */
const CAKE_FAQ = [...faqsFor('cake'), ...FAQS.filter((f) => ['How do I reserve my session?', 'When will I receive my photos?', 'Can I get more photos than my package includes?'].includes(f.q))];
export const cake = {
  path: '/cake-smash-photography/',
  wpSlug: 'cake-smash-photography',
  wpTitle: 'Cake Smash Photography',
  seo: {
    title: 'Cake Smash Photography McAllen, TX | Adrisabel',
    description: 'Celebrate the big ONE! First-birthday cake smash sessions in McAllen — $280 with a timeless cake, 8 edited photos and a timeless backdrop.',
    focus: 'cake smash photography mcallen',
    image: 'cake',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Cake Smash Photography' }],
  eyebrow: 'First birthday · Cake smash',
  title: 'Cake smash photography in <em>McAllen, TX</em>',
  lede: 'Then comes the big ONE! Frosting on the nose, giggles and the sweetest mess — a timeless first-birthday session with the cake already taken care of.',
  photo: 'cake', photo2: 'holiday', chip: googleChip,
  ctaHref: bookHref('cake-smash'), ctaLabel: 'Reserve Cake Smash',
  trust: false,
})}
<section class="sec sec--tight" aria-label="Cake smash at a glance"><div class="wrap">${facts([['$280', 'cake included'], ['8', 'edited photos'], ['1', 'timeless backdrop'], ['1 week', 'photo delivery']])}</div></section>

<section class="sec sec--blush" aria-labelledby="cs-package">
<div class="wrap">
<div class="split">
<div class="reveal" style="max-width:420px;margin:0 auto;width:100%">${chapterCard(ctx, byId['cake-smash'], { more: false, reveal: false, headingTag: 'h2' })}</div>
<div class="split-body reveal d1">
${eyebrow('How it works', 'eyebrow--left')}
<h2 class="h-sec" id="cs-package">Sweet, simple &amp; <em>so much fun</em></h2>
<div class="prose">
<p>Your Cake Smash session includes <b>one timeless cake</b>, <b>one timeless backdrop</b> and <b>eight edited photos</b> of your birthday baby enjoying every crumb.</p>
<p>We keep the setup clean and classic so the photos feel special for years — not just this birthday. Let your little one explore at their own pace: some dive right in, others take a careful first poke. Both make wonderful pictures.</p>
</div>
<ul class="checks">${['Plan the session around nap time for the happiest baby', 'Bring a favorite outfit and a change of clothes for the ride home', 'Siblings love to watch — just let us know who’s coming', 'Choose your favorite images before you leave'].map((t) => html`<li>${icon('heart')}<span>${t}</span></li>`)}</ul>
</div>
</div>
</div>
</section>

<section class="sec" aria-labelledby="cs-pair">
<div class="wrap">
${secHead({ eyebrow: 'Before the big day', title: 'Celebrate the <em>whole first year</em>', lede: 'Many families photograph the months leading up to the first birthday with our Pixie Dust milestone plan, then finish the story with Cake Smash (booked separately).', id: 'cs-pair' })}
<div class="chapters chapters--grid" style="max-width:1000px;margin:0 auto">${pixieCard(ctx, byId['pixie-dust'], { wide: true })}</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="cs-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'cs-reviews' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="cs-faq"><div class="wrap">
${secHead({ eyebrow: 'Cake smash questions', title: 'Frequently <em>asked</em>', id: 'cs-faq' })}
${faq(CAKE_FAQ)}
</div></section>

${finalCta({ title: 'Then comes <em>the big ONE!</em>', text: 'First birthdays only happen once. Reserve your Cake Smash date today and let’s make it sweet.' })}
`,
  schema: () => [
    serviceNode({ path: '/cake-smash-photography/', name: 'Cake smash photography in McAllen, TX', serviceType: 'Cake smash photography', description: 'First-birthday cake smash session with one timeless cake, one timeless backdrop and eight edited photos.', packages: ['cake-smash'] }),
    faqNode('/cake-smash-photography/', CAKE_FAQ),
  ],
};

/* ------------------------------------------------------------------ */
const MAT_FAQ = [...faqsFor('maternity'), ...FAQS.filter((f) => ['When should I book my newborn session?', 'How do I reserve my session?', 'Where is the studio?'].includes(f.q))];
export const maternity = {
  path: '/maternity-photography/',
  wpSlug: 'maternity-photography',
  wpTitle: 'Maternity Photography',
  seo: {
    title: 'Maternity Photographer McAllen, TX | Adrisabel Photography',
    description: 'Elegant maternity portraits in McAllen and the Rio Grande Valley. Celebrate your bump, then plan your newborn session with the same photographer.',
    focus: 'maternity photographer mcallen',
    image: 'handsFeet',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Maternity Photography' }],
  eyebrow: 'Maternity photography',
  title: 'Maternity portraits in <em>McAllen, TX</em>',
  lede: 'Celebrate the chapter before your baby arrives — soft, elegant portraits of your bump, your partner and the little ones who are about to become big siblings.',
  photo: 'handsFeet', photo2: 'family', chip: googleChip,
  ctaHref: bookHref('maternity'), ctaLabel: 'Ask about maternity',
  trust: false,
})}
<section class="sec sec--blush" aria-labelledby="mt-plan">
<div class="wrap">
${secHead({ eyebrow: 'Planning your session', title: 'Glowing, timeless &amp; <em>so you</em>', id: 'mt-plan' })}
${infoCards([
  { icon: 'calendar', title: 'When to schedule', text: 'Most moms love their maternity photos around 28–34 weeks, when the bump is beautifully round and you’re still comfortable.' },
  { icon: 'hanger', title: 'What to wear', text: 'Studio gowns are available, and we’ll help you plan outfits and colors that feel like you.' },
  { icon: 'family', title: 'Bring your people', text: 'Partners and big brothers or sisters are welcome — some of the sweetest images are the ones where everyone is waiting together.' },
  { icon: 'heart', title: 'Newborn next', text: 'Booking maternity is the perfect time to reserve your newborn session too, so we can plan around your due date.' },
], 'info-grid--4')}
</div>
</section>

<section class="sec" aria-labelledby="mt-newborn">
<div class="wrap">
${secHead({ eyebrow: 'Continue the story', title: 'From bump to <em>baby</em>', lede: 'After your baby arrives, choose Sunshine for baby-only portraits or Wonderland to bring the whole family in.', id: 'mt-newborn' })}
<div class="chapters chapters--grid" style="max-width:820px;margin:0 auto">${['sunshine', 'wonderland'].map((id) => chapterCard(ctx, byId[id]))}</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="mt-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'mt-reviews' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="mt-faq"><div class="wrap">
${secHead({ eyebrow: 'Maternity questions', title: 'Frequently <em>asked</em>', id: 'mt-faq' })}
${faq(MAT_FAQ)}
</div></section>

${finalCta({ title: 'Your baby’s story <em>begins now</em>', text: 'Send us a message about maternity portraits and we’ll share details, availability and everything you need to plan.' })}
`,
  schema: () => [
    serviceNode({ path: '/maternity-photography/', name: 'Maternity photography in McAllen, TX', serviceType: 'Maternity photography', description: 'Maternity portrait sessions in a private Rio Grande Valley studio, with studio gowns available and partners and siblings welcome.' }),
    faqNode('/maternity-photography/', MAT_FAQ),
  ],
};

/* ------------------------------------------------------------------ */
const BEACH_FAQ = [...faqsFor('beach'), ...FAQS.filter((f) => ['How do I reserve my session?', 'How do I choose my photos?', 'When will I receive my photos?', 'Can I get more photos than my package includes?'].includes(f.q))];
export const beach = {
  path: '/south-padre-island-family-photography/',
  wpSlug: 'south-padre-island-family-photography',
  wpTitle: 'South Padre Island Family Photography',
  isNew: true,
  seo: {
    title: 'South Padre Island Family Photographer | Adrisabel',
    description: 'Seaside Beach family sessions on South Padre Island — $370 with 15 edited photos. Sandy toes, salty kisses and ocean breeze with Adrisabel.',
    focus: 'south padre island family photographer',
    image: 'family',
  },
  body: (ctx) => html`
<section class="page-hero page-hero--center">
<div class="wrap wrap--narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">South Padre Island Family Photography</span></nav>
${eyebrow('Chapter Six · Seaside Beach')}
<h1 class="h-page">Family beach photos on <em>South Padre Island</em></h1>
<p class="lede">Sandy toes &amp; salty kisses. A relaxed family session on the beach at South Padre Island — babies, big kids, grandparents and all — with 15 edited photos to remember it by.</p>
<div class="chapter-art reveal" style="max-width:420px;margin:26px auto 0;--wash:url(${ctx.media.file('wash-aqua')})">${art('seaside', 'Illustration of a family on the beach at South Padre Island')}</div>
${ctaButtons({ label: 'Reserve Seaside Beach', href: bookHref('seaside-beach'), center: true })}
</div>
</section>

<section class="sec sec--tight" aria-label="Beach session at a glance"><div class="wrap">${facts([['$370', 'Seaside Beach session'], ['15', 'edited photos'], ['South Padre', 'Island location'], ['1 week', 'photo delivery']])}</div></section>

<section class="sec sec--blush" aria-labelledby="bc-package">
<div class="wrap">
<div class="split">
<div style="max-width:420px;margin:0 auto;width:100%">${chapterCard(ctx, byId['seaside-beach'], { more: false, headingTag: 'h2' })}</div>
<div class="split-body reveal d1">
${eyebrow('What to expect', 'eyebrow--left')}
<h2 class="h-sec" id="bc-package">Barefoot, breezy &amp; <em>beautiful</em></h2>
<div class="prose">
<p>Beach sessions are all about connection: walking hand in hand by the water, little feet in the sand, cuddles in the ocean breeze. We guide you gently the whole time, so even the littlest ones stay happy and relaxed.</p>
<p>We’ll plan the date and time with you for the softest light of the day, and share the exact meeting spot on the island when you book. After the session you’ll choose your favorite images, and your 15 edited photos arrive within one week.</p>
</div>
<ul class="checks">${['Soft, coordinating colors look beautiful by the water', 'Bring a towel, water and a change of clothes for the kids', 'Grandparents and extended family are welcome', 'Twins? Add $100 — includes 4 extra photos'].map((t) => html`<li>${icon('heart')}<span>${t}</span></li>`)}</ul>
</div>
</div>
</div>
</section>

<section class="sec" aria-labelledby="bc-more">
<div class="wrap">
${secHead({ eyebrow: 'The rest of the story', title: 'More <em>chapters</em> for your family', lede: 'Many families pair a beach session with a studio newborn or milestone session.', id: 'bc-more' })}
${chapters(ctx, ['wonderland', 'fairytale', 'pixie-dust'], { scroll: true })}
</div>
</section>

<section class="sec sec--paper" aria-labelledby="bc-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'bc-reviews' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="bc-faq"><div class="wrap">
${secHead({ eyebrow: 'Beach session questions', title: 'Frequently <em>asked</em>', id: 'bc-faq' })}
${faq(BEACH_FAQ)}
</div></section>

${finalCta({ title: 'Sandy toes &amp; <em>salty kisses</em>', text: 'Reserve your Seaside Beach session and let’s plan a sweet evening by the ocean with your whole family.' })}
`,
  schema: () => [
    serviceNode({ path: '/south-padre-island-family-photography/', name: 'Family beach photography on South Padre Island', serviceType: 'Family photography', description: 'Seaside Beach family photo session on South Padre Island with 15 edited photos.', packages: ['seaside-beach'], area: 'South Padre Island, TX' }),
    faqNode('/south-padre-island-family-photography/', BEACH_FAQ),
  ],
};
void ADDONS; void ctaBand;
