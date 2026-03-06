/* ═══════════════════════════════════════════
   Allan Mitanda Portfolio — script.js
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV: scroll shadow ── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── NAV: active section highlight ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function () {
    var current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 90) {
        current = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* ── NAV: mobile toggle ── */
  var navToggle = document.getElementById('navToggle');
  var navLinksList = document.getElementById('navLinks');
  navToggle.addEventListener('click', function () {
    navLinksList.classList.toggle('open');
  });
  navLinksList.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinksList.classList.remove('open');
    });
  });

  /* ── FADE-UP: scroll reveal ── */
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ── SKILL BARS: animate on view ── */
  var skillsSection = document.getElementById('skillsSection');
  var skillsAnimated = false;
  if (skillsSection) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          document.querySelectorAll('.skill-fill').forEach(function (bar) {
            var target = bar.getAttribute('data-w');
            if (target) bar.style.width = target + '%';
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillObserver.observe(skillsSection);
  }

  /* ── HERO PHOTO: fallback placeholder ── */
  var heroPhoto = document.getElementById('heroPhoto');
  var photoPlaceholder = document.getElementById('photoPlaceholder');
  if (heroPhoto && photoPlaceholder) {
    heroPhoto.addEventListener('error', function () {
      heroPhoto.style.display = 'none';
      photoPlaceholder.style.display = 'flex';
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
