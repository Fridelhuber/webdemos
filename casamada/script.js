(function () {
  'use strict';

  var root = document.documentElement;
  var demo = document.querySelector('.demo-bar');
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  /* Demo-Leiste: Höhe exakt messen (bei 320px zweizeilig) */
  function measureDemo() {
    if (!demo) return;
    root.style.setProperty('--demo-h', demo.offsetHeight + 'px');
    if (header) root.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  measureDemo();
  window.addEventListener('resize', measureDemo);
  window.addEventListener('load', measureDemo);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureDemo);

  /* Burger-Menü */
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    document.body.style.overflow = '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      document.body.style.overflow = open && window.innerWidth < 1000 ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) closeNav(); });
  }

  /* Header-Schatten beim Scrollen */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Scroll-Reveal */
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    /* Sicherheitsnetz: nach 3 s alles einblenden */
    setTimeout(function () { items.forEach(function (el) { el.classList.add('is-visible'); }); }, 3000);
  }

  /* Catering-Anfrage: Prüfung der Pflichtfelder, dann Übergabe ans E-Mail-Programm */
  var form = document.getElementById('catering-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var labels = { Datum: 'Datum', Personen: 'Personenzahl', Name: 'Name', Telefon: 'Telefonnummer' };
    var dateField = form.elements['Datum'];
    if (dateField) {
      var d = new Date(); d.setDate(d.getDate() + 1);
      dateField.min = d.toISOString().slice(0, 10);
    }
    function setStatus(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle('ok', !!ok);
    }
    function validate() {
      var missing = [];
      Object.keys(labels).forEach(function (n) {
        var el = form.elements[n];
        if (!el) return;
        var bad = !el.value.trim();
        if (n === 'Personen' && !bad) {
          var v = parseInt(el.value, 10);
          bad = isNaN(v) || v < 3 || v > 30;
        }
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) missing.push(el);
      });
      return missing;
    }
    function fallbackMail() {
      var lines = ['Datum', 'Personen', 'Anlass', 'Name', 'Telefon', 'E-Mail', 'Wünsche'].map(function (n) {
        var el = form.elements[n];
        return n + ': ' + (el ? el.value.trim() : '');
      });
      var subject = 'Catering-Anfrage über die Website – ' + form.elements['Name'].value.trim();
      window.location.href = 'mailto:info@casa-mada.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n') + '\n');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = validate();
      if (missing.length) {
        var names = missing.map(function (el) {
          return el.name === 'Personen' && el.value.trim() ? 'Personenzahl zwischen 3 und 30' : labels[el.name];
        });
        setStatus('Bitte noch ergänzen: ' + names.join(', ') + '.', false);
        missing[0].focus();
        return;
      }
      if (form.getAttribute('data-demo') === 'true') {
        /* Demo-Entwurf: kein Versand. In der fertigen Website geht die Anfrage an die Ladenadresse. */
        form.reset();
        setStatus('Vielen Dank! In dieser Demo wird noch nichts versendet – in der fertigen Website geht Ihre Anfrage direkt an Casa Mada. Bis dahin erreichen Sie uns unter 0681 6855621.', true);
        return;
      }
      fallbackMail();
    });
  }
})();
