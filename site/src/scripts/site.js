/* Adrisabel Photography — shared site behaviour (no dependencies). */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  var header = d.querySelector('.adr-header');
  var sticky = d.querySelector('.sticky-cta');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (sticky) sticky.classList.toggle('is-visible', y > 520);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = d.querySelector('.menu-toggle');
  var menu = d.getElementById('mobile-menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Desktop "Sessions" dropdown (hover works without JS; this adds click/keyboard)
  d.querySelectorAll('.nav-drop > button').forEach(function (btn) {
    var wrap = btn.parentElement;
    btn.addEventListener('click', function () {
      var open = !wrap.classList.contains('is-open');
      wrap.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    d.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  });

  // Reveal on scroll
  var items = d.querySelectorAll('.adr .reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Only one FAQ open at a time within a group
  d.querySelectorAll('.adr .faq').forEach(function (group) {
    group.addEventListener('toggle', function (e) {
      if (e.target.open) group.querySelectorAll('details[open]').forEach(function (o) { if (o !== e.target) o.open = false; });
    }, true);
  });

  // Carry ?session= through package links is handled server-side; track outbound CTA clicks for GTM
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="tel:"], a[href^="mailto:"], a[href*="instagram.com"]');
    if (!a) return;
    window.dataLayer = window.dataLayer || [];
    var type = a.href.indexOf('tel:') === 0 ? 'phone' : a.href.indexOf('mailto:') === 0 ? 'email' : 'instagram';
    window.dataLayer.push({ event: 'contact_click', contact_type: type, link_url: a.href });
  });
})();
