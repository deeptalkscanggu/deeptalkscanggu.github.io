(function () {
  'use strict';

  var STORAGE_KEY  = 'dt-randomiser-v1';
  var TYPE_MS      = 38; // ms per character

  var btnFullscreen  = document.getElementById('btn-fullscreen');
  var iconExpand     = document.getElementById('icon-expand');
  var iconCompress   = document.getElementById('icon-compress');
  var logo         = document.getElementById('rnd-logo');
  var heading      = document.getElementById('rnd-heading');
  var btnToEntries = document.getElementById('btn-to-entries');
  var btnToStart   = document.getElementById('btn-to-start');
  var btnSave      = document.getElementById('btn-save');
  var btnClear     = document.getElementById('btn-clear');
  var btnEntBack   = document.getElementById('btn-entries-back');
  var btnBack      = document.getElementById('btn-back');
  var btnToHome    = document.getElementById('btn-to-home');
  var btnNext      = document.getElementById('btn-next');
  var entriesField = document.getElementById('entries-field');
  var entryCount    = document.getElementById('entry-count');
  var rndEntry      = document.getElementById('rnd-entry');
  var rndDisplayBody = document.querySelector('.rnd-display-body');

  var views = {
    home:    document.getElementById('view-home'),
    entries: document.getElementById('view-entries'),
    display: document.getElementById('view-display'),
  };

  var current      = 'home';
  var transitioning = false;
  var entries      = [];
  var deck         = [];
  var hist         = [];
  var histPos      = -1;
  var tyTimer      = null;

  // ── Helpers ──────────────────────────────────────────────────

  function parseField() {
    return (entriesField.value || '')
      .split('\n')
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function updateCount() {
    var n = parseField().length;
    entryCount.textContent = n === 0 ? '' : n + (n === 1 ? ' entry' : ' entries');
  }

  function shuffle(arr) {
    var a = arr.slice(), i = a.length, j, t;
    while (i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ── Typewriter ───────────────────────────────────────────────

  function fitFontSize(text) {
    var cs  = window.getComputedStyle(rndDisplayBody);
    var maxH = rndDisplayBody.clientHeight
      - parseFloat(cs.paddingTop)
      - parseFloat(cs.paddingBottom)
      - 12; // safety buffer for sub-pixel rounding
    rndEntry.style.fontSize = '';
    rndEntry.textContent = text;
    var fs = parseFloat(window.getComputedStyle(rndEntry).fontSize);
    var min = 20;
    while (fs > min && (rndEntry.scrollHeight > maxH || rndEntry.scrollWidth > rndEntry.clientWidth)) {
      fs -= 2;
      rndEntry.style.fontSize = fs + 'px';
    }
    rndEntry.textContent = '';
    return fs;
  }

  function typeWrite(text) {
    if (tyTimer) { cancelAnimationFrame(tyTimer); tyTimer = null; }
    rndEntry.classList.remove('rnd-entry--done');
    var fs = fitFontSize(text);
    rndEntry.style.fontSize = fs + 'px';
    var i = 0;
    var last = null;
    function step(ts) {
      if (last === null) last = ts;
      var due = Math.floor((ts - last) / TYPE_MS);
      if (due > 0) {
        i = Math.min(i + due, text.length);
        rndEntry.textContent = text.slice(0, i);
        last += due * TYPE_MS;
      }
      if (i < text.length) {
        tyTimer = requestAnimationFrame(step);
      } else {
        tyTimer = null;
        rndEntry.classList.add('rnd-entry--done');
      }
    }
    tyTimer = requestAnimationFrame(step);
  }

  function showInstant(text) {
    if (tyTimer) { cancelAnimationFrame(tyTimer); tyTimer = null; }
    var fs = fitFontSize(text);
    rndEntry.style.fontSize = fs + 'px';
    rndEntry.textContent = text;
    rndEntry.classList.add('rnd-entry--done');
  }

  // ── View switching ───────────────────────────────────────────

  function switchTo(name) {
    if (name === current || transitioning) return;
    transitioning = true;

    var from = views[current];
    var to   = views[name];

    if (name === 'home') {
      logo.classList.remove('rnd-logo--sm');
      heading.classList.remove('rnd-heading--sm');
    } else {
      logo.classList.add('rnd-logo--sm');
      heading.classList.add('rnd-heading--sm');
    }

    from.classList.add('rnd-view--out');

    setTimeout(function () {
      from.classList.remove('rnd-view--active', 'rnd-view--out');
      from.setAttribute('aria-hidden', 'true');
      to.removeAttribute('aria-hidden');
      to.classList.add('rnd-view--active');
      current = name;
      transitioning = false;
    }, 300);
  }

  // ── Draw logic ───────────────────────────────────────────────

  function drawNext() {
    if (!entries.length) return;

    if (deck.length === 0) deck = shuffle(entries);

    hist = hist.slice(0, histPos + 1);
    hist.push(deck.shift());
    histPos = hist.length - 1;

    typeWrite(hist[histPos]);
  }

  function drawPrev() {
    if (histPos <= 0) {
      switchTo('home');
      return;
    }
    histPos--;
    showInstant(hist[histPos]);
  }

  // ── Event listeners ──────────────────────────────────────────

  btnToEntries.addEventListener('click', function () {
    updateCount();
    switchTo('entries');
  });

  btnToStart.addEventListener('click', function () {
    entries = parseField();
    if (!entries.length) { switchTo('entries'); return; }
    deck    = shuffle(entries);
    hist    = [];
    histPos = -1;
    rndEntry.textContent = '';
    rndEntry.classList.remove('rnd-entry--done');
    switchTo('display');
    setTimeout(drawNext, 380);
  });

  btnSave.addEventListener('click', function () {
    localStorage.setItem(STORAGE_KEY, entriesField.value);
    updateCount();
    btnSave.textContent = 'Saved ✓';
    setTimeout(function () { btnSave.textContent = 'Save'; }, 1400);
  });

  btnClear.addEventListener('click', function () {
    entriesField.value = '';
    localStorage.removeItem(STORAGE_KEY);
    updateCount();
  });

  btnEntBack.addEventListener('click', function () { switchTo('home'); });
  btnBack.addEventListener('click', drawPrev);
  btnToHome.addEventListener('click', function () { switchTo('home'); });
  btnNext.addEventListener('click', drawNext);
  entriesField.addEventListener('input', updateCount);

  document.addEventListener('keydown', function (e) {
    if (current !== 'display') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); drawNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); drawPrev(); }
    if (e.key === 'Escape')     { switchTo('home'); }
  });

  // ── Fullscreen ───────────────────────────────────────────────

  btnFullscreen.addEventListener('click', function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', function () {
    var isFs = !!document.fullscreenElement;
    iconExpand.style.display   = isFs ? 'none'  : '';
    iconCompress.style.display = isFs ? ''      : 'none';
  });

  // ── Init ─────────────────────────────────────────────────────

  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) entriesField.value = saved;

  requestAnimationFrame(function () {
    views.home.removeAttribute('aria-hidden');
    views.home.classList.add('rnd-view--active');
  });

})();
