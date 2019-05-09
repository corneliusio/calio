import Calio from './components/Calio.svelte';

export default class {
    constructor(el, data = {}) {
        const options = ['headers', 'mode', 'strict', 'disabled', 'value', 'limit', 'min', 'max'];
        const target = (typeof el === 'string')
            ? document.querySelector(el)
            : el;

        return new Calio({
            target,
            props: Object.keys(data)
                .filter(key => options.includes(key))
                .reduce((obj, key) => (obj[key] = data[key], obj), {})
        });
    }
}
