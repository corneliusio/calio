const config = require('./svelte.config');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const svelte = require('rollup-plugin-svelte');

module.exports = [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.js',
            format: 'esm'
        },
        plugins: [
            svelte(config),
            babel()
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.min.js',
            format: 'iife',
            name: 'Calio'
        },
        plugins: [
            svelte(config),
            babel(),
            uglify()
        ]
    }
];
