import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('can set a default selection from passed value', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { value: epoch }
    });

    expect(calio.get().selection).toEqual(epoch);
});

test('prevents selection of dates before min', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { min: epoch }
    });

    calio.select(epoch.clone().subDay());

    expect(calio.get().selection).toBeNull();
});

test('prevents selection of dates after max', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { max: epoch }
    });

    calio.select(epoch.clone().addDay());

    expect(calio.get().selection).toBeNull();
});

test('prevents selection of disabled dates', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { disabled: epoch }
    });

    calio.select(epoch);

    expect(calio.get().selection).toBeNull();
});

test('adds selected day to array in multi mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2016, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { mode: 'multi' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);

    expect(calio.get().selection).toContainEqual(epoch1);
    expect(calio.get().selection).toContainEqual(epoch2);
    expect(calio.get().selection).toContainEqual(epoch3);
});

test('toggles date selection if selected date is reselected in multi mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2018, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { mode: 'multi' }
    });

    calio.select(epoch1);

    expect(calio.get().selection).toHaveLength(1);
    expect(calio.get().selection).toContainEqual(epoch1);

    calio.select(epoch2);

    expect(calio.get().selection).toEqual([]);
});

test('can limit number of selected dates in multi mode', () => {
    const epoch1 = new LilEpoch(2018, 0, 1);
    const epoch2 = new LilEpoch(2018, 0, 2);
    const epoch3 = new LilEpoch(2018, 0, 3);
    const epoch4 = new LilEpoch(2018, 0, 4);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            mode: 'multi',
            limit: 3
        }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);
    calio.select(epoch4);

    expect(calio.get().selection).toHaveLength(3);
    expect(calio.get().selection).toContainEqual(epoch1);
    expect(calio.get().selection).toContainEqual(epoch2);
    expect(calio.get().selection).toContainEqual(epoch3);
});

test('adds selected day to array in range mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { mode: 'range' }
    });

    calio.select(epoch1);
    calio.select(epoch2);

    expect(calio.get().selection).toContainEqual(epoch1);
    expect(calio.get().selection).toContainEqual(epoch2);
});

test('limits selection to two selected days in range mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2016, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { mode: 'range' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);

    expect(calio.get().selection).toHaveLength(1);
    expect(calio.get().selection).toContainEqual(epoch3);
});

test('toggles date selection if selected date is reselected in range mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2017, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: { mode: 'range' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);

    expect(calio.get().selection).toHaveLength(1);
    expect(calio.get().selection).toContainEqual(epoch1);
});

test('prevents selection of date in strict range mode if range overlaps disabled date', () => {
    const epoch1 = new LilEpoch(2018, 0, 1);
    const epoch2 = new LilEpoch(2018, 0, 20);
    const epoch3 = new LilEpoch(2018, 0, 10);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {
            mode: 'range',
            strict: true,
            disabled: [
                epoch3
            ]
        }
    });

    calio.select(epoch1);
    calio.select(epoch2);

    expect(calio.get().selection).toHaveLength(1);
    expect(calio.get().selection).toContainEqual(epoch1);
});

test('delays dates being generated if non-array passed to disabled', () => {
    const toHaveGottenThisFar = true;

    new Calio({
        target: document.querySelector('#calio'),
        data: { disabled: null }
    });

    expect(toHaveGottenThisFar).toBe(true);
});
