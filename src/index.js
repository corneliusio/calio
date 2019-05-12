import Calio from 'calio/polyfilled';

import './index.css';
const calio = new Calio('#calio');
const current = document.querySelector('.current');
const selected = document.querySelector('.selected');

calio.$on('view', ({ detail: view }) => {
    current.textContent = view.format('mmmm yyyy');
});

calio.$on('selection', ({ detail: selection }) => {
    if (Array.isArray(selection)) {
        let markup = selection.map(s => s.format('mediumDate')).join(' ✨<br>✨ ');

        selected.innerHTML = `✨ ${markup} ✨`;
    } else {
        selected.textContent = `✨ ${selection.format('mediumDate')} ✨`;
    }
});

current.addEventListener('click', event => calio.goToToday());
selected.addEventListener('click', event => calio.goToSelection());

document.querySelector('.prev').addEventListener('click', event => calio.goToLastMonth());
document.querySelector('.next').addEventListener('click', event => calio.goToNextMonth());

document.querySelector('.toggle-ui').addEventListener('click', event => {
    document.body.classList.toggle('hide-ui');
});
