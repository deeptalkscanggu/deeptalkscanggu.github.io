var WA_GROUPS = {
  deeptalks:  'https://chat.whatsapp.com/Gz3tE224rx66BuLqPn1vZv',
  lovetalks:  'https://chat.whatsapp.com/Gz3tE224rx66BuLqPn1vZv',
  nalar:      'https://chat.whatsapp.com/J58fpgS46JiBZocS6NkYZw',
  deepcrafts: 'https://chat.whatsapp.com/Gz3tE224rx66BuLqPn1vZv',
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-wa-group]').forEach(function (el) {
    var key = el.getAttribute('data-wa-group');
    var url = WA_GROUPS[key];
    if (!url) return;

    if (el.tagName === 'A') {
      el.href = url;
    } else if (el.tagName === 'IMG') {
      el.src =
        'https://api.qrserver.com/v1/create-qr-code/?size=90x90' +
        '&data=' + encodeURIComponent(url) +
        '&color=1b3a2d&bgcolor=ffffff';
    }
  });
});
