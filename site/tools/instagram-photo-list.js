// Paste into the DevTools Console of a logged-in instagram.com tab.
// Lists every PHOTO in @adrisabelx's feed (carousels included, videos/reels skipped) with its
// full-size image URL, and downloads the list as adrisabelx-photos.json.
// The image URLs are signed by Instagram and expire after a few days.
(async () => {
  const USER = 'adrisabelx';
  const H = { 'x-ig-app-id': '936619743392459', 'x-requested-with': 'XMLHttpRequest' };
  const get = async (u) => { const r = await fetch(u, { headers: H, credentials: 'include' }); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.json(); };
  let base = `/api/v1/feed/user/${USER}/username/?count=33`;
  try { await get(base); } catch {
    const p = await get(`/api/v1/users/web_profile_info/?username=${USER}`);
    base = `/api/v1/feed/user/${p.data.user.id}/?count=33`;
  }
  const out = [];
  let max = '', posts = 0;
  for (let page = 1; page <= 200; page++) {
    const j = await get(base + (max ? `&max_id=${encodeURIComponent(max)}` : ''));
    for (const it of j.items || []) {
      posts++;
      const media = it.media_type === 8 ? it.carousel_media || [] : [it];
      media.forEach((m, i) => {
        if (m.media_type !== 1) return; // photos only
        const c = [...(m.image_versions2?.candidates || [])].sort((a, b) => b.width - a.width)[0];
        if (c) out.push({ code: it.code, i, taken: new Date(it.taken_at * 1000).toISOString().slice(0, 10), w: c.width, h: c.height, caption: (it.caption?.text || '').slice(0, 400), url: c.url });
      });
    }
    console.log(`page ${page}: ${posts} posts, ${out.length} photos`);
    if (!j.more_available || !j.next_max_id) break;
    max = j.next_max_id;
    await new Promise((r) => setTimeout(r, 1200));
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
  a.download = `${USER}-photos.json`;
  a.click();
  console.log(`done: ${out.length} photos from ${posts} posts → ${USER}-photos.json`);
})();
