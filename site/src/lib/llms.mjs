// llms.txt content (served by Rank Math's "LLMS Txt" module): a curated,
// plain-text map of the site for AI assistants, built from the same page data.
import { BUSINESS as B, BOOK_URL } from '../data/business.mjs';
import { PACKAGES } from '../data/packages.mjs';
import { CITIES } from '../data/cities.mjs';
import { faqsFor } from '../data/faqs.mjs';

const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export function llmsContent(pages, base) {
  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  const link = (path, label) => {
    const p = byPath[path];
    if (!p) throw new Error(`llms.txt: unknown page ${path}`);
    return `- [${label || p.wpTitle}](${base}${path}): ${p.seo.description}`;
  };
  const cities = (kind) => CITIES.map((c) => link(`/${kind}-photographer-${c.slug}-tx/`, `${kind === 'newborn' ? 'Newborn' : 'Baby'} photographer in ${c.name}, TX`));

  const summary = `${B.name} is a newborn, baby, milestone, cake smash, maternity and family photographer serving McAllen and the whole Rio Grande Valley, Texas, with ${B.years} years of experience and ${B.babies} of babies photographed.`;

  const extra = [
    '## About the business',
    `- Name: ${B.name} (on Google: "${B.gbpName}"), photographer ${B.photographer}.`,
    `- Experience: ${B.years} years; ${B.babies} of babies photographed; trained in safe newborn posing.`,
    `- Service area: the whole Rio Grande Valley, Texas, especially McAllen, Mission, Pharr, Edinburg and Brownsville; also Weslaco, Harlingen and South Padre Island. ${B.addressNote}`,
    `- Google rating: ${B.google.rating} stars (${B.google.url})`,
    `- Contact: call or text ${B.phone} · ${B.email} · Instagram ${B.instagram.handle} (${B.instagram.url})`,
    `- Hours: ${B.hours}`,
    `- Book online: ${base}${BOOK_URL}`,
    '',
    '## Sessions',
    link('/newborn-photography/'),
    link('/baby-milestone-photography/'),
    link('/cake-smash-photography/'),
    link('/south-padre-island-family-photography/'),
    link('/maternity-photography/'),
    link('/pricing/', 'All sessions & packages'),
    '',
    '## Packages',
    ...PACKAGES.map((p) => `- ${p.name} (${p.kicker}): ${p.desc} What’s included: ${p.includes.join(', ')}. Book: ${base}${BOOK_URL}?session=${p.id}`),
    '- Twins can be added to any newborn package and include 4 extra photos.',
    '',
    '## Newborn photographer by city',
    ...cities('newborn'),
    '',
    '## Baby photographer by city',
    ...cities('baby'),
    '',
    '## About, reviews and booking',
    link('/about/', 'About Adrisabel'),
    link('/portfolio/'),
    link('/reviews/'),
    link('/faq/', 'FAQ'),
    link('/contact/'),
    link(BOOK_URL, 'Book online'),
    link('/sitemap/', 'Site map'),
    '',
    '## Frequently asked questions',
    ...faqsFor('home', 8).filter((f) => !/cost|much|price/i.test(f.q)).flatMap((f) => [`- Q: ${text(f.q)}`, `  A: ${text(f.a)}`]),
  ].join('\n');

  if (/</.test(extra + summary)) throw new Error('llms.txt content must be plain text');
  return { summary, extra };
}
