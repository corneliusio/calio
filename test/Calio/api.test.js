import { context } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup, act } from '@testing-library/svelte';

afterEach(() => cleanup());

test('normalizes a date', () => {
    const epoch = new Epoch(2018, 0, 1);
    const calio = render(Calio);

    let date1 = calio.component.makeMyDay(epoch),
        date2 = calio.component.makeMyDay([ 2018, 0, 1 ]),
        date3 = calio.component.makeMyDay('2018-01-01'),
        date4 = calio.component.makeMyDay();

    expect(date1).toEqual(epoch);
    expect(date2).toEqual(epoch);
    expect(date3).toEqual(epoch);
    expect(date4).toBeNull();
});

test('selects a day', async () => {
    const epoch = new Epoch();
    const calio = render(Calio);

    await act(() => {
        calio.component.select(epoch);
    });

    expect(context(calio, 'selection')).toEqual(epoch);
});

test('can set min', async () => {
    const epoch = new Epoch(2018, 0, 1);
    const calio = render(Calio);

    await act(() => {
        calio.component.setMin(epoch);
    });

    expect(context(calio, 'computed').min).toEqual(epoch);
});

test('can set max', async () => {
    const epoch = new Epoch(2018, 0, 1);
    const calio = render(Calio);

    await act(() => {
        calio.component.setMax(epoch);
    });

    expect(context(calio, 'computed').max).toEqual(epoch);
});

test('can set disabled', async () => {
    const epoch = new Epoch(2018, 0, 1);
    const calio = render(Calio);

    await act(() => {
        calio.component.setDisabled(epoch);
    });

    expect(context(calio, 'computed').disabled).toContainEqual(epoch);
});

test('can go to year', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(2018, 0)
        }
    });

    await act(() => {
        calio.component.goToYear(2000);
    });

    expect(context(calio, 'view')).toEqual(new Epoch(2000, 0));
});

test('can go to next year', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(2018, 0)
        }
    });

    await act(() => {
        calio.component.goToNextYear();
    });

    expect(context(calio, 'view')).toEqual(new Epoch(2019, 0));
});

test('can go to last year', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(2018, 0)
        }
    });

    await act(() => {
        calio.component.goToLastYear();
    });

    expect(context(calio, 'view')).toEqual(new Epoch(2017, 0));
});

test('can go to month', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(2018, 6)
        }
    });

    await act(() => {
        calio.component.goToMonth(1);
    });

    expect(context(calio, 'view')).toEqual(new Epoch(2018, 0));
});

test('can go to next month', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(2018, 6)
        }
    });

    await act(() => {
        calio.component.goToNextMonth();
    });

    expect(context(calio, 'view')).toEqual(new Epoch(2018, 7));
});

test('can go to last month', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(2018, 6)
        }
    });

    await act(() => {
        calio.component.goToLastMonth();
    });

    expect(context(calio, 'view')).toEqual(new Epoch(2018, 5));
});

test('can go to this month', async () => {
    const calio = render(Calio, {
        props: {
            value: new Epoch(1988, 6)
        }
    });

    await act(() => {
        calio.component.goToThisMonth();
    });

    expect(context(calio, 'view')).toEqual(new Epoch().date(1));
});

test('can go to current selection in single mode if it exists', async () => {
    const epoch = new Epoch(1988, 0);
    const calio = render(Calio, {
        props: {
            value: new Epoch()
        }
    });

    await act(() => {
        calio.component.goToSelection();
    });

    expect(context(calio, 'view')).toEqual(new Epoch().date(1));

    await act(() => {
        calio.component.select(epoch);
        calio.component.goToSelection();
    });

    expect(context(calio, 'view')).toEqual(epoch);
});

test('can go to month containing valid day', async () => {
    const epoch = new Epoch(1988, 10, 25);
    const calio = render(Calio);

    await act(() => {
        calio.component.goTo(epoch);
    });

    expect(context(calio, 'view')).toEqual(epoch.clone().date(1));

    await act(() => {
        calio.component.goTo(null);
    });

    expect(context(calio, 'view')).toEqual(epoch.clone().date(1));
});
