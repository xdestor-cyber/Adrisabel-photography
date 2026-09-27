import { html, ui } from '../lib/html.mjs';
import {
  homeHero, ribbon, trustBadges, secHead, chapters, gallery, steps, aboutSplit, reviews,
  areas, faq, ctaBand, finalCta, ctaButtons, addons, orn,
} from '../lib/components.mjs';
import { faqsFor } from '../data/faqs.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';

const FAQ = faqsFor('home', 8);

export default {
  path: '/',
  wpSlug: 'home',
  wpTitle: 'Home',
  seo: {
    title: 'Newborn Photographer McAllen, TX | Adrisabel Photography',
    description: 'Soft, timeless newborn, baby & family portraits in McAllen and the RGV. 15+ years, hundreds of babies, safe posing. Sessions from $230 — book today.',
    focus: 'newborn photographer mcallen',
    image: 'roses',
  },
  body: (ctx) => html`
${homeHero(ctx)}
${ribbon()}

<section class="sec sec--tight sec--white" aria-label="Why parents trust Adrisabel">
<div class="wrap">${trustBadges()}</div>
</section>

<section class="sec sec--blush" id="sessions" aria-labelledby="chapters-title">
<div class="wrap">
${secHead({ eyebrow: 'Sessions &amp; prices', title: 'Every baby is a story. Which <em>chapter</em> will you treasure forever?', lede: 'Six storybook sessions that follow your baby’s first year — from those sleepy newborn days to the big first birthday and a day at the beach.', id: 'chapters-title' })}
${chapters(ctx, null, { scroll: true })}
<div class="center mt">${ctaButtons({ label: 'Compare all packages', href: '/pricing/', call: false, center: true })}</div>
</div>
</section>

<section class="sec" aria-labelledby="portfolio-title">
<div class="wrap">
${secHead({ eyebrow: 'Portfolio', title: 'Soft, timeless &amp; <em>so tiny</em>', lede: 'A glimpse of recent newborn, milestone and family sessions from our Rio Grande Valley studio.', id: 'portfolio-title' })}
${gallery(ctx, ['roses', 'moonStars', 'heartBasket', 'swingGirl', 'crown', 'bear', 'twins', 'cake', 'moonPink'], { cls: 'gallery--home' })}
<p class="center mt"><a class="arrow-link" href="/portfolio/">View the full portfolio ${ui.arrow}</a></p>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="how-title">
<div class="wrap">
${secHead({ eyebrow: 'The Adrisabel experience', title: 'How the <em>magic</em> happens', lede: 'Simple, gentle and completely stress-free — from your first message to your finished gallery.', id: 'how-title' })}
${steps()}
</div>
</section>

<section class="sec" aria-label="About Adrisabel">
<div class="wrap">${aboutSplit(ctx)}</div>
</section>

<section class="sec sec--blush" aria-labelledby="reviews-title">
<div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'reviews-title' })}
${reviews()}
</div>
</section>

<section class="sec sec--tight" aria-labelledby="extras-title">
<div class="wrap">
${secHead({ eyebrow: 'Little extras', title: 'Twins &amp; <em>extra photos</em>', id: 'extras-title' })}
${addons()}
</div>
</section>

${ctaBand()}

<section class="sec" aria-labelledby="areas-title">
<div class="wrap center">
${secHead({ eyebrow: 'Serving the Rio Grande Valley', title: 'A newborn photographer <em>near you</em>', lede: 'Adrisabel covers the whole Rio Grande Valley — especially McAllen, Mission, Pharr and Brownsville.', id: 'areas-title' })}
${areas()}
</div>
</section>

<section class="sec sec--paper" aria-labelledby="faq-title">
<div class="wrap">
${secHead({ eyebrow: 'Common questions', title: 'Frequently <em>asked</em>', id: 'faq-title' })}
${faq(FAQ)}
<p class="center mt"><a class="arrow-link" href="/faq/">See all questions ${ui.arrow}</a></p>
</div>
</section>

${finalCta()}
`,
  schema: () => [
    serviceNode({ path: '/', name: 'Newborn & baby photography in McAllen, TX', serviceType: 'Newborn photography', description: 'Newborn, baby milestone, cake smash and family photography sessions in McAllen and the Rio Grande Valley.', packages: ['sunshine', 'wonderland', 'fairytale', 'pixie-dust', 'cake-smash', 'seaside-beach'] }),
    faqNode('/', FAQ),
  ],
};
