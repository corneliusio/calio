import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

const calio = new Calio({
    target: document.querySelector('#calio')
});

test('defaults headers to two char days', () => {
    expect(calio.headers).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
});

test('defaults view to 1st of this month', () => {
    const epoch = new LilEpoch();

    epoch.date(1);

    expect(calio.view).toEqual(epoch);
});

test('defaults mode to single', () => {
    expect(calio.mode).toBe('single');
});

test('defaults strict to false', () => {
    expect(calio.strict).toBe(false);
});

test('defaults strict to false', () => {
    expect(calio.strict).toBe(false);
});

test('defaults disabled to empty array', () => {
    expect(calio.disabled).toEqual([]);
});

test('defaults selection to null', () => {
    expect(calio.selection).toBeNull();
});

test('defaults value to null', () => {
    expect(calio.value).toBeNull();
});

test('defaults limit to null', () => {
    expect(calio.limit).toBeNull();
});

test('defaults min to null', () => {
    expect(calio.min).toBeNull();
});

test('defaults max to null', () => {
    expect(calio.max).toBeNull();
});
