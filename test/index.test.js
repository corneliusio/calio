import CalioComponent from '../src/components/Calio.svelte';
import LilEpoch from '../src/modules/LilEpoch';
import Calio from '../src';

document.body.innerHTML = '<div id="calio"></div>';

test('it returns an instance of Calio (component)', () => {
    expect(new Calio() instanceof CalioComponent).toBe(true);
});

test('can be passed a selector or dom node', () => {
    const calio1 = new Calio('#calio');
    const calio2 = new Calio(document.querySelector('#calio'));
    const { el: el1 } = calio1.state();
    const { el: el2 } = calio2.state();

    expect(el1).toBeTruthy();
    expect(el2).toBeTruthy();
    expect(el1).toEqual(el2);
});

test('filters out unwanted options from passed data', () => {
    const epoch = new LilEpoch();
    const calio = new Calio('#calio', { foo: 'bar', min: epoch });
    const { foo, min } = calio.state();

    expect(foo).toBeUndefined();
    expect(min).toEqual(epoch);
});

