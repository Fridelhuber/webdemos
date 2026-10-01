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
