var SHEET_ID = '1QpzZOz48kldrSdk-oZTo5Kws1HR8j83nCgIzDBUFGW8';
var GID      = '0';
var FEED_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&gid=' + GID;

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function fmtDate(raw) {
  if (!raw) return '—';
  var str = String(raw).trim();

  var m = str.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (m) {
    var d = new Date(+m[1], +m[2], +m[3]);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  var parts = str.split(/[\/\-\.]/);
  if (parts.length === 3 && parts.every(function (p) { return /^\d+$/.test(p.trim()); })) {
    var p1 = +parts[0].trim(), p2 = +parts[1].trim(), p3 = +parts[2].trim();
    if (p1 > 31) {
      var d2 = new Date(p1, p2 - 1, p3);
      if (!isNaN(d2.getTime())) return d2.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    var year = p3 < 100 ? p3 + 2000 : p3;
    var tryDMY = new Date(year, p2 - 1, p1);
    if (!isNaN(tryDMY.getTime()) && tryDMY.getMonth() === p2 - 1 && tryDMY.getDate() === p1) {
      return tryDMY.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    var tryMDY = new Date(year, p1 - 1, p2);
    if (!isNaN(tryMDY.getTime()) && tryMDY.getMonth() === p1 - 1 && tryMDY.getDate() === p2) {
      return tryMDY.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  var d3 = new Date(str);
  if (!isNaN(d3.getTime())) {
    return d3.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return esc(str);
}

async function loadTopics() {
  var container = document.getElementById('topics-container');
  var countEl   = document.getElementById('topic-count');
  var filterBar = document.getElementById('filter-bar');

  try {
    var res  = await fetch(FEED_URL);
    var text = await res.text();

    var match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/);
    if (!match) throw new Error('Unexpected response format');

    var json = JSON.parse(match[1]);
    var rows = json.table && json.table.rows ? json.table.rows : [];

    var topics = rows.slice(1).filter(function (row) {
      var subj = row.c && row.c[4] ? (row.c[4].v !== null && row.c[4].v !== undefined ? row.c[4].v : row.c[4].f) : null;
      return subj && String(subj).trim() !== '';
    });

    if (topics.length === 0) {
      container.textContent = '';
      var emptyEl = document.createElement('div');
      emptyEl.className = 'empty-state';
      emptyEl.textContent = 'No topics recorded yet — check back after the next session.';
      container.appendChild(emptyEl);
      return;
    }

    countEl.textContent = topics.length + ' session' + (topics.length !== 1 ? 's' : '') + ' and counting';

    var withValues = new Set();
    topics.forEach(function (row) {
      var v = (row.c && row.c[3] && row.c[3].v ? row.c[3].v : '').trim();
      if (v) withValues.add(v);
    });

    if (withValues.size > 0) {
      filterBar.textContent = '';
      withValues.forEach(function (val) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = val;
        btn.textContent = val;
        btn.addEventListener('click', function () {
          var isHidden = btn.classList.toggle('hidden-filter');
          container.querySelectorAll('.topic-row').forEach(function (row) {
            if (row.dataset.with === val) {
              row.classList.toggle('filtered-out', isHidden);
            }
          });
        });
        filterBar.appendChild(btn);
      });
    }

    container.textContent = '';
    topics.forEach(function (row, i) {
      var c           = row.c || [];
      var date        = (c[1] && c[1].v != null) ? c[1].v : ((c[1] && c[1].f) ? c[1].f : '');
      var host        = (c[2] && c[2].v != null) ? c[2].v : '';
      var withContent = ((c[3] && c[3].v) ? c[3].v : '').trim();
      var subject     = (c[4] && c[4].v != null) ? c[4].v : ((c[4] && c[4].f != null) ? c[4].f : '');
      var summary     = (c[5] && c[5].v != null) ? c[5].v : ((c[5] && c[5].f != null) ? c[5].f : '');

      var rowEl = document.createElement('div');
      rowEl.className = 'topic-row';
      rowEl.dataset.with = withContent;
      rowEl.style.animationDelay = (i * 0.04) + 's';

      var dateEl = document.createElement('span');
      dateEl.className = 'topic-date';
      dateEl.textContent = fmtDate(date);

      var infoEl = document.createElement('div');
      infoEl.className = 'topic-info';

      var subjectEl = document.createElement('div');
      subjectEl.className = 'topic-subject';
      subjectEl.textContent = subject;
      infoEl.appendChild(subjectEl);

      if (host) {
        var hostEl = document.createElement('div');
        hostEl.className = 'topic-host';
        hostEl.textContent = host;
        if (withContent) {
          var withSpan = document.createElement('span');
          withSpan.style.color = '#111';
          withSpan.textContent = ' with ' + withContent;
          hostEl.appendChild(withSpan);
        }
        infoEl.appendChild(hostEl);
      }

      var summaryEl = document.createElement('span');
      summaryEl.className = 'topic-explanation';
      summaryEl.textContent = summary;

      rowEl.appendChild(dateEl);
      rowEl.appendChild(infoEl);
      rowEl.appendChild(summaryEl);
      container.appendChild(rowEl);
    });

  } catch (err) {
    console.error(err);
    container.textContent = '';
    var errEl = document.createElement('div');
    errEl.className = 'error-state';
    errEl.textContent = "Couldn't load topics right now — please try again later.";
    container.appendChild(errEl);
  }
}

loadTopics();
