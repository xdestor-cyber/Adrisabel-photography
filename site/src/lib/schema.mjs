// schema.org JSON-LD. Rank Math already outputs WebSite/WebPage/BreadcrumbList;
// these add the local business, its services and prices, and FAQs.
import { BUSINESS, SITE_URL } from '../data/business.mjs';
import { PACKAGES, PRICE_RANGE } from '../data/packages.mjs';
import { CITIES } from '../data/cities.mjs';

const B = BUSINESS;
export const BUSINESS_ID = `${SITE_URL}/#business`;
const abs = (u) => (u.startsWith('http') ? u : SITE_URL + u);
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

export function businessNode(ctx) {
  const photos = ['roses', 'crown', 'moonStars', 'family', 'cake'].map((k) => abs(ctx.media.photo(k).src));
  return {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': BUSINESS_ID,
    name: B.name,
    alternateName: B.gbpName,
    description: 'Newborn, baby, milestone, cake smash and family photographer serving McAllen, Pharr, Edinburg, Mission and the Rio Grande Valley, Texas — 15+ years of experience and hundreds of babies photographed.',
    url: `${SITE_URL}/`,
    telephone: '+1-409-354-3075',
    email: B.email,
    logo: abs(ctx.media.logo().png),
    image: photos,
    priceRange: PRICE_RANGE,
    currenciesAccepted: 'USD',
    address: { '@type': 'PostalAddress', addressLocality: B.locality, addressRegion: B.region, addressCountry: B.country },
    areaServed: [...CITIES.map((c) => ({ '@type': 'City', name: `${c.name}, TX` })), { '@type': 'City', name: 'South Padre Island, TX' }, { '@type': 'AdministrativeArea', name: 'Rio Grande Valley, Texas' }],
    hasMap: B.google.url,
    sameAs: [B.instagram.url, B.google.url],
    founder: { '@type': 'Person', name: B.photographer, jobTitle: 'Newborn & baby photographer' },
    knowsAbout: ['Newborn photography', 'Baby milestone photography', 'Cake smash photography', 'Family photography', 'Maternity photography', 'Safe newborn posing'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Photography sessions',
      itemListElement: PACKAGES.map((p) => offer(p)),
    },
  };
}

export function offer(p) {
  return {
    '@type': 'Offer',
    name: `${p.name} — ${p.type}`,
    price: String(p.price),
    priceCurrency: 'USD',
    url: `${SITE_URL}/pricing/#pkg-${p.id}`,
    description: `${p.stats.map(([, n, l]) => `${n} ${l}`).join(', ')}. ${p.bestFor}.`,
    itemOffered: { '@type': 'Service', name: `${p.name} ${p.type}`, provider: { '@id': BUSINESS_ID } },
  };
}

export function serviceNode({ path, name, serviceType, description, packages = [], area = null }) {
  const node = {
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#service`,
    name,
    serviceType,
    description,
    url: `${SITE_URL}${path}`,
    provider: { '@id': BUSINESS_ID },
    areaServed: area ? { '@type': 'City', name: area } : { '@type': 'AdministrativeArea', name: 'Rio Grande Valley, Texas' },
  };
  if (packages.length) node.offers = packages.map((id) => offer(PACKAGES.find((p) => p.id === id)));
  return node;
}

export function faqNode(path, list) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${path}#faq`,
    mainEntity: list.map((f) => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })),
  };
}

export function jsonLd(nodes) {
  const graph = nodes.filter(Boolean);
  if (!graph.length) return '';
  // escape "</" so the JSON can never close the script tag
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/<\//g, '<\\/')}</script>`;
}
