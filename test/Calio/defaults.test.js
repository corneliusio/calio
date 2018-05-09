import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

const calio = new Calio({
    target: document.querySelector('#calio')
});

const defaults = calio.get();

test('defaults headers to two char days', () => {
    expect(defaults.headers).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
});

test('defaults view to 1st of this month', () => {
    const epoch = new LilEpoch();

    epoch.date(1);

    expect(defaults.view).toEqual(epoch);
});

test('defaults mode to single', () => {
    expect(defaults.mode).toBe('single');
});

test('defaults strict to false', () => {
    expect(defaults.strict).toBe(false);
});

test('defaults strict to false', () => {
    expect(defaults.strict).toBe(false);
});

test('defaults disabled to empty array', () => {
    expect(defaults.disabled).toEqual([]);
});

test('defaults selection to null', () => {
    expect(defaults.selection).toBeNull();
});

test('defaults value to null', () => {
    expect(defaults.value).toBeNull();
});

test('defaults limit to null', () => {
    expect(defaults.limit).toBeNull();
});

test('defaults min to null', () => {
    expect(defaults.min).toBeNull();
});

test('defaults max to null', () => {
    expect(defaults.max).toBeNull();
});
