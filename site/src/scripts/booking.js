/* Booking request widget — 3 quick steps, sent to Formspree.
   Keeps the original endpoint and the GTM "form_submit_success" event used
   for Google Ads conversion tracking. */
(function () {
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqewajoa';
  var root = document.querySelector('[data-booking]');
  if (!root) return;

  var $ = function (sel) { return root.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
  var state = { offer: null, offerLabel: null, newborn: false, date: null, time: null };

  function show(panel, step) {
    $$('.bk-panel').forEach(function (p) { p.classList.remove('is-on'); });
    var el = $('[data-panel="' + panel + '"]');
    el.classList.add('is-on');
    if (step) progress(step);
    var top = root.getBoundingClientRect().top + window.pageYOffset - 90;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
    var focusable = el.querySelector('.bk-title');
    if (focusable) { focusable.setAttribute('tabindex', '-1'); focusable.focus({ preventScroll: true }); }
  }
  function progress(step) {
    $$('.bk-node').forEach(function (n) {
      var s = +n.getAttribute('data-n');
      n.classList.toggle('is-active', s === step);
      n.classList.toggle('is-done', s < step);
      n.textContent = s < step ? '✓' : s;
      if (s === step) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current');
    });
    $$('.bk-line').forEach(function (l) { l.classList.toggle('is-done', +l.getAttribute('data-l') < step); });
  }

  // Step 1 — session
  var next1 = $('#bk-next1');
  function pick(btn) {
    $$('.bk-offer').forEach(function (b) { b.setAttribute('aria-checked', 'false'); b.tabIndex = -1; });
    btn.setAttribute('aria-checked', 'true'); btn.tabIndex = 0;
    state.offer = btn.getAttribute('data-offer');
    state.offerLabel = btn.getAttribute('data-label');
    state.newborn = btn.getAttribute('data-newborn') === '1';
    next1.disabled = false;
  }
  $$('.bk-offer').forEach(function (btn, i, all) {
    btn.addEventListener('click', function () { pick(btn); });
    btn.addEventListener('keydown', function (e) {
      var k = e.key, j = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % all.length;
      if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + all.length) % all.length;
      if (j !== null) { e.preventDefault(); all[j].focus(); pick(all[j]); }
    });
  });
  var pre = (new URLSearchParams(window.location.search)).get('session');
  if (pre) { var hit = $('.bk-offer[data-id="' + pre + '"]'); if (hit) pick(hit); }
  next1.addEventListener('click', function () {
    $('#bk-due').hidden = !state.newborn;
    show('2', 2);
  });

  // Step 2 — preferred date & time (Mon–Sat, from 48 h ahead, 8 weeks out)
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var strip = $('#bk-days');
  var start = new Date(Date.now() + 48 * 3600 * 1000); start.setHours(0, 0, 0, 0);
  for (var i = 0, made = 0; made < 48 && i < 70; i++) {
    var dt = new Date(start); dt.setDate(start.getDate() + i);
    if (dt.getDay() === 0) continue; // studio closed Sundays
    made++;
    (function (d) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'bk-day'; b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
      b.innerHTML = '<span class="dw">' + DOW[d.getDay()] + '</span><span class="dn">' + d.getDate() + '</span><span class="dm">' + MON[d.getMonth()] + '</span>';
      b.addEventListener('click', function () {
        $$('.bk-day').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); state.date = d; check2();
      });
      strip.appendChild(b);
    })(dt);
  }
  $$('.bk-time').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.bk-time').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      t.setAttribute('aria-pressed', 'true'); state.time = t.getAttribute('data-time'); check2();
    });
  });
  var next2 = $('#bk-next2');
  function check2() { next2.disabled = !(state.date && state.time); }
  next2.addEventListener('click', function () {
    show('loading');
    var fill = $('#bk-fill'); fill.style.width = '0%';
    window.requestAnimationFrame(function () { setTimeout(function () { fill.style.width = '100%'; }, 60); });
    setTimeout(function () { show('3', 3); }, 2200);
  });
  $$('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { var s = b.getAttribute('data-back'); show(s, +s); });
  });

  // Step 3 — contact details
  var iName = $('#bk-name'), iPhone = $('#bk-phone'), iEmail = $('#bk-email'), submit = $('#bk-submit');
  function setField(input, cls, msg) {
    var f = input.closest('.bk-field');
    f.classList.remove('is-err', 'is-ok');
    if (cls) f.classList.add(cls);
    f.querySelector('.bk-msg').textContent = msg || '';
    input.setAttribute('aria-invalid', cls === 'is-err' ? 'true' : 'false');
  }
  var emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  var badDomains = ['test.com', 'example.com', 'fake.com', 'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com', 'trashmail.com'];
  function phoneDigits() { return iPhone.value.replace(/\D/g, ''); }
  function phoneOk() {
    var d = phoneDigits();
    return d.length === 10 && !/^[01]/.test(d) && !/^(\d)\1{9}$/.test(d) && d !== '1234567890' && d !== '0123456789';
  }
  function emailOk() {
    var v = iEmail.value.trim();
    return emailRe.test(v) && badDomains.indexOf(v.split('@')[1].toLowerCase()) === -1;
  }
  function check3() { submit.disabled = !(iName.value.trim().length >= 2 && phoneOk() && emailOk()); }
  iName.addEventListener('input', function () {
    var v = iName.value.trim();
    if (!v) setField(iName, null, ''); else if (v.length < 2) setField(iName, 'is-err', 'Please enter your name'); else setField(iName, 'is-ok', '');
    check3();
  });
  iPhone.addEventListener('input', function (e) {
    var v = phoneDigits().slice(0, 10), out = v;
    if (v.length > 6) out = '(' + v.slice(0, 3) + ') ' + v.slice(3, 6) + '-' + v.slice(6);
    else if (v.length > 3) out = '(' + v.slice(0, 3) + ') ' + v.slice(3);
    else if (v.length > 0) out = '(' + v;
    e.target.value = out;
    if (phoneOk()) setField(iPhone, 'is-ok', '✓ Looks good'); else setField(iPhone, null, '');
    check3();
  });
  iPhone.addEventListener('blur', function () {
    var d = phoneDigits();
    if (!d) setField(iPhone, null, '');
    else if (d.length < 10) setField(iPhone, 'is-err', 'Please enter a complete phone number');
    else if (!phoneOk()) setField(iPhone, 'is-err', 'Please double-check your phone number');
    check3();
  });
  iEmail.addEventListener('input', function () { if (emailOk()) setField(iEmail, 'is-ok', '✓ Perfect'); else setField(iEmail, null, ''); check3(); });
  iEmail.addEventListener('blur', function () {
    var v = iEmail.value.trim();
    if (!v) setField(iEmail, null, '');
    else if (!emailRe.test(v)) setField(iEmail, 'is-err', 'Please enter a valid email');
    else if (!emailOk()) setField(iEmail, 'is-err', 'Please use your real email');
    check3();
  });

  submit.addEventListener('click', function () {
    if (submit.disabled) return;
    var label = submit.textContent;
    submit.disabled = true; submit.textContent = 'Sending…';
    var dateStr = state.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    var name = iName.value.trim(), email = iEmail.value.trim(), phone = iPhone.value.trim();
    var due = $('#bk-due-input') ? $('#bk-due-input').value : '';
    var notes = $('#bk-notes') ? $('#bk-notes').value.trim() : '';
    var payload = {
      name: name, email: email, phone: phone,
      session_type: state.offerLabel || state.offer,
      requested_date: dateStr, requested_time: state.time,
      due_date: state.newborn && due ? due : '',
      notes: notes,
      page_url: window.location.href,
      _gotcha: $('#bk-hp') ? $('#bk-hp').value : '',
      _subject: 'New Booking Request - ' + (state.offerLabel || state.offer) + ' - ' + name
    };
    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (d) { throw new Error(d.error || 'Submission failed'); });
      // Google Ads conversion tracking via GTM (unchanged event contract)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submit_success',
        form_name: 'booking_request',
        session_type: state.offerLabel || state.offer,
        user_data: {
          email: email.toLowerCase(),
          phone: '+1' + phoneDigits(),
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ')
        }
      });
      var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
      $('#bk-summary').innerHTML =
        '<b>Session:</b> ' + esc(state.offerLabel) + '<br><b>Preferred date:</b> ' + esc(dateStr) + '<br><b>Time:</b> ' + esc(state.time) +
        (payload.due_date ? '<br><b>Due / birth date:</b> ' + esc(payload.due_date) : '') +
        '<br><b>Name:</b> ' + esc(name) + '<br><b>Contact:</b> ' + esc(phone) + ' · ' + esc(email);
      show('done');
      $$('.bk-node').forEach(function (n) { n.classList.remove('is-active'); n.classList.add('is-done'); n.textContent = '✓'; });
      $$('.bk-line').forEach(function (l) { l.classList.add('is-done'); });
    }).catch(function (err) {
      if (window.console) console.error('Booking form error:', err);
      submit.disabled = false; submit.textContent = label;
      var box = $('#bk-error'); if (box) box.hidden = false;
    });
  });
})();
