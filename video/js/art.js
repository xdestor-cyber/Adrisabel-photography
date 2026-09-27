/* Original line-art illustrations for the Adrisabel storybook.
 * Style: gold ink lines that draw themselves (class .ln) over soft,
 * slightly off-register watercolor fills (class .fl). All hand-authored SVG.
 */
const ART = (() => {
  const f = (n) => +n.toFixed(1);
  const circ = (cx, cy, r) => `M ${f(cx - r)} ${f(cy)} a ${r} ${r} 0 1 0 ${f(2 * r)} 0 a ${r} ${r} 0 1 0 ${f(-2 * r)} 0`;
  const ell = (cx, cy, rx, ry) => `M ${f(cx - rx)} ${f(cy)} a ${rx} ${ry} 0 1 0 ${f(2 * rx)} 0 a ${rx} ${ry} 0 1 0 ${f(-2 * rx)} 0`;
  const spark = (cx, cy, r) => {
    const k = r * 0.16;
    return `M ${f(cx)} ${f(cy - r)} Q ${f(cx + k)} ${f(cy - k)} ${f(cx + r)} ${f(cy)} Q ${f(cx + k)} ${f(cy + k)} ${f(cx)} ${f(cy + r)} Q ${f(cx - k)} ${f(cy + k)} ${f(cx - r)} ${f(cy)} Q ${f(cx - k)} ${f(cy - k)} ${f(cx)} ${f(cy - r)} Z`;
  };
  const heart = (cx, cy, s) => {
    const p = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`;
    return `M ${p(0, 0.85)} C ${p(-0.55, 0.45)} ${p(-1.05, 0.05)} ${p(-1.0, -0.4)} C ${p(-0.95, -0.85)} ${p(-0.35, -1.0)} ${p(0, -0.55)} C ${p(0.35, -1.0)} ${p(0.95, -0.85)} ${p(1.0, -0.4)} C ${p(1.05, 0.05)} ${p(0.55, 0.45)} ${p(0, 0.85)} Z`;
  };

  const L = (d, cls = '') => `<path class="ln ${cls}" d="${d}"/>`;
  const F = (d, c, extra = '') => `<path d="${d}" fill="${c}" ${extra}/>`;
  // One drawable object: optional knockout (paper-coloured silhouette that hides
  // lines behind it), offset watercolour fills, then the gold lines on top.
  const obj = ({ fills = '', lines = '', knock = '', cls = '', attrs = '' }) =>
    `<g class="obj ${cls}" ${attrs}>${knock ? `<g class="ko">${knock}</g>` : ''}` +
    `<g class="fl" transform="translate(9,8)">${fills}</g><g class="lns">${lines}</g></g>`;
  const svg = (id, vb, body, cls = '') =>
    `<svg class="illus ${cls}" id="${id}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

  /* ---------- reusable pieces ---------- */
  function baby({ mouth = 'smile', swaddle = COL.lav, hat = COL.butter, cls = 'baby', attrs = '' } = {}) {
    const swad = 'M 288 196 C 372 150 524 170 558 248 C 588 318 524 364 420 366 C 350 368 296 348 262 312';
    const fills =
      F(swad + ' L 200 250 Z', swaddle) +
      F(circ(200, 250, 88), COL.skin) +
      F('M 114 236 C 112 168 160 128 208 128 C 262 128 294 168 290 228 C 250 212 158 212 114 236 Z', hat) +
      F(circ(206, 112, 17), hat) +
      F(circ(154, 296, 15), COL.blush) + F(circ(246, 296, 15), COL.blush);
    const mouthD = mouth === 'yawn' ? ell(200, 318, 8, 10) : 'M 190 312 Q 200 321 210 312';
    const lines =
      L(swad) +
      L('M 334 178 C 360 238 356 302 330 356') +
      L('M 436 172 C 460 236 464 302 444 364') +
      L('M 114 236 A 88 88 0 1 0 286 230') +
      L('M 114 236 C 112 168 160 128 208 128 C 262 128 294 168 290 228 C 250 212 158 212 114 236') +
      L(circ(206, 112, 17)) +
      L('M 154 268 Q 169 281 184 268') + L('M 216 268 Q 231 281 246 268') +
      L('M 194 291 Q 200 297 206 291') +
      L(mouthD, 'mouth');
    const knock = F(swad + ' L 200 250 Z', COL.paper) + F(circ(200, 250, 88), COL.paper) +
      F('M 114 236 C 112 168 160 128 208 128 C 262 128 294 168 290 228 Z', COL.paper);
    return obj({ fills, lines, knock, cls, attrs });
  }

  function foot(tx = 0, ty = 0, mirror = false) {
    const sole = 'M 176 262 C 166 208 192 168 236 166 C 284 164 306 200 300 250 C 295 292 276 312 275 352 C 274 398 257 436 223 436 C 186 436 170 404 176 362 C 181 322 181 296 176 262 Z';
    const toes = [[284, 134, 22, 26], [248, 117, 16, 18], [219, 115, 14, 16], [194, 125, 12, 14], [176, 143, 10, 12]];
    const t = mirror ? `translate(${600 + tx},${ty}) scale(-1,1)` : `translate(${tx},${ty})`;
    return obj({
      attrs: `transform="${t}"`,
      fills: F(sole, COL.blush) + toes.map(([x, y, rx, ry]) => F(ell(x, y, rx, ry), COL.blush)).join(''),
      lines: L(sole) + toes.map(([x, y, rx, ry]) => L(ell(x, y, rx, ry))).join(''),
    });
  }

  const sparkles = (pts, cls = '') => obj({
    cls: 'sparkles ' + cls,
    fills: pts.map(([x, y, r]) => F(spark(x, y, r), COL.goldl)).join(''),
    lines: pts.map(([x, y, r]) => L(spark(x, y, r))).join(''),
  });

  /* ---------- hook ---------- */
  const hookFeet = svg('art-feet', '0 0 600 520',
    foot(-40, 40) + foot(40, 12, true) +
    sparkles([[300, 70, 16], [86, 120, 11], [520, 470, 12]]));

  const hookBaby = svg('art-hookbaby', '0 0 640 560',
    obj({ cls: 'bigheart', fills: F(heart(320, 300, 285), COL.blush, 'opacity="0.75"'), lines: L(heart(320, 300, 285)) }) +
    `<g class="babywrap">${baby({ mouth: 'yawn', attrs: 'transform="translate(-15,40)"' })}</g>` +
    obj({ cls: 'moon', fills: F('M 548 44 A 46 46 0 1 0 580 122 A 36 36 0 1 1 548 44 Z', COL.butter), lines: L('M 548 44 A 46 46 0 1 0 580 122 A 36 36 0 1 1 548 44 Z') }) +
    sparkles([[470, 70, 13], [610, 190, 10], [70, 110, 12]], 'hs'));

  /* ---------- chapter illustrations ---------- */
  const rays = (cx, cy, r1, r2, n, phase = 0) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = phase + (i / n) * Math.PI * 2;
      d += `M ${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)} L ${f(cx + Math.cos(a) * r2)} ${f(cy + Math.sin(a) * r2)} `;
    }
    return d;
  };

  const cloudD = 'M 130 472 C 80 472 76 406 130 402 C 124 348 200 328 236 368 C 256 316 344 308 366 360 C 392 324 470 330 474 384 C 526 378 558 428 522 460 C 514 468 502 472 490 472 Z';
  const sunshine = svg('art-sunshine', '0 0 640 560',
    obj({ cls: 'sun', fills: F(circ(320, 206, 116), COL.butter), lines: L(circ(320, 206, 116)) }) +
    obj({ cls: 'rays', fills: '', lines: L(rays(320, 206, 140, 178, 16)), attrs: 'style="transform-origin:320px 206px"' }) +
    baby({ mouth: 'smile', swaddle: COL.peach, hat: COL.blush, attrs: 'transform="translate(79,92) scale(0.72)"' }) +
    obj({ cls: 'cloud', knock: F(cloudD, COL.cloud), fills: F(cloudD, '#EAF1F6'), lines: L(cloudD) }) +
    sparkles([[92, 130, 13], [560, 110, 15], [596, 330, 10]]));

  // Wonderland — a family holding hands, baby in arms
  const face = (x, y, s = 1) =>
    L(`M ${x - 20 * s} ${y + 2} Q ${x - 13 * s} ${y + 9 * s} ${x - 6 * s} ${y + 2}`) +
    L(`M ${x + 6 * s} ${y + 2} Q ${x + 13 * s} ${y + 9 * s} ${x + 20 * s} ${y + 2}`) +
    L(`M ${x - 7 * s} ${y + 20 * s} Q ${x} ${y + 27 * s} ${x + 7 * s} ${y + 20 * s}`);
  const cheeks = (x, y, s = 1) => F(circ(x - 24 * s, y + 16 * s, 8 * s), COL.blush) + F(circ(x + 24 * s, y + 16 * s, 8 * s), COL.blush);

  const pA = { body: 'M 152 188 C 140 262 128 362 122 470 L 278 470 C 272 362 260 262 248 188 C 230 172 170 172 152 188 Z' };
  const pB = { body: 'M 320 172 C 310 262 308 362 310 470 L 432 470 C 434 362 432 262 422 172 C 400 156 342 156 320 172 Z' };
  const sib = { body: 'M 500 314 C 490 362 482 420 478 470 L 584 470 C 580 420 572 362 562 314 C 548 302 514 302 500 314 Z' };
  const wonderland = svg('art-wonderland', '0 0 700 520',
    obj({
      cls: 'parentA',
      knock: F(pA.body, COL.paper) + F(circ(200, 132, 44), COL.paper),
      fills: F(pA.body, COL.blush) + F(circ(200, 132, 44), COL.skin) + F(circ(200, 76, 21), COL.sand) + cheeks(200, 132),
      lines: L(pA.body) + L(circ(200, 132, 44)) + L(circ(200, 76, 21)) + L('M 158 120 C 170 92 230 92 242 120') + face(200, 130),
    }) +
    obj({
      cls: 'bundle',
      knock: F(ell(214, 262, 50, 32), COL.paper),
      fills: F(ell(214, 262, 50, 32), COL.lav) + F(circ(176, 250, 21), COL.skin),
      lines: L(ell(214, 262, 50, 32)) + L(circ(176, 250, 21)) + L('M 168 250 Q 172 254 176 250') + L('M 158 236 C 180 300 244 304 266 250'),
    }) +
    obj({
      cls: 'parentB',
      knock: F(pB.body, COL.paper) + F(circ(372, 114, 46), COL.paper),
      fills: F(pB.body, COL.sage) + F(circ(372, 114, 46), COL.skin) + F('M 326 108 C 328 60 416 58 418 108 C 400 90 350 88 326 108 Z', COL.sand) + cheeks(372, 114),
      lines: L(pB.body) + L(circ(372, 114, 46)) + L('M 326 108 C 328 60 416 58 418 108 C 400 90 350 88 326 108') +
        L('M 371 360 L 371 470') + face(372, 112) +
        L('M 322 206 C 300 222 276 226 254 208') + L('M 424 206 C 452 250 470 290 490 318'),
    }) +
    obj({
      cls: 'sibling',
      knock: F(sib.body, COL.paper) + F(circ(531, 274, 37), COL.paper),
      fills: F(sib.body, COL.butter) + F(circ(531, 274, 37), COL.skin) + F(circ(490, 262, 14), COL.sand) + F(circ(572, 262, 14), COL.sand) + cheeks(531, 274, 0.8),
      lines: L(sib.body) + L(circ(531, 274, 37)) + L(circ(490, 262, 14)) + L(circ(572, 262, 14)) +
        L('M 498 262 C 506 236 556 236 564 262') + face(531, 272, 0.8) + L('M 504 332 C 498 326 494 322 490 318') + L(circ(490, 318, 9)),
    }) +
    obj({ cls: 'ground', lines: L('M 70 470 L 640 470') + L('M 96 470 q 6 -18 12 0 M 104 470 q 6 -12 12 0 M 598 470 q 6 -18 12 0 M 606 470 q 6 -12 12 0') }) +
    obj({ cls: 'hearts', fills: F(heart(290, 70, 26), COL.straw) + F(heart(470, 190, 18), COL.straw) + F(heart(618, 220, 14), COL.straw),
      lines: L(heart(290, 70, 26)) + L(heart(470, 190, 18)) + L(heart(618, 220, 14)) }));

  // Fairytale — a happy baby with a crown in front of a storybook castle
  let cren = 'M 162 440 L 162 268';
  for (let x = 162; x < 478; x += 36) cren += ` L ${x} 248 L ${x + 18} 248 L ${x + 18} 268 L ${Math.min(x + 36, 478)} 268`;
  cren += ' L 478 440';
  const bodyS = 'M 262 370 C 226 420 226 490 262 512 L 378 512 C 414 490 414 420 378 370 C 350 356 290 356 262 370 Z';
  const crown = 'M 262 238 L 268 188 L 294 218 L 320 174 L 346 218 L 372 188 L 378 238 Z';
  const fairytale = svg('art-fairytale', '0 0 640 560',
    obj({
      cls: 'castle',
      fills: F('M 92 440 L 92 200 L 162 200 L 162 440 Z', COL.lav) + F('M 478 440 L 478 190 L 548 190 L 548 440 Z', COL.lav) +
        F('M 162 440 L 162 268 L 478 268 L 478 440 Z', COL.sky) + F('M 84 202 L 127 110 L 170 202 Z', COL.straw) + F('M 470 192 L 513 96 L 556 192 Z', COL.straw),
      lines: L('M 92 440 L 92 200 L 162 200 L 162 440') + L('M 84 202 L 127 110 L 170 202 Z') + L('M 127 110 L 127 78 L 154 89 L 127 100') +
        L('M 478 440 L 478 190 L 548 190 L 548 440') + L('M 470 192 L 513 96 L 556 192 Z') + L('M 513 96 L 513 64 L 540 75 L 513 86') +
        L(cren) + L('M 112 300 L 112 270 A 15 15 0 0 1 142 270 L 142 300') + L('M 498 290 L 498 260 A 15 15 0 0 1 528 260 L 528 290') +
        L('M 60 440 L 580 440'),
    }) +
    obj({
      cls: 'sitter',
      knock: F(bodyS, COL.paper) + F(circ(320, 300, 78), COL.paper) + F(ell(272, 516, 34, 18), COL.paper) + F(ell(368, 516, 34, 18), COL.paper) + F(crown, COL.paper),
      fills: F(bodyS, COL.blush) + F(circ(320, 300, 78), COL.skin) + F(crown, COL.butter) + F(ell(272, 516, 34, 18), COL.blush) + F(ell(368, 516, 34, 18), COL.blush) +
        F(circ(198, 304, 16), COL.skin) + F(circ(442, 304, 16), COL.skin) + F(circ(276, 326, 14), COL.blush) + F(circ(364, 326, 14), COL.blush) + F('M 300 322 Q 320 350 340 322 Z', COL.straw),
      lines: L(bodyS) + L(circ(320, 300, 78)) + L(crown) + L('M 318 232 C 304 240 312 258 326 250') +
        L('M 282 302 Q 294 288 306 302') + L('M 334 302 Q 346 288 358 302') + L('M 300 322 Q 320 350 340 322 Z') +
        L('M 268 392 C 232 382 206 352 202 320') + L(circ(198, 304, 16)) + L('M 372 392 C 408 382 434 352 438 320') + L(circ(442, 304, 16)) +
        L(ell(272, 516, 34, 18)) + L(ell(368, 516, 34, 18)),
    }) +
    sparkles([[60, 90, 14], [590, 130, 12], [580, 340, 10], [44, 330, 9], [320, 92, 12]]));

  // Cake smash — two tiers, drips, a "1" candle and bunting
  const drips = (x0, x1, y, depth) => {
    let d = `M ${x0} ${y}`;
    const n = 7, w = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const a = x0 + i * w, dd = depth * (i % 2 ? 0.6 : 1);
      d += ` C ${f(a + w * 0.15)} ${y} ${f(a + w * 0.2)} ${f(y + dd)} ${f(a + w * 0.5)} ${f(y + dd)} C ${f(a + w * 0.8)} ${f(y + dd)} ${f(a + w * 0.85)} ${y} ${f(a + w)} ${y}`;
    }
    return d;
  };
  const bunt = () => {
    let fl = '', ln = 'M 40 60 Q 320 170 600 60';
    const cols = [COL.straw, COL.butter, COL.sky, COL.sage, COL.lav, COL.peach, COL.straw];
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7;
      const x = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 320 + t * t * 600;
      const y = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 170 + t * t * 60;
      const tri = `M ${f(x - 26)} ${f(y - 2)} L ${f(x + 26)} ${f(y - 2)} L ${f(x)} ${f(y + 48)} Z`;
      fl += F(tri, cols[i]); ln += ' ' + tri;
    }
    return obj({ cls: 'bunting', fills: fl, lines: L(ln) });
  };
  const sprinkles = () => {
    const pts = [[170, 380], [215, 410], [262, 372], [318, 404], [372, 378], [420, 408], [460, 372], [235, 290], [290, 304], [350, 288], [398, 306]];
    const cols = [COL.sky, COL.butter, COL.sage, COL.lav, COL.straw];
    return pts.map(([x, y], i) => `<path d="M ${x} ${y} l 14 ${i % 2 ? -6 : 6}" stroke="${cols[i % 5]}" stroke-width="7" stroke-linecap="round" class="sprinkle"/>`).join('');
  };
  const cake = svg('art-cake', '0 0 640 560',
    bunt() +
    obj({ cls: 'plate', fills: F('M 110 446 L 530 446 Q 530 462 512 462 L 128 462 Q 110 462 110 446 Z', COL.aqua) + F(ell(320, 512, 92, 12), COL.aqua),
      lines: L('M 110 446 L 530 446 Q 530 462 512 462 L 128 462 Q 110 462 110 446 Z') + L('M 304 462 L 292 506 L 348 506 L 336 462') + L(ell(320, 512, 92, 12)) }) +
    obj({ cls: 'tier1', fills: F('M 140 446 L 140 352 Q 140 332 160 332 L 480 332 Q 500 332 500 352 L 500 446 Z', '#FBE0E4') + F(drips(140, 500, 344, 38) + ' L 500 332 L 140 332 Z', COL.cloud),
      lines: L('M 140 446 L 140 352 Q 140 332 160 332 L 480 332 Q 500 332 500 352 L 500 446') + L(drips(140, 500, 344, 38)) }) +
    obj({ cls: 'tier2', fills: F('M 200 332 L 200 252 Q 200 234 218 234 L 422 234 Q 440 234 440 252 L 440 332 Z', COL.straw) + F(drips(200, 440, 246, 30) + ' L 440 234 L 200 234 Z', COL.cloud),
      lines: L('M 200 332 L 200 252 Q 200 234 218 234 L 422 234 Q 440 234 440 252 L 440 332') + L(drips(200, 440, 246, 30)) }) +
    `<g class="sprinkles">${sprinkles()}</g>` +
    obj({ cls: 'candle', fills: F('M 306 234 L 306 160 L 334 160 L 334 234 Z', COL.butter),
      lines: L('M 306 234 L 306 160 L 334 160 L 334 234') + L('M 306 182 L 334 170 M 306 206 L 334 194 M 306 230 L 334 218') + L('M 320 160 L 320 148') }) +
    `<g class="flame" style="transform-origin:320px 146px">${obj({ fills: F('M 320 104 C 336 122 338 140 320 146 C 302 140 304 122 320 104 Z', '#F9C87A'), lines: L('M 320 104 C 336 122 338 140 320 146 C 302 140 304 122 320 104 Z') })}</g>` +
    sparkles([[70, 250, 13], [580, 240, 14], [560, 400, 9], [86, 420, 9]]));

  // Seaside — sun on the horizon, rolling waves, family footprints in the sand
  const waveRow = (y, amp, len, x0 = -200, x1 = 900) => {
    let d = `M ${x0} ${y}`;
    for (let x = x0; x < x1; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
    return d;
  };
  const footprint = (x, y, s, ang, left) => {
    const r = (px, py) => {
      const ca = Math.cos(ang), sa = Math.sin(ang);
      return [x + (px * ca - py * sa) * s, y + (px * sa + py * ca) * s];
    };
    const [cx, cy] = r(0, 0);
    let d = ell(cx, cy, 11 * s, 20 * s);
    const toes = left ? [[-6, -27], [1, -29], [7, -27]] : [[-7, -27], [-1, -29], [6, -27]];
    return { sole: d, toes: toes.map(([tx, ty]) => { const [a, b] = r(tx, ty); return circ(a, b, 3.6 * s); }).join(' ') };
  };
  const trail = (x0, y0, x1, y1, n, s0, s1, gap) => {
    let fl = '', ln = '';
    const ang = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const s = s0 + (s1 - s0) * t;
      const side = i % 2 ? 1 : -1;
      const px = x0 + (x1 - x0) * t + Math.cos(ang - Math.PI / 2 + Math.PI / 2) * side * gap * s;
      const py = y0 + (y1 - y0) * t;
      const fp = footprint(px, py, s, ang, side < 0);
      fl += F(fp.sole, COL.sand) + F(fp.toes, COL.sand);
      ln += fp.sole + ' ' + fp.toes + ' ';
    }
    return obj({ cls: 'trail', fills: fl, lines: L(ln) });
  };
  const seaside = svg('art-seaside', '0 0 700 560',
    `<defs><clipPath id="seaclip"><rect x="30" y="0" width="640" height="560" rx="30"/></clipPath><clipPath id="sunclip"><rect x="0" y="0" width="700" height="232"/></clipPath></defs>` +
    `<g clip-path="url(#sunclip)">` + obj({ cls: 'sun', fills: F(circ(350, 232, 86), COL.butter), lines: L(circ(350, 232, 86)) }) +
    obj({ cls: 'rays', lines: L(rays(350, 232, 108, 142, 18)), attrs: 'style="transform-origin:350px 232px"' }) + `</g>` +
    `<g clip-path="url(#seaclip)">` +
    obj({ cls: 'sea', fills: F('M 30 232 L 670 232 L 670 356 Q 350 330 30 356 Z', COL.aqua), lines: L('M 30 232 L 670 232') }) +
    `<g class="waves">` + obj({ cls: 'w1', lines: L(waveRow(270, 10, 80)) }) + obj({ cls: 'w2', lines: L(waveRow(304, 10, 96, -240)) }) + `</g>` +
    obj({ cls: 'shore', fills: F('M 30 356 Q 190 332 350 354 T 670 348 L 670 560 L 30 560 Z', '#F7E9CF'), lines: L('M 30 356 Q 190 332 350 354 T 670 348') }) +
    `</g>` +
    trail(250, 540, 300, 392, 5, 1.25, 0.8, 16) + trail(452, 540, 402, 392, 5, 1.25, 0.8, 16) + trail(352, 548, 350, 420, 5, 0.72, 0.5, 14) +
    obj({ cls: 'shell', fills: F('M 560 500 C 540 470 580 450 600 470 C 620 450 650 480 626 504 Z', COL.straw),
      lines: L('M 560 500 C 540 470 580 450 600 470 C 620 450 650 480 626 504 Z M 593 502 L 596 470 M 580 500 L 572 478 M 608 502 L 616 478') }) +
    obj({ cls: 'gulls', lines: L('M 120 120 q 16 -16 30 0 q 14 -16 30 0 M 540 90 q 12 -12 24 0 q 12 -12 24 0') }));

  // Pixie Dust — a wand with a sparkle tail
  const wand = svg('art-wand', '0 0 300 300',
    obj({ cls: 'wandobj', fills: F(spark(210, 90, 58), COL.goldl), lines: L('M 70 250 L 180 124') + L(spark(210, 90, 58)) }) +
    sparkles([[110, 90, 12], [250, 190, 10], [150, 40, 8]]), 'onDark');

  // Twins — two little bundles, heads together
  const twins = svg('art-twins', '0 0 760 420',
    baby({ swaddle: COL.sky, hat: COL.sage, attrs: 'transform="translate(360,70) scale(0.62)"', cls: 'twinA' }) +
    baby({ swaddle: COL.blush, hat: COL.butter, attrs: 'transform="translate(400,70) scale(-0.62,0.62)"', cls: 'twinB' }) +
    obj({ cls: 'hearts', fills: F(heart(380, 60, 30), COL.straw) + F(heart(300, 40, 16), COL.straw) + F(heart(460, 40, 16), COL.straw),
      lines: L(heart(380, 60, 30)) + L(heart(300, 40, 16)) + L(heart(460, 40, 16)) }));

  // Extra photos — a little fan of prints
  const print = (x, y, rot, doodle, col) => obj({
    attrs: `transform="translate(${x},${y}) rotate(${rot})"`,
    knock: F('M -70 -84 L 70 -84 L 70 96 L -70 96 Z', COL.paper),
    fills: F('M -56 -70 L 56 -70 L 56 50 L -56 50 Z', col),
    lines: L('M -70 -84 L 70 -84 L 70 96 L -70 96 Z') + L('M -56 -70 L 56 -70 L 56 50 L -56 50 Z') + L(doodle),
  });
  const extraPhotos = svg('art-prints', '0 0 520 300',
    print(160, 150, -12, heart(0, -8, 26), COL.blush) + print(260, 140, 0, circ(0, -12, 22) + ' ' + rays(0, -12, 30, 40, 8), COL.butter) + print(360, 150, 12, spark(0, -10, 30), COL.sky) +
    obj({ cls: 'plus', fills: F(circ(460, 70, 34), COL.straw), lines: L(circ(460, 70, 34)) + L('M 460 52 L 460 88 M 442 70 L 478 70') }));

  /* ---------- small icons (64×64) ---------- */
  const icon = (paths, fill = '') => `<svg class="icon" viewBox="0 0 64 64">${fill}${paths.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
  const ICONS = {
    camera: icon(['M 10 22 Q 10 18 14 18 L 22 18 L 26 12 L 38 12 L 42 18 L 50 18 Q 54 18 54 22 L 54 48 Q 54 52 50 52 L 14 52 Q 10 52 10 48 Z', circ(32, 35, 10), 'M 46 26 l 0.1 0']),
    hanger: icon(['M 26 16 A 6 6 0 1 1 32 22 L 32 26', 'M 32 26 L 8 44 Q 5 48 10 48 L 54 48 Q 59 48 56 44 Z']),
    backdrop: icon(['M 8 12 L 56 12', 'M 14 12 L 14 44 Q 32 50 50 44 L 50 12', 'M 10 12 L 6 56', 'M 54 12 L 58 56', spark(32, 28, 7)]),
    family: icon([circ(18, 18, 7), circ(46, 18, 7), circ(32, 32, 5), 'M 8 54 L 10 34 Q 18 28 26 34 L 28 54', 'M 36 54 L 38 34 Q 46 28 54 34 L 56 54', 'M 27 54 L 28 44 Q 32 40 36 44 L 37 54']),
    cake: icon(['M 12 54 L 12 36 Q 12 32 16 32 L 48 32 Q 52 32 52 36 L 52 54 Z', 'M 12 40 Q 17 46 22 40 Q 27 46 32 40 Q 37 46 42 40 Q 47 46 52 40', 'M 32 32 L 32 20', 'M 32 8 Q 37 14 32 18 Q 27 14 32 8 Z', 'M 6 54 L 58 54']),
    pin: icon(['M 32 58 C 22 44 14 34 14 25 A 18 18 0 0 1 50 25 C 50 34 42 44 32 58 Z', circ(32, 25, 7)]),
    heart: icon([heart(32, 34, 22)]),
    calendar: icon(['M 10 16 L 54 16 L 54 54 L 10 54 Z', 'M 10 26 L 54 26', 'M 22 10 L 22 20 M 42 10 L 42 20', heart(32, 40, 8)]),
    sparkle: icon([spark(26, 34, 18), spark(48, 16, 9)]),
    gift: icon(['M 10 26 L 54 26 L 54 36 L 10 36 Z', 'M 14 36 L 14 56 L 50 56 L 50 36', 'M 32 26 L 32 56', 'M 32 26 C 24 12 12 16 18 24 C 21 27 28 26 32 26 C 36 26 43 27 46 24 C 52 16 40 12 32 26']),
    photos: icon(['M 8 18 L 44 18 L 44 50 L 8 50 Z', 'M 18 10 L 56 10 L 56 42', 'M 12 44 L 22 32 L 30 40 L 36 34 L 42 44']),
    star: icon([spark(32, 32, 24)]),
  };

  // Moon at a given phase (0 new … 1 full), waxing from the right.
  function moon(cx, cy, r, p) {
    const k = Math.abs(1 - 2 * p) * r;
    const lit = p >= 0.999 ? circ(cx, cy, r)
      : `M ${f(cx)} ${f(cy - r)} A ${r} ${r} 0 1 1 ${f(cx)} ${f(cy + r)} A ${f(k)} ${r} 0 1 ${p < 0.5 ? 0 : 1} ${f(cx)} ${f(cy - r)} Z`;
    return `<g class="moon">` +
      `<path d="${circ(cx, cy, r)}" class="moon-dark"/>` +
      `<path d="${lit}" class="moon-lit"/>` +
      `<path d="${circ(cx, cy, r)}" class="moon-ring"/></g>`;
  }

  return { hookFeet, hookBaby, sunshine, wonderland, fairytale, cake, seaside, wand, twins, extraPhotos, ICONS, moon, spark, heart, circ };
})();
