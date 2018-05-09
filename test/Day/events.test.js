import Day from '../../src/components/Day.svlt';
import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = `
    <div id="calio"></div>
    <span id="day"></span>
`;

const today = new LilEpoch();

const calio = new Calio({
    target: document.querySelector('#calio')
});

test('it fires a select event when clicked', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today,
            props: calio.get().props
        }
    });

    const el = document.querySelector('#day .calio-day');

    expect.assertions(2);

    day.on('select', day => {
        expect(day).toEqual(today);
    });

    el.addEventListener('click', event => {
        expect(event instanceof MouseEvent).toBe(true);
    });

    el.dispatchEvent(new MouseEvent('click'));
});
