import { promiseEvent } from '../helpers';
import Epoch from '../../src/modules/Epoch';
import Calio from '../../src/components/Calio.svelte';
import { render, cleanup } from '@testing-library/svelte';

afterEach(() => cleanup());

test('fires component selection and dom calio:selection events when a date is selected', async () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    return await Promise.all([
        promiseEvent(done => {
            calio.component.$on('selection', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.select(epoch);
        }),
        promiseEvent(done => {
            target.addEventListener('calio:selection', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.select(epoch);
        })
    ]);
});

test('fires component view and dom calio:view events when a new view is loaded', async () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    return await Promise.all([
        promiseEvent(done => {
            calio.component.$on('view', event => {
                expect(event.detail).toEqual(epoch.date(1));
                done();
            });

            calio.component.goTo(epoch);
        }),
        promiseEvent(done => {
            target.addEventListener('calio:view', event => {
                expect(event.detail).toEqual(epoch.date(1));
                done();
            });

            calio.component.goTo(epoch);
        })
    ]);
});

test('fires component view and dom calio:view events in single mode when a date is selected in a new month', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    epoch.date(1).addYear();

    return Promise.all([
        promiseEvent(done => {
            calio.component.$on('view', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.select(epoch);
        }),
        promiseEvent(done => {
            target.addEventListener('calio:view', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.select(epoch);
        })
    ]);
});

test('fires component min and dom calio:min events when min is updated', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    return Promise.all([
        promiseEvent(done => {
            calio.component.$on('min', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.setMin(epoch);
        }),
        promiseEvent(done => {
            target.addEventListener('calio:min', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.setMin(epoch);
        })
    ]);
});

test('fires component max and dom calio:max events when max is updated', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    return Promise.all([
        promiseEvent(done => {
            calio.component.$on('max', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.setMax(epoch);
        }),
        promiseEvent(done => {
            target.addEventListener('calio:max', event => {
                expect(event.detail).toEqual(epoch);
                done();
            });

            calio.component.setMax(epoch);
        })
    ]);
});

test('fires component disabled and dom calio:disabled events when disabled is updated', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    return Promise.all([
        promiseEvent(done => {
            calio.component.$on('disabled', event => {
                expect(event.detail).toContainEqual(epoch);
                done();
            });

            calio.component.setDisabled(epoch);
        }),
        promiseEvent(done => {
            target.addEventListener('calio:disabled', event => {
                expect(event.detail).toContainEqual(epoch);
                done();
            });

            calio.component.setDisabled(epoch);
        })
    ]);
});
