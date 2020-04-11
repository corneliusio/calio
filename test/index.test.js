import Calio from '../src';
import CalioPolyfilled from '../src/index.polyfilled';
import CalioComponent from '../src/components/Calio.svelte';

test('returns an instance of Calio (component)', () => {
    expect(new Calio(document.body) instanceof CalioComponent).toBe(true);
});

test('has a polyfilled version that returns an instance of Calio (component)', () => {
    expect(new CalioPolyfilled(document.body) instanceof CalioComponent).toBe(true);
});

test('can be passed a selector or dom node', () => {
    const calio1 = new Calio('body');
    const calio2 = new Calio(document.querySelector('body'));
    const el1 = calio1.$$.context.get('el');
    const el2 = calio2.$$.context.get('el');

    expect(el1).toBeTruthy();
    expect(el2).toBeTruthy();
    expect(el1).toEqual(el2);
});
