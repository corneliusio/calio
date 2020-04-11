import { context, queryAll, map } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

test('it has state accessible through state', () => {
    const calio = render(Calio);

    expect(Object.keys(calio.component.$$.props)).toEqual([
        'headers',
        'mode',
        'strict',
        'disabled',
        'value',
        'limit',
        'min',
        'max',
        'select',
        'makeMyDay',
        'goToYear',
        'goToNextYear',
        'goToLastYear',
        'goToMonth',
        'goToNextMonth',
        'goToLastMonth',
        'goToThisMonth',
        'goToSelection',
        'goTo'
    ]);
});

test('it has head for each day of week', () => {
    const targetA = document.createElement('div');
    const targetB = document.createElement('div');
    const targetC = document.createElement('div');

    render(Calio, {
        target: targetA
    });

    render(Calio, {
        target: targetB,
        props: { headers: [ false, 'a', 'b', 'c', false ] }
    });

    render(Calio, {
        target: targetC,
        props: { headers: false }
    });

    expect(map(targetA.querySelectorAll('.calio-head'), h => h.textContent))
        .toEqual([ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ]);
    expect(map(targetB.querySelectorAll('.calio-head'), h => h.textContent))
        .toEqual([ '', 'a', 'b', 'c', '', '', '' ]);
    expect(map(targetC.querySelectorAll('.calio-head'), h => h.textContent))
        .toEqual([]);
});

test('it has dates', () => {
    const epoch = new LilEpoch();

    render(Calio);

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

    expect(map(queryAll('.calio-day'), e => parseInt(e.textContent)))
        .toEqual(dates.map(d => d.date()));
});
