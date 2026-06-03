document.addEventListener('DOMContentLoaded', function () {
  var track = document.querySelector('.carousel-track');
  if (!track) return;

  var viewport = document.querySelector('.carousel-viewport');
  var slides   = track.querySelectorAll('.community-card');
  var dots     = document.querySelectorAll('.carousel-dot');
  var prevBtn  = document.querySelector('.carousel-arrow--prev');
  var nextBtn  = document.querySelector('.carousel-arrow--next');
  var current  = 0;
  var dragStartX = 0;
  var dragDelta  = 0;
  var isDragging = false;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  document.addEventListener('keydown', function (e) {
    var r = viewport.getBoundingClientRect();
    var inView = r.top < window.innerHeight && r.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  track.addEventListener('touchstart', function (e) {
    dragStartX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    var diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    isDragging = false;
  });

  track.addEventListener('mousedown', function (e) {
    dragStartX = e.clientX;
    dragDelta  = 0;
    isDragging = true;
    track.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    dragDelta = dragStartX - e.clientX;
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    if (Math.abs(dragDelta) > 40) goTo(current + (dragDelta > 0 ? 1 : -1));
    isDragging = false;
    dragDelta  = 0;
    track.style.cursor = 'grab';
  });
});
