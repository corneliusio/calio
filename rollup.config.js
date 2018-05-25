const config = require('./svelte.config');
const babel = require('rollup-plugin-babel');
const svelte = require('rollup-plugin-svelte');
const { terser } = require('rollup-plugin-terser');

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
            terser()
        ]
    }
];
