import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('it can set a default selection from passed value', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {value: epoch}
    });

    expect(calio.get().selection).toEqual(epoch);
});

test('it can set a minimum selectable date', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {min: epoch}
    });

    expect(calio.get().min).toEqual(epoch);
});

test('it can set a maximum selectable date', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {max: epoch}
    });

    expect(calio.get().max).toEqual(epoch);
});

test('it delays dates being generated if non-array passed to disabled', () => {
    const toHaveGottenThisFar = true;

    new Calio({
        target: document.querySelector('#calio'),
        data: {disabled: null}
    });

    expect(toHaveGottenThisFar).toBe(true);
});
