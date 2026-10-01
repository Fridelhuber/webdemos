(function () {
  "use strict";
  document.documentElement.classList.add("js");

  // Mobile-Menü
  var burger = document.querySelector(".burger");
  var mobileNav = document.getElementById("mobile-nav");
  if (burger && mobileNav) {
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      mobileNav.classList.toggle("open", open);
    };
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Scroll-Reveal
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    // Sicherheitsnetz: nach kurzer Zeit alles sichtbar machen
    window.setTimeout(function () {
      items.forEach(function (el) { el.classList.add("in"); });
    }, 2500);
  }

  // Referenzliste auf Mobil einklappen
  var refsList = document.getElementById("refs-list");
  var refsMore = document.querySelector(".refs-more");
  if (refsList && refsMore && refsList.children.length > 8) {
    refsList.classList.add("collapsed");
    refsMore.hidden = false;
    refsMore.addEventListener("click", function () {
      var open = refsList.classList.toggle("collapsed") === false;
      refsMore.setAttribute("aria-expanded", open ? "true" : "false");
      refsMore.textContent = open ? "Weniger anzeigen" : "Alle 17 Auftraggeber anzeigen";
    });
  }

  // Jahr im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
