(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var hasIO = "IntersectionObserver" in window;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hasIO && !reduce) document.documentElement.classList.add("has-io");

  // Demo-Leiste: echte Höhe messen, damit Header und Inhalt sauber darunter beginnen
  var demo = document.querySelector(".demo-bar");
  if (demo) {
    var setDemoH = function () {
      var h = Math.ceil(demo.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty("--demo-h", h + "px");
    };
    setDemoH();
    window.addEventListener("resize", setDemoH);
    window.addEventListener("load", setDemoH);
    if ("ResizeObserver" in window) new ResizeObserver(setDemoH).observe(demo);
  }

  // Jahr im Footer und Betriebsjahre in der Chronik (Gründung 1968)
  var now = new Date().getFullYear();
  var year = document.getElementById("year");
  if (year) year.textContent = String(now);
  var years = now - 1968;
  if (years > 0) {
    document.querySelectorAll(".js-years").forEach(function (el) { el.textContent = String(years); });
  }

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

  // Leistungen: auf schmalen Bildschirmen als aufklappbare Mini-Kacheln,
  // ab 600px immer offen (ohne JS bleiben sie offen).
  var mq = window.matchMedia ? window.matchMedia("(max-width: 599px)") : null;
  var folds = document.querySelectorAll("details.card, details.more-services");
  if (mq && folds.length) {
    var syncFolds = function () {
      folds.forEach(function (d) { d.open = !mq.matches; });
    };
    syncFolds();
    if (mq.addEventListener) mq.addEventListener("change", syncFolds);
    else if (mq.addListener) mq.addListener(syncFolds);
    folds.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!mq.matches && !d.open) d.open = true; // Desktop: bleibt offen
      });
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
