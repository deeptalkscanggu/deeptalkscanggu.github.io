(function () {
  'use strict';

  var STORAGE_KEY = 'dt-qrcodes-v1';

  var slots = [
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' }
  ];


  var app          = document.getElementById('qr-app');
  var badge        = document.getElementById('qr-badge');
  var btnFullscreen = document.getElementById('btn-fullscreen');
  var iconExpand   = document.getElementById('icon-expand');
  var iconCompress = document.getElementById('icon-compress');
  var btnToEdit    = document.getElementById('btn-to-edit');
  var btnEditBack  = document.getElementById('btn-edit-back');
  var btnEditClear = document.getElementById('btn-edit-clear');
  var btnEditSave  = document.getElementById('btn-edit-save');
  var qrGrid       = document.getElementById('qr-grid');
  var nameInputs   = document.querySelectorAll('.qr-input-name');
  var urlInputs    = document.querySelectorAll('.qr-input-url');

  var views = {
    display: document.getElementById('view-display'),
    edit:    document.getElementById('view-edit')
  };

  var current      = 'display';
  var transitioning = false;
  var displayCX = 0, displayCY = 0; // cached grid centre (relative to #qr-app)

  function isMobile() { return window.matchMedia('(max-width: 600px)').matches; }

  // ── Badge positioning ────────────────────────────────────────
  // badge is position:absolute inside #qr-app, left:0 top:0
  // transform: translate(tx - bw/2, ty - bh/2) scale(s)
  // places the badge's visual centre at (tx, ty) regardless of scale.
  // On mobile the badge is position:relative in document flow — skip all this.

  function snapBadge(tx, ty, sc) {
    if (isMobile()) { badge.style.transition = 'none'; badge.style.transform = ''; return; }
    var bw = badge.offsetWidth;
    var bh = badge.offsetHeight;
    badge.style.transition = 'none';
    badge.style.transform = 'translate(' + (tx - bw / 2) + 'px, ' + (ty - bh / 2) + 'px) scale(' + sc + ')';
    badge.getBoundingClientRect(); // flush
  }

  function animateBadge(tx, ty, sc) {
    if (isMobile()) return;
    var bw = badge.offsetWidth;
    var bh = badge.offsetHeight;
    badge.style.transition = 'transform 0.44s cubic-bezier(0.4, 0, 0.6, 1)';
    badge.style.transform = 'translate(' + (tx - bw / 2) + 'px, ' + (ty - bh / 2) + 'px) scale(' + sc + ')';
  }

  function displayTarget() {
    // Centre of the qr-grid element, relative to #qr-app
    var appRect = app.getBoundingClientRect();
    var gridEl  = document.getElementById('qr-grid');
    var gr      = gridEl.getBoundingClientRect();
    if (gr.width > 0) {
      displayCX = gr.left - appRect.left + gr.width / 2;
      displayCY = gr.top  - appRect.top  + gr.height / 2;
    }
    return { tx: displayCX, ty: displayCY, sc: 1 };
  }

  function editTarget() {
    if (isMobile()) { views.edit.style.paddingTop = ''; return { tx: 0, ty: 0, sc: 1 }; }
    var appRect = app.getBoundingClientRect();
    var sc  = 0.52;
    var bh  = badge.offsetHeight;
    var tx  = appRect.width / 2;
    var ty  = 24 + (bh * sc) / 2; // app padding-top + half scaled badge height
    // Push edit view content below the badge so nothing is hidden behind it
    var badgeBottom = 24 + bh * sc;
    views.edit.style.paddingTop = (badgeBottom + 18) + 'px';
    return { tx: tx, ty: ty, sc: sc };
  }

  // ── View switching ───────────────────────────────────────────

  function switchTo(name) {
    if (name === current || transitioning) return;
    transitioning = true;
    var from = views[current];
    var to   = views[name];
    from.classList.add('qr-view--out');
    setTimeout(function () {
      from.classList.remove('qr-view--active', 'qr-view--out');
      from.setAttribute('aria-hidden', 'true');
      to.removeAttribute('aria-hidden');
      to.classList.add('qr-view--active');
      current = name;
      transitioning = false;
    }, 300);
  }

  // ── URL helpers ──────────────────────────────────────────────

  function normalizeUrl(raw) {
    var url = (raw || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try { new URL(url); return url; } catch (_) { return ''; }
  }

  function esc(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Render ───────────────────────────────────────────────────

  function renderGrid() {
    var old = qrGrid.querySelectorAll('.qr-card');
    for (var j = 0; j < old.length; j++) old[j].remove();

    for (var i = 0; i < 4; i++) {
      var s     = slots[i];
      var label = s.name.trim() || String(i + 1);
      var url   = normalizeUrl(s.url);

      var card = document.createElement('div');
      card.className = 'qr-card';
      var labelEl = document.createElement('div');
      labelEl.className = 'qr-card-label';
      labelEl.textContent = label;
      card.appendChild(labelEl);

      if (url) {
        var src = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=M&data=' + encodeURIComponent(url);
        var box = document.createElement('div');
        box.className = 'qr-code-box';
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'QR code for ' + label;
        img.loading = 'eager';
        box.appendChild(img);
        card.appendChild(box);
      } else {
        var empty = document.createElement('div');
        empty.className = 'qr-empty-box';
        empty.textContent = 'No link';
        card.appendChild(empty);
      }

      qrGrid.appendChild(card);
    }
  }

  // ── Sync slots ↔ inputs ──────────────────────────────────────

  function slotsToInputs() {
    for (var i = 0; i < 4; i++) {
      nameInputs[i].value = slots[i].name;
      urlInputs[i].value  = slots[i].url;
    }
  }

  function inputsToSlots() {
    for (var i = 0; i < 4; i++) {
      slots[i].name = nameInputs[i].value.trim();
      var raw = urlInputs[i].value.trim();
      var norm = normalizeUrl(raw);
      slots[i].url = norm || raw;
      urlInputs[i].value = slots[i].url;
    }
  }

  // ── Persistence ──────────────────────────────────────────────

  function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(slots)); }

  function load() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      var p = JSON.parse(raw);
      if (Array.isArray(p) && p.length === 4) slots = p;
    } catch (_) {}
  }

  // ── Events ───────────────────────────────────────────────────

  btnToEdit.addEventListener('click', function () {
    slotsToInputs();
    var t = editTarget();
    animateBadge(t.tx, t.ty, t.sc);
    setTimeout(function () { switchTo('edit'); }, 280);
  });

  btnEditBack.addEventListener('click', function () {
    switchTo('display');
    // Wait for display view to become visible, then animate badge back to grid centre
    setTimeout(function () {
      var t = displayTarget();
      animateBadge(t.tx, t.ty, t.sc);
    }, 310);
  });

  btnEditSave.addEventListener('click', function () {
    inputsToSlots();
    persist();
    renderGrid();
    btnEditSave.textContent = 'Saved ✓';
    setTimeout(function () { btnEditSave.textContent = 'Save'; }, 1400);
  });

  btnEditClear.addEventListener('click', function () {
    for (var i = 0; i < 4; i++) {
      nameInputs[i].value = '';
      urlInputs[i].value  = '';
    }
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
    iconExpand.style.display   = isFs ? 'none' : '';
    iconCompress.style.display = isFs ? ''     : 'none';
  });

  // Reposition on resize without animation (handles portrait↔landscape and desktop↔mobile)
  window.addEventListener('resize', function () {
    if (isMobile()) {
      badge.style.transition = 'none';
      badge.style.transform = '';
      views.edit.style.paddingTop = '';
      return;
    }
    var t = current === 'display' ? displayTarget() : editTarget();
    snapBadge(t.tx, t.ty, t.sc);
  });

  // ── Init ─────────────────────────────────────────────────────

  load();
  renderGrid();

  requestAnimationFrame(function () {
    views.display.removeAttribute('aria-hidden');
    views.display.classList.add('qr-view--active');

    // Measure grid centre after first paint, then snap badge into position
    requestAnimationFrame(function () {
      var t = displayTarget();
      snapBadge(t.tx, t.ty, t.sc);
    });
  });

})();
