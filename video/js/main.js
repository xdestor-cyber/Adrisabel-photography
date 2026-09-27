/* Boot: build scenes, wait for fonts/images, build the timeline and expose
 * window.renderAt(t) for the frame exporter. Open index.html?preview to
 * watch it in a browser with the soundtrack and a scrubber.
 */
(async function boot() {
  const stage = document.getElementById('stage');
  SCENES.build(stage);

  await Promise.all([
    '400 40px "Great Vibes"', '500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"', '700 40px "Cormorant Garamond"',
    'italic 500 40px "Cormorant Garamond"', 'italic 600 40px "Cormorant Garamond"', '400 40px Jost', '500 40px Jost', '600 40px Jost',
  ].map((f) => document.fonts.load(f)));
  await Promise.all(Array.from(document.images).map((img) => (img.decode ? img.decode().catch(() => {}) : null)));
  await document.fonts.ready;

  // Fit display names to the safe width.
  function fit(el, maxW, maxPx) {
    let px = maxPx;
    el.style.fontSize = px + 'px';
    const prev = el.style.cssText;
    el.style.width = 'auto'; el.style.display = 'inline-block'; el.style.left = 'auto'; el.style.right = 'auto';
    while (el.getBoundingClientRect().width > maxW && px > 40) { px -= 2; el.style.fontSize = px + 'px'; }
    el.style.cssText = prev; el.style.fontSize = px + 'px';
  }
  document.querySelectorAll('.chapter .name').forEach((el) => fit(el, 880, 136));
  fit(document.querySelector('.pixie .pname'), 900, 150);
  fit(document.querySelector('.pixie .hdr .n'), 820, 96);
  document.querySelectorAll('.cover .brand').forEach((el) => fit(el, 1000, el.classList.contains('brand') && el.closest('.closing') ? 200 : 236));

  gsap.registerPlugin(DrawSVGPlugin);
  FX.init(document.getElementById('fx'));
  const tl = buildTimeline();

  window.renderAt = (t) => {
    tl.seek(t, false);
    FX.draw(t);
    if (PIXIE_STARS.fn && t > S.pixie - 1 && t < S.cake + 1) PIXIE_STARS.fn(t);
  };
  window.CUES = CUES;
  window.DURATION = DURATION;
  window.TIMING = { BPM, BAR, BEAT, SCENE_BARS, S, DURATION };
  window.renderAt(0);
  window.__ready = true;

  /* ---------- preview player ---------- */
  const params = new URLSearchParams(location.search);
  if (!params.has('preview')) return;
  document.body.classList.add('preview');
  const scale = () => { const s = Math.min(window.innerHeight / 1920, window.innerWidth / 1080); stage.style.transform = `scale(${s})`; };
  scale(); window.addEventListener('resize', scale);
  const ui = document.getElementById('controls');
  ui.innerHTML = `<button id="pp">▶︎ Play</button> <input id="scrub" type="range" min="0" max="${DURATION}" step="0.01" value="0"> <span id="tc">0.00</span>s`;
  const audio = new Audio(params.get('audio') || '../output/audio/adrisabel_soundtrack.m4a');
  let playing = false, t0 = 0, start = 0;
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), pp = document.getElementById('pp');
  const now = () => (audio.readyState >= 2 && !audio.paused ? audio.currentTime : start + (performance.now() - t0) / 1000);
  function loop() {
    if (!playing) return;
    const t = Math.min(now(), DURATION);
    window.renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2);
    if (t >= DURATION) { playing = false; pp.textContent = '▶︎ Play'; return; }
    requestAnimationFrame(loop);
  }
  pp.onclick = () => {
    playing = !playing; pp.textContent = playing ? '❚❚ Pause' : '▶︎ Play';
    if (playing) { start = +scrub.value; t0 = performance.now(); audio.currentTime = start; audio.play().catch(() => {}); loop(); } else audio.pause();
  };
  scrub.oninput = () => { const t = +scrub.value; window.renderAt(t); tc.textContent = t.toFixed(2); if (playing) { start = t; t0 = performance.now(); audio.currentTime = t; } };
})();
