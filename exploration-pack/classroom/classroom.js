import { openSendQR } from '/learning-tools/send-qr.js';

const links = [...document.querySelectorAll('.lesson-picker a')];
const lessons = [...document.querySelectorAll('.lesson')];
const status = document.getElementById('class-status');

let selected = lessons[0];

function showLesson(link, focus) {
  selected = document.getElementById(link.hash.slice(1));
  for (const lesson of lessons) lesson.hidden = lesson !== selected;
  for (const choice of links) {
    if (choice === link) choice.setAttribute('aria-current', 'location');
    else choice.removeAttribute('aria-current');
  }
  if (focus) {
    selected.querySelector('h2').focus({ preventScroll: true });
    selected.scrollIntoView();
  }
}

function updateLocation(focus) {
  const link = links.find(choice => choice.hash === location.hash);
  if (link) showLesson(link, focus);
  else if (!location.hash) showLesson(links[0], false);
}

showLesson(links.find(choice => choice.hash === location.hash) || links[0], false);
if (links.some(choice => choice.hash === location.hash)) {
  requestAnimationFrame(() => selected.scrollIntoView());
}
window.addEventListener('hashchange', () => updateLocation(true));

for (const lesson of lessons) {
  lesson.querySelector('.lesson-actions').hidden = false;
  lesson.querySelector('[data-print]').addEventListener('click', () => window.print());
  const qr = lesson.querySelector('[data-qr]');
  qr.addEventListener('click', async () => {
    qr.disabled = true;
    const address = new URL(location.pathname, location.origin);
    address.hash = lesson.id;
    const url = address.href;
    const title = lesson.querySelector('h2').textContent;
    try {
      await openSendQR({ url, shortUrl: url, title, notify: message => { status.textContent = message; } });
    } finally {
      qr.disabled = false;
    }
  });
}
