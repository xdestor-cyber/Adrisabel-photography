// Paste into the DevTools Console (or have the Claude side panel run it) on instagram.com/adrisabelx.
// No API calls: it just scrolls the profile grid slowly, like a person would, and records every post
// tile (link, largest image in its srcset, Instagram's alt text, carousel/video icons). Downloads
// adrisabelx-grid.json. Works from any logged-in account viewing the public profile.
(async () => {
  const posts = new Map();
  const grab = () => {
    for (const a of document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]')) {
      const m = (a.getAttribute('href') || '').match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      if (!m || posts.has(m[2])) continue;
      const img = a.querySelector('img');
      const set = (img?.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)).filter((x) => x[0]);
      const best = set.sort((x, y) => parseInt(y[1], 10) - parseInt(x[1], 10))[0];
      posts.set(m[2], {
        n: posts.size + 1, code: m[2], kind: m[1],
        icons: [...a.querySelectorAll('svg[aria-label]')].map((s) => s.getAttribute('aria-label')),
        alt: img?.alt || '', w: best ? parseInt(best[1], 10) : img?.naturalWidth || 0, url: best ? best[0] : img?.src || '',
      });
    }
  };
  let last = 0, still = 0;
  while (still < 8) {
    grab();
    window.scrollBy(0, window.innerHeight * 0.9);
    await new Promise((r) => setTimeout(r, 2500 + Math.random() * 1500));
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) await new Promise((r) => setTimeout(r, 2500));
    if (posts.size === last) still++; else { still = 0; last = posts.size; console.log(`${posts.size} posts so far`); }
  }
  grab();
  const out = [...posts.values()];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
  a.download = 'adrisabelx-grid.json';
  a.click();
  console.log(`done: ${out.length} posts (${out.filter((p) => p.kind === 'reel' || p.icons.some((i) => /clip|video|reel/i.test(i))).length} videos/reels) → adrisabelx-grid.json`);
})();
