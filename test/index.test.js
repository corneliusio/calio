import CalioComponent from '../src/components/Calio.svlt';
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

