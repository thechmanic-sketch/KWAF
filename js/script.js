/* ═══════════════════════════════════
   KWAF v2 — js/script.js
═══════════════════════════════════ */

/* ── Particles ──────────────────── */
(function () {
  const container = document.getElementById('ldParticles');
  if (!container) return;
  for (let i = 0; i < 32; i++) {
    const p = document.createElement('div');
    p.className = 'ld-p';
    const size = 1 + Math.random() * 2.5;
    p.style.cssText = `
      left: ${28 + Math.random() * 44}%;
      bottom: ${15 + Math.random() * 28}%;
      width: ${size}px; height: ${size}px;
      animation: pFloat ${2 + Math.random() * 3}s ease-out ${Math.random() * 3}s infinite;
    `;
    container.appendChild(p);
  }
})();

/* ── Loader → Site ──────────────── */
window.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');
  const site   = document.getElementById('site');

  setTimeout(function () {
    loader.classList.add('fade-out');
    setTimeout(function () {
      loader.style.display = 'none';
      site.classList.add('visible');
      startCountdowns();
    }, 900);
  }, 4000);
});

/* ── Page navigation ─────────────── */
let currentPage = 'home';
let isAnimating  = false;

function goTo(pageId) {
  if (pageId === currentPage || isAnimating) return;
  isAnimating = true;

  const oldEl = document.getElementById('page-' + currentPage);
  const newEl = document.getElementById('page-' + pageId);

  /* Update nav */
  document.querySelectorAll('.nav-btn').forEach(function (b) {
    b.classList.toggle('active', b.dataset.page === pageId);
  });

  /* Hero background — only on home */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) heroBg.classList.toggle('show', pageId === 'home');

  /* Animate out */
  oldEl.classList.add('turn-out');

  setTimeout(function () {
    oldEl.classList.remove('active', 'turn-out');
    oldEl.style.display = 'none';

    newEl.style.display = 'block';
    newEl.classList.add('turn-in');

    /* Re-trigger line reveal */
    const reveal = newEl.querySelector('.reveal');
    if (reveal) {
      Array.from(reveal.children).forEach(function (child) {
        child.style.animation = 'none';
        child.offsetHeight; /* reflow */
        child.style.animation = '';
      });
    }

    setTimeout(function () {
      newEl.classList.add('active');
      newEl.classList.remove('turn-in');
      isAnimating = false;
    }, 480);
  }, 340);

  currentPage = pageId;
}

/* Wire up nav buttons */
document.querySelectorAll('.nav-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    goTo(btn.dataset.page);
  });
});

/* ── Countdown tickers ───────────── */
function startCountdowns() {
  const events = [
    { id: 'cd1', date: new Date('2026-07-14') },
    { id: 'cd2', date: new Date('2026-08-02') },
    { id: 'cd3', date: new Date('2026-08-19') },
    { id: 'cd4', date: new Date('2026-09-06') },
  ];

  function tick() {
    const now = new Date();
    events.forEach(function (ev) {
      const el = document.getElementById(ev.id);
      if (!el) return;
      const diff = ev.date - now;
      if (diff < 0) { el.textContent = '· Now'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      el.textContent = '· ' + d + 'd ' + h + 'h';
    });
  }

  tick();
  setInterval(tick, 60000);
}
