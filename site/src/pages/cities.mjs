// 14 local landing pages (newborn + baby photographer × 7 RGV cities).
import { html, ui, icon } from '../lib/html.mjs';
import { img } from '../lib/media.mjs';
import { pageHero, secHead, packages, gallery, reviews, faq, finalCta, infoCards, cityGrid, eyebrow, ctaButtons, bookHref, hoods, moreAreas } from '../lib/components.mjs';
import { CITIES } from '../data/cities.mjs';
import { byId } from '../data/packages.mjs';
import { BUSINESS as B } from '../data/business.mjs';
import { faqsFor } from '../data/faqs.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';

const googleChip = '<span class="stars" aria-hidden="true">★★★★★</span> 5.0 on Google';

function cityFaq(c, kind) {
  const nb = kind === 'newborn';
  const own = [
    { q: `How far is the studio from ${c.name}?`, a: `${c.route} ${B.addressNote}` },
    nb
      ? { q: `Which newborn sessions do you offer in ${c.name}?`, a: 'Two newborn packages: <b>Sunshine</b> (baby only · 8 edited photos · 2 outfits · 2 backdrops) and <b>Wonderland</b> with siblings and parents (15 edited photos · 2 outfits · 4 backdrops). Twins can be added to any package and include 4 extra photos. Send a booking request or call/text (409) 354-3075 for current details.' }
      : { q: `Which baby sessions do you offer in ${c.name}?`, a: '<b>Fairytale</b> for babies 2–11 months (8 edited photos · 2 outfits · 2 backdrops), the <b>Pixie Dust</b> plan with 5 milestone sessions in baby’s first year, and <b>Cake Smash</b> for the first birthday with the cake included. Send a booking request or call/text (409) 354-3075 for current details.' },
    nb
      ? { q: `When should ${c.name} parents book a newborn session?`, a: 'Reach out during your second or third trimester. Newborn portraits are best 5–14 days after birth, and we’ll schedule your session as soon as your baby arrives.' }
      : { q: `What’s the best age for a baby session in ${c.name}?`, a: 'Any month is a milestone! Fairytale sessions are for babies 2–11 months, Pixie Dust follows five milestones from 1 to 10 months, and Cake Smash celebrates the first birthday.' },
  ];
  const general = faqsFor(nb ? 'city-newborn' : 'city-baby').filter((f) => !/cost|much/i.test(f.q)).slice(0, 4);
  return [...own, ...general];
}

function cityPage(c, kind) {
  const nb = kind === 'newborn';
  const d = nb ? c.newborn : c.baby;
  const path = `/${nb ? 'newborn' : 'baby'}-photographer-${c.slug}-tx/`;
  const service = nb ? 'Newborn' : 'Baby';
  const FAQ = cityFaq(c, kind);
  return {
    path,
    wpSlug: path.replace(/\//g, ''),
    wpTitle: `${service} Photographer ${c.name} TX`,
    breadcrumbs: [{ label: nb ? 'Newborn Photography' : 'Baby & Milestone Photography', href: nb ? '/newborn-photography/' : '/baby-milestone-photography/' }],
    crumbLabel: `${c.name}, TX`,
    seo: {
      // the home page already owns "Newborn Photographer McAllen, TX"; city pages can override their title
      title: (nb ? c.newbornTitle : c.babyTitle) || `${service} Photographer ${c.name}, TX | Adrisabel Photography`,
      description: nb
        ? `Newborn photographer for ${c.name}, TX families — gentle, safe posing, 15+ years’ experience, baby-led sessions and edited photos delivered in 1 week.`
        : `Baby & milestone photographer for ${c.name}, TX: Fairytale baby sessions, the Pixie Dust first-year milestone plan and Cake Smash first birthdays.`,
      focus: (nb ? c.newbornFocus : c.babyFocus) || `${kind} photographer ${c.name.toLowerCase()} tx`,
      image: d.photos[0],
    },
    body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: nb ? 'Newborn Photography' : 'Baby & Milestones', href: nb ? '/newborn-photography/' : '/baby-milestone-photography/' }, { label: `${c.name}, TX` }],
  eyebrow: `${service} photographer · ${c.name}, TX`,
  title: `${service} photographer in <em>${c.name}, TX</em>`,
  lede: d.intro,
  photo: d.photos[0], photo2: d.photos[1], chip: googleChip,
  ctaHref: bookHref(nb ? 'sunshine' : 'fairytale'),
  trust: [`<a href="${B.google.url}" target="_blank" rel="noopener"><span class="stars" aria-hidden="true">★★★★★</span> <b>5.0</b>&nbsp;on Google</a>`, '15+ years', `${c.drive} from ${c.name}`],
})}

