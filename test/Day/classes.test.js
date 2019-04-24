import Day from '../../src/components/Day.svelte';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = `
    <div id="calio"></div>
    <span id="day"></span>
`;

const today = new LilEpoch();
const past = today.clone().subYear();
const future = today.clone().addYear();

const calio = new Calio({ target: document.querySelector('#calio') });
const { props } = calio.state();

test('adds "is-today" class if is today', () => {
    const day1 = new Day({
        target: document.querySelector('#day'),
        props: { ...props, day: today }
    });
    const day2 = new Day({
        target: document.querySelector('#day'),
        props: { ...props, day: today.clone().addDay() }
    });

    expect(day1.state().classes).toBe('is-today');
    expect(day2.state().classes).toBe('');
});

test('adds "is-prev" class if is before viewed month', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        props: { ...props, day: past }
    });

    expect(day.state().classes).toBe('is-prev');
});

test('adds "is-next" class if is after viewed month', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        props: { ...props, day: future }
    });

    expect(day.state().classes).toBe('is-next');
});

test('adds "is-disabled" class if is disabled', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        props: {
            ...props,
            day: today.clone().addDay(),
            disabled: [today.clone().addDay()]
        }
    });

    expect(day.state().classes).toBe('is-disabled');
});

test('adds "is-ranged" class if is within range', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        props: {
            ...props,
            day: today.clone().addDay(),
            mode: 'range',
            selection: [past, future]
        }
    });

    expect(day.state().classes).toBe('is-ranged');
});

test('adds "is-active" class if is selected', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        props: {
            ...props,
            day: today.clone().addDay(),
            selection: today.clone().addDay()
        }
    });

    expect(day.state().classes).toBe('is-active');
});
