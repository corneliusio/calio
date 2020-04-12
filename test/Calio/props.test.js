import { queryAll, map } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

test('has specific props', () => {
    const calio = render(Calio);

    expect(Object.keys(calio.component.$$.props)).toEqual([
        'value',
        'headers',
        'mode',
        'strict',
        'disabled',
        'limit',
        'min',
        'max',
        'select',
        'makeMyDay',
        'setMin',
        'setMax',
        'setDisabled',
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

test('has head for each day of week', () => {
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

test('has dates', () => {
    const epoch = new Epoch();

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
