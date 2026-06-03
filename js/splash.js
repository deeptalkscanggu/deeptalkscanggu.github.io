var MIN_MS = 700;
var splashStart = Date.now();

function removeSplash() {
  var el = document.getElementById('splash');
  if (!el || el._removing) return;
  el._removing = true;
  var wait = Math.max(0, MIN_MS - (Date.now() - splashStart));
  setTimeout(function () {
    el.classList.add('splash--hidden');
    el.addEventListener('transitionend', function () { el.remove(); }, { once: true });
    setTimeout(function () { if (el.parentNode) el.remove(); }, 800);
  }, wait);
}

if (document.readyState === 'complete') {
  removeSplash();
} else {
  window.addEventListener('load', removeSplash);
  setTimeout(removeSplash, 4000);
}
