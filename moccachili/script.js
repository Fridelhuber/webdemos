/* moccachili – Demo-Entwurf: Demo-Leiste messen, Burger, Header-Schatten, Tabs, Scroll-Reveal */
(function () {
  'use strict';

  var root = document.documentElement;

  /* Demo-Leiste: tatsächliche Höhe in --demo-h schreiben (bei 320 px zweizeilig) */
  var demo = document.querySelector('.demo-bar');
  function measureDemo() {
    if (!demo) return;
    root.style.setProperty('--demo-h', demo.offsetHeight + 'px');
  }
  measureDemo();
  window.addEventListener('resize', measureDemo);
  window.addEventListener('load', measureDemo);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(measureDemo); }

  /* Header-Schatten beim Scrollen */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });


  /* Öffnungsstatus im Hero (Mo–Sa 10–18, So 13–18, Zeitzone Europe/Berlin) */
  var statusEl = document.getElementById('hero-status');
  if (statusEl) {
    var HOURS = [[13, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18]]; /* So..Sa */
    var DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    try {
      var parts = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = DAYS.indexOf(String(map.weekday || '').replace('.', '').slice(0, 2));
      var now = parseInt(map.hour, 10) + parseInt(map.minute, 10) / 60;
      if (day >= 0 && !isNaN(now)) {
        var h = HOURS[day], text, closed = false;
        if (now >= h[0] && now < h[1]) {
          text = 'Jetzt geöffnet · bis ' + h[1] + ' Uhr';
        } else if (now < h[0]) {
          text = 'Öffnet heute um ' + h[0] + ' Uhr';
          closed = true;
        } else {
          var next = (day + 1) % 7;
          text = 'Öffnet ' + DAYS[next] + ' ' + HOURS[next][0] + ' Uhr';
          closed = true;
        }
        statusEl.textContent = text;
        statusEl.classList.toggle('is-closed', closed);
        statusEl.hidden = false;
      }
    } catch (err) { /* Status bleibt ausgeblendet */ }
  }

  /* Burger-Menü */
  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobile-nav');
  function setMenu(open) {
    if (!burger || !mobileNav) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    mobileNav.classList.toggle('is-open', open);
  }
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 860) setMenu(false);
    });
  }

  /* Tabs (Karte) */
  var tablists = document.querySelectorAll('[role="tablist"]');
  Array.prototype.forEach.call(tablists, function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    /* Scroll-Hinweis: rechte Kante ausblenden, solange rechts noch Tabs verborgen sind */
    function checkOverflow() {
      var more = list.scrollWidth - list.clientWidth - list.scrollLeft > 8;
      list.classList.toggle('has-overflow', more);
    }
    checkOverflow();
    list.addEventListener('scroll', checkOverflow, { passive: true });
    window.addEventListener('resize', checkOverflow);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(checkOverflow); }
    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.setAttribute('tabindex', selected ? '0' : '-1');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus({ preventScroll: true });
      /* Nur die Tableiste scrollen (nicht die Seite): aktiven Tab mittig zeigen */
      var left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
      try { list.scrollTo({ left: left, behavior: 'smooth' }); } catch (err) { list.scrollLeft = left; }
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var idx = i;
        if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = tabs.length - 1;
        else return;
        e.preventDefault();
        activate(tabs[idx], true);
      });
    });
  });

  /* Scroll-Reveal */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    /* Fallback: Elemente, die bereits im Sichtbereich liegen, nach kurzer Zeit sicher einblenden */
    setTimeout(function () {
      var vh = window.innerHeight || root.clientHeight;
      Array.prototype.forEach.call(reveals, function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) el.classList.add('is-visible');
      });
    }, 1200);
  }
})();
