import { query } from '../helpers';
import Day from '../../src/components/Day.svelte';
import Epoch from '../../src/modules/Epoch';
import { render, fireEvent, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

const today = new Epoch();

const props = {
    selection: null,
    view: new Epoch(),
    mode: 'single',
    disabled: [],
    min: null,
    max: null
};

test('fires a "selection" event when clicked', () => {
    const day = render(Day, {
        props: { day: today, props }
    });

    day.component.$on('selection', day => {
        expect(day).toEqual(today);
    });

    fireEvent.click(query('.calio-day'));
});
