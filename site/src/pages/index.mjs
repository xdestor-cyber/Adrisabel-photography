import home from './home.mjs';
import pricing from './pricing.mjs';
import { newborn, baby, cake, maternity, beach } from './services.mjs';
import { portfolio, about, reviewsPage, faqPage, contact, booking, landingBook, landingSessions, privacy } from './general.mjs';
import { CITY_PAGES } from './cities.mjs';

export const PAGES = [
  home, pricing, newborn, baby, cake, maternity, beach,
  portfolio, about, reviewsPage, faqPage, contact, booking,
  landingBook, landingSessions, privacy,
  ...CITY_PAGES,
];
