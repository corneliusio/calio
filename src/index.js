import Calio from 'calio/polyfilled';

import './index.css';

const current = document.querySelector('.current');
const selected = document.querySelector('.selected');
const modes = document.querySelectorAll('[data-mode]');

let calio;

init(new Calio('#calio'));

document.querySelector('.toggle-ui').addEventListener('click', event => {
    document.body.classList.toggle('hide-ui');
});

modes.forEach(el => {
    el.addEventListener('click', event => {
        modes.forEach(m => m.classList.remove('is-active'));
        el.classList.add('is-active');
        selected.innerHTML = '';
        init(new Calio('#calio', {
            mode: event.target.dataset.mode,
            limit: 7
        }));
    });
});

function init(instance) {
    if (calio) {
        calio.$destroy();
    }

    calio = instance;

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
}
