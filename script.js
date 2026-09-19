(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------
     i18n
  ---------------------------------------------------------------- */
  var SUPPORTED = ['en', 'hu', 'de'];
  var STORAGE_KEY = 'portfolio-lang';
  var currentLang = 'en';
  var taglineTyped = false;

  function dict(lang) {
    var all = window.I18N || {};
    return all[lang] || all.en || {};
  }

  function t(key) {
    var d = dict(currentLang);
    if (d[key] != null) return d[key];
    var en = dict('en');
    return en[key] != null ? en[key] : '';
  }

  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage blocked — fall through to browser language */ }

    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : 'en';
  }

  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var heroTagline = document.getElementById('heroTagline');

  function syncToggleLabel() {
    if (!navToggle) return;
    var open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-label', t(open ? 'a11y.menuClose' : 'a11y.menuOpen'));
  }

  function applyLang(lang) {
    currentLang = SUPPORTED.indexOf(lang) !== -1 ? lang : 'en';

    document.documentElement.lang = currentLang;
    document.title = t('meta.title');

    var metaDesc = document.getElementById('metaDesc');
    if (metaDesc) metaDesc.setAttribute('content', t('meta.desc'));

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    syncToggleLabel();

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === currentLang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (taglineTyped && heroTagline) heroTagline.textContent = t('hero.tagline');

    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) { /* storage blocked — language still applies for this visit */ }
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  applyLang(detectLang());

  /* ----------------------------------------------------------------
     Footer year
  ---------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------------- */
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('open', !open);
      syncToggleLabel();
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        syncToggleLabel();
      });
    });
  }

  /* ----------------------------------------------------------------
     Terminal typewriter — hero command + tagline
  ---------------------------------------------------------------- */
  var typedCmd = document.getElementById('typedCmd');
  var CMD_TEXT = 'whoami';

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

  typeInto(typedCmd, CMD_TEXT, 85, function () {
    setTimeout(function () {
      taglineTyped = true;
      typeInto(heroTagline, t('hero.tagline'), 28);
    }, 250);
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
     Nav border accent on scroll
  ---------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.style.borderBottomColor = window.scrollY > 8 ? 'rgba(6,182,212,0.15)' : '';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
