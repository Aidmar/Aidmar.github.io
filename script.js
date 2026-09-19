(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------
     Footer year
  ---------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('open', !open);
      navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ----------------------------------------------------------------
     Terminal typewriter — hero command + tagline
  ---------------------------------------------------------------- */
  var typedCmd = document.getElementById('typedCmd');
  var heroTagline = document.getElementById('heroTagline');

  var CMD_TEXT = 'whoami';
  var TAGLINE_TEXT = 'Full-Stack Developer · Vibe Coder · Builder of Real Things';

  function typeInto(el, text, speed, done) {
    if (!el) { if (done) done(); return; }
    if (reduceMotion) {
      el.textContent = text;
      if (done) done();
      return;
    }
    var i = 0;
    el.textContent = '';
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (done) {
        done();
      }
    })();
  }

  window.addEventListener('DOMContentLoaded', function () {
    typeInto(typedCmd, CMD_TEXT, 85, function () {
      setTimeout(function () {
        typeInto(heroTagline, TAGLINE_TEXT, 28);
      }, 250);
    });
  });

  /* ----------------------------------------------------------------
     Scroll reveal
  ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ----------------------------------------------------------------
     Ambient glow cursor (desktop only, disabled on reduced motion)
  ---------------------------------------------------------------- */
  var glow = document.getElementById('glowCursor');
  if (glow && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    var raf = null;
    document.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        raf = null;
      });
    });
  }

  /* ----------------------------------------------------------------
     Nav shadow / bg intensify on scroll
  ---------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.style.borderBottomColor = window.scrollY > 8 ? 'rgba(6,182,212,0.15)' : '';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
