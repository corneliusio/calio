export function query(selector) {
    return document.querySelector(selector);
}

export function queryAll(selector) {
    return document.querySelectorAll(selector);
}

export function map(arrayLike, handler) {
    return Array.prototype.map.call(arrayLike, handler);
}

export function context(rendered, key) {
    return rendered.component.$$.context.get(key);
}
