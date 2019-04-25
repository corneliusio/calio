import { tick } from 'svelte';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

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

test('selects a day', async () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.select(epoch);
    await tick();

    expect(calio.state().selection).toEqual(epoch);
});

test('can go to year', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(2018, 0)
        }
    });

    calio.goToYear(2000);
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch(2000, 0));
});

test('can go to next year', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(2018, 0)
        }
    });

    calio.goToNextYear();
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch(2019, 0));
});

test('can go to last year', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(2018, 0)
        }
    });

    calio.goToLastYear();
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch(2017, 0));
});

test('can go to month', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(2018, 6)
        }
    });

    calio.goToMonth(1);
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch(2018, 0));
});

test('can go to next month', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(2018, 6)
        }
    });

    calio.goToNextMonth();
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch(2018, 7));
});

test('can go to last month', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(2018, 6)
        }
    });

    calio.goToLastMonth();
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch(2018, 5));
});

test('can go to this month', async () => {
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            value: new LilEpoch(1988, 6)
        }
    });

    calio.goToThisMonth();
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch().date(1));
});

test('can go to current selection in single mode if it exists', async () => {
    const epoch = new LilEpoch(1988, 0);
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.goToSelection();
    await tick();

    expect(calio.state().view).toEqual(new LilEpoch().date(1));

    calio.select(epoch);
    calio.goToSelection();
    await tick();

    expect(calio.state().view).toEqual(epoch);
});

test('can go to month containing valid day', async () => {
    const epoch = new LilEpoch(1988, 10, 25);
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.goTo(epoch);
    await tick();
    expect(calio.state().view).toEqual(epoch.clone().date(1));

    expect(calio.goTo(null)).toBeUndefined();
    await tick();
});
