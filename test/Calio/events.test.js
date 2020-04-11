import { tick } from 'svelte';
import { promiseEvent } from '../helpers';
import Epoch from '../../src/modules/Epoch';
import Calio from '../../src/components/Calio.svelte';
import { render } from '@testing-library/svelte';

test('fires component selection and dom calio:selection events when a date is selected', async () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    await tick();

    return Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('selection', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.select(epoch);
        }),
        promiseEvent((resolve, reject) => {
            target.addEventListener('calio:selection', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.select(epoch);
        })
    ]);
});

test('fires component view and dom calio:view events when a new view is loaded', async () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    await tick();

    return Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('view', event => {
                try {
                    expect(event.detail).toEqual(epoch.date(1));
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.goTo(epoch);
        }),
        promiseEvent((resolve, reject) => {
            target.addEventListener('calio:view', event => {
                try {
                    expect(event.detail).toEqual(epoch.date(1));
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.goTo(epoch);
        })
    ]);
});

test('fires component view and dom calio:view events in single mode when a date is selected in a new month', async () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch(2019, 1);

    await tick();

    return Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('view', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    return reject(e);
                }
            });

            calio.component.select(epoch);
        }),
        promiseEvent((resolve, reject) => {
            target.addEventListener('calio:view', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    return reject(e);
                }
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
        promiseEvent((resolve, reject) => {
            calio.component.$on('min', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.setMin(epoch);
        }),
        promiseEvent((resolve, reject) => {
            target.addEventListener('calio:min', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
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
        promiseEvent((resolve, reject) => {
            calio.component.$on('max', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.setMax(epoch);
        }),
        promiseEvent((resolve, reject) => {
            target.addEventListener('calio:max', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
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
        promiseEvent((resolve, reject) => {
            calio.component.$on('disabled', event => {
                try {
                    expect(event.detail).toContainEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.setDisabled(epoch);
        }),
        promiseEvent((resolve, reject) => {
            target.addEventListener('calio:disabled', event => {
                try {
                    expect(event.detail).toContainEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            calio.component.setDisabled(epoch);
        })
    ]);
});
