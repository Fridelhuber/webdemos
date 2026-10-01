/* Restaurant Anna – Demo-Entwurf: Mobile-Menü, Scroll-Reveal, Speisekarte, Jahr */
(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    /* Sicherheitsnetz: nach 2,5 s alles sichtbar, falls der Observer nicht feuert */
    setTimeout(function () { items.forEach(function (el) { el.classList.add('is-visible'); }); }, 2500);
  }

  /* Speisekarte: Kategorie-Links öffnen das passende <details> */
  function openTarget(hash) {
    if (!hash || hash.indexOf('#menu-') !== 0) return;
    var d = document.querySelector(hash);
    if (d && d.tagName === 'DETAILS') d.open = true;
  }
  document.querySelectorAll('.menu-tabs a').forEach(function (a) {
    a.addEventListener('click', function () { openTarget(a.getAttribute('href')); });
  });
  window.addEventListener('hashchange', function () { openTarget(location.hash); });
  openTarget(location.hash);

  /* Pizza-Kategorie nur auf großen Bildschirmen vorgeöffnet; auf Mobil bleibt die Karte kompakt */
  var wide = window.matchMedia('(min-width: 900px)').matches;
  var pizza = document.getElementById('menu-pizza');
  if (wide && pizza && !location.hash) pizza.open = true;

  /* Mobil: lange Kategorien zunächst auf 12 Gerichte kürzen, Rest per Button */
  if (!wide) {
    document.querySelectorAll('.menu-list').forEach(function (list) {
      var dishes = list.querySelectorAll('.dish');
      if (dishes.length <= 14) return;
      list.classList.add('is-trimmed');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'menu-more';
      btn.textContent = 'Alle ' + dishes.length + ' Gerichte anzeigen';
      btn.addEventListener('click', function () {
        list.classList.remove('is-trimmed');
        btn.remove();
      });
      list.insertAdjacentElement('afterend', btn);
    });
  }

  /* Sticky Bestell-Leiste (Mobil): einblenden, sobald der Hero aus dem Bild ist */
  var bar = document.getElementById('order-bar');
  var hero = document.querySelector('.hero');
  if (bar && hero) {
    var link = bar.querySelector('a');
    function setBar(show) {
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (link) link.setAttribute('tabindex', show ? '0' : '-1');
      document.body.classList.toggle('has-order-bar', show);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setBar(!entries[0].isIntersecting && entries[0].boundingClientRect.bottom < 0);
      }, { threshold: 0 }).observe(hero);
    } else {
      window.addEventListener('scroll', function () {
        setBar(hero.getBoundingClientRect().bottom < 0);
      }, { passive: true });
    }
  }

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
