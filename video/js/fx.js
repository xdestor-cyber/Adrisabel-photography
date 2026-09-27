/* Deterministic particle effects. Every particle is a pure function of time,
 * so any frame can be rendered in any order (needed for parallel export).
 */
const FX = (() => {
  const events = [];
  let ctx = null;
  const sprites = {};

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let seedCounter = 1;

  function makeSprite(draw, size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    return c;
  }
  function initSprites() {
    sprites.glow = makeSprite((g, s) => {
      const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      r.addColorStop(0, 'rgba(255,240,200,1)'); r.addColorStop(0.25, 'rgba(240,205,130,.55)'); r.addColorStop(1, 'rgba(235,200,120,0)');
      g.fillStyle = r; g.fillRect(0, 0, s, s);
    }, 64);
    sprites.star = makeSprite((g, s) => {
      const c = s / 2, R = s * 0.48, k = R * 0.12;
      const r = g.createRadialGradient(c, c, 0, c, c, R);
      r.addColorStop(0, 'rgba(255,248,225,1)'); r.addColorStop(0.5, 'rgba(245,215,150,.95)'); r.addColorStop(1, 'rgba(225,180,100,.2)');
      g.fillStyle = r;
      g.beginPath();
      g.moveTo(c, c - R); g.quadraticCurveTo(c + k, c - k, c + R, c); g.quadraticCurveTo(c + k, c + k, c, c + R);
      g.quadraticCurveTo(c - k, c + k, c - R, c); g.quadraticCurveTo(c - k, c - k, c, c - R); g.fill();
    }, 64);
  }

  /* ---------- event builders ---------- */
  // Radial sparkle burst (price reveals, magic moments)
  function burst(t0, x, y, o = {}) {
    const R = mulberry32(o.seed || seedCounter++);
    const n = o.n || 22, parts = [];
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2, sp = (o.speed || 260) * (0.35 + R() * 0.8);
      parts.push({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.lift || 60), life: (o.life || 1.3) * (0.6 + R() * 0.6), size: (o.size || 16) * (0.5 + R()), tw: R() * 6.28, star: R() < (o.starRatio ?? 0.6) });
    }
    events.push({ kind: 'burst', t0, t1: t0 + (o.life || 1.3) * 1.3, x, y, parts, drag: o.drag ?? 2.2, g: o.gravity ?? 90, alpha: o.alpha ?? 1 });
  }

  // Party confetti (cake smash)
  function confetti(t0, x, y, o = {}) {
    const R = mulberry32(o.seed || seedCounter++);
    const cols = o.colors || ['#F6BCC6', '#F7E1A0', '#C6DFEE', '#CBDABD', '#DCCFF0', '#EBCB8B', '#F4C9C0'];
    const n = o.n || 140, parts = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (R() - 0.5) * (o.cone || 2.6), sp = (o.speed || 1500) * (0.35 + R() * 0.75);
      parts.push({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: 14 + R() * 14, h: 8 + R() * 8, rot: R() * 6.28, vr: (R() - 0.5) * 14, flip: 4 + R() * 8, ph: R() * 6.28, col: cols[(R() * cols.length) | 0], sway: 30 + R() * 60 });
    }
    events.push({ kind: 'confetti', t0, t1: t0 + (o.dur || 4.5), x, y, parts, g: o.gravity || 900, drag: o.drag || 1.6 });
  }

  // Slow ambient gold dust drifting upward within a time window
  function dust(t0, t1, o = {}) {
    const R = mulberry32(o.seed || seedCounter++);
    const n = o.n || 40, parts = [];
    for (let i = 0; i < n; i++) {
      parts.push({ x: (o.x0 ?? 60) + R() * ((o.x1 ?? 1020) - (o.x0 ?? 60)), y: (o.y0 ?? 200) + R() * ((o.y1 ?? 1700) - (o.y0 ?? 200)), vy: -(10 + R() * 26), sx: 10 + R() * 30, f: 0.2 + R() * 0.5, ph: R() * 6.28, size: (o.size || 12) * (0.4 + R() * 0.9), star: R() < 0.35 });
    }
    events.push({ kind: 'dust', t0, t1, parts, fade: o.fade ?? 0.8, alpha: o.alpha ?? 0.8 });
  }

  // Sparkles shed by a moving emitter; path(u) → [x, y] for u in 0..1
  function trail(t0, t1, path, o = {}) {
    const R = mulberry32(o.seed || seedCounter++);
    const n = o.n || 70, parts = [];
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      parts.push({ u, born: t0 + u * (t1 - t0), vx: (R() - 0.5) * 70, vy: 20 + R() * 70, life: 0.7 + R() * 0.9, size: (o.size || 14) * (0.5 + R() * 0.9), tw: R() * 6.28, star: R() < 0.55 });
    }
    events.push({ kind: 'trail', t0, t1: t1 + 1.8, path, parts, head: o.head ?? true, tEnd: t1 });
  }

  /* ---------- drawing ---------- */
  function spr(img, x, y, s, a, rot = 0) {
    if (a <= 0.003 || s <= 0.3) return;
    ctx.globalAlpha = Math.min(1, a);
    if (rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(img, -s / 2, -s / 2, s, s); ctx.restore();
    } else ctx.drawImage(img, x - s / 2, y - s / 2, s, s);
  }
  const ease = (x) => 1 - Math.pow(1 - x, 3);

  function drawEvent(e, t) {
    const age = t - e.t0;
    if (e.kind === 'burst') {
      for (const p of e.parts) {
        if (age > p.life) continue;
        const k = e.drag, fx = (1 - Math.exp(-k * age)) / k;
        const x = e.x + p.vx * fx, y = e.y + p.vy * fx + 0.5 * e.g * age * age;
        const life = age / p.life, a = e.alpha * (life < 0.15 ? life / 0.15 : 1 - ease((life - 0.15) / 0.85)) * (0.65 + 0.35 * Math.sin(p.tw + age * 18));
        if (p.star) spr(sprites.star, x, y, p.size * 1.6, a, age * 1.5 + p.tw);
        spr(sprites.glow, x, y, p.size * 2.4, a * 0.55);
      }
    } else if (e.kind === 'confetti') {
      ctx.globalCompositeOperation = 'source-over';
      for (const p of e.parts) {
        const k = e.drag, fx = (1 - Math.exp(-k * age)) / k;
        const vt = e.g / k; // terminal-ish fall
        const x = e.x + p.vx * fx + Math.sin(age * 3 + p.ph) * p.sway * Math.min(1, age);
        const y = e.y + p.vy * fx + vt * (age - fx);
        if (y > 2000) continue;
        const a = age > e.t1 - e.t0 - 0.8 ? Math.max(0, (e.t1 - e.t0 - age) / 0.8) : 1;
        ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(p.rot + p.vr * age);
        ctx.scale(Math.cos(p.ph + age * p.flip), 1); ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      ctx.globalCompositeOperation = 'lighter';
    } else if (e.kind === 'dust') {
      const span = e.t1 - e.t0;
      const env = Math.min(1, age / e.fade, (span - age) / e.fade);
      for (const p of e.parts) {
        let y = p.y + p.vy * age;
        const x = p.x + Math.sin(age * p.f + p.ph) * p.sx;
        const a = e.alpha * env * (0.35 + 0.65 * Math.pow(Math.sin(age * 1.7 + p.ph) * 0.5 + 0.5, 2));
        if (p.star) spr(sprites.star, x, y, p.size * 1.5, a, p.ph);
        spr(sprites.glow, x, y, p.size * 2.2, a * 0.6);
      }
    } else if (e.kind === 'trail') {
      if (e.head && t <= e.tEnd + 0.15) {
        const u = Math.max(0, Math.min(1, (t - e.t0) / (e.tEnd - e.t0)));
        const [hx, hy] = e.path(u);
        const fade = t > e.tEnd ? 1 - (t - e.tEnd) / 0.15 : 1;
        spr(sprites.glow, hx, hy, 120, 0.9 * fade);
        spr(sprites.star, hx, hy, 58, fade, t * 3);
      }
      for (const p of e.parts) {
        const pa = t - p.born;
        if (pa < 0 || pa > p.life) continue;
        const [x0, y0] = e.path(p.u);
        const x = x0 + p.vx * pa, y = y0 + p.vy * pa + 40 * pa * pa;
        const l = pa / p.life, a = (1 - ease(l)) * (0.6 + 0.4 * Math.sin(p.tw + pa * 20));
        if (p.star) spr(sprites.star, x, y, p.size * 1.5, a, p.tw + pa * 2);
        spr(sprites.glow, x, y, p.size * 2.2, a * 0.6);
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, 1080, 1920);
    ctx.globalCompositeOperation = 'lighter';
    for (const e of events) if (t >= e.t0 && t <= e.t1) drawEvent(e, t);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // Twinkling star field painted into a scene-local canvas
  function starfield(canvas, seed = 42, n = 150) {
    const R = mulberry32(seed);
    const stars = [];
    for (let i = 0; i < n; i++) stars.push({ x: R() * 1080, y: R() * 1920, s: 3 + R() * 9, ph: R() * 6.28, f: 0.6 + R() * 1.6, big: R() < 0.12 });
    const g = canvas.getContext('2d');
    return (t) => {
      g.clearRect(0, 0, 1080, 1920);
      g.globalCompositeOperation = 'lighter';
      for (const s of stars) {
        const a = 0.25 + 0.75 * Math.pow(Math.sin(t * s.f + s.ph) * 0.5 + 0.5, 3);
        g.globalAlpha = a * (s.big ? 1 : 0.7);
        const sz = s.big ? s.s * 3.2 : s.s;
        g.drawImage(s.big ? sprites.star : sprites.glow, s.x - sz / 2, s.y - sz / 2, sz, sz);
      }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    };
  }

  function init(canvas) { ctx = canvas.getContext('2d'); initSprites(); }
  return { init, burst, confetti, dust, trail, draw, starfield };
})();
