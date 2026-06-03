var GALLERY_IMAGES = [
  '032.webp', '031.webp', '030.webp', '029.webp', '028.webp',
  '027.webp', '026.webp', '025.webp', '024.webp', '023.webp',
  '022.webp', '021.webp', '020.webp', '019.webp', '018.webp',
  '017.webp', '016.webp', '015.webp', '014.webp', '013.webp',
  '012.webp', '011.webp', '010.webp', '009.webp', '008.webp',
  '007.webp', '006.webp', '005.webp', '004.webp', '003.webp',
  '002.webp', '001.webp'
];

var PAGE_SIZE   = 50;
var currentPage = 0;

var grid         = document.getElementById('gallery-grid');
var lightbox     = document.getElementById('lightbox');
var lightboxImg  = document.getElementById('lightbox-img');
var lightboxClose = document.getElementById('lightbox-close');

function totalPages() {
  return Math.ceil(GALLERY_IMAGES.length / PAGE_SIZE);
}

function renderPagination() {
  var old = document.getElementById('gallery-pagination');
  if (old) old.remove();
  if (totalPages() <= 1) return;

  var nav = document.createElement('div');
  nav.className = 'gallery-pagination';
  nav.id = 'gallery-pagination';

  function makeBtn(label, page, isActive) {
    var b = document.createElement('button');
    b.textContent = label;
    if (isActive) b.classList.add('active');
    b.addEventListener('click', function () {
      currentPage = page;
      renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    nav.appendChild(b);
  }

  function makeDots() {
    var s = document.createElement('span');
    s.className = 'pg-dots';
    s.textContent = '…';
    nav.appendChild(s);
  }

  var prev = document.createElement('button');
  prev.textContent = '← Prev';
  if (currentPage === 0) prev.disabled = true;
  prev.addEventListener('click', function () {
    currentPage--;
    renderGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  nav.appendChild(prev);

  var total    = totalPages();
  var lastDots = false;
  for (var i = 0; i < total; i++) {
    var near = i === 0 || i === total - 1 || Math.abs(i - currentPage) <= 1;
    if (near) {
      makeBtn(i + 1, i, i === currentPage);
      lastDots = false;
    } else if (!lastDots) {
      makeDots();
      lastDots = true;
    }
  }

  var next = document.createElement('button');
  next.textContent = 'Next →';
  if (currentPage >= total - 1) next.disabled = true;
  next.addEventListener('click', function () {
    currentPage++;
    renderGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  nav.appendChild(next);

  grid.parentElement.appendChild(nav);
}

function renderGallery() {
  grid.innerHTML = '';

  var start      = currentPage * PAGE_SIZE;
  var pageImages = GALLERY_IMAGES.slice(start, start + PAGE_SIZE);

  if (pageImages.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'gallery-empty';
    empty.textContent = 'Photos coming soon.';
    grid.appendChild(empty);
    renderPagination();
    return;
  }

  pageImages.forEach(function (src) {
    var item = document.createElement('div');
    item.className = 'gallery-item';

    var img = document.createElement('img');
    img.src     = 'images/gallery/' + src;
    img.alt     = '';
    img.loading = 'lazy';
    img.addEventListener('load', function () { img.classList.add('loaded'); });
    if (img.complete) img.classList.add('loaded');

    item.appendChild(img);

    item.addEventListener('click', function () {
      lightboxImg.src = 'images/gallery/' + src;
      lightboxImg.alt = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    grid.appendChild(item);
  });

  renderPagination();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

renderGallery();
