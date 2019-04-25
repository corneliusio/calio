import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';

document.body.innerHTML = '<div id="calio"></div>';

test('it fires a select event when a date is selected', async () => {
    const epoch = new LilEpoch();

    const calio1 = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'single' }
    });

    const calio2 = new Calio({
        target: document.querySelector('#calio'),
        props: { mode: 'multi' }
    });

    await new Promise(resolve => {
        calio1.$on('selection', event => {
            expect(event.detail).toEqual(epoch);
            resolve();
        });

        calio1.select(epoch.clone());
    });

    await new Promise(resolve => {
        calio2.$on('selection', event => {
            expect(event.detail).toEqual([epoch]);
            resolve();
        });

        calio2.select(epoch.clone());
    });
});

test('it fires a view event when a new view is loaded', async () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    await new Promise(resolve => {
        calio.$on('view', event => {
            expect(event.detail).toEqual(epoch.date(1));
            resolve();
        });

        calio.goTo(epoch);
    });
});

test('it fires a view event in single mode when a date is selected in a new month', async () => {
    const epoch = new LilEpoch();
    const calio = new Calio({
        target: document.querySelector('#calio')
    });

    epoch.date(1).addYear();

    await new Promise(resolve => {
        calio.$on('view', event => {
            expect(event.detail).toEqual(epoch);
            resolve();
        });

        calio.select(epoch);
    });
});

