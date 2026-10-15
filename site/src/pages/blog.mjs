// /blog/ and one page per post (/blog/<slug>/). Every post carries booking calls to action, the
// matching session cards and links to every city, town and county page, so the guides feed the
// local pages they're about. On WordPress the post list on /blog/ is a live Query Loop, so posts
// that WordPress publishes on schedule appear there on their own.
import { html, ui, icon, esc } from '../lib/html.mjs';
import { img, IMG_MANIFEST } from '../lib/media.mjs';
import { PHOTOS } from '../data/images.mjs';
import {
  secHead, packages, faq, finalCta, ctaButtons, bookHref, crumbs, areas, countyLinks, ctaBand, cardPhotos, pageHero,
  NEWBORN_POOL, BABY_POOL, LOOKALIKE,
} from '../lib/components.mjs';
import { POSTS, CATEGORY, postHref, postDate, isLive, livePosts, BUILD_NOW } from '../data/posts.mjs';
import { BUSINESS as B, SITE_URL } from '../data/business.mjs';
import { faqNode, BUSINESS_ID } from '../lib/schema.mjs';

const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const anchor = (t) => plain(t).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// WordPress Query Loop: published child pages of /blog/, newest first. __BLOG_PARENT__ is
// replaced with the /blog/ page id by deploy.mjs. The "--" in the block's className is written
// the way WordPress stores it (\u002d\u002d), so the saved page matches the build and deploys
// don't re-save an unchanged page.
export const postLoop = (variant) => {
  const inner = variant === 'list'
    ? '<!-- wp:post-title {"isLink":true,"level":3,"fontSize":"medium"} /-->'
    : '<!-- wp:post-featured-image {"isLink":true,"sizeSlug":"medium_large"} /-->\n<!-- wp:post-date /-->\n<!-- wp:post-title {"isLink":true,"level":3} /-->\n<!-- wp:read-more {"content":"Read the guide →"} /-->';
  return `<!--ADR:BLOCK-->\n<!-- wp:query {"queryId":${variant === 'list' ? 2 : 1},"query":{"perPage":100,"pages":0,"offset":0,"postType":"page","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"parents":[__BLOG_PARENT__]},"className":"post-loop post-loop\\u002d\\u002d${variant}"} -->\n<div class="wp-block-query post-loop post-loop--${variant}"><!-- wp:post-template -->\n${inner}\n<!-- /wp:post-template --></div>\n<!-- /wp:query -->\n<!--ADR:BLOCK-->`;
};

// photo keys whose image files appear in a chunk of rendered HTML
const FILE_BASE = Object.keys(PHOTOS).filter((k) => IMG_MANIFEST[k]).map((k) => [k, `/${IMG_MANIFEST[k].file.replace(/\.webp$/, '')}`]);
export const photosIn = (markup) => new Set(FILE_BASE.filter(([, b]) => markup.includes(b)).map(([k]) => k));

// if a post's own photos are all on the page already, borrow one from the same kind of session
const FALLBACK = {
  newborn: NEWBORN_POOL,
  maternity: ['momKissTeal', 'momNavyKiss', 'momOverheadRed', 'momWhite', 'handsRing', 'dadKiss', 'parentsStanding', ...NEWBORN_POOL],
  baby: [...BABY_POOL, 'swingGirl', 'moonStars', 'whiteLaceAlert', 'momNavyKiss', 'momKissTeal', 'familyFour'],
  cake: ['cake', 'cakePink', 'cakePinkSit', 'cakeSmile', 'cakeOne', 'cakeBlue', 'cakeChoc'],
  beach: ['beachLift', 'beachHug', 'beachToddler', 'familyFour', 'momFloral', 'family', 'parentsStanding'],
};

export function postCard(ctx, p, { headingTag = 'h3', avoid = new Set() } = {}) {
  const c = CATEGORY[p.category];
  // the cover, else the post's other photos, else a same-kind photo — never one the page already
  // shows. Shots from a session the page already shows come last, and only while the page doesn't
  // end up with that whole set; text-only if no photo is free.
  const own = [p.hero, ...p.sections.map((s) => s.photo).filter(Boolean)];
  const others = (k) => (LOOKALIKE.find((g) => g.includes(k)) || [k]).filter((x) => x !== k);
  const fresh = (k) => !avoid.has(k) && !others(k).some((x) => avoid.has(x));
  const ok = (k) => !avoid.has(k) && !(others(k).length && others(k).every((x) => avoid.has(x)));
  const photo = own.find(fresh) || FALLBACK[p.category].find((k) => !own.includes(k) && fresh(k)) || own.find(ok);
  if (photo) avoid.add(photo);
  return html`<article class="post-card${photo ? '' : ' post-card--text'} reveal">
${photo ? html`<a class="post-card-media" href="${postHref(p)}" tabindex="-1" aria-hidden="true">${img(ctx.media, photo, { sizes: '(min-width:1080px) 360px, (min-width:700px) 45vw, 92vw' })}</a>` : ''}
<div class="post-card-body">
<p class="post-meta"><span>${esc(c.label)}</span><span class="dot" aria-hidden="true"></span><time datetime="${p.publishAt.slice(0, 10)}">${postDate(p)}</time></p>
<${headingTag}><a href="${postHref(p)}">${esc(plain(p.h1))}</a></${headingTag}>
<p>${esc(p.description)}</p>
<a class="arrow-link" href="${postHref(p)}" aria-label="Read: ${esc(plain(p.h1))}">Read the guide ${ui.arrow}</a>
</div>
</article>`;
}

