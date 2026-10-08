// Portfolio, About, Reviews, FAQ, Contact, Booking, Privacy + ad landing pages.
import { html, ui, icon, googleG, stars } from '../lib/html.mjs';
import { img } from '../lib/media.mjs';
import {
  pageHero, secHead, chapters, masonry, reviews, faq, finalCta, ctaBand, infoCards, aboutSplit, eyebrow,
  bookingWidget, ctaButtons, steps, homeHero, ribbon, trustBadges, gallery, areas, filmstrip, googleBadge,
} from '../lib/components.mjs';
import { FAQS, faqsFor } from '../data/faqs.mjs';
import { BUSINESS as B, BOOK_URL } from '../data/business.mjs';
import { REVIEWS } from '../data/reviews.mjs';
import { faqNode } from '../lib/schema.mjs';

const googleChip = '<span class="stars" aria-hidden="true">★★★★★</span> 5.0 on Google';

/* ------------------------------------------------------------------ */
export const portfolio = {
  path: '/portfolio/',
  wpSlug: 'portfolio',
  wpTitle: 'Portfolio',
  seo: {
    title: 'Newborn & Baby Photography Portfolio | Adrisabel, McAllen TX',
    description: 'Browse newborn, milestone, cake smash and family portraits by Adrisabel — soft, timeless photography from a private Rio Grande Valley studio.',
    focus: 'newborn photography portfolio mcallen',
    image: 'roses',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Portfolio' }],
  eyebrow: 'Portfolio',
  title: 'Every baby tells <em>a story</em>',
  lede: 'Real sessions, real families — gentle newborns, curious babies, big birthday smiles and growing families, photographed in our Rio Grande Valley studio.',
  center: true,
  ctaLabel: 'Book your session',
})}
<section class="sec sec--tight" aria-label="Photo gallery" style="padding-top:10px">
<div class="wrap">
${masonry(ctx, [
  ['roses', 'Newborn · Sunshine'], ['momKissTeal', 'Newborn with mom'], ['moonClasped', 'Baby milestone'], ['familyFour', 'Family · Wonderland'],
  ['cakeBlue', 'Cake Smash'], ['woodBowlLace', 'Newborn'], ['laceAwake', 'Newborn'], ['sister', 'Siblings'],
  ['beachLift', 'Seaside Beach'], ['heartBowl', 'Newborn'], ['dadKiss', 'Newborn with dad'], ['knitRomper', 'Baby milestone'],
  ['bearBonnetMoon', 'Newborn'], ['cakePink', 'Cake Smash'], ['twins', 'Twins'], ['redRoseSwing', 'Newborn'],
  ['parentsStanding', 'Newborn with parents'], ['basketSmile', 'Baby · Fairytale'], ['navySwing', 'Newborn'], ['beachToddler', 'Seaside Beach'],
  ['momOverheadRed', 'Newborn with mom'], ['pinkFloralBed', 'Newborn'], ['laceSmile', 'Baby'], ['santaMoonRed', 'Holiday newborn'],
  ['santaWreath', 'Holiday newborn'], ['brotherDino', 'Siblings'], ['tongueBonnet', 'Baby'], ['feetHands', 'Newborn details'],
  ['turtleSleep', 'Newborn'], ['cakeChoc', 'Cake Smash'], ['momFloral', 'Baby with mom'], ['crown', 'Newborn with parents'],
  ['family', 'Newborn with family'], ['bear', 'Newborn'], ['holiday', 'Holiday portrait'], ['handsRing', 'Newborn details'], ['santaBedNavy', 'Holiday baby'], ['handsFeet', 'Newborn details'],
])}
<p class="center mt"><a class="arrow-link" href="${B.instagram.url}" target="_blank" rel="noopener">See recent sessions on Instagram ${B.instagram.handle} ${ui.arrow}</a></p>
</div>
</section>
<section class="sec sec--blush" aria-labelledby="pf-sessions">
<div class="wrap">
${secHead({ eyebrow: 'Love what you see?', title: 'Choose your <em>chapter</em>', id: 'pf-sessions' })}
${chapters(ctx, null, { scroll: true })}
</div>
</section>
${ctaBand({ title: 'Let’s add your family’s <em>story</em>', text: 'Every session is unique, and your baby’s photos will be just as special. Reserve your date today.' })}
`,
};

/* ------------------------------------------------------------------ */
const VALUES = [
  ['heart', 'Safety first', 'Every pose is supported, every prop is clean, and every session is supervised. Your baby’s safety and comfort come before any photo.'],
  ['calendar', 'Patience always', 'Babies don’t follow schedules. If your little one needs to eat, sleep or be held, we pause — the session moves at their pace.'],
  ['family', 'Real connection', 'I genuinely adore the babies I photograph, and that connection shows in the images.'],
  ['sparkle', 'Timeless images', 'Soft, classic editing that will look just as beautiful in 20 years as it does today.'],
  ['gift', 'Stress-free experience', 'You bring the baby — I’ll take care of wraps, props, outfits, setup and all the patience in the world.'],
  ['star', 'Every family matters', 'First baby or fourth, every family gets my full attention, care and creativity.'],
];
export const about = {
  path: '/about/',
  wpSlug: 'about',
  wpTitle: 'About',
  seo: {
    title: 'About Adrisabel | Newborn & Baby Photographer in McAllen',
    description: 'Meet Adrisabel: 15+ years photographing hundreds of RGV babies with patience, safety and love. Learn about the studio and the Adrisabel experience.',
    focus: 'newborn photographer rgv',
    image: 'crown',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'About' }],
  eyebrow: 'Meet your photographer',
  title: 'Hi, I’m <em>Adrisabel</em>',
  lede: 'Newborn and baby photographer, baby lover, and the person who will treat your child like the most important little human in the world — because to me, they are.',
  photo: 'dadKiss', photo2: 'feetHands', chip: googleChip,
})}
<section class="sec" aria-labelledby="ab-story">
<div class="wrap wrap--text">
${eyebrow('The story behind the camera', 'eyebrow--left')}
<h2 class="h-sec" id="ab-story">15+ years, hundreds of babies, <em>one promise</em></h2>
<div class="prose mt">
<p>I’ve been photographing professionally for more than 15 years, and somewhere along the way I fell completely in love with newborn and baby photography. There’s nothing quite like cradling a week-old baby, gently settling them into a soft wrap, and creating an image their parents will treasure for the rest of their lives.</p>
<p>I’ve photographed hundreds of babies — each one unique, each session different, each family trusting me with something incredibly precious. That trust is something I never take lightly.</p>
<p>My approach is simple: patience first, safety always, and genuine love for every baby who comes through my studio. I don’t rush and I don’t force poses. I let your baby lead, and I capture the beauty that unfolds naturally.</p>
<p>When I’m not behind the camera, I’m probably planning my next set, curating new props, or daydreaming about tiny baby toes. This isn’t just my job — it’s the thing that lights me up every single day.</p>
</div>
<p class="signature">Adrisabel</p>
<p class="signature-sub">Owner &amp; lead photographer</p>
</div>
</section>
<section class="sec sec--blush" aria-labelledby="ab-values">
<div class="wrap">
${secHead({ eyebrow: 'What I believe in', title: 'The Adrisabel <em>promise</em>', id: 'ab-values' })}
${infoCards(VALUES.map(([ic, t, x]) => ({ icon: ic, title: t, text: x })), 'info-grid--3')}
</div>
</section>
<section class="sec" aria-labelledby="ab-studio">
<div class="wrap">
<div class="split split--rev">
<div class="split-media reveal"><div class="frame-photo">${img(ctx.media, 'familyFour', { sizes: '(min-width:900px) 520px, 92vw' })}</div></div>
<div class="split-body reveal d1">
${eyebrow('The studio', 'eyebrow--left')}
<h2 class="h-sec" id="ab-studio">Warm, calm &amp; <em>made for babies</em></h2>
<div class="prose">
<p>My studio is a warm, clean and comfortable space designed for babies and families, and I photograph families across the whole Rio Grande Valley — especially McAllen, Mission, Pharr, Edinburg and Brownsville. ${B.addressNote}</p>
<p>The studio is stocked with wraps, blankets, props, headbands, bonnets, baskets, little beds and outfits in soft, timeless colors — you don’t need to bring anything but your baby (and maybe a bottle and a few diapers).</p>
<p>I keep the room cozy for newborns, play soft music and keep the pace calm, so both baby and parents feel relaxed from the moment you walk in. This is your experience too, and I want you to remember it fondly.</p>
</div>
<div class="mt">${ctaButtons({ label: 'Plan your session', call: true })}</div>
</div>
</div>
</div>
</section>
<section class="sec sec--paper" aria-labelledby="ab-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'ab-reviews' })}
${reviews()}
</div></section>
<section class="sec" aria-labelledby="ab-how"><div class="wrap">
${secHead({ eyebrow: 'The Adrisabel experience', title: 'How the <em>magic</em> happens', id: 'ab-how' })}
${steps()}
</div></section>
${finalCta({ title: 'Let’s create something <em>beautiful</em>' })}
`,
};

