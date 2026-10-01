(function () {
  "use strict";

  // Mobile-Menü
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      mobileNav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
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
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    // Elemente, die beim Laden bereits im Sichtbereich liegen, sofort zeigen
    var vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Jahr im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
