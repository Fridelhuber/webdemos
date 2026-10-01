(function () {
  'use strict';

  // Demo-Leiste: tatsächliche Höhe als CSS-Variable (Header/Menü beginnen sauber darunter)
  var bar = document.querySelector('.demo-bar');
  if (bar) {
    var setBarH = function () {
      document.documentElement.style.setProperty('--demo-h', bar.offsetHeight + 'px');
    };
    setBarH();
    window.addEventListener('resize', setBarH);
    if ('ResizeObserver' in window) new ResizeObserver(setBarH).observe(bar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setBarH);
  }

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

  // Anfrage-Formular: öffnet das E-Mail-Programm mit vorbereiteter Nachricht (kein Server, kein Fremddienst)
  var form = document.getElementById('anfrage');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return (document.getElementById(id).value || '').trim(); };
      var body = 'Name: ' + v('f-name') + '\nTelefon: ' + v('f-tel') + '\n\nAnliegen:\n' + v('f-text') + '\n\n(Fotos vom Dach oder Schaden gern als Anhang.)';
      window.location.href = 'mailto:gebruederschein.maler.dachdecker@web.de?subject=' + encodeURIComponent('Anfrage über die Website') + '&body=' + encodeURIComponent(body);
    });
  }

  // Jahr im Footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
