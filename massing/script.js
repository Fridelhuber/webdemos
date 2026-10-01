(function () {
  "use strict";

  // Kennzeichnet: JS läuft -> erst dann werden .reveal-Elemente per CSS ausgeblendet
  document.documentElement.classList.add("js");

  // Mobile-Menü
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("mobile-nav");
  if (burger && menu) {
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      menu.classList.toggle("is-open", open);
    };
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Scroll-Reveal
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var show = function (el) { el.classList.add("is-visible"); };

  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(show);
  } else {
    // Alles, was beim Laden (oder nach dem Font-Swap) bereits im Viewport steht, sofort zeigen –
    // nicht auf den Observer warten, damit keine leeren Flächen entstehen.
    var revealInView = function () {
      var h = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var r = el.getBoundingClientRect();
        if (r.top < h && r.bottom > 0) show(el);
      });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });

    window.requestAnimationFrame(revealInView);
    window.addEventListener("load", revealInView);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(revealInView);
  }

  // Jahr im Footer
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
