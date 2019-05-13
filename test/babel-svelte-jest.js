const jest = require('babel-preset-jest');
const svelte = require('svelte/compiler');
const { transformSync } = require('@babel/core');

module.exports = {
    process(src, filename) {
        if ((/\.svelte$/).test(filename)) {
            const component = svelte.compile(src, {
                filename,
                css: false
            });

            src = component.js.code;
        }

        const result = transformSync(src, {
            filename,
            presets: [ jest ]
        });

        return result ? result.code : src;
    }
};
