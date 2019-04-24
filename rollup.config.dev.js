const config = require('./svelte.config');
const svelte = require('rollup-plugin-svelte');
const common = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

module.exports = [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.js',
            format: 'esm'
        },
        plugins: [
            resolve(),
            common(),
            svelte(config)
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/calio.min.js',
            format: 'iife',
            name: 'Calio',
            sourcemap: true
        },
        plugins: [
            resolve(),
            common(),
            svelte(config)
        ]
    }
];
