import { tick } from 'svelte';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

const calio = new Calio({
    target: document.querySelector('#calio')
});

test('defaults headers to two char days', () => {
    expect(calio.$$.ctx.headers).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
});

test('defaults view to 1st of this month', () => {
    const epoch = new LilEpoch();

    epoch.date(1);

    expect(calio.$$.ctx.view).toEqual(epoch);
});

test('defaults mode to single', () => {
    expect(calio.$$.ctx.mode).toBe('single');
});

test('defaults strict to false', () => {
    expect(calio.$$.ctx.strict).toBe(false);
});

test('defaults strict to false', () => {
    expect(calio.$$.ctx.strict).toBe(false);
});

test('defaults disabled to empty array', () => {
    expect(calio.$$.ctx.disabled).toEqual([]);
});

test('defaults selection to null', () => {
    expect(calio.$$.ctx.selection).toBeNull();
});

test('defaults limit to null', () => {
    expect(calio.$$.ctx.limit).toBeNull();
});

test('defaults min to null', () => {
    expect(calio.$$.ctx.min).toBeNull();
});

test('defaults max to null', () => {
    expect(calio.$$.ctx.max).toBeNull();
});
