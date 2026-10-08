// Session packages — keep exactly in sync with the client brief (the same
// facts appear in the "Once Upon a Tiny Time" promo video, video/js/scenes.js).

export const PACKAGES = [
  {
    id: 'sunshine', roman: 'I', chapter: 'Chapter One', name: 'Sunshine',
    kicker: 'Newborn session', desc: 'All about your newborn — sleepy, curled-up portraits in soft wraps and dreamy little setups, best in the first 5–14 days.', includes: ['8 edited photos', '2 outfits', '2 backdrops'], cardPhoto: 'lavender',
    price: 230, priceLabel: '$230', type: 'Newborn Session',
    badge: { icon: 'heart', text: 'Baby only' },
    headline: 'Hello, little sunshine.',
    art: 'sunshine', wash: 'butter', photo: 'closeup',
    stats: [['camera', '8', 'edited photos'], ['hanger', '2', 'wardrobe changes'], ['backdrop', '2', 'backdrops']],
    blurb: 'All about your baby: those sleepy, curled-up first days captured in soft wraps and dreamy setups.',
    bestFor: 'Newborns, ideally 5–14 days old',
    page: '/newborn-photography/',
  },
  {
    id: 'wonderland', roman: 'II', chapter: 'Chapter Two', name: 'Wonderland',
    kicker: 'Newborn & family session', desc: 'Your newborn plus the people who love them most — sweet portraits with big brothers and sisters, mom and dad.', includes: ['15 edited photos', '2 outfits', '4 backdrops'], cardPhoto: 'brotherSweater',
    price: 300, priceLabel: '$300', type: 'Newborn, Baby & Family Session',
    badge: { icon: 'family', text: 'Baby, siblings & parents' },
    headline: 'Welcome to the family.',
    art: 'wonderland', wash: 'lavender', photo: 'family',
    stats: [['camera', '15', 'edited photos'], ['hanger', '2', 'wardrobe changes'], ['backdrop', '4', 'backdrops']],
    blurb: 'Everyone who loves this baby, in one frame: baby portraits plus sweet moments with siblings, mom and dad.',
    bestFor: 'Newborns and babies with the whole family',
    page: '/newborn-photography/',
  },
  {
    id: 'fairytale', roman: 'III', chapter: 'Chapter Three', name: 'Fairytale',
    kicker: 'Baby session · 2–11 months', desc: 'First smiles, giggles and sitting up — playful portraits for the months when personality blooms.', includes: ['8 edited photos', '2 outfits', '2 backdrops'], cardPhoto: 'swingGirl',
    price: 230, priceLabel: '$230', type: 'Baby Session',
    badge: { icon: 'star', text: 'Babies 2–11 months old' },
    headline: 'Look who’s smiling now!',
    art: 'fairytale', wash: 'sky', photo: 'swingGirl',
    stats: [['camera', '8', 'edited photos'], ['hanger', '2', 'wardrobe changes'], ['backdrop', '2', 'backdrops']],
    blurb: 'First smiles, first giggles, sitting up on their own — the months when personality blooms.',
    bestFor: 'Babies 2–11 months old',
    page: '/baby-milestone-photography/',
  },
  {
    id: 'pixie-dust', roman: 'IV', chapter: 'Chapter Four', name: 'Pixie Dust',
    kicker: 'First-year milestone plan', desc: 'Five milestone sessions across baby’s first year — months 1, 3, 5, 7 & 9 or 2, 4, 6, 8 & 10. Siblings and parents included.', includes: ['5 sessions', '8 edited photos each', 'New outfit & backdrop each time'], cardPhoto: 'moonStars',
    price: 1000, priceLabel: '$1,000', unit: 'total', type: 'Milestone Package',
    badge: { icon: 'family', text: 'Siblings & parents included' },
    headline: 'Every little milestone of their first year…',
    art: 'moons', photo: 'moonStars', night: true,
    stats: [['camera', '8', 'edited images per session'], ['hanger', '1', 'outfit per session'], ['backdrop', '1', 'backdrop per session']],
    sessions: 5,
    line: 'New look, new backdrop, lots of love — every session.',
    options: [
      { label: 'Option A', months: [1, 3, 5, 7, 9] },
      { label: 'Option B', months: [2, 4, 6, 8, 10] },
    ],
    fine: ['5 sessions total · for babies 1–11 months old', 'Cake Smash (1-year session) not included'],
    blurb: 'Five milestone sessions across baby’s first year — choose one schedule and watch them grow, chapter by chapter.',
    bestFor: 'Babies 1–11 months old (5 sessions)',
    page: '/baby-milestone-photography/',
  },
  {
    id: 'cake-smash', roman: 'V', chapter: 'Chapter Five', name: 'Cake Smash',
    kicker: 'First birthday session', desc: 'Frosting, giggles and the sweetest mess — a timeless first-birthday session with the cake already taken care of.', includes: ['Cake included', '8 edited photos', '1 timeless backdrop'], cardPhoto: 'cake',
    price: 280, priceLabel: '$280', type: 'First Birthday Session',
    badge: { icon: 'cake', text: 'Cake included' },
    headline: 'Then comes the big ONE!',
    art: 'cake', wash: 'strawberry', photo: 'cake',
    stats: [['cake', '1', 'timeless cake'], ['camera', '8', 'edited photos'], ['backdrop', '1', 'timeless backdrop']],
    blurb: 'Frosting, giggles and the sweetest mess — a timeless first-birthday session with the cake included.',
    bestFor: 'Celebrating the first birthday',
    page: '/cake-smash-photography/',
  },
  {
    id: 'seaside-beach', roman: 'VI', chapter: 'Chapter Six', name: 'Seaside Beach',
    kicker: 'Family beach session', desc: 'The whole family barefoot on the sand at South Padre Island — sandy toes, salty kisses and ocean breeze.', includes: ['15 edited photos', 'South Padre Island'], cardPhoto: 'beachHug',
    price: 370, priceLabel: '$370', type: 'Family Session',
    badge: { icon: 'pin', text: 'South Padre Island' },
    headline: 'Sandy toes & salty kisses.',
    art: 'seaside', wash: 'aqua', photo: null,
    stats: [['camera', '15', 'edited photos']],
    blurb: 'The whole family, barefoot on the sand at South Padre Island, with golden light and ocean breeze.',
    bestFor: 'Families with babies and kids of any age',
    page: '/south-padre-island-family-photography/',
  },
];

export const byId = Object.fromEntries(PACKAGES.map((p) => [p.id, p]));

export const ADDONS = [
  { id: 'twins', art: 'twins', kicker: 'Twins?', title: 'Double the love!', price: '', text: 'Twin sessions can be added to any package and include 4 extra photos.' },
  { id: 'extras', art: 'extraPhotos', kicker: 'Can’t choose just a few?', title: 'Extra photos', price: '', text: 'Extra edited photos can be added to any session.' },
];

export const HOW = [
  { icon: 'calendar', title: 'Reserve your date', text: 'A 50% deposit via Zelle saves your spot. The balance is due on session day.' },
  { icon: 'heart', title: 'Enjoy your session', text: 'Everything moves at your baby’s pace. At the end, we help you pick your favorite images for editing.' },
  { icon: 'sparkle', title: 'Personally curated', text: 'No proof gallery to sort through — every image is hand-selected, curated and edited with care.' },
  { icon: 'gift', title: 'Delivered in 1 week', text: 'Your finished, edited images arrive within one week of your session.' },
];

export const PRICE_RANGE = '$230–$1,000';