/* ------------------------------------------------------------------ */
export const reviewsPage = {
  path: '/reviews/',
  wpSlug: 'reviews',
  wpTitle: 'Reviews',
  seo: {
    title: 'Reviews | Adrisabel Newborn & Baby Photography — 5.0 ★',
    description: 'Read what RGV parents say about their newborn and baby sessions with Adrisabel — rated 5.0 stars on Google. Patient, gentle and beautiful photos.',
    focus: 'adrisabel photography reviews',
    image: 'crown',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Reviews' }],
  eyebrow: 'Kind words',
  title: 'What parents are <em>saying</em>',
  lede: 'Nothing means more than the trust families place in us with their newest little ones. Here’s what they share on Google.',
  center: true, cta: false, trust: false,
})}
<section class="sec sec--tight" aria-label="Google reviews" style="padding-top:0">
<div class="wrap">
${reviews({ all: true, cta: false })}
<div class="center mt"><div class="btn-row center"><a class="btn" href="${B.google.url}" target="_blank" rel="noopener">Read all reviews on Google ${ui.arrow}</a><a class="btn btn--ghost" href="${B.google.writeReview}" target="_blank" rel="noopener">${googleG} Leave a review</a></div>
<p class="small muted mt-s">Had a session with us? Your review helps other RGV families find us — thank you!</p></div>
</div>
</section>
<section class="sec sec--blush" aria-labelledby="rv-sessions">
<div class="wrap">
${secHead({ eyebrow: 'Your turn', title: 'Start your <em>story</em>', id: 'rv-sessions' })}
${chapters(ctx, null, { scroll: true })}
</div>
</section>
${finalCta()}
`,
};

/* ------------------------------------------------------------------ */
const GROUPS = ['Booking & pricing', 'Your session', 'Your photos', 'Location'];
export const faqPage = {
  path: '/faq/',
  wpSlug: 'faq',
  wpTitle: 'FAQ',
  seo: {
    title: 'Newborn Photography FAQ | Adrisabel Photography McAllen',
    description: 'Answers about booking, deposits, safety, what to bring, outfits and when you’ll receive your photos — everything to know before your newborn or baby session.',
    focus: 'newborn photography faq',
    image: 'closeup',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'FAQ' }],
  eyebrow: 'Common questions',
  title: 'Frequently asked <em>questions</em>',
  lede: 'Everything you need to know before your newborn, baby, cake smash or beach session. Still wondering about something? Call or text <a class="text-link" href="tel:+14093543075">(409) 354-3075</a>.',
  center: true, trust: false,
})}
<section class="sec" aria-label="Questions and answers" style="padding-top:20px">
<div class="wrap">
${GROUPS.map((g) => html`<div class="faq-group"><h2>${g.replace('&', '&amp;')}</h2>${faq(FAQS.filter((f) => f.group === g))}</div>`)}
</div>
</section>
${ctaBand()}
`,
  schema: () => [faqNode('/faq/', FAQS)],
};

