import { context } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup, act } from '@testing-library/svelte';

afterEach(() => cleanup());

test('normalizes a date', () => {
    const epoch = new Epoch(1988, 10, 25);
    const calio = render(Calio);

    const date1 = calio.component.makeMyDay(epoch);
    const date2 = calio.component.makeMyDay('1988-11-25');
    const date3 = calio.component.makeMyDay(1988, 10, 25);
    const date4 = calio.component.makeMyDay([ 1988, 10, 25 ]);
    const date5 = calio.component.makeMyDay(new Date(1988, 10, 25, 0, 0, 7, 7));
    const date6 = calio.component.makeMyDay([ null ]);
    const date7 = calio.component.makeMyDay();

    expect(date1).toEqual(epoch);
    expect(date2).toEqual(epoch);
    expect(date3).toEqual(epoch);
    expect(date4).toEqual(epoch);
    expect(date5).toEqual(epoch);
    expect(date6).toBeNull();
    expect(date7).toBeNull();
});

test('selects a day', async () => {
    const epoch = new Epoch();
    const calio1 = render(Calio);
    const calio2 = render(Calio);

    await act(() => {
        calio1.component.select(epoch);
        calio2.component.select();
    });

    expect(context(calio1, 'selection')).toEqual(epoch);
    expect(context(calio2, 'selection')).toBeNull();
});

test('deselects a selected day', async () => {
    const epoch = new Epoch();
    const calio1 = render(Calio, {
        value: epoch
    });
    const calio2 = render(Calio, {
        value: epoch
    });

    await act(() => {
        calio1.component.select(epoch);
        calio2.component.select();
    });

    expect(context(calio1, 'selection')).toBeNull();
    expect(context(calio2, 'selection')).toBeNull();
});

test('can set min', async () => {
    const epoch = new Epoch(2018, 0, 1);
    const calio1 = render(Calio);
    const calio2 = render(Calio);

    await act(() => {
        calio1.component.setMin(epoch);
        calio2.component.setMin();
    });

    expect(context(calio1, 'computed').min).toEqual(epoch);
    expect(context(calio2, 'computed').min).toBeNull();
});

test('can set max', async () => {
    const epoch = new Epoch(2018, 0, 1);
    const calio1 = render(Calio);
    const calio2 = render(Calio);

    await act(() => {
        calio1.component.setMax(epoch);
        calio2.component.setMax();
    });

    expect(context(calio1, 'computed').max).toEqual(epoch);
    expect(context(calio2, 'computed').max).toBeNull();
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

    await act(async () => {
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
