import { context } from '../helpers';
import LilEpoch from '../../src/modules/LilEpoch';
import Calio from '../../src/components/Calio.svelte';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

const calio = render(Calio);

test('defaults headers to two char days', () => {
    expect(context(calio, 'headers')).toEqual([
        'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
    ]);
});

test('defaults view to 1st of this month', () => {
    const epoch = new LilEpoch();

    epoch.date(1);

    expect(context(calio, 'view')).toEqual(epoch);
});

test('defaults mode to single', () => {
    expect(context(calio, 'mode')).toBe('single');
});

test('defaults strict to false', () => {
    expect(context(calio, 'strict')).toBe(false);
});

test('defaults disabled to empty array', () => {
    expect(context(calio, 'disabled')).toEqual([]);
});

test('defaults selection to null', () => {
    expect(context(calio, 'selection')).toBeNull();
});

test('defaults limit to null', () => {
    expect(context(calio, 'limit')).toBeNull();
});

test('defaults min to null', () => {
    expect(context(calio, 'min')).toBeNull();
});

test('defaults max to null', () => {
    expect(context(calio, 'max')).toBeNull();
});