// "From the blog" strip for service and home pages (posts live at build time). It's a token that
// resolveDeferred() fills in once the rest of the page has rendered, so its cards can avoid photos
// the page already shows.
export const blogStrip = (ctx, opts = {}) => `<!--ADR:DEFER:${JSON.stringify({ kind: 'strip', ...opts })}-->`;

function renderStrip(ctx, { categories = null, n = 3, title = 'Guides for <em>RGV parents</em>', eyebrowText = 'From the blog', id = 'blog-title' }, avoid) {
  const list = livePosts().filter((p) => !categories || categories.includes(p.category)).slice(0, n);
  if (!list.length) return '';
  return html`<section class="sec sec--paper" aria-labelledby="${id}"><div class="wrap">
${secHead({ eyebrow: eyebrowText, title, id })}
<div class="post-grid">${list.map((p) => postCard(ctx, p, { avoid }))}</div>
<p class="center mt"><a class="arrow-link" href="/blog/">All guides on the blog ${ui.arrow}</a></p>
</div></section>`;
}

function renderRelated(ctx, { slug }, avoid) {
  const p = POSTS.find((q) => q.slug === slug);
  // posts that are live when this page goes out: now, or its own publish time if it's scheduled
  const at = new Date(Math.max(new Date(p.publishAt), BUILD_NOW));
  const related = [...p.related.map((s) => POSTS.find((q) => q.slug === s)).filter(Boolean), ...livePosts(at).filter((q) => q.category === p.category), ...livePosts(at)]
    .filter((q, i, all) => q.slug !== p.slug && all.indexOf(q) === i && isLive(q, at)).slice(0, 3);
  if (!related.length) return '';
  return html`<section class="sec" aria-labelledby="post-more"><div class="wrap">
${secHead({ eyebrow: 'Keep reading', title: 'More guides for <em>RGV parents</em>', id: 'post-more' })}
<div class="post-grid">${related.map((q) => postCard(ctx, q, { avoid }))}</div>
</div></section>`;
}

export function resolveDeferred(ctx, markup) {
  if (!markup.includes('<!--ADR:DEFER:')) return markup;
  const avoid = photosIn(markup);
  return markup.replace(/<!--ADR:DEFER:(\{.*?\})-->/g, (m, j) => {
    const o = JSON.parse(j);
    return o.kind === 'strip' ? renderStrip(ctx, o, avoid) : renderRelated(ctx, o, avoid);
  });
}

export const blogIndex = {
  path: '/blog/',
  wpSlug: 'blog',
  wpTitle: 'Blog',
  seo: {
    title: 'Newborn & Baby Photo Guides for RGV Parents | Adrisabel Blog',
    description: 'Practical guides for Rio Grande Valley parents: when to book newborn photos, cake smash tips, maternity timing, what to wear and how to prepare.',
    focus: 'newborn photography tips rgv',
    image: 'heartBowl',
  },
  body: (ctx) => {
    const list = livePosts();
    return html`
${pageHero(ctx, {
  crumbs: [{ label: 'Blog' }],
  eyebrow: 'The Adrisabel blog',
  title: 'Guides for <em>Rio Grande Valley</em> parents',
  lede: 'Newborn timing, first birthdays, maternity portraits and family beach days — practical advice from 15+ years and hundreds of babies photographed, for families from McAllen and Mission to Harlingen and Brownsville.',
  center: true,
})}
<section class="sec sec--tight" aria-labelledby="posts-title"><div class="wrap">
<h2 class="sr-only" id="posts-title">All guides</h2>
${ctx.wp ? postLoop('grid') : html`<div class="post-grid">${list.map((p) => postCard(ctx, p))}</div>`}
</div></section>
${ctaBand({ title: 'Ready when <em>you are</em>', text: 'Newborn days, first smiles, the big first birthday — reach out and we’ll plan the perfect session for your family.', label: 'Book your session', href: bookHref() })}
<section class="sec" aria-labelledby="blog-areas"><div class="wrap center">
${secHead({ eyebrow: 'Serving the whole Valley', title: 'Find your <em>city</em>', id: 'blog-areas' })}
${areas()}
${countyLinks()}
</div></section>
${finalCta()}
`;
  },
  schema: () => [{
    '@type': 'Blog', '@id': `${SITE_URL}/blog/#blog`, url: `${SITE_URL}/blog/`, name: `${B.name} blog`,
    description: 'Guides for Rio Grande Valley parents on newborn, baby, cake smash, maternity and family beach photography.',
    publisher: { '@id': BUSINESS_ID }, inLanguage: 'en-US',
  }],
};

