// Photo registry — single source of truth for every photograph on the site.
// `src` is where the original lives (downloaded into site/.cache/src by
// tools/images.mjs), `crop` is an optional [left, top, width, height] box in
// fractions of the original, `focal` is the CSS object-position used when a
// layout crops the image further. Masters are written to site/assets/img/<file>.webp.

const WP = 'https://adrisabel.com/wp-content/uploads';
// Higher-resolution copies published on the Google Business Profile.
const GBP = 'https://lh3.googleusercontent.com/gps-cs-s/';

export const PHOTOS = {
  roses: {
    file: 'newborn-girl-red-roses-mini-bed-mcallen-tx',
    src: GBP + 'AHRPTWmQzzQwefyQFUEk3us7bjxm1pXtTXSVsaM8BqZKG91-EoP18Unm-TRZgVpd_i5rLm3ETdbPb5SdAdk9buQgOQcpq_RXJUtnKxI0h2W6AhkQ3w7ZTrjPto4xBH-Goo9slG8txI2I48zzDexE=w2400-h2400-k-no',
    fallback: WP + '/2026/03/baby-with-roses-sleeping-in-mini-bed.webp',
    alt: 'Newborn girl in a red lace romper asleep on a tiny white bed surrounded by red roses',
    focal: '50% 45%',
  },
  crown: {
    file: 'newborn-gold-crown-parents-hands',
    src: GBP + 'AHRPTWnWL8HDzX6nwZLz48AEEFYzUoVGIxW_JHsXbg7N9f2Uc3ob2AL-bMhxR6ZPJIZLfn_sSl11fguqdiNhLEvw56JB7zYZ-1fg7AMtyvXkUBUtCK1c_gVcz7exLl7zPVcdsYV5ww-ryV-4M1Q=w2400-h2400-k-no',
    fallback: WP + '/2026/03/baby-with-crown-sleeping-and-holding-mom-and-dad-hand.webp',
    alt: 'Sleeping newborn wearing a tiny gold crown while mom and dad hold her hands',
    focal: '45% 40%',
  },
  moonStars: {
    file: 'baby-moon-and-stars-milestone-photos',
    src: GBP + 'AHRPTWmklh1ns7H26saIinvY7UU0IQtfUXtXNHgz3dgmxOGUPB3wqb6hGjcngrULg-ATZKyV0S7pyoAeDzUSafKS280hZtv1BamuXj6RVFYJUaBRqQuTT1pmHEQbsDeS8NhwA9SciJOJ3qqpCmoW=w2400-h2400-k-no',
    fallback: WP + '/2026/03/baby-smiling-moon-and-stars-set-.webp',
    alt: 'Smiling baby on a moon pillow under white stars on a navy backdrop',
    focal: '40% 45%',
  },
  swingBoy: {
    file: 'newborn-boy-wooden-swing-stars',
    src: GBP + 'AHRPTWl4EsXDvp8MynpUquxVoi8mjuvU2D-0u-aWUsWtAlXl4RsFsHRrh3U6FAIDcxNTqZtHChqctPqcBi7wm1MB_h-cJGHBDyhEXDMUbNEMZA7v6A3QKrfkjKXrrJDWURcDiqRn5Dg4TyJSK6Mu=w2400-h2400-k-no',
    fallback: WP + '/2026/03/male-abby-in-swing-sleeping-light-blue-colors.webp',
    alt: 'Newborn boy in a gray romper and newsboy cap asleep on a wooden swing with paper stars',
    focal: '52% 40%',
  },
  swingGirl: {
    file: 'baby-girl-flower-swing-sitter-session',
    src: GBP + 'AHRPTWn9PP2LE9Ok41SYg1KG3hG2qZx5hJtp6O8Xvh6P5ugMPtmPOcHakte_840hDLjzlY5bM4ou9QVA4oQQwij7RJyqsNAfgEHFt9X01fPZh-q7H4cnrDKH85Ly9ecj8QrTvfXxhyWLQmoiHQc=w2400-h2400-k-no',
    fallback: WP + '/2026/03/cute-baby-in-swing.webp',
    crop: [0.277, 0, 0.426, 0.95],
    alt: 'Baby girl in a pink knit bear bonnet sitting on a swing draped with flowers',
    focal: '50% 45%',
  },
  bear: {
    file: 'newborn-teddy-bear-costume-rattan-chair',
    src: GBP + 'AHRPTWmItEy5VFcpPynG9yMo2zLWR8yPMOycw989umk2-NE39n9BbiWHA6AXC4nc4_rsO5lryhWIiKV6ty65JzJAKChKGFCTWIyTawz1fZU4FfkAOymN8dYTT6Y0GCh4TLYAxgR4lpxc_cRLcAY=w2400-h2400-k-no',
    fallback: WP + '/2026/03/baby-sleeping-in-cear-costume-cute.webp',
    alt: 'Newborn in a teddy bear costume asleep on a little rattan chair with eucalyptus',
    focal: '50% 35%',
  },
  lavender: {
    file: 'newborn-lavender-roses-white-bed',
    src: GBP + 'AHRPTWk4-da3y0_i45hY9FLfkP0DUtcMhk3PRIpcBZScxaO1bMjmdPAN_tcjlRzH5qXuq-cWvb6EFkEYSV4z0Kk3D71Lgf22WDei9qw-VNoj0TaZgTGCoSn4i12BrvkbQz1IJvZjPQqQWjkv4oDd=w2400-h2400-k-no',
    crop: [0.2, 0.02, 0.6, 0.8],
    alt: 'Newborn girl in lavender lace sleeping on a white bed trimmed with pale purple roses',
    focal: '50% 40%',
  },
  dino: {
    file: 'newborn-knit-bonnet-bed-crochet-dinosaur',
    src: GBP + 'AHRPTWkbeFfbCn551Gg7ekrB9qw9zEE0f8O-q7qyWPlRod2WORg5Sq3hrmsV_dWVh3ta6lNZ5HYwTFKzg0HlD6ii4SNdkMkVahWJ2fpwOf63_wFLkk2-IupP0D_mlL02vQStNot4HE1cQ0PM8MLv=w2400-h2400-k-no',
    alt: 'Newborn in a knit bear bonnet asleep on a white bed next to a crochet dinosaur',
    focal: '45% 40%',
  },
  moonPink: {
    file: 'newborn-girl-moon-pillow-pink-backdrop',
    src: GBP + 'AHRPTWlsp7g-ziW4BPz51wU2XsDYWu6wQ33kbwId2LgPaQDmdJDLMtS6OfacPOuJlRoZy5hE6W8hVe0C0zHOkpor_UlLYgswGfn3rcchvKnUULKGHDEru2cJC6lhkFPsk7FbwxgAkHiJKn4eAXcr=w2400-h2400-k-no',
    alt: 'Newborn girl with a lace headband sleeping on a moon pillow against a soft pink backdrop',
    focal: '45% 50%',
  },
  closeup: {
    file: 'newborn-closeup-cream-knit-blanket',
    src: WP + '/2026/03/baby-closeup-sleeping-peacefull.webp',
    alt: 'Close-up of a peaceful sleeping newborn tucked into a cream knit blanket',
    focal: '50% 45%',
  },
  heartBasket: {
    file: 'newborn-heart-wreath-blue-wrap',
    src: WP + '/2026/03/baby-sleeping-in-basket.webp',
    alt: 'Newborn in a blue knit wrap and hat curled up inside a heart-shaped eucalyptus wreath',
    focal: '50% 50%',
  },
  twins: {
    file: 'twin-newborns-sleeping-side-by-side',
    src: WP + '/2026/03/twin-babies-sleeping.webp',
    alt: 'Twin newborns sleeping side by side, one wrapped in rose and one in blue',
    focal: '50% 50%',
  },
  family: {
    file: 'newborn-family-portrait-parents-big-sister',
    src: WP + '/2026/03/baby-with-family-and-sister.webp',
    alt: 'Mom, dad and big sister cuddled around their newborn in a red dress',
    focal: '50% 40%',
  },
  santa: {
    file: 'newborn-christmas-santa-moon-pillow',
    src: WP + '/2026/03/baby-as-little-santa-sleeping.webp',
    alt: 'Newborn dressed as a little Santa asleep on a white moon pillow',
    focal: '45% 45%',
  },
  sister: {
    file: 'big-sister-and-newborn-sibling-photo',
    src: WP + '/2026/03/baby-and-big-sister-closeup-layed-down.webp',
    alt: 'Big sister lying head-to-head with her newborn sibling on a white blanket',
    focal: '50% 40%',
  },
  holiday: {
    file: 'one-year-old-holiday-portrait-lights',
    src: WP + '/2026/03/1-year-old-christmas-baby-closeup-protrait-.webp',
    alt: 'Little one in a red holiday sweater in front of glowing Christmas lights',
    focal: '50% 35%',
  },
  handsFeet: {
    file: 'newborn-feet-parents-hands-heart',
    src: WP + '/2026/03/parents-hands-and-baby-feet-picture.webp',
    alt: 'Parents’ hands forming a heart around their newborn’s tiny feet',
    focal: '50% 50%',
  },
  cake: {
    file: 'cake-smash-first-birthday-photography',
    src: WP + '/2026/04/Cake-Smash-Photography-session.jpg',
    alt: 'One-year-old girl smashing a pink floral cake beside wooden ONE letters',
    focal: '45% 50%',
  },
};

// Brand marks (processed separately: kept lossless-ish, transparent).
export const LOGO = {
  file: 'adrisabel-photography-logo',
  src: WP + '/2026/04/adrisabel-isotype.png',
  alt: 'Adrisabel Photography logo',
};
