import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('it has props to pass to Day', () => {
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    const { props, selection, mode, view, disabled, min, max } = calio.get();

    expect(props).toEqual({
        selection,
        mode,
        view,
        disabled,
        min,
        max
    });
});

test('it has head for each day of week', () => {
    const calio1 = new Calio({
        target: document.querySelector('#calio')
    });

    const calio2 = new Calio({
        target: document.querySelector('#calio'),
        data: { headers: [false, 'a', 'b', 'c', false] }
    });

    const calio3 = new Calio({
        target: document.querySelector('#calio'),
        data: { headers: false }
    });

    expect(calio1.get().head).toEqual(calio1.get().headers);
    expect(calio2.get().head).toEqual(['', 'a', 'b', 'c', '', '', '']);
    expect(calio3.get().head).toEqual([]);
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

    expect(calio.get().dates).toEqual(dates);
});
