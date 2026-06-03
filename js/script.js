/* ═══════════════════════════════════
   KWAF v2 — js/script.js
   Full cross-platform: desktop / tablet / mobile
═══════════════════════════════════ */

/* ── Particles ──────────────────── */
(function () {
  var container = document.getElementById('ldParticles');
  if (!container) return;
  for (var i = 0; i < 32; i++) {
    var p = document.createElement('div');
    p.className = 'ld-p';
    var size = 1 + Math.random() * 2.5;
    p.style.cssText =
      'left:' + (28 + Math.random() * 44) + '%;' +
      'bottom:' + (15 + Math.random() * 28) + '%;' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'animation:pFloat ' + (2 + Math.random() * 3) + 's ease-out ' + (Math.random() * 3) + 's infinite;';
    container.appendChild(p);
  }
})();

/* ── Page order (for swipe direction) ── */
var PAGE_ORDER = ['home','about','branches','books','events','members','contact'];

/* ── State ───────────────────────── */
var currentPage  = 'home';
var isAnimating  = false;
var drawerOpen   = false;

/* ── Loader → Site ──────────────── */
window.addEventListener('DOMContentLoaded', function () {
  var loader = document.getElementById('loader');
  var site   = document.getElementById('site');

  setTimeout(function () {
    loader.classList.add('fade-out');
    setTimeout(function () {
      loader.style.display = 'none';
      site.classList.add('visible');
      startCountdowns();
      updateArrows();
    }, 900);
  }, 4000);

  /* Wire desktop nav */
  document.querySelectorAll('.nav-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { goTo(btn.dataset.page); });
  });

  /* Wire drawer nav */
  document.querySelectorAll('.drawer-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goTo(btn.dataset.page);
      closeDrawer();
    });
  });

  /* Wire footer quick links */
  document.querySelectorAll('.footer-link').forEach(function (btn) {
    btn.addEventListener('click', function () { goTo(btn.dataset.page); });
  });

  /* Hamburger */
  var menuSpine = document.getElementById('menuSpine');
  var overlay   = document.getElementById('drawerOverlay');
  if (menuSpine) {
    menuSpine.addEventListener('click', function () {
      drawerOpen ? closeDrawer() : openDrawer();
    });
  }
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  /* Swipe arrows */
  var arrowPrev = document.getElementById('arrowPrev');
  var arrowNext = document.getElementById('arrowNext');
  if (arrowPrev) arrowPrev.addEventListener('click', function () { stepPage(-1); });
  if (arrowNext) arrowNext.addEventListener('click', function () { stepPage(1); });

  /* Touch swipe */
  initSwipe();
});

/* ── Navigation ─────────────────── */
function goTo(pageId) {
  if (pageId === currentPage || isAnimating) return;
  isAnimating = true;

  var oldEl = document.getElementById('page-' + currentPage);
  var newEl = document.getElementById('page-' + pageId);

  /* Update all nav states */
  document.querySelectorAll('.nav-btn, .drawer-btn').forEach(function (b) {
    b.classList.toggle('active', b.dataset.page === pageId);
  });

  /* Hero pattern only on home */
  var heroBg = document.getElementById('heroBg');
  if (heroBg) heroBg.classList.toggle('show', pageId === 'home');

  /* Animate out */
  oldEl.classList.add('turn-out');

  setTimeout(function () {
    oldEl.classList.remove('active', 'turn-out');
    oldEl.style.display = 'none';

    newEl.style.display = 'block';
    newEl.classList.add('turn-in');

    /* Re-trigger reveal animation */
    var reveal = newEl.querySelector('.reveal');
    if (reveal) {
      Array.from(reveal.children).forEach(function (child) {
        child.style.animation = 'none';
        child.offsetHeight;
        child.style.animation = '';
      });
    }

    setTimeout(function () {
      newEl.classList.add('active');
      newEl.classList.remove('turn-in');
      isAnimating = false;
      currentPage = pageId;
      updateArrows();
    }, 480);
  }, 340);
}

/* Step forward/back by index */
function stepPage(dir) {
  var idx = PAGE_ORDER.indexOf(currentPage);
  var next = PAGE_ORDER[idx + dir];
  if (next) goTo(next);
}

/* Update arrow disabled state */
function updateArrows() {
  var arrowPrev = document.getElementById('arrowPrev');
  var arrowNext = document.getElementById('arrowNext');
  if (!arrowPrev || !arrowNext) return;
  var idx = PAGE_ORDER.indexOf(currentPage);
  arrowPrev.disabled = idx === 0;
  arrowNext.disabled = idx === PAGE_ORDER.length - 1;
}

/* ── Drawer ─────────────────────── */
function openDrawer() {
  drawerOpen = true;
  document.getElementById('navDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('show');
  document.getElementById('menuSpine').classList.add('open');
}

function closeDrawer() {
  drawerOpen = false;
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('show');
  document.getElementById('menuSpine').classList.remove('open');
}

/* ── Touch swipe ─────────────────── */
function initSwipe() {
  var stage = document.querySelector('.book-stage');
  if (!stage) return;

  var startX = 0, startY = 0;

  stage.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      stepPage(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* ── Countdown tickers ───────────── */
function startCountdowns() {
  var events = [
    { id: 'cd1', date: new Date('2026-07-14') },
    { id: 'cd2', date: new Date('2026-08-02') },
    { id: 'cd3', date: new Date('2026-08-19') },
    { id: 'cd4', date: new Date('2026-09-06') },
  ];

  function tick() {
    var now = new Date();
    events.forEach(function (ev) {
      var el = document.getElementById(ev.id);
      if (!el) return;
      var diff = ev.date - now;
      if (diff < 0) { el.textContent = '· Now'; return; }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      el.textContent = '· ' + d + 'd ' + h + 'h';
    });
  }
  tick();
  setInterval(tick, 60000);
}
