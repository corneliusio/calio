const fs = require('fs');
const { transform } = require('@babel/core');
const jest = require('babel-preset-jest');
const svelte = require('svelte/compiler');

module.exports = {
    process(src, filename) {
        if ((/\.svelte$/).test(filename)) {
            const result = svelte.compile(src, {
                filename,
                css: false
            });

            src = result.js.code;
        }

        const result = transform(src, {
            filename,
            presets: [jest]
        });

        return result ? result.code : src;
    }
};
