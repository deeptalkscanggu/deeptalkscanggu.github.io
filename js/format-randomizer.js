document.addEventListener('DOMContentLoaded', function () {
  var PROMPTS = [
    { name: 'Reductio ad Absurdum',    text: 'If we accept this as an absolute rule, what is the most absurd or extreme situation it would still have to apply to?' },
    { name: 'Utility vs. Truth Pivot', text: 'Is this actually true — or is it just a useful story we tell ourselves to keep things functioning?' },
    { name: 'The Boundary Marker',     text: "At what exact threshold does the concept you're describing cease to be itself? Where is the line between 'enough' and 'too much'?" },
    { name: 'The Hidden Dependency',   text: 'What else must be true for your statement to hold weight? If we removed that assumption, would the argument collapse?' },
    { name: 'The Counter-Perspective', text: 'If someone had lived the exact opposite life to yours, why might they find your conclusion impossible to accept?' },
    { name: 'The Logic Mirror',        text: 'You hold this position for a certain reason. Would you apply that exact same logic to a completely different category of thing?' },
    { name: 'Terminology Audit',       text: 'Can you make your point again — without using the key word you just used, or any of its synonyms?' }
  ];

  var last    = -1;
  var btn     = document.getElementById('dice-btn');
  var display = document.getElementById('prompt-display');
  var nameEl  = document.getElementById('prompt-name');

  if (!btn) return;

  btn.addEventListener('click', function () {
    if (btn.classList.contains('rolling')) return;
    btn.classList.add('rolling');
    display.classList.add('fading');

    setTimeout(function () {
      var idx;
      do { idx = Math.floor(Math.random() * PROMPTS.length); } while (idx === last && PROMPTS.length > 1);
      last = idx;
      var p = PROMPTS[idx];
      display.textContent = p.text;
      nameEl.textContent  = p.name;
      display.classList.remove('fading');
    }, 240);

    setTimeout(function () {
      btn.classList.remove('rolling');
    }, 580);
  });
});