function postPage(p) {
  const path = postHref(p);
  const c = CATEGORY[p.category];
  return {
    path,
    wpSlug: p.slug,
    wpTitle: plain(p.h1),
    wpParent: '/blog/',
    publishAt: p.publishAt,
    isPost: true,
    seo: { title: p.title, description: p.description, focus: p.focus, image: p.hero, type: 'article' },
    body: (ctx) => html`
<article class="post" aria-labelledby="post-title">
<header class="post-hero"><div class="wrap wrap--narrow">
${crumbs([{ label: 'Blog', href: '/blog/' }, { label: plain(p.h1) }])}
<p class="post-meta"><a href="${c.service}">${esc(c.label)}</a><span class="dot" aria-hidden="true"></span><time datetime="${p.publishAt.slice(0, 10)}">${postDate(p)}</time><span class="dot" aria-hidden="true"></span><span>${p.minutes} min read</span></p>
<h1 class="h-page" id="post-title">${p.h1}</h1>
<p class="lede">${p.dek}</p>
<p class="byline">By <a href="/about/">${B.photographer}</a> · newborn &amp; baby photographer · ${B.years} years of experience</p>
</div>
<div class="wrap"><figure class="post-cover">${img(ctx.media, p.hero, { sizes: '(min-width:1180px) 1100px, 94vw', priority: true })}</figure></div>
</header>
<div class="wrap wrap--narrow post-body">
<div class="prose">${p.intro}</div>
<nav class="toc" aria-label="In this guide"><p class="toc-title">In this guide</p><ol>${p.sections.map((s) => html`<li><a href="#${anchor(s.h2)}">${esc(plain(s.h2))}</a></li>`)}<li><a href="#post-faq">Questions parents ask</a></li></ol></nav>
${p.sections.map((s, i) => html`<section class="post-sec" aria-labelledby="${anchor(s.h2)}">
<h2 id="${anchor(s.h2)}">${s.h2}</h2>
<div class="prose">${s.html}</div>
${s.photo ? html`<figure class="post-fig">${img(ctx.media, s.photo, { sizes: '(min-width:820px) 720px, 92vw' })}</figure>` : ''}
</section>
${i === 1 ? html`<aside class="mid-cta reveal" aria-label="Book a session"><div><p class="mid-cta-kicker">${c.ask}</p><p>Adrisabel photographs families from all over the Rio Grande Valley in her private studio in the McAllen area. Send a request or call/text <a href="${B.phoneHref}">${B.phone}</a>.</p></div><div class="btn-row"><a class="btn" href="${bookHref(c.book)}">${c.cta} ${ui.arrow}</a><a class="btn btn--ghost" href="${c.service}">${esc(c.serviceLabel)}</a></div></aside>` : ''}`)}
</div>
</article>

<section class="sec sec--blush" aria-labelledby="post-pk"><div class="wrap">
${secHead({ eyebrow: 'Book your session', title: p.category === 'beach' ? 'Your day <em>by the sea</em>' : 'Choose your <em>chapter</em>', id: 'post-pk' })}
${packages(ctx, c.packages)}
<p class="center mt"><a class="arrow-link" href="/pricing/">All sessions &amp; packages ${ui.arrow}</a></p>
</div></section>

<section class="sec" aria-labelledby="post-faq"><div class="wrap">
${secHead({ eyebrow: plain(p.h1), title: 'Questions <em>parents ask</em>', id: 'post-faq' })}
${faq(p.faq)}
</div></section>

<section class="sec sec--paper" aria-labelledby="post-local"><div class="wrap center">
${secHead({ eyebrow: 'Serving the whole Valley', title: `${c.kind === 'baby' ? 'Baby' : 'Newborn'} photography <em>near you</em>`, lede: `${B.studioLine} ${B.addressNote}`, id: 'post-local' })}
${areas({ kind: c.kind })}
${countyLinks()}
</div></section>

<!--ADR:DEFER:${JSON.stringify({ kind: 'related', slug: p.slug })}-->

${finalCta()}
`,
    schema: (ctx) => [
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}${path}#article`,
        headline: plain(p.h1),
        description: p.description,
        image: [ctx.media.photo(p.hero).src.startsWith('http') ? ctx.media.photo(p.hero).src : SITE_URL + ctx.media.photo(p.hero).src],
        datePublished: p.publishAt,
        dateModified: p.publishAt,
        wordCount: p.words,
        articleSection: c.label,
        keywords: p.focus,
        inLanguage: 'en-US',
        author: { '@type': 'Person', name: B.photographer, url: `${SITE_URL}/about/`, jobTitle: 'Newborn & baby photographer' },
        publisher: { '@id': BUSINESS_ID },
        about: { '@id': BUSINESS_ID },
        isPartOf: { '@id': `${SITE_URL}/blog/#blog` },
        mainEntityOfPage: { '@id': `${SITE_URL}${path}#webpage` },
        spatialCoverage: { '@type': 'AdministrativeArea', name: 'Rio Grande Valley, Texas' },
      },
      faqNode(path, p.faq),
    ],
  };
}

export const POST_PAGES = POSTS.map(postPage);
void cardPhotos; void icon;
