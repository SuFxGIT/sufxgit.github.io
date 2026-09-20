(function () {
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w, h, dpr, dots, raf;
  var LINK = 130;

  function count() {
    var area = (w * h) / 16000;
    return Math.max(24, Math.min(90, Math.round(area)));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = count();
    dots = [];
    for (var i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 1.4
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    var i, j, a, b, dx, dy, d;
    for (i = 0; i < dots.length; i++) {
      a = dots[i];
      if (!reduce) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -10) a.x = w + 10; else if (a.x > w + 10) a.x = -10;
        if (a.y < -10) a.y = h + 10; else if (a.y > h + 10) a.y = -10;
      }
    }
    ctx.lineWidth = 1;
    for (i = 0; i < dots.length; i++) {
      a = dots[i];
      for (j = i + 1; j < dots.length; j++) {
        b = dots[j];
        dx = a.x - b.x;
        dy = a.y - b.y;
        d = dx * dx + dy * dy;
        if (d < LINK * LINK) {
          ctx.strokeStyle = 'rgba(255, 140, 0, ' + (0.16 * (1 - Math.sqrt(d) / LINK)) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (i = 0; i < dots.length; i++) {
      a = dots[i];
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduce) raf = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(raf);
    step();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(raf); else start();
  });
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () { resize(); start(); }, 150);
  });

  resize();
  start();
})();
