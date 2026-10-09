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
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !e.target.closest(".site-header")) setOpen(false);
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

  // Scroll-Reveal
  var items = document.querySelectorAll(".reveal");
  var showAll = function () { items.forEach(function (el) { el.classList.add("is-visible"); }); };
  if (!hasIO || reduce) {
    showAll();
    return;
  }
  // Alles, was beim Laden schon im (erweiterten) Viewport liegt, sofort zeigen – kein Einblenden über dem Fold
  var vh = window.innerHeight || document.documentElement.clientHeight;
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < vh * 1.15) el.classList.add("is-visible");
  });
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
