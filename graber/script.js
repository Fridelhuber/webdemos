(function () {
  "use strict";

  // Jahr im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile-Menü
  var burger = document.querySelector(".burger");
  var mobileNav = document.getElementById("mobile-nav");
  if (burger && mobileNav) {
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      mobileNav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000 && mobileNav.classList.contains("is-open")) setOpen(false);
    });
  }

  // Header-Zustand beim Scrollen
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Kontaktformular: Demo ohne Backend -> Anfrage an das E-Mail-Programm übergeben.
  // Bei Live-Schaltung auf Netlify greift data-netlify; dann diesen Block entfernen.
  var form = document.querySelector("form.anfrage");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      var name = form.elements["name"], kontakt = form.elements["kontakt"], msg = form.elements["nachricht"];
      var missing = [name, kontakt, msg].filter(function (f) { return !f.value.trim(); });
      if (missing.length) {
        e.preventDefault();
        missing[0].focus();
        if (status) status.textContent = "Bitte füllen Sie alle Felder aus.";
        return;
      }
      if (location.hostname.indexOf("netlify") !== -1) return; // echtes Backend vorhanden
      e.preventDefault();
      var body = "Name: " + name.value.trim() + "\nKontakt: " + kontakt.value.trim() + "\n\n" + msg.value.trim();
      location.href = "mailto:mail@heikograber.de?subject=" + encodeURIComponent("Anfrage über die Website") + "&body=" + encodeURIComponent(body);
      if (status) status.textContent = "Demo-Entwurf: Die Anfrage wird an Ihr E-Mail-Programm übergeben. Nach der Live-Schaltung landet sie direkt im Postfach der Schreinerei.";
    });
  }

  // Scroll-Reveal
  var reveals = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reveals.length) return;
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });
  reveals.forEach(function (el) { io.observe(el); });
})();
