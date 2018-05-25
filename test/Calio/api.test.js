import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('updates selection when value is updated', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { value: epoch.clone().addYear() }
    });

    calio.set({ value: epoch });

    expect(calio.get().selection).toEqual(epoch);
});

test('normalizes a date', () => {
    const epoch = new LilEpoch(2018, 0, 1);
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    let date1 = calio.makeMyDay(epoch),
        date2 = calio.makeMyDay([2018, 0, 1]),
        date3 = calio.makeMyDay('2018-01-01'),
        date4 = calio.makeMyDay();

    expect(date1).toEqual(epoch);
    expect(date2).toEqual(epoch);
    expect(date3).toEqual(epoch);
    expect(date4).toBeNull();
});

test('selects a day', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.select(epoch);

    expect(calio.get().selection).toEqual(epoch);
});

test('can go to year', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(2018, 0)
        }
    });

    calio.goToYear(2000);

    expect(calio.get().view).toEqual(new LilEpoch(2000, 0));
});

test('can go to next year', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(2018, 0)
        }
    });

    calio.goToNextYear();

    expect(calio.get().view).toEqual(new LilEpoch(2019, 0));
});

test('can go to last year', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(2018, 0)
        }
    });

    calio.goToLastYear();

    expect(calio.get().view).toEqual(new LilEpoch(2017, 0));
});

test('can go to month', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(2018, 6)
        }
    });

    calio.goToMonth(1);

    expect(calio.get().view).toEqual(new LilEpoch(2018, 0));
});

test('can go to next month', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(2018, 6)
        }
    });

    calio.goToNextMonth();

    expect(calio.get().view).toEqual(new LilEpoch(2018, 7));
});

test('can go to last month', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(2018, 6)
        }
    });

    calio.goToLastMonth();

    expect(calio.get().view).toEqual(new LilEpoch(2018, 5));
});

test('can go to this month', () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            value: new LilEpoch(1988, 6)
        }
    });

    calio.goToThisMonth();

    expect(calio.get().view).toEqual(new LilEpoch().date(1));
});

test('can go to current selection in single mode if it exists', () => {
    const epoch = new LilEpoch(1988, 0);
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.goToSelection();
    expect(calio.get().view).toEqual(new LilEpoch().date(1));

    calio.select(epoch);
    calio.goToSelection();
    expect(calio.get().view).toEqual(epoch);
});

test('can go to month containing valid day', () => {
    const epoch = new LilEpoch(1988, 10, 25);
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.goTo(epoch);
    expect(calio.get().view).toEqual(epoch.clone().date(1));

    expect(calio.goTo(null)).toBeUndefined();
});