/* ------------------------------------------------------------------ */
const CONTACT_FAQ = faqsFor('contact');
export const contact = {
  path: '/contact/',
  wpSlug: 'contact',
  wpTitle: 'Contact',
  booking: true,
  seo: {
    title: 'Contact & Book | Adrisabel Photography, McAllen TX',
    description: 'Call or text (409) 354-3075, email, or send a booking request. Newborn, baby & family sessions in McAllen, Mission, Pharr, Brownsville & the whole RGV.',
    focus: 'contact newborn photographer mcallen',
    image: 'familyFour',
  },
  body: (ctx) => html`
${pageHero(ctx, {
  crumbs: [{ label: 'Contact' }],
  eyebrow: 'Let’s connect',
  title: 'Let’s plan your <em>session</em>',
  lede: 'Whether you’re expecting, just brought your baby home or planning a first birthday, I’d love to hear from you. We reply to every message within 24 hours.',
  center: true, cta: false,
})}
<section class="sec sec--tight" aria-labelledby="ct-details" style="padding-top:0">
<div class="wrap">
<h2 class="sr-only" id="ct-details">Contact details</h2>
${infoCards([
  { icon: 'heart', title: 'Call or text', html: `<p><a href="${B.phoneHref}">${B.phone}</a><br>Texting is perfect for quick questions.</p>` },
  { icon: 'photos', title: 'Email', html: `<p><a href="mailto:${B.email}">${B.email}</a><br>We reply within 24 hours.</p>` },
  { icon: 'pin', title: 'Service area', html: `<p>The whole Rio Grande Valley — especially McAllen, Mission, Pharr, Edinburg &amp; Brownsville.<br>${B.addressNote}</p>` },
  { icon: 'calendar', title: 'Hours', html: `<p>${B.hours}.<br>Sessions are scheduled by availability.</p>` },
], 'info-grid--4')}
<div class="center mt">${googleBadge()} <a class="g-badge" style="margin-left:6px" href="${B.instagram.url}" target="_blank" rel="noopener">${ui.instagram} ${B.instagram.handle}</a></div>
</div>
</section>
<section class="sec sec--blush" id="book" aria-labelledby="ct-book">
<div class="wrap">
${secHead({ eyebrow: 'Booking request', title: 'Request your <em>date</em>', lede: 'Three quick steps. No payment today — we’ll confirm everything with you personally.', id: 'ct-book' })}
${bookingWidget()}
</div>
</section>
<section class="sec" aria-labelledby="ct-faq"><div class="wrap">
${secHead({ eyebrow: 'Good to know', title: 'Before you <em>book</em>', id: 'ct-faq' })}
${faq(CONTACT_FAQ)}
</div></section>
`,
  schema: () => [faqNode('/contact/', CONTACT_FAQ)],
};

