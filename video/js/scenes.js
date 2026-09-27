/* Builds the DOM for every scene. All on-screen copy and package facts live
 * here so they can be proofread in one place.
 */
const COPY = {
  hook: {
    title: ['Once upon a', 'tiny time…'],
    caps: ['there were ten little toes,', 'one sleepy little yawn,', 'and a love that changed everything.'],
  },
  cover: {
    brand: 'Adrisabel',
    sub: 'Newborn, Baby & Family Photography',
    tagline: 'Luxury Newborn & Family Portrait Experience',
    proof: '15+ years · hundreds of babies photographed',
  },
  invite: {
    big: ['Every baby', 'is a story.'],
    q: 'Which chapter will you<br>treasure forever?',
  },
  website: 'adrisabel.com',
  instagram: '@Adrisabelx',
  phone: '(409) 354-3075',
};

// Package facts — keep exactly in sync with the client brief.
const CHAPTERS = [
  {
    id: 'sunshine', num: 'Chapter One', art: 'sunshine',
    washes: [['butter', 60, 380, 980, 1.0], ['peach-b', 300, 1100, 900, 0.55]],
    headline: 'Hello, little<br>sunshine.',
    name: 'Sunshine', price: '$230',
    type: 'Newborn Session', badge: { icon: 'heart', text: 'Baby only' },
    stats: [['camera', '8', 'edited photos'], ['hanger', '2', 'wardrobe changes'], ['backdrop', '2', 'backdrops']],
  },
  {
    id: 'wonderland', num: 'Chapter Two', art: 'wonderland',
    washes: [['lavender', 40, 420, 1000, 0.9], ['blush-b', 320, 1080, 900, 0.55]],
    headline: 'Welcome to<br>the family.',
    name: 'Wonderland', price: '$300',
    type: 'Newborn, Baby & Family Session', badge: { icon: 'family', text: 'Baby, siblings & parents' },
    stats: [['camera', '15', 'edited photos'], ['hanger', '2', 'wardrobe changes'], ['backdrop', '4', 'backdrops']],
  },
  {
    id: 'fairytale', num: 'Chapter Three', art: 'fairytale',
    washes: [['sky', 40, 400, 1000, 0.95], ['lavender-b', 260, 1090, 900, 0.55]],
    headline: 'Look who’s<br>smiling now!',
    name: 'Fairytale', price: '$230',
    type: 'Baby Session', badge: { icon: 'star', text: 'Babies 2–11 months old' },
    stats: [['camera', '8', 'edited photos'], ['hanger', '2', 'wardrobe changes'], ['backdrop', '2', 'backdrops']],
  },
  {
    id: 'cake', num: 'Chapter Five', art: 'cake',
    washes: [['strawberry', 40, 400, 1000, 0.85], ['butter-b', 260, 1090, 900, 0.5]],
    headline: 'Then comes<br>the big ONE!',
    name: 'Cake Smash', price: '$280',
    type: 'First Birthday Session', badge: { icon: 'cake', text: 'Cake included' },
    stats: [['cake', '1', 'timeless cake'], ['camera', '8', 'edited photos'], ['backdrop', '1', 'timeless backdrop']],
  },
  {
    id: 'seaside', num: 'Chapter Six', art: 'seaside',
    washes: [['aqua', 40, 400, 1000, 0.9], ['sand-b', 260, 1090, 900, 0.6]],
    headline: 'Sandy toes &<br>salty kisses.',
    name: 'Seaside Beach', price: '$370',
    type: 'Family Session', badge: { icon: 'pin', text: 'South Padre Island' },
    stats: [['camera', '15', 'edited photos']],
  },
];

const PIXIE = {
  num: 'Chapter Four',
  headline: 'Every little<br>milestone of their<br>first year…',
  name: 'Pixie Dust', type: 'Milestone Package',
  line: 'New look, new backdrop, lots<br>of love — every session.',
  sessions: '5', sessionsText: 'sessions<br>for baby',
  fam: 'Siblings & parents included',
  stats: [['camera', '8', 'edited images<br><em>per session</em>'], ['hanger', '1', 'outfit<br><em>per session</em>'], ['backdrop', '1', 'backdrop<br><em>per session</em>']],
  choose: 'Choose one schedule',
  options: [
    { label: 'Option A', months: [1, 3, 5, 7, 9], price: '$1,000', unit: 'total' },
    { label: 'Option B', months: [2, 4, 6, 8, 10], price: '$1,000', unit: 'total' },
  ],
  fine: ['5 sessions total · for babies <b>1–11 months</b> old', 'Cake Smash (1-year session) <b>not included</b>'],
};

