import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('it has state accessible through state', () => {
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    expect(Object.keys(calio.state())).toEqual([
        'min',
        'max',
        'headers',
        'disabled',
        'dates',
        'view',
        'mode',
        'strict',
        'selection',
        'limit',
        'el'
    ]);
});

test('it has head for each day of week', () => {
    const calio1 = new Calio({
        target: document.querySelector('#calio')
    });

    const calio2 = new Calio({
        target: document.querySelector('#calio'),
        props: { headers: [false, 'a', 'b', 'c', false] }
    });

    const calio3 = new Calio({
        target: document.querySelector('#calio'),
        props: { headers: false }
    });

    expect(calio1.state().headers).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    expect(calio2.state().headers).toEqual(['', 'a', 'b', 'c', '', '', '']);
    expect(calio3.state().headers).toEqual([]);
});

test('it has dates', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    let current = epoch.clone().startOfMonth(),
        dates = [],
        dayOfFirst,
        dayOfLast;

    dayOfFirst = current.dayOfWeek();

    for (let i = 0; i < dayOfFirst; i++) {
        dates.unshift(current.clone().date(-i));
    }

    current.endOfMonth();

    for (let i = 1, days = current.date(); i <= days; i++) {
        dates.push(current.clone().date(i));
    }

    dayOfLast = current.dayOfWeek();
    current.startOfMonth().addMonth();

    for (let i = 1; i < (7 - dayOfLast); i++) {
        dates.push(current.clone().date(i));
    }

    expect(calio.state().dates).toEqual(dates);
});
