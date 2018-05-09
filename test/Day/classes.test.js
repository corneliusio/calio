import Day from '../../src/components/Day.svlt';
import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = `
    <div id="calio"></div>
    <span id="day"></span>
`;

const today = new LilEpoch();
const past = today.clone().subYear();
const future = today.clone().addYear();

const calio = new Calio({
    target: document.querySelector('#calio')
});

test('adds "is-today" class if is today', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today,
            props: calio.get().props
        }
    });

    expect(day.get().classes).toBe('is-today');

    day.set({
        day: today.clone().addDay()
    });

    expect(day.get().classes).toBe('');
});

test('adds "is-prev" class if is before viewed month', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today.clone().subMonth(),
            props: calio.get().props
        }
    });

    expect(day.get().classes).toBe('is-prev');
});

test('adds "is-next" class if is after viewed month', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today.clone().addMonth(),
            props: calio.get().props
        }
    });

    expect(day.get().classes).toBe('is-next');
});

test('adds "is-disabled" class if is disabled', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today.clone().addDay(),
            props: {
                ...calio.get().props,
                disabled: [today.clone().addDay()]
            }
        }
    });

    expect(day.get().classes).toBe('is-disabled');
});

test('adds "is-ranged" class if is within range', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today.clone().addDay(),
            props: {
                ...calio.get().props,
                mode: 'range',
                selection: [past, future]
            }
        }
    });

    expect(day.get().classes).toBe('is-ranged');
});

test('adds "is-active" class if is selected', () => {
    const day = new Day({
        target: document.querySelector('#day'),
        data: {
            day: today.clone().addDay(),
            props: {
                ...calio.get().props,
                selection: today.clone().addDay()
            }
        }
    });

    expect(day.get().classes).toBe('is-active');
});
