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

  /* Languages marquee: clone the group until the track covers the viewport twice, then
     shift by exactly one group width so every gap, including the seam, is identical */
  var marquee = document.querySelector('.marquee');
  if (marquee) {
    var track = marquee.querySelector('.marquee-track');
    var proto = track.querySelector('.marquee-group');
    function sizeMarquee() {
      var groups = track.querySelectorAll('.marquee-group');
      for (var i = 1; i < groups.length; i++) track.removeChild(groups[i]);
      var gw = proto.getBoundingClientRect().width;
      if (!gw) return;
      var need = Math.ceil(window.innerWidth / gw) + 1;
      for (var k = 1; k < need; k++) track.appendChild(proto.cloneNode(true));
      marquee.style.setProperty('--shift', '-' + gw + 'px');
      marquee.style.setProperty('--dur', (gw / 55) + 's');
    }
    sizeMarquee();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(sizeMarquee, 150); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeMarquee);
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

/* Background: a fine dot grid that breathes in a slow wave, a single orange dot that snaps to the
   grid under the pointer with a short fading trail,
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

  var trail = [];
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var sy = window.scrollY || 0;
    for (var r = 0; r < rows; r++) {
      var y = r * SP + SP / 2;
      for (var c = 0; c < cols; c++) {
        var x = c * SP + SP / 2;
        var w = Math.sin(x * 0.016 + t * 0.5) * Math.cos((y + sy * 0.25) * 0.013 - t * 0.35);
        var a = 0.06 + (w + 1) * 0.05;
        ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
    /* pointer: the nearest grid dot lights orange, the last few fade out behind it */
    if (mouse.x > -1e3) {
      var gx = Math.round((mouse.x - SP / 2) / SP) * SP + SP / 2;
      var gy = Math.round((mouse.y - SP / 2) / SP) * SP + SP / 2;
      var lastT = trail.length ? trail[trail.length - 1] : null;
      if (!lastT || lastT.x !== gx || lastT.y !== gy) { trail.push({ x: gx, y: gy, t: t }); if (trail.length > 14) trail.shift(); }
    }
    for (var i = 0; i < trail.length; i++) {
      var p = trail[i], age = t - p.t, life = 0.9;
      if (age > life) continue;
      var k = 1 - age / life;
      ctx.fillStyle = 'rgba(255,140,0,' + (0.15 + k * 0.85) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.2 + k * 1.3, 0, 6.2832); ctx.fill();
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

/* Custom scrollbar: the native one is hidden in CSS; this draws a thin track on the right with an
   orange thumb that fades when idle. Drag the thumb or click the track to scroll. */
(function () {
  'use strict';
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var bar = document.createElement('div'); bar.className = 'sb';
  var thumb = document.createElement('div'); thumb.className = 'sb-thumb';
  bar.appendChild(thumb); document.body.appendChild(bar);
  var hideT, dragging = false, dragOff = 0;
  function layout() {
    var sh = document.documentElement.scrollHeight, ch = window.innerHeight;
    if (sh <= ch + 1) { bar.style.display = 'none'; return; }
    bar.style.display = '';
    var trackH = bar.clientHeight;
    var h = Math.max(36, trackH * ch / sh);
    var y = (trackH - h) * (window.scrollY / (sh - ch));
    thumb.style.height = h + 'px';
    thumb.style.transform = 'translateY(' + y + 'px)';
  }
  function show() { bar.classList.add('is-on'); clearTimeout(hideT); if (!dragging) hideT = setTimeout(function () { bar.classList.remove('is-on'); }, 1100); }
  function onScroll() { layout(); show(); }
  function toScroll(clientY) {
    var rect = bar.getBoundingClientRect(), h = thumb.offsetHeight;
    var frac = (clientY - rect.top - dragOff) / (rect.height - h);
    var sh = document.documentElement.scrollHeight, ch = window.innerHeight;
    window.scrollTo(0, Math.max(0, Math.min(1, frac)) * (sh - ch));
  }
  thumb.addEventListener('pointerdown', function (e) {
    dragging = true; bar.classList.add('is-drag'); dragOff = e.clientY - thumb.getBoundingClientRect().top;
    document.documentElement.style.scrollBehavior = 'auto';
    thumb.setPointerCapture(e.pointerId); e.preventDefault();
  });
  thumb.addEventListener('pointermove', function (e) { if (dragging) toScroll(e.clientY); });
  thumb.addEventListener('pointerup', function () { dragging = false; bar.classList.remove('is-drag'); document.documentElement.style.scrollBehavior = ''; show(); });
  bar.addEventListener('pointerdown', function (e) {
    if (e.target !== bar) return;
    dragOff = thumb.offsetHeight / 2;
    document.documentElement.style.scrollBehavior = 'auto'; toScroll(e.clientY); document.documentElement.style.scrollBehavior = '';
  });
  bar.addEventListener('pointerenter', function () { clearTimeout(hideT); bar.classList.add('is-on'); });
  bar.addEventListener('pointerleave', function () { if (!dragging) show(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', layout, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(document.body);
  layout();
})();