const EXTRAS = {
  twins: { kick: 'Twins?', h: 'Double the love!', l1: 'Add <b>$100</b> to any package', l2: 'Includes 4 extra photos' },
  more: { kick: 'Can’t choose just a few?', h: 'Extra photos', l1: '<b>$30</b> each' },
};

const HOW = {
  kick: 'The Adrisabel Experience',
  h: 'How the magic<br>happens',
  steps: [
    ['calendar', 'Reserve your date', '<b>50% deposit via Zelle</b> to book —<br>the balance is due on session day'],
    ['heart', 'Choose your favorites', 'At the end of your session, we help<br>you pick the images for editing'],
    ['sparkle', 'Personally curated', 'No proof gallery is sent — every image<br>is hand-selected, curated & edited'],
    ['gift', 'Delivered in 1 week', 'Your edited images arrive<br>within one week'],
  ],
};

const CLOSING = { line: 'Your once upon a time<br>starts here.' };

/* ------------------------------------------------------------------ */
const SCENES = (() => {
  const cornerSvg = (cls) => `<svg class="corner ${cls}" viewBox="0 0 46 46"><path d="${ART.spark(23, 23, 20)}"/></svg>`;
  const frame = (dark = false) => `<div class="frame${dark ? ' onDark' : ''}">${cornerSvg('tl')}${cornerSvg('tr')}${cornerSvg('bl')}${cornerSvg('br')}</div>`;
  const wash = (name, x, y, size, op, cls = '') =>
    `<img class="wash ${cls}" src="assets/textures/wash-${name}.png" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;opacity:${op}">`;
  const emblem = () => `<svg class="emblem" viewBox="0 0 120 120"><path d="M 70 14 A 46 46 0 1 0 106 78 A 36 36 0 1 1 70 14 Z"/><path d="${ART.spark(84, 46, 12)}"/><path d="${ART.spark(40, 92, 6)}"/></svg>`;
  const scene = (id, cls, inner) => `<section class="scene ${cls}" id="s-${id}">${inner}<div class="shade"></div><div class="dim"></div></section>`;

  function hook() {
    return scene('hook', 'paperbg',
      wash('blush', 90, 660, 900, 0.85, 'w1') + wash('gold-b', -120, 180, 800, 0.35, 'w2') +
      `<div class="abs cx script hook-title"><span class="reveal">${COPY.hook.title[0]}</span><span class="reveal">${COPY.hook.title[1]}</span></div>` +
      `<div class="abs hook-art"><div class="feetwrap">${ART.hookFeet}</div><div class="babyheart">${ART.hookBaby}</div></div>` +
      COPY.hook.caps.map((c, i) => `<div class="abs cx serif ital cap cap${i}">${c}</div>`).join(''));
  }

  function cover() {
    const c = COPY.cover;
    return scene('cover', 'cover onDark',
      `<div class="linen"></div><div class="foilframe"></div>` +
      `<div class="abs cx" style="top:540px;width:150px">${emblem()}</div>` +
      `<div class="abs cx script brand foil-light reveal" style="top:670px">${c.brand}</div>` +
      `<div class="abs cx sans sub caps" style="top:985px">${c.sub}</div>` +
      `<div class="abs cx rule" style="top:1070px;width:420px"></div>` +
      `<div class="abs cx serif ital tagline" style="top:1110px;width:960px">${c.tagline}</div>` +
      `<div class="abs cx sans proof" style="top:1210px;width:960px">${c.proof}</div>` +
      `<div class="abs cx ornament" style="top:1480px">${ART.hookFeet.replace('id="art-feet"', 'id="art-feet-cover"')}</div>`);
  }

  function invite() {
    const names = ['Sunshine', 'Wonderland', 'Fairytale', 'Pixie Dust', 'Cake Smash', 'Seaside Beach'];
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    return scene('invite', 'paperbg',
      wash('blush-b', 120, 250, 860, 0.5) + wash('gold', 200, 900, 760, 0.35) + frame() +
      `<div class="abs cx serif ital big">${COPY.invite.big.join('<br>')}</div>` +
      `<div class="abs cx sans q">${COPY.invite.q}</div>` +
      `<div class="abs cx toc"><ul>${names.map((n, i) => `<li class="serif"><b>${roman[i]}</b><span>${n}</span></li>`).join('')}</ul></div>`);
  }

  function chapter(c) {
    const stats = c.stats.map(([ic, n, l]) => `<div class="stat">${ART.ICONS[ic]}<div class="num">${n}</div><div class="lbl sans">${l}</div></div>`).join('');
    return scene(c.id, 'paperbg chapter',
      c.washes.map(([n, x, y, s, o], i) => wash(n, x, y, s, o, 'w' + i)).join('') + frame() +
      `<div class="abs cx sans caps kicker">${c.num}</div>` +
      `<div class="abs cx serif ital headline">${c.headline}</div>` +
      `<div class="abs artbox">${ART[c.art]}</div>` +
      `<div class="abs cx serif caps name foil">${c.name}</div>` +
      `<div class="abs cx price"><span class="rule"></span><span class="amt">${c.price}</span><span class="rule r"></span></div>` +
      `<div class="abs cx sans caps type">${c.type}</div>` +
      `<div class="abs cx badge"><span class="pill sans">${ART.ICONS[c.badge.icon]}${c.badge.text}</span></div>` +
      `<div class="abs cx stats">${stats}</div>` +
      `<div class="abs cx sans caps runner">${COPY.website}</div>`);
  }

  function pixie() {
    const P = PIXIE;
    // waxing moons for the hero row
    const hero = `<svg class="abs moonrow" viewBox="0 0 850 190">${[0.14, 0.32, 0.5, 0.7, 1].map((p, i) => ART.moon(85 + i * 170, 95, 64, p)).join('')}</svg>`;
    const opt = (o, i) => {
      const phases = i === 0 ? [0.12, 0.3, 0.5, 0.7, 0.88] : [0.2, 0.4, 0.6, 0.8, 1];
      const moons = o.months.map((m, k) => ART.moon(64 + k * 128, 58, 46, phases[k]) +
        `<text class="mlabel" x="${64 + k * 128}" y="160">${m}</text>`).join('');
      return `<div class="abs opt opt${i}" style="top:${i ? 890 : 510}px">
        <div class="olabel sans caps">${o.label}</div>
        <div class="oprice"><span class="a">${o.price}</span><span class="b sans caps">${o.unit}</span></div>
        <svg class="moons" viewBox="0 0 800 190">${moons}<text class="munit" x="642" y="158">MONTHS</text></svg></div>`;
    };
    const stats = P.stats.map(([ic, n, l]) => `<div class="stat">${ART.ICONS[ic]}<div class="num">${n}</div><div class="lbl sans">${l}</div></div>`).join('');
    return scene('pixie', 'pixie onDark',
      `<canvas class="stars" width="1080" height="1920" style="position:absolute;inset:0"></canvas>` +
      wash('lavender', 90, 520, 900, 0.14) + frame(true) +
      `<div class="abs cx sans caps kicker">${P.num}</div>` +
      `<div class="abs cx serif ital headline">${P.headline}</div>` + hero +
      `<div class="abs cx serif caps pname foil-light">${P.name}</div>` +
      `<div class="abs cx sans caps ptype">${P.type}</div>` +
      `<div class="abs cx serif ital pline">${P.line}</div>` +
      // phase B
      `<div class="abs cx hdr"><div class="n serif caps foil-light">${P.name}</div><div class="t sans caps">${P.type}</div></div>` +
      `<div class="abs cx five"><span class="n foil-light">${P.sessions}</span><span class="t serif">${P.sessionsText.replace('<br>', ' ')}<small class="sans caps">in baby’s first year</small></span></div>` +
      `<div class="abs cx badge fam"><span class="pill sans">${ART.ICONS.family}${P.fam}</span></div>` +
      `<div class="abs cx stats">${stats}</div>` +
      // phase C
      `<div class="abs cx sans caps choose">${P.choose}</div>` +
      P.options.map(opt).join('') +
      `<div class="abs cx serif ital or" style="top:808px">or</div>` +
      `<div class="abs cx sans fine">${P.fine.map((l) => `<div>${l}</div>`).join('')}</div>` +
      `<div class="abs cx sans caps runner">${COPY.website}</div>`);
  }

  function extras() {
    const t = EXTRAS.twins, m = EXTRAS.more;
    return scene('extras', 'paperbg extras',
      wash('sky-b', 60, 300, 960, 0.55) + wash('blush', 160, 900, 800, 0.5) + frame() +
      `<div class="abs cx sans caps kick2 k1" style="top:250px">${t.kick}</div>` +
      `<div class="abs cx serif ital h h1" style="top:300px">${t.h}</div>` +
      `<div class="abs art1" style="left:200px;top:414px;width:680px;height:376px">${ART.twins}</div>` +
      `<div class="abs cx sans line1 l1a" style="top:770px">${t.l1}</div>` +
      `<div class="abs cx sans line2 l2a" style="top:862px">${t.l2}</div>` +
      `<div class="abs cx divider" style="top:930px;width:560px"></div>` +
      `<div class="abs cx sans caps kick2 k2" style="top:972px">${m.kick}</div>` +
      `<div class="abs cx serif ital h h2" style="top:1020px">${m.h}</div>` +
      `<div class="abs art2" style="left:322px;top:1128px;width:436px;height:252px">${ART.extraPhotos}</div>` +
      `<div class="abs cx sans line1 l1b" style="top:1370px">${m.l1}</div>`);
  }

  function how() {
    return scene('how', 'paperbg how',
      wash('peach', 40, 300, 1000, 0.5) + wash('sage-b', 200, 1000, 900, 0.45) + frame() +
      `<div class="abs cx sans caps kicker">${HOW.kick}</div>` +
      `<div class="abs cx serif ital h">${HOW.h}</div>` +
      `<div class="abs steps">${HOW.steps.map(([ic, t, d]) => `<div class="step"><div class="ic">${ART.ICONS[ic]}</div><div class="tx"><div class="t">${t}</div><div class="d sans">${d}</div></div></div>`).join('')}</div>` +
      `<div class="abs cx sans cta">Begin your story at <b>${COPY.website}</b></div>`);
  }

  function closing() {
    return scene('closing', 'cover closing onDark',
      `<div class="linen"></div><div class="foilframe"></div>` +
      `<div class="abs cx serif ital line">${CLOSING.line}</div>` +
      `<div class="abs cx" style="top:548px;width:120px">${emblem()}</div>` +
      `<div class="abs cx script brand foil-light reveal">${COPY.cover.brand}</div>` +
      `<div class="abs cx sans caps sub">${COPY.cover.sub}</div>` +
      `<div class="abs cx web sans"><span class="v">Visit</span><span class="u">${COPY.website}</span></div>` +
      `<div class="abs cx sans ig">Instagram: <b>${COPY.instagram}</b></div>` +
      `<div class="abs cx sans ph">Phone: ${COPY.phone}</div>` +
      `<div class="abs cx ornament" style="top:1500px">${ART.hookFeet.replace('id="art-feet"', 'id="art-feet-close"')}</div>`);
  }

  function wavewipe() {
    // tall wave body with rolling crests top and bottom
    let top = 'M 0 140', bot = '';
    for (let x = 0; x <= 1160; x += 145) top += ` Q ${x + 36} 40 ${x + 72} 110 T ${x + 145} 140`;
    for (let x = 1160; x >= 0; x -= 145) bot += ` Q ${x - 36} 2860 ${x - 72} 2790 T ${x - 145} 2760`;
    const d = top + ' L 1160 2760' + bot + ' Z';
    let foam = '';
    for (let y = 300; y < 2700; y += 240) {
      let f = `M 0 ${y}`;
      for (let x = 0; x <= 1160; x += 116) f += ` q 29 -22 58 0 t 58 0`;
      foam += `<path d="${f}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="6" stroke-linecap="round"/>`;
    }
    return `<div id="wavewipe"><svg viewBox="0 0 1160 2900" preserveAspectRatio="none">
      <defs><linearGradient id="wwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFEFE9"/><stop offset=".5" stop-color="#9ED8CF"/><stop offset="1" stop-color="#CFEFE9"/></linearGradient></defs>
      <path d="${d}" fill="url(#wwg)"/><path d="${top}" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round"/>${foam}</svg></div>`;
  }

  function build(stage) {
    stage.insertAdjacentHTML('beforeend',
      hook() + cover() + invite() + CHAPTERS.slice(0, 3).map(chapter).join('') + pixie() +
      CHAPTERS.slice(3).map(chapter).join('') + extras() + how() + closing() +
      wavewipe() + `<div id="turnback"><div class="shade"></div></div><canvas id="fx" width="1080" height="1920"></canvas><div id="grain"></div>`);
  }
  return { build };
})();
