(function () {
  'use strict';

  // Jahr im Footer
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Mobile-Menü
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mobile-nav');
  function closeNav() {
    if (!toggle || !nav) { return; }
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeNav(); } });
  }

  // Speisekarte: auf dem Handy nur die erste Kategorie geöffnet lassen (Seitenlänge)
  if (window.matchMedia && window.matchMedia('(max-width: 899px)').matches) {
    document.querySelectorAll('.menu-cat[open]').forEach(function (d, i) {
      if (i > 0) { d.removeAttribute('open'); }
    });
  }

  // Sprungleiste: Ziel-Kategorie aufklappen, bevor der Browser hinscrollt
  document.querySelectorAll('.menu-chips a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (target && target.tagName === 'DETAILS') { target.open = true; }
    });
  });

  // Öffnungsstatus aus den Öffnungszeiten (Mo, Mi–So 11:30–14:30 und 18:00–23:00, Di Ruhetag)
  var HOURS = { 0: [[690, 870], [1080, 1380]], 1: [[690, 870], [1080, 1380]], 2: [], 3: [[690, 870], [1080, 1380]],
                4: [[690, 870], [1080, 1380]], 5: [[690, 870], [1080, 1380]], 6: [[690, 870], [1080, 1380]] };
  function fmt(m) { var h = Math.floor(m / 60), r = m % 60; return h + ':' + (r < 10 ? '0' + r : r); }
  function openStatus(now) {
    var day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), slots = HOURS[day];
    if (!slots.length) {
      return { cls: 'is-closed', text: 'Heute Ruhetag – morgen ab ' + fmt(HOURS[(day + 1) % 7][0][0]) };
    }
    for (var i = 0; i < slots.length; i++) {
      if (mins >= slots[i][0] && mins < slots[i][1]) { return { cls: 'is-open', text: 'Jetzt geöffnet · bis ' + fmt(slots[i][1]) }; }
      if (mins < slots[i][0]) {
        return { cls: 'is-soon', text: (i === 0 ? 'Öffnet heute um ' : 'Mittagspause – öffnet um ') + fmt(slots[i][0]) };
      }
    }
    var next = HOURS[(day + 1) % 7];
    return { cls: 'is-closed', text: next.length ? 'Geschlossen – morgen ab ' + fmt(next[0][0]) : 'Geschlossen – morgen Ruhetag' };
  }
  var badges = document.querySelectorAll('[data-open-status]');
  function renderStatus() {
    var s = openStatus(new Date());
    badges.forEach(function (b) {
      b.textContent = s.text;
      b.className = 'open-badge ' + s.cls;
      b.removeAttribute('hidden');
    });
  }
  if (badges.length) { renderStatus(); window.setInterval(renderStatus, 60000); }

  // Header-Schatten beim Scrollen
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Sanftes Einblenden (respektiert prefers-reduced-motion)
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
  // Fallback: falls der Observer nicht auslöst (alte Browser, Vorschau-Tools), alles nach kurzer Zeit zeigen
  window.setTimeout(function () {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }, 1500);
})();
