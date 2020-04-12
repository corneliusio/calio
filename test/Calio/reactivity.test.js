import { context } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup, act } from '@testing-library/svelte';

const today = new Epoch();

afterEach(() => cleanup());

test('updates single selection min to if before new min', async () => {
    const min = today.clone().addDay();
    const calio = render(Calio, { value: today });

    expect(context(calio, 'selection')).toEqual(today);

    await act(() => {
        calio.component.setMin(min);
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('partially invalidates selection if before new min', async () => {
    const min = today.clone().addDay();
    const calio = render(Calio, {
        mode: 'multi',
        value: [
            today,
            today.clone().addDay(2)
        ]
    });

    expect(context(calio, 'selection')).toEqual([
        today,
        today.clone().addDay(2)
    ]);

    await act(() => {
        calio.component.setMin(min);
    });

    expect(context(calio, 'selection')).toEqual([
        today.clone().addDay(2)
    ]);
});

test('updates single selection max to if after new max', async () => {
    const max = today.clone().subDay();
    const calio = render(Calio, { value: today });

    expect(context(calio, 'selection')).toEqual(today);

    await act(() => {
        calio.component.setMax(max);
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('partially invalidates selection if after new max', async () => {
    const max = today.clone().subDay();
    const calio = render(Calio, {
        mode: 'multi',
        value: [
            today,
            today.clone().subDay(2)
        ]
    });

    expect(context(calio, 'selection')).toEqual([
        today.clone().subDay(2),
        today
    ]);

    await act(() => {
        calio.component.setMax(max);
    });

    expect(context(calio, 'selection')).toEqual([
        today.clone().subDay(2)
    ]);
});

test('invalidates selection if equal to new disabled', async () => {
    const calio1 = render(Calio, {
        value: today
    });

    const calio2 = render(Calio, {
        mode: 'range',
        value: today
    });

    const calio3 = render(Calio, {
        mode: 'multi',
        value: [ today, today.clone().addDay() ]
    });

    expect(context(calio1, 'selection')).toEqual(today);
    expect(context(calio2, 'selection')).toEqual([ today ]);
    expect(context(calio3, 'selection')).toEqual([ today, today.clone().addDay() ]);

    await act(() => {
        calio1.component.setDisabled(today.clone());
    });

    await act(() => {
        calio2.component.setDisabled(today.clone());
    });

    await act(() => {
        calio3.component.setDisabled(today.clone());
    });

    expect(context(calio1, 'selection')).toBeNull();
    expect(context(calio2, 'selection')).toBeNull();
    expect(context(calio3, 'selection')).toEqual([ today.clone().addDay() ]);
});
