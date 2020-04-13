import { context } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup, act } from '@testing-library/svelte';

const today = new Epoch();

afterEach(() => cleanup());

test('updates single selection to min if before new min', async () => {
    const min = today.clone().addMonth();
    const calio = render(Calio, { value: today });

    await act(() => {
        calio.component.setMin(min);
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('invalidates any selected dates before new min', async () => {
    const min = today.clone().addMonth();
    const calio1 = render(Calio, {
        mode: 'multi',
        value: [
            today,
            today.clone().addMonth(2)
        ]
    });

    const calio2 = render(Calio, {
        mode: 'multi',
        value: [
            today,
            today.clone().addDay(2)
        ]
    });

    await act(() => {
        calio1.component.setMin(min);
        calio2.component.setMin(min);
    });

    expect(context(calio1, 'selection')).toEqual([
        today.clone().addMonth(2)
    ]);

    expect(context(calio2, 'selection')).toBeNull();
});

test('updates single selection to max if before new max', async () => {
    const max = today.clone().subMonth();
    const calio = render(Calio, { value: today });

    await act(() => {
        calio.component.setMax(max);
    });

    expect(context(calio, 'selection')).toBeNull();
});

test('invalidates any selected date after new max', async () => {
    const max = today.clone().subMonth();
    const calio1 = render(Calio, {
        mode: 'multi',
        value: [
            today,
            today.clone().subMonth(2)
        ]
    });

    const calio2 = render(Calio, {
        mode: 'multi',
        value: [
            today,
            today.clone().subDay(2)
        ]
    });

    await act(() => {
        calio1.component.setMax(max);
        calio2.component.setMax(max);
    });

    expect(context(calio1, 'selection')).toEqual([
        today.clone().subMonth(2)
    ]);

    expect(context(calio2, 'selection')).toBeNull();
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
        value: [ today, today.clone().addMonth() ]
    });

    expect(context(calio1, 'selection')).toEqual(today);
    expect(context(calio2, 'selection')).toEqual([ today ]);
    expect(context(calio3, 'selection')).toEqual([ today, today.clone().addMonth() ]);

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
    expect(context(calio3, 'selection')).toEqual([ today.clone().addMonth() ]);
});
