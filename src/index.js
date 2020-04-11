import Calio from './components/Calio.svelte';

export default class {
    constructor(el, props = {}) {
        const target = (typeof el === 'string')
            ? document.querySelector(el)
            : el;

        return new Calio({
            target, props
        });
    }
}
