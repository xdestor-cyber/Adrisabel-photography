import { html } from '../lib/html.mjs';
import { pageHero, secHead, chapterCard, pixieCard, extrasCard, steps, faq, finalCta, infoCards, reviews } from '../lib/components.mjs';
import { faqsFor } from '../data/faqs.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';
import { PACKAGES, byId } from '../data/packages.mjs';

const FAQ = faqsFor('pricing');

export default {
  path: '/pricing/',
  wpSlug: 'pricing',
  wpTitle: 'Pricing',
  seo: {
    title: 'Newborn Photography Prices in McAllen, TX | Adrisabel',
    description: 'Every package, clearly priced: newborn from $230, family $300, milestone plan $1,000, cake smash $280 & South Padre beach $370. 50% deposit books.',
    focus: 'newborn photography prices mcallen',
    image: 'moonStars',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Pricing' }],
  eyebrow: 'Sessions &amp; pricing',
  title: 'Every baby is a story — <em>choose your chapter</em>',
  lede: 'Simple, transparent packages for every stage of your baby’s first year. Each one includes hand-edited photos, wardrobe and props from our studio collection, and delivery within one week.',
  center: true,
  ctaLabel: 'Request your date',
})}

<section class="sec sec--blush" aria-labelledby="packages-title" style="padding-top:40px">
<div class="wrap">
<h2 class="sr-only" id="packages-title">Photography packages</h2>
<div class="chapters chapters--grid">
${['sunshine', 'wonderland', 'fairytale'].map((id) => chapterCard(ctx, byId[id]))}
${pixieCard(ctx, byId['pixie-dust'], { wide: true })}
${['cake-smash', 'seaside-beach'].map((id) => chapterCard(ctx, byId[id]))}
${extrasCard(ctx)}
</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="good-title">
<div class="wrap">
${secHead({ eyebrow: 'Good to know', title: 'Booking, deposits &amp; <em>delivery</em>', id: 'good-title' })}
${infoCards([
  { icon: 'calendar', title: 'Reserve with 50%', text: 'A 50% deposit via Zelle saves your date. The remaining balance is due on session day.' },
  { icon: 'heart', title: 'Choose together', text: 'At the end of your session we help you pick your favorite images for editing — no homework afterwards.' },
  { icon: 'sparkle', title: 'Personally curated', text: 'No proof gallery is sent. Every image is hand-selected, curated and edited with care.' },
  { icon: 'gift', title: 'Ready in one week', text: 'Your edited images are delivered within one week of your session.' },
], 'info-grid--4')}
</div>
</section>

<section class="sec" aria-labelledby="how-title">
<div class="wrap">
${secHead({ eyebrow: 'Step by step', title: 'How the <em>magic</em> happens', id: 'how-title' })}
${steps()}
</div>
</section>

<section class="sec sec--blush" aria-labelledby="reviews-title">
<div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'Loved by <em>RGV families</em>', id: 'reviews-title' })}
${reviews()}
</div>
</section>

<section class="sec sec--paper" aria-labelledby="faq-title">
<div class="wrap">
${secHead({ eyebrow: 'Pricing questions', title: 'Before you <em>book</em>', id: 'faq-title' })}
${faq(FAQ)}
</div>
</section>

${finalCta({ title: 'Your once upon a time <em>starts here</em>' })}
`,
  schema: () => [
    serviceNode({ path: '/pricing/', name: 'Newborn, baby & family photography packages', serviceType: 'Portrait photography', description: 'Sunshine and Wonderland newborn sessions, Fairytale baby sessions, the Pixie Dust first-year milestone package, Cake Smash and Seaside Beach family sessions.', packages: PACKAGES.map((p) => p.id) }),
    faqNode('/pricing/', FAQ),
  ],
};
