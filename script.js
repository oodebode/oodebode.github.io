/* ─── NEURAL CANVAS ANIMATION ─────────────────────────────────
   Draws a softly animated network of nodes and edges in the hero
   background. Nodes drift slowly; edges fade based on distance.
──────────────────────────────────────────────────────────────── */

(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');

  const NODE_COUNT   = 52;
  const MAX_DIST     = 180;
  const SPEED        = 0.28;
  const NODE_RADIUS  = 2.2;
  const EDGE_COLOR   = [184, 216, 240];   // --blue-light RGB
  const NODE_COLOR   = [91, 158, 201];    // --blue-mid RGB

  let W, H, nodes;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomNode() {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 0.6 + 0.4) * SPEED;
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, randomNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.strokeStyle = `rgba(${EDGE_COLOR[0]},${EDGE_COLOR[1]},${EDGE_COLOR[2]},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${NODE_COLOR[0]},${NODE_COLOR[1]},${NODE_COLOR[2]},0.7)`;
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      // Wrap around edges
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Skip animation for reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    init();
    loop();
    window.addEventListener('resize', () => { resize(); });
  }
})();


/* ─── SCROLL FADE-IN ──────────────────────────────────────────
   Sections fade up as they enter the viewport.
──────────────────────────────────────────────────────────────── */

(function () {
  const targets = document.querySelectorAll(
    '.research-card, .pub-item, .contact-item, .about-left, .about-right'
  );

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Set initial state
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();


/* ─── NAV: active section highlight ──────────────────────────── */

(function () {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('#nav ul a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.opacity = link.getAttribute('href') === '#' + entry.target.id ? '1' : '0.6';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
