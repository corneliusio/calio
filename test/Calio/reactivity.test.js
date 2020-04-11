import { tick } from 'svelte';
import { context } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, cleanup, act } from '@testing-library/svelte';

const today = new Epoch();

afterEach(() => cleanup());

test('updates selection if before new min', async () => {
    const min = today.clone().addMonth();
    const calio = render(Calio, { value: today });

    expect(context(calio, 'selection')).toEqual(today);

    await act(async () => {
        calio.component.setMin(min);
        await tick();
    });

    expect(context(calio, 'selection')).toEqual(min);
});

test('updates selection if after new max', async () => {
    const max = today.clone().subMonth();
    const calio = render(Calio, { value: today });

    expect(context(calio, 'selection')).toEqual(today);

    await act(async () => {
        calio.component.setMax(max);
        await tick();
    });

    expect(context(calio, 'selection')).toEqual(max);
});

test('invalidates selection if equal to new disabled', async () => {
    const disabled = today.clone();
    const calio = render(Calio, { value: today });

    expect(context(calio, 'selection')).toEqual(today);

    await act(async () => {
        calio.component.setDisabled(disabled);
        await tick();
    });

    expect(context(calio, 'selection')).toBeNull();
});
