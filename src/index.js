import Calio from './components/Calio.svlt';

export default class {
    constructor(el, data) {
        const target = (typeof el === 'string')
            ? document.querySelector(el)
            : el;

        return new Calio({
            target,
            data
        });
    }
}
