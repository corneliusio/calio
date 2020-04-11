import { tick } from 'svelte';
import { context } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup, act } from '@testing-library/svelte';

afterEach(() => cleanup());

test('can set a default selection from passed value', () => {
    const epoch = new Epoch();
    const calio = render(Calio, {
        props: { value: epoch }
    });

    expect(context(calio, 'selection')).toEqual(epoch);
});

test('can set a default selection from passed array of values', () => {
    const epoch1 = new Epoch(2018, 0);
    const epoch2 = new Epoch(2017, 0);
    const calio = render(Calio, {
        props: {
            mode: 'multi',
            value: [
                epoch1,
                epoch2
            ]
        }
    });

    expect(context(calio, 'selection')).toContainEqual(epoch1);
    expect(context(calio, 'selection')).toContainEqual(epoch2);
});

test('prevents selection of dates before min', async () => {
    const epoch = new Epoch();
    const calio = render(Calio, {
        props: { min: epoch }
    });

    await act(async () => {
        calio.component.select(epoch.clone().subDay());
        await tick();
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('prevents selection of dates after max', async () => {
    const epoch = new Epoch();
    const calio = render(Calio, {
        props: { max: epoch }
    });

    await act(async () => {
        calio.component.select(epoch.clone().addDay());
        await tick();
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('prevents selection of disabled dates', async () => {
    const epoch = new Epoch();
    const calio = render(Calio, {
        props: { disabled: epoch }
    });

    await act(async () => {
        calio.component.select(epoch);
        await tick();
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('adds selected day to array in multi mode', async () => {
    const epoch1 = new Epoch(2018, 0);
    const epoch2 = new Epoch(2017, 0);
    const epoch3 = new Epoch(2016, 0);
    const calio = render(Calio, {
        props: { mode: 'multi' }
    });

    await act(async () => {
        calio.component.select(epoch1);
        calio.component.select(epoch2);
        calio.component.select(epoch3);
        await tick();
    });

    expect(context(calio, 'selection')).toContainEqual(epoch1);
    expect(context(calio, 'selection')).toContainEqual(epoch2);
    expect(context(calio, 'selection')).toContainEqual(epoch3);
});

test('toggles date selection if selected date is reselected in multi mode', async () => {
    const epoch1 = new Epoch(2018, 0);
    const epoch2 = new Epoch(2018, 0);
    const calio = render(Calio, {
        props: { mode: 'multi' }
    });

    await act(async () => {
        calio.component.select(epoch1);
        await tick();
    });

    expect(context(calio, 'selection')).toHaveLength(1);
    expect(context(calio, 'selection')).toContainEqual(epoch1);

    await act(async () => {
        calio.component.select(epoch2);
        await tick();
    });

    expect(context(calio, 'selection')).toEqual([]);
});

test('can limit number of selected dates in multi mode', async () => {
    const epoch1 = new Epoch(2018, 0, 1);
    const epoch2 = new Epoch(2018, 0, 2);
    const epoch3 = new Epoch(2018, 0, 3);
    const epoch4 = new Epoch(2018, 0, 4);
    const epoch5 = new Epoch(2018, 0, 5);
    const calio = render(Calio, {
        props: {
            mode: 'multi',
            limit: 3
        }
    });

    await act(async () => {
        calio.component.select(epoch1);
        calio.component.select(epoch2);
        calio.component.select(epoch3);
        calio.component.select(epoch4);
        calio.component.select(epoch5);
        await tick();
    });

    expect(context(calio, 'selection')).toHaveLength(3);
    expect(context(calio, 'selection')).toContainEqual(epoch1);
    expect(context(calio, 'selection')).toContainEqual(epoch2);
    expect(context(calio, 'selection')).toContainEqual(epoch3);
});

test('adds selected day to array in range mode', async () => {
    const epoch1 = new Epoch(2018, 0);
    const epoch2 = new Epoch(2017, 0);
    const calio = render(Calio, {
        props: { mode: 'range' }
    });

    await act(async () => {
        calio.component.select(epoch1);
        calio.component.select(epoch2);
        await tick();
    });

    expect(context(calio, 'selection')).toContainEqual(epoch1);
    expect(context(calio, 'selection')).toContainEqual(epoch2);
});

test('limits selection to two selected days in range mode', async () => {
    const epoch1 = new Epoch(2018, 0);
    const epoch2 = new Epoch(2017, 0);
    const epoch3 = new Epoch(2016, 0);
    const calio = render(Calio, {
        props: { mode: 'range' }
    });

    await act(async () => {
        calio.component.select(epoch1);
        calio.component.select(epoch2);
        calio.component.select(epoch3);
        await tick();
    });

    expect(context(calio, 'selection')).toHaveLength(1);
    expect(context(calio, 'selection')).toContainEqual(epoch3);
});

test('toggles date selection if selected date is reselected in range mode', async () => {
    const epoch1 = new Epoch(2018, 0);
    const epoch2 = new Epoch(2017, 0);
    const epoch3 = new Epoch(2017, 0);
    const calio = render(Calio, {
        props: { mode: 'range' }
    });

    await act(async () => {
        calio.component.select(epoch1);
        calio.component.select(epoch2);
        calio.component.select(epoch3);
        await tick();
    });

    expect(context(calio, 'selection')).toHaveLength(1);
    expect(context(calio, 'selection')).toContainEqual(epoch1);
});

test('prevents selection of date in strict range mode if range overlaps disabled date', async () => {
    const epoch1 = new Epoch(2018, 0, 1);
    const epoch2 = new Epoch(2018, 0, 20);
    const epoch3 = new Epoch(2018, 0, 10);
    const calio = render(Calio, {
        props: {
            mode: 'range',
            strict: true,
            disabled: [
                epoch3
            ]
        }
    });

    await act(async () => {
        calio.component.select(epoch1);
        await tick();
    });

    expect(context(calio, 'selection')).toContainEqual(epoch1);

    await act(async () => {
        calio.component.select(epoch2);
        await tick();
    });

    expect(context(calio, 'selection')).toContainEqual(epoch1);
});

test('delays dates being generated if non-array passed to disabled', () => {
    const toHaveGottenThisFar = true;

    render(Calio, {
        props: { disabled: null }
    });

    expect(toHaveGottenThisFar).toBe(true);
});
