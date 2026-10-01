(function () {
  "use strict";

  // Jahr im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile-Menü
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
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
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduced) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
