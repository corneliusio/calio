// import { queryAll, map } from '../helpers';
import Calio from '../../src/components/Calio.svelte';
import LilEpoch from '../../src/modules/LilEpoch';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

test('it fires a select event when a date is selected', async () => {
    const epoch = new LilEpoch();

    const calio1 = render(Calio, {
        props: { mode: 'single' }
    });

    const calio2 = render(Calio, {
        props: { mode: 'multi' }
    });

    await new Promise(resolve => {
        calio1.component.$on('selection', event => {
            expect(event.detail).toEqual(epoch);
            resolve();
        });

        calio1.component.select(epoch.clone());
    });

    await new Promise(resolve => {
        calio2.component.$on('selection', event => {
            expect(event.detail).toEqual([ epoch ]);
            resolve();
        });

        calio2.component.select(epoch.clone());
    });
});

test('it fires a view event when a new view is loaded', async () => {
    const epoch = new LilEpoch();
    const calio = render(Calio);

    await new Promise(resolve => {
        calio.component.$on('view', event => {
            expect(event.detail).toEqual(epoch.date(1));
            resolve();
        });

        calio.component.goTo(epoch);
    });
});

test('it fires a view event in single mode when a date is selected in a new month', async () => {
    const epoch = new LilEpoch();
    const calio = render(Calio);

    epoch.date(1).addYear();

    await new Promise(resolve => {
        calio.component.$on('view', event => {
            expect(event.detail).toEqual(epoch);
            resolve();
        });

        calio.component.select(epoch);
    });
});

