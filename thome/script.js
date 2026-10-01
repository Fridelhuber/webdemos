(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Demo-Leiste: tatsächliche Höhe messen (bei schmalen Displays zweizeilig)
  var bar = document.querySelector('.demo-bar');
  if (bar) {
    var setBar = function () {
      var h = Math.ceil(bar.getBoundingClientRect().height);
      if (h > 0) { document.documentElement.style.setProperty('--demo-h', h + 'px'); }
    };
    setBar();
    window.addEventListener('resize', setBar);
    window.addEventListener('load', setBar);
  }

  // Referenzen: Zusatzliste auf schmalen Displays eingeklappt starten
  var mq = window.matchMedia && window.matchMedia('(max-width: 639px)');
  var mores = document.querySelectorAll('details.refs__more');
  if (mq && mores.length) {
    var syncMore = function () {
      mores.forEach(function (d) { d.open = !mq.matches; });
    };
    syncMore();
    if (mq.addEventListener) { mq.addEventListener('change', syncMore); }
  }

  // Jahr im Footer
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Mobile-Menü
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); }
    });
  }

  // Scroll-Reveal
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length) { return; }
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  // Elemente, die beim Laden bereits im Viewport sind, sofort zeigen
  var vh = window.innerHeight || document.documentElement.clientHeight;
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < vh) { el.classList.add('is-visible'); }
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { if (!el.classList.contains('is-visible')) { io.observe(el); } });
})();
