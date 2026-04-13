document.addEventListener('DOMContentLoaded', function () {
  // ─────────────────────────────────────────────
  // SITE-WIDE COMPONENTS  –  nav + footer
  // Edit here to update every page at once.
  // ─────────────────────────────────────────────

  var INSTAGRAM_URL = 'https://www.instagram.com/deeptalkscanggu/';
  var MAPS_URL      = 'https://maps.app.goo.gl/g7SFhJDFu26mUhKx5';
  var FACEBOOK_URL  = 'https://www.facebook.com/share/17qoDQmfqJ/';
  var NOMEO_URL     = 'https://nomeo.io/@awanconnection';

  // ── Icons ──────────────────────────────────
  var IC = {
    about:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
    format:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>',
    gallery:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>',
  };

  // ── Nav items ──────────────────────────────
  var NAV_ITEMS = [
    { label: 'About',    href: 'about.html',    icon: IC.about },
    { label: 'Calendar', href: 'calendar.html', icon: IC.calendar },
    { label: 'Format',   href: 'format.html',   icon: IC.format },
    { label: 'Gallery',  href: 'gallery.html',  icon: IC.gallery },
  ];

  // ── Active-page detection ──────────────────
  var page = (window.location.pathname.split('/').pop() || 'index.html');

  // ── Build & inject nav ─────────────────────
  var navRoot = document.getElementById('nav-root');
  if (navRoot) {
    var items = NAV_ITEMS.map(function (item) {
      var active = (page === item.href) ? ' class="nav-active"' : '';
      return '<li><a href="' + item.href + '"' + active + '>' + item.icon + item.label + '</a></li>';
    }).join('\n      ');

    navRoot.innerHTML =
      '<a class="nav-brand" href="index.html">' +
        '<img class="header-logo" src="images/deeptalks-logo.webp" alt="Deep Talks logo" />' +
        ' Deep Talks' +
      '</a>' +
      '<input type="checkbox" id="nav-toggle" class="nav-toggle" />' +
      '<label for="nav-toggle" class="hamburger"><span></span><span></span><span></span></label>' +
      '<ul class="nav-links">\n      ' + items + '\n    </ul>';
  }

  // ── Build & inject footer ──────────────────
  var footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.innerHTML =
      '<div class="footer-info">' +
        '<div>Location: <a href="' + MAPS_URL + '" target="_blank" rel="noopener">Awan Connection</a></div>' +
        '<div>Time: Every Tuesday at 18:30</div>' +
      '</div>' +
      '<div class="footer-icons">' +
        '<a class="footer-icon-link" href="' + INSTAGRAM_URL + '" target="_blank" rel="noopener" title="Instagram">' +
          IC.instagram +
        '</a>' +
        '<a class="footer-icon-link footer-icon-fb" href="' + FACEBOOK_URL + '" target="_blank" rel="noopener" title="Facebook">' +
          IC.facebook +
        '</a>' +
        '<a class="footer-icon-link" href="' + NOMEO_URL + '" target="_blank" rel="noopener" title="Nomeo">' +
          '<span class="footer-icon-nomeo" aria-label="Nomeo"></span>' +
        '</a>' +
      '</div>';
  }
});
