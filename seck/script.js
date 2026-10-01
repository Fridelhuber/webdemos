(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Mobile-Menü
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (header && burger && nav) {
    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    burger.addEventListener('click', function () {
      setOpen(!header.classList.contains('nav-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 860) setOpen(false);
    });
  }

  // Header-Schatten beim Scrollen
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll-Reveal
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    var vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 1.05) {
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    });
  }

  // Terminanfrage: Formular -> E-Mail-Programm (kein Server nötig)
  var form = document.getElementById('termin-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var fields = ['Name', 'Telefon', 'Fahrzeug', 'Wunschtermin', 'Anliegen'];
      var missing = fields.filter(function (n) {
        var el = form.elements[n];
        return el && el.required && !el.value.trim();
      });
      if (missing.length) {
        if (status) status.textContent = 'Bitte ' + missing.join(', ') + ' ausfüllen.';
        var first = form.elements[missing[0]];
        if (first) first.focus();
        return;
      }
      var lines = fields.map(function (n) {
        var el = form.elements[n];
        return n + ': ' + (el ? el.value.trim() : '');
      });
      var subject = 'Terminanfrage über die Website – ' + form.elements['Name'].value.trim();
      window.location.href = 'mailto:info@autoteileseck.de?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n') + '\n');
      if (status) status.textContent = 'Ihr E-Mail-Programm öffnet sich mit der Anfrage. Falls nicht: einfach anrufen, 0681 851051.';
    });
  }

  // Jahr im Footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
