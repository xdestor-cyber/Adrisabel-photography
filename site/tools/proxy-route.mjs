// For remote URLs in sandboxed environments whose Chromium can't use the
// system proxy/CA: fetch every request through Node instead.
export async function routeViaNode(ctx, { block = /googletagmanager|google-analytics|doubleclick/ } = {}) {
  await ctx.route('**/*', async (route) => {
    const req = route.request();
    if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(req.url())) return route.continue();
    if (block && block.test(req.url())) return route.abort();
    try {
      const r = await fetch(req.url(), { method: req.method(), headers: req.headers(), body: req.postDataBuffer() || undefined, redirect: 'manual' });
      const body = Buffer.from(await r.arrayBuffer());
      const headers = {};
      for (const [k, v] of r.headers.entries()) if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(k)) headers[k] = v;
      await route.fulfill({ status: r.status, headers, body });
    } catch { await route.abort(); }
  });
}