<section class="sec" aria-labelledby="why-title">
<div class="wrap">
<div class="split">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, d.photos[2], { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow(`Why ${c.name} families choose Adrisabel`, 'eyebrow--left')}
<h2 class="h-sec" id="why-title">${nb ? 'Gentle hands for <em>tiny days</em>' : 'Every chapter of <em>year one</em>'}</h2>
<div class="prose"><p>${d.why}</p><p>${c.local}</p></div>
<ul class="checks">${(nb
  ? ['Trained in safe newborn posing and handling', 'Wraps, outfits, props and backdrops provided', 'Choose your favorite images before you leave', 'Edited photos delivered within one week']
  : ['Playful, baby-led sessions with plenty of breaks', 'Outfits, props and sweet little sets for every age', 'Siblings and parents welcome in Pixie Dust', 'Edited photos delivered within one week']).map((t) => html`<li>${icon('heart')}<span>${t}</span></li>`)}</ul>
</div>
</div>
</div>
</section>

<section class="sec sec--blush" aria-labelledby="pk-title">
<div class="wrap">
${secHead({ eyebrow: `${service} sessions for ${c.name} families`, title: nb ? 'Choose your newborn <em>chapter</em>' : 'Pick a moment — or <em>the whole year</em>', id: 'pk-title' })}
${nb
  ? html`${packages(ctx, ['sunshine', 'wonderland'])}<p class="center mt"><span class="note" style="display:inline-block"><b>Twins?</b> Twin sessions can be added to any package — includes 4 extra photos.</span></p>`
  : html`${packages(ctx, ['fairytale', 'pixie-dust', 'cake-smash'])}`}
</div>
</section>

<section class="sec" aria-labelledby="visit-title">
<div class="wrap">
${secHead({ eyebrow: `${c.name} neighborhoods we serve`, title: `Coming from <em>${c.name}</em>`, lede: c.areas, id: 'visit-title' })}
${hoods(c.neighborhoods)}
<div class="mt">
${infoCards([
  { icon: 'pin', title: 'The drive', text: c.route },
  { icon: 'heart', title: 'Service area', text: `${B.studioLine} ${B.addressNote}` },
  { icon: 'calendar', title: 'Scheduling', text: `${B.hours}. ${nb ? 'Book in your second or third trimester — newborn sessions happen 5–14 days after birth.' : 'Book a few weeks ahead so we can plan around naps.'}` },
  { icon: 'gift', title: 'Your photos', text: 'We help you choose your favorites at the end of the session. No proof gallery — every image is hand-edited and delivered within one week.' },
], 'info-grid--4')}
</div>
</div>
</section>

<section class="sec sec--paper" aria-labelledby="gal-title">
<div class="wrap">
${secHead({ eyebrow: 'Recent sessions', title: nb ? 'So tiny, so <em>fleeting</em>' : 'Look who’s <em>growing</em>', id: 'gal-title' })}
${gallery(ctx, [...d.photos, ...(nb ? ['moonPink', 'dino', 'lavender', 'handsFeet'] : ['family', 'sister', 'santa', 'bear']).filter((k) => !d.photos.includes(k))].slice(0, 8))}
<p class="center mt"><a class="arrow-link" href="${nb ? '/newborn-photography/' : '/baby-milestone-photography/'}">${nb ? 'All about newborn sessions' : 'All about baby & milestone sessions'} ${ui.arrow}</a></p>
</div>
</section>

<section class="sec sec--blush" aria-labelledby="rv-title"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'rv-title' })}
${reviews()}
</div></section>

<section class="sec" aria-labelledby="faq-title"><div class="wrap">
${secHead({ eyebrow: `${c.name} ${kind} photography`, title: 'Frequently <em>asked</em>', id: 'faq-title' })}
${faq(FAQ)}
</div></section>

<section class="sec sec--paper" aria-labelledby="near-title"><div class="wrap">
${secHead({ eyebrow: 'Also serving', title: 'Across the <em>Rio Grande Valley</em>', id: 'near-title' })}
${cityGrid(c.slug)}
${moreAreas()}
<div class="center mt">${ctaButtons({ label: nb ? 'Reserve your newborn session' : 'Reserve your baby session', href: bookHref(nb ? 'sunshine' : 'fairytale'), center: true })}</div>
</div></section>

${finalCta()}
`,
    schema: () => [
      serviceNode({ path, name: `${service} photographer in ${c.name}, TX`, serviceType: `${service} photography`, description: d.intro, packages: nb ? ['sunshine', 'wonderland'] : ['fairytale', 'pixie-dust', 'cake-smash'], area: `${c.name}, TX` }),
      faqNode(path, FAQ),
    ],
  };
}

export const CITY_PAGES = CITIES.flatMap((c) => [cityPage(c, 'newborn'), cityPage(c, 'baby')]);
