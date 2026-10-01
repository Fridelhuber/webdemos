/* Mayfair Coffee, Bakery & More – Demo-Entwurf
   Demo-Leiste messen, Mobile-Menü, Speisekarten-Tabs, Scroll-Reveal, "heute" in den Öffnungszeiten. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* Höhe der Demo-Leiste in --demo-h spiegeln (bei 320px zweizeilig) */
  var bar = document.getElementById('demo-bar');
  function syncDemoBar() {
    if (!bar) return;
    document.documentElement.style.setProperty('--demo-h', bar.offsetHeight + 'px');
  }
  syncDemoBar();
  if ('ResizeObserver' in window && bar) {
    new ResizeObserver(syncDemoBar).observe(bar);
  } else {
    window.addEventListener('resize', syncDemoBar);
  }
  window.addEventListener('load', syncDemoBar);

  /* Mobile-Menü */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  function setMenu(open) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    mobileNav.hidden = !open;
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* Speisekarten-Tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[role="tab"]'));
  function activateTab(tab, focus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
    if (tab.scrollIntoView) {
      try { tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } catch (e) { /* ältere Browser */ }
    }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activateTab(next, true); }
    });
  });

  /* Scroll-Reveal */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-visible'); return; }
      io.observe(el);
    });
    /* Sicherheitsnetz: nach 2,5 s alles sichtbar, falls der Observer nicht feuert */
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }, 2500);
  }

  /* Heutigen Wochentag in den Öffnungszeiten markieren */
  var today = String(new Date().getDay());
  document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
    if (tr.getAttribute('data-day') === today) tr.classList.add('is-today');
  });
})();
