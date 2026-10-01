(function () {
  'use strict';

  // Mobile-Menü
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('mobile-nav');
  if (burger && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    burger.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Header-Schatten beim Scrollen
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll-Reveal: Elemente, die beim Laden schon im Viewport liegen, sofort ohne Animation zeigen
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vh = window.innerHeight || document.documentElement.clientHeight;
  var pending = [];
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < vh) {
      el.classList.add('no-anim', 'is-visible');
    } else {
      pending.push(el);
    }
  });
  if (!('IntersectionObserver' in window) || reduce) {
    pending.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    pending.forEach(function (el) { io.observe(el); });
  }

  // Jahr im Footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
