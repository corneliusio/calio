import CalioComponent from '../src/components/Calio.svlt';
import LilEpoch from '../src/modules/LilEpoch';
import Calio from '../src';

document.body.innerHTML = '<div id="calio"></div>';

test('it returns an instance of Calio (component)', () => {
    expect(new Calio() instanceof CalioComponent).toBe(true);
});

test('can be passed a selector or dom node', () => {
    const calio1 = new Calio('#calio');
    const calio2 = new Calio(document.querySelector('#calio'));

    expect(calio1.options.target).toEqual(calio2.options.target);
});

test('filters out unwanted options from passed data', () => {
    const epoch = new LilEpoch();
    const calio = new Calio('#calio', {
        foo: 'bar',
        selection: 'Hello, world.',
        min: epoch
    });

    expect(calio.get().foo).toBeUndefined();
    expect(calio.get().selection).toBeNull();
    expect(calio.get().min).toEqual(epoch);
});

