import Calio from './components/Calio.svlt';

export default class {
    constructor(el, data = {}) {
        const options = ['headers', 'mode', 'disabled', 'strict', 'value', 'limit', 'min', 'max'];
        const target = (typeof el === 'string')
            ? document.querySelector(el)
            : el;

        return new Calio({
            target,
            data: Object.keys(data)
                .filter(key => options.includes(key))
                .reduce((obj, key) => (obj[key] = data[key], obj), {})
        });
    }
}
