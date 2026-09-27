/* Master choreography. Everything is placed on the musical grid (bar()/BEAT)
 * so picture changes land on downbeats of the score.
 */
const CUES = [];   // sound-design cues exported for the audio mix
function cue(name, t, gain = 1) { CUES.push({ name, t: +t.toFixed(3), gain }); }

function buildTimeline() {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const IR = { immediateRender: false };

  // ---------- helpers ----------
  const fadeUp = (el, t, o = {}) => tl.fromTo(el, { autoAlpha: 0, y: o.y ?? 36 }, { autoAlpha: 1, y: 0, duration: o.dur ?? 0.75, ease: o.ease ?? 'power3.out', stagger: o.stagger ?? 0 }, t);
  const fadeOut = (el, t, o = {}) => tl.to(el, { autoAlpha: 0, y: o.y ?? -20, duration: o.dur ?? 0.4, ease: 'power2.in' }, t);
  const pop = (el, t, o = {}) => tl.fromTo(el, { autoAlpha: 0, scale: o.from ?? 0.7 }, { autoAlpha: 1, scale: 1, duration: o.dur ?? 0.6, ease: o.ease ?? 'back.out(2.2)' }, t);
  const reveal = (el, t, dur) => tl.fromTo(el, { '--r': '-20%' }, { '--r': '125%', duration: dur, ease: 'power1.inOut' }, t);
  const shimmer = (el, t, dur = 1.6) => tl.fromTo(el, { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: dur, ease: 'power1.inOut', ...IR }, t);

  // Draw an illustration object by object, then bloom its watercolour fills.
  function drawArt(svg, t, dur = 1.4, exclude = null) {
    const uniq = Array.from(svg.querySelectorAll('.obj')).filter((o) => !(exclude && o.matches(exclude)));
    const n = uniq.length || 1;
    uniq.forEach((o, i) => {
      const t0 = t + (i / n) * dur * 0.55;
      const lines = o.querySelectorAll(':scope > .lns .ln');
      if (lines.length) tl.fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur * 0.6, ease: 'power1.inOut', stagger: Math.min(0.06, (dur * 0.3) / lines.length) }, t0);
      const ko = o.querySelector(':scope > .ko');
      if (ko) tl.fromTo(ko, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur * 0.55, ease: 'power1.in' }, t0);
      const fl = o.querySelector(':scope > .fl');
      if (fl) tl.fromTo(fl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' }, t + dur * 0.7 + (i / n) * 0.3);
    });
    const extra = svg.querySelectorAll('.sprinkle');
    if (extra.length) tl.fromTo(extra, { autoAlpha: 0, scale: 0.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(3)' }, t + dur * 0.8);
  }

  function show(id, t, z = 1) { tl.set(`#s-${id}`, { autoAlpha: 1, zIndex: z }, t); }
  function hide(id, t) { tl.set(`#s-${id}`, { autoAlpha: 0 }, t); }

  // Book page turn around the left spine. `mid` = moment the page is edge-on.
  function pageTurn(from, to, mid, o = {}) {
    const dur = o.dur ?? 0.9, t0 = mid - dur / 2;
    const A = `#s-${from}`, B = `#s-${to}`;
    tl.set(B, { autoAlpha: 1, zIndex: 1, rotationY: 0 }, t0);
    tl.set(A, { zIndex: 2 }, t0);
    tl.fromTo(A, { rotationY: 0 }, { rotationY: -90, duration: dur / 2, ease: 'power2.in', ...IR }, t0);
    tl.fromTo(`${A} .shade`, { opacity: 0 }, { opacity: 0.85, duration: dur / 2, ease: 'power1.in', ...IR }, t0);
    tl.fromTo(`${B} .dim`, { opacity: 0.28 }, { opacity: 0, duration: dur, ease: 'power1.out', ...IR }, t0);
    tl.set(A, { autoAlpha: 0, rotationY: 0 }, mid);
    tl.set(`${A} .shade`, { opacity: 0 }, mid);
    tl.set('#turnback', { autoAlpha: 1, backgroundImage: o.back || 'linear-gradient(90deg, #EADBC8, #FBF4EA 55%, #F2E6D6)', backgroundSize: o.backSize || '100% 100%' }, mid);
    tl.fromTo('#turnback', { rotationY: -90 }, { rotationY: -180, duration: dur / 2, ease: 'power2.out', ...IR }, mid);
    tl.fromTo('#turnback .shade', { opacity: 0.5 }, { opacity: 0, duration: dur / 2, ...IR }, mid);
    tl.set('#turnback', { autoAlpha: 0 }, mid + dur / 2);
    cue('pageturn', t0);
  }

  // A gentle, continuous "breathing" for sparkles and washes while a page is on screen
  function ambient(root, t0, t1) {
    const span = t1 - t0;
    $$(`${root} .wash`).forEach((w, i) => tl.fromTo(w, { scale: 1, x: 0 }, { scale: 1.06, x: i % 2 ? -18 : 18, duration: span, ease: 'none', ...IR }, t0));
    $$(`${root} .sparkles`).forEach((s) => tl.fromTo(s, { opacity: 1 }, { opacity: 0.5, duration: BEAT, repeat: Math.max(1, Math.floor(span / BEAT) - 1), yoyo: true, ease: 'sine.inOut', ...IR }, t0 + 1.2));
  }

  /* ================= HOOK ================= */
  show('hook', 0);
  const hook = '#s-hook';
  tl.fromTo(`${hook} .w1`, { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 0.85, scale: 1, duration: 3.2, ease: 'power2.out' }, 0);
  tl.fromTo(`${hook} .w2`, { autoAlpha: 0 }, { autoAlpha: 0.35, duration: 2.5 }, 0.3);
  const titleSpans = $$(`${hook} .hook-title span`);
  reveal(titleSpans[0], 0.12, 1.25);
  reveal(titleSpans[1], 0.95, 1.3);
  FX.burst(0.12, 250, 420, { n: 16, speed: 180, life: 1.4, size: 16 });
  FX.trail(0.12, 2.2, (u) => [150 + u * 780, u < 0.5 ? 410 + u * 40 : 560 + (u - 0.5) * 40], { n: 50, size: 12 });
  cue('twinkle', 0.1);
  FX.dust(0.5, S.cover, { n: 26, y0: 300, y1: 1600, alpha: 0.5 });

  // step 1 — feet
  const feet = $('#art-feet');
  tl.set(`${hook} .babyheart`, { autoAlpha: 0 }, 0);
  drawArt(feet, bar(1) - 0.05, 1.3);
  fadeUp(`${hook} .cap0`, bar(1) + 0.05, { dur: 0.5 });
  tl.to(`${hook} .feetwrap`, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: 'power2.in', transformOrigin: '50% 50%' }, bar(2) - 0.35);
  fadeOut(`${hook} .cap0`, bar(2) - 0.22, { dur: 0.22 });

  // step 2 — sleepy yawn
  tl.set(`${hook} .babyheart`, { autoAlpha: 1 }, bar(2) - 0.05);
  const hb = $('#art-hookbaby');
  drawArt(hb, bar(2), 1.2, '.bigheart');
  fadeUp(`${hook} .cap1`, bar(2) + 0.05, { dur: 0.5 });
  const mouth = hb.querySelector('.mouth');
  tl.fromTo(mouth, { scaleY: 0.5, scaleX: 0.8, transformOrigin: '50% 30%' }, { scaleY: 1.5, scaleX: 1.1, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 1, ...IR }, bar(2, 2));
  fadeOut(`${hook} .cap1`, bar(3) - 0.22, { dur: 0.22 });

  // step 3 — a love that changed everything
  tl.fromTo(hb.querySelector('.babywrap'), { scale: 1, x: 0, y: 0, transformOrigin: '50% 50%' }, { scale: 0.7, x: 12, y: 22, duration: 0.8, ease: 'power3.inOut', ...IR }, bar(3) - 0.2);
  tl.fromTo(hb.querySelectorAll('.moon, .hs'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ...IR }, bar(3) - 0.2);
  tl.fromTo(hb.querySelectorAll('.bigheart .ln'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power1.inOut' }, bar(3));
  tl.fromTo(hb.querySelectorAll('.bigheart .fl'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, bar(3) + 0.8);
  fadeUp(`${hook} .cap2`, bar(3) - 0.05, { dur: 0.5 });
  FX.burst(bar(3) + 1.1, 540, 900, { n: 14, speed: 200, life: 1.2 });
  cue('twinkle', bar(3) + 1.0, 0.7);
  tl.fromTo(`${hook} .babyheart`, { scale: 1 }, { scale: 1.07, duration: BEAT, yoyo: true, repeat: 1, ease: 'sine.inOut', ...IR }, bar(3, 2));

  /* ================= COVER (heart iris) ================= */
  const cov = '#s-cover';
  tl.set(cov, { autoAlpha: 1, zIndex: 3 }, S.cover - 0.5);
  tl.fromTo(cov, { '--iris': '0px' }, { '--iris': '1500px', duration: 0.5, ease: 'power2.in' }, S.cover - 0.5);
  hide('hook', S.cover + 0.02);
  cue('swell', S.cover - 0.5);
  tl.fromTo(`${cov} .emblem path`, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, stagger: 0.15, ease: 'power1.inOut' }, S.cover + 0.05);
  reveal(`${cov} .brand`, S.cover + 0.15, 1.35);
  tl.fromTo(`${cov} .brand`, { scale: 1.05 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, S.cover + 0.15);
  FX.burst(S.cover + 0.35, 540, 760, { n: 30, speed: 420, life: 1.6, size: 18 });
  cue('sparkle', S.cover + 0.3);
  tl.fromTo(`${cov} .sub`, { autoAlpha: 0, letterSpacing: '0.5em' }, { autoAlpha: 1, letterSpacing: '0.24em', duration: 1.2, ease: 'power3.out' }, S.cover + 0.7);
  tl.fromTo(`${cov} .rule`, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, S.cover + 1.1);
  fadeUp(`${cov} .tagline`, S.cover + 1.3, { dur: 0.6 });
  fadeUp(`${cov} .proof`, S.cover + 1.85, { dur: 0.6 });
  shimmer(`${cov} .brand`, bar(4, 3), 1.8);
  tl.fromTo('#art-feet-cover .ln', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.3, stagger: 0.03 }, bar(5));
  FX.dust(S.cover, S.invite + 0.2, { n: 34, alpha: 0.75, seed: 77 });

  /* ================= INVITE ================= */
  pageTurn('cover', 'invite', S.invite + 0.35, { dur: 1.0, back: 'radial-gradient(circle at 14px 14px, rgba(184,136,60,.45) 3px, transparent 3.5px), linear-gradient(90deg, #E9CFC6, #F6E4DD)', backSize: '56px 56px, 100% 100%' });
  const inv = '#s-invite';
  fadeUp(`${inv} .big`, S.invite + 0.45, { dur: 0.9 });
  fadeUp(`${inv} .q`, S.invite + 1.25);
  $$(`${inv} .toc li`).forEach((li, i) => {
    tl.fromTo(li, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, bar(6, 3) + i * BEAT / 4);
    cue('tick', bar(6, 3) + i * BEAT / 4, 0.5);
  });
  ambient(inv, S.invite, S.sunshine);

  /* ================= CHAPTERS ================= */
  function chapter(c, S0, nBars) {
    const root = `#s-${c.id}`;
    const b = (x) => S0 + x * BAR;
    fadeUp(`${root} .kicker`, S0 + 0.05, { y: 16 });
    fadeUp(`${root} .headline`, S0 + 0.15, { dur: 0.9 });
    const art = $(`${root} .artbox svg`);
    drawArt(art, S0 + 0.3, 1.5);
    // phase 2: make room for the offer
    tl.fromTo(`${root} .headline`, { scale: 1, y: 0 }, { scale: 0.62, y: -18, duration: 0.85, ease: 'power3.inOut', ...IR }, b(1) - 0.15);
    tl.fromTo(`${root} .artbox`, { scale: 1, y: 0 }, { scale: 0.485, y: -76, duration: 0.85, ease: 'power3.inOut', ...IR }, b(1) - 0.15);
    tl.fromTo(`${root} .name`, { autoAlpha: 0, y: 40, letterSpacing: '0.2em' }, { autoAlpha: 1, y: 0, letterSpacing: '0.06em', duration: 1.1, ease: 'power3.out' }, b(1) + 0.3);
    shimmer(`${root} .name`, b(1) + 0.7, 1.5);
    tl.fromTo(`${root} .price .rule`, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, b(1.5) - 0.1);
    pop(`${root} .price .amt`, b(1.5), { from: 0.55 });
    FX.burst(b(1.5) + 0.05, 540, 985, { n: 18, speed: 320, life: 1.2, size: 14 });
    cue('chime', b(1.5));
    fadeUp(`${root} .type`, b(1.75), { y: 20 });
    pop(`${root} .badge .pill`, b(2), { from: 0.8 });
    cue('pop', b(2), 0.7);
    $$(`${root} .stat`).forEach((s, i) => {
      tl.fromTo(s, { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, b(2.5) + i * BEAT);
      cue('pop', b(2.5) + i * BEAT, 0.55);
    });
    fadeUp(`${root} .runner`, b(2.5), { y: 0, dur: 1.2 });
    ambient(root, S0, S0 + nBars * BAR + 0.6);
  }

  // Chapter One — Sunshine
  pageTurn('invite', 'sunshine', S.sunshine);
  chapter(CHAPTERS[0], S.sunshine, 5);
  tl.fromTo('#art-sunshine .rays', { rotation: 0 }, { rotation: 45, duration: 5 * BAR + 1, ease: 'none', svgOrigin: '320 206', ...IR }, S.sunshine);

  // Chapter Two — Wonderland
  pageTurn('sunshine', 'wonderland', S.wonderland);
  chapter(CHAPTERS[1], S.wonderland, 5);
  tl.fromTo('#art-wonderland .hearts', { y: 0 }, { y: -14, duration: BEAT * 2, yoyo: true, repeat: 8, ease: 'sine.inOut', ...IR }, S.wonderland + 1.5);

  // Chapter Three — Fairytale
  pageTurn('wonderland', 'fairytale', S.fairytale);
  chapter(CHAPTERS[2], S.fairytale, 5);
  tl.fromTo('#art-fairytale .sitter', { rotation: -2 }, { rotation: 2, duration: BEAT * 2, yoyo: true, repeat: 7, ease: 'sine.inOut', svgOrigin: '320 520', ...IR }, S.fairytale + 1.8);

  /* ================= PIXIE DUST ================= */
  const px = '#s-pixie';
  const pxb = (x) => S.pixie + x * BAR;
  // night falls: diagonal gold-dust wipe
  tl.set(px, { autoAlpha: 1, zIndex: 3 }, S.pixie - 0.75);
  tl.fromTo(px, { '--e': '-420px' }, { '--e': '2350px', duration: 1.05, ease: 'power1.inOut' }, S.pixie - 0.75);
  hide('fairytale', S.pixie + 0.33);
  // sparkle the whole length of the moving wipe edge (edge runs from (0, e+300) to (1080, e-300))
  const wipeE = (u) => { const x = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; return -420 + x * 2770; };
  for (let k = 0; k < 7; k++) {
    const x = 60 + k * 160;
    FX.trail(S.pixie - 0.75, S.pixie + 0.3, (u) => [x, wipeE(u) + 300 - (x / 1080) * 600], { n: 26, size: 16, head: k % 2 === 0, seed: 700 + k });
  }
  cue('magic', S.pixie - 0.75);
  const starDraw = FX.starfield($(`${px} .stars`), 7, 170);
  PIXIE_STARS.fn = starDraw;

  fadeUp(`${px} .kicker`, S.pixie + 0.1, { y: 16 });
  fadeUp(`${px} .headline`, S.pixie + 0.25, { dur: 1.0 });
  const heroMoons = $$(`${px} .moonrow .moon`);
  heroMoons.forEach((m, i) => {
    const t = S.pixie + 0.9 + i * 0.26;
    tl.fromTo(m.querySelector('.moon-ring'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, S.pixie + 0.5 + i * 0.1);
    tl.fromTo(m.querySelector('.moon-dark'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, S.pixie + 0.5 + i * 0.1);
    tl.fromTo(m.querySelector('.moon-lit'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, t);
  });
  FX.trail(S.pixie + 0.75, S.pixie + 2.2, (u) => [140 + u * 800, 700 - Math.sin(u * Math.PI) * 60], { n: 60, size: 15 });
  cue('twinkle', S.pixie + 0.8, 0.8);
  tl.fromTo(`${px} .pname`, { autoAlpha: 0, y: 40, letterSpacing: '0.2em' }, { autoAlpha: 1, y: 0, letterSpacing: '0.06em', duration: 1.1, ease: 'power3.out' }, pxb(1));
  shimmer(`${px} .pname`, pxb(1) + 0.5, 1.6);
  FX.burst(pxb(1) + 0.1, 540, 1030, { n: 30, speed: 420, life: 1.5, size: 18 });
  cue('chime', pxb(1));
  fadeUp(`${px} .ptype`, pxb(1) + 0.5, { y: 16 });
  fadeUp(`${px} .pline`, pxb(1) + 0.7, { dur: 0.8 });
  // phase B — what's included
  fadeOut([`${px} .kicker`, `${px} .headline`, `${px} .moonrow`, `${px} .pname`, `${px} .ptype`, `${px} .pline`], pxb(3.5) - 0.3, { dur: 0.45, y: -30 });
  fadeUp(`${px} .hdr`, pxb(3.5), { y: 24 });
  tl.fromTo(`${px} .five`, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }, pxb(3.5) + 0.25);
  cue('chime', pxb(3.5) + 0.25, 0.7);
  pop(`${px} .fam .pill`, pxb(4), { from: 0.8 });
  cue('pop', pxb(4), 0.7);
  $$(`${px} .stat`).forEach((s, i) => {
    tl.fromTo(s, { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, pxb(4.5) + i * BEAT);
    cue('pop', pxb(4.5) + i * BEAT, 0.55);
  });
  // phase C — choose one schedule
  tl.to([`${px} .five`, `${px} .fam`, `${px} .stats`], { autoAlpha: 0, x: -120, duration: 0.45, ease: 'power2.in', stagger: 0.05 }, pxb(6.25));
  fadeUp(`${px} .choose`, pxb(6.5), { y: 16 });
  [0, 1].forEach((k) => {
    const card = $(`${px} .opt${k}`);
    const t0 = pxb(6.5 + k) + 0.15;
    tl.fromTo(card, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t0);
    card.querySelectorAll('.moon').forEach((m, i) => {
      tl.fromTo(m.querySelector('.moon-ring'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, t0 + 0.2 + i * BEAT / 2);
      tl.fromTo(m.querySelector('.moon-lit'), { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, t0 + 0.3 + i * BEAT / 2);
      cue('tick', t0 + 0.3 + i * BEAT / 2, 0.45);
    });
    tl.fromTo(card.querySelectorAll('.mlabel, .munit'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: BEAT / 2 }, t0 + 0.35);
    pop(card.querySelector('.oprice'), pxb(7 + k), { from: 0.6 });
    FX.burst(pxb(7 + k) + 0.05, 820, (k ? 890 : 510) + 60, { n: 16, speed: 260, life: 1.1, size: 13 });
    cue('chime', pxb(7 + k), 0.8);
  });
  fadeUp(`${px} .or`, pxb(7.5), { y: 10 });
  const fine = $$(`${px} .fine div`);
  fadeUp(fine[0], pxb(8.75), { y: 16 });
  fadeUp(fine[1], pxb(9.25), { y: 16 });
  fadeUp(`${px} .runner`, pxb(8.75), { y: 0, dur: 1.2 });
  FX.dust(S.pixie, S.cake + 0.3, { n: 30, alpha: 0.6, seed: 5150 });

  /* ================= CAKE SMASH (confetti iris) ================= */
  const ck = '#s-cake';
  tl.set(ck, { autoAlpha: 1, zIndex: 4 }, S.cake - 0.35);
  tl.fromTo(ck, { '--iris': '0px' }, { '--iris': '1400px', duration: 0.75, ease: 'power2.in' }, S.cake - 0.35);
  hide('pixie', S.cake + 0.42);
  FX.confetti(S.cake - 0.05, 540, 1500, { n: 170, speed: 1900, dur: 4.2, seed: 31 });
  cue('confetti', S.cake - 0.05);
  chapter(CHAPTERS[3], S.cake, 5);
  tl.fromTo('#art-cake .flame', { scaleY: 0.92, scaleX: 1.05 }, { scaleY: 1.12, scaleX: 0.92, duration: BEAT / 2, yoyo: true, repeat: 38, ease: 'sine.inOut', ...IR }, S.cake + 0.5);
  FX.confetti(bar(SCENE_BARS.cake, 6) + 0.05, 540, 1250, { n: 70, speed: 1200, dur: 3.2, cone: 1.8, seed: 32 });

  /* ================= SEASIDE (wave wipe) ================= */
  const ss = '#s-seaside';
  tl.set('#wavewipe', { autoAlpha: 1, y: 1920 }, S.seaside - 0.7);
  tl.to('#wavewipe', { y: -2900, duration: 1.4, ease: 'power1.inOut' }, S.seaside - 0.7);
  tl.set('#wavewipe', { autoAlpha: 0 }, S.seaside + 0.71);
  show('seaside', S.seaside - 0.02, 5);
  hide('cake', S.seaside);
  cue('wave', S.seaside - 0.7);
  chapter(CHAPTERS[4], S.seaside, 4);
  tl.fromTo('#art-seaside .w1', { x: 0 }, { x: -80, duration: BEAT * 4, repeat: 3, ease: 'none', ...IR }, S.seaside);
  tl.fromTo('#art-seaside .w2', { x: -96 }, { x: 0, duration: BEAT * 4, repeat: 3, ease: 'none', ...IR }, S.seaside);
  tl.fromTo('#art-seaside .rays', { rotation: 0 }, { rotation: 30, duration: 4 * BAR + 1, ease: 'none', svgOrigin: '350 232', ...IR }, S.seaside);

  /* ================= EXTRAS ================= */
  pageTurn('seaside', 'extras', S.extras);
  const ex = '#s-extras';
  fadeUp(`${ex} .k1`, S.extras + 0.1, { y: 14 });
  fadeUp(`${ex} .h1`, S.extras + 0.2);
  drawArt($('#art-twins'), S.extras + 0.35, 1.1);
  fadeUp(`${ex} .l1a`, S.extras + 0.9, { y: 20 });
  FX.burst(S.extras + 1.0, 560, 810, { n: 14, speed: 240, life: 1.1, size: 13 });
  cue('chime', S.extras + 0.95, 0.8);
  fadeUp(`${ex} .l2a`, S.extras + 1.45, { y: 20 });
  tl.fromTo(`${ex} .divider`, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, bar(SCENE_BARS.extras, 5));
  fadeUp(`${ex} .k2`, bar(SCENE_BARS.extras, 5), { y: 14 });
  fadeUp(`${ex} .h2`, bar(SCENE_BARS.extras, 5) + 0.1);
  drawArt($('#art-prints'), bar(SCENE_BARS.extras, 5) + 0.2, 1.0);
  fadeUp(`${ex} .l1b`, bar(SCENE_BARS.extras, 6) + 0.1, { y: 20 });
  FX.burst(bar(SCENE_BARS.extras, 6) + 0.2, 540, 1450, { n: 14, speed: 240, life: 1.1, size: 13 });
  cue('chime', bar(SCENE_BARS.extras, 6) + 0.15, 0.8);
  ambient(ex, S.extras, S.how + 0.6);

  /* ================= HOW IT WORKS ================= */
  pageTurn('extras', 'how', S.how);
  const hw = '#s-how';
  fadeUp(`${hw} .kicker`, S.how + 0.05, { y: 14 });
  fadeUp(`${hw} .h`, S.how + 0.15, { dur: 0.9 });
  $$(`${hw} .step`).forEach((st, i) => {
    const t = S.how + 1.15 + i * 2.0;
    tl.fromTo(st, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' }, t);
    tl.fromTo(st.querySelector('.ic'), { scale: 0.4 }, { scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, t);
    tl.fromTo(st.querySelectorAll('.icon path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, stagger: 0.08 }, t + 0.1);
    cue('pop', t, 0.6);
  });
  fadeUp(`${hw} .cta`, S.how + 9.2, { y: 16 });
  ambient(hw, S.how, S.closing + 0.6);

  /* ================= CLOSING — back cover ================= */
  const cl = '#s-closing';
  // the back cover swings in from the left and closes the book
  tl.set('#turnback', { autoAlpha: 1, rotationY: -180, backgroundImage: 'linear-gradient(90deg, #5A2D3A, #74404E)', backgroundSize: '100% 100%', zIndex: 45 }, S.closing - 0.5);
  tl.to('#turnback', { rotationY: -90, duration: 0.5, ease: 'power2.in' }, S.closing - 0.5);
  tl.set('#turnback', { autoAlpha: 0, zIndex: 40 }, S.closing);
  tl.set(cl, { autoAlpha: 1, zIndex: 6, rotationY: -90 }, S.closing);
  tl.to(cl, { rotationY: 0, duration: 0.5, ease: 'power2.out' }, S.closing);
  tl.fromTo(`${hw} .dim`, { opacity: 0 }, { opacity: 0.4, duration: 1, ...IR }, S.closing - 0.5);
  hide('how', S.closing + 0.55);
  cue('pageturn', S.closing - 0.5);
  fadeUp(`${cl} .line`, S.closing + 0.45, { dur: 1.0 });
  tl.fromTo(`${cl} .emblem path`, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.0, stagger: 0.12 }, S.closing + 0.9);
  reveal(`${cl} .brand`, S.closing + 1.0, 1.2);
  FX.burst(S.closing + 1.2, 540, 760, { n: 26, speed: 380, life: 1.5, size: 17 });
  cue('sparkle', S.closing + 1.1, 0.8);
  tl.fromTo(`${cl} .sub`, { autoAlpha: 0, letterSpacing: '0.4em' }, { autoAlpha: 1, letterSpacing: '0.2em', duration: 1.1, ease: 'power3.out' }, S.closing + 1.7);
  // website — the hero call to action, lands on the resolving downbeat
  tl.fromTo(`${cl} .web`, { autoAlpha: 0, scale: 0.8, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }, bar(SCENE_BARS.closing + 1) - 0.1);
  FX.burst(bar(SCENE_BARS.closing + 1) + 0.05, 540, 1085, { n: 34, speed: 520, life: 1.7, size: 18 });
  cue('bigchime', bar(SCENE_BARS.closing + 1) - 0.05);
  fadeUp(`${cl} .ig`, bar(SCENE_BARS.closing + 1, 2) + 0.05, { y: 16 });
  fadeUp(`${cl} .ph`, bar(SCENE_BARS.closing + 1, 3) + 0.1, { y: 16 });
  tl.fromTo(`${cl} .web`, { scale: 1 }, { scale: 1.035, duration: BEAT * 2, yoyo: true, repeat: 5, ease: 'sine.inOut', ...IR }, bar(SCENE_BARS.closing + 2));
  shimmer(`${cl} .brand`, bar(SCENE_BARS.closing + 2), 2.0);
  // keep the call-to-action block clean: dust only in the margins and the top band
  FX.dust(S.closing + 0.5, DURATION + 1, { n: 14, alpha: 0.7, seed: 4242, fade: 1.0, x0: 70, x1: 150, y0: 300, y1: 1800 });
  FX.dust(S.closing + 0.5, DURATION + 1, { n: 14, alpha: 0.7, seed: 4343, fade: 1.0, x0: 930, x1: 1010, y0: 300, y1: 1800 });
  FX.dust(S.closing + 0.5, DURATION + 1, { n: 12, alpha: 0.6, seed: 4444, fade: 1.0, x0: 150, x1: 930, y0: 150, y1: 330 });
  tl.fromTo('#art-feet-close .ln', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, stagger: 0.03 }, bar(SCENE_BARS.closing + 1, 3));

  tl.set({}, {}, DURATION); // pad the timeline to the full length
  return tl;
}
const PIXIE_STARS = { fn: null };
