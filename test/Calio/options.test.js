import { tick } from 'svelte';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('can set a default selection from passed value', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { value: epoch }
    });

    expect(calio.$$.ctx.selection).toEqual(epoch);
});

test('prevents selection of dates before min', async () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { min: epoch }
    });

    calio.select(epoch.clone().subDay());
    await tick();

    expect(calio.$$.ctx.selection).toBeNull();
});

test('prevents selection of dates after max', async () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { max: epoch }
    });

    calio.select(epoch.clone().addDay());
    await tick();

    expect(calio.$$.ctx.selection).toBeNull();
});

test('prevents selection of disabled dates', async () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { disabled: epoch }
    });

    calio.select(epoch);
    await tick();

    expect(calio.$$.ctx.selection).toBeNull();
});

test('adds selected day to array in multi mode', async () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2016, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'multi' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);
    await tick();

    expect(calio.$$.ctx.selection).toContainEqual(epoch1);
    expect(calio.$$.ctx.selection).toContainEqual(epoch2);
    expect(calio.$$.ctx.selection).toContainEqual(epoch3);
});

test('toggles date selection if selected date is reselected in multi mode', async () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2018, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'multi' }
    });

    calio.select(epoch1);
    await tick();

    expect(calio.$$.ctx.selection).toHaveLength(1);
    expect(calio.$$.ctx.selection).toContainEqual(epoch1);

    calio.select(epoch2);
    await tick();

    expect(calio.$$.ctx.selection).toEqual([]);
});

test('can limit number of selected dates in multi mode', async () => {
    const epoch1 = new LilEpoch(2018, 0, 1);
    const epoch2 = new LilEpoch(2018, 0, 2);
    const epoch3 = new LilEpoch(2018, 0, 3);
    const epoch4 = new LilEpoch(2018, 0, 4);
    const epoch5 = new LilEpoch(2018, 0, 5);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: {
            mode: 'multi',
            limit: 3
        }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);
    calio.select(epoch4);
    calio.select(epoch5);

    await tick();

    expect(calio.$$.ctx.selection).toHaveLength(3);
    expect(calio.$$.ctx.selection).toContainEqual(epoch1);
    expect(calio.$$.ctx.selection).toContainEqual(epoch2);
    expect(calio.$$.ctx.selection).toContainEqual(epoch3);
});

test('adds selected day to array in range mode', async () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'range' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    await tick();

    expect(calio.$$.ctx.selection).toContainEqual(epoch1);
    expect(calio.$$.ctx.selection).toContainEqual(epoch2);
});

test('limits selection to two selected days in range mode', async () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2016, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'range' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);
    await tick();

    expect(calio.$$.ctx.selection).toHaveLength(1);
    expect(calio.$$.ctx.selection).toContainEqual(epoch3);
});

test('toggles date selection if selected date is reselected in range mode', async () => {
    const epoch1 = new LilEpoch(2018, 0);
    const epoch2 = new LilEpoch(2017, 0);
    const epoch3 = new LilEpoch(2017, 0);
    const calio = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'range' }
    });

    calio.select(epoch1);
    calio.select(epoch2);
    calio.select(epoch3);
    await tick();

    expect(calio.$$.ctx.selection).toHaveLength(1);
    expect(calio.$$.ctx.selection).toContainEqual(epoch1);
});

// test('prevents selection of date in strict range mode if range overlaps disabled date', async () => {
//     const epoch1 = new LilEpoch(2018, 0, 1);
//     const epoch2 = new LilEpoch(2018, 0, 20);
//     const epoch3 = new LilEpoch(2018, 0, 10);
//     const calio = new Calio({
//         target: document.querySelector('#calio'),
//         props: {
//             mode: 'range',
//             strict: true,
//             disabled: [
//                 epoch3
//             ]
//         }
//     });

//     calio.select(epoch1);
//     calio.select(epoch2);
//     await tick();

//     expect(calio.$$.ctx.selection).toHaveLength(1);
//     expect(calio.$$.ctx.selection).toContainEqual(epoch1);
// });

test('delays dates being generated if non-array passed to disabled', () => {
    const toHaveGottenThisFar = true;

    new Calio({
        target: document.querySelector('#calio'),
        props: { disabled: null }
    });

    expect(toHaveGottenThisFar).toBe(true);
});
