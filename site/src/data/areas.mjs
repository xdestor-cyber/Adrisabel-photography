// Extra Rio Grande Valley cities, each with one newborn & baby page at
// /newborn-photographer-<slug>-tx/. Place names were researched and independently
// verified; the copy is unique to each city.
// (filled in from the research workflow)
export const AREAS = [];

// Counties for the /areas-we-serve/ hub. `towns` are smaller places we serve that
// don't have their own page (counties verified against the Texas municipality list).
export const COUNTIES = [
  {
    id: 'hidalgo-county', name: 'Hidalgo County', eyebrow: 'Hidalgo County',
    title: 'McAllen, Mission, Pharr <em>&amp; the mid-Valley</em>',
    lede: 'The heart of the Valley — and the shortest drive to our private studio in the McAllen area.',
    towns: ['Palmhurst', 'Peñitas', 'Sullivan City', 'Granjeno', 'Progreso', 'Elsa', 'Edcouch'],
  },
  {
    id: 'cameron-county', name: 'Cameron County', eyebrow: 'Cameron County',
    title: 'Harlingen, Brownsville <em>&amp; the coast</em>',
    lede: 'From Harlingen to Brownsville and out to the coast — and home to our Seaside Beach family sessions on South Padre Island.',
    towns: ['La Feria', 'Santa Rosa', 'Combes', 'Primera', 'Palm Valley', 'Rio Hondo', 'Olmito', 'Laguna Vista', 'Port Isabel'],
  },
  {
    id: 'starr-county', name: 'Starr County', eyebrow: 'Starr County',
    title: 'Rio Grande City <em>&amp; the western Valley</em>',
    lede: 'Coming from the western end of the Valley? It’s a straight drive east along US-83 to our private studio in the McAllen area.',
    towns: ['La Grulla', 'Escobares', 'Roma'],
  },
  {
    id: 'willacy-county', name: 'Willacy County', eyebrow: 'Willacy County',
    title: 'Raymondville <em>&amp; the northern Valley</em>',
    lede: 'North of Harlingen, Willacy County families are welcome too — send a booking request and we’ll help you plan the drive.',
    towns: ['Raymondville', 'Lyford', 'San Perlita'],
  },
];