/* ------------------------------------------------------------------ */
const BOOK_FAQ = faqsFor('booking', 6);
export const booking = {
  path: '/fast-online-booking/',
  wpSlug: 'fast-online-booking',
  wpTitle: 'Fast Online Booking',
  booking: true,
  minimalHeader: true,
  sticky: false,
  seo: {
    title: 'Book Your Session Online | Adrisabel Photography',
    description: 'Request your newborn, baby, cake smash or beach session in under a minute. Pick your package and preferred date — we’ll confirm with you personally.',
    focus: 'book newborn photography session',
    image: 'roses',
  },
  body: (ctx) => html`
<section class="page-hero page-hero--center" style="padding-bottom:30px">
<div class="wrap wrap--narrow">
${eyebrow('Booking request')}
<h1 class="h-page">Request your <em>session</em></h1>
<p class="lede">Three quick steps — it takes less than a minute. No payment today.</p>
</div>
</section>
<section class="sec" style="padding-top:0" aria-label="Booking form">
<div class="wrap">${bookingWidget()}</div>
</section>
<section class="sec sec--blush" aria-labelledby="bk-next">
<div class="wrap">
${secHead({ eyebrow: 'What happens next', title: 'From request to <em>memories</em>', id: 'bk-next' })}
${steps()}
</div>
</section>
<section class="sec" aria-labelledby="bk-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'Loved by <em>RGV families</em>', id: 'bk-reviews' })}
${reviews()}
</div></section>
<section class="sec sec--paper" aria-labelledby="bk-faq"><div class="wrap">
${secHead({ eyebrow: 'Booking questions', title: 'Good to <em>know</em>', id: 'bk-faq' })}
${faq(BOOK_FAQ)}
</div></section>
`,
  schema: () => [faqNode('/fast-online-booking/', BOOK_FAQ)],
};

