(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var hasIO = "IntersectionObserver" in window;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hasIO && !reduce) document.documentElement.classList.add("has-io");

  // Jahr im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile-Menü
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Header-Schatten beim Scrollen
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Kontaktformular: im Demo-Entwurf wird nichts versendet, der Besucher bekommt
  // eine klare Rückmeldung. Nach Freischaltung (echte Formspree-ID) sendet das Formular normal.
  var form = document.querySelector(".contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      if (form.action.indexOf("/f/DEMO") === -1) return;
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.textContent = "Gesendet"; }
      if (status) status.textContent = "Vielen Dank! Im Demo-Entwurf wird noch nichts verschickt – nach Freischaltung landet Ihre Anfrage direkt bei info@allenfort.de.";
    });
  }

  // Scroll-Reveal
  var items = document.querySelectorAll(".reveal");
  var showAll = function () { items.forEach(function (el) { el.classList.add("is-visible"); }); };
  if (!hasIO || reduce) {
    showAll();
    return;
  }
  // Sicherheitsnetz: falls der Observer nicht feuert (Druck, Reader-Mode, alte Engines)
  setTimeout(showAll, 1500);
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  items.forEach(function (el) { io.observe(el); });
})();
