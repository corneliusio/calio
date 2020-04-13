import { promiseEvent, query } from '../helpers';
import Epoch from '../../src/modules/Epoch';
import Calio from '../../src/components/Calio.svelte';
import { render, fireEvent } from '@testing-library/svelte';

test('fires component selection and dom calio:selection events when a date is selected', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    const promise = Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('selection', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
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
        })
    ]);

    fireEvent.click(target.querySelector('.calio-day.is-today'));

    return promise;
});

test('fires component view and dom calio:view events when a new view is loaded', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    const promise = Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('view', event => {
                try {
                    expect(event.detail).toEqual(epoch.date(1));
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
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
        })
    ]);

    calio.component.goTo(epoch);

    return promise;
});

test('fires component view and dom calio:view events in single mode when a date is selected in a new month', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch(2019, 1);

    const promise = Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('view', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    return reject(e);
                }
            });
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
        })
    ]);

    calio.component.select(epoch);

    return promise;
});

test('fires component min and dom calio:min events when min is updated', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    const promise = Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('min', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
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
        })
    ]);

    calio.component.setMin(epoch);

    return promise;
});

test('fires component max and dom calio:max events when max is updated', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    const promise = Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('max', event => {
                try {
                    expect(event.detail).toEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
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
        })
    ]);

    calio.component.setMax(epoch);

    return promise;
});

test('fires component disabled and dom calio:disabled events when disabled is updated', () => {
    const target = document.createElement('div');
    const calio = render(Calio, { target });
    const epoch = new Epoch();

    const promise = Promise.all([
        promiseEvent((resolve, reject) => {
            calio.component.$on('disabled', event => {
                try {
                    expect(event.detail).toContainEqual(epoch);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
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
        })
    ]);

    calio.component.setDisabled(epoch);

    return promise;
});
