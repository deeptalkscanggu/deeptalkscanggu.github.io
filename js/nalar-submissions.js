document.addEventListener('DOMContentLoaded', function () {
  var checkbox = document.getElementById('confirm-read');
  var btn      = document.getElementById('submit-btn');
  if (!checkbox || !btn) return;
  checkbox.addEventListener('change', function () {
    btn.classList.toggle('active', checkbox.checked);
  });
});
