// Photo registry — single source of truth for every photograph on the site.
// `src` is where the original lives (downloaded into site/.cache/src by
// tools/images.mjs; `local:<file>` = site/assets/originals/<file>, used for the Instagram photos), `crop` is an optional [left, top, width, height] box in
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
    focal: '42% 45%',
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
// ---- from Instagram (@adrisabelx), originals in site/assets/originals
  beachLift: {
    file: 'mother-lifting-toddler-beach-blue-sky',
    src: 'local:mother-lifting-toddler-beach-blue-sky.jpg', // instagram.com/p/DVwAUONjr2h/
    alt: 'A smiling mother in a white dress lifts her laughing toddler high into the blue sky above the ocean waves.',
    focal: '54% 35%',
    category: 'beach-family',
  },
  beachHug: {
    file: 'mom-hugging-toddler-red-polo-beach',
    src: 'local:mom-hugging-toddler-red-polo-beach.jpg', // instagram.com/p/DX15sARDu-i/
    alt: 'Mom in a white eyelet dress and pearls hugs her toddler in a red polo cheek to cheek on a sunny, sandy beach.',
    focal: '51% 42%',
    category: 'beach-family',
  },
  beachToddler: {
    file: 'baby-sitting-beach-blanket-seashells-sand-toys',
    src: 'local:baby-sitting-beach-blanket-seashells-sand-toys.jpg', // instagram.com/p/DVthwQbjt-A/
    alt: 'A baby in white linen sits on a blanket on the sand with patterned pillows, a red bucket, beach toys and a glass jar of seashells.',
    focal: '41% 28%',
    category: 'beach-family',
  },
  cakePink: {
    file: 'first-birthday-cake-smash-pink-floral-dress',
    src: 'local:first-birthday-cake-smash-pink-floral-dress.jpg', // instagram.com/p/DcG16jDCVdv/
    alt: 'A one-year-old in a floral tulle dress and flower crown holds a hand to her mouth behind a white cake and ONE letters on pink.',
    focal: '61% 35%',
    category: 'cake-smash',
  },
  cakePinkSit: {
    file: 'cake-smash-girl-flower-crown-white-balloons',
    src: 'local:cake-smash-girl-flower-crown-white-balloons.jpg', // instagram.com/p/DcCjPMNiVBp/
    alt: 'A one-year-old in a flower crown and floral tulle dress sits among white balloons beside a white cake and big ONE letters on pink.',
    focal: '59% 27%',
    category: 'cake-smash',
  },
  cakeChoc: {
    file: 'cake-smash-chocolate-frosting-blue-sprinkle-cake',
    src: 'local:cake-smash-chocolate-frosting-blue-sprinkle-cake.jpg', // instagram.com/p/DbyIrwtDkOd/
    alt: 'A shirtless one-year-old with chocolate frosting on his mouth and fingers sits behind a blue sprinkle cake beside white ONE letters.',
    focal: '49% 27%',
    category: 'cake-smash',
  },
  cakeBlue: {
    file: 'first-birthday-baby-fish-print-balloon-aqua',
    src: 'local:first-birthday-baby-fish-print-balloon-aqua.jpg', // instagram.com/p/DbvqvuxDq6J/
    alt: 'A grinning one-year-old in a blue fish-print outfit hugs a white balloon next to white ONE letters on an aqua backdrop.',
    focal: '87% 33%',
    category: 'cake-smash',
  },
  brotherSweater: {
    file: 'baby-and-big-brother-holding-hands-white-rug',
    src: 'local:baby-and-big-brother-holding-hands-white-rug.jpg', // instagram.com/p/Db3D5XSO1-t/
    alt: 'A smiling boy in a cream cable-knit sweater holds hands with his baby brother in hedgehog overalls as they lie on a white rug.',
    focal: '50% 37%',
    category: 'family-studio',
  },
  dadKiss: {
    file: 'father-kissing-newborn-forehead-lace-headband',
    src: 'local:father-kissing-newborn-forehead-lace-headband.jpg', // instagram.com/p/Db4QJCsjuRZ/
    alt: 'A father in a cream polo gently kisses the forehead of his sleeping newborn, who wears a lace outfit and headband, in soft white light.',
    focal: '44% 50%',
    category: 'newborn-with-parents',
  },
  momWhite: {
    file: 'mother-holding-newborn-butterfly-tulle-romper',
    src: 'local:mother-holding-newborn-butterfly-tulle-romper.jpg', // instagram.com/p/Dbqzcdfp-8c/
    alt: 'A smiling mother in white cradles her sleeping newborn, dressed in a pale peach butterfly tulle romper and a lace flower headband.',
    focal: '45% 40%',
    category: 'newborn-with-parents',
  },
  woodBowlLace: {
    file: 'newborn-wooden-bowl-cream-lace-peach-roses',
    src: 'local:newborn-wooden-bowl-cream-lace-peach-roses.jpg', // instagram.com/p/DbmFiLgOEw_/
    alt: 'A sleeping newborn tucked into a wooden bowl under a cream lace blanket, framed by peach roses and eucalyptus on white boards.',
    focal: '55% 25%',
    category: 'newborn',
  },
  feetHands: {
    file: 'newborn-feet-in-parent-cupped-hands',
    src: 'local:newborn-feet-in-parent-cupped-hands.jpg', // instagram.com/p/DbMBCtspICf/
    alt: 'Close-up of a newborn’s tiny bare feet held together inside a parent’s cupped hands on a soft white fluffy blanket.',
    focal: '50% 55%',
    category: 'details',
  },
  momKissTeal: {
    file: 'mother-kissing-newborn-forehead-teal-blouse',
    src: 'local:mother-kissing-newborn-forehead-teal-blouse.jpg', // instagram.com/p/Da_mRQiOsfS/
    alt: 'A mother with long dark curls in a teal blouse kisses the forehead of her wide-eyed baby, who wears white lace and a flower headband.',
    focal: '60% 45%',
    category: 'newborn-with-parents',
  },
  brotherDino: {
    file: 'newborn-with-big-brother-white-blanket',
    src: 'local:newborn-with-big-brother-white-blanket.jpg', // instagram.com/p/Da6Ll1sCca0/
    alt: 'Big brother in a dinosaur-print shirt leans in to kiss his wide-eyed newborn sibling on a fluffy white blanket.',
    focal: '55% 50%',
    category: 'newborn-with-siblings',
  },
  laceAwake: {
    file: 'baby-pink-swing-felt-hearts-mauve-backdrop',
    src: 'local:baby-pink-swing-felt-hearts-mauve-backdrop.jpg', // instagram.com/p/Da4ByTwuM34/
    alt: 'Wide-eyed baby in a cream lace dress and flower headband sits on a pink swing beside white blossoms and felt hearts.',
    focal: '47% 35%',
    category: 'newborn',
  },
  woodBowlCream: {
    file: 'newborn-asleep-wooden-bowl-cream-wrap-eucalyptus',
    src: 'local:newborn-asleep-wooden-bowl-cream-wrap-eucalyptus.jpg', // instagram.com/p/DZ0u27RJzYN/
    alt: 'Sleeping newborn swaddled in cream inside a dark wooden bowl, with a flower headband, eucalyptus and a macrame canopy.',
    focal: '47% 28%',
    category: 'newborn',
  },
  knitRomper: {
    file: 'baby-moon-pillow-stars-blue-backdrop',
    src: 'local:baby-moon-pillow-stars-blue-backdrop.jpg', // instagram.com/p/DZxnjXeuzuu/
    alt: 'Awake baby in a cream knit outfit lies on a white crescent moon pillow under three felt stars on a soft blue backdrop.',
    focal: '34% 37%',
    category: 'baby-milestone',
  },
  familyFour: {
    file: 'family-of-four-studio-portrait-cream-khaki',
    src: 'local:family-of-four-studio-portrait-cream-khaki.jpg', // instagram.com/p/DZtPkHfjhVy/
    alt: 'Smiling parents sit on a woven bench with their baby on mom’s lap while an older brother leans in, all in cream and khaki.',
    focal: '48% 40%',
    category: 'family-studio',
  },
  basketSmile: {
    file: 'smiling-baby-woven-basket-eucalyptus-brown-backdrop',
    src: 'local:smiling-baby-woven-basket-eucalyptus-brown-backdrop.jpg', // instagram.com/p/DZp0fjDu4aL/
    alt: 'Smiling baby in a cream knit sweater sits propped in a woven basket on eucalyptus and jute against a warm brown backdrop.',
    focal: '50% 26%',
    category: 'baby-milestone',
  },
  laceSmile: {
    file: 'baby-smiling-pink-swing-blossom-garland',
    src: 'local:baby-smiling-pink-swing-blossom-garland.jpg', // instagram.com/p/DYXuyUxpRAX/
    alt: 'Smiling baby in a cream lace dress and flower headband lies back on a pink swing framed by trailing pink and white blossoms.',
    focal: '45% 30%',
    category: 'newborn',
  },
  parentsStanding: {
    file: 'parents-holding-newborn-lace-headband-studio',
    src: 'local:parents-holding-newborn-lace-headband-studio.jpg', // instagram.com/p/DYVLpxuCa8M/
    alt: 'Mom in a white sweater and dad in a burgundy shirt smile down at their newborn in a lace headband cradled between them.',
    focal: '52% 40%',
    category: 'newborn-with-parents',
  },
  momFloral: {
    file: 'mom-and-baby-pampas-roses-backdrop',
    src: 'local:mom-and-baby-pampas-roses-backdrop.jpg', // instagram.com/p/DYBDxcYiUcK/
    alt: 'Smiling mom in a blue floral dress holds her grinning baby on a woven bench framed by pampas grass and blush roses.',
    focal: '50% 35%',
    category: 'mom-and-baby',
  },
  bearBonnetMoon: {
    file: 'newborn-pink-bear-bonnet-moon-pillow-teddy',
    src: 'local:newborn-pink-bear-bonnet-moon-pillow-teddy.jpg', // instagram.com/p/DXdHkqTDtmQ/
    alt: 'Sleeping newborn in a pink knit bear bonnet and overalls curled on a white moon pillow beside a pink crochet teddy.',
    focal: '55% 30%',
    category: 'newborn',
  },
  tongueBonnet: {
    file: 'baby-pink-crochet-bonnet-tongue-out-box',
    src: 'local:baby-pink-crochet-bonnet-tongue-out-box.jpg', // instagram.com/p/DXF1jhxjoz3/
    alt: 'Wide-eyed baby in a pink and white crochet bonnet peeks over the edge of a black box with tongue playfully sticking out.',
    focal: '50% 40%',
    category: 'baby-sitter',
  },
  whiteLaceAlert: {
    file: 'baby-white-lace-veil-ruffled-blanket',
    src: 'local:baby-white-lace-veil-ruffled-blanket.jpg', // instagram.com/p/DWxiLX-Dnd8/
    alt: 'Alert baby with big dark eyes lies on white ruffled fabric, softly wrapped in a white lace veil draped over the head.',
    focal: '54% 38%',
    category: 'newborn',
  },
  pinkFloralBed: {
    file: 'newborn-white-bed-pink-flowers-cream-lace',
    src: 'local:newborn-white-bed-pink-flowers-cream-lace.jpg', // instagram.com/p/DWtwdJFlB2a/
    alt: 'Newborn sleeps on a white mini bed against a pink backdrop, wearing a cream lace romper and headband, with pink flowers in front.',
    focal: '38% 35%',
    category: 'newborn',
  },
  handsRing: {
    file: 'baby-and-adult-hands-ring-detail',
    src: 'local:baby-and-adult-hands-ring-detail.jpg', // instagram.com/p/DWkcuEqDu1k/
    alt: 'Close-up of a baby’s small hand resting with two adult hands, one wearing a rose-gold halo ring, on white ruffled fabric.',
    focal: '60% 50%',
    category: 'details',
  },
  redRoseSwing: {
    file: 'newborn-red-lace-swing-red-roses',
    src: 'local:newborn-red-lace-swing-red-roses.jpg', // instagram.com/p/DWPp6qQjrg8/
    alt: 'Sleeping newborn in a red lace romper and red bow headband posed on a wooden rope swing, with deep red roses below.',
    focal: '54% 32%',
    category: 'newborn',
  },
  momOverheadRed: {
    file: 'woman-with-newborn-red-lace-bow-overhead',
    src: 'local:woman-with-newborn-red-lace-bow-overhead.jpg', // instagram.com/p/DWSOsSdjkcB/
    alt: 'A woman with long dark hair lies with her face close to a sleeping newborn in a red lace romper and red bow on a white blanket.',
    focal: '58% 38%',
    category: 'newborn-with-parents',
  },
  bearBonnetChair: {
    file: 'newborn-beige-bear-bonnet-rattan-bench-teddy',
    src: 'local:newborn-beige-bear-bonnet-rattan-bench-teddy.jpg', // instagram.com/p/DWAJyU5jqBJ/
    alt: 'Sleeping newborn in a beige knit bear bonnet and romper on a rattan bench, with a crochet teddy and a Hello World sign.',
    focal: '40% 45%',
    category: 'newborn',
  },
  navySwing: {
    file: 'newborn-swing-navy-gold-stars-knit-overalls',
    src: 'local:newborn-swing-navy-gold-stars-knit-overalls.jpg', // instagram.com/p/DV6vAL_jv70/
    alt: 'Newborn in beige knit overalls sits on a wooden rope swing against a navy backdrop scattered with tiny gold stars.',
    focal: '50% 36%',
    category: 'newborn',
  },
  moonClasped: {
    file: 'baby-white-moon-pillow-felt-stars-navy',
    src: 'local:baby-white-moon-pillow-felt-stars-navy.jpg', // instagram.com/p/DVZzCQfDqdE/
    alt: 'A wide-eyed baby lies on a white crescent moon pillow under a navy blanket, beside a curve of white felt stars on a navy backdrop.',
    focal: '53% 26%',
    category: 'baby-milestone',
  },
  momNavyKiss: {
    file: 'mother-kissing-baby-green-knit-hat',
    src: 'local:mother-kissing-baby-green-knit-hat.jpg', // instagram.com/p/DVXgFAcDrYb/
    alt: 'A mother kisses the forehead of her wide-eyed baby, who wears a green knit hat and lies on a soft white blanket.',
    focal: '57% 58%',
    category: 'newborn-with-parents',
  },
  greenHat: {
    file: 'sleeping-newborn-green-hat-parents-hands',
    src: 'local:sleeping-newborn-green-hat-parents-hands.jpg', // instagram.com/p/DVTrm4vCWnS/
    alt: 'A sleeping newborn in a green striped hat lies on a white fluffy blanket as two parents rest their hands on the baby’s back.',
    focal: '29% 43%',
    category: 'newborn-with-parents',
  },
  feetRings: {
    file: 'newborn-feet-parents-wedding-rings-white-blanket',
    src: 'local:newborn-feet-parents-wedding-rings-white-blanket.jpg', // instagram.com/p/DVNCb7RDp_3/
    alt: 'Tiny newborn feet peek out of a white ruffled blanket, a diamond engagement ring on one big toe and a wedding band on the other.',
    focal: '47% 44%',
    category: 'details',
  },
  turtleSleep: {
    file: 'sleeping-newborn-crochet-dinosaur-white-blanket',
    src: 'local:sleeping-newborn-crochet-dinosaur-white-blanket.jpg', // instagram.com/p/DU8wCOcDtSU/
    alt: 'A newborn sleeps on a fluffy white blanket, one arm wrapped around a green crochet dinosaur toy with cream spots.',
    focal: '62% 45%',
    category: 'newborn',
  },
  pinkHatSleep: {
    file: 'sleeping-newborn-pink-knit-hat-tulle-flower',
    src: 'local:sleeping-newborn-pink-knit-hat-tulle-flower.jpg', // instagram.com/p/DTYFbhKDo8E/
    alt: 'A sleeping newborn in a pink knit hat with a tulle flower and pink knit bloomers stretches out on a cream bed by a gray headboard.',
    focal: '78% 52%',
    category: 'newborn',
  },
  santaMoonRed: {
    file: 'newborn-santa-hat-moon-pillow-reindeer-plush',
    src: 'local:newborn-santa-hat-moon-pillow-reindeer-plush.jpg', // instagram.com/p/DTeTt3xjoiy/
    alt: 'Sleeping newborn in a red knit Santa hat curled on a white moon pillow, with two reindeer plush toys on a starry red backdrop.',
    focal: '43% 42%',
    category: 'holiday-newborn',
  },
  santaBedNavy: {
    file: 'baby-first-christmas-santa-outfit-white-bed',
    src: 'local:baby-first-christmas-santa-outfit-white-bed.jpg', // instagram.com/p/DTaxFpBjmRD/
    alt: 'Wide-eyed baby in a red Santa hat and knit shorts lying on a tiny white bed beside a My First Christmas teddy bear, gold stars on navy.',
    focal: '30% 32%',
    category: 'holiday-baby',
  },
  santaWreath: {
    file: 'newborn-santa-hat-christmas-wreath-reindeer',
    src: 'local:newborn-santa-hat-christmas-wreath-reindeer.jpg', // instagram.com/p/DTQhXVkDj6V/
    alt: 'Newborn asleep in a Santa hat and cream pajamas, nestled in white faux fur inside an evergreen wreath with reindeer plush toys.',
    focal: '41% 31%',
    category: 'holiday-newborn',
  },
  heartBowl: {
    file: 'newborn-heart-bowl-dusty-rose-wrap',
    src: 'local:newborn-heart-bowl-dusty-rose-wrap.jpg', // instagram.com/p/DQ4yV9RjjsX/
    alt: 'Newborn asleep with arms up in a wooden heart-shaped bowl, wrapped in a dusty rose knit wrap on cream fur over a brown rug.',
    focal: '40% 32%',
    category: 'newborn',
  },
};

// Brand marks (processed separately: kept lossless-ish, transparent).
export const LOGO = {
  file: 'adrisabel-photography-logo',
  src: WP + '/2026/04/adrisabel-isotype.png',
  alt: 'Adrisabel Photography logo',
};
