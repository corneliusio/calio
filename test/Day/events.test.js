import Day from '../../src/components/Day.svelte';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = `
    <div id="calio"></div>
    <span id="day"></span>
`;

const today = new LilEpoch();
const calio = new Calio({
    target: document.querySelector('#calio')
});

test('it fires a "selection" event when clicked', () => {
    const { props } = calio.state();
    const day = new Day({
        target: document.querySelector('#day'),
        props: { ...props, day: today }
    });

    const el = document.querySelector('#day .calio-day');

    day.$on('selection', day => {
        expect(day).toEqual(today);
    });

    el.dispatchEvent(new MouseEvent('click'));
});
