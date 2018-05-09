const svelte = require('svelte');

exports.process = function(src, filename) {
    const result = svelte.compile(src, {
        filename,
        css: false,
        format: 'cjs'
    });

    return result.js;
};
