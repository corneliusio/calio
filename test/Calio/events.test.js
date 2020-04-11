import { query } from '../helpers';
import Epoch from '../../src/modules/Epoch';
import Calio from '../../src/components/Calio.svelte';
import { render, fireEvent, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

test('it fires a select event when a date is selected', () => {
    const epoch = new Epoch();
    const target = document.createElement('div');

    const calio = render(Calio, { target });

    calio.component.$on('selection', event => {
        expect(event.detail).toEqual(epoch);
    });

    fireEvent.click(target.querySelector('.is-today'));
});

test('it fires a view event when a new view is loaded', async () => {
    const epoch = new Epoch();
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
    const epoch = new Epoch();
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

