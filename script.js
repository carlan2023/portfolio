(function () {
  "use strict";

  var navbar = document.getElementById("navbar");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navLinks");
  var links = menu.querySelectorAll("a");

  var sticky = document.querySelector(".wa-sticky");
  var contact = document.getElementById("contact");
  var hero = document.getElementById("top");
  var menuLabel = toggle.querySelector(".sr-only");

  function syncSticky() {
    if (!sticky) return;
    var menuOpen = toggle.getAttribute("aria-expanded") === "true";
    var pastHero = hero ? window.scrollY > hero.offsetHeight * 0.72 : window.scrollY > 640;
    var contactNear = false;
    if (contact) {
      contactNear = contact.getBoundingClientRect().top < window.innerHeight * 0.7;
    }
    var show = window.innerWidth <= 1040 && !menuOpen && pastHero && !contactNear;
    sticky.classList.toggle("is-hidden", !show);
  }

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    if (menuLabel) menuLabel.textContent = open ? "Close menu" : "Menu";
    syncSticky();
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (!navbar.contains(event.target)) setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1040) setOpen(false);
  });

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
    syncSticky();
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncSticky);

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var sectionLinks = Array.prototype.slice.call(links).filter(function (link) {
    return link.getAttribute("href").charAt(0) === "#";
  });

  if ("IntersectionObserver" in window) {
    var current = "";
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) current = entry.target.id;
        });
        sectionLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + current;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