/* ------------------------------------------------------------------ */
// Paid-ads landing pages (kept at their existing URLs, noindex so they don't
// compete with the home page in search).
const landing = ({ path, wpSlug, wpTitle, title, description }) => ({
  path, wpSlug, wpTitle,
  seo: { title, description, focus: 'newborn photographer mcallen', robots: 'noindex', image: 'roses' },
  body: (ctx) => html`
${homeHero(ctx)}
${ribbon()}
<section class="sec sec--tight sec--white" aria-label="Why parents trust Adrisabel"><div class="wrap">${trustBadges()}</div></section>
<section class="sec sec--blush" aria-labelledby="lp-how"><div class="wrap">
${secHead({ eyebrow: 'How it works', title: 'A simple, gentle <em>experience</em>', lede: 'From the moment you reach out to the day your photos arrive — here’s what to expect.', id: 'lp-how' })}
${steps()}
</div></section>
${filmstrip(ctx, ['woodBowlLace', 'momKissTeal', 'moonClasped', 'cakeBlue', 'brotherSweater', 'heartBowl', 'swingGirl', 'beachLift'])}
<section class="sec" aria-labelledby="lp-sessions"><div class="wrap">
${secHead({ eyebrow: 'What we offer', title: 'Photography <em>sessions</em>', lede: 'Every session is designed with patience, safety and your baby’s comfort as the top priority.', id: 'lp-sessions' })}
${chapters(ctx, null, { scroll: true })}
</div></section>
${ctaBand()}
<section class="sec sec--paper" aria-labelledby="lp-reviews"><div class="wrap">
${secHead({ eyebrow: 'Kind words', title: 'What parents are <em>saying</em>', id: 'lp-reviews' })}
${reviews()}
</div></section>
<section class="sec" aria-label="Meet Adrisabel"><div class="wrap">${aboutSplit(ctx, { photo: 'twins', more: false })}</div></section>
<section class="sec sec--blush" aria-labelledby="lp-areas"><div class="wrap center">
${secHead({ eyebrow: 'Serving the RGV', title: 'Families from all over <em>the Valley</em>', id: 'lp-areas' })}
${areas()}
</div></section>
<section class="sec" aria-labelledby="lp-faq"><div class="wrap">
${secHead({ eyebrow: 'Common questions', title: 'Frequently <em>asked</em>', id: 'lp-faq' })}
${faq(faqsFor('home', 6))}
</div></section>
${finalCta()}
`,
});
export const landingBook = landing({ path: '/baby-photography-book/', wpSlug: 'baby-photography-book', wpTitle: 'Book Your Baby Photography Session', title: 'Book Your Baby Photography Session | Adrisabel, McAllen TX', description: 'Book a soft, timeless newborn or baby session in McAllen and the RGV — 15+ years, hundreds of babies, 5.0 ★ on Google. Request your date today.' });
export const landingSessions = landing({ path: '/baby-photography-sessions/', wpSlug: 'baby-photography-sessions', wpTitle: 'Newborn and Baby Photography Sessions in the RGV area', title: 'Newborn & Baby Photography Sessions in the RGV | Adrisabel', description: 'Newborn, baby milestone and cake smash sessions across the Rio Grande Valley — 15+ years, hundreds of babies, 5.0 ★ on Google. Book your session today.' });

/* ------------------------------------------------------------------ */
export const privacy = {
  path: '/privacy-policy/',
  wpSlug: 'privacy-policy',
  wpTitle: 'Privacy Policy',
  isNew: true,
  seo: {
    title: 'Privacy Policy | Adrisabel Photography',
    description: 'How Adrisabel Photography collects, uses and protects the information you share through our website and booking form.',
    focus: 'privacy policy',
    robots: 'noindex',
    image: null,
  },
  body: () => html`
<section class="page-hero page-hero--center" style="padding-bottom:20px"><div class="wrap wrap--narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep" aria-hidden="true">/</span><span aria-current="page">Privacy Policy</span></nav>
<h1 class="h-page">Privacy <em>policy</em></h1>
<p class="lede">Last updated: September 2026</p>
</div></section>
<section class="sec" style="padding-top:20px"><div class="wrap wrap--text prose">
<p>This policy explains what information ${B.name} (“we”, “us”) collects through adrisabel.com and how we use it. If you have any questions, contact us at <a href="mailto:${B.email}">${B.email}</a> or ${B.phone}.</p>
<h2>Information you give us</h2>
<p>When you send a booking request or contact us, we collect the details you choose to share — such as your name, phone number, email address, the session you’re interested in, your preferred date and time, your baby’s due date or birthday, and any notes. Booking requests are delivered to our inbox through our form provider, Formspree.</p>
<h2>How we use it</h2>
<ul><li>To reply to you, answer your questions and schedule your session.</li><li>To send you information about your booking and your photos.</li><li>To keep basic records of our sessions and payments.</li></ul>
<p>We do not sell your personal information.</p>
<h2>Analytics and advertising</h2>
<p>Our website uses Google Tag Manager and related Google tools to understand how visitors use the site and to measure our advertising (for example, whether a booking request was sent after clicking an ad). These tools may use cookies or similar technologies. You can manage cookies in your browser settings and learn more about how Google uses information at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">policies.google.com</a>.</p>
<h2>Your choices</h2>
<p>You may ask us to access, correct or delete the personal information you have shared with us by emailing <a href="mailto:${B.email}">${B.email}</a>.</p>
<h2>Children’s privacy</h2>
<p>Our website is intended for parents and guardians. We do not knowingly collect personal information directly from children.</p>
<h2>Changes</h2>
<p>We may update this policy from time to time. The date above shows when it was last changed.</p>
</div></section>
`,
  schemaBusiness: false,
};
void REVIEWS; void stars; void icon; void gallery; void BOOK_URL;
