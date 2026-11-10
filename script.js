(function () {
  "use strict";

  var doc = document.documentElement;
  var body = document.body;
  var nav = document.getElementById("navbar");
  var toggle = document.getElementById("navToggle");
  var sheet = document.getElementById("navSheet");
  var navLinks = document.getElementById("navLinks");
  var pill = navLinks ? navLinks.querySelector(".nav-pill") : null;
  var deskLinks = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll("a")) : [];
  var sheetLinks = sheet ? Array.prototype.slice.call(sheet.querySelectorAll("a")) : [];
  var sticky = document.querySelector(".wa-sticky");
  var hero = document.getElementById("top");
  var contact = document.getElementById("contact");
  var main = document.getElementById("main");
  var footer = document.querySelector(".footer");
  var toggleLabel = toggle ? toggle.querySelector(".sr-only") : null;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var desktop = window.matchMedia("(min-width: 1024px)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  var sectionIds = ["practice", "work", "about", "experience", "credentials", "contact"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  var menuOpen = false;
  var activeId = "";
  var hovering = null;

  /* ---------- Menu sheet ---------- */
  function setInert(on) {
    [main, footer, sticky].forEach(function (el) {
      if (!el) return;
      if (on) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }

  function openMenu() {
    if (menuOpen || !sheet) return;
    menuOpen = true;
    sheet.hidden = false;
    void sheet.offsetWidth;
    sheet.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    if (toggleLabel) toggleLabel.textContent = "Close menu";
    body.classList.add("is-locked");
    setInert(true);
    sync();
  }

  function closeMenu(returnFocus) {
    if (!menuOpen || !sheet) return;
    menuOpen = false;
    sheet.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (toggleLabel) toggleLabel.textContent = "Open menu";
    body.classList.remove("is-locked");
    setInert(false);
    var done = function () {
      if (!menuOpen) sheet.hidden = true;
    };
    if (reduceMotion.matches) done();
    else window.setTimeout(done, 700);
    if (returnFocus) toggle.focus();
    sync();
  }

  if (toggle && sheet) {
    toggle.addEventListener("click", function () {
      if (menuOpen) closeMenu(false);
      else openMenu();
    });

    sheetLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuOpen) closeMenu(true);
    });

    var onDesktopChange = function () {
      if (desktop.matches) closeMenu(false);
      placePill();
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktopChange);
    else if (desktop.addListener) desktop.addListener(onDesktopChange);
  }

  /* ---------- Sliding pill indicator ---------- */
  function linkFor(id) {
    for (var i = 0; i < deskLinks.length; i++) {
      if (deskLinks[i].getAttribute("href") === "#" + id) return deskLinks[i];
    }
    return null;
  }

  function placePill(instant) {
    if (!pill || !desktop.matches) return;
    var target = hovering || linkFor(activeId);
    if (!target) {
      pill.classList.remove("is-visible");
      return;
    }
    var wasHidden = !pill.classList.contains("is-visible");
    if (wasHidden || instant) pill.classList.add("no-anim");
    pill.style.setProperty("--x", target.offsetLeft + "px");
    pill.style.setProperty("--w", target.offsetWidth + "px");
    pill.classList.add("is-visible");
    if (wasHidden || instant) {
      void pill.offsetWidth;
      pill.classList.remove("no-anim");
    }
  }

  deskLinks.forEach(function (link) {
    link.addEventListener("pointerenter", function () {
      hovering = link;
      placePill();
    });
    link.addEventListener("focus", function () {
      hovering = link;
      placePill();
    });
    link.addEventListener("blur", function () {
      if (hovering === link) hovering = null;
      placePill();
    });
  });

  if (navLinks) {
    navLinks.addEventListener("pointerleave", function () {
      hovering = null;
      placePill();
    });
  }

  /* ---------- Scroll state ---------- */
  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    deskLinks.concat(sheetLinks).forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    placePill();
  }

  function sync() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var max = Math.max(1, doc.scrollHeight - vh);

    nav.classList.toggle("is-scrolled", y > 24 || menuOpen);
    nav.classList.toggle("is-menu", menuOpen);
    nav.style.setProperty("--progress", Math.min(1, y / max).toFixed(4));

    var current = "";
    var probe = vh * 0.45;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) current = sections[i].id;
    }
    if (current === "contact") current = "";
    setActive(current);

    if (sticky) {
      var pastHero = hero ? y > hero.offsetHeight * 0.7 : y > 600;
      var nearContact = contact ? contact.getBoundingClientRect().top < vh * 0.85 : false;
      var show = !desktop.matches && !menuOpen && pastHero && !nearContact;
      sticky.classList.toggle("is-hidden", !show);
    }
  }

  var ticking = false;
  function requestSync() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      sync();
    });
  }

  window.addEventListener("scroll", requestSync, { passive: true });
  window.addEventListener("resize", function () {
    requestSync();
    placePill(true);
  });
  sync();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      placePill(true);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var kids = group.querySelectorAll("[data-reveal]");
      for (var i = 0; i < kids.length; i++) kids[i].style.setProperty("--d", i * 90 + "ms");
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) return;
      el.classList.add("is-pending");
      io.observe(el);
    });
  }

  /* ---------- Count-up stats ---------- */
  var nums = Array.prototype.slice.call(document.querySelectorAll(".num[data-count]"));

  if (!reduceMotion.matches && nums.length && window.requestAnimationFrame) {
    var start = null;
    var duration = 1400;
    var targets = nums.map(function (el) {
      return parseInt(el.getAttribute("data-count"), 10) || 0;
    });
    nums.forEach(function (el) {
      el.textContent = "0";
    });

    var step = function (t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      nums.forEach(function (el, i) {
        el.textContent = String(Math.round(targets[i] * eased));
      });
      if (p < 1) window.requestAnimationFrame(step);
    };
    var statsBox = document.querySelector(".stats");
    var begin = function () {
      window.setTimeout(function () {
        window.requestAnimationFrame(step);
      }, 250);
    };
    if (statsBox && "IntersectionObserver" in window) {
      var statsIo = new IntersectionObserver(
        function (entries) {
          if (!entries[0].isIntersecting) return;
          statsIo.disconnect();
          begin();
        },
        { threshold: 0.4 }
      );
      statsIo.observe(statsBox);
    } else {
      begin();
    }
  }

  /* ---------- Pointer details ---------- */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll(".btn-primary").forEach(function (btn) {
      btn.addEventListener("pointermove", function (event) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", event.clientX - r.left + "px");
        btn.style.setProperty("--my", event.clientY - r.top + "px");
      });
    });

    document.querySelectorAll(".case").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--gx", event.clientX - r.left + "px");
        card.style.setProperty("--gy", event.clientY - r.top + "px");
      });
    });
  }
})();
