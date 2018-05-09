import Calio from '../../src/components/Calio.svlt';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('it fires a select event when a date is selected', () => {
    const epoch = new LilEpoch();

    const calio1 = new Calio({
        target: document.querySelector('#calio'),
        data: {mode: 'single'}
    });

    const calio2 = new Calio({
        target: document.querySelector('#calio'),
        data: {mode: 'multi'}
    });

    calio1.on('select', selection => {
        expect(selection).toEqual(epoch);
    });

    calio2.on('select', selection => {
        expect(selection).toEqual([epoch]);
    });

    calio1.select(epoch.clone());
    calio2.select(epoch.clone());
});

test('it fires a view event when a new view is loaded', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    epoch.date(1);

    calio.on('view', view => {
        expect(view).toEqual(epoch);
    });

    calio.set({view: epoch});
});

test('it fires a view event in single mode when a date is selected in a new month', () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    epoch.date(1).addYear();

    calio.on('view', view => {
        expect(view).toEqual(epoch);
    });

    calio.select(epoch);
});

