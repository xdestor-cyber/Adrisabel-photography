// Business facts used across the site and in structured data.
export const SITE_URL = 'https://adrisabel.com';

export const BUSINESS = {
  name: 'Adrisabel Photography',
  gbpName: 'Adrisabel Newborn and Baby Photography',
  tagline: 'Newborn, Baby & Family Photography',
  descriptor: 'Luxury Newborn & Family Portrait Experience',
  photographer: 'Adrisabel',
  years: '15+',
  babies: 'hundreds',
  babiesNum: '200+',
  phone: '(409) 354-3075',
  phoneHref: 'tel:+14093543075',
  sms: 'sms:+14093543075',
  email: 'adrianaisabelphoto@gmail.com',
  instagram: { handle: '@adrisabelx', url: 'https://www.instagram.com/adrisabelx/' },
  google: {
    placeId: 'ChIJOX6_IvsJZYYRew3eA1_pSmE',
    url: 'https://www.google.com/maps/place/?q=place_id:ChIJOX6_IvsJZYYRew3eA1_pSmE',
    writeReview: 'https://search.google.com/local/writereview?placeid=ChIJOX6_IvsJZYYRew3eA1_pSmE',
    rating: '5.0',
    count: 8,
  },
  // Adrisabel serves the whole Rio Grande Valley — especially McAllen,
  // Mission, Pharr, Edinburg and Brownsville.
  locality: 'McAllen',
  region: 'TX',
  regionName: 'Texas',
  country: 'US',
  geo: { lat: 26.1756, lng: -98.2309 },
  studioLine: 'Adrisabel serves families across the whole Rio Grande Valley — especially McAllen, Mission, Pharr, Edinburg and Brownsville.',
  addressNote: 'The exact session location is shared after booking.',
  hours: 'Monday – Saturday by appointment · Closed Sundays',
  responseTime: 'within 24 hours',
  serviceArea: ['McAllen', 'Pharr', 'Edinburg', 'Mission', 'San Juan', 'Alamo', 'Donna', 'Weslaco', 'Mercedes', 'Harlingen', 'Brownsville', 'South Padre Island'],
};

export const NAV = [
  { label: 'Sessions', children: [
    { href: '/newborn-photography/', label: 'Newborn', note: 'Sunshine & Wonderland', icon: 'heart' },
    { href: '/baby-milestone-photography/', label: 'Baby & Milestones', note: 'Fairytale & Pixie Dust', icon: 'star' },
    { href: '/cake-smash-photography/', label: 'Cake Smash', note: 'First birthday celebration', icon: 'cake' },
    { href: '/south-padre-island-family-photography/', label: 'Family Beach Session', note: 'South Padre Island', icon: 'pin' },
    { href: '/maternity-photography/', label: 'Maternity', note: 'Glowing bump portraits', icon: 'sparkle' },
  ] },
  { href: '/pricing/', label: 'Packages' },
  { href: '/portfolio/', label: 'Portfolio' },
  { href: '/about/', label: 'About' },
  { href: '/reviews/', label: 'Reviews', mobileOnly: true },
  { href: '/areas-we-serve/', label: 'Areas we serve', mobileOnly: true },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
];

export const BOOK_URL = '/fast-online-booking/';
