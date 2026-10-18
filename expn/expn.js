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

})();

/* Background: a fine dot grid that breathes in a slow wave, warms to orange near the cursor,
   and a thin savings curve drifting across the hero. Static under reduced motion. */
(function () {
  'use strict';
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var SP = 28, W = 0, H = 0, cols = 0, rows = 0, heroH = 0;
  var mouse = { x: -1e4, y: -1e4 }, t = 0, last = 0, running = false;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / SP) + 1; rows = Math.ceil(H / SP) + 1;
    var hero = document.querySelector('.hero');
    heroH = hero ? hero.offsetTop + hero.offsetHeight : H;
    draw();
  }

  function curve(yBase, amp1, amp2, phase, alpha, width) {
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, 'rgba(255,140,0,0)');
    g.addColorStop(0.25, 'rgba(255,140,0,' + alpha + ')');
    g.addColorStop(0.75, 'rgba(255,140,0,' + alpha + ')');
    g.addColorStop(1, 'rgba(255,140,0,0)');
    ctx.strokeStyle = g; ctx.lineWidth = width; ctx.beginPath();
    for (var x = 0; x <= W + 12; x += 12) {
      var y = yBase + Math.sin(x * 0.0035 + t * 0.35 + phase) * amp1 + Math.sin(x * 0.012 - t * 0.22 + phase) * amp2;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  var lens = { x: -1e4, y: -1e4 };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var sy = window.scrollY || 0;
    /* the lens eases toward the pointer so the grid feels fluid rather than snapping */
    lens.x += (mouse.x - lens.x) * 0.14;
    lens.y += (mouse.y - lens.y) * 0.14;
    var R = 200, R2 = R * R, PUSH = 26;
    for (var r = 0; r < rows; r++) {
      var y = r * SP + SP / 2;
      for (var c = 0; c < cols; c++) {
        var x = c * SP + SP / 2;
        var w = Math.sin(x * 0.016 + t * 0.5) * Math.cos((y + sy * 0.25) * 0.013 - t * 0.35);
        var a = 0.06 + (w + 1) * 0.05;
        var dx = x - lens.x, dy = y - lens.y, d2 = dx * dx + dy * dy;
        var px = x, py = y, s = 2;
        if (d2 < R2 && d2 > 0.01) {
          var d = Math.sqrt(d2), f = 1 - d / R;
          f = f * f * (3 - 2 * f);
          px = x + dx / d * f * PUSH;
          py = y + dy / d * f * PUSH;
          s = 2 + f * 1.2;
        }
        ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }
    }
    var heroBottom = heroH - sy;
    if (heroBottom > 0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, heroBottom); ctx.clip();
      var base = Math.min(heroH * 0.62, H * 0.62) - sy;
      curve(base, 70, 22, 0, 0.32, 1.4);
      curve(base + 46, 55, 18, 1.7, 0.12, 1);
      ctx.restore();
    }
  }

  function frame(ts) {
    if (!running) return;
    if (ts - last > 33) { t += (ts - last) / 1000; last = ts; draw(); }
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduced) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  function stop() { running = false; }

  window.addEventListener('resize', resize, { passive: true });
  if (fine) {
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mouse.x = -1e4; mouse.y = -1e4; }, { passive: true });
  }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if (reduced) window.addEventListener('scroll', draw, { passive: true });
  resize(); start();
})();
