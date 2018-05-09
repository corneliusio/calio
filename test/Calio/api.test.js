import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('updates selection when value is updated', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {value: epoch.clone().addYear()}
    });

    calio.set({value: epoch});

    expect(calio.get().selection).toEqual(epoch);
});

test('normalizes a date', () => {
    const epoch = new LilEpoch(2018, 0, 1);
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    let date1 = calio.makeMyDay(epoch),
        date2 = calio.makeMyDay([2018, 0, 1]),
        date3 = calio.makeMyDay('2018-01-01'),
        date4 = calio.makeMyDay();

    expect(date1).toEqual(epoch);
    expect(date2).toEqual(epoch);
    expect(date3).toEqual(epoch);
    expect(date4).toBeNull();
});

test('selects a day', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    calio.select(epoch);

    expect(calio.get().selection).toEqual(epoch);
});

test('adds selected day to array in multi mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2016, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {mode: 'multi'}
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);

    expect(calio.get().selection).toContainEqual(epoch1);
    expect(calio.get().selection).toContainEqual(epoch2);
    expect(calio.get().selection).toContainEqual(epoch3);
});

test('adds selected day to array in range mode', () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        data: {mode: 'range'}
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
        data: {mode: 'range'}
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);

    expect(calio.get().selection).toHaveLength(1);
    expect(calio.get().selection).toContainEqual(epoch3);
});
