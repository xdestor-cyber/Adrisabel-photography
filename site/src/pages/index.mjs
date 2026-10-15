import home from './home.mjs';
import pricing from './pricing.mjs';
import { newborn, baby, cake, maternity, beach } from './services.mjs';
import { portfolio, about, reviewsPage, faqPage, contact, booking, landingBook, landingSessions, privacy } from './general.mjs';
import { CITY_PAGES } from './cities.mjs';
import { AREA_PAGES, COUNTY_PAGES, areasHub } from './areas.mjs';
import { sitemapPage } from './sitemap.mjs';
import { blogIndex, POST_PAGES } from './blog.mjs';

export const PAGES = [
  home, pricing, newborn, baby, cake, maternity, beach,
  portfolio, about, reviewsPage, faqPage, contact, booking,
  landingBook, landingSessions, privacy,
  ...CITY_PAGES,
  areasHub, ...COUNTY_PAGES, ...AREA_PAGES,
  blogIndex, ...POST_PAGES,
];
// the HTML site map lists (and checks) every page above
PAGES.push(sitemapPage(PAGES));
