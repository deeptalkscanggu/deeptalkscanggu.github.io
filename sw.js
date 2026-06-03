var CACHE = 'deep-talks-v4';

var PRECACHE = [
  './',
  './index.html',
  './about.html',
  './calendar.html',
  './format.html',
  './gallery.html',
  './nalar-submissions.html',
  './nalar-topics.html',
  './randomiser.html',
  './style.css',
  './manifest.json',
  './js/components.js',
  './js/links.js',
  './js/carousel.js',
  './js/calendar.js',
  './js/format-randomizer.js',
  './js/gallery.js',
  './js/nalar-submissions.js',
  './js/randomiser.js',
  './images/favicon.webp',
  './images/deeptalks-logo.webp',
  './images/deeptalks-green.webp',
  './images/nalar-logo.webp',
  './images/nomeo.svg',
  './images/icon-192.png',
  './images/icon-512.png',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  // Only handle GET requests for same-origin or pre-cached cross-origin
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  // Pass Google Fonts through without caching
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      var networkFetch = fetch(e.request).then(function (response) {
        if (response && response.status === 200 && response.type !== 'opaque') {
          var clone = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put(e.request, clone); });
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});
