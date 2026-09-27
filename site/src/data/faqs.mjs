// Frequently asked questions. Answers may contain simple HTML links.
// `tags` decide which pages show a question (every question appears on /faq/).

export const FAQS = [
  // ---- booking & pricing
  {
    q: 'How much does newborn photography cost?',
    a: 'Newborn sessions start at <b>$230</b> for <b>Sunshine</b> (baby only · 8 edited photos · 2 wardrobe changes · 2 backdrops). <b>Wonderland</b> is <b>$300</b> and adds siblings and parents (15 edited photos · 2 wardrobe changes · 4 backdrops). See every package on the <a href="/pricing/">pricing page</a>.',
    tags: ['home', 'booking', 'newborn', 'city-newborn', 'pricing'], group: 'Booking & pricing',
  },
  {
    q: 'How do I reserve my session?',
    a: 'Send a request through our <a href="/fast-online-booking/">online booking form</a> or call/text <a href="tel:+14093543075">(409) 354-3075</a>. We’ll confirm the date and time with you, and a <b>50% deposit via Zelle</b> reserves your spot. The balance is due on session day.',
    tags: ['home', 'booking', 'pricing', 'contact'], group: 'Booking & pricing',
  },
  {
    q: 'When should I book my newborn session?',
    a: 'Reach out during your second or third trimester so we can save a spot around your due date. Newborn portraits are best taken <b>5–14 days after birth</b>, when babies are sleepiest and most comfortable in those soft, curled-up poses.',
    tags: ['home', 'newborn', 'city-newborn', 'booking'], group: 'Booking & pricing',
  },
  {
    q: 'What if my baby arrives early or late?',
    a: 'That’s completely normal — babies keep their own schedule! Just let us know when your little one arrives and we’ll set your session within that ideal newborn window.',
    tags: ['newborn', 'city-newborn'], group: 'Booking & pricing',
  },
  {
    q: 'Do you photograph twins?',
    a: 'Yes — double the love! Add <b>$100</b> to any package for twins, and it includes <b>4 extra photos</b>.',
    tags: ['newborn', 'pricing', 'city-newborn'], group: 'Booking & pricing',
  },
  {
    q: 'Can I get more photos than my package includes?',
    a: 'Of course. Extra edited photos are <b>$30 each</b>, so you never have to leave a favorite behind.',
    tags: ['pricing', 'booking'], group: 'Booking & pricing',
  },
  // ---- sessions
  {
    q: 'How long does a newborn session take?',
    a: 'Newborn sessions usually take about 2–3 hours. We never rush — there’s time for feeding, cuddles, soothing and diaper changes, and your baby sets the pace.',
    tags: ['home', 'newborn', 'city-newborn'], group: 'Your session',
  },
  {
    q: 'Is newborn photography safe?',
    a: 'Safety comes before any photo. With 15+ years of experience and hundreds of babies photographed, Adrisabel is trained in safe newborn posing: every pose is supported, the studio is kept warm and clean, and a parent is always close by.',
    tags: ['home', 'newborn', 'city-newborn', 'about'], group: 'Your session',
  },
  {
    q: 'Do you provide outfits, wraps and props?',
    a: 'Yes. The studio is stocked with wraps, outfits, bonnets, headbands, little beds, baskets and backdrops in soft, timeless colors. You’re welcome to bring a meaningful item from home, too.',
    tags: ['newborn', 'baby', 'city-newborn', 'city-baby'], group: 'Your session',
  },
  {
    q: 'What should we bring to a newborn session?',
    a: 'Just your baby, feeding supplies, a pacifier if your baby uses one, and extra diapers. We take care of everything else.',
    tags: ['newborn', 'contact'], group: 'Your session',
  },
  {
    q: 'What is the Pixie Dust milestone package?',
    a: '<b>Pixie Dust</b> is <b>$1,000 total</b> for <b>5 sessions</b> during baby’s first year (babies 1–11 months). Choose one schedule — <b>Option A</b>: 1, 3, 5, 7 and 9 months, or <b>Option B</b>: 2, 4, 6, 8 and 10 months. Each session includes 8 edited images, 1 outfit and 1 backdrop, and siblings and parents are included. The 1-year Cake Smash is not included.',
    tags: ['baby', 'pricing', 'city-baby', 'home'], group: 'Your session',
  },
  {
    q: 'What is the best age for baby photos?',
    a: 'Every stage is worth celebrating! Our <b>Fairytale</b> session is made for babies <b>2–11 months</b> — the months of first smiles, giggles and sitting up — and <b>Cake Smash</b> celebrates the first birthday.',
    tags: ['baby', 'city-baby'], group: 'Your session',
  },
  {
    q: 'What’s included in the Cake Smash session?',
    a: '<b>Cake Smash</b> is <b>$280</b> and includes <b>1 timeless cake</b>, <b>8 edited photos</b> and <b>1 timeless backdrop</b>. Just bring your birthday baby (and maybe a change of clothes for the ride home).',
    tags: ['cake', 'pricing', 'city-baby'], group: 'Your session',
  },
  {
    q: 'Do you offer beach sessions?',
    a: 'Yes! Our <b>Seaside Beach</b> family session is <b>$370</b> at <b>South Padre Island</b> and includes <b>15 edited photos</b>. See the <a href="/south-padre-island-family-photography/">beach session page</a> for details.',
    tags: ['beach', 'pricing', 'home'], group: 'Your session',
  },
  {
    q: 'Do you offer maternity photos?',
    a: 'Yes — maternity portraits are a beautiful way to begin your baby’s story, and many moms book their newborn session at the same time. Send us a message and we’ll share maternity details and availability.',
    tags: ['maternity'], group: 'Your session',
  },
  // ---- photos
  {
    q: 'How do I choose my photos?',
    a: 'At the end of your session we sit together and help you pick your favorite images for editing. There’s no proof gallery to sort through at home — every image is hand-selected, curated and edited with care.',
    tags: ['home', 'booking', 'pricing', 'newborn', 'baby'], group: 'Your photos',
  },
  {
    q: 'When will I receive my photos?',
    a: 'Your edited images are delivered <b>within one week</b> of your session.',
    tags: ['home', 'booking', 'pricing', 'newborn', 'baby', 'city-newborn', 'city-baby'], group: 'Your photos',
  },
  // ---- location
  {
    q: 'Where are sessions held?',
    a: 'We serve families across the whole Rio Grande Valley — especially McAllen, Mission, Pharr, Edinburg and Brownsville. The exact session location is shared after booking.',
    tags: ['home', 'contact', 'city-newborn', 'city-baby'], group: 'Location',
  },
  {
    q: 'What areas do you serve?',
    a: 'The whole Rio Grande Valley — McAllen, Mission, Pharr, Edinburg, Brownsville, Harlingen, Weslaco, San Juan, Alamo, Donna, Mercedes and beyond — and our Seaside Beach sessions take place on South Padre Island.',
    tags: ['home', 'contact'], group: 'Location',
  },
];

export const faqsFor = (tag, limit = 99) => FAQS.filter((f) => f.tags.includes(tag)).slice(0, limit);
