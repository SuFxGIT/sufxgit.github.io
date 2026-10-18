/* EXPN marketing page: scroll reveals, sticky phone screenshot switcher, counters, parallax.
   Everything is readable without JS; this only adds motion. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('js');

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  /* Scrollytelling: which feature step is centred drives the sticky phone */
  var steps = document.querySelectorAll('.feature-step');
  var shots = document.querySelectorAll('.story-shot');
  var label = document.querySelector('.story-label');
  function activate(i) {
    steps.forEach(function (s) { s.classList.toggle('is-active', s.dataset.step === String(i)); });
    shots.forEach(function (s) { s.classList.toggle('is-active', s.dataset.step === String(i)); });
    if (label) {
      var pill = steps[i] && steps[i].querySelector('.pill');
      if (pill) label.textContent = pill.textContent.replace(/^\d+\s*·\s*/, '');
    }
  }
  if (steps.length) {
    activate(0);
    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(Number(e.target.dataset.step)); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { stepObs.observe(s); });
  }

  /* Counters */
  var counters = document.querySelectorAll('[data-count]');
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countObs.unobserve(e.target);
      var el = e.target, target = Number(el.dataset.count), dur = 1200, start = null;
      if (reduced) { el.textContent = target; return; }
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { countObs.observe(el); });

  /* Hero dot parallax (fine pointers only) */
  var dots = document.querySelectorAll('.hero .dot');
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (dots.length && !reduced && finePointer) {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        dots.forEach(function (d, i) {
          var f = 0.04 + (i % 3) * 0.03;
          d.style.transform = 'translateY(' + (-y * f) + 'px)';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
